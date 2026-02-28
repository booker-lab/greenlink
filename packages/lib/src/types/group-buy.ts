import { ProductMetadata } from './models';

export interface AuctionItem {
    id: string; // ex) auc-20260222-123
    settlementDate: string; // 경매 일자 YYYY-MM-DD
    flowerType: string; // 화훼 부류 (ex: '절화', '관엽', '난')
    flowerGubun: number; // API 파라미터 매핑 (ex: 3 = 난)
    itemName: string; // 품목명 (ex: '서양란')
    varietyName: string; // 품종명 (ex: '호접란(블루 스카이 특)')
    grade: string; // 등급 (특, 상, 보통 등)
    maxPrice: number; // 최고가
    minPrice: number; // 최저가
    avgPrice: number; // 평균가 (기준 원가)
    totalQuantity: number; // 총 거래 물량
}

export type GroupBuyStatus = 'RECRUITING' | 'GOAL_MET' | 'PURCHASING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';

// 기존 KamisItem 역할을 대체하며, CRITICAL_LOGIC.md의 제로 인벤토리 모델을 온전히 구현한 표준 Interface
export interface ZeroInventoryItem {
    id: string;
    itemNm: string; // 노출용 상품명
    categoryId: 'CUT' | 'ORC' | 'FOL' | 'ETC'; // MVP 카테고리
    qty: number; // 참고용 최근 경매 물량
    avgCost: number; // 경매 원가 (매입 예상가)
    sellingPrice: number; // 판매가(예치 결제액)
    currentParticipants: number; // 현재 참여(결제) 인원
    targetParticipants: number; // 구매 임계치 (기본 10)
    status: GroupBuyStatus;
    imageUrl: string;
    auctionParams?: {
        flowerGubun: number;
        itemNm: string;
    };
    metadata?: ProductMetadata; // 유연한 카테고리 확장성
}

export interface GroupBuyParticipant {
    userId: string;
    name: string;
    joinedAt: string;
    quantity: number;
    isEscrowPaid: boolean; // 에스크로 결제 완료 여부
}

export interface GroupBuyDeal {
    id: string;
    zeroInventoryItem: ZeroInventoryItem; // 위에서 정의한 표준 아이템 포함
    title: string;
    description: string;
    status: GroupBuyStatus;
    deadline: string;
    deliveryDate?: string;
    participants: GroupBuyParticipant[];
    createdAt: string;
}
