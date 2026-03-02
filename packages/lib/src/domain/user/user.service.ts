import { userRepository } from './user.repository';
import { productService } from '../product/product.service';

const GLOBAL_MOCK_CART: any[] = [];

export class UserService {
    private hydrateMockCart() {
        if (typeof window !== 'undefined' && GLOBAL_MOCK_CART.length === 0) {
            const saved = localStorage.getItem('gl_mock_cart');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) {
                        GLOBAL_MOCK_CART.splice(0, GLOBAL_MOCK_CART.length, ...parsed);
                    }
                } catch (e) { }
            }
        }
    }

    private persistMockCart() {
        if (typeof window !== 'undefined') {
            localStorage.setItem('gl_mock_cart', JSON.stringify(GLOBAL_MOCK_CART));
        }
    }

    /**
     * 프로필 정보 조회 (DB 실패 시 Mock 반환)
     */
    async getProfile(userId: string) {
        try {
            const data = await userRepository.findProfileById(userId);
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

    /**
     * 장바구니 아이템 개수 (DB + Mock)
     */
    async getCartCount(userId: string): Promise<number> {
        this.hydrateMockCart();
        try {
            const dbCount = await userRepository.getCartCount(userId);
            const mockCount = GLOBAL_MOCK_CART.filter(c => c.user_id === userId).length;
            return dbCount + mockCount;
        } catch {
            return GLOBAL_MOCK_CART.filter(c => c.user_id === userId).length;
        }
    }

    /**
     * 장바구니에 아이템 추가
     */
    async addToCart(userId: string, productId: string, qty: number = 1): Promise<boolean> {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);

        if (!isUuid) {
            this.hydrateMockCart();
            const item = await productService.getItemById(productId);
            const existing = GLOBAL_MOCK_CART.find(c => c.product_id === productId && c.user_id === userId);

            if (existing) {
                existing.quantity += qty;
            } else {
                GLOBAL_MOCK_CART.push({
                    id: `cart-${Date.now()}`,
                    user_id: userId,
                    product_id: productId,
                    quantity: qty,
                    product: item ? {
                        id: item.id,
                        item_nm: item.itemNm,
                        selling_price: item.sellingPrice,
                        category_id: item.categoryId,
                        image_url: item.imageUrl
                    } : null
                });
            }
            this.persistMockCart();
            return true;
        }

        try {
            return await userRepository.upsertCartItem({ userId, productId, quantity: qty });
        } catch (e) {
            console.error('[UserService] addToCart failed:', e);
            return false;
        }
    }

    /**
     * 장바구니 목록 (DB + Mock 병합)
     */
    async getCartItems(userId: string): Promise<any[]> {
        this.hydrateMockCart();
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);

        if (!isUuid) {
            return GLOBAL_MOCK_CART.filter(c => c.user_id === userId);
        }

        try {
            const dbItems = await userRepository.findCartItemsByUserId(userId);
            const myMockCart = GLOBAL_MOCK_CART.filter(c => c.user_id === userId);
            return [...dbItems, ...myMockCart];
        } catch (e) {
            console.error('[UserService] getCartItems failed:', e);
            return GLOBAL_MOCK_CART.filter(c => c.user_id === userId);
        }
    }
}

export const userService = new UserService();
