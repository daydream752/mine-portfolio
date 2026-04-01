import Link from "next/link";
import { notFound } from "next/navigation";

type PageData = {
  title: string;
  summary: string;
  bullets: string[];
};

const pagesKor: Record<string, PageData> = {
  status: { title: "현황", summary: "Dream Company의 현재 조직/사업 운영 현황입니다.", bullets: ["임직원 120명", "국내 2개 사업장 운영", "항공/산업 구조 분야 프로젝트 진행 중"] },
  vision: { title: "비전", summary: "지속 가능한 구조 혁신을 통해 산업의 기준을 높이는 것이 목표입니다.", bullets: ["신뢰 기반 파트너십", "기술 고도화", "글로벌 확장"] },
  history: { title: "연혁", summary: "회사 설립 이후 주요 이정표를 간략히 소개합니다.", bullets: ["2016 법인 설립", "2020 신규 생산라인 구축", "2024 해외 협력 프로젝트 개시"] },
  certification: { title: "인증", summary: "품질과 안전을 위한 핵심 인증 체계를 보유하고 있습니다.", bullets: ["ISO 9001", "AS9100", "사내 품질검증 프로세스 운영"] },
  location: { title: "찾아오시는 길", summary: "본사 및 주요 사업장 위치 정보입니다.", bullets: ["본사: 서울시 가상구 드림로 100", "R&D 센터: 경기도 가상시 테크밸리", "대표번호: 02-1234-5678"] },
  ci: { title: "CI", summary: "Dream Company의 브랜드 아이덴티티 원칙입니다.", bullets: ["Primary Color: Red / Black", "로고 최소 여백 규정", "국문/영문 로고 조합 가이드"] },
  "dev-capability": { title: "개발능력", summary: "구조 설계부터 시제품 개발까지 자체 대응 가능한 역량을 보유합니다.", bullets: ["요구사항 분석", "구조 설계/해석", "시제품 제작 및 검증"] },
  "prod-capability": { title: "생산능력", summary: "품질 기준을 만족하는 생산 체계를 운영합니다.", bullets: ["소량 다품종 생산 대응", "납기 기반 공정 관리", "품질 검사 자동화"] },
  "cert-capability": { title: "인증능력", summary: "제품 및 공정 인증 대응 조직을 운영하고 있습니다.", bullets: ["규격 문서화", "시험 데이터 관리", "감사 대응 프로세스"] },
  "test-capability": { title: "시험평가능력", summary: "설계 검증을 위한 시험 및 평가 역량을 제공합니다.", bullets: ["강도/내구 시험", "환경 시험", "평가 리포트 제공"] },
  "aircraft-structure": { title: "AIRCRAFT STRUCTURE", summary: "항공기 구조물 설계 및 제작 기술을 제공합니다.", bullets: ["경량화 설계", "내구성 검증", "고객 맞춤 구조 솔루션"] },
  mro: { title: "MRO", summary: "정비, 보수, 오버홀 서비스를 통해 운영 안정성을 지원합니다.", bullets: ["정기 점검", "성능 복원", "예방 정비 컨설팅"] },
  "cabin-solution": { title: "CABIN SOLUTION", summary: "객실 구조와 인테리어 개선을 위한 솔루션입니다.", bullets: ["사용자 경험 중심 설계", "경량 소재 적용", "맞춤형 레이아웃"] },
  space: { title: "SPACE", summary: "우주 환경 대응 구조 및 부품 개발 영역입니다.", bullets: ["고신뢰 구조 설계", "환경 내성 테스트", "프로토타입 제작"] },
  csr: { title: "CSR", summary: "지역사회와 함께 성장하기 위한 사회공헌 활동을 진행합니다.", bullets: ["기부 캠페인", "교육 프로그램 지원", "임직원 봉사활동"] },
  notice: { title: "공지사항", summary: "주요 공지와 회사 소식을 안내합니다.", bullets: ["정기 주주총회 안내", "채용 공지", "사내외 이벤트 소식"] },
  magazine: { title: "사보", summary: "사내 문화 및 프로젝트 소식을 담은 콘텐츠입니다.", bullets: ["분기별 뉴스레터", "프로젝트 인터뷰", "조직문화 아티클"] },
  talent: { title: "인재상", summary: "Dream Company가 추구하는 인재 가치를 소개합니다.", bullets: ["주도성", "협업", "문제 해결력"] },
  recruit: { title: "인재 채용", summary: "현재 채용 중인 직무와 지원 절차를 안내합니다.", bullets: ["서류 전형", "기술/실무 인터뷰", "최종 합류 안내"] },
  disclosure: { title: "공시정보", summary: "주요 경영 정보와 공시 내용을 제공합니다.", bullets: ["정기 공시", "주요 의사결정 공지", "투자자 안내 자료"] },
  "ir-room": { title: "IR자료실", summary: "투자자 대상 회사 소개 자료를 제공합니다.", bullets: ["기업 개요", "재무 개요", "중장기 전략"] },
};

const pagesEng: Record<string, PageData> = {
  status: { title: "Status", summary: "Current organizational and business status of Dream Company.", bullets: ["120 employees", "2 domestic sites in operation", "Ongoing aerospace and industrial structure projects"] },
  vision: { title: "Vision", summary: "Our goal is to raise industry standards through sustainable structural innovation.", bullets: ["Trust-based partnership", "Technology advancement", "Global expansion"] },
  history: { title: "History", summary: "Major milestones since the company was founded.", bullets: ["2016 Corporate establishment", "2020 New production line launched", "2024 Global partnership projects started"] },
  certification: { title: "Certification", summary: "We maintain key certification systems for quality and safety.", bullets: ["ISO 9001", "AS9100", "Internal quality validation process"] },
  location: { title: "Location", summary: "Office and site location information.", bullets: ["HQ: 100 Dream-ro, Virtual-gu, Seoul", "R&D Center: Tech Valley, Virtual-si, Gyeonggi", "Tel: +82-2-1234-5678"] },
  ci: { title: "CI", summary: "Brand identity principles of Dream Company.", bullets: ["Primary Color: Red / Black", "Minimum logo clear-space rule", "Korean/English logo usage guide"] },
  "dev-capability": { title: "Development Capability", summary: "We provide end-to-end capability from structure design to prototyping.", bullets: ["Requirement analysis", "Structure design and simulation", "Prototype production and validation"] },
  "prod-capability": { title: "Production Capability", summary: "We operate a production system that meets strict quality standards.", bullets: ["High-mix low-volume readiness", "Schedule-driven process control", "Automated quality inspection"] },
  "cert-capability": { title: "Certification Capability", summary: "Dedicated organization for product and process certification response.", bullets: ["Specification documentation", "Test data management", "Audit response workflow"] },
  "test-capability": { title: "Test & Evaluation", summary: "Testing and evaluation capability for design validation.", bullets: ["Strength and durability tests", "Environmental tests", "Evaluation reports"] },
  "aircraft-structure": { title: "AIRCRAFT STRUCTURE", summary: "Aircraft structural design and manufacturing technology.", bullets: ["Lightweight design", "Durability verification", "Custom structural solutions"] },
  mro: { title: "MRO", summary: "Operational reliability support through maintenance, repair, and overhaul.", bullets: ["Regular inspection", "Performance restoration", "Preventive maintenance consulting"] },
  "cabin-solution": { title: "CABIN SOLUTION", summary: "Solutions for cabin structure and interior improvement.", bullets: ["Passenger experience-driven design", "Lightweight material application", "Custom layout"] },
  space: { title: "SPACE", summary: "Structure and component development for space environments.", bullets: ["High-reliability structure design", "Environmental resistance tests", "Prototype fabrication"] },
  csr: { title: "CSR", summary: "Social contribution activities for shared growth with local communities.", bullets: ["Donation campaigns", "Support for education programs", "Employee volunteer activities"] },
  notice: { title: "Notice", summary: "Important announcements and company updates.", bullets: ["Regular shareholder meeting notice", "Recruitment notice", "Internal and external event updates"] },
  magazine: { title: "Magazine", summary: "Content featuring corporate culture and project stories.", bullets: ["Quarterly newsletter", "Project interviews", "Culture articles"] },
  talent: { title: "Talent", summary: "Core values of people Dream Company seeks.", bullets: ["Initiative", "Collaboration", "Problem-solving ability"] },
  recruit: { title: "Recruitment", summary: "Open positions and hiring process information.", bullets: ["Application screening", "Technical/practical interview", "Final onboarding"] },
  disclosure: { title: "Disclosure", summary: "Key management disclosures and public information.", bullets: ["Regular disclosures", "Major decisions and notices", "Investor guidance materials"] },
  "ir-room": { title: "IR Room", summary: "Investor-facing company materials.", bullets: ["Company overview", "Financial highlights", "Mid-to-long term strategy"] },
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export default async function ASubPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const lang = sp.lang === "eng" ? "eng" : "kor";
  const pages = lang === "eng" ? pagesEng : pagesKor;
  const page = pages[slug];
  if (!page) notFound();

  return (
    <main style={{ minHeight: "100vh", background: "#f3f2f0", color: "#1f1f1f", padding: 28 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ marginTop: 0 }}>{page.title}</h1>
        <p>{page.summary}</p>
        <ul>
          {page.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p style={{ marginTop: 18 }}>
          <Link href={`/a?lang=${lang}`}>{lang === "eng" ? "Back to A page" : "A 페이지로 돌아가기"}</Link>
        </p>
      </div>
    </main>
  );
}
