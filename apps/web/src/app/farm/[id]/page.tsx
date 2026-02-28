"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useFarmStore, useProductStore } from "@greenlink/lib/stores";
import { Button, Avatar, AvatarFallback } from "@greenlink/ui";

export default function FarmProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { farms } = useFarmStore();
    const { products } = useProductStore();
    const resolvedParams = use(params);
    const farm = farms.find((f) => f.id === resolvedParams.id);

    if (!farm) {
        import("next/navigation").then((mod) => mod.notFound());
        return null; // unreachable but required for type safety
    }

    const farmProducts = products.filter((p) => p.farmId === farm?.id);

    return (
        <div className="pb-8 bg-white min-h-screen">
            {/* Simple Header */}
            <header className="p-4 flex items-center gap-2 sticky top-0 bg-white z-10 border-b border-gray-50">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    ←
                </Button>
                <h1 className="font-bold">농가 프로필</h1>
            </header>

            {/* Profile Section */}
            <section className="p-6 text-center space-y-4">
                <div className="flex justify-center">
                    <Avatar className="w-24 h-24 border-4 border-green-50">
                        <AvatarFallback className="text-2xl bg-green-100 text-green-700">
                            {farm.profileEmoji || farm.name[0]}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{farm.name}</h2>
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
                        📍 {farm.location.address}
                    </p>
                </div>

                <div className="flex justify-center gap-6 py-2 border-y border-gray-50">
                    <div className="text-center">
                        <p className="text-xs text-gray-400">평점</p>
                        <p className="font-bold flex items-center gap-1">
                            ⭐ 4.9
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-400">단골수</p>
                        <p className="font-bold">1.2k</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-400">상품수</p>
                        <p className="font-bold">{farmProducts.length}</p>
                    </div>
                </div>
            </section>

            {/* Farm Introduction */}
            <section className="px-6 py-4 space-y-2">
                <h3 className="font-bold text-gray-900">농가 소개</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    안녕하세요! {farm.location.address}에서 정성을 다해 키우고 있는 {farm.name}입니다.
                    신선하고 건강한 먹거리를 이웃분들에게 직접 전달해 드리고 싶어 그린링크에 참여하게 되었습니다.
                </p>
            </section>

            {/* Products grid */}
            <section className="px-4 py-6">
                <h3 className="font-bold text-gray-900 mb-4 px-2">판매 중인 상품</h3>
                <div className="grid grid-cols-2 gap-3">
                    {farmProducts.map((product) => (
                        <div key={product.id} className="space-y-2" onClick={() => router.push(`/product/${product.id}`)}>
                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-4xl">
                                🌿
                            </div>
                            <div className="px-1">
                                <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                                <p className="font-bold text-sm">{product.price.toLocaleString()}원</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
