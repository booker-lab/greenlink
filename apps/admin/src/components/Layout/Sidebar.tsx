"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@greenlink/ui";
import { LayoutDashboard, Package, Truck, Settings, LogOut } from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { href: "/", label: "대시보드", icon: LayoutDashboard },
        { href: "/products", label: "상품 관리", icon: Package },
        { href: "/delivery", label: "배송 관리", icon: Truck },
        { href: "/settings", label: "설정", icon: Settings },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-green-600 flex items-center gap-2">
                    <span>🌿</span> GreenLink
                </h1>
                <p className="text-xs text-gray-400 mt-1">Partner Center</p>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-green-50 text-green-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5" />
                    로그아웃
                </button>
            </div>
        </div>
    );
}
