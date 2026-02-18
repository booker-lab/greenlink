export interface AuctionItem {
    id: string;
    settlementDate: string;
    flowerType: string;
    itemName: string;
    varietyName: string;
    grade: string;
    maxPrice: number;
    minPrice: number;
    avgPrice: number;
    totalQuantity: number;
    totalAmount: number;
    unitSize: number;
}

export type GroupBuyStatus = 'RECRUITING' | 'GOAL_MET' | 'PURCHASING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';

export interface GroupBuyParticipant {
    userId: string;
    name: string;
    joinedAt: string;
    quantity: number;
}

export interface GroupBuyDeal {
    id: string;
    title: string;
    description: string;
    image: string;
    categoryId: string;
    auctionRef?: AuctionItem;
    estimatedCost: number;
    sellingPrice: number;
    deliveryFee: number;
    targetCount?: never; // Deprecated
    currentCount?: never; // Deprecated
    minQuantity: number;
    currentQuantity: number;
    status: GroupBuyStatus;
    deadline: string;
    deliveryDate?: string;
    participants: GroupBuyParticipant[];
    createdAt: string;
}
