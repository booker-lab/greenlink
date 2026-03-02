"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { greenlinkApi, useUserStore, Order } from "@greenlink/lib";
import { Button, Card } from "@greenlink/ui";

export default function CartPage() {
    const router = useRouter();
    const { user, isAuthenticated, isInitialized } = useUserStore();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.product?.selling_price || 0) * (item.quantity || 1), 0);

    // 1. Client-side 마운트 확인 (Hydration 안정성)
    useEffect(() => {
        setMounted(true);
    }, []);

    // 2. [Safety Guard] 6초 이상 로딩 시 강제 해제
    useEffect(() => {
        if (!mounted) return;
        const timer = setTimeout(() => {
            if (loading) {
                console.warn('[Cart] Force unloading due to timeout');
                setLoading(false);
            }
        }, 6000);
        return () => clearTimeout(timer);
    }, [loading, mounted]);

    // 3. 데이터 로드 로직
    useEffect(() => {
        if (!mounted) return;

        const syncAndLoad = async () => {
            // 초기화 대기 (최대 1.5초)
            if (!isInitialized) {
                const retryTimer = setTimeout(() => {
                    if (loading) setLoading(false);
                }, 1500);
                return () => clearTimeout(retryTimer);
            }

            // 비로그인 시 즉시 리다이렉트
            if (!isAuthenticated) {
                router.push("/login?next=/cart");
                setLoading(false);
                return;
            }

            try {
                if (user?.id) {
                    const [items, orders] = await Promise.all([
                        greenlinkApi.getCartItems(user.id),
                        greenlinkApi.getMyOrders(user.id)
                    ]);
                    setCartItems(items || []);
                    setActiveOrders(orders || []);
                }
            } catch (e) {
                console.error('[Cart] Data Fetch Error:', e);
            } finally {
                setLoading(false);
            }
        };

        syncAndLoad();
    }, [mounted, isInitialized, isAuthenticated, user?.id, router]);

    if (!mounted) return null;

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-white gap-3">
                <div className="w-10 h-10 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
                <p className="text-sm text-gray-400 font-medium">장바구니 확인 중...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-40">
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <h1 className="text-lg font-bold">장바구니/참여현황</h1>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                    총 {cartItems.length + activeOrders.length}개
                </span>
            </header>

            <main className="p-4 space-y-6">
                {/* 1. 진행 중인 공동구매 (참여 완료된 제품들) */}
                {activeOrders.length > 0 && (
                    <section className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-4 bg-green-500 rounded-full" />
                            <h2 className="text-sm font-extrabold text-gray-900">참여 중인 공동구매</h2>
                        </div>
                        <div className="space-y-3">
                            {activeOrders.map((order) => (
                                <Card key={order.id} className="p-4 border-none shadow-sm bg-white border border-green-50 flex gap-4">
                                    <div className="w-16 h-16 bg-green-50 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl overflow-hidden relative">
                                        {order.productId.startsWith('orc') ? '🌸' : order.productId.startsWith('cut') ? '🌹' : '🌱'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xs font-bold text-gray-900 line-clamp-1">
                                                {order.productId === 'orc-1' ? '호접란 (블루 스카이 특)' :
                                                    order.productId === 'orc-2' ? '동양란 (철골소심 상)' :
                                                        order.productId === 'cut-1' ? '대형 장미 다발' : order.productId}
                                            </h3>
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 shrink-0 capitalize">
                                                {order.status === 'ESCROW_DEPOSIT' ? '결제 예치완료' : order.status}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex justify-between items-center">
                                            <span className="text-[11px] text-gray-400 font-medium">수량: {order.quantity}개</span>
                                            <span className="text-sm font-black text-gray-900">{order.totalPrice.toLocaleString()}원</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* 2. 장바구니 담긴 아이템 */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="w-1 h-4 bg-orange-400 rounded-full" />
                        <h2 className="text-sm font-extrabold text-gray-900">장바구니 아이템</h2>
                    </div>

                    {cartItems.length > 0 ? (
                        <div className="space-y-3">
                            {cartItems.map((item) => (
                                <Card key={item.id} className="p-4 border-none shadow-sm bg-white flex gap-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl">
                                        {item.product?.category_id === 'ORC' ? '🌸' : item.product?.category_id === 'CUT' ? '🌹' : '🌱'}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{item.product?.item_nm || item.product_id || "담긴 상품"}</h3>
                                            <p className="text-[10px] text-green-600 font-bold mt-0.5">최저가 보장 상품</p>
                                        </div>
                                        <div className="flex justify-between items-end mt-2">
                                            <div className="flex items-center gap-2 text-[11px] text-gray-400">
                                                <span>수량 {item.quantity || 1}개</span>
                                            </div>
                                            <span className="text-sm font-black text-gray-900">{(item.product?.selling_price || 0).toLocaleString()}원</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        activeOrders.length === 0 ? (
                            <div className="bg-white rounded-2xl py-12 text-center border-2 border-dashed border-gray-100">
                                <p className="text-gray-400 text-sm font-medium">장바구니가 비어 있습니다.</p>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/category')}
                                    className="mt-4 border-green-200 text-green-600 font-bold"
                                >
                                    공구 상품 보러가기
                                </Button>
                            </div>
                        ) : (
                            <div className="p-4 bg-white rounded-xl text-center border border-gray-100">
                                <p className="text-xs text-gray-400">장바구니에 담긴 다른 상품은 없습니다.</p>
                            </div>
                        )
                    )}
                </section>
            </main>

            {/* Checkout Summary Footer for Cart items only */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-[72px] pb-[env(safe-area-inset-bottom)] left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white border-t border-gray-100 z-40 flex items-center justify-between gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col">
                        <span className="text-[12px] text-gray-400 font-bold">결제 예정 금액</span>
                        <span className="text-[17px] font-black text-green-700">
                            {totalPrice.toLocaleString()}원
                        </span>
                    </div>
                    <Button
                        className="flex-1 h-13 bg-green-600 hover:bg-green-700 font-extrabold text-base rounded-2xl shadow-lg shadow-green-100 active:scale-95 transition-all"
                        onClick={() => router.push(`/order?productId=${cartItems[0].product_id}`)}
                    >
                        {cartItems.length}개 상품 공구 참여 (총 {totalPrice.toLocaleString()}원)
                    </Button>
                </div>
            )}
        </div>
    );
}
