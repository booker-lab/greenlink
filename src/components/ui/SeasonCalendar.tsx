'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, TrendingUp, Info } from 'lucide-react';

interface SeasonData {
    date: string;
    volume: 'low' | 'medium' | 'high';
    predictedCount: number;
}

const MOCK_DATA: SeasonData[] = [
    { date: '2026-02-10', volume: 'medium', predictedCount: 50 },
    { date: '2026-02-14', volume: 'high', predictedCount: 200 }, // Valentine's Day
    { date: '2026-02-15', volume: 'high', predictedCount: 150 },
    { date: '2026-02-20', volume: 'low', predictedCount: 20 },
];

export default function SeasonCalendar() {
    const [currentMonth] = useState('2026년 2월');

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-lg text-gray-800">시즌 캘린더</h3>
                </div>
                <span className="text-sm text-gray-500 font-medium">{currentMonth}</span>
            </div>

            <div className="mb-4">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    <span className="font-semibold text-green-600">AI 예측</span>: 이번 달은 장미 출하량이 급증할 예정입니다.
                </p>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                    <div key={day} className="text-xs text-center text-gray-400 font-medium py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {/* Simple placeholder for calendar grid - days 1-28 */}
                {Array.from({ length: 28 }, (_, i) => {
                    const day = i + 1;
                    // specific simple mock matching
                    const dateStr = `2026-02-${day.toString().padStart(2, '0')}`;
                    const data = MOCK_DATA.find((d) => d.date === dateStr);

                    let bgClass = 'bg-gray-50';
                    let textClass = 'text-gray-700';

                    if (data?.volume === 'high') {
                        bgClass = 'bg-red-100 border border-red-200';
                        textClass = 'text-red-700 font-bold';
                    } else if (data?.volume === 'medium') {
                        bgClass = 'bg-green-100 border border-green-200';
                        textClass = 'text-green-700';
                    }

                    return (
                        <div
                            key={day}
                            className={`aspect-square rounded-lg flex flex-col items-center justify-center relative hover:bg-opacity-80 transition-colors ${bgClass}`}
                        >
                            <span className={`text-sm ${textClass}`}>{day}</span>
                            {data && (
                                <div className="absolute bottom-1 right-1">
                                    <TrendingUp className={`w-3 h-3 ${data.volume === 'high' ? 'text-red-500' : 'text-green-500'}`} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex gap-4 text-xs text-gray-500 justify-end">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded bg-red-500"></div>
                    <span>주문 폭주 예상</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded bg-green-500"></div>
                    <span>안정적</span>
                </div>
            </div>
        </div>
    );
}
