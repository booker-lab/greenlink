import React from 'react';
import MainHeader from '@/components/layout/MainHeader';
import HomeBanner from '@/components/home/HomeBanner';

export default function HomePage() {
    // Sample product data
    const products = [
        { id: 1, name: '신선한 로즈마리', price: 12000, image: '🌿', seller: '초록농장' },
        { id: 2, name: '튤립 꽃다발', price: 25000, image: '🌷', seller: '꽃밭농원' },
        { id: 3, name: '다육이 세트', price: 18000, image: '🌵', seller: '선인장마을' },
        { id: 4, name: '허브 모음', price: 15000, image: '🌱', seller: '향기정원' },
        { id: 5, name: '장미 한 송이', price: 8000, image: '🌹', seller: '로즈가든' },
        { id: 6, name: '해바라기', price: 10000, image: '🌻', seller: '해바라기농장' },
    ];

    return (
        <>
            <MainHeader />
            <div className="pb-20">
                <HomeBanner />

                {/* Quick Category Icons */}
                <div className="bg-white p-4 border-b border-gray-100">
                    <div className="grid grid-cols-4 gap-4 text-center">
                        {['🌿 채소', '🍎 과일', '🌸 화훼', '🌾 곡물'].map((category, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-2xl">
                                    {category.split(' ')[0]}
                                </div>
                                <span className="text-xs text-gray-600">{category.split(' ')[1]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Today's Special */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-2">오늘의 특가</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {products.slice(0, 2).map((product) => (
                            <div key={product.id} className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="text-4xl mb-2 text-center">{product.image}</div>
                                <h3 className="font-semibold text-sm text-gray-800 mb-1">{product.name}</h3>
                                <p className="text-xs text-gray-500 mb-2">{product.seller}</p>
                                <p className="text-green-600 font-bold">{product.price.toLocaleString()}원</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Feed */}
                <div className="bg-white">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="font-bold text-gray-800">이번 주 인기 상품</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-px bg-gray-100">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white p-4">
                                <div className="text-5xl mb-3 text-center bg-gray-50 rounded-lg py-6">
                                    {product.image}
                                </div>
                                <h3 className="font-semibold text-sm text-gray-800 mb-1">{product.name}</h3>
                                <p className="text-xs text-gray-500 mb-2">{product.seller}</p>
                                <p className="text-green-600 font-bold text-base">{product.price.toLocaleString()}원</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
