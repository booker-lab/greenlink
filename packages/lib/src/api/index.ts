import { ZeroInventoryItem, Order, OrderStatus } from '../types';
import { createClient } from './supabase';

function mapToItem(row: any): ZeroInventoryItem {
    return {
        id: row.id,
        itemNm: row.item_nm,
        categoryId: row.category_id as any,
        qty: row.qty,
        avgCost: row.avg_cost,
        sellingPrice: row.selling_price,
        currentParticipants: row.current_participants,
        targetParticipants: row.target_participants,
        status: row.status as any,
        imageUrl: row.image_url,
        auctionParams: row.auction_params,
        metadata: row.metadata,
    };
}

/**
 * GreenLink API Skeleton
 * 백엔드 연동을 위한 인터페이스 우선(Data Interface First) 접근법 기반의 Mock API Client
 */
class ApiSkeleton {

    private get supabase() { return createClient(); }

    // --- Mock Data (seed_data.js와 100% 동기화 - DB 조회 실패 시 대칭 Fallback) ---
    private mockItems: ZeroInventoryItem[] = [
        // ORC (난) - 2개
        {
            id: "orc-1",
            itemNm: "호접란 (블루 스카이 특)",
            categoryId: 'ORC',
            qty: 8500,
            avgCost: 15000,
            sellingPrice: 19000,
            currentParticipants: 8,
            targetParticipants: 10,
            status: 'RECRUITING',
            imageUrl: "https://images.unsplash.com/photo-1495480174641-32599268f775?w=400&h=400&fit=crop",
            metadata: { grade: 'SPECIAL', shootCount: 3, auctionParams: { flowerGubun: 3, itemNm: '서양란' } }
        },
        {
            id: "orc-2",
            itemNm: "동양란 (철골소심 상)",
            categoryId: 'ORC',
            qty: 3200,
            avgCost: 25000,
            sellingPrice: 32000,
            currentParticipants: 10,
            targetParticipants: 10,
            status: 'GOAL_MET',
            imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop",
            metadata: { grade: 'HIGH', shootCount: 5, auctionParams: { flowerGubun: 1, itemNm: '동양란' } }
        },
        // CUT (절화) - 3개
        {
            id: "cut-1",
            itemNm: "장미 (레드나오미 특)",
            categoryId: 'CUT',
            qty: 15420,
            avgCost: 15000,
            sellingPrice: 18500,
            currentParticipants: 8,
            targetParticipants: 10,
            status: 'RECRUITING',
            imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=400&fit=crop",
            metadata: { bloomStage: 2, stemLength: 60, fragrance: 'WEAK' }
        },
        {
            id: "cut-2",
            itemNm: "튤립 (망고 특)",
            categoryId: 'CUT',
            qty: 8200,
            avgCost: 12000,
            sellingPrice: 15900,
            currentParticipants: 15,
            targetParticipants: 20,
            status: 'RECRUITING',
            imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop",
            metadata: { bloomStage: 1, stemLength: 50, fragrance: 'NONE' }
        },
        {
            id: "cut-3",
            itemNm: "안개꽃 (화이트 화형상)",
            categoryId: 'CUT',
            qty: 5400,
            avgCost: 8000,
            sellingPrice: 11000,
            currentParticipants: 10,
            targetParticipants: 10,
            status: 'GOAL_MET',
            imageUrl: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400&h=400&fit=crop",
            metadata: { bloomStage: 3, stemLength: 70, fragrance: 'NONE' }
        },
        // FOL (관엽) - 3개
        {
            id: "fol-1",
            itemNm: "몬스테라 (알보 상)",
            categoryId: 'FOL',
            qty: 3000,
            avgCost: 35000,
            sellingPrice: 42000,
            currentParticipants: 3,
            targetParticipants: 10,
            status: 'RECRUITING',
            imageUrl: "https://images.unsplash.com/photo-1495480174641-32599268f775?w=400&h=400&fit=crop",
            metadata: { plantHeight: 40, potSize: 5, formQuality: 'B', difficulty: 'NORMAL' }
        },
        {
            id: "fol-2",
            itemNm: "금전수 (돈나무 대)",
            categoryId: 'FOL',
            qty: 1200,
            avgCost: 45000,
            sellingPrice: 55000,
            currentParticipants: 10,
            targetParticipants: 10,
            status: 'GOAL_MET',
            imageUrl: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=400&fit=crop",
            metadata: { plantHeight: 80, potSize: 10, formQuality: 'A', difficulty: 'EASY' }
        },
        {
            id: "fol-3",
            itemNm: "뱅갈고무나무 (중)",
            categoryId: 'FOL',
            qty: 2500,
            avgCost: 28000,
            sellingPrice: 35000,
            currentParticipants: 5,
            targetParticipants: 10,
            status: 'RECRUITING',
            imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=400&fit=crop",
            metadata: { plantHeight: 120, potSize: 8, formQuality: 'A', difficulty: 'EASY' }
        }
    ];

    public getMockItems(categoryId?: string): ZeroInventoryItem[] {
        return categoryId ? this.mockItems.filter(item => item.categoryId === categoryId) : this.mockItems;
    }

    private mockOrders: Order[] = [];

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 1. 카테고리별 아이템 조회
    async getZeroInventoryItems(categoryId: 'CUT' | 'ORC' | 'FOL' | 'ETC'): Promise<ZeroInventoryItem[]> {
        console.log(`[API Trace] ${categoryId} - START getZeroInventoryItems`);
        try {
            const client = this.supabase;

            const { data, error } = await (client
                .from('zero_inventory_items')
                .select('id, item_nm, category_id, qty, avg_cost, selling_price, current_participants, target_participants, status, image_url, metadata')
                .eq('category_id', categoryId)
                .order('created_at', { ascending: false }) as any)
                .abortSignal(AbortSignal.timeout(4000));

            if (error) {
                console.warn(`[API Trace] ${categoryId} - Supabase Error:`, error.message);
                return this.mockItems.filter(item => item.categoryId === categoryId);
            }

            if (!data || data.length === 0) {
                console.log(`[API Trace] ${categoryId} - No data. Using mock fallback.`);
                return this.mockItems.filter(item => item.categoryId === categoryId);
            }

            return data.map(mapToItem);
        } catch (e: any) {
            console.error(`[API Trace] ${categoryId} - FATAL ERROR:`, e);
            return this.mockItems.filter(item => item.categoryId === categoryId);
        }
    }

    // 2. 단일 아이템 상세 조회
    async getZeroInventoryItem(id: string): Promise<ZeroInventoryItem | null> {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (!isUuid) {
            return this.mockItems.find(item => item.id === id) || null;
        }

        try {
            const { data, error } = await (this.supabase
                .from('zero_inventory_items')
                .select('id, item_nm, category_id, qty, avg_cost, selling_price, current_participants, target_participants, status, image_url, metadata')
                .eq('id', id)
                .single() as any);

            if (error || !data) {
                console.warn(`[API Trace] Object ${id} - Supabase Error:`, error?.message);
                return this.mockItems.find(item => item.id === id) || null;
            }

            return mapToItem(data);
        } catch (e: any) {
            console.error(`[API Trace] Object ${id} - FATAL ERROR:`, e);
            return this.mockItems.find(item => item.id === id) || null;
        }
    }

    // 3. 에스크로 예치 결제 및 주문 생성
    async createEscrowOrder(
        itemId: string,
        qty: number,
        buyerInfo: { name: string, phone: string, address: string }
    ): Promise<Order> {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(itemId);

        if (!isUuid) {
            await this.delay(500);
            const item = await this.getZeroInventoryItem(itemId);
            if (!item) throw new Error("Item not found");

            const newOrder: Order = {
                id: `ord-${Date.now()}`,
                productId: item.id,
                buyerName: buyerInfo.name,
                buyerPhone: buyerInfo.phone,
                buyerAddress: buyerInfo.address,
                quantity: qty,
                totalPrice: item.sellingPrice * qty,
                status: 'ESCROW_DEPOSIT',
                deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                orderedAt: new Date().toISOString(),
                isEscrow: true,
            };

            this.mockOrders.push(newOrder);
            item.currentParticipants += qty;
            return newOrder;
        }

        const item = await this.getZeroInventoryItem(itemId);
        if (!item) throw new Error("Database Item not found");

        const { data, error } = await this.supabase.rpc('create_escrow_order_txn', {
            p_product_id: itemId,
            p_buyer_name: buyerInfo.name,
            p_buyer_phone: buyerInfo.phone,
            p_buyer_address: buyerInfo.address,
            p_quantity: qty,
            p_total_price: item.sellingPrice * qty
        });

        if (error || !data) throw new Error(`Order Failed: ${error?.message || 'Server Error'}`);

        return {
            id: data.order_id,
            productId: itemId,
            buyerName: buyerInfo.name,
            buyerPhone: buyerInfo.phone,
            buyerAddress: buyerInfo.address,
            quantity: qty,
            totalPrice: item.sellingPrice * qty,
            status: 'ESCROW_DEPOSIT',
            deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            orderedAt: new Date().toISOString(),
            isEscrow: true,
        };
    }

    async getMyOrders(): Promise<Order[]> {
        return this.mockOrders;
    }

    async getProfile(userId: string) {
        try {
            const { data, error } = await (this.supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single() as any)
                .abortSignal(AbortSignal.timeout(4000));

            if (error || !data) throw new Error();
            return {
                id: data.id,
                nickname: data.nickname || "그린러버",
                pinkTemperature: data.pink_temperature || { value: 36.5, level: "첫눈", emoji: "♥" },
                points: data.points || 0
            };
        } catch {
            return {
                id: userId,
                nickname: "그린러버(Mock)",
                pinkTemperature: { value: 36.5, level: "첫눈", emoji: "♥" },
                points: 0
            };
        }
    }

    async getCartCount(userId: string): Promise<number> {
        try {
            const { count, error } = await (this.supabase
                .from('cart_items')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId) as any)
                .abortSignal(AbortSignal.timeout(4000));
            return count || 0;
        } catch {
            return 0;
        }
    }
}

export const greenlinkApi = new ApiSkeleton();
