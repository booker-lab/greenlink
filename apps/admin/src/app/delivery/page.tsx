"use client";

import { useDeliveryStore } from "@greenlink/lib";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, Label, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@greenlink/ui";
import { useState, useEffect } from "react";

export default function DeliveryManagementPage() {
    const { dailyQuotas, setDailyQuota } = useDeliveryStore();
    const [dateStr, setDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedQuota, setSelectedQuota] = useState<number>(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Map array to object for easier lookup
    const quotas = dailyQuotas.reduce((acc, q) => ({ ...acc, [q.date]: q.maxOrders }), {} as Record<string, number>);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDateStr = e.target.value;
        setDateStr(newDateStr);
    };

    const openQuotaDialog = () => {
        if (dateStr) {
            const quota = dailyQuotas.find(q => q.date === dateStr)?.maxOrders || 50;
            setSelectedQuota(quota);
            setIsDialogOpen(true);
        }
    };

    const handleSaveQuota = () => {
        if (dateStr) {
            setDailyQuota(dateStr, selectedQuota);
            setIsDialogOpen(false);
        }
    };

    const formatDate = (d: string) => {
        return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(d));
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">배송 관리</h1>
            <p className="text-gray-500">날짜를 선택하여 일일 배송 쿼터(최대 주문량)를 설정하세요.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>배송 일정 및 쿼터 설정</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <Label>날짜 선택</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    value={dateStr}
                                    onChange={handleDateChange}
                                    className="block w-full"
                                />
                                <Button onClick={openQuotaDialog}>설정</Button>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                            <p className="text-sm text-gray-500 mb-1">{formatDate(dateStr)}</p>
                            <p className="font-bold text-2xl text-green-700">
                                {quotas[dateStr] ? `${quotas[dateStr]}건` : '기본 50건'}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">설정된 배송 쿼터</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>요약</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-bold mb-2">오늘 ({new Date().toISOString().split('T')[0]})</h3>
                                <div className="flex justify-between items-center text-sm">
                                    <span>설정된 쿼터:</span>
                                    <Badge>{quotas[new Date().toISOString().split('T')[0]] || 50}건</Badge>
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
                        <DialogTitle>{dateStr ? formatDate(dateStr) : ''} 배송 쿼터 설정</DialogTitle>
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
