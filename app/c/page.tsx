import Link from "next/link";
import { getCConfig } from "@/lib/c-config";
import styles from "./page.module.css";

/** 데모/관리용 좌석 그리드. 실제 고객은 QR로 `/c/[seat]/menu`에 곧바로 들어오므로 이 화면은 쓰이지 않는다. */
export default async function CPage() {
  const config = await getCConfig();
  const seats = Array.from({ length: config.seatCount }, (_, i) => i + 1);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>테이블 구매</h1>
            <p className={styles.subtitle}>원하는 좌석을 선택하세요.</p>
          </div>
          <div className={styles.headerLinks}>
            <Link href="/c/admin/orders" className={styles.backLink}>
              주문 내역
            </Link>
            <Link href="/c/admin" className={styles.backLink}>
              좌석·메뉴 관리
            </Link>
            <Link href="/" className={styles.backLink}>
              메인으로
            </Link>
          </div>
        </header>

        <h2 className={styles.seatHeading}>
          좌석 선택 <span className={styles.seatHeadingNote}>(실제 고객 페이지에서는 제공되지 않음)</span>
        </h2>

        <ul className={styles.seatGrid} aria-label="좌석 목록">
          {seats.map((n) => (
            <li key={n}>
              <Link href={`/c/${n}/menu`} className={`${styles.seatCard} ${styles.seatCardLink}`}>
                <span className={styles.seatLabel}>좌석</span>
                <span className={styles.seatNumber}>{n}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
