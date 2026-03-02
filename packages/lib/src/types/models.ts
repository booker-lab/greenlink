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
