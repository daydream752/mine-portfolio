import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "소유자 전용 견적 시스템",
  description: "마스터 계정만 견적 생성 가능한 보안형 웹 페이지",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
