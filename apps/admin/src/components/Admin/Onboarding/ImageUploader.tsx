"use client";

import { useState } from "react";

interface Props {
    onUpdate: (images: string[]) => void;
}

export default function ImageUploader({ onUpdate }: Props) {
    const [images, setImages] = useState<string[]>([]);

    const handleUpload = () => {
        // Mock image upload
        const newImage = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${Date.now()}`;
        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        onUpdate(updatedImages);
    };

    const handleRemove = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        onUpdate(updatedImages);
    };

    return (
        <div className="space-y-6 w-full text-left">
            <h2 className="text-2xl font-black text-gray-900">농장 사진을 등록해주세요</h2>
            <p className="text-xs text-gray-400 font-bold -mt-4">고객들에게 신뢰를 주는 첫인상입니다. (최대 20장)</p>

            <div className="grid grid-cols-3 gap-3">
                <button
                    onClick={handleUpload}
                    className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-emerald-600 shadow-sm transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    </div>
                    <span className="text-[10px] font-black text-gray-300 group-hover:text-emerald-400">{images.length}/20</span>
                </button>

                {images.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-2xl bg-gray-100 relative group overflow-hidden border border-gray-100 shadow-sm">
                        <img src={img} alt="Farm" className="w-full h-full object-cover" />
                        <button
                            onClick={() => handleRemove(idx)}
                            className="absolute top-1 right-1 w-6 h-6 bg-black/50 backdrop-blur-md rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
                        </button>
                        {idx === 0 && (
                            <div className="absolute bottom-0 left-0 w-full bg-emerald-600 text-white text-[8px] font-black py-1 text-center">
                                대표 사진
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
                <span className="text-lg">📸</span>
                <p className="text-[11px] font-bold text-blue-700 leading-relaxed">
                    팁: 농장 내부 전경이나 정성스럽게 피어난 꽃 사진을 올리면 <br />
                    이웃들의 관심도가 2.5배 높아져요!
                </p>
            </div>
        </div>
    );
}
