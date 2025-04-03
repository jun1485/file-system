import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "주정준 & 이인영의 결혼식",
  description: "주정준과 이인영의 결혼을 알려드립니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
