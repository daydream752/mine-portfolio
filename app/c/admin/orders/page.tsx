import Link from "next/link";
import { OrdersClient } from "./orders-client";
import styles from "../page.module.css";

export default function CAdminOrdersPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>주문 내역</h1>
            <p className={styles.subtitle}>결제가 완료된 주문이 여기에 쌓입니다. 조리·서빙 후 완료 처리하세요.</p>
          </div>
          <div className={styles.headerLinks}>
            <Link href="/c/admin" className={styles.backLink}>
              메뉴·좌석 설정
            </Link>
            <Link href="/c" className={styles.backLink}>
              테이블 구매로
            </Link>
            <Link href="/" className={styles.backLink}>
              메인으로
            </Link>
          </div>
        </header>
        <OrdersClient />
      </div>
    </main>
  );
}
