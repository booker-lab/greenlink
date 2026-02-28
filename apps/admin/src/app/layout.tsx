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
