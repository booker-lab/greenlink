"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@greenlink/lib/stores";
import { MOCK_FARMS } from "@greenlink/lib/constants";
import { ProductCard } from "@/components/Product/ProductCard";
import { Button, Badge, Avatar, AvatarFallback, AvatarImage } from "@greenlink/ui";
import { ArrowLeft, MapPin, Star } from "lucide-react";

export default function FarmProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { products } = useProductStore();
    const resolvedParams = use(params);

    // Mock Farm Data fetch
    const farm = MOCK_FARMS.find(f => f.id === resolvedParams.id) || MOCK_FARMS[0];
    const farmProducts = products.filter(p => p.farmId === farm.id);

    return (
        <div className="pb-20 bg-gray-50 min-h-screen">
            <header className="bg-white p-4 sticky top-0 z-10 flex items-center gap-2 border-b border-gray-100">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="font-bold text-lg">{farm.name}</h1>
            </header>

            {/* Farm Info Card */}
            <div className="bg-white p-6 pb-8 mb-2">
                <div className="flex flex-col items-center text-center space-y-3">
                    <Avatar className="w-20 h-20 border-2 border-white shadow-lg">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-green-100 text-green-700 text-2xl">👨‍🌾</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-bold flex items-center justify-center gap-1">
                            {farm.owner} 농부님
                            <Badge variant="secondary" className="bg-green-50 text-green-700 text-[10px]">인증 농가</Badge>
                        </h2>
                        <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" /> {farm.location.address}
                        </p>
                    </div>

                    {/* Green Temperature / Stats */}
                    <div className="flex gap-4 mt-2 w-full justify-center">
                        <div className="bg-gray-50 rounded-lg p-3 flex-1 max-w-[100px]">
                            <div className="text-xs text-gray-500 mb-1">초록 온도</div>
                            <div className="font-bold text-green-600 text-lg flex items-center justify-center gap-1">
                                36.5 <span className="text-xs">℃</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 flex-1 max-w-[100px]">
                            <div className="text-xs text-gray-500 mb-1">단골</div>
                            <div className="font-bold text-gray-800 text-lg">128</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 flex-1 max-w-[100px]">
                            <div className="text-xs text-gray-500 mb-1">후기</div>
                            <div className="font-bold text-gray-800 text-lg flex items-center justify-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> 4.9
                            </div>
                        </div>
                    </div>

                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                        단골 맺기 (+100P)
                    </Button>
                </div>
            </div>

            {/* Products */}
            <div className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-1">
                    판매 중인 상품 <span className="text-green-600">{farmProducts.length}</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {farmProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </div>
        </div>
    );
}
