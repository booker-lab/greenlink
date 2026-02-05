import React from 'react';
import Link from 'next/link';
import { ChevronRight, Leaf, Apple, Carrot, Grape, Flower2, Fish, Coffee, ShoppingBag } from 'lucide-react';

const categories = [
    { id: 1, name: '채소/샐러드', icon: Leaf, color: 'text-green-600' },
    { id: 2, name: '과일', icon: Apple, color: 'text-red-500' },
    { id: 3, name: '쌀', icon: Carrot, color: 'text-orange-500' },
    { id: 4, name: '축산/계란', icon: Grape, color: 'text-purple-500' },
    { id: 5, name: '수산물', icon: Fish, color: 'text-blue-500' },
    { id: 6, name: '화훼', icon: Flower2, color: 'text-pink-500' },
    { id: 7, name: '가공식품', icon: Coffee, color: 'text-amber-600' },
    { id: 8, name: '건강식품', icon: ShoppingBag, color: 'text-teal-600' },
];

export default function CategoryList() {
    return (
        <div className="bg-white">
            {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                    <Link
                        key={category.id}
                        href={`/category/${category.id}`}
                        className="flex items-center justify-between px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <IconComponent className={`w-6 h-6 ${category.color}`} />
                            <span className="text-gray-800 font-medium">{category.name}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                );
            })}
        </div>
    );
}
