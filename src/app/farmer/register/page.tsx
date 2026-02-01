'use client';

import { useState } from 'react';
import { Camera, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductRegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: '',
        price: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('상품이 등록되었습니다! (데모)');
        console.log(formData);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="flex items-center p-4 bg-white border-b border-gray-100 sticky top-0 z-10">
                <Link href="/" className="mr-4 text-gray-600">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-lg font-bold text-gray-800">상품 등록</h1>
            </header>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-6">
                {/* Image Upload Placeholder */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">상품 사진</label>
                    <div className="w-full aspect-video bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors">
                        <Camera className="w-8 h-8 mb-2" />
                        <span className="text-xs">터치하여 사진 업로드</span>
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">상품명</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="예: 싱싱한 장미 10송이"
                            className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="price" className="text-sm font-medium text-gray-700">판매 가격 (원)</label>
                        <input
                            type="number"
                            id="price"
                            placeholder="0"
                            className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">재고 수량</label>
                        <input
                            type="number"
                            id="quantity"
                            placeholder="0"
                            className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="description" className="text-sm font-medium text-gray-700">상세 설명</label>
                        <textarea
                            id="description"
                            rows={4}
                            placeholder="상품에 대한 설명을 입력해주세요."
                            className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.98] transition-all mt-4"
                >
                    등록 완료
                </button>
            </form>
        </div>
    );
}
