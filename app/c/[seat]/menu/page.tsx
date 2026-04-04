import Link from "next/link";
import { notFound } from "next/navigation";
import { getCConfig } from "@/lib/c-config";
import { parseSeatParam } from "../../seats";
import { MenuClient } from "./menu-client";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ seat: string }>;
};

/** 고객이 테이블 QR을 스캔했을 때의 진입점(좌석은 QR URL에 포함). */
export default async function CMenuPage({ params }: Props) {
  const { seat } = await params;
  const config = await getCConfig();
  const seatNum = parseSeatParam(seat, config.seatCount);
  if (seatNum === null) notFound();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.seatBadge}>좌석 {seatNum}</p>
            <h1 className={styles.title}>메뉴 선택</h1>
            <p className={styles.subtitle}>주문할 메뉴를 선택하세요.</p>
          </div>
          <Link href="/c" className={styles.backLink}>
            좌석 선택
          </Link>
        </header>
        <MenuClient seat={seatNum} menuItems={config.menuItems} />
      </div>
    </main>
  );
}
