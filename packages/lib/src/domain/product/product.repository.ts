import { createClient } from '../../api/supabase';
import { ZeroInventoryItem } from './product.schema';

export class ProductRepository {
    private get supabase() { return createClient(); }

    private mapToItem(row: any): ZeroInventoryItem {
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
     * 카테고리별 제로 인벤토리 아이템 목록 조회
     */
    async findByCategoryId(categoryId: string): Promise<ZeroInventoryItem[]> {
        const { data, error } = await (this.supabase
            .from('zero_inventory_items')
            .select('id, item_nm, category_id, qty, avg_cost, selling_price, current_participants, target_participants, status, image_url, metadata')
            .eq('category_id', categoryId)
            .order('created_at', { ascending: false }) as any)
            .abortSignal(AbortSignal.timeout(4000));

        if (error) throw error;
        return (data || []).map((row: any) => this.mapToItem(row));
    }

    /**
     * ID 기반 단일 제로 인벤토리 아이템 조회
     */
    async findById(id: string): Promise<ZeroInventoryItem | null> {
        const { data, error } = await (this.supabase
            .from('zero_inventory_items')
            .select('id, item_nm, category_id, qty, avg_cost, selling_price, current_participants, target_participants, status, image_url, metadata')
            .eq('id', id)
            .single() as any);

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }
        return data ? this.mapToItem(data) : null;
    }
}

export const productRepository = new ProductRepository();
