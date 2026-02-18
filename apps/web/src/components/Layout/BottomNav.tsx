"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, User, Sparkles } from "lucide-react";
import { cn } from "@greenlink/ui";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "홈", icon: Home },
        { href: "/search", label: "검색", icon: Search },
        { href: "/group-buy", label: "공구", icon: Sparkles }, // Featured feature
        // { href: "/wishlist", label: "찜", icon: Heart }, // MVP excluded
        { href: "/order", label: "주문내역", icon: User }, // Simplified My Page to Order History for MVP
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 safe-area-pb z-50">
            <div className="flex justify-around items-center">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 min-w-[60px]",
                                isActive ? "text-green-600" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
