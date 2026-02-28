"use client";

import { useRouter, notFound } from "next/navigation";
import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRealtimeDeal } from "@/hooks/useRealtimeDeal";

const AI_MARKETING: Record<string, string> = {
    "orc-1": "화사한 블루 계열의 호접란으로, 고급스러운 분위기를 자아냅니다. 인테리어 소품이나 선물용으로 인기가 높으며, 최근 경매에서 거래량 1위를 기록한 스테디셀러입니다. 생명력이 강해 초보자도 쉽게 키울 수 있어요.",
    "orc-2": "부드러운 핑크 빛깔의 호접란으로, 깔끔하고 세련된 느낌을 줍니다. 경매 현장에서 품귀 현상을 빚고 있는 인기 품종! 공동구매를 통해 경매 원가로 만나보세요.",
    "orc-3": "웅장한 루비골드 심비디움은 기업 행사, 개업식, 특별한 날에 최적화된 프리미엄 품종입니다. 화훼 전문가의 픽(Pick)으로 선정된 이달의 추천 품목!",
    "orc-4": "덴파레 크리스탈은 작고 깔끔한 크기로 책상, 화장대 위 어디든 잘 어울립니다. 물 주기가 간편하여 바쁜 현대인에게 딱 맞는 선택입니다.",
    "orc-5": "순백의 화이트 스완 호접란은 결혼식, 장례, 기념일 등 특별한 자리에서 품격을 더해줍니다. 빠르게 마감될 품목이니 서두르세요!",
};

const EXPERT_NOTES: Record<string, string> = {
    "orc-1": "2026-02-22 검수 완료 | 화훼 전문 검수관 '박민준' 검증 — 꽃대 3개 이상, 손상 없음, 색상 균일. 등급: A+",
    "orc-2": "2026-02-22 검수 완료 | 화훼 전문 검수관 '박민준' 검증 — 꽃봉오리 상태 양호, 잎 윤기 우수. 등급: A",
    "orc-3": "2026-02-22 검수 완료 | 화훼 전문 검수관 '이수진' 검증 — 화분 무게 균형, 잎 수분 충분. 등급: A+",
    "orc-4": "2026-02-22 검수 완료 | 화훼 전문 검수관 '이수진' 검증 — 크기 균일, 꽃색 발색 선명. 등급: A",
    "orc-5": "2026-02-22 검수 완료 | 화훼 전문 검수관 '박민준' 검증 — 흰 꽃잎 오염 없음, 향기 적당. 등급: A+",
};

export default function KamisItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const { item, loading } = useRealtimeDeal(id);
    const [qty, setQty] = useState(1);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        </div>;
    }

    if (!item) {
        notFound();
    }

    const isCompleted = item.currentParticipants >= item.targetParticipants || item.status === 'COMPLETED';
    const progressPercent = Math.min((item.currentParticipants / item.targetParticipants) * 100, 100);
    const aiContent = AI_MARKETING[item.id] ?? "경매 현장에서 인증된 최고 품질의 화훼 상품입니다. 신선도를 최우선으로 선별하였습니다.";
    const expertNote = EXPERT_NOTES[item.id] ?? "화훼 전문 검수관의 품질 검증이 완료된 상품입니다.";

    return (
        <div className="pb-28 bg-white min-h-screen">
            {/* Header */}
            <div className="relative aspect-square w-full bg-gray-100">
                <Image src={item.imageUrl} alt={item.itemNm} fill className="object-cover" />
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                {isCompleted && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-green-600 text-white font-extrabold text-lg px-6 py-3 rounded-2xl shadow-xl">모집 완료 — 사입 대기</span>
                    </div>
                )}
            </div>

            <div className="p-4 space-y-5">
                {/* Title & Price */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">제로 인벤토리</span>
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">ORC</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-1 leading-tight">{item.itemNm}</h1>
                    <div className="flex items-end gap-2 mt-2">
                        <span className="text-3xl font-extrabold text-red-500">{item.sellingPrice.toLocaleString()}<span className="text-lg">원</span></span>
                        <span className="text-base text-gray-400 line-through mb-0.5">경매가 {item.avgCost.toLocaleString()}원</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">경매 물량(최근 7일): <strong className="text-gray-700">{item.qty.toLocaleString()}개</strong></p>
                </div>

                {/* Zero-Inventory Progress */}
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                    <div className="flex justify-between font-bold text-sm mb-2">
                        <span className="text-gray-700">참여 현황</span>
                        <span className="text-green-700">{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-inner">
                        <div
                            className={`h-3 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-red-400 to-orange-400'}`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                        <span>현재 {item.currentParticipants}명 참여</span>
                        <span>목표 {item.targetParticipants}명</span>
                    </div>
                    <p className="text-xs text-center text-green-700 mt-3 font-bold">
                        {isCompleted
                            ? "모집 완료! 익일 새벽 경매장에서 사입하여 바로 배송됩니다."
                            : `${item.targetParticipants - item.currentParticipants}명만 더 모이면 구매가 확정됩니다!`}
                    </p>
                </div>

                {/* AI Marketing Widget */}
                <div className="border border-blue-100 bg-blue-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-extrabold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">AI V2S 마케팅</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{aiContent}</p>
                </div>

                {/* Expert Inspector Report */}
                <div className="border border-yellow-100 bg-yellow-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                        <span className="text-xs font-extrabold text-yellow-700">전문가 검수 리포트</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{expertNote}</p>
                </div>

                {/* 공동구매 안내 */}
                <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
                    <h3 className="text-sm font-extrabold text-gray-800">공동구매 진행 안내</h3>
                    <ul className="text-xs text-gray-500 space-y-1.5">
                        <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>결제 예치 후 10명 도달 시 자동으로 구매 확정됩니다.</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>모집 기한 내 미달 시 100% 전액 자동 환불 보장.</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>사입 후 D+2 이내 현관 앞 냉장 배송 완료 예정.</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>참여 후 24시간 이내 취소 가능합니다.</li>
                    </ul>
                </div>

                {/* Quantity Selector */}
                {!isCompleted && (
                    <div className="flex items-center justify-between border border-gray-100 rounded-2xl p-4">
                        <span className="text-sm font-bold text-gray-700">구매 수량</span>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600 hover:bg-gray-200">-</button>
                            <span className="font-extrabold text-gray-900 w-4 text-center">{qty}</span>
                            <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 font-bold text-green-700 hover:bg-green-200">+</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Bottom CTA */}
            <div className="fixed bottom-[72px] pb-[env(safe-area-inset-bottom)] left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white border-t border-gray-100 p-4">
                {isCompleted ? (
                    <button disabled className="w-full py-4 bg-gray-200 text-gray-400 font-extrabold text-[16px] rounded-2xl">
                        모집 완료 (참여 불가)
                    </button>
                ) : (
                    <button
                        onClick={() => router.push(`/payment?itemId=${item.id}&qty=${qty}`)}
                        className="w-full py-4 bg-green-600 text-white font-extrabold text-[16px] rounded-2xl shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95 transition-all"
                    >
                        공구 참여 (결제예치) — {(item.sellingPrice * qty).toLocaleString()}원
                    </button>
                )}
            </div>
        </div>
    );
}
