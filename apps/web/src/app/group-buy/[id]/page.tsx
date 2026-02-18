"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGroupBuyStore } from "@greenlink/lib/stores";
import { Button, Badge, Progress, Card } from "@greenlink/ui";
import { CountdownTimer } from "@/components/GroupBuy/CountdownTimer";

export default function GroupBuyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { deals, joinDeal } = useGroupBuyStore();
    const resolvedParams = use(params);
    const deal = deals.find((d: any) => d.id === resolvedParams.id);

    if (!deal) return <div className="p-8 text-center">공구 정보를 찾을 수 없습니다.</div>;

    const progressPercent = Math.min((deal.currentQuantity / deal.minQuantity) * 100, 100);
    const isSuccess = deal.currentQuantity >= deal.minQuantity;

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
                <span className="text-8xl">🌿</span>

                <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    ⏰ <CountdownTimer targetDate={deal.deadline} />
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Title & Price */}
                <div>
                    <div className="flex gap-2 mb-2">
                        <Badge>{deal.status === 'RECRUITING' ? '진행중' : '마감'}</Badge>
                        {isSuccess && <Badge variant="secondary" {...({ className: "bg-green-100 text-green-700" } as any)}>달성 성공!</Badge>}
                    </div>
                    <h1 className="text-xl font-bold mb-1">{deal.title}</h1>
                    <p className="text-sm text-gray-500 mb-3">{deal.description}</p>

                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-green-600">{deal.sellingPrice.toLocaleString()}원</span>
                        <span className="text-sm text-gray-400 line-through mb-1">{deal.estimatedCost.toLocaleString()}원</span>
                    </div>
                </div>

                {/* Progress Section */}
                <Card className="p-4 bg-green-50 border-green-100">
                    <div className="flex justify-between text-sm font-bold mb-2">
                        <span>현재 참여 현황</span>
                        <span className="text-green-700">{Math.round(progressPercent)}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-3 bg-white" />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>{deal.currentQuantity}개 달성</span>
                        <span>목표 {deal.minQuantity}개</span>
                    </div>
                    <p className="text-xs text-center text-green-700 mt-3 font-medium">
                        {deal.minQuantity - deal.currentQuantity > 0
                            ? `${deal.minQuantity - deal.currentQuantity}개만 더 모이면 최저가 확정!`
                            : "최저가 확정! 계속 참여 가능합니다 🎉"}
                    </p>
                </Card>

                {/* Participants - Mock */}
                <div>
                    <h3 className="text-sm font-bold mb-2 flex items-center gap-1">👥 참여자 ({deal.participants.length}명)</h3>
                    <div className="flex -space-x-2 overflow-hidden">
                        {[...Array(Math.min(5, deal.participants.length + 1))].map((_, i) => (
                            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs">
                                👤
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-area-pb z-50">
                <Button
                    className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700"
                    onClick={() => {
                        joinDeal(deal.id, 'mock-user-id', 1);
                        alert("공구 참여가 완료되었습니다! (Mock)");
                        router.push('/group-buy');
                    }}
                    disabled={deal.status !== 'RECRUITING' && deal.status !== 'GOAL_MET'}
                >
                    {deal.status === 'RECRUITING' || deal.status === 'GOAL_MET' ? '공구 참여하기' : '마감된 공구입니다'}
                </Button>
            </div>
        </div>
    );
}
