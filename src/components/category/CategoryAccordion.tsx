'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search } from 'lucide-react';

// 카테고리 데이터 (8도감 스타일)
const categoryData = [
    {
        id: 1,
        name: '채소/샐러드',
        icon: '🥬',
        subcategories: [
            '전체', '시금치', '쌈/잎채소/배추류', '딸기/블루베리/베리류',
            '뿌리/줄기/단호박', '양상추/양배추', '친환경', '무화과/무화과잎/기타과일',
            '감자/고구마/당근', '키위/키위수/망고', '오이/가지/주스채소', '파인애플/바나나/기타과일',
            '브로콜리/컬리플라워', '당근/비트모음', '고춧잎/한식/깻잎채', '청포도/생청포도',
            '샐러드용채소', '허브/세척', '모듬채소'
        ]
    },
    {
        id: 2,
        name: '저소',
        icon: '🥕',
        subcategories: [
            '시세', '육수수/초당옥수수/강낭콩',
            '고추/마늘/생강/매실', '가지/오이/호박',
            '다다기오이/한방/깻잎', '여자/들깨줄기',
            '우엉/연근/카레분', '게탕/단팥',
            '배추', '채소류/밑반찬/장류',
            '양파/마늘/대파/생강', '해초/김/강/육류해초',
            '건토마토/채소/해초', '시금치/순침/통조림',
            '두릅/송이/버섯', '콩나물/콩/콩',
            '수박/참외/멜론/메론', '야채즙/발사믹/해독쥬',
            '과/채/등/기타'
        ]
    },
    {
        id: 3,
        name: '김치',
        icon: '🥢',
        subcategories: [
            '전체', '배추김치',
            '무무침치', '열무김치',
            '깍두기', '갓/파김치'
        ]
    },
    {
        id: 4,
        name: '과일',
        icon: '🍎',
        subcategories: [
            '전체', '사과', '배', '감', '귤/오렌지', '포도',
            '딸기', '수박', '멜론', '복숭아', '자두', '체리'
        ]
    },
    {
        id: 5,
        name: '화훼',
        icon: '🌸',
        subcategories: [
            '전체', '장미', '국화', '튤립', '백합', '카네이션',
            '안개꽃', '거베라', '프리지아', '다육/선인장', '관엽식물', '화분'
        ]
    },
    {
        id: 6,
        name: '축산/계란',
        icon: '🥩',
        subcategories: [
            '전체', '소고기', '돼지고기', '닭고기', '오리고기',
            '양고기', '계란', '유정란', '메추리알'
        ]
    },
    {
        id: 7,
        name: '수산물',
        icon: '🐟',
        subcategories: [
            '전체', '생선', '조개/갑각류', '해조류', '건어물',
            '젓갈', '활어', '회/초밥', '훈제/절임'
        ]
    },
    {
        id: 8,
        name: '가공식품',
        icon: '🥫',
        subcategories: [
            '전체', '통조림', '라면/면류', '소스/양념', '장류',
            '식용유', '밀가루/전분', '견과류', '건조식품'
        ]
    }
];

interface CategoryAccordionProps {
    initialOpenCategory?: number;
}

export default function CategoryAccordion({ initialOpenCategory }: CategoryAccordionProps) {
    const [openCategories, setOpenCategories] = useState<number[]>(
        initialOpenCategory ? [initialOpenCategory] : [1]
    );

    const toggleCategory = (categoryId: number) => {
        setOpenCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const isOpen = (categoryId: number) => openCategories.includes(categoryId);

    return (
        <div className="bg-white pb-20">
            {/* Category Accordions */}
            <div className="divide-y divide-gray-100">
                {categoryData.map((category) => (
                    <div key={category.id}>
                        {/* Category Header */}
                        <button
                            onClick={() => toggleCategory(category.id)}
                            className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{category.icon}</span>
                                <span className="font-semibold text-gray-800">{category.name}</span>
                            </div>
                            <ChevronDown
                                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen(category.id) ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {/* Subcategories Grid */}
                        {isOpen(category.id) && (
                            <div className="bg-gray-50 px-4 py-3">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    {category.subcategories.map((sub, index) => (
                                        <button
                                            key={index}
                                            onClick={() => alert(`${category.name} > ${sub} 상품 목록 페이지로 이동 (개발 예정)`)}
                                            className="text-sm text-gray-700 hover:text-green-600 transition-colors py-1 text-left"
                                        >
                                            {sub}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
