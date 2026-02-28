import { GroupBuyDeal } from '../types';

export const MOCK_GROUP_BUYS: GroupBuyDeal[] = [
    {
        id: 'gb-001',
        zeroInventoryItem: {
            id: 'orc-1',
            itemNm: '호접란 아마빌리스 특',
            categoryId: 'ORC',
            qty: 500,
            avgCost: 15000,
            sellingPrice: 19000,
            currentParticipants: 8,
            targetParticipants: 10,
            status: 'RECRUITING',
            imageUrl: 'https://images.unsplash.com/photo-1495480174641-32599268f775?w=400&q=80',
        },
        title: '호접란(아마빌리스 특) 제로인벤토리',
        description: '경매장 직송! 최상급 호접란을 저렴하게 만나보세요.',
        status: 'RECRUITING',
        deadline: '2023-11-25T12:00:00Z',
        participants: [],
        createdAt: '2023-11-18T10:00:00Z',
    },
];
