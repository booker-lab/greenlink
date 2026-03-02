import { Order, OrderStatus } from './order.schema';
import { orderRepository } from './order.repository';
import { productService } from '../product/product.service';

const GLOBAL_MOCK_ORDERS: Order[] = [];

export class OrderService {
    /**
     * 로컬 스토리지에서 Mock 주문 내역 복원
     */
    private hydrateMockOrders() {
        if (typeof window !== 'undefined' && GLOBAL_MOCK_ORDERS.length === 0) {
            const saved = localStorage.getItem('gl_mock_orders');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) {
                        GLOBAL_MOCK_ORDERS.splice(0, GLOBAL_MOCK_ORDERS.length, ...parsed);
                    }
                } catch (e) { }
            }
        }
    }

    private persistMockOrders() {
        if (typeof window !== 'undefined') {
            localStorage.setItem('gl_mock_orders', JSON.stringify(GLOBAL_MOCK_ORDERS));
        }
    }

    /**
     * 에스크로 주문 생성 (Service Layer)
     */
    async createOrder(params: {
        userId: string,
        itemId: string,
        qty: number,
        buyerInfo: { name: string, phone: string, address: string }
    }): Promise<Order> {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.itemId);

        if (!isUuid) {
            const item = await productService.getItemById(params.itemId);
            if (!item) throw new Error("Item not found");

            const newOrder: Order = {
                id: `ord-${Date.now()}`,
                userId: params.userId,
                productId: item.id,
                buyerName: params.buyerInfo.name,
                buyerPhone: params.buyerInfo.phone,
                buyerAddress: params.buyerInfo.address,
                quantity: params.qty,
                totalPrice: item.sellingPrice * params.qty,
                status: 'ESCROW_DEPOSIT',
                deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                orderedAt: new Date().toISOString(),
                isEscrow: true,
                product: {
                    item_nm: item.itemNm,
                    image_url: item.imageUrl,
                    selling_price: item.sellingPrice
                }
            };

            GLOBAL_MOCK_ORDERS.push(newOrder);
            item.currentParticipants += params.qty;
            this.persistMockOrders();
            return newOrder;
        }

        const item = await productService.getItemById(params.itemId);
        if (!item) throw new Error("Database Item not found");

        const data = await orderRepository.createEscrowOrder({
            userId: params.userId,
            productId: params.itemId,
            buyerName: params.buyerInfo.name,
            buyerPhone: params.buyerInfo.phone,
            buyerAddress: params.buyerInfo.address,
            quantity: params.qty,
            totalPrice: item.sellingPrice * params.qty
        });

        return {
            id: data.order_id,
            productId: params.itemId,
            buyerName: params.buyerInfo.name,
            buyerPhone: params.buyerInfo.phone,
            buyerAddress: params.buyerInfo.address,
            quantity: params.qty,
            totalPrice: item.sellingPrice * params.qty,
            status: 'ESCROW_DEPOSIT',
            deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            orderedAt: new Date().toISOString(),
            isEscrow: true,
        };
    }

    /**
     * 내 주문 목록 조회 (DB + Mock 병합)
     */
    async getMyOrders(userId?: string): Promise<Order[]> {
        this.hydrateMockOrders();

        if (!userId) {
            return [...GLOBAL_MOCK_ORDERS].sort((a, b) =>
                new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime()
            );
        }

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
        if (!isUuid) {
            return GLOBAL_MOCK_ORDERS
                .filter(o => o.userId === userId || o.userId === 'guest' || !o.userId)
                .sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime());
        }

        try {
            const dbOrders = await orderRepository.findByUserId(userId);
            const myMockOrders = GLOBAL_MOCK_ORDERS.filter(o =>
                o.userId === userId || o.userId === 'guest' || !o.userId
            );

            return [...dbOrders, ...myMockOrders].sort((a, b) =>
                new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime()
            );
        } catch (e) {
            console.error('[OrderService] getMyOrders failed (Returning Mock Only):', e);
            return GLOBAL_MOCK_ORDERS
                .filter(o => o.userId === userId || o.userId === 'guest' || !o.userId)
                .sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime());
        }
    }

    /**
     * 주문 상세 조회
     */
    async getOrder(orderId: string): Promise<Order | null> {
        this.hydrateMockOrders();
        const mock = GLOBAL_MOCK_ORDERS.find(o => o.id === orderId);
        if (mock) return mock;

        try {
            return await orderRepository.findById(orderId);
        } catch {
            return null;
        }
    }

    /**
     * 주문 취소
     */
    async cancelOrder(orderId: string): Promise<boolean> {
        this.hydrateMockOrders();
        const mockIdx = GLOBAL_MOCK_ORDERS.findIndex(o => o.id === orderId);
        if (mockIdx > -1) {
            GLOBAL_MOCK_ORDERS[mockIdx].status = 'CANCELLED';
            this.persistMockOrders();
            return true;
        }

        try {
            return await orderRepository.updateStatus(orderId, 'CANCELLED');
        } catch (e) {
            console.error('[OrderService] cancelOrder failed:', e);
            return false;
        }
    }
}

export const orderService = new OrderService();
