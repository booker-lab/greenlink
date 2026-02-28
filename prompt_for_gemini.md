**[Agent-to-Agent Protocol]**
> Role: Senior Architect & Code Reviewer
> 모든 기술적 해결책은 아래 [Antigravity Task] 블록 형식을 반드시 준수한다.
>
> **[Antigravity Task]**
> - **근본 원인**: 문제의 핵심 원인 한 줄 요약
> - **파일 경로**: 수정이 필요한 파일 상대 경로
> - **직접 명령**: Antigravity Agent 에게 내릴 구체적 Instruction
> - **수정 코드**: `diff` 또는 최소한의 교체 로직만 제공 (전체 코드 재출력 금지)


---

# [Session Report] — eco_pediatrics Error Tracker
> Session Started: 2026-03-01 05:17:29
> Total Errors in Session: 0

## 1. Session Error History

_에러 감지 전 (대기 중)_

## 2. Source Code Context

#### `packages\lib\src\index.ts`
```typescript
// 1. Core API & Supabase Client
export * from './api/supabase';
export { greenlinkApi } from './api';
export * from './api/client';

// 2. Domain Types & Models (SSOT)
export * from './types';

// 3. Constants & Utilities
export * from './constants';
export * from './utils';

// 4. Global State Stores (Zustand)
export * from './stores';

// 5. External Integrations (Namespaced)
export * as NaverAPI from './api/external/naver-smartstore';
export * as TossAPI from './api/external/toss-payments';

```

#### `packages\ui\src\index.ts`
```typescript
export * from "./lib/utils";
export * from "./components/ui/button";
export * from "./components/ui/input";
export * from "./components/ui/card";
export * from "./components/ui/sheet";
export * from "./components/ui/progress";
export * from "./components/ui/badge";
export * from "./components/ui/avatar";
export * from "./components/ui/tabs";
export * from "./components/ui/popover";
export * from "./components/ui/table";
export * from "./components/ui/dialog";
export * from "./components/ui/form";
export * from "./components/ui/label";
export * from "./components/ui/select";
export * from "./components/ui/checkbox";
export * from "./components/ui/dropdown-menu";

```

#### `apps\web\src\app\layout.tsx`
```typescript
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

```

#### `apps\web\src\app\page.tsx`
```typescript
import { MOCK_PRODUCTS, MOCK_GROUP_BUYS, MOCK_FARMS } from "@greenlink/lib";
import { ProductCard } from "@/components/Product/ProductCard";
import { GroupBuyCard } from "@/components/GroupBuy/GroupBuyCard";
import { Button, Badge } from "@greenlink/ui";
import Link from "next/link";

export default function Home() {
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);
  const closingDeals = MOCK_GROUP_BUYS.filter((d: any) => d.status === 'RECRUITING').slice(0, 2);
  const recommendedFarm = MOCK_FARMS[0]; // '디어 오키드'

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      {/* 1. Top Header */}
      <header className="sticky top-0 z-40 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 mb-0 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-green-600 tracking-tight">그린링크</span>
        </div>
        <div className="flex items-center gap-4 text-gray-500">
          <button aria-label="Search" className="hover:text-gray-800 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button aria-label="Cart" className="relative hover:text-gray-800 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-600 text-[10px] font-bold text-white border-2 border-white">
              2
            </span>
          </button>
          <button aria-label="Notifications" className="hover:text-gray-800 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>
        </div>
      </header>

      {/* 2. Main Banner */}
      <section className="relative h-48 bg-emerald-600 text-white flex flex-col items-center justify-center overflow-hidden">
        {/* Simple decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 flex">
          <div className="w-1/2 h-full bg-gradient-to-br from-white to-transparent transform -skew-x-12"></div>
        </div>

        <div className="relative z-10 text-center space-y-2 translate-y-[-10px]">
          <h2 className="text-2xl font-bold tracking-tight">신선한 제철 농산물</h2>
          <p className="text-sm font-medium text-emerald-50">지금 바로 만나보세요</p>
        </div>

        {/* Navigation Dots (Visual only for now) */}
        <div className="absolute bottom-4 flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
          <div className="w-4 h-1.5 rounded-full bg-white"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
        </div>
      </section>

      {/* 3. Category Navigation */}
      <section className="bg-white px-2 py-5 mb-2 border-b border-gray-100">
        <div className="grid grid-cols-5 gap-2">
          {[
            { icon: "🍎", label: "과일" },
            { icon: "🥬", label: "채소" },
            { icon: "🌾", label: "곡물" },
            { icon: "🌸", label: "난/꽃" },
            { icon: "📦", label: "공구" },
          ].map((cat, idx) => (
            <Link key={idx} href="/category" className="flex flex-col items-center gap-1.5">
              <div className="w-[52px] h-[52px] rounded-[18px] bg-slate-50 flex items-center justify-center text-2xl shadow-sm border border-slate-100 hover:scale-105 transition-transform">
                {cat.icon}
              </div>
              <span className="text-[11px] font-medium text-gray-600">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Closing Soon Group Buys */}
      <section className="bg-white py-6 mb-2 border-b border-gray-100">
        <div className="px-4 flex justify-between items-center mb-4">
          <h2 className="text-[17px] font-bold flex items-center gap-1.5">
            <span className="text-orange-500">🔥</span> 지금 모집 중인 공구
            <span className="ml-1 bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{closingDeals.length}</span>
          </h2>
          <Link href="/group-buy" className="text-[13px] text-gray-500 font-medium">
            전체보기 {'>'}
          </Link>
        </div>
        <div className="px-4 space-y-3">
          {closingDeals.map((deal: any) => (
            <GroupBuyCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>

      {/* 5. Recommended Farms */}
      <section className="bg-white py-6 mb-2 border-b border-gray-100">
        <div className="px-4 mb-4">
          <h2 className="text-[17px] font-bold flex items-center gap-1.5">
            <span className="text-amber-700">🛖</span> 우리 동네 추천 농장
          </h2>
          <p className="text-[13px] text-gray-500 mt-0.5">내 동네 반경에서 인증된 농장이에요.</p>
        </div>

        <div className="px-4">
          {/* Custom Farm Card tailored for Home Page */}
          <div className="border border-green-100 rounded-2xl p-5 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex gap-4 items-center border-b border-gray-50 pb-4 mb-4">
              <div className="w-[52px] h-[52px] rounded-[18px] bg-pink-100 flex items-center justify-center text-2xl flex-shrink-0">
                {recommendedFarm.profileEmoji}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-gray-900">{recommendedFarm.name}</h3>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-green-200 text-green-700 font-medium bg-green-50">인증 됨</Badge>
                </div>
                <p className="text-[12px] text-gray-500 mt-0.5">{recommendedFarm.location.city} {recommendedFarm.location.district} · 화훼/동양란</p>
                <p className="text-[12px] text-gray-400 mt-1 line-clamp-1">{recommendedFarm.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100">
              <div className="flex flex-col items-center justify-center px-2">
                <div className="flex items-center gap-1 text-green-600 font-bold mb-1">
                  <span className="text-sm">🌱</span> <span>{recommendedFarm.greenTemperature.value}°C</span>
                </div>
                <span className="text-[11px] text-gray-500">그린 온도</span>
              </div>
              <div className="flex flex-col items-center justify-center px-2">
                <div className="flex items-center gap-1 font-bold text-gray-700 mb-1">
                  <span className="text-sm">👤</span> <span>{recommendedFarm.followers}</span>
                </div>
                <span className="text-[11px] text-gray-500">단골</span>
              </div>
              <div className="flex flex-col items-center justify-center px-2 text-center">
                <span className="text-xs font-semibold text-gray-600 mb-0.5 flex items-center justify-center gap-1">
                  <span className="text-[10px]">📋</span> 농업경영체
                </span>
                <span className="text-[10px] text-gray-500">인증 완료</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {recommendedFarm.tags.slice(0, 5).map((tag: string) => (
                <span key={tag} className="text-[11px] text-green-700 bg-green-50 px-2.5 py-1 rounded-full font-medium">#{tag}</span>
              ))}
            </div>

            <button className="w-full mt-4 py-2.5 text-[13px] font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              농장 프로필 보기 {'>'}
            </button>
          </div>
        </div>
      </section>

      {/* 6. Today's Specials */}
      <section className="bg-white py-6">
        <div className="px-4 mb-4 flex justify-between items-center">
          <h2 className="text-[17px] font-bold flex items-center gap-1.5">
            오늘의 특가 <span className="text-red-500">🔥</span>
          </h2>
          <Link href="/category" className="text-[13px] text-gray-500 font-medium">
            전체보기 {'>'}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 px-4">
          {featuredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

```

#### `apps\admin\src\app\layout.tsx`
```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import { createClient } from "@greenlink/lib";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        async function checkRole() {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session || typeof session === "string") {
                console.warn("[Admin Domain] No valid session found. Redirecting to login...");
                setIsLoading(false); // 로딩 종료 후 login 페이지 노출 허용
                if (pathname !== "/login") {
                    router.push("/login?returnUrl=" + pathname);
                }
                return;
            }

            setUser(session.user);
            setIsLoading(false);
            console.log(`[Admin Domain] Farmer session verified for user:`, session.user?.email);
        }

        checkRole();
    }, [router, supabase.auth, pathname]);

    const navItems = [
        { name: "대시보드", href: "/", icon: "📊" },
        { name: "주문 관리", href: "/orders", icon: "📦" },
        { name: "상품 관리", href: "/products", icon: "🌸" },
        { name: "정산 내역", href: "/settlement", icon: "💰" },
    ];

    // 하이드레이션 불일치 방지를 위해 서버와 클라이언트의 body 클래스를 완벽히 일치시킴
    const bodyClass = `${inter.className} bg-gray-50 text-gray-900 font-sans`;

    return (
        <html lang="ko">
            <body className={bodyClass}>
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-emerald-600">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                            <p className="text-sm font-bold animate-pulse">관리자 권한 확인 중...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex min-h-screen">
                        {/* Sidebar (Glassmorphism Effect) */}
                        <aside className="w-64 bg-white/70 backdrop-blur-xl border-r border-emerald-50 sticky top-0 h-screen flex flex-col z-50">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
                                    <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700">GreenLink Admin</h2>
                                </div>

                                <nav className="space-y-1">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                                                    : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
                                                    }`}
                                            >
                                                <span>{item.icon}</span>
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div className="mt-auto p-6 border-t border-gray-100">
                                <div className="bg-emerald-50 rounded-2xl p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-200 border-2 border-white overflow-hidden">
                                        <img src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Farmer"} alt="Profile" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-xs font-black text-emerald-800 truncate">{user?.user_metadata?.full_name || "농장주님"}</p>
                                        <button
                                            onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
                                            className="text-[10px] text-emerald-600 font-bold hover:underline"
                                        >
                                            로그아웃
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 min-h-screen relative">
                            <header className="h-16 bg-white/40 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
                                <h1 className="text-sm font-black text-gray-400 uppercase tracking-widest">Farmer Dashboard V1</h1>
                                <div className="flex items-center gap-4">
                                    <div className="bg-white rounded-full px-3 py-1 border border-gray-200 text-[11px] font-bold text-gray-500 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        Live Sync Active
                                    </div>
                                </div>
                            </header>

                            <div className="p-8">
                                {children}
                            </div>
                        </main>
                    </div>
                )}
            </body>
        </html>
    );
}

```

#### `apps\admin\src\app\page.tsx`
```typescript
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@greenlink/lib";
import Link from "next/link";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingDeliveries: 0,
        totalSales: 0,
        activeDeals: 0
    });
    const supabase = createClient();

    useEffect(() => {
        async function fetchStats() {
            // 실제 운영 환경에선 정교한 집계 쿼리 사용
            const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
            const { count: pendingCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'ESCROW_DEPOSIT');
            const { data: salesData } = await supabase.from('orders').select('total_price');
            const { count: dealCount } = await supabase.from('zero_inventory_items').select('*', { count: 'exact', head: true }).eq('status', 'RECRUITING');

            const totalSales = salesData?.reduce((acc, curr) => acc + curr.total_price, 0) || 0;

            setStats({
                totalOrders: orderCount || 0,
                pendingDeliveries: pendingCount || 0,
                totalSales,
                activeDeals: dealCount || 0
            });
        }

        fetchStats();
    }, []);

    const cards = [
        { name: "총 주문 건수", value: `${stats.totalOrders}건`, sub: "누적 주문량", icon: "📦", color: "blue" },
        { name: "미처리 배송", value: `${stats.pendingDeliveries}건`, sub: "즉시 처리 필요", icon: "🚚", color: "orange" },
        { name: "누적 매출액", value: `₩${stats.totalSales.toLocaleString()}`, sub: "예치금 포함", icon: "💰", color: "emerald" },
        { name: "진행 중 공구", value: `${stats.activeDeals}개`, sub: "모집 중 품목", icon: "🔥", color: "red" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-gray-900">대시보드 개요</h2>
                <p className="text-sm text-gray-400 mt-1 font-medium">디어 오키드 농장의 실시간 현황입니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.name} className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-emerald-100/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-${card.color}-50`}>
                                {card.icon}
                            </div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Global</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400">{card.name}</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{card.value}</h3>
                        <p className="text-[10px] font-extrabold text-emerald-600 mt-2 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">{card.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm">
                    <h3 className="text-lg font-black text-gray-900 mb-6">최근 알림</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4 p-4 bg-emerald-50 rounded-2xl">
                            <div className="w-10 h-10 rounded-full bg-emerald-200 flex-shrink-0 flex items-center justify-center text-lg">📢</div>
                            <div>
                                <p className="text-sm font-black text-emerald-900 underline decoration-emerald-200 underline-offset-4">새로운 공구 목표 달성!</p>
                                <p className="text-xs text-emerald-700 mt-1 font-bold">'호접란 아마빌리스' 품목이 목표 인원을 채워 GOAL_MET 상태가 되었습니다.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 border border-gray-50 rounded-2xl">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-lg">💡</div>
                            <div>
                                <p className="text-sm font-black text-gray-700">시스템 팁</p>
                                <p className="text-xs text-gray-500 mt-1 font-medium">직배송 완료 버튼을 누르면 에스크로 정산이 즉시 실행됩니다.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                    <h3 className="text-lg font-black mb-2 leading-tight">GreenLink AI<br />Insight Beta</h3>
                    <p className="text-sm text-gray-400 font-bold mb-8">현재 구매 패턴 분석 결과, 주말 대비 평일 주문량이 24% 높습니다.</p>

                    <Link
                        href="/orders"
                        className="inline-flex items-center gap-2 bg-emerald-600 px-6 py-3 rounded-2xl text-sm font-black hover:bg-emerald-500 transition-all active:scale-95"
                    >
                        주문 내역 자세히 보기
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}

```

#### `apps\driver\src\app\layout.tsx`
```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GreenLink Driver",
  description: "GreenLink Driver Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

```

#### `apps\driver\src\app\page.tsx`
```typescript
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}

```

---

## 3. Instruction

위 에러 내역(특히 가장 최근 항목)을 분석하고 **[Antigravity Task]** 프로토콜에 맞춰 수정 계획을 제시해 주세요.
