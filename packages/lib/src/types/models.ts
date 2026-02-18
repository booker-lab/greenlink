export interface GreenTemperature {
    value: number; // 0~100
    level: string; // '새싹' | '줄기' | '꽃' | '열매'
    emoji: string;
    description: string;
}

export interface Certification {
    name: string;
    issuedBy: string;
    issuedAt: string;
}

export interface Farm {
    id: string;
    name: string;
    owner: string;
    category: string;
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

export interface Product {
    id: string;
    farmId: string;
    name: string;
    price: number;
    originalPrice?: number;
    stock: number;
    unit: string;
    description: string;
    images: string[];
    category: string;
    status: 'active' | 'soldout' | 'hidden';
    createdAt: string;
}

export type OrderStatus = 'ORDERED' | 'PREPARING' | 'DISPATCHED' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';

export interface Order {
    id: string;
    productId: string;
    farmId: string;
    buyerName: string;
    buyerPhone: string;
    buyerAddress: string;
    quantity: number;
    totalPrice: number;
    status: OrderStatus;
    deliveryDate: string; // YYYY-MM-DD
    orderedAt: string;
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
