/**
 * C 구역(테이블 주문) 라우트.
 * - 실제 고객: 테이블에 부착된 QR을 휴대폰으로 스캔하면 좌석 번호가 정해진 `/c/[seat]/menu` 메뉴 선택 페이지로 바로 진입한다.
 * - 좌석·메뉴 설정(JSON) 변경이 빌드 없이 반영되도록 dynamic 유지.
 */
export const dynamic = "force-dynamic";

export default function CLayout({ children }: { children: React.ReactNode }) {
  return children;
}
