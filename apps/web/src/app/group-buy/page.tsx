"use client";

import { useGroupBuyStore } from "@greenlink/lib/stores";
import { GroupBuyCard } from "@/components/GroupBuy/GroupBuyCard";
import type { GroupBuyDeal } from "@greenlink/lib/types";

export default function GroupBuyPage() {
    const { deals } = useGroupBuyStore();
    const openDeals = deals.filter((d: GroupBuyDeal) => d.status === 'RECRUITING' || d.status === 'GOAL_MET');

    return (
        <div className="space-y-4 pb-8">
            <header className="p-4 bg-white sticky top-0 z-10 border-b border-gray-100">
                <h1 className="text-xl font-bold">공동구매 🤝</h1>
                <p className="text-xs text-gray-500">함께 사면 경매가보다 저렴해요!</p>
            </header>

            <div className="px-4 space-y-4">
                {openDeals.map(deal => (
                    <GroupBuyCard key={deal.id} deal={deal} />
                ))}

                {openDeals.length === 0 && (
                    <div className="py-10 text-center text-gray-500">
                        진행 중인 공구가 없습니다. 😢
                    </div>
                )}
            </div>
        </div>
    );
}
