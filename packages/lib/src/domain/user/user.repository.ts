import { createClient } from '../../api/supabase';

export class UserRepository {
    private get supabase() { return createClient(); }

    /**
     * 프로필 정보 조회
     */
    async findProfileById(userId: string) {
        const { data, error } = await (this.supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single() as any)
            .abortSignal(AbortSignal.timeout(4000));

        if (error) throw error;
        return data;
    }

    /**
     * 장바구니 아이템 개수 조회
     */
    async getCartCount(userId: string): Promise<number> {
        const { count, error } = await (this.supabase
            .from('cart_items')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId) as any)
            .abortSignal(AbortSignal.timeout(4000));

        if (error) throw error;
        return count || 0;
    }

    /**
     * 장바구니 아이템 추가/수정 (Upsert)
     */
    async upsertCartItem(params: { userId: string, productId: string, quantity: number }) {
        const { error } = await this.supabase
            .from('cart_items')
            .upsert(
                { user_id: params.userId, product_id: params.productId, quantity: params.quantity },
                { onConflict: 'user_id, product_id' }
            );

        if (error) throw error;
        return true;
    }

    /**
     * 장바구니 목록 조회
     */
    async findCartItemsByUserId(userId: string) {
        const { data, error } = await (this.supabase
            .from('cart_items')
            .select(`
                *,
                product:zero_inventory_items (*)
            `)
            .eq('user_id', userId) as any)
            .abortSignal(AbortSignal.timeout(4000));

        if (error) throw error;
        return data || [];
    }
}

export const userRepository = new UserRepository();
