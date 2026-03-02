"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { greenlinkApi, ZeroInventoryItem, useUserStore } from "@greenlink/lib";
import Image from "next/image";
import {
    Button,
    Card, CardContent,
    Checkbox,
    Progress,
    Badge,
    cn
} from "@greenlink/ui";
import { ChevronLeft, ShieldCheck, CreditCard, Info, CheckCircle2, Loader2, Wallet, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    const { user } = useUserStore();

    const [item, setItem] = useState<ZeroInventoryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState<PaymentStep>('confirm');
    const [agreed, setAgreed] = useState(false);

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
            <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg-subtle)]">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 text-center bg-[var(--color-bg-subtle)]">
                <div className="p-8 rounded-[40px] bg-white shadow-2xl border border-gray-100 italic text-gray-400 font-bold">
                    결제할 상품 정보를 찾을 수 없습니다.
                </div>
                <Button variant="outline" onClick={() => router.push('/category')} className="rounded-2xl px-8 h-14 font-black">
                    ← 공동구매 목록으로
                </Button>
            </div>
        );
    }

    const totalPrice = item.sellingPrice * qty;
    const remaining = item.targetParticipants - item.currentParticipants;

    async function handlePay() {
        if (!item) return;
        if (!user) {
            alert('로그인 세션이 만료되었습니다. 다시 로그인해 주세요.');
            router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        setStep('processing');
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            await greenlinkApi.createEscrowOrder(
                user?.id || 'guest',
                item.id,
                qty,
                {
                    name: "그린러버(테스트)",
                    phone: "010-0000-0000",
                    address: "서울특별시 강남구 테스트로 123"
                }
            );
            setStep('done');
        } catch (err: any) {
            console.error('[Payment Domain] Sandbox payment error:', err);
            alert(`결제 처리 중 오류가 발생했습니다: ${err.message}`);
            setStep('confirm');
        }
    }

    if (step === 'processing') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-white p-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-100 blur-2xl rounded-full" />
                    <Loader2 className="w-16 h-16 text-emerald-600 animate-spin relative" strokeWidth={2.5} />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-xl font-black text-gray-900 tracking-tight">안전 결제 예치 중...</p>
                    <p className="text-sm text-gray-400 font-bold">에스크로 시스템이 결제 대금을<br />안전하게 보관하고 있습니다.</p>
                </div>
            </div>
        );
    }

    if (step === 'done') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg)] p-6"
            >
                <Card className="w-full max-w-sm border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-white/70 backdrop-blur-2xl px-6 py-10 text-center">
                    <motion.div
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12 }}
                        className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[36px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-200"
                    >
                        <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
                    </motion.div>

                    <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">참여 완료!</h2>
                    <p className="text-[14px] text-gray-500 font-bold leading-relaxed mb-8">
                        공동구매 참여가 정상 처리되었습니다.<br />
                        <span className="text-emerald-500 underline underline-offset-4">{remaining - 1 > 0 ? `${remaining - 1}명` : "1명"}</span>만 더 모이면 최종 확정됩니다.
                    </p>

                    <div className="bg-gray-50/50 rounded-3xl p-5 space-y-3 mb-10 text-left border border-gray-100">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">PRODUCT</span>
                            <span className="font-black text-gray-900">{item.itemNm}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">QUANTITY</span>
                            <span className="font-black text-gray-900">{qty}개</span>
                        </div>
                        <div className="h-px bg-gray-200/50 my-1" />
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">DEPOSIT</span>
                            <span className="font-black text-red-500 text-lg">{totalPrice.toLocaleString()}원</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button variant="premium" className="w-full h-14 rounded-2xl shadow-xl font-black text-lg" onClick={() => router.push('/category')}>
                            공동구매 더 보기
                        </Button>
                        <Button variant="ghost" className="w-full h-14 rounded-2xl text-gray-400 font-black hover:bg-gray-50 transition-colors" onClick={() => router.push('/')}>
                            홈으로 이동
                        </Button>
                    </div>
                </Card>
            </motion.div>
        );
    }

    return (
        <div className="pb-32 min-h-screen bg-[var(--color-bg)]">
            <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 px-4 py-4 flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-full h-10 w-10 p-0">
                    <ChevronLeft className="w-6 h-6 text-gray-700" strokeWidth={2.5} />
                </Button>
                <h1 className="text-[18px] font-black text-gray-900 tracking-tight">공구 결제</h1>
            </header>

            <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 space-y-6"
            >
                {/* Escrow Banner */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-[32px] p-6 flex items-start gap-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    <ShieldCheck className="w-8 h-8 text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                    <div className="space-y-1">
                        <p className="text-sm font-black text-blue-900">에스크로(안전결제) 보호</p>
                        <p className="text-[12px] text-blue-700/70 font-bold leading-relaxed">목표 미달 시 100% 자동 환불되며, 대금은 구매 확정 전까지 안전하게 보관됩니다.</p>
                    </div>
                </div>

                {/* Product Info Card */}
                <Card className="overflow-hidden border-none shadow-xl bg-white/80 backdrop-blur-md">
                    <CardContent className="p-4 flex gap-5 items-center">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-inner">
                            <Image src={item.imageUrl} alt={item.itemNm} fill className="object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <Badge variant="outline" className="text-[10px] h-5 px-2 bg-emerald-50 text-emerald-600 border-none font-black mb-1">SELECTED</Badge>
                            <p className="text-base font-black text-gray-900 line-clamp-1">{item.itemNm}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400 font-bold">수량: {qty}개</span>
                                <span className="text-lg font-black text-gray-900">{(item.sellingPrice * qty).toLocaleString()}원</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Participation Progress */}
                <Card className="border-none shadow-xl bg-gradient-to-br from-white to-orange-50/30">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Users className="w-4 h-4 text-orange-500" strokeWidth={3} />
                            </div>
                            <p className="text-[14px] font-black text-gray-900">공구 달성 현황</p>
                        </div>

                        <div className="space-y-3">
                            <Progress value={Math.min((item.currentParticipants / item.targetParticipants) * 100, 100)} className="h-3" />
                            <div className="flex justify-between items-center text-xs font-black">
                                <span className="text-orange-600">{item.currentParticipants}명 참여</span>
                                <span className="text-gray-300">목표 {item.targetParticipants}명 ({remaining}명 남음)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Detail */}
                <Card className="border-none shadow-xl bg-white">
                    <CardContent className="p-6 space-y-5">
                        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-emerald-500" />
                            최종 결제 금액
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-bold text-gray-400">
                                <span>상품 금액</span>
                                <span className="text-gray-600">{item.sellingPrice.toLocaleString()}원 × {qty}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-gray-400">
                                <span>배송비</span>
                                <span className="text-emerald-500">배송비 전액 지원 (이벤트)</span>
                            </div>
                            <div className="h-px bg-gray-100 my-2" />
                            <div className="flex justify-between items-baseline">
                                <span className="text-base font-black text-gray-900">총 예치 금액</span>
                                <span className="text-2xl font-black text-red-500">{totalPrice.toLocaleString()}원</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Agreement */}
                <div className="px-2">
                    <Checkbox id="pay-agree" checked={agreed} onCheckedChange={(e: { checked: boolean | "indeterminate" }) => setAgreed(!!e.checked)} className="p-5 bg-white shadow-lg border-none rounded-[28px] items-start gap-4">
                        <p className="text-[13px] text-gray-500 leading-relaxed font-bold mt-0.5">
                            공동구매 참여 조건(<span className="text-gray-900 text-[14px]">미달 시 100% 자동 환불</span>), 에스크로 방식의 안전 결제 보관 및 이용약관에 전체 동의합니다.
                        </p>
                    </Checkbox>
                </div>
            </motion.main>

            {/* Bottom Button Area */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4 pb-[env(safe-area-inset-bottom,20px)] pt-4 bg-white/80 backdrop-blur-2xl border-t border-gray-100">
                <Button
                    variant={agreed ? "premium" : "outline"}
                    disabled={!agreed}
                    onClick={handlePay}
                    className={cn(
                        "w-full h-16 rounded-2xl font-black text-lg transition-all duration-300",
                        !agreed && "opacity-50 grayscale cursor-not-allowed"
                    )}
                >
                    {totalPrice.toLocaleString()}원 예치 결제하기
                </Button>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}>
            <EscrowPaymentContent />
        </Suspense>
    );
}

