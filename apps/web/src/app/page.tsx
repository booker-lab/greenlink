import { MOCK_PRODUCTS, MOCK_GROUP_BUYS, MOCK_FARMS } from "@greenlink/lib";
import { ProductCard } from "@/components/Product/ProductCard";
import { GroupBuyCard } from "@/components/GroupBuy/GroupBuyCard";
import { Button, Badge } from "@greenlink/ui";
import Link from "next/link";

export default function Home() {
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);
  const closingDeals = MOCK_GROUP_BUYS.filter((d: any) => d.status === 'RECRUITING').slice(0, 2);
  const recommendedFarm = MOCK_FARMS[0]; // '디어 오키드'

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      {/* 1. Top Header */}
      <header className="sticky top-0 z-40 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 mb-0 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-green-600 tracking-tight">그린링크</span>
        </div>
        <div className="flex items-center gap-4 text-gray-500">
          <button aria-label="Search" className="hover:text-gray-800 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button aria-label="Cart" className="relative hover:text-gray-800 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-600 text-[10px] font-bold text-white border-2 border-white">
              2
            </span>
          </button>
          <button aria-label="Notifications" className="hover:text-gray-800 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>
        </div>
      </header>

      {/* 2. Main Banner */}
      <section className="relative h-48 bg-emerald-600 text-white flex flex-col items-center justify-center overflow-hidden">
        {/* Simple decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 flex">
          <div className="w-1/2 h-full bg-gradient-to-br from-white to-transparent transform -skew-x-12"></div>
        </div>

        <div className="relative z-10 text-center space-y-2 translate-y-[-10px]">
          <h2 className="text-2xl font-bold tracking-tight">신선한 제철 농산물</h2>
          <p className="text-sm font-medium text-emerald-50">지금 바로 만나보세요</p>
        </div>

        {/* Navigation Dots (Visual only for now) */}
        <div className="absolute bottom-4 flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
          <div className="w-4 h-1.5 rounded-full bg-white"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
        </div>
      </section>

      {/* 3. Category Navigation */}
      <section className="bg-white px-2 py-5 mb-2 border-b border-gray-100">
        <div className="grid grid-cols-5 gap-2">
          {[
            { icon: "🍎", label: "과일" },
            { icon: "🥬", label: "채소" },
            { icon: "🌾", label: "곡물" },
            { icon: "🌸", label: "난/꽃" },
            { icon: "📦", label: "공구" },
          ].map((cat, idx) => (
            <Link key={idx} href="/category" className="flex flex-col items-center gap-1.5">
              <div className="w-[52px] h-[52px] rounded-[18px] bg-slate-50 flex items-center justify-center text-2xl shadow-sm border border-slate-100 hover:scale-105 transition-transform">
                {cat.icon}
              </div>
              <span className="text-[11px] font-medium text-gray-600">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Closing Soon Group Buys */}
      <section className="bg-white py-6 mb-2 border-b border-gray-100">
        <div className="px-4 flex justify-between items-center mb-4">
          <h2 className="text-[17px] font-bold flex items-center gap-1.5">
            <span className="text-orange-500">🔥</span> 지금 모집 중인 공구
            <span className="ml-1 bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{closingDeals.length}</span>
          </h2>
          <Link href="/group-buy" className="text-[13px] text-gray-500 font-medium">
            전체보기 {'>'}
          </Link>
        </div>
        <div className="px-4 space-y-3">
          {closingDeals.map((deal: any) => (
            <GroupBuyCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>

      {/* 5. Recommended Farms */}
      <section className="bg-white py-6 mb-2 border-b border-gray-100">
        <div className="px-4 mb-4">
          <h2 className="text-[17px] font-bold flex items-center gap-1.5">
            <span className="text-amber-700">🛖</span> 우리 동네 추천 농장
          </h2>
          <p className="text-[13px] text-gray-500 mt-0.5">내 동네 반경에서 인증된 농장이에요.</p>
        </div>

        <div className="px-4">
          {/* Custom Farm Card tailored for Home Page */}
          <div className="border border-green-100 rounded-2xl p-5 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex gap-4 items-center border-b border-gray-50 pb-4 mb-4">
              <div className="w-[52px] h-[52px] rounded-[18px] bg-pink-100 flex items-center justify-center text-2xl flex-shrink-0">
                {recommendedFarm.profileEmoji}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-gray-900">{recommendedFarm.name}</h3>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-green-200 text-green-700 font-medium bg-green-50">인증 됨</Badge>
                </div>
                <p className="text-[12px] text-gray-500 mt-0.5">{recommendedFarm.location.city} {recommendedFarm.location.district} · 화훼/동양란</p>
                <p className="text-[12px] text-gray-400 mt-1 line-clamp-1">{recommendedFarm.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100">
              <div className="flex flex-col items-center justify-center px-2">
                <div className="flex items-center gap-1 text-green-600 font-bold mb-1">
                  <span className="text-sm">🌱</span> <span>{recommendedFarm.greenTemperature.value}°C</span>
                </div>
                <span className="text-[11px] text-gray-500">그린 온도</span>
              </div>
              <div className="flex flex-col items-center justify-center px-2">
                <div className="flex items-center gap-1 font-bold text-gray-700 mb-1">
                  <span className="text-sm">👤</span> <span>{recommendedFarm.followers}</span>
                </div>
                <span className="text-[11px] text-gray-500">단골</span>
              </div>
              <div className="flex flex-col items-center justify-center px-2 text-center">
                <span className="text-xs font-semibold text-gray-600 mb-0.5 flex items-center justify-center gap-1">
                  <span className="text-[10px]">📋</span> 농업경영체
                </span>
                <span className="text-[10px] text-gray-500">인증 완료</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {recommendedFarm.tags.slice(0, 5).map((tag: string) => (
                <span key={tag} className="text-[11px] text-green-700 bg-green-50 px-2.5 py-1 rounded-full font-medium">#{tag}</span>
              ))}
            </div>

            <button className="w-full mt-4 py-2.5 text-[13px] font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              농장 프로필 보기 {'>'}
            </button>
          </div>
        </div>
      </section>

      {/* 6. Today's Specials */}
      <section className="bg-white py-6">
        <div className="px-4 mb-4 flex justify-between items-center">
          <h2 className="text-[17px] font-bold flex items-center gap-1.5">
            오늘의 특가 <span className="text-red-500">🔥</span>
          </h2>
          <Link href="/category" className="text-[13px] text-gray-500 font-medium">
            전체보기 {'>'}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 px-4">
          {featuredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
