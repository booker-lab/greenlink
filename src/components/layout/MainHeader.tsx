import React from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Bell } from 'lucide-react';

export default function MainHeader() {
    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between p-4">
                <Link href="/">
                    <h1 className="text-xl font-bold text-green-600">그린링크</h1>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/search" className="text-gray-600 hover:text-green-600">
                        <Search className="w-6 h-6" />
                    </Link>
                    <Link href="/cart" className="text-gray-600 hover:text-green-600 relative">
                        <ShoppingCart className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            0
                        </span>
                    </Link>
                    <Link href="/notifications" className="text-gray-600 hover:text-green-600">
                        <Bell className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
