"use client";

import { useState } from "react";
import { LocationVO } from "@greenlink/lib";

interface Props {
    location: LocationVO | undefined;
    onUpdate: (data: LocationVO) => void;
}

// Mock search results
const MOCK_RESULTS = [
    { address: "서울특별시 강남구 역삼동", city: "서울", district: "강남구", neighborhood: "역삼동", reach: 8420 },
    { address: "서울특별시 서초구 서초동", city: "서울", district: "서초구", neighborhood: "서초동", reach: 7150 },
    { address: "경기도 성남시 분당구 정자동", city: "경기도", district: "성남시 분당구", neighborhood: "정자동", reach: 12400 },
];

export default function LocationSelector({ location, onUpdate }: Props) {
    const [search, setSearch] = useState(location?.address || "");
    const [isSearching, setIsSearching] = useState(false);

    const handleSelect = (result: typeof MOCK_RESULTS[0]) => {
        onUpdate({
            address: result.address,
            city: result.city,
            district: result.district,
            coordinates: { lat: 37.5, lng: 127.0 } // Mock coordinates
        });
        setSearch(result.address);
        setIsSearching(false);
    };

    return (
        <div className="space-y-6 w-full text-left">
            <h2 className="text-2xl font-black text-gray-900">어느 지역에서 활동하시나요?</h2>
            <p className="text-xs text-gray-400 font-bold -mt-4">동/읍/면 단위로 검색해주세요.</p>

            <div className="relative">
                <input
                    type="text"
                    placeholder="동네 이름으로 검색"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsSearching(e.target.value.length > 0);
                    }}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none pr-12"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>

                {isSearching && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-3xl shadow-2xl shadow-emerald-900/10 border border-gray-50 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                        {MOCK_RESULTS.map((res) => (
                            <button
                                key={res.address}
                                onClick={() => handleSelect(res)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-emerald-50 transition-colors text-left border-b border-gray-50 last:border-none"
                            >
                                <div>
                                    <p className="text-sm font-black text-gray-800">{res.neighborhood}</p>
                                    <p className="text-[11px] font-bold text-gray-400">{res.address}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase">Potential Reach</p>
                                    <p className="text-xs font-black text-emerald-800">{res.reach.toLocaleString()}명</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {location && !isSearching && (
                <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-lg shadow-emerald-200 animate-in zoom-in duration-300">
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Selected Region</p>
                    <p className="text-lg font-black">{location.address}</p>
                    <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                        <span className="text-xs font-bold opacity-80">이 동네의 활성 이웃 고객</span>
                        <span className="text-lg font-black">2,490명+</span>
                    </div>
                </div>
            )}
        </div>
    );
}
