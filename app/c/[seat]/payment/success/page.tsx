import Link from "next/link";
import { notFound } from "next/navigation";
import { getCConfig, parseMenuOrderFromQuery } from "@/lib/c-config";
import { recordOrderIfNew } from "@/lib/c-orders";
import { confirmTossPayment, getTossPayment } from "@/lib/toss-server";
import { parseSeatParam } from "../../../seats";
import styles from "../page.module.css";

type Props = {
  params: Promise<{ seat: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function pickString(v: string | string[] | undefined): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return "";
}

export default async function CPaymentSuccessPage({ params, searchParams }: Props) {
  const { seat: seatParam } = await params;
  const sp = await searchParams;
  const config = await getCConfig();
  const seatNum = parseSeatParam(seatParam, config.seatCount);
  if (seatNum === null) notFound();

  const paymentKey = pickString(sp.paymentKey);
  const orderId = pickString(sp.orderId);
  const amountRaw = pickString(sp.amount);
  const amount = Number.parseInt(amountRaw, 10);

  const itemsRaw = pickString(sp.items);
  const lineItems = parseMenuOrderFromQuery(itemsRaw, config.menuItems);
  const expectedTotal = lineItems.reduce((s, i) => s + i.price * i.quantity, 0);

  if (!paymentKey || !orderId || !Number.isFinite(amount)) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <p className={styles.emptyText}>결제 정보가 올바르지 않습니다.</p>
            <Link href={`/c/${seatNum}/payment?items=${encodeURIComponent(itemsRaw)}`} className={styles.primaryLink}>
              결제 페이지로
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (expectedTotal !== amount) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <p className={styles.emptyText}>주문 금액과 결제 금액이 일치하지 않습니다. 다시 시도해 주세요.</p>
            <Link href={`/c/${seatNum}/payment?items=${encodeURIComponent(itemsRaw)}`} className={styles.primaryLink}>
              결제 페이지로
            </Link>
          </div>
        </div>
      </main>
    );
  }

  let payment: Record<string, unknown>;

  const confirmed = await confirmTossPayment({ paymentKey, orderId, amount });
  if (confirmed.ok) {
    payment = confirmed.payment;
  } else {
    const fetched = await getTossPayment(paymentKey);
    const st =
      fetched.ok && typeof fetched.payment.status === "string" ? fetched.payment.status : undefined;
    if (fetched.ok && st === "DONE") {
      payment = fetched.payment;
    } else {
      return (
        <main className={styles.page}>
          <div className={styles.container}>
            <div className={styles.empty}>
              <p className={styles.emptyText}>
                결제 승인에 실패했습니다.
                {confirmed.message ? ` (${confirmed.message})` : ""}
              </p>
              <Link href={`/c/${seatNum}/payment?items=${encodeURIComponent(itemsRaw)}`} className={styles.primaryLink}>
                결제 페이지로
              </Link>
            </div>
          </div>
        </main>
      );
    }
  }

  const method = typeof payment.method === "string" ? payment.method : "—";
  const approved = typeof payment.approvedAt === "string" ? payment.approvedAt : null;

  const summary = lineItems.map((i) => `${i.name}×${i.quantity}`).join(", ");
  try {
    await recordOrderIfNew({
      paymentKey,
      tossOrderId: orderId,
      seat: seatNum,
      itemsRaw,
      summary,
      amount,
      method,
      approvedAt: approved,
    });
  } catch {
    /* 저장 실패해도 결제 완료 화면은 유지 */
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.success}>
          <p className={styles.successBadge}>결제 완료</p>
          <h2 className={styles.successTitle}>주문이 접수되었습니다</h2>
          <p className={styles.successDesc}>
            좌석 {seatNum}번 · {amount.toLocaleString("ko-KR")}원 · 결제수단: {method}
            {approved ? ` · 승인: ${approved}` : ""}
          </p>
          <p className={styles.successMeta}>
            실제 과금·환불은 토스페이먼츠 계약 및 결제수단에 따릅니다. 라이브 키 사용 시 실제 결제가 이루어집니다.
          </p>
          <Link href="/c" className={styles.primaryLink}>
            처음으로
          </Link>
        </div>
      </div>
    </main>
  );
}
