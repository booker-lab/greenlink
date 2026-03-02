"use client";

import { useUserStore, greenlinkApi, Order } from "@greenlink/lib";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MyPage() {
    const { user, isAuthenticated, isInitialized, loginWithProvider, logout } = useUserStore();
    const [orders, setOrders] = useState<Order[]>([]);
    // [최적화] 전체 페이지 스피너 제거 — 주문 목록 로딩 상태만 별도 관리
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState<{ google: boolean, kakao: boolean }>({ google: false, kakao: false });
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    // 1. Client-side 마운트 확인
    useEffect(() => {
        setMounted(true);
    }, []);

    // 2. [Safety Guard] 마운트 후 3초 이상 주문 로딩 시 강제 해제 (1회성 타이머)
    useEffect(() => {
        if (!mounted) return;
        const timer = setTimeout(() => {
            console.warn('[MyPage] Safety timeout triggered');
            setOrdersLoading(false);
        }, 10000);
        return () => clearTimeout(timer);
    }, [mounted]);

    useEffect(() => {
        if (!mounted || !isInitialized) return;

        console.log('[MyPage] Sync Check:', { isInitialized, isAuthenticated, userId: user?.id });

        // 비로그인 시 리다이렉트
        if (!isAuthenticated) {
            console.log('[MyPage] Not authenticated, redirecting to login...');
            router.push("/login?next=/mypage");
            setOrdersLoading(false);
            return;
        }

        if (user?.id) {
            setOrdersLoading(true);
            greenlinkApi.getMyOrders(user.id)
                .then(data => setOrders(data || []))
                .catch(e => console.error('[MyPage] Failed to fetch orders:', e))
                .finally(() => setOrdersLoading(false));
        } else {
            setOrdersLoading(false);
        }
    }, [mounted, isInitialized, isAuthenticated, user?.id, router]);

    // Hydration 오류 방지
    if (!mounted) return null;

    // [Safety] 인증은 성공했으나 프로필 데이터를 불러오지 못한 경우 가드
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 pb-24 bg-gray-50">
                <p className="text-gray-500">로그인이 필요하거나 정보를 불러올 수 없습니다.</p>
                <button
                    onClick={() => router.push('/login')}
                    className="mt-2 px-6 py-2 bg-green-600 text-white rounded-xl font-bold"
                >
                    로그인 페이지로 이동
                </button>
            </div>
        );
    }

    return (
        <div className="pb-28 bg-gray-50 min-h-screen font-sans">
            {/* User Profile Header (Dashboard) */}
            <div className="bg-white px-5 pt-8 pb-6 border-b border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-[#1ebe5d] text-2xl font-bold border-2 border-white shadow-sm overflow-hidden">
                                {user.nickname.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-gray-50">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1ebe5d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5 leading-none">
                                <h2 className="text-lg font-black text-gray-900">{user.nickname || "그린러버"}</h2>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold mt-1.5">이번 달 등급 <span className="text-green-600 ml-0.5">그린 {user.pinkTemperature?.level || "새내기"}</span></p>
                        </div>
                    </div>
                </div>

                {/* Level Up Banner */}
                <div className="bg-green-50/70 border border-green-100 rounded-xl py-2.5 px-4 mb-6 flex items-center justify-between cursor-pointer">
                    <span className="text-[12px] font-bold text-green-700">30,000원 추가 구매하면 다음 달 주민 등급 달성!</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </div>

                {/* Main Dashboard Stats */}
                <div className="flex justify-around items-center divide-x divide-gray-100 text-center">
                    <div className="flex-1 cursor-pointer">
                        <div className="text-xs font-bold text-gray-400 mb-1">적립금</div>
                        <div className="text-[15px] font-black text-gray-900">{(user.points || 0).toLocaleString()}</div>
                    </div>
                    <div className="flex-1 cursor-pointer">
                        <div className="text-xs font-bold text-gray-400 mb-1">쿠폰</div>
                        <div className="text-[15px] font-black text-gray-900">3</div>
                    </div>
                    <div className="flex-1 cursor-pointer">
                        <div className="text-xs font-bold text-gray-400 mb-1">작성 가능 후기</div>
                        <div className="text-[15px] font-black text-gray-900">0</div>
                    </div>
                </div>
            </div>

            <main className="px-4 py-6 space-y-6">
                {/* My Recent Orders */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-black text-gray-900">최근 주문</h3>
                    </div>

                    {ordersLoading ? (
                        <div className="flex items-center justify-center py-10 gap-3">
                            <div className="w-5 h-5 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
                            <span className="text-sm text-gray-400 font-medium">주문 내역 불러오는 중...</span>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.slice(0, 3).map((order: any) => {
                                const statusInfo = {
                                    'ESCROW_DEPOSIT': { label: '결제완료', step: 0 },
                                    'PREPARING': { label: '배송준비', step: 1 },
                                    'DISPATCHED': { label: '배송시작', step: 2 },
                                    'DELIVERING': { label: '배송중', step: 3 },
                                    'COMPLETED': { label: '배송완료', step: 4 },
                                    'CANCELLED': { label: '취소완료', step: -1 }
                                }[order.status as string] || { label: '확인중', step: 0 };

                                return (
                                    <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex gap-3">
                                                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl shadow-inner overflow-hidden border border-gray-50">
                                                    {order.product?.image_url ? (
                                                        <Image src={order.product.image_url} alt="product" width={64} height={64} className="object-cover" />
                                                    ) : "🌱"}
                                                </div>
                                                <div>
                                                    <p className={`text-[12px] font-black mb-0.5 ${order.status === 'CANCELLED' ? 'text-gray-400' : 'text-green-600'}`}>
                                                        {statusInfo.label}
                                                    </p>
                                                    <p className="text-[14px] font-bold text-gray-900 line-clamp-1">
                                                        {order.product?.item_nm || "공동구매 상품"}
                                                    </p>
                                                    <p className="text-[12px] text-gray-400 mt-1">{(order.totalPrice || 0).toLocaleString()}원 | {order.quantity}개</p>
                                                </div>
                                            </div>
                                            {order.status !== 'CANCELLED' && (
                                                <button
                                                    onClick={() => router.push(`/mypage/order/cancel/${order.id}`)}
                                                    className="px-3 py-1.5 border border-gray-200 text-gray-500 text-[11px] font-bold rounded-lg hover:bg-gray-50 active:scale-95 transition-all"
                                                >
                                                    주문 취소
                                                </button>
                                            )}
                                        </div>

                                        {/* Status Progress Bar */}
                                        {order.status !== 'CANCELLED' ? (
                                            <div className="mt-6">
                                                <div className="flex justify-between items-center mb-1">
                                                    {['결제완료', '준비중', '배송시작', '배송중', '배송완료'].map((label, idx) => (
                                                        <span key={label} className={`text-[9px] font-black ${statusInfo.step >= idx ? 'text-green-600' : 'text-gray-300'}`}>
                                                            {label}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="relative w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500"
                                                        style={{ width: `${(statusInfo.step / 4) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-center border border-dashed border-gray-200">
                                                <span className="text-[11px] font-bold text-gray-400 tracking-tight">요청하신 주문 취소가 완료되었습니다.</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            <button
                                onClick={() => router.push('/mypage/order')}
                                className="w-full py-3.5 bg-white border border-gray-200 text-[13px] font-black text-gray-900 rounded-2xl shadow-sm hover:gray-50 active:scale-95 transition-all"
                            >
                                주문 내역 모두 보기
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-100 border-dashed rounded-2xl py-10 text-center">
                            <p className="text-[13px] text-gray-400 font-bold tracking-tight">아직 참여 중인 공동구매가 없습니다.</p>
                            <button
                                onClick={() => router.push('/category')}
                                className="mt-4 text-[12px] font-black text-green-600 border border-green-200 px-6 py-2 rounded-full hover:bg-green-50 transition-colors"
                            >
                                첫 공구 도전하기
                            </button>
                        </div>
                    )}
                </section>

                {/* Detailed Menus */}
                <div className="space-y-4">
                    {/* Order Management */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        <div className="p-4 bg-gray-50/30">
                            <h3 className="text-[12px] font-black text-gray-400">주문 관리</h3>
                        </div>
                        <div onClick={() => router.push('/mypage/order')} className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">📦</span>
                                <span className="text-[14px] font-bold text-gray-700">나의 주문 내역</span>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">📍</span>
                                <span className="text-[14px] font-bold text-gray-700">배송지 관리</span>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                    </section>

                    {/* Support & Community */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        <div className="p-4 bg-gray-50/30">
                            <h3 className="text-[12px] font-black text-gray-400">고객 지원</h3>
                        </div>
                        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">🎧</span>
                                <span className="text-[14px] font-bold text-gray-700">고객센터 / 도움말</span>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">📢</span>
                                <span className="text-[14px] font-bold text-gray-700">공지사항</span>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                    </section>

                    {/* My Settings */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        <div className="p-4 bg-gray-50/30">
                            <h3 className="text-[12px] font-black text-gray-400">나의 소식</h3>
                        </div>
                        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">💳</span>
                                <span className="text-[14px] font-bold text-gray-700">결제 수단 관리</span>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">⚙️</span>
                                <span className="text-[14px] font-bold text-gray-700">설정</span>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                    </section>

                    {/* Business Section */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 bg-gray-50/30 flex justify-between items-center">
                            <h3 className="text-[12px] font-black text-gray-400">비즈니스</h3>
                            <span className="bg-green-100 text-green-600 text-[9px] font-black px-1.5 py-0.5 rounded-sm">그린비즈</span>
                        </div>
                        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-green-50/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">🏪</span>
                                <span className="text-[14px] font-bold text-gray-700">비즈프로필 관리</span>
                                <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-black scale-90">NEW</span>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                    </section>
                </div>

                {/* Account Actions */}
                <div className="pt-4 flex items-center justify-center gap-4 text-gray-400 text-[11px] font-bold">
                    <button
                        onClick={async () => {
                            if (isLoggingOut) return;
                            setIsLoggingOut(true);
                            await logout();
                        }}
                    >
                        로그아웃
                    </button>
                    <span className="w-px h-2 bg-gray-200" />
                    <button>회원탈퇴</button>
                </div>

                <div className="pt-2 pb-10 text-center">
                    <p className="text-[10px] text-gray-300 font-mono tracking-tighter">
                        USER_ID: {user.id} <br />
                        BUILD_REV: GREENLINK_2026.03.02
                    </p>
                </div>
            </main>
        </div>
    );
}
