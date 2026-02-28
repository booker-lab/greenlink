"use client";

import { useProductStore } from "@greenlink/lib/stores";
import { ProductCard } from "@/components/Product/ProductCard";
import { Input, Button } from "@greenlink/ui";
import { useState } from "react";

export default function SearchPage() {
    const { products } = useProductStore();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = products.filter((p: any) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = ["전체", "채소", "과일", "곡류", "축산", "가공식품"];

    return (
        <div className="bg-white min-h-screen">
            {/* Search Header */}
            <div className="p-4 sticky top-0 bg-white z-10 space-y-3 border-b border-gray-100">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
                    <Input
                        className="pl-9 bg-gray-50 border-none h-11 focus-visible:ring-green-500"
                        placeholder="사과, 배추, 삼겹살..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant="ghost"
                            size="sm"
                            {...({ className: "whitespace-nowrap px-4 bg-gray-50 hover:bg-green-50 hover:text-green-600 rounded-full h-8 text-xs font-medium" } as any)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="p-4">
                <p className="text-xs text-gray-500 mb-4">검색 결과 {filteredProducts.length}개</p>
                <div className="grid grid-cols-2 gap-3">
                    {filteredProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {filteredProducts.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-gray-400">검색 결과가 없습니다 😢</p>
                    </div>
                )}
            </div>
        </div>
    );
}
