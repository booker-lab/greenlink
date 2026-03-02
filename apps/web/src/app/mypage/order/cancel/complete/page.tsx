"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CancelCompletePage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* Header */}
            <header className="sticky top-0 bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-4 z-40">
                <button onClick={() => router.push('/mypage/order')} className="p-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1 className="text-[16px] font-black text-gray-900">취소 완료</h1>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                </div>

                <h2 className="text-[20px] font-black text-gray-900 mb-2">주문 취소가 완료되었습니다</h2>
                <p className="text-[14px] text-gray-400 font-bold mb-12 leading-relaxed">
                    요청하신 취소가 정상적으로 처리되었습니다.<br />
                    결제 수단 및 카드사에 따라 환불까지 3~7일이 소요될 수 있습니다.
                </p>

                <div className="w-full flex flex-col gap-3">
                    <button
                        onClick={() => router.push('/category')}
                        className="w-full py-4 bg-green-600 text-white text-[15px] font-black rounded-2xl shadow-xl shadow-green-100 active:scale-95 transition-all"
                    >
                        쇼핑 계속하기
                    </button>
                    <button
                        onClick={() => router.push('/mypage/order')}
                        className="w-full py-4 bg-white border border-gray-100 text-[14px] font-black text-gray-400 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        주문 이력 보기
                    </button>
                </div>
            </main>
        </div>
    );
}
