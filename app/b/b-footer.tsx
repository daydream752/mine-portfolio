"use client";

import Link from "next/link";
import styles from "./b-footer.module.css";

export function BFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.row}>
          <nav className={styles.links} aria-label="쇼핑몰 안내">
            <Link href="#">회사소개</Link>
            <span className={styles.dot} aria-hidden />
            <Link href="#">이용약관</Link>
            <span className={styles.dot} aria-hidden />
            <Link href="#" className={styles.strong}>
              개인정보처리방침
            </Link>
            <span className={styles.dot} aria-hidden />
            <Link href="#">고객센터</Link>
            <span className={styles.dot} aria-hidden />
            <Link href="#">배송·교환 안내</Link>
          </nav>
        </div>

        <div className={styles.grid}>
          <div>
            <h3 className={styles.blockTitle}>고객센터</h3>
            <p className={styles.phone}>1588-0000</p>
            <p className={styles.hours}>평일 09:00 – 18:00 · 점심 12:00 – 13:00</p>
          </div>
          <div>
            <h3 className={styles.blockTitle}>입금 계좌 (데모)</h3>
            <p className={styles.muted}>국민은행 123-456-789012 · 예금주 Dream Closet</p>
          </div>
        </div>

        <div className={styles.company}>
          <p>
            <strong>Dream Closet</strong> · 대표: 김드림 · 사업자등록번호 123-45-67890 · 통신판매업 신고 제2026-경남진주-0000호
          </p>
          <p>주소: 부산광역시 해운대구 샘플로 10 (데모 주소)</p>
          <p>개인정보보호책임자: shop@dreamcloset.demo (데모)</p>
        </div>

        <p className={styles.copy}>© Dream Closet. All rights reserved.</p>
      </div>
    </footer>
  );
}
