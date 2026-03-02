"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { greenlinkApi, ZeroInventoryItem } from "@greenlink/lib";

const CATEGORIES = [
    { id: "ALL", label: "전체" },
    { id: "CUT", label: "절화" },
    { id: "ORC", label: "난" },
    { id: "FOL", label: "관엽" },
];

const CATEGORY_EMOJI: Record<string, string> = {
    CUT: "🌹", ORC: "🌸", FOL: "🌿", ETC: "🎁"
};

export default function SearchPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCat, setActiveCat] = useState("ALL");
    const [allItems, setAllItems] = useState<ZeroInventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // greenlinkApi로 전체 상품 Fetch (useProductStore 의존성 제거)
    useEffect(() => {
        Promise.all([
            greenlinkApi.getZeroInventoryItems("CUT"),
            greenlinkApi.getZeroInventoryItems("ORC"),
            greenlinkApi.getZeroInventoryItems("FOL"),
        ]).then(([cut, orc, fol]) => {
            setAllItems([...cut, ...orc, ...fol]);
        }).finally(() => setLoading(false));
    }, []);

    const filteredItems = allItems.filter((item) => {
        const matchCat = activeCat === "ALL" || item.categoryId === activeCat;
        const q = searchQuery.toLowerCase();
        const matchQ = !q || item.itemNm.toLowerCase().includes(q);
        return matchCat && matchQ;
    });

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Search Header */}
            <div className="p-4 sticky top-0 bg-white z-10 space-y-3 border-b border-gray-100 shadow-sm">
                <div className="relative">
                    <svg
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[14px] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="호접란, 장미, 몬스테라 ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-0.5">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCat(cat.id)}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-black transition-all ${activeCat === cat.id
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="p-4">
                <p className="text-[12px] font-bold text-gray-400 mb-4">
                    검색 결과 <span className="text-green-600">{filteredItems.length}</span>개
                </p>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                        {filteredItems.map((item) => {
                            const pct = Math.min((item.currentParticipants / item.targetParticipants) * 100, 100);
                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => router.push(`/category/${item.id}`)}
                                >
                                    <div className="aspect-square bg-gray-50 flex items-center justify-center text-4xl relative overflow-hidden">
                                        {item.imageUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.imageUrl} alt={item.itemNm} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{CATEGORY_EMOJI[item.categoryId] || "🌿"}</span>
                                        )}
                                        {item.status === 'GOAL_MET' && (
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                <span className="text-white text-[10px] font-black bg-black/50 px-2 py-1 rounded-full">목표달성</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="text-[12px] font-black text-gray-900 line-clamp-1 mb-1">{item.itemNm}</p>
                                        <p className="text-[14px] font-black text-red-500 mb-2">{item.sellingPrice.toLocaleString()}원</p>
                                        <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden mb-1">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold">{item.currentParticipants}/{item.targetParticipants}명</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <span className="text-4xl opacity-20 block mb-4">🔍</span>
                        <p className="text-[14px] text-gray-400 font-black">검색 결과가 없습니다.</p>
                        <button
                            className="mt-4 text-[12px] font-bold text-green-600 border border-green-200 px-6 py-2 rounded-full hover:bg-green-50"
                            onClick={() => { setSearchQuery(""); setActiveCat("ALL"); }}
                        >
                            조건 초기화
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
