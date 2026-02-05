'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomeBanner() {
    const banners = [
        {
            id: 1,
            title: '스페셜 대잔치',
            subtitle: '최대 90% 할인',
            bgColor: 'bg-gradient-to-r from-green-400 to-green-600',
        },
        {
            id: 2,
            title: '신선한 제철 농산물',
            subtitle: '지금 바로 만나보세요',
            bgColor: 'bg-gradient-to-r from-emerald-400 to-teal-600',
        },
        {
            id: 3,
            title: '농장 직송 배송',
            subtitle: '8% 추가 쿠폰',
            bgColor: 'bg-gradient-to-r from-lime-400 to-green-600',
        },
    ];

    const [currentIndex, setCurrentIndex] = React.useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    React.useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-48 overflow-hidden">
            <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className={`min-w-full h-full ${banner.bgColor} flex flex-col justify-center items-center text-white`}
                    >
                        <h2 className="text-2xl font-bold mb-2">{banner.title}</h2>
                        <p className="text-lg">{banner.subtitle}</p>
                    </div>
                ))}
            </div>

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
