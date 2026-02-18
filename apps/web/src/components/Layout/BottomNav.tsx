"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@greenlink/ui";
import { useState, useEffect } from "react";

export function BottomNav() {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const navItems = [
        { href: "/", label: "홈", icon: "🏠" },
        { href: "/search", label: "검색", icon: "🔍" },
        { href: "/group-buy", label: "공구", icon: "✨" },
        { href: "/order", label: "주문내역", icon: "👤" },
    ];

    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-md border-t border-gray-100 py-3 safe-area-pb z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
            <div className="flex justify-around items-center px-2">
                {navItems.map((item) => {
                    const isActive = isMounted && pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1.5 p-1 transition-all duration-200",
                                isActive ? "text-green-600 scale-105" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <span className={cn(
                                "text-2xl transition-all",
                                !isActive && "grayscale opacity-50"
                            )}>{item.icon}</span>
                            <span className={cn(
                                "text-[11px] font-bold tracking-tight transition-colors",
                                isActive ? "text-green-700" : "text-gray-400"
                            )}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
