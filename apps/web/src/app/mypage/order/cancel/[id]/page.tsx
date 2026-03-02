"use client"

import { useUserStore, greenlinkApi, Order } from "@greenlink/lib";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CancelRequestPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user, isAuthenticated, isInitialized } = useUserStore();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addBackToCart, setAddBackToCart] = useState(true);
    const [selectedReason, setSelectedReason] = useState("");
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const reasons = [
        "단순 변심",
        "주문 실수 (옵션/수량 등)",
        "더 저렴한 상품을 찾음",
        "배송 예정일이 너무 늦음",
        "기타 (직접 입력)"
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !isInitialized) return;
        if (!isAuthenticated) {
            router.push(`/login?next=/mypage/order/cancel/${id}`);
            return;
        }

        const fetchOrder = async () => {
            try {
                const data = await greenlinkApi.getOrder(id);
                if (!data) {
                    alert("주문 정보를 찾을 수 없습니다.");
                    router.back();
                    return;
                }
                setOrder(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [mounted, isInitialized, isAuthenticated, id, router]);

    if (!mounted || loading || !order) return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-8 h-8 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
        </div>
    );

    const handleCancel = async () => {
        try {
            const success = await greenlinkApi.cancelOrder(order.id, addBackToCart);
            if (success) {
                router.push("/mypage/order/cancel/complete");
            } else {
                alert("주문 취소에 실패했습니다. 다시 시도해 주세요.");
            }
        } catch (e) {
            console.error(e);
            alert("오류가 발생했습니다.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans">
            {/* Header */}
            <header className="sticky top-0 bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-4 z-40">
                <button onClick={() => router.back()} className="p-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1 className="text-[16px] font-black text-gray-900">취소 요청</h1>
            </header>

            <main className="space-y-3">
                {/* Product Info */}
                <section className="bg-white p-5">
                    <h3 className="text-[13px] font-black text-gray-900 mb-4">상품 정보</h3>
                    <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shadow-inner border border-gray-100 relative">
                            {order.product?.image_url ? (
                                <Image src={order.product.image_url} alt="product" fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-3xl">🌱</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-[14px] font-bold text-gray-900 line-clamp-2 leading-tight mb-1">
                                {order.product?.item_nm || "공동구매 상품"}
                            </p>
                            <p className="text-[12px] text-gray-400 font-medium">수량: {order.quantity}개</p>
                            <p className="text-[15px] font-black text-gray-900 mt-1.5">{order.totalPrice.toLocaleString()}원</p>
                        </div>
                    </div>
                </section>

                {/* Cancel Reason */}
                <section className="bg-white p-5">
                    <h3 className="text-[13px] font-black text-gray-900 mb-4">취소 사유 선택 <span className="text-red-500">*</span></h3>
                    <div className="space-y-3">
                        {reasons.map((reason) => (
                            <label key={reason} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="reason"
                                    value={reason}
                                    checked={selectedReason === reason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedReason === reason ? 'border-green-600 bg-green-600' : 'border-gray-200'}`}>
                                    {selectedReason === reason && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className={`text-[14px] font-bold ${selectedReason === reason ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {reason}
                                </span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Refund Info */}
                <section className="bg-white p-5">
                    <h3 className="text-[13px] font-black text-gray-900 mb-4">예상 환불 정보</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-[13px] font-medium text-gray-600">
                            <span>총 상품 금액</span>
                            <span className="text-gray-900 font-bold">{order.totalPrice.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px] font-medium text-gray-600">
                            <span>총 배송비</span>
                            <span className="text-gray-900 font-bold">0원</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px] font-medium text-gray-600">
                            <span>총 할인 금액</span>
                            <span className="text-gray-900 font-bold">0원</span>
                        </div>
                        <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                            <span className="text-[14px] font-black text-gray-900">최종 환불 금액</span>
                            <span className="text-[18px] font-black text-green-600">{order.totalPrice.toLocaleString()}원</span>
                        </div>
                    </div>
                </section>

                <section className="p-5">
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                        • 공동구매 성공 시점 전까지는 100% 전액 환불이 가능합니다.<br />
                        • 산지 직송 대기 중인 상태에서 취소 시 환불 처리가 길어질 수 있습니다.<br />
                        • 카드 결제의 경우 취소 완료 후 영업일 기준 3~5일 이내 환불됩니다.
                    </p>
                </section>
            </main>

            {/* Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-30">
                <button
                    onClick={() => {
                        if (!selectedReason) {
                            alert("취소 사유를 선택해 주세요.");
                            return;
                        }
                        setIsModalOpen(true);
                    }}
                    className="w-full py-4 bg-gray-900 text-white text-[15px] font-black rounded-2xl active:scale-[0.98] transition-all"
                >
                    취소 요청하기
                </button>
            </div>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[28px] overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
                        <div className="p-8 text-center">
                            <h2 className="text-[18px] font-black text-gray-900 mb-6">취소 요청을 하시겠습니까?</h2>

                            <div className="bg-gray-50 rounded-2xl p-4 mb-8 flex items-center justify-center gap-3 cursor-pointer" onClick={() => setAddBackToCart(!addBackToCart)}>
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${addBackToCart ? 'bg-green-600 border-green-600' : 'border-gray-300 bg-white'}`}>
                                    {addBackToCart && (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-[13px] font-bold text-gray-700">취소 상품 장바구니에 다시 담기</span>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-gray-100 text-gray-500 text-[15px] font-black rounded-2xl hover:bg-gray-200 active:scale-95 transition-all"
                                >
                                    아니요
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 py-4 bg-green-600 text-white text-[15px] font-black rounded-2xl shadow-lg shadow-green-100 active:scale-95 transition-all"
                                >
                                    네
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
