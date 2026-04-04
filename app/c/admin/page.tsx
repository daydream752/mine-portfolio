import Link from "next/link";
import { AdminClient } from "./admin-client";
import styles from "./page.module.css";

export default function CAdminPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>C 구역 설정</h1>
            <p className={styles.subtitle}>좌석 개수와 메뉴 목록을 변경할 수 있습니다.</p>
          </div>
          <div className={styles.headerLinks}>
            <Link href="/c" className={styles.backLink}>
              테이블 구매로
            </Link>
            <Link href="/" className={styles.backLink}>
              메인으로
            </Link>
          </div>
        </header>
        <AdminClient />
      </div>
    </main>
  );
}
