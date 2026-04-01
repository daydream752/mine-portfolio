import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>메인 페이지</h1>
        <p className={styles.desc}>A, B 카드를 눌러 각 서브 페이지로 이동하세요.</p>
        <div className={styles.list}>
          <Link href="/a" className={styles.cardLink}>
            A : 회사 홈페이지
          </Link>
          <Link href="/b" className={styles.cardLink}>
            B : 쇼핑 사이트트
          </Link>
        </div>
      </div>
    </main>
  );
}
