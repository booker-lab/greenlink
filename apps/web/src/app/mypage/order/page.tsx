"use client";

import { useUserStore, greenlinkApi, Order } from "@greenlink/lib";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function OrderHistoryPage() {
    const { user, isAuthenticated, isInitialized } = useUserStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !isInitialized) return;
        if (!isAuthenticated) {
            router.push("/login?next=/mypage/order");
            return;
        }

        const fetchOrders = async () => {
            if (user?.id) {
                try {
                    const data = await greenlinkApi.getMyOrders(user.id);
                    setOrders(data || []);
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchOrders();
    }, [mounted, isInitialized, isAuthenticated, user?.id, router]);

    if (!mounted || loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-8 h-8 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
        </div>
    );

    const statusMap: Record<string, { label: string, step: number }> = {
        'ESCROW_DEPOSIT': { label: '결제완료', step: 0 },
        'PREPARING': { label: '배송준비', step: 1 },
        'DISPATCHED': { label: '배송시작', step: 2 },
        'DELIVERING': { label: '배송중', step: 3 },
        'COMPLETED': { label: '배송완료', step: 4 },
        'CANCELLED': { label: '취소완료', step: -1 }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="sticky top-0 bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-4 z-50">
                <button onClick={() => router.back()} className="p-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1 className="text-[16px] font-black text-gray-900">주문 내역</h1>
            </header>

            <main className="p-4 space-y-4">
                {/* Holiday Notice (Paldo-gam style) */}
                <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4 flex items-start gap-3">
                    <span className="text-xl">🚚</span>
                    <div>
                        <p className="text-[12px] font-black text-green-800 mb-1">삼일절 공휴일 배송안내</p>
                        <ul className="text-[10px] text-green-700/80 space-y-0.5 list-disc ml-3 font-medium">
                            <li>3/2(월)은 대체휴무일로 택배사와 고객센터 휴무입니다.</li>
                            <li>2/27(금)까지 배송 시작하지 않은 상품은 3/3(화)부터 순차 출고됩니다.</li>
                        </ul>
                    </div>
                </div>

                {orders.length > 0 ? (
                    orders.map((order: any) => {
                        const s = statusMap[order.status] || { label: '확인중', step: 0 };
                        return (
                            <div key={order.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                                    <span className="text-[12px] font-black text-gray-900">{new Date(order.orderedAt).toLocaleDateString()}</span>
                                    <button className="text-[11px] font-bold text-gray-400 flex items-center gap-0.5">
                                        주문 상세 보기
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m9 18 6-6-6-6" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-4">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-3xl shadow-inner border border-gray-50">
                                            {order.product?.image_url ? (
                                                <Image src={order.product.image_url} alt="product" width={80} height={80} className="object-cover" />
                                            ) : "🌱"}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-[12px] font-black mb-1 ${order.status === 'CANCELLED' ? 'text-gray-400' : 'text-green-600'}`}>
                                                {s.label}
                                            </p>
                                            <h4 className="text-[15px] font-bold text-gray-900 line-clamp-1 mb-1">
                                                {order.product?.item_nm || "공동구매 상품"}
                                            </h4>
                                            <p className="text-[12px] text-gray-500 font-medium">수량: {order.quantity}개 / {order.totalPrice.toLocaleString()}원</p>
                                        </div>
                                    </div>

                                    {order.status !== 'CANCELLED' ? (
                                        <div className="mt-6">
                                            <div className="flex justify-between items-center mb-1.5">
                                                {['결제완료', '준비중', '출고완료', '배송중', '배송완료'].map((l, i) => (
                                                    <span key={l} className={`text-[9px] font-black ${s.step >= i ? 'text-green-600' : 'text-gray-300'}`}>
                                                        {l}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 transition-all duration-700"
                                                    style={{ width: `${(s.step / 4) * 100}%` }}
                                                />
                                            </div>
                                            <button
                                                onClick={() => router.push(`/mypage/order/cancel/${order.id}`)}
                                                className="w-full mt-5 py-2.5 border border-gray-200 text-[12px] font-black text-gray-500 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all"
                                            >
                                                주문 취소하기
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-4 pt-4 border-t border-gray-50">
                                            <p className="text-[11px] text-center text-gray-400 font-bold">취소된 상품입니다.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="text-4xl mb-4 opacity-30">📦</span>
                        <p className="text-[14px] text-gray-400 font-black">주문 내역이 없습니다.</p>
                        <button
                            onClick={() => router.push('/category')}
                            className="mt-6 px-8 py-3 bg-green-600 text-white text-[13px] font-black rounded-2xl shadow-lg shadow-green-100"
                        >
                            인기 상품 구경가기
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
