'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Sprout, User } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
            <div className="w-full max-w-md bg-white border-t border-gray-200 h-16 flex justify-around items-center">
                <Link href="/" className="flex flex-col items-center justify-center w-full h-full">
                    <Home className={`w-6 h-6 ${isActive('/') ? 'text-green-600 fill-green-100' : 'text-gray-400'}`} />
                    <span className={`text-[10px] mt-1 ${isActive('/') ? 'text-green-600 font-medium' : 'text-gray-400'}`}>홈</span>
                </Link>
                <Link href="/search" className="flex flex-col items-center justify-center w-full h-full">
                    <Search className={`w-6 h-6 ${isActive('/search') ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-[10px] mt-1 ${isActive('/search') ? 'text-green-600 font-medium' : 'text-gray-400'}`}>검색</span>
                </Link>
                <Link href="/my-farm" className="flex flex-col items-center justify-center w-full h-full">
                    <Sprout className={`w-6 h-6 ${isActive('/my-farm') ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-[10px] mt-1 ${isActive('/my-farm') ? 'text-green-600 font-medium' : 'text-gray-400'}`}>내 농장</span>
                </Link>
                <Link href="/mypage" className="flex flex-col items-center justify-center w-full h-full">
                    <User className={`w-6 h-6 ${isActive('/mypage') ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-[10px] mt-1 ${isActive('/mypage') ? 'text-green-600 font-medium' : 'text-gray-400'}`}>마이페이지</span>
                </Link>
            </div>
        </nav>
    );
}
