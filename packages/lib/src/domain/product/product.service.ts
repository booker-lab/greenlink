import { ZeroInventoryItem } from './product.schema';
import { productRepository } from './product.repository';

export class ProductService {
    // --- Mock Data (seed_data.js와 100% 동기화 - DB 조회 실패 시 대칭 Fallback) ---
    private mockItems: ZeroInventoryItem[] = [
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
            qty: 8000,
            avgCost: 8000,
            sellingPrice: 11000,
            currentParticipants: 10,
            targetParticipants: 10,
            status: 'GOAL_MET',
            imageUrl: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400&h=400&fit=crop",
            metadata: { bloomStage: 3, stemLength: 70, fragrance: 'NONE' }
        },
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

    /**
     * 카테고리별 아이템 조회 (DB 실패 시 Mock 반환)
     */
    async getItemsByCategory(categoryId: 'CUT' | 'ORC' | 'FOL' | 'ETC'): Promise<ZeroInventoryItem[]> {
        try {
            const items = await productRepository.findByCategoryId(categoryId);
            if (items.length === 0) {
                return this.mockItems.filter(item => item.categoryId === categoryId);
            }
            return items;
        } catch (e) {
            console.warn(`[ProductService] Failed to fetch DB items for ${categoryId}. Using mock fallback.`, e);
            return this.mockItems.filter(item => item.categoryId === categoryId);
        }
    }

    /**
     * 단일 아이템 상세 조회 (ID가 UUID 형식이 아니면 Mock에서 검색)
     */
    async getItemById(id: string): Promise<ZeroInventoryItem | null> {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (!isUuid) {
            return this.mockItems.find(item => item.id === id) || null;
        }

        try {
            const item = await productRepository.findById(id);
            return item || this.mockItems.find(m => m.id === id) || null;
        } catch (e) {
            console.warn(`[ProductService] Failed to fetch DB item ${id}. Using mock fallback.`, e);
            return this.mockItems.find(m => m.id === id) || null;
        }
    }

    /**
     * 단순히 Mock만 반환 (테스트용)
     */
    getMockItems(categoryId?: string): ZeroInventoryItem[] {
        return categoryId ? this.mockItems.filter(item => item.categoryId === categoryId) : this.mockItems;
    }
}

export const productService = new ProductService();
