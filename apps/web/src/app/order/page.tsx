"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { greenlinkApi, ZeroInventoryItem, useUserStore } from "@greenlink/lib";
import Image from "next/image";
import { Checkbox } from "@greenlink/ui";

function OrderPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const itemId = searchParams.get("itemId") ?? "";
    const qty = parseInt(searchParams.get("qty") ?? "1", 10);

    const { user, isAuthenticated, isInitialized } = useUserStore();
    const [item, setItem] = useState<ZeroInventoryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState<'form' | 'processing' | 'done'>('form');

    const [buyerName, setBuyerName] = useState("");
    const [buyerPhone, setBuyerPhone] = useState("");
    const [address, setAddress] = useState("");
    const [agreed, setAgreed] = useState(false);

    // 비로그인 가드
    useEffect(() => {
        if (!isInitialized) return;
        if (!isAuthenticated) {
            router.push(`/login?next=${encodeURIComponent(window.location.href)}`);
        }
    }, [isInitialized, isAuthenticated, router]);

    // 상품 정보 Fetch (greenlinkApi 사용 - useProductStore 의존성 제거)
    useEffect(() => {
        if (!itemId) { setLoading(false); return; }
        greenlinkApi.getZeroInventoryItem(itemId).then((data) => {
            setItem(data);
            setLoading(false);
        });
    }, [itemId]);

    const isFormValid = Boolean(item && buyerName.trim() && buyerPhone.trim() && address.trim() && agreed);

    const handlePay = async () => {
        if (!item || !user) return;
        setStep('processing');
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            await greenlinkApi.createEscrowOrder(
                user.id,          // userId: 누락되었던 인자 복구
                item.id,
                qty,
                { name: buyerName, phone: buyerPhone, address }
            );
            setStep('done');
        } catch (err: any) {
            console.error('[Order] Payment failed:', err);
            alert(`결제 처리 중 오류가 발생했습니다: ${err.message}`);
            setStep('form');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
        </div>
    );

    if (!item || !itemId) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
            <p className="text-gray-400 font-bold">상품 정보를 찾을 수 없습니다.</p>
            <button onClick={() => router.push('/category')} className="text-green-600 font-black">← 공동구매 목록으로</button>
        </div>
    );

    if (step === 'processing') return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-5 bg-white p-8">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            <p className="text-lg font-black text-gray-700">결제 예치 중...</p>
            <p className="text-sm text-gray-400 text-center">안전한 에스크로 결제가 진행 중입니다.<br />잠시만 기다려 주세요.</p>
        </div>
    );

    if (step === 'done') {
        const remaining = item.targetParticipants - item.currentParticipants;
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-5 bg-white p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg shadow-green-100">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
                    </svg>
                </div>
                <h2 className="text-2xl font-black text-gray-900">예치 결제 완료!</h2>
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                    공동구매 참여가 완료되었습니다.<br />
                    <strong className="text-gray-700">{remaining - 1 > 0 ? `${remaining - 1}명` : "1명"}</strong>만 더 모이면 구매가 확정됩니다.<br />
                    미달 시 100% 자동 환불됩니다.
                </p>
                <div className="w-full max-w-sm bg-gray-50 rounded-2xl p-4 space-y-2.5">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">상품명</span>
                        <span className="font-bold text-gray-800 text-right line-clamp-1 max-w-[180px]">{item.itemNm}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">수량</span>
                        <span className="font-bold text-gray-800">{qty}개</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-gray-100 pt-2.5">
                        <span className="text-gray-500">예치 금액</span>
                        <span className="font-black text-red-500">{(item.sellingPrice * qty).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">결제 방식</span>
                        <span className="text-blue-600 font-bold">에스크로 (안전결제)</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2.5 w-full max-w-sm mt-2">
                    <button
                        onClick={() => router.push('/mypage/order')}
                        className="w-full py-4 bg-green-600 text-white font-black rounded-2xl shadow-lg shadow-green-100 active:scale-95 transition-all"
                    >
                        주문 내역 확인하기
                    </button>
                    <button
                        onClick={() => router.push('/category')}
                        className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200"
                    >
                        공동구매 더 보기
                    </button>
                </div>
            </div>
        );
    }

    // 주문 폼 View
    const totalPrice = item.sellingPrice * qty;
    return (
        <div className="pb-48 min-h-screen bg-gray-50">
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 flex items-center gap-3 p-4">
                <button onClick={() => router.back()} className="text-gray-600 p-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <h1 className="text-[17px] font-black text-gray-900">주문 정보 입력</h1>
            </header>

            <main className="p-4 space-y-3">
                {/* Product Summary */}
                <section className="bg-white rounded-2xl p-4 flex gap-3 shadow-sm border border-gray-50">
                    <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                        {item.imageUrl ? (
                            <Image src={item.imageUrl} alt={item.itemNm} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-[14px] font-black text-gray-900 line-clamp-1 mb-0.5">{item.itemNm}</p>
                        <p className="text-[12px] text-gray-400 font-medium">수량: {qty}개</p>
                        <p className="text-[16px] font-black text-red-500 mt-1">{totalPrice.toLocaleString()}원</p>
                    </div>
                </section>

                {/* Buyer Info Form */}
                <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-4">
                    <h2 className="text-[14px] font-black text-gray-900">배송 정보</h2>
                    <div>
                        <label className="text-[11px] font-bold text-gray-400 mb-1 block">받는 분 성함 *</label>
                        <input
                            value={buyerName}
                            onChange={e => setBuyerName(e.target.value)}
                            placeholder="홍길동"
                            className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-400 font-medium"
                        />
                    </div>
                    <div>
                        <label className="text-[11px] font-bold text-gray-400 mb-1 block">연락처 *</label>
                        <input
                            value={buyerPhone}
                            onChange={e => setBuyerPhone(e.target.value)}
                            placeholder="010-0000-0000"
                            type="tel"
                            className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-400 font-medium"
                        />
                    </div>
                    <div>
                        <label className="text-[11px] font-bold text-gray-400 mb-1 block">배송지 주소 *</label>
                        <input
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="서울특별시 강남구 ..."
                            className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-400 font-medium"
                        />
                    </div>
                </section>

                {/* Price Summary */}
                <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
                    <h2 className="text-[14px] font-black text-gray-900 mb-3">결제 금액</h2>
                    <div className="space-y-2.5">
                        <div className="flex justify-between text-[13px] text-gray-500">
                            <span>상품 금액</span>
                            <span className="font-medium">{item.sellingPrice.toLocaleString()}원 × {qty}</span>
                        </div>
                        <div className="flex justify-between text-[13px] text-gray-500">
                            <span>배송비</span>
                            <span className="font-medium text-blue-500">무료</span>
                        </div>
                        <div className="pt-2.5 border-t border-gray-50 flex justify-between font-black text-[16px]">
                            <span className="text-gray-900">총 결제금액</span>
                            <span className="text-red-500">{totalPrice.toLocaleString()}원</span>
                        </div>
                    </div>
                </section>

                {/* Agreement */}
                <div className="px-1">
                    <Checkbox id="pay-agree" checked={agreed} onCheckedChange={(e: { checked: boolean | "indeterminate" }) => setAgreed(!!e.checked)} className="p-5 bg-white shadow-sm border border-gray-50 rounded-2xl items-start gap-4">
                        <p className="text-[12px] text-gray-500 leading-relaxed font-medium">
                            공동구매 참여 조건(목표 인원 달성 시 확정, 미달 시 자동 환불), 에스크로 결제 조건 및 그린링크 이용약관에 동의합니다.
                        </p>
                    </Checkbox>
                </div>
            </main>

            {/* Bottom CTA */}
            <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white border-t border-gray-100 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <button
                    disabled={!isFormValid}
                    onClick={handlePay}
                    className={`w-full py-4 font-black text-[16px] rounded-2xl transition-all ${isFormValid
                        ? 'bg-green-600 text-white shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                >
                    {totalPrice.toLocaleString()}원 예치 결제하기
                </button>
            </div>
        </div>
    );
}

export default function OrderPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            </div>
        }>
            <OrderPageContent />
        </Suspense>
    );
}
