import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/Layout/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#059669",
};

export const metadata: Metadata = {
  title: "GreenLink",
  description: "Hyperlocal direct transaction platform for flowers and farm products",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GreenLink",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-200`} suppressHydrationWarning>
        <div className="max-w-md mx-auto min-h-screen bg-gray-50 shadow-xl relative overflow-x-hidden border-x border-gray-100" suppressHydrationWarning>
          <main className="pb-20 safe-area-pb" suppressHydrationWarning>
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
