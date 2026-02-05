import React from 'react';
import { ChevronRight, Package, MapPin, CreditCard, Headphones, Settings, Bell } from 'lucide-react';
import Link from 'next/link';

export default function MyPageDashboard() {
    const recentProducts = [
        { id: 1, name: '신선한 로즈마리', image: '🌿' },
        { id: 2, name: '튤립 꽃다발', image: '🌷' },
        { id: 3, name: '다육이 세트', image: '🌵' },
        { id: 4, name: '허브 모음', image: '🌱' },
    ];

    const menuSections = [
        {
            title: '주문 내역',
            items: [
                { name: '나의 주문 내역', icon: Package, href: '/orders' },
                { name: '배송지 관리', icon: MapPin, href: '/addresses' },
            ],
        },
        {
            title: '고객 지원',
            items: [
                { name: '고객센터 / 도움말', icon: Headphones, href: '/support' },
                { name: '공지사항', icon: Bell, href: '/notices' },
            ],
        },
        {
            title: '나의 소식',
            items: [
                { name: '결제 수단 관리', icon: CreditCard, href: '/payment' },
                { name: '설정', icon: Settings, href: '/settings' },
            ],
        },
    ];

    return (
        <div className="pb-20">
            {/* Profile Section */}
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-2xl">
                        J
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">정의</h2>
                        <p className="text-sm opacity-90">그린 등급 새싹</p>
                    </div>
                </div>

                {/* Points/Coupon Card */}
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex justify-around">
                        <div className="text-center">
                            <div className="text-2xl font-bold">3,000원</div>
                            <div className="text-xs opacity-90">적립금</div>
                        </div>
                        <div className="w-px bg-white/30"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">5</div>
                            <div className="text-xs opacity-90">쿠폰</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Products */}
            <div className="p-4 bg-white border-b border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-800">최근 본 상품</h3>
                    <Link href="/recent" className="text-sm text-green-600">
                        전체보기 →
                    </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto">
                    {recentProducts.map((product) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl"
                        >
                            {product.image}
                        </div>
                    ))}
                </div>
            </div>

            {/* Menu Sections */}
            {menuSections.map((section, index) => (
                <div key={index} className="bg-white border-b-8 border-gray-100">
                    <h3 className="px-4 pt-4 pb-2 font-bold text-gray-800">{section.title}</h3>
                    {section.items.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <IconComponent className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-700">{item.name}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
