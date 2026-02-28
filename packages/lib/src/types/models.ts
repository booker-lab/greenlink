export interface GreenTemperature {
    value: number; // 0~100 (거래 매너, 식물 신선도, 직배송 매너 기반)
    level: string; // '새싹' | '줄기' | '꽃' | '열매'
    emoji: string;
    description: string;
}

export interface Certification {
    name: string;
    issuedBy: string;
    issuedAt: string;
    // 다중 인증 시스템 고려: '농업경영체' | 'GPS위치인증' | '사업자인증' | '품질전문가인증'
    type?: 'FARM_MGMT' | 'GPS_LOC' | 'B2B_BIZ' | 'QUALITY_EXPERT';
}

export interface Farm {
    id: string;
    name: string;
    owner: string;
    category: 'CUT' | 'ORC' | 'FOL' | 'OTHER'; // 절화, 난, 관엽 특화
    subcategory: string;
    location: {
        address: string;
        city: string;
        district: string;
        coordinates?: { lat: number; lng: number };
    };
    phone: string;
    description: string;
    certifications: Certification[];
    greenTemperature: GreenTemperature;
    followers: number;
    createdAt: string;
    profileEmoji: string;
    tags: string[];
}

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

export type OrderStatus = 'ESCROW_DEPOSIT' | 'ORDERED' | 'PREPARING' | 'DISPATCHED' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';

export interface Order {
    id: string;
    productId: string; // 제로 인벤토리 공구 아이템 ID
    farmId?: string;
    buyerName: string;
    buyerPhone: string;
    buyerAddress: string;
    quantity: number;
    totalPrice: number;
    status: OrderStatus;
    deliveryDate: string; // YYYY-MM-DD, D+2 ~ D+10 예약 배송 시스템 고려
    orderedAt: string;
    isEscrow: boolean; // 100% 자동 환불을 위한 안전결제 플래그
    message?: string;
    deliveryTaskId?: string;
}

export type DeliveryStatus = 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';

export interface DeliveryTask {
    id: string;
    orderId: string;
    farmId: string;
    status: DeliveryStatus;
    pickupAddress: string;
    pickupCoords: { lat: number; lng: number };
    deliveryAddress: string;
    deliveryCoords: { lat: number; lng: number };
    recipientName: string;
    recipientPhone: string;
    items: string[];
    priority: number;
    photoUrls: string[];
    notes?: string;
    pickedUpAt?: string;
    deliveredAt?: string;
    createdAt: string;
}

export interface DailyQuota {
    date: string; // YYYY-MM-DD
    maxOrders: number;
    currentOrders: number;
}
