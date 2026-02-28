import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/Layout/BottomNav";
import { SupabaseProvider } from "@/components/Auth/SupabaseProvider";
import { createServerSupabaseClient } from "@/utils/supabase-server";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버 사이드에서 세션 및 프로필 Pre-fetch
  // 이 데이터가 SupabaseProvider를 통해 Zero-lag으로 Zustand에 주입된다.
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  let initialProfile = null;
  if (user) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        initialProfile = {
          id: profile.id,
          nickname: profile.nickname || "그린러버",
          pinkTemperature: profile.pink_temperature || { value: 36.5, level: "첫눈", emoji: "♥" },
          points: profile.points || 0
        };
      }
    } catch (e) {
      console.error('[Layout] Failed to pre-fetch profile:', e);
    }
  }

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-200`}>
        {/*
          SupabaseProvider는 두 가지 역할을 동시에 수행한다:
          1. initialProfile → Zero-lag Hydration (서버 데이터를 즉시 스토어에 주입)
          2. onAuthStateChange 리스너 → SSOT (이후 모든 인증 변경의 단일 허브)
        */}
        <SupabaseProvider initialUser={initialProfile}>
          <div className="max-w-md mx-auto min-h-screen bg-gray-50 shadow-xl relative overflow-x-hidden border-x border-gray-100">
            <main className="pb-20 safe-area-pb">
              {children}
            </main>
            <BottomNav />
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
