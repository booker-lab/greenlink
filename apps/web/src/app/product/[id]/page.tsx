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

                {/* 공구 진행 현황 */}
                <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-green-800">공동구매 현황</span>
                        <span className="font-bold text-green-700">
                            {item.currentParticipants} / {item.targetParticipants}명
                        </span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                        <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(100, (item.currentParticipants / item.targetParticipants) * 100)}%` }}
                        />
                    </div>
                    {item.status === "GOAL_MET" && (
                        <p className="text-xs font-bold text-green-700 mt-1 text-center">
                            모집 완료! 사입 진행 예정
                        </p>
                    )}
                </div>

                <div className="prose prose-sm text-gray-600 mt-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">상품 상세 정보</h3>
                    <p>산지 직배송으로 신선하게 전달해 드립니다.</p>
                    <ul className="list-disc pl-4 space-y-1 text-xs mt-2">
                        <li>원산지: 국내산</li>
                        <li>경매 물량: {item.qty.toLocaleString()}본</li>
                        <li>보관방법: 서늘한 곳에 보관</li>
                    </ul>
                </div>
            </div>

            {/* Bottom CTA */}
            <ProductCTA productId={id} />
        </div>
    );
}
