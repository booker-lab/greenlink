export type OrderStatus = 'ESCROW_DEPOSIT' | 'ORDERED' | 'PREPARING' | 'DISPATCHED' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';

export interface Order {
    id: string;
    productId: string; // 제로 인벤토리 공구 아이템 ID
    farmId?: string;
    userId?: string; // 사용자 식별을 위한 추가 필드
    buyerName: string;
    buyerPhone: string;
    buyerAddress: string;
    quantity: number;
    totalPrice: number;
    status: OrderStatus;
    deliveryDate: string; // YYYY-MM-DD
    orderedAt: string;
    isEscrow: boolean; // 100% 자동 환불을 위한 안전결제 플래그
    message?: string;
    deliveryTaskId?: string;
    product?: {
        item_nm: string;
        image_url: string;
        selling_price: number;
    };
}
