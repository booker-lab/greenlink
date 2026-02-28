"use client";

import { greenlinkApi, ZeroInventoryItem } from "@greenlink/lib";
import { ZeroInventoryCard } from "@/components/GroupBuy/ZeroInventoryCard";
import Link from "next/link";
import { useState, useEffect } from "react";

type CategoryGubun = 'ORC' | 'CUT' | 'FOL';

const CATEGORIES: { id: CategoryGubun; label: string }[] = [
    { id: 'ORC', label: '난 (MVP)' },
    { id: 'CUT', label: '절화' },
    { id: 'FOL', label: '관엽' },
];

const CATEGORY_INFO = {
    ORC: {
        bannerTag: "서양란 특가전 (flowerGubun=3)",
        bannerTitle: "최근 경매 인기 품목\n제로 인벤토리 직송"
    },
    CUT: {
        bannerTag: "절화 직송 (Cut Flowers)",
        bannerTitle: "새벽 이슬 머금은 생화\n최상급 품질 선별"
    },
    FOL: {
        bannerTag: "반려식물 (Foliage Plants)",
        bannerTitle: "플랜테리어를 위한\n완벽한 수형의 관엽"
    }
};

export default function CategoryPage() {
    const [selectedCategory, setSelectedCategory] = useState<CategoryGubun>('ORC');
    const [items, setItems] = useState<ZeroInventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string | null>(null);

    // Reset filter when category changes
    useEffect(() => {
        setFilter(null);
    }, [selectedCategory]);

    const filteredItems = items.filter(item => {
        if (!filter) return true;

        if (selectedCategory === 'CUT') {
            const stage = item.metadata?.bloomStage || 0;
            if (filter === 'BUD' && stage === 1) return true;
            if (filter === 'HALF' && (stage === 2 || stage === 3)) return true;
            if (filter === 'FULL' && (stage === 4 || stage === 5)) return true;
            return false;
        }

        if (selectedCategory === 'FOL') {
            const h = item.metadata?.plantHeight || 0;
            if (filter === 'SMALL' && h < 50) return true;
            if (filter === 'MEDIUM' && h >= 50 && h <= 100) return true;
            if (filter === 'LARGE' && h > 100) return true;
            return false;
        }

        return true;
    });

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        // 초기값을 Mock으로 채워놓아 타이머 발동 전에도 항상 아이템이 보임
        setItems(greenlinkApi.getMockItems(selectedCategory));

        // 10초 안전 타임아웃: 로그인 후 Auth Token Refresh Lock이 수 초 걸릴 수 있으므로
        // 이전 5초보다 넉넉하게 설정해 실제 DB 응답을 기다린 후 Fallback을 적용
        const safetyTimer = setTimeout(() => {
            if (isMounted) {
                console.warn('[Category] Safety timeout (10s) reached - staying with mock items');
                setLoading(false);
            }
        }, 10000);

        greenlinkApi.getZeroInventoryItems(selectedCategory)
            .then(data => {
                clearTimeout(safetyTimer);
                if (isMounted) {
                    // DB에 실제 데이터가 있으면 덮어쓰고, 없으면 이미 set된 mockItems 유지
                    if (data.length > 0) {
                        setItems(data);
                    }
                    setLoading(false);
                }
            })
            .catch(error => {
                clearTimeout(safetyTimer);
                console.error('Failed to fetch zero inventory items:', error);
                if (isMounted) {
                    // 에러 시에도 이미 mockItems로 초기화되어 있으므로 로딩만 해제
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
            clearTimeout(safetyTimer);
        };
    }, [selectedCategory]);

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white shadow-sm">
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                    <Link href="/" className="text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </Link>
                    <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">공동구매 (제로인벤토리)</h1>
                </div>

                {/* Category Tabs */}
                <div className="flex px-4 pt-2 border-b border-gray-100 overflow-x-auto no-scrollbar bg-white">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-3 mr-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${selectedCategory === cat.id
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Informational Banner */}
            <div className="bg-green-600 px-4 py-5 text-white shadow-inner">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold opacity-90 tracking-wider">
                        {CATEGORY_INFO[selectedCategory].bannerTag}
                    </span>
                    <h2 className="text-xl font-extrabold leading-tight whitespace-pre-line">
                        {CATEGORY_INFO[selectedCategory].bannerTitle}
                    </h2>
                    <p className="text-xs opacity-80 mt-2 font-medium">
                        * 10명 결제(예치) 달성 시 익일 새벽 경매장에서 사입되어 문 앞까지 신선 배송됩니다.
                    </p>
                </div>
            </div>

            {/* Content List */}
            <main className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-gray-800">
                        모집 중인 상품 <span className="text-green-600">{filteredItems.length}</span>
                    </span>
                    <button className="text-xs text-gray-500 font-medium flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                        경매 물량순
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </button>
                </div>

                {/* Category specific filters */}
                {selectedCategory === 'CUT' && (
                    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                        {['전체', '몽우리', '반개', '만개'].map((f, i) => {
                            const filterVal = i === 0 ? null : i === 1 ? 'BUD' : i === 2 ? 'HALF' : 'FULL';
                            return (
                                <button
                                    key={f}
                                    onClick={() => setFilter(filterVal)}
                                    className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors shadow-sm border ${filter === filterVal ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {f}
                                </button>
                            );
                        })}
                    </div>
                )}
                {selectedCategory === 'FOL' && (
                    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                        {['전체', '소형', '중형', '대형'].map((f, i) => {
                            const filterVal = i === 0 ? null : i === 1 ? 'SMALL' : i === 2 ? 'MEDIUM' : 'LARGE';
                            return (
                                <button
                                    key={f}
                                    onClick={() => setFilter(filterVal)}
                                    className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors shadow-sm border ${filter === filterVal ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {f}
                                </button>
                            );
                        })}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 pb-8">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <ZeroInventoryCard key={item.id} item={item} />
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-10 text-gray-400">
                                해당 필터 조건에 모집 중인 상품이 없습니다.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
