"use client";

import { useUserStore, greenlinkApi, Order } from "@greenlink/lib";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MyPage() {
    const { user, isAuthenticated, isInitialized, loginWithProvider, logout } = useUserStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState<{ google: boolean, kakao: boolean }>({ google: false, kakao: false });
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    const handleLogin = async (provider: 'google' | 'kakao') => {
        try {
            setIsLoading(prev => ({ ...prev, [provider]: true }));
            await loginWithProvider(provider);
        } catch (error) {
            console.error(`[Presentation] ${provider} Login Error:`, error);
            alert(`${provider === 'kakao' ? '카카오' : '구글'} 로그인에 실패했습니다. 코드를 확인해 주세요.`);
        } finally {
            setIsLoading(prev => ({ ...prev, [provider]: false }));
        }
    };



    useEffect(() => {
        if (!isInitialized) return;

        if (isAuthenticated && user) {
            setLoading(true);
            greenlinkApi.getMyOrders().then(data => {
                setOrders(data);
            }).catch(e => {
                console.error('[MyPage] Failed to fetch orders:', e);
            }).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, isInitialized, user]);

    if (!isInitialized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 pb-24 bg-gray-50">
                <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (loading && isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 pb-24 bg-gray-50">
                <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        // Redundant fallback, as middleware.ts handles route protection.
        // During logout, this prevents the confusing behavior of flashing the inline login UI
        // before the redirect to /login takes place.
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 pb-24 bg-gray-50">
                <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="pb-28 bg-gray-50 min-h-screen font-sans">
            {/* Top Green Area */}
            <div className="bg-[#1ebe5d] pt-8 pb-6 px-5 rounded-b-3xl shadow-sm text-white">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#1ebe5d] text-2xl font-bold shadow-sm">
                        {user.nickname.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <h2 className="text-xl font-extrabold">{user.nickname || "그린러버"}</h2>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-0.5 mt-1">
                            <span className="text-[10px] opacity-70 font-mono tracking-tight">ID: {user.id.substring(0, 13)}... (로그인됨)</span>
                            <span className="inline-block w-fit bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-bold">
                                그린 등급 <span className="ml-1">{user.pinkTemperature?.emoji || "♥"} {user.pinkTemperature?.level || "첫눈"}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Pink Temperature Bar */}
                <div className="mb-4">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-bold opacity-90">내 핑크 온도</span>
                        <span className="text-sm font-extrabold flex items-center gap-1">
                            {user.pinkTemperature.emoji} {user.pinkTemperature.value}℃
                        </span>
                    </div>
                    <div className="w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
                        <div className="h-1.5 bg-pink-400 rounded-full" style={{ width: `${Math.min((user.pinkTemperature.value / 100) * 100, 100)}%` }} />
                    </div>
                    <p className="text-[10px] opacity-70 mt-1.5 font-medium">첫눈 단계 - 그린링크를 시작한 새 회원</p>
                </div>

                {/* Points and Coupons */}
                <div className="flex bg-white/10 rounded-xl py-3 divide-x divide-white/20 text-center">
                    <div className="flex-1 cursor-pointer">
                        <div className="text-lg font-extrabold">{user.points.toLocaleString()}원</div>
                        <div className="text-xs font-medium opacity-80 mt-0.5">적립금</div>
                    </div>
                    <div className="flex-1 cursor-pointer">
                        <div className="text-lg font-extrabold">5</div>
                        <div className="text-xs font-medium opacity-80 mt-0.5">쿠폰</div>
                    </div>
                </div>
            </div>

            <main className="px-4 mt-6 space-y-6">

                {/* Recent Items */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-extrabold text-gray-900">최근 본 상품</h3>
                        <span className="text-xs text-green-600 font-bold cursor-pointer">전체보기 →</span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {['🌸', '🌿', '🌱', '🎁'].map((emoji, i) => (
                            <div key={i} className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gray-100 cursor-pointer">
                                {emoji}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Menu List */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    <div className="p-4">
                        <h3 className="text-xs font-extrabold text-gray-900 mb-3 ml-1">주문 내역</h3>
                        <ul className="space-y-1">
                            {/* In a real app we'd map orders here instead of just the menu item */}
                            <li onClick={() => router.push('/category')} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    나의 주문 내역 <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-1">{orders.length}</span>
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </li>
                            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    배송지 관리
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </li>
                        </ul>
                    </div>

                    <div className="p-4">
                        <h3 className="text-xs font-extrabold text-gray-900 mb-3 ml-1">고객 지원</h3>
                        <ul className="space-y-1">
                            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    고객센터 / 도움말
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </li>
                            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                    공지사항
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </li>
                        </ul>
                    </div>

                    <div className="p-4">
                        <h3 className="text-xs font-extrabold text-gray-900 mb-3 ml-1">나의 소식</h3>
                        <ul className="space-y-1">
                            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    결제 수단 관리
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </li>
                            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    설정
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Banner B2B */}
                <div className="bg-[#e9f6ea] border border-[#d1e9d3] rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
                            <span className="text-white text-lg">🏪</span>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-extrabold text-green-900 leading-tight">내가 찾던 손님<br />모두 그린링크에 있어요</h4>
                            <p className="text-[10px] text-green-700 mt-1 font-medium">내 동네 근처 이웃 152,847명</p>
                        </div>
                    </div>
                    <button className="w-full py-2.5 bg-[#1ebe5d] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-green-600 transition-colors">
                        그린링크 비즈 시작하기 &rsaquo;
                    </button>
                </div>

                {/* Business Section */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="p-4">
                        <h3 className="text-xs font-extrabold text-gray-900 mb-3 ml-1">비즈니스</h3>
                        <ul className="space-y-1">
                            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <span className="text-green-600 text-base leading-none">🏪</span>
                                    비즈프로필 관리
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-sm">NEW</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                <div className="mt-8 mb-12 px-1">
                    <button
                        onClick={async () => {
                            try {
                                setIsLoggingOut(true);
                                console.log('[MyPage] Logout process started');
                                await logout();
                                // router.push('/login') 대신 window.location.href가 user-store 내에서 동작
                            } catch (e) {
                                console.error('Logout failed:', e);
                                setIsLoggingOut(false);
                            }
                        }}
                        disabled={isLoggingOut}
                        className="w-full py-4 bg-red-50 text-red-600 border border-red-100 text-[14px] font-extrabold rounded-2xl flex justify-center items-center hover:bg-red-100 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                    >
                        {isLoggingOut ? (
                            <span className="w-5 h-5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                            '로그아웃'
                        )}
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-4">
                        계정 전환 또는 로그인이 필요하시면 로그아웃을 진행해 주세요.
                    </p>
                </div>

            </main>
        </div>
    );
}
