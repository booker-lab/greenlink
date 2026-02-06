import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileLayout from "@/components/layout/MobileLayout";
import BottomNav from "@/components/layout/BottomNav";
import MainHeader from "@/components/layout/MainHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "그린링크 - 농민과 거점을 잇다",
  description: "신선한 농산물을 가장 빠르게 전달하는 하이브리드 직배송 플랫폼",
  manifest: "/manifest.json",
  themeColor: "#22c55e",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "그린링크",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MobileLayout>
          <MainHeader />
          {children}
          <BottomNav />
        </MobileLayout>
      </body>
    </html>
  );
}
