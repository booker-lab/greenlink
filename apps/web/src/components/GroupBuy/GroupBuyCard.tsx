
import { Card, Button, Progress, Badge } from "@greenlink/ui";
import { GroupBuyDeal } from "@greenlink/lib/types";
import Link from "next/link";
import Image from "next/image";
import { CountdownTimer } from "./CountdownTimer";


interface GroupBuyCardProps {
    deal: GroupBuyDeal;
}

export function GroupBuyCard({ deal }: GroupBuyCardProps) {
    const progressPercent = Math.min((deal.zeroInventoryItem.currentParticipants / deal.zeroInventoryItem.targetParticipants) * 100, 100);
    const isSuccess = deal.zeroInventoryItem.currentParticipants >= deal.zeroInventoryItem.targetParticipants;

    return (
        <Card className="p-4 border border-green-100/60 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-2xl">
            <div className="flex justify-between items-center mb-3">
                <Badge variant={isSuccess ? "default" : "secondary"} {...({ className: isSuccess ? "bg-green-600 hover:bg-green-700 text-xs px-2 py-0.5 rounded-full" : "bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 text-xs px-2 py-0.5 rounded-full" } as any)}>
                    {isSuccess ? "달성 성공! 🎉" : "마감 임박 🔥"}
                </Badge>
                <CountdownTimer targetDate={deal.deadline} className="text-[11px] font-medium text-gray-500" />
            </div>

            <div className="flex gap-3">
                <div className="relative w-20 h-20 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                    {deal.zeroInventoryItem.imageUrl ? (
                        <Image src={deal.zeroInventoryItem.imageUrl} alt={deal.title} fill className="object-cover" unoptimized />
                    ) : (
                        <span className="text-3xl opacity-80">🌿</span>
                    )}
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-[14px] font-bold text-gray-900 line-clamp-2 leading-snug mb-1">{deal.title}</h3>

                    <div className="flex flex-col">
                        <span className="text-[16px] font-extrabold text-green-600">{deal.zeroInventoryItem.sellingPrice.toLocaleString()}원</span>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[11px] text-gray-400 line-through">{deal.zeroInventoryItem.avgCost.toLocaleString()}원</span>
                            <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1 py-0 rounded">-{Math.round((1 - deal.zeroInventoryItem.sellingPrice / deal.zeroInventoryItem.avgCost) * 100)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 space-y-2.5">
                <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium px-1">
                    <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        <span className="text-[10px]">👥</span> {deal.participants.length}명 대기중
                    </span>
                    <span>{deal.zeroInventoryItem.currentParticipants} / {deal.zeroInventoryItem.targetParticipants}개 달성</span>
                </div>

                {/* Custom Gradient Progress */}
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>
        </Card>
    );
}
