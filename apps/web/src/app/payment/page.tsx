"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { greenlinkApi, ZeroInventoryItem } from "@greenlink/lib";
import Image from "next/image";

declare global {
    interface Window {
        IMP: any;
    }
}

type PaymentStep = 'confirm' | 'processing' | 'done';

function EscrowPaymentContent() {
    const router = useRouter();
    const params = useSearchParams();
    const itemId = params.get('itemId') ?? '';
    const qty = parseInt(params.get('qty') ?? '1', 10);

    const [item, setItem] = useState<ZeroInventoryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState<PaymentStep>('confirm');
    const [agreed, setAgreed] = useState(false);
    const [sdkLoaded, setSdkLoaded] = useState(false);

    // 1. PortOne SDK 동적 로드
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.iamport.kr/v1/iamport.js";
        script.async = true;
        script.onload = () => setSdkLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // 2. 상품 정보 페치
    useEffect(() => {
        let isMounted = true;
        if (itemId) {
            greenlinkApi.getZeroInventoryItem(itemId).then(data => {
                if (isMounted) {
                    setItem(data);
                    setLoading(false);
                }
            });
        } else {
            setLoading(false);
        }
        return () => { isMounted = false; };
    }, [itemId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
                <p className="text-gray-500">결제할 상품 정보를 찾을 수 없습니다.</p>
                <button onClick={() => router.push('/category')} className="text-green-600 font-bold">← 공동구매 목록으로</button>
            </div>
        );
    }

    const totalPrice = item.sellingPrice * qty;
    const remaining = item.targetParticipants - item.currentParticipants;

    function handlePay() {
        if (!item || !window.IMP || !sdkLoaded) {
            alert("결제 시스템을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        const shopId = process.env.NEXT_PUBLIC_PORTONE_SHOP_ID || 'imp00000000';
        window.IMP.init(shopId);

        const merchantUid = `mid_${new Date().getTime()}`;

        window.IMP.request_pay({
            pg: "kakaopay.TC0ONETIME",
            pay_method: "card",
            merchant_uid: merchantUid,
            name: item.itemNm,
            amount: totalPrice,
            buyer_email: "test@greenlink.io",
            buyer_name: "홍길동",
            buyer_tel: "010-1234-5678",
            buyer_addr: "서울특별시 강남구 삼성동",
            buyer_postcode: "123-456",
            custom_data: JSON.stringify({
                productId: item.id,
                quantity: qty
            })
        }, async (rsp: any) => {
            if (rsp.success) {
                setStep('processing');
                try {
                    // 서버사이드 검증 API 호출 (Step 1에서 구현한 webhook 엔드포인트 활용)
                    const verifyResponse = await fetch('/api/payment/webhook', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            imp_uid: rsp.imp_uid,
                            merchant_uid: rsp.merchant_uid,
                            status: 'paid'
                        })
                    });

                    if (verifyResponse.ok) {
                        setStep('done');
                    } else {
                        throw new Error('Verification failed');
                    }
                } catch (err) {
                    console.error('[Payment Domain] Client verification error:', err);
                    alert('결제 검증에 실패했습니다. 고객센터로 문의해주세요.');
                    setStep('confirm');
                }
            } else {
                alert(`결제 실패: ${rsp.error_msg}`);
                setStep('confirm');
            }
        });
    }

    if (step === 'processing') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-white p-8">
                <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
                <p className="text-lg font-bold text-gray-700">결제 예치 중...</p>
                <p className="text-sm text-gray-400 text-center">안전한 에스크로 결제가 진행 중입니다.<br />잠시만 기다려 주세요.</p>
            </div>
        );
    }

    if (step === 'done') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-5 bg-white p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">예치 결제 완료!</h2>
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                    공동구매 참여가 완료되었습니다.<br />
                    <strong className="text-gray-700">{remaining - 1 > 0 ? `${remaining - 1}명` : "1명"}</strong>만 더 모이면 구매가 확정됩니다.<br />
                    미달 시 100% 자동 환불됩니다.
                </p>

                <div className="w-full max-w-sm bg-gray-50 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">상품명</span>
                        <span className="font-bold text-gray-800">{item.itemNm}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">수량</span>
                        <span className="font-bold text-gray-800">{qty}개</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">예치 금액</span>
                        <span className="font-extrabold text-red-500">{totalPrice.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">결제 방식</span>
                        <span className="text-blue-600 font-bold">에스크로 (안전결제)</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full max-w-sm mt-4">
                    <button
                        onClick={() => router.push('/category')}
                        className="w-full py-4 bg-green-600 text-white font-extrabold rounded-2xl shadow-lg shadow-green-100 active:scale-95 transition-all"
                    >
                        공동구매 더 보기
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200"
                    >
                        홈으로 이동
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-28 min-h-screen bg-white">
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 flex items-center gap-3 p-4">
                <button onClick={() => router.back()} className="text-gray-600 hover:bg-gray-100 p-1 rounded-full">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <h1 className="text-[17px] font-bold text-gray-900">공구 참여 결제</h1>
            </header>

            <div className="p-4 space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <div>
                        <p className="text-sm font-extrabold text-blue-700">에스크로(안전결제) 방식</p>
                        <p className="text-xs text-blue-500 mt-0.5">공구 미달성 시 100% 자동 환불. 결제 금액은 구매 확정 전까지 별도 보관됩니다.</p>
                    </div>
                </div>

                <div className="border border-gray-100 rounded-2xl p-4 flex gap-3 items-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={item.imageUrl} alt={item.itemNm} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-extrabold text-gray-900 line-clamp-1">{item.itemNm}</p>
                        <p className="text-xs text-gray-400 mt-0.5">수량: {qty}개</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-base font-extrabold text-red-500">{(item.sellingPrice * qty).toLocaleString()}원</span>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                    <p className="text-sm font-bold text-gray-700 mb-2">공구 참여 현황</p>
                    <div className="w-full bg-white rounded-full h-2.5 overflow-hidden">
                        <div className="h-2.5 bg-gradient-to-r from-red-400 to-orange-400 rounded-full transition-all"
                            style={{ width: `${Math.min((item.currentParticipants / item.targetParticipants) * 100, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1.5 font-medium">
                        <span>{item.currentParticipants}명 참여 중</span>
                        <span>목표 {item.targetParticipants}명 — {remaining}명 남음</span>
                    </div>
                </div>

                <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
                    <p className="text-sm font-bold text-gray-800 mb-3">결제 금액 상세</p>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">상품 금액</span>
                        <span className="font-medium">{item.sellingPrice.toLocaleString()}원 × {qty}</span>
                    </div>
                    <div className="h-px bg-gray-100 my-2" />
                    <div className="flex justify-between text-base font-extrabold">
                        <span>총 예치 금액</span>
                        <span className="text-red-500">{totalPrice.toLocaleString()}원</span>
                    </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-100 rounded-2xl">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                        className="mt-1 w-5 h-5 accent-green-600 rounded"
                    />
                    <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
                        공동구매 참여 조건(10명 달성 시 구매 확정, 미달 시 자동 환불), 에스크로 방식의 결제 조건 및 그린링크 이용약관에 동의합니다.
                    </p>
                </label>
            </div>

            <div className="fixed bottom-[72px] pb-[env(safe-area-inset-bottom)] left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white border-t border-gray-100 p-4">
                <button
                    disabled={!agreed}
                    onClick={handlePay}
                    className={`w-full py-4 font-extrabold text-[16px] rounded-2xl transition-all ${agreed
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

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>}>
            <EscrowPaymentContent />
        </Suspense>
    );
}
