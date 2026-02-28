import { Farm } from '../types';

export const MOCK_FARMS: Farm[] = [
    {
        id: 'farm-dear-orchid-001',
        name: '디어 오키드',
        owner: '김란초',
        category: 'ORC',
        subcategory: '동양란',
        location: {
            address: '경기도 이천시 마장면 서이천로 123',
            city: '이천시',
            district: '마장면',
            coordinates: { lat: 37.2747, lng: 127.4350 },
        },
        phone: '010-1234-5678',
        description: '30년 전통의 동양란 전문 농장. 보세란, 풍란, 석곡 등 다양한 동양란을 직접 재배합니다.',
        certifications: [
            { name: '농업경영체 등록', issuedBy: '국립농산물품질관리원', issuedAt: '2020-03-15' },
        ],
        greenTemperature: {
            value: 42.5,
            level: '줄기',
            emoji: '🌱',
            description: '믿을 수 있는 판매자입니다.',
        },
        followers: 128,
        createdAt: '2023-01-15T09:00:00Z',
        profileEmoji: '🌸',
        tags: ['동양란', '보세란', '풍란', '난초', '이천', '직거래', 'B2B'],
    },
];
