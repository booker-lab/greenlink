"use client";

import { useEffect, useState } from "react";
import { createClient } from "@greenlink/lib";
import { useRouter } from "next/navigation";

interface Order {
    id: string;
    buyer_name: string;
    buyer_phone: string;
    buyer_address: string;
    quantity: number;
    total_price: number;
    status: string;
    delivery_method: string;
    tracking_number: string | null;
    created_at: string;
    product_id: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [trackingInput, setTrackingInput] = useState<{ [key: string]: string }>({});
    const supabase = createClient();
    const router = useRouter();

    async function fetchOrders() {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("[Admin Domain] Failed to fetch orders:", error);
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    async function handleCompleteDelivery(order: Order) {
        if (!confirm(`${order.buyer_name}님의 배송을 완료 처리하시겠습니까? 즉시 정산이 확정됩니다.`)) return;

        setProcessingId(order.id);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch('/api/delivery/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    orderId: order.id,
                    deliveryMethod: 'GREENLINK_DRIVER',
                    driverId: session?.user.id
                })
            });

            if (response.ok) {
                alert('배송 및 정산 처리가 완료되었습니다.');
                fetchOrders();
            } else {
                const err = await response.json();
                throw new Error(err.error || '처리 실패');
            }
        } catch (err: any) {
            console.error("[Admin Domain] Delivery completion error:", err);
            alert(`오류 발생: ${err.message}`);
        } finally {
            setProcessingId(null);
        }
    }

    async function handleRegisterTracking(order: Order) {
        const tracking = trackingInput[order.id];
        if (!tracking) {
            alert('운송장 번호를 입력해주세요.');
            return;
        }

        setProcessingId(order.id);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch('/api/delivery/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    orderId: order.id,
                    deliveryMethod: 'COURIER',
                    trackingNumber: tracking
                })
            });

            if (response.ok) {
                alert('운송장 등록이 완료되었습니다.');
                fetchOrders();
            } else {
                const err = await response.json();
                throw new Error(err.error || '처리 실패');
            }
        } catch (err: any) {
            console.error("[Admin Domain] Tracking registration error:", err);
            alert(`오류 발생: ${err.message}`);
        } finally {
            setProcessingId(null);
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ESCROW_DEPOSIT': return <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black uppercase">Paid (Escrow)</span>;
            case 'DISPATCHED': return <span className="px-2 py-1 rounded-md bg-orange-50 text-orange-600 text-[10px] font-black uppercase">On Delivery</span>;
            case 'DELIVERED': return <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">Delivered</span>;
            default: return <span className="px-2 py-1 rounded-md bg-gray-50 text-gray-500 text-[10px] font-black uppercase">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">주문 관리</h2>
                    <p className="text-sm text-gray-400 mt-1 font-medium">최신 주문 내역 및 배송 상태를 관리합니다.</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse" />)}
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold">주문 내역이 존재하지 않습니다.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-3xl p-6 border border-emerald-50 shadow-sm hover:shadow-xl hover:shadow-emerald-100/20 transition-all group overflow-hidden relative">
                            {/* Accent line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/10 to-transparent" />

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Order ID</p>
                                    <p className="text-xs font-bold text-gray-500 truncate w-32">#{order.id.split('-')[0]}</p>
                                </div>
                                {getStatusBadge(order.status)}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-black text-gray-900">{order.buyer_name}</h3>
                                    <p className="text-xs text-blue-600 font-extrabold">{order.buyer_phone}</p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-400">배송 주소</span>
                                        <span className="text-gray-700 text-right truncate ml-4">{order.buyer_address}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-400">품목/수량</span>
                                        <span className="text-gray-900 uppercase tracking-tighter">GB ITEM × {order.quantity}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-black">
                                        <span className="text-gray-400">총 결제 금액</span>
                                        <span className="text-emerald-600 text-sm">₩{order.total_price.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Action Area */}
                                <div className="pt-2">
                                    {order.status === 'ESCROW_DEPOSIT' && (
                                        <div className="space-y-3">
                                            {order.delivery_method === 'GREENLINK_DRIVER' ? (
                                                <button
                                                    disabled={processingId === order.id}
                                                    onClick={() => handleCompleteDelivery(order)}
                                                    className="w-full py-3 bg-emerald-600 text-white text-sm font-black rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50"
                                                >
                                                    {processingId === order.id ? '처리 중...' : '배송 완료 (정산 확정)'}
                                                </button>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="운송장 번호 입력"
                                                        value={trackingInput[order.id] || ''}
                                                        onChange={(e) => setTrackingInput({ ...trackingInput, [order.id]: e.target.value })}
                                                        className="w-full px-4 py-2 text-xs border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                                                    />
                                                    <button
                                                        disabled={processingId === order.id}
                                                        onClick={() => handleRegisterTracking(order)}
                                                        className="w-full py-3 bg-gray-900 text-white text-sm font-black rounded-xl hover:bg-black active:scale-95 transition-all disabled:opacity-50"
                                                    >
                                                        운송장 등록하기
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {order.status === 'DISPATCHED' && (
                                        <div className="bg-orange-50 text-orange-700 p-3 rounded-xl text-center text-xs font-black">
                                            운송장: {order.tracking_number || '등록됨'}
                                        </div>
                                    )}
                                    {order.status === 'DELIVERED' && (
                                        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-center text-xs font-black">
                                            정산 완료됨
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
