"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@greenlink/ui";
import { useState, useEffect } from "react";
import { useUserStore } from "@greenlink/lib";

export function BottomNav() {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    const { isAuthenticated, cartCount, fetchProfileAndCart } = useUserStore();

    useEffect(() => {
        setIsMounted(true);
        // SupabaseProvider가 인증 초기화를 담당하므로 여기서는 추가 데이터 조회만 수행
        if (isAuthenticated) {
            fetchProfileAndCart();
        }
    }, [isAuthenticated, fetchProfileAndCart]);

    const navItems = [
        {
            href: "/",
            label: "홈",
            icon: (isActive: boolean) => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
            )
        },
        {
            href: "/category",
            label: "카테고리",
            icon: (isActive: boolean) => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
            )
        },
        {
            href: "/search",
            label: "검색",
            icon: (isActive: boolean) => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            )
        },
        {
            href: "/cart",
            label: "장바구니",
            icon: (isActive: boolean) => (
                <div className="relative inline-block">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    {isMounted && isAuthenticated && cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                            {cartCount}
                        </span>
                    )}
                </div>
            )
        },
        {
            href: "/mypage",
            label: "내 정보",
            icon: (isActive: boolean) => (
                <div className="relative inline-block">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    {/* Removed pink temperature per user request */}
                </div>
            )
        },
    ];

    return (
        <nav
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 py-3 safe-area-pb z-50 shadow-lg"
            suppressHydrationWarning
        >
            <div className="flex justify-around items-center px-4" suppressHydrationWarning>
                {navItems.map((item) => {
                    // Next.js App Router에서는 SSR 단계에서도 pathname을 정확히 인지합니다.
                    // 따라서 isMounted 가드 없이 직접 비교하는 것이 가장 정확한 Hydration을 보장합니다.
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            suppressHydrationWarning
                            className={`flex flex-col items-center gap-1 p-1 transition-all ${isActive ? "text-green-600 font-bold" : "text-gray-400 font-medium"
                                }`}
                        >
                            <span
                                suppressHydrationWarning
                                className={`flex items-center justify-center transition-opacity ${isActive ? "opacity-100" : "opacity-70"
                                    }`}
                            >
                                {item.icon(isActive)}
                            </span>
                            <span suppressHydrationWarning className="text-[11px] font-bold leading-none">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
