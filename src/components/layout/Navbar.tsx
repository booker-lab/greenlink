'use client';

import Link from 'next/link';
import { Sprout } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-emerald-600 p-2 rounded-lg group-hover:bg-emerald-700 transition-colors">
                        <Sprout className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}>
                        GreenLink
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">서비스 소개</Link>
                    <Link href="#logic" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">기술력</Link>
                    <Link href="#partners" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">파트너십</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                    >
                        데모 체험하기
                    </Link>
                </div>
            </div>
        </nav>
    );
}
