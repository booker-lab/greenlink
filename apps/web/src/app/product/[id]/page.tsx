import { notFound } from "next/navigation";
import Image from "next/image";
import { greenlinkApi } from "@greenlink/lib/api";
import { Badge } from "@greenlink/ui";
import { BackButton } from "@/components/Product/BackButton";
import { ProductCTA } from "@/components/Product/ProductCTA";

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { id } = await params;
    const item = await greenlinkApi.getZeroInventoryItem(id);

    if (!item) notFound();

    const discountRate = item.avgCost > 0
        ? Math.max(0, Math.round((1 - item.sellingPrice / (item.avgCost * 1.5)) * 100))
        : 0;

    const imageUrl = item.imageUrl ?? null;

    return (
        <div className="pb-24 bg-white min-h-screen">
            {/* Header Image */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden flex items-center justify-center text-8xl">
                <BackButton />
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={item.itemNm}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 480px"
                        unoptimized
                    />
                ) : (
                    <span>🌿</span>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-green-600 font-bold">GreenLink 직배송</span>
                        <Badge variant="outline" className="text-[10px] px-1 py-0 border-green-200 bg-green-50 text-green-700">
                            인증 농가
                        </Badge>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">{item.itemNm}</h1>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500">경매 평균가 {item.avgCost.toLocaleString()}원</p>
                        <p className="text-2xl font-bold text-gray-900">{item.sellingPrice.toLocaleString()}원</p>
                    </div>
                    {discountRate > 0 && (
                        <Badge className="bg-red-50 text-red-600 border-red-100 px-2 py-1 text-sm">
                            {discountRate}% 이상 절약
                        </Badge>
                    )}
                </div>

                {/* 공구 진행 현황 - 실시간 데이터 연동 시각화 */}
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <span className="text-xs font-bold text-green-800 uppercase tracking-tight">공동구매 현황</span>
                            <div className="text-lg font-black text-green-900 leading-tight">
                                {item.currentParticipants}명 <span className="text-green-600 font-medium">참여 중</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-gray-400 block mb-0.5">목표 인원</span>
                            <span className="text-sm font-bold text-gray-700">{item.targetParticipants}명</span>
                        </div>
                    </div>

                    <div className="w-full bg-white rounded-full h-2.5 shadow-inner overflow-hidden border border-green-100/50">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${item.status === 'GOAL_MET' ? 'bg-green-500' : 'bg-gradient-to-r from-red-400 to-green-500'}`}
                            style={{ width: `${Math.min(100, (item.currentParticipants / item.targetParticipants) * 100)}%` }}
                        />
                    </div>

                    <p className="text-[11px] text-center text-green-700 mt-2 font-bold tracking-tight">
                        {item.status === 'GOAL_MET' ? '🎉 목표 달성! 익일 새벽 경매장에서 바로 사입됩니다.' : `${item.targetParticipants - item.currentParticipants}명 더 모이면 공구 성공!`}
                    </p>
                </div>

                {/* 상품 상세 정보 */}
                <div className="pt-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">상품 상세 정보</h3>
                    <div className="text-xs text-gray-600 leading-relaxed bg-white border border-gray-100 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                            <span className="text-gray-400">원산지</span>
                            <span className="font-medium text-gray-900">국내산</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                            <span className="text-gray-400">경매 물량 (최근 7일)</span>
                            <span className="font-medium text-gray-900">{item.qty.toLocaleString()}본</span>
                        </div>
                        <p className="pt-1 text-gray-500 select-none">🌿 전문가 검수가 완료된 최상급 품질만을 엄선하여 산지에서 직배송합니다.</p>
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <ProductCTA productId={id} />
        </div>
    );
}
