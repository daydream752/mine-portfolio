import Link from "next/link";
import { AFooter } from "./a-footer";
import styles from "./page.module.css";

type Lang = "kor" | "eng";

type Props = {
  searchParams: Promise<{ lang?: string }>;
};

const t = {
  kor: {
    about: "ABOUT US",
    core: "CORE COMPETENCE",
    business: "BUSINESS AREA",
    story: "OUR STORY",
    recruit: "RECRUIT",
    ir: "IR",
    status: "현황",
    vision: "비전",
    history: "연혁",
    cert: "인증",
    location: "찾아오시는 길",
    ci: "CI",
    dev: "개발능력",
    prod: "생산능력",
    certCap: "인증능력",
    test: "시험평가능력",
    csr: "CSR",
    notice: "공지사항",
    magazine: "사보",
    talent: "인재상",
    hiring: "인재 채용",
    disclosure: "공시정보",
    irRoom: "IR자료실",
    heroTitle: "Engineering Better Structure",
    back: "메인으로 돌아가기",
    aboutTitle: "About Us",
    aboutText:
      "Dream Company는 구조 설계와 제품 개발을 전문으로 하는 가상의 기업입니다. 항공, 산업, 모빌리티 영역에서 설계-개발-검증까지 수행합니다.",
    aircraftText: "경량화와 내구성을 동시에 만족하는 구조 설계.",
    mroText: "정비, 보수, 오버홀 기반의 운영 신뢰성 향상.",
    cabinText: "승객 경험 중심의 객실 솔루션 개발.",
    spaceText: "우주 환경에 대응하는 구조/시험 역량.",
  },
  eng: {
    about: "ABOUT US",
    core: "CORE COMPETENCE",
    business: "BUSINESS AREA",
    story: "OUR STORY",
    recruit: "RECRUIT",
    ir: "IR",
    status: "Status",
    vision: "Vision",
    history: "History",
    cert: "Certification",
    location: "Location",
    ci: "CI",
    dev: "Development Capability",
    prod: "Production Capability",
    certCap: "Certification Capability",
    test: "Test & Evaluation",
    csr: "CSR",
    notice: "Notice",
    magazine: "Magazine",
    talent: "Talent",
    hiring: "Recruitment",
    disclosure: "Disclosure",
    irRoom: "IR Room",
    heroTitle: "Engineering Better Structure",
    back: "Back to Main",
    aboutTitle: "About Us",
    aboutText:
      "Dream Company is a fictional enterprise specializing in structural design and product development across aerospace, industry, and mobility.",
    aircraftText:
      "Structural design focused on both lightweight optimization and durability.",
    mroText:
      "Operational reliability support through maintenance, repair, and overhaul.",
    cabinText:
      "Cabin solution development centered on passenger experience.",
    spaceText:
      "Structure and test capability designed for space-grade environments.",
  },
};

export default async function APage({ searchParams }: Props) {
  const params = await searchParams;
  const lang: Lang = params.lang === "eng" ? "eng" : "kor";
  const tx = t[lang];

  const withLang = (path: string) => `${path}?lang=${lang}`;

  return (
    <main className={styles.page}>
      <div className={styles.contentWrap}>
      <header className={styles.topbar}>
        <div className={styles.topInner}>
          <strong className={styles.brand}>
            <span className={styles.brandAccent}>Dream</span> Company
          </strong>
          <nav className={styles.menu}>
            <div className={styles.menuItem}>
              <a href="#about">{tx.about}</a>
              <div className={styles.dropdownMenu}>
                <Link href={withLang("/a/sub/status")}>{tx.status}</Link>
                <Link href={withLang("/a/sub/vision")}>{tx.vision}</Link>
                <Link href={withLang("/a/sub/history")}>{tx.history}</Link>
                <Link href={withLang("/a/sub/certification")}>{tx.cert}</Link>
                <Link href={withLang("/a/sub/location")}>{tx.location}</Link>
                <Link href={withLang("/a/sub/ci")}>{tx.ci}</Link>
              </div>
            </div>
            <div className={styles.menuItem}>
              <a href="#core">{tx.core}</a>
              <div className={styles.dropdownMenu}>
                <Link href={withLang("/a/sub/dev-capability")}>{tx.dev}</Link>
                <Link href={withLang("/a/sub/prod-capability")}>{tx.prod}</Link>
                <Link href={withLang("/a/sub/cert-capability")}>{tx.certCap}</Link>
                <Link href={withLang("/a/sub/test-capability")}>{tx.test}</Link>
              </div>
            </div>
            <div className={styles.menuItem}>
              <a href="#business">{tx.business}</a>
              <div className={styles.dropdownMenu}>
                <Link href={withLang("/a/sub/aircraft-structure")}>AIRCRAFT STRUCTURE</Link>
                <Link href={withLang("/a/sub/mro")}>MRO</Link>
                <Link href={withLang("/a/sub/cabin-solution")}>CABIN SOLUTION</Link>
                <Link href={withLang("/a/sub/space")}>SPACE</Link>
              </div>
            </div>
            <div className={styles.menuItem}>
              <a href="#story">{tx.story}</a>
              <div className={styles.dropdownMenu}>
                <Link href={withLang("/a/sub/csr")}>{tx.csr}</Link>
                <Link href={withLang("/a/sub/notice")}>{tx.notice}</Link>
                <Link href={withLang("/a/sub/magazine")}>{tx.magazine}</Link>
              </div>
            </div>
            <div className={styles.menuItem}>
              <a href="#recruit">{tx.recruit}</a>
              <div className={styles.dropdownMenu}>
                <Link href={withLang("/a/sub/talent")}>{tx.talent}</Link>
                <Link href={withLang("/a/sub/recruit")}>{tx.hiring}</Link>
              </div>
            </div>
            <div className={styles.menuItem}>
              <a href="#ir">{tx.ir}</a>
              <div className={styles.dropdownMenu}>
                <Link href={withLang("/a/sub/disclosure")}>{tx.disclosure}</Link>
                <Link href={withLang("/a/sub/ir-room")}>{tx.irRoom}</Link>
              </div>
            </div>
          </nav>
          <div className={styles.langGroup}>
            <Link href="/a?lang=kor" className={`${styles.langBtn} ${lang === "kor" ? styles.langBtnActive : ""}`}>
              KOR
            </Link>
            <Link href="/a?lang=eng" className={`${styles.langBtn} ${lang === "eng" ? styles.langBtnActive : ""}`}>
              ENG
            </Link>
          </div>
        </div>
      </header>

      <section className={styles.heroVisual}>
        <div className={styles.heroCopy}>
          <p>DREAM COMPANY</p>
          <h1>{tx.heroTitle}</h1>
        </div>
      </section>

      <div className={styles.container}>
        <section id="about" className={styles.infoSection}>
          <h2>{tx.aboutTitle}</h2>
          <p>{tx.aboutText}</p>
        </section>
        <section id="business" className={styles.infoGrid}>
          <div>
            <h3>Aircraft Structure</h3>
            <p>{tx.aircraftText}</p>
          </div>
          <div>
            <h3>MRO</h3>
            <p>{tx.mroText}</p>
          </div>
          <div>
            <h3>Cabin Interior</h3>
            <p>{tx.cabinText}</p>
          </div>
          <div>
            <h3>Space</h3>
            <p>{tx.spaceText}</p>
          </div>
        </section>

        <p className={styles.back}>
          <Link href="/">{tx.back}</Link>
        </p>
      </div>
      </div>

      <AFooter lang={lang} />
    </main>
  );
}
