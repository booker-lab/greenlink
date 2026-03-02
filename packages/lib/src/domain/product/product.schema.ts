export interface ProductMetadata {
    // 절화(CUT)용
    bloomStage?: 1 | 2 | 3 | 4 | 5; // 개화 상태 지수 
    stemLength?: number; // 줄기 길이 (cm)
    fragrance?: 'STRONG' | 'MEDIUM' | 'WEAK' | 'NONE'; // 향기 강도

    // 관엽(FOL)용
    plantHeight?: number; // 식물 전체 높이 (cm)
    potSize?: number; // 화분 호수
    formQuality?: 'A' | 'B' | 'C'; // 수형 등급
    difficulty?: 'EASY' | 'NORMAL' | 'HARD'; // 관리 난이도

    // 기타 JSONB 확장을 위한 유연한 속성 배열 허용
    [key: string]: any;
}

export interface Product {
    id: string;
    farmId: string;
    name: string;
    price: number;
    originalPrice?: number; // 경매가 (avgCost)
    stock: number; // Zero-Inventory일 경우 targetParticipants로 쓰이거나, 실제 재고 수량으로 쓰임
    unit: string;
    description: string;
    images: string[];
    category: 'CUT' | 'ORC' | 'FOL' | 'ETC';
    status: 'ACTIVE' | 'SOLDOUT' | 'HIDDEN' | 'RECRUITING' | 'GOAL_MET';
    qualityInspectorReport?: { // 전문가 검수 리포트
        inspectorName: string;
        inspectedAt: string;
        grade: 'A+' | 'A' | 'B';
        notes: string;
    };
    aiMarketingText?: string; // V2S로 생성된 마케팅 문구
    createdAt: string;
    metadata?: ProductMetadata; // 유연한 카테고리 확장성(JSONB 대응)을 위한 필드
}

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
