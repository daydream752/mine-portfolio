import Link from "next/link";
import { notFound } from "next/navigation";
import { getCConfig } from "@/lib/c-config";
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

export default async function CPaymentFailPage({ params, searchParams }: Props) {
  const { seat: seatParam } = await params;
  const sp = await searchParams;
  const config = await getCConfig();
  const seatNum = parseSeatParam(seatParam, config.seatCount);
  if (seatNum === null) notFound();

  const code = pickString(sp.code);
  const message = pickString(sp.message);
  const itemsRaw = pickString(sp.items);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.failBox}>
          <p className={styles.failBadge}>결제 실패</p>
          <h2 className={styles.failTitle}>결제가 완료되지 않았습니다</h2>
          {code ? (
            <p className={styles.failCode}>
              코드: {code}
              {message ? ` · ${message}` : ""}
            </p>
          ) : (
            <p className={styles.failCode}>창을 닫았거나 결제가 중단되었을 수 있습니다.</p>
          )}
          <div className={styles.failActions}>
            <Link
              href={`/c/${seatNum}/payment${itemsRaw ? `?items=${encodeURIComponent(itemsRaw)}` : ""}`}
              className={styles.primaryLink}
            >
              다시 결제하기
            </Link>
            <Link href="/c" className={styles.backLink}>
              좌석 선택으로
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
