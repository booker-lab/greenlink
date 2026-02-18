"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@greenlink/lib/stores";
import { Button, Badge } from "@greenlink/ui";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { products } = useProductStore();
    const resolvedParams = use(params);
    const product = products.find((p: any) => p.id === resolvedParams.id);

    if (!product) return <div className="p-8 text-center">상품을 찾을 수 없습니다.</div>;

    return (
        <div className="pb-24 bg-white min-h-screen">
            {/* Header Image */}
            <div className="relative aspect-square bg-gray-100 flex items-center justify-center text-8xl">
                <Button
                    variant="ghost"
                    size="icon"
                    {...({ className: "absolute top-4 left-4 bg-white/50 hover:bg-white rounded-full z-10", onClick: () => router.back() } as any)}
                >
                    ←
                </Button>
                {product.images?.[0] ? <img src={product.images[0]} className="w-full h-full object-cover" /> : "🌿"}
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-green-600 font-bold">{product.farmId}</span>
                        <Badge variant="outline" {...({ className: "text-[10px] px-1 py-0 border-green-200 bg-green-50 text-green-700" } as any)}>인증 농가</Badge>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500">정상가 {product.originalPrice?.toLocaleString()}원</p>
                        <p className="text-2xl font-bold text-gray-900">{product.price.toLocaleString()}원</p>
                    </div>
                    <Badge className="bg-red-50 text-red-600 border-red-100 px-2 py-1 text-sm">
                        {product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0}% 할인
                    </Badge>
                </div>

                <div className="prose prose-sm text-gray-600 mt-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">상품 상세 정보</h3>
                    <p>
                        {product.description || "신선한 우리 농산물입니다. 산지에서 직접 배송해 드려요."}
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-xs mt-2">
                        <li>원산지: 국내산</li>
                        <li>포장단위: {product.unit}</li>
                        <li>보관방법: 서늘한 곳에 보관</li>
                    </ul>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-area-pb z-50 flex gap-2">
                <Button
                    variant="outline"
                    {...({ className: "flex-1 border-green-600 text-green-700 hover:bg-green-50 h-12 flex-col gap-0 leading-none py-1", onClick: () => router.push('/group-buy') } as any)}
                >
                    <span className="text-[10px] flex items-center gap-1">👥 함께 사면</span>
                    <span className="font-bold">더 저렴해요!</span>
                </Button>

                <Button
                    className="flex-[2] bg-green-600 hover:bg-green-700 h-12 text-lg font-bold"
                    onClick={() => router.push(`/order?productId=${product.id}`)}
                >
                    구매하기
                </Button>
            </div>
        </div>
    );
}
