"use client";

import { useEffect, useState } from "react";
import { createClient } from "@greenlink/lib";
import Link from "next/link";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingDeliveries: 0,
        totalSales: 0,
        activeDeals: 0
    });
    const supabase = createClient();

    useEffect(() => {
        async function fetchStats() {
            // 실제 운영 환경에선 정교한 집계 쿼리 사용
            const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
            const { count: pendingCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'ESCROW_DEPOSIT');
            const { data: salesData } = await supabase.from('orders').select('total_price');
            const { count: dealCount } = await supabase.from('zero_inventory_items').select('*', { count: 'exact', head: true }).eq('status', 'RECRUITING');

            const totalSales = salesData?.reduce((acc, curr) => acc + curr.total_price, 0) || 0;

            setStats({
                totalOrders: orderCount || 0,
                pendingDeliveries: pendingCount || 0,
                totalSales,
                activeDeals: dealCount || 0
            });
        }

        fetchStats();
    }, []);

    const cards = [
        { name: "총 주문 건수", value: `${stats.totalOrders}건`, sub: "누적 주문량", icon: "📦", color: "blue" },
        { name: "미처리 배송", value: `${stats.pendingDeliveries}건`, sub: "즉시 처리 필요", icon: "🚚", color: "orange" },
        { name: "누적 매출액", value: `₩${stats.totalSales.toLocaleString()}`, sub: "예치금 포함", icon: "💰", color: "emerald" },
        { name: "진행 중 공구", value: `${stats.activeDeals}개`, sub: "모집 중 품목", icon: "🔥", color: "red" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-gray-900">대시보드 개요</h2>
                <p className="text-sm text-gray-400 mt-1 font-medium">디어 오키드 농장의 실시간 현황입니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.name} className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-emerald-100/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-${card.color}-50`}>
                                {card.icon}
                            </div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Global</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400">{card.name}</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{card.value}</h3>
                        <p className="text-[10px] font-extrabold text-emerald-600 mt-2 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">{card.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm">
                    <h3 className="text-lg font-black text-gray-900 mb-6">최근 알림</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4 p-4 bg-emerald-50 rounded-2xl">
                            <div className="w-10 h-10 rounded-full bg-emerald-200 flex-shrink-0 flex items-center justify-center text-lg">📢</div>
                            <div>
                                <p className="text-sm font-black text-emerald-900 underline decoration-emerald-200 underline-offset-4">새로운 공구 목표 달성!</p>
                                <p className="text-xs text-emerald-700 mt-1 font-bold">'호접란 아마빌리스' 품목이 목표 인원을 채워 GOAL_MET 상태가 되었습니다.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 border border-gray-50 rounded-2xl">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-lg">💡</div>
                            <div>
                                <p className="text-sm font-black text-gray-700">시스템 팁</p>
                                <p className="text-xs text-gray-500 mt-1 font-medium">직배송 완료 버튼을 누르면 에스크로 정산이 즉시 실행됩니다.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                    <h3 className="text-lg font-black mb-2 leading-tight">GreenLink AI<br />Insight Beta</h3>
                    <p className="text-sm text-gray-400 font-bold mb-8">현재 구매 패턴 분석 결과, 주말 대비 평일 주문량이 24% 높습니다.</p>

                    <Link
                        href="/orders"
                        className="inline-flex items-center gap-2 bg-emerald-600 px-6 py-3 rounded-2xl text-sm font-black hover:bg-emerald-500 transition-all active:scale-95"
                    >
                        주문 내역 자세히 보기
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
