import { MOCK_PRODUCTS, MOCK_GROUP_BUYS } from "@greenlink/lib/constants";
import { ProductCard } from "@/components/Product/ProductCard";
import { GroupBuyCard } from "@/components/GroupBuy/GroupBuyCard";
import { Button } from "@greenlink/ui";
import Link from "next/link";

export default function Home() {
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);
  const closingDeals = MOCK_GROUP_BUYS.filter((d: any) => d.status === 'RECRUITING').slice(0, 2);

  return (
    <div className="space-y-6 pb-8">
      {/* Banner */}
      <section className="relative h-40 bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center text-white p-6 shadow-inner">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-bold tracking-tight">오늘 막 수확한 신선함 🌿</h1>
          <p className="text-green-50 text-xs font-medium">농장 직송으로 더 저렴하게!</p>
        </div>
      </section>

      {/* Featured Group Buys */}
      <section className="px-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            ✨ 마감 임박 공구
          </h2>
          <Link href="/group-buy" className="text-sm text-gray-500 flex items-center">
            더보기 →
          </Link>
        </div>
        <div className="space-y-3">
          {closingDeals.map((deal: any) => (
            <GroupBuyCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className="px-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">인기 상품 🔥</h2>
          <Link href="/category" className="text-sm text-gray-500 flex items-center">
            더보기 →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featuredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Farm Story Banner */}
      <section className="px-4 py-2">
        <div className="bg-orange-50 rounded-lg p-4 flex items-center justify-between border border-orange-100">
          <div>
            <h3 className="font-bold text-orange-900">우리 농장 이야기 🚜</h3>
            <p className="text-xs text-orange-700">디어 오키드 김란초 농부님의 하루</p>
          </div>
          <Button variant="outline" size="sm" className="bg-white border-orange-200 text-orange-700 hover:bg-orange-100">
            보러가기
          </Button>
        </div>
      </section>
    </div>
  );
}
