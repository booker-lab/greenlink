import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/Layout/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GreenLink Web",
  description: "GreenLink Web Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <main className="min-h-screen pb-16 safe-area-pb bg-gray-50">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
