import Link from "next/link";
import styles from "./a-footer.module.css";

const copy = {
  kor: {
    terms: "이용약관",
    privacy: "개인정보처리방침",
    email: "이메일 무단수집거부",
    trade: "상호",
    ceo: "대표",
    addr: "주소",
    tel: "전화",
    biz: "사업자등록번호",
    addrVal: "OOO도 OO시 OO동 OO로 OOO",
  },
  eng: {
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    email: "Email Policy",
    trade: "Company",
    ceo: "CEO",
    addr: "Address",
    tel: "Phone",
    biz: "Business Reg. No.",
    addrVal: "100 Industrial-ro, Gajwa-dong, Jinju, Gyeongsangnam-do",
  },
} as const;

type Props = {
  lang: "kor" | "eng";
};

export function AFooter({ lang }: Props) {
  const t = copy[lang];
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <nav className={styles.nav} aria-label={lang === "kor" ? "정책 링크" : "Policy links"}>
          <Link href="#">{t.terms}</Link>
          <span className={styles.bar}>|</span>
          <Link href="#" className={styles.emphasis}>
            {t.privacy}
          </Link>
          <span className={styles.bar}>|</span>
          <Link href="#">{t.email}</Link>
        </nav>

        <div className={styles.info}>
          <p>
            {t.trade}: Dream Company · {t.ceo}: {lang === "kor" ? "정지아" : "Ji-ah Jeong"}
          </p>
          <p>
            {t.addr}: {t.addrVal}
          </p>
          <p>
            {t.tel}: 055-123-4567 · {t.biz}: 606-12-34567
          </p>
        </div>

        <p className={styles.copy}>© Dream Company. All rights reserved.</p>
      </div>
    </footer>
  );
}
