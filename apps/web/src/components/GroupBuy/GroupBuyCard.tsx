
import { Card, Button, Progress, Badge } from "@greenlink/ui";
import { GroupBuyDeal } from "@greenlink/lib/types";
import Link from "next/link";
import { CountdownTimer } from "./CountdownTimer";


interface GroupBuyCardProps {
    deal: GroupBuyDeal;
}

export function GroupBuyCard({ deal }: GroupBuyCardProps) {
    const progressPercent = Math.min((deal.currentQuantity / deal.minQuantity) * 100, 100);
    const isSuccess = deal.currentQuantity >= deal.minQuantity;

    return (
        <Card className="p-4 border border-green-100 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <Badge variant={isSuccess ? "default" : "secondary"} {...({ className: isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-orange-100 text-orange-700 hover:bg-orange-200" } as any)}>
                    {isSuccess ? "달성 성공! 🎉" : "마감 임박 🔥"}
                </Badge>
                <CountdownTimer targetDate={deal.deadline} className="text-sm font-bold bg-red-50 px-2 py-1 rounded-md" />
            </div>

            <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {deal.image.startsWith('http') ? (
                        <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl">{deal.image}</span>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    <h3 className="font-bold line-clamp-1">{deal.title}</h3>

                    <div className="flex items-end gap-2">
                        <span className="text-xl font-bold text-green-700">{deal.sellingPrice.toLocaleString()}원</span>
                        <span className="text-sm text-gray-400 line-through mb-1">{deal.estimatedCost.toLocaleString()}원</span>
                    </div>

                    <div className="text-xs text-gray-500 bg-gray-50 p-1.5 rounded flex items-center gap-1">
                        <span className="font-medium text-gray-700">경매가 대비</span>
                        <span className="text-green-600 font-bold">-{Math.round((1 - deal.sellingPrice / deal.estimatedCost) * 100)}%</span>
                        저렴해요!
                    </div>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">👥 {deal.participants.length}명 참여중</span>
                    <span>{deal.currentQuantity}/{deal.minQuantity}개</span>
                </div>
                <Progress value={progressPercent} className="h-2 bg-gray-100" />

                <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-10 mt-2">
                    <Link href={`/group-buy/${deal.id}`}>
                        참여하기 →
                    </Link>
                </Button>
            </div>
        </Card>
    );
}
