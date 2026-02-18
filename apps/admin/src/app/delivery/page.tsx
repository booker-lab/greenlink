"use client";

import { useDeliveryStore } from "@greenlink/lib";
import { Calendar, Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, Label, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@greenlink/ui";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function DeliveryManagementPage() {
    const { dailyQuotas, setDailyQuota } = useDeliveryStore();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedQuota, setSelectedQuota] = useState<number>(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Map array to object for easier lookup
    const quotas = dailyQuotas.reduce((acc, q) => ({ ...acc, [q.date]: q.maxOrders }), {} as Record<string, number>);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const quota = dailyQuotas.find(q => q.date === dateStr)?.maxOrders || 50;
            setSelectedQuota(quota);
            setIsDialogOpen(true);
        }
    };

    const handleSaveQuota = () => {
        if (date) {
            const dateStr = format(date, 'yyyy-MM-dd');
            setDailyQuota(dateStr, selectedQuota);
            setIsDialogOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">배송 관리</h1>
            <p className="text-gray-500">날짜를 선택하여 일일 배송 쿼터(최대 주문량)를 설정하세요.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>배송 일정 및 쿼터 현황</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            className="rounded-md border"
                            locale={ko as any}
                            modifiers={{
                                quotaSet: (date) => {
                                    const dateStr = format(date, 'yyyy-MM-dd');
                                    return !!quotas[dateStr];
                                }
                            }}
                            modifiersClassNames={{
                                quotaSet: "bg-green-100 font-bold text-green-700"
                            }}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>요약</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-bold mb-2">오늘 ({format(new Date(), 'yyyy-MM-dd')})</h3>
                                <div className="flex justify-between items-center text-sm">
                                    <span>설정된 쿼터:</span>
                                    <Badge>{quotas[format(new Date(), 'yyyy-MM-dd')] || 50}건</Badge>
                                </div>
                                {/* Mock used capacity */}
                                <div className="flex justify-between items-center text-sm mt-2">
                                    <span>현재 예약:</span>
                                    <span className="text-gray-500">12건</span>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500">
                                * 쿼터가 초과되면 해당 날짜는 배송일 선택에서 제외됩니다.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{date ? format(date, 'yyyy년 MM월 dd일') : ''} 배송 쿼터 설정</DialogTitle>
                        <DialogDescription>
                            해당 날짜에 처리 가능한 최대 배송 건수를 입력하세요.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quota" className="text-right">
                                최대 건수
                            </Label>
                            <Input
                                id="quota"
                                type="number"
                                value={selectedQuota}
                                onChange={(e) => setSelectedQuota(Number(e.target.value))}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleSaveQuota}>저장하기</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
