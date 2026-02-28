"use client";

interface Category {
    id: string;
    name: string;
    icon: string;
    desc: string;
}

const CATEGORIES: Category[] = [
    { id: "flower", name: "꽃집 / 꽃배달", icon: "🌸", desc: "생화, 분화 등 식물 판매" },
    { id: "organic", name: "과일 / 채소", icon: "🥬", desc: "유기농 산지 농산물" },
    { id: "cafe", name: "카페 / 라이프", icon: "☕", desc: "식물 기반 카페 및 샵" },
    { id: "other", name: "기타 농원", icon: "🏡", desc: "자유로운 업종 등록" },
];

interface Props {
    selectedId: string;
    onSelect: (id: string) => void;
}

export default function CategorySelector({ selectedId, onSelect }: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 w-full">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${selectedId === cat.id
                            ? "border-emerald-600 bg-emerald-50/30"
                            : "border-gray-50 bg-gray-50/50 hover:bg-white hover:border-emerald-100"
                        }`}
                >
                    <div className="text-3xl bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm">
                        {cat.icon}
                    </div>
                    <div className="text-left">
                        <p className={`text-sm font-black ${selectedId === cat.id ? "text-emerald-700" : "text-gray-900"}`}>
                            {cat.name}
                        </p>
                        <p className="text-[11px] font-bold text-gray-400 mt-0.5">{cat.desc}</p>
                    </div>
                    {selectedId === cat.id && (
                        <div className="ml-auto w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white scale-110">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17L4 12" /></svg>
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
