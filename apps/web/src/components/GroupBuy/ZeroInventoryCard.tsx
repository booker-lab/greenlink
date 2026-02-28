"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ZeroInventoryItem } from '@greenlink/lib';
import { useState } from 'react';

export interface ZeroInventoryCardProps {
    item: ZeroInventoryItem;
}

export function ZeroInventoryCard({ item }: ZeroInventoryCardProps) {
    const isCompleted = item.currentParticipants >= item.targetParticipants || item.status === 'COMPLETED';
    const progressPercent = Math.min((item.currentParticipants / item.targetParticipants) * 100, 100);

    const defaultPlaceholder = "/images/placeholder.svg"; // 로컬 정적 파일 (외부 CDN 불필요)
    const [imgSrc, setImgSrc] = useState(item.imageUrl);

    return (
        <Link href={`/category/${item.id}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-transform active:scale-95 block">
            {/* Image Area */}
            <div className="relative aspect-square w-full bg-gray-100 flex-shrink-0">
                <Image
                    src={imgSrc}
                    alt={item.itemNm}
                    fill
                    priority
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                    onError={() => setImgSrc(defaultPlaceholder)}
                />
                {isCompleted && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-green-600 text-white font-bold px-4 py-2 rounded-full shadow-lg">
                            구매 확정 (사입 대기)
                        </span>
                    </div>
                )}
                {!isCompleted && item.currentParticipants > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10">
                        마감 임박
                    </div>
                )}

                {/* Metadata Tags Area */}
                {(item.metadata?.bloomStage || item.metadata?.plantHeight || item.metadata?.grade || item.metadata?.difficulty) && (
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                        {item.metadata.bloomStage && (
                            <span className="bg-white/90 backdrop-blur-sm text-pink-600 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm border border-pink-100">
                                개화 {item.metadata.bloomStage}단계
                            </span>
                        )}
                        {item.metadata.plantHeight && (
                            <span className="bg-white/90 backdrop-blur-sm text-emerald-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm border border-emerald-100">
                                크기 {item.metadata.plantHeight}cm
                            </span>
                        )}
                        {item.metadata.grade && (
                            <span className="bg-white/90 backdrop-blur-sm text-yellow-600 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm border border-yellow-100">
                                {item.metadata.grade === 'SPECIAL' ? '특급' : item.metadata.grade === 'HIGH' ? '상급' : '보통'}
                            </span>
                        )}
                        {item.metadata.difficulty && (
                            <span className="bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm border border-blue-100">
                                {item.metadata.difficulty === 'EASY' ? '초보자 추천' : item.metadata.difficulty === 'NORMAL' ? '중급자용' : '전문가용'}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Title and Price */}
                <div className="mb-3">
                    <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-1 line-clamp-1">
                        {item.itemNm}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-red-500 text-lg">
                            {item.sellingPrice.toLocaleString()}원
                        </span>
                        <span className="text-gray-400 text-sm line-through">
                            경매가 {item.avgCost.toLocaleString()}원
                        </span>
                    </div>
                </div>

                {/* Progress Bar & Status */}
                <div className="mt-auto mb-3">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-medium text-gray-500">
                            최근 7일 물량: <strong className="text-gray-700">{item.qty.toLocaleString()}</strong>개
                        </span>
                        {!isCompleted && (
                            <span className="text-xs font-bold text-green-600">
                                {item.targetParticipants - item.currentParticipants}명 남음
                            </span>
                        )}
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1 overflow-hidden">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                        <span>참여 {item.currentParticipants}명</span>
                        <span>목표 {item.targetParticipants}명</span>
                    </div>
                </div>

                {/* Call to Action Button */}
                <button
                    disabled={isCompleted}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${isCompleted
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-50 text-green-700 hover:bg-green-100 active:bg-green-200'
                        }`}
                >
                    {isCompleted ? '모집 완료' : '공구 참여 (결제예치)'}
                </button>
            </div>
        </Link>
    );
}
