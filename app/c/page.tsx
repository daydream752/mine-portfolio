import Link from "next/link";
import styles from "./page.module.css";

export default function CPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>C 서브 페이지</h1>
          <p>여기는 C 페이지입니다.</p>
          <Link href="/" className={styles.link}>
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
