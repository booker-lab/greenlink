"use client";

import { useProductStore } from "@greenlink/lib/stores";
import { ProductCard } from "@/components/Product/ProductCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@greenlink/ui";

const CATEGORIES = ["전체", "화훼", "과일", "채소", "쌀/잡곡"];

export default function CategoryPage() {
    const { products } = useProductStore();

    return (
        <div className="pb-20">
            <header className="p-4 bg-white sticky top-0 z-10 border-b border-gray-100">
                <h1 className="font-bold text-lg">카테고리</h1>
            </header>

            <Tabs defaultValue="전체" className="w-full">
                <div className="overflow-x-auto no-scrollbar border-b border-gray-100 bg-white sticky top-[61px] z-10">
                    <TabsList className="w-full justify-start h-12 bg-transparent p-0 rounded-none">
                        {CATEGORIES.map(cat => (
                            <TabsTrigger
                                key={cat}
                                value={cat}
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 px-4 h-full"
                            >
                                {cat}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="p-4 min-h-[calc(100vh-120px)] bg-gray-50">
                    {CATEGORIES.map(cat => (
                        <TabsContent key={cat} value={cat} className="m-0 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {products
                                    .filter(p => cat === "전체" || p.category === cat) // Mock category match
                                    .map(p => (
                                        <ProductCard key={p.id} product={p} />
                                    ))}
                            </div>
                            {products.filter(p => cat === "전체" || p.category === cat).length === 0 && (
                                <div className="py-20 text-center text-gray-400">
                                    상품이 준비 중입니다.
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    );
}
