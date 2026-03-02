import { ZeroInventoryItem, Order } from '../types';
import { productService } from '../domain/product/product.service';
import { orderService } from '../domain/order/order.service';
import { userService } from '../domain/user/user.service';

/**
 * GreenLink API Skeleton (Facade)
 * 3-Layer DDD 패턴으로 리팩토링된 도메인 서비스들을 통합 제공하는 진입점입니다.
 * 기존 코드와의 호환성을 위해 인터페이스를 유지합니다.
 */
class ApiSkeleton {
    // 1. 카테고리별 아이템 조회
    async getZeroInventoryItems(categoryId: 'CUT' | 'ORC' | 'FOL' | 'ETC'): Promise<ZeroInventoryItem[]> {
        return productService.getItemsByCategory(categoryId);
    }

    // 2. 단일 아이템 상세 조회
    async getZeroInventoryItem(id: string): Promise<ZeroInventoryItem | null> {
        return productService.getItemById(id);
    }

    // 3. 에스크로 예치 결제 및 주문 생성
    async createEscrowOrder(
        userId: string,
        itemId: string,
        qty: number,
        buyerInfo: { name: string, phone: string, address: string }
    ): Promise<Order> {
        return orderService.createOrder({ userId, itemId, qty, buyerInfo });
    }

    // 4. 내 주문 목록 조회
    async getMyOrders(userId?: string): Promise<Order[]> {
        return orderService.getMyOrders(userId);
    }

    // 5. 단일 주문 상세 조회
    async getOrder(orderId: string): Promise<Order | null> {
        return orderService.getOrder(orderId);
    }

    // 6. 주문 취소
    async cancelOrder(orderId: string): Promise<boolean> {
        return orderService.cancelOrder(orderId);
    }

    // 7. 프로필 조회
    async getProfile(userId: string) {
        return userService.getProfile(userId);
    }

    // 8. 장바구니 개수 조회
    async getCartCount(userId: string): Promise<number> {
        return userService.getCartCount(userId);
    }

    // 9. 장바구니에 아이템 추가
    async addToCart(userId: string, productId: string, qty: number = 1): Promise<boolean> {
        return userService.addToCart(userId, productId, qty);
    }

    // 10. 장바구니 목록 조회
    async getCartItems(userId: string): Promise<any[]> {
        return userService.getCartItems(userId);
    }

    // Helper: Mock 데이터 직접 접근 (기존 테스트 호환성)
    public getMockItems(categoryId?: string): ZeroInventoryItem[] {
        return productService.getMockItems(categoryId);
    }
}

export const greenlinkApi = new ApiSkeleton();
