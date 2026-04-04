import Link from "next/link";
import { notFound } from "next/navigation";
import { getCConfig, parseMenuOrderFromQuery } from "@/lib/c-config";
import { parseSeatParam } from "../../seats";
import { PaymentClient } from "./payment-client";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ seat: string }>;
  searchParams: Promise<{ items?: string }>;
};

export default async function CPaymentPage({ params, searchParams }: Props) {
  const { seat } = await params;
  const sp = await searchParams;
  const config = await getCConfig();
  const seatNum = parseSeatParam(seat, config.seatCount);
  if (seatNum === null) notFound();

  const lineItems = parseMenuOrderFromQuery(sp.items, config.menuItems);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.seatBadge}>좌석 {seatNum}</p>
            <h1 className={styles.title}>결제</h1>
            <p className={styles.subtitle}>주문 내용을 확인한 뒤 결제를 진행하세요.</p>
          </div>
          <Link href={`/c/${seatNum}/menu`} className={styles.backLink}>
            메뉴로
          </Link>
        </header>

        {lineItems.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>선택한 메뉴가 없습니다. 메뉴를 먼저 담아 주세요.</p>
            <Link href={`/c/${seatNum}/menu`} className={styles.primaryLink}>
              메뉴 선택으로 이동
            </Link>
          </div>
        ) : (
          <PaymentClient seat={seatNum} lineItems={lineItems} />
        )}
      </div>
    </main>
  );
}
