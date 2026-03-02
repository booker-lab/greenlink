import { createClient } from '../../api/supabase';
import { Order, OrderStatus } from './order.schema';

export class OrderRepository {
    private get supabase() { return createClient(); }

    private mapToOrder(d: any): Order {
        return {
            id: d.id,
            productId: d.product_id,
            userId: d.user_id,
            buyerName: d.buyer_name,
            buyerPhone: d.buyer_phone,
            buyerAddress: d.buyer_address,
            quantity: d.quantity,
            totalPrice: d.total_price,
            status: d.status as OrderStatus,
            deliveryDate: d.delivery_date,
            orderedAt: d.ordered_at,
            isEscrow: d.is_escrow,
            product: d.product ? {
                item_nm: d.product.item_nm,
                image_url: d.product.image_url,
                selling_price: d.product.selling_price
            } : undefined
        };
    }

    /**
     * 사용자의 주문 내역 조회 (상품 정보 조인 포함)
     */
    async findByUserId(userId: string): Promise<Order[]> {
        const { data, error } = await (this.supabase
            .from('orders')
            .select('*, product:zero_inventory_items(*)')
            .eq('user_id', userId)
            .order('ordered_at', { ascending: false }) as any)
            .abortSignal(AbortSignal.timeout(4000));

        if (error) throw error;
        return (data || []).map((d: any) => this.mapToOrder(d));
    }

    /**
     * 주문 상세 조회
     */
    async findById(orderId: string): Promise<Order | null> {
        const { data, error } = await (this.supabase
            .from('orders')
            .select('*, product:zero_inventory_items(*)')
            .eq('id', orderId)
            .single() as any);

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data ? this.mapToOrder(data) : null;
    }

    /**
     * 주문 상태 업데이트
     */
    async updateStatus(orderId: string, status: OrderStatus): Promise<boolean> {
        const { error } = await this.supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);

        if (error) throw error;
        return true;
    }

    /**
     * 에스크로 주문 생성 (RPC 호출)
     */
    async createEscrowOrder(params: {
        userId: string,
        productId: string,
        buyerName: string,
        buyerPhone: string,
        buyerAddress: string,
        quantity: number,
        totalPrice: number
    }): Promise<{ order_id: string }> {
        const { data, error } = await this.supabase.rpc('create_escrow_order_txn', {
            p_user_id: params.userId,
            p_product_id: params.productId,
            p_buyer_name: params.buyerName,
            p_buyer_phone: params.buyerPhone,
            p_buyer_address: params.buyerAddress,
            p_quantity: params.quantity,
            p_total_price: params.totalPrice
        });

        if (error || !data) throw error || new Error('RPC Failed');
        return data;
    }
}

export const orderRepository = new OrderRepository();
