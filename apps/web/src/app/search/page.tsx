"use client";

import { useProductStore } from "@greenlink/lib/stores";
import { ProductCard } from "@/components/Product/ProductCard";
import { Input, Button } from "@greenlink/ui";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";

export default function SearchPage() {
    const { products } = useProductStore();
    const [query, setQuery] = useState("");

    const filteredProducts = query
        ? products.filter(p => p.name.includes(query) || p.farmId.includes(query))
        : [];

    return (
        <div className="space-y-4 pb-20">
            <div className="p-4 sticky top-0 bg-white z-10">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        className="pl-9 bg-gray-50 border-none h-10"
                        placeholder="어떤 농산물을 찾으세요?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>

            <div className="px-4">
                {query ? (
                    <>
                        <h2 className="font-bold mb-3 text-sm">검색 결과 ({filteredProducts.length})</h2>
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {filteredProducts.map(p => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center text-gray-400">
                                검색 결과가 없습니다.
                            </div>
                        )}
                    </>
                ) : (
                    <div>
                        <h2 className="font-bold mb-3 text-sm">최근 검색어</h2>
                        <div className="flex gap-2 flex-wrap">
                            {["토마토", "동양란", "쌈채소"].map(k => (
                                <Button key={k} variant="outline" size="sm" className="rounded-full text-xs h-7" onClick={() => setQuery(k)}>
                                    {k}
                                </Button>
                            ))}
                        </div>

                        <h2 className="font-bold mt-6 mb-3 text-sm">추천 검색어</h2>
                        <div className="flex gap-2 flex-wrap">
                            {["#제철과일", "#오늘수확", "#무료배송"].map(k => (
                                <Button key={k} variant="secondary" size="sm" className="rounded-full text-xs h-7 text-green-700 bg-green-50 hover:bg-green-100" onClick={() => setQuery(k.replace('#', ''))}>
                                    {k}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
