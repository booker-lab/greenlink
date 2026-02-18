"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useDeliveryStore, useOrderStore } from "@greenlink/lib/stores";
import { SvgMinimap } from "@/components/SvgMinimap";
import { LongPressButton } from "@/components/LongPressButton";
import { optimizeRoute } from "@/lib/route-optimizer";
import { Button, Card } from "@greenlink/ui";
import { DeliveryStatus, DeliveryTask } from "@greenlink/lib/types";

// Helper type for optimization
interface TaskPoint {
    id: string;
    lat: number;
    lng: number;
    task: DeliveryTask;
}

export default function DeliveryPage() {
    const router = useRouter();
    const { isAuthenticated, driver } = useAuthStore();
    const { tasks, updateTaskStatus } = useDeliveryStore();
    // const { updateOrderStatus } = useOrderStore(); // Unused for now
    const [viewMode, setViewMode] = useState<"LIST" | "MAP">("LIST");
    const [activeTab, setActiveTab] = useState<"TODO" | "DONE">("TODO");

    // Auth check
    useEffect(() => {
        if (!isAuthenticated) router.push("/login"); // Fixed: removed driver check, just auth
    }, [isAuthenticated, router]);

    // Mock Current Location (Farm)
    const currentLocation = { lat: 37.2747, lng: 127.4350 }; // Dear Orchid Farm

    // Filter tasks
    const myTasks = tasks.filter(t => t.farmId === driver?.farmId);
    const todoTasks = myTasks.filter(t => t.status !== "DELIVERED");
    const doneTasks = myTasks.filter(t => t.status === "DELIVERED");

    // Optimize Route for TODO tasks
    const optimizedTasks = useMemo(() => {
        const points: TaskPoint[] = todoTasks.map(t => ({
            id: t.id,
            lat: t.deliveryCoords.lat,
            lng: t.deliveryCoords.lng,
            task: t
        }));

        // Nearest Neighbor Sort
        const sortedPoints = optimizeRoute(currentLocation, points);
        return sortedPoints.map(p => p.task);
    }, [todoTasks]); // Removed currentLocation from deps as it's constant mock

    const currentTask = optimizedTasks[0]; // Next destination

    const handleStatusChange = (taskId: string, currentStatus: DeliveryStatus) => {
        let nextStatus: DeliveryStatus = "PENDING";
        if (currentStatus === "PENDING") nextStatus = "PICKED_UP";
        else if (currentStatus === "PICKED_UP") nextStatus = "IN_TRANSIT";
        else if (currentStatus === "IN_TRANSIT") nextStatus = "DELIVERED";

        updateTaskStatus(taskId, nextStatus);
    };

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <header className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center sticky top-0 z-50">
                <div>
                    <h1 className="text-lg font-bold">배송 관리 🚛</h1>
                    <p className="text-xs text-gray-400">{driver?.name} 기사님 (PV5)</p>
                </div>
                <div className="flex bg-gray-700 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode("LIST")}
                        className={`px-3 py-1 text-sm rounded-md transition-all ${viewMode === "LIST" ? "bg-emerald-600 text-white" : "text-gray-400"}`}
                    >
                        목록
                    </button>
                    <button
                        onClick={() => setViewMode("MAP")}
                        className={`px-3 py-1 text-sm rounded-md transition-all ${viewMode === "MAP" ? "bg-emerald-600 text-white" : "text-gray-400"}`}
                    >
                        지도
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-20">
                {viewMode === "MAP" ? (
                    <div className="h-[calc(100vh-140px)] w-full relative">
                        <SvgMinimap
                            locations={optimizedTasks.map(t => ({
                                id: t.id,
                                lat: t.deliveryCoords.lat,
                                lng: t.deliveryCoords.lng,
                                status: t.status,
                                label: t.recipientName
                            }))}
                            currentLocation={currentLocation}
                            className="h-full w-full rounded-none border-none"
                        />
                        {/* Map Overlay Card for Current Task */}
                        {currentTask && (
                            <div className="absolute bottom-4 left-4 right-4">
                                <Card className="bg-gray-800 border-gray-700 text-white">
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg">{currentTask.recipientName}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${currentTask.status === 'PENDING' ? 'bg-yellow-900 text-yellow-200' :
                                                currentTask.status === 'PICKED_UP' ? 'bg-blue-900 text-blue-200' :
                                                    'bg-purple-900 text-purple-200'
                                                }`}>
                                                {currentTask.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-sm mb-4">{currentTask.deliveryAddress}</p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="flex-1 border-gray-600 hover:bg-gray-700" onClick={() => window.open(`kakaomap://route?ep=${currentTask.deliveryCoords.lat},${currentTask.deliveryCoords.lng}&by=CAR`, '_blank')}>
                                                <span className="mr-2">🧭</span>
                                                길안내
                                            </Button>
                                            <Button variant="outline" className="flex-1 border-gray-600 hover:bg-gray-700" onClick={() => window.location.href = `tel:${currentTask.recipientPhone}`}>
                                                <span className="mr-2">📞</span>
                                                전화
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-4 space-y-4">
                        {/* Tabs */}
                        <div className="flex gap-4 border-b border-gray-700 mb-4">
                            <button
                                onClick={() => setActiveTab("TODO")}
                                className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === "TODO" ? "border-emerald-500 text-emerald-500" : "border-transparent text-gray-500"}`}
                            >
                                배송 예정 ({todoTasks.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("DONE")}
                                className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === "DONE" ? "border-emerald-500 text-emerald-500" : "border-transparent text-gray-500"}`}
                            >
                                완료 ({doneTasks.length})
                            </button>
                        </div>

                        {(activeTab === "TODO" ? optimizedTasks : doneTasks).map((task) => (
                            <Card key={task.id} className="bg-gray-800 border-gray-700 text-white overflow-hidden">
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-gray-300">
                                                {task.priority}
                                            </span>
                                            <h3 className="font-bold">{task.recipientName}</h3>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Intl.DateTimeFormat('ko-KR', { month: '2-digit', day: '2-digit' }).format(new Date(task.createdAt))}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <p className="text-sm text-gray-300 flex items-start gap-2">
                                            <span className="text-gray-500 shrink-0">📍</span>
                                            {task.deliveryAddress}
                                        </p>
                                        <p className="text-sm text-gray-300 flex items-start gap-2">
                                            <span className="text-gray-500 shrink-0">📦</span>
                                            {task.items.join(", ")}
                                        </p>
                                    </div>

                                    {activeTab === "TODO" && (
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex-1 bg-gray-700 hover:bg-gray-600 h-9"
                                                    onClick={() => window.open(`kakaomap://route?ep=${task.deliveryCoords.lat},${task.deliveryCoords.lng}&by=CAR`, '_blank')}
                                                >
                                                    <span className="mr-1">🧭</span> 길안내
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex-1 bg-gray-700 hover:bg-gray-600 h-9"
                                                    onClick={() => window.location.href = `tel:${task.recipientPhone}`}
                                                >
                                                    <span className="mr-1">📞</span> 전화
                                                </Button>
                                            </div>

                                            <LongPressButton
                                                label={
                                                    task.status === "PENDING" ? "📦 픽업 완료 (길게 꾹)" :
                                                        task.status === "PICKED_UP" ? "🚚 배송 출발 (길게 꾹)" :
                                                            "✅ 배송 완료 (길게 꾹)"
                                                }
                                                onLongPress={() => handleStatusChange(task.id, task.status)}
                                                className={
                                                    task.status === "PENDING" ? "bg-gray-700 border-gray-600" :
                                                        task.status === "PICKED_UP" ? "bg-blue-900/50 border-blue-800" :
                                                            "bg-emerald-900/50 border-emerald-800"
                                                }
                                            />
                                        </div>
                                    )}

                                    {activeTab === "DONE" && (
                                        <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-emerald-400 flex items-center gap-1">
                                            ✅ 배송 완료 ({task.deliveredAt ? new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit' }).format(new Date(task.deliveredAt)) : '-'})
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}

                        {activeTab === "TODO" && optimizedTasks.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                모든 배송을 완료했습니다! 🎉
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
