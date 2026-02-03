import SeasonCalendar from "@/components/ui/SeasonCalendar";
import { Truck, Users, Sprout, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Mobile-first Container */}
      <main className="w-full max-w-md bg-white min-h-[800px] shadow-2xl rounded-3xl overflow-hidden border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="bg-emerald-600 p-6 text-white shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">GreenLink</h1>
              <p className="text-sm opacity-90">농장 직송 하이브리드 배송</p>
            </div>
            <div className="bg-white/20 p-2 rounded-full">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <div className="bg-emerald-700/50 p-3 rounded-xl flex-1 text-center backdrop-blur-sm">
              <p className="text-xs opacity-80">그린온도</p>
              <p className="text-xl font-bold">98.5°</p>
            </div>
            <div className="bg-emerald-700/50 p-3 rounded-xl flex-1 text-center backdrop-blur-sm">
              <p className="text-xs opacity-80">핑크온도</p>
              <p className="text-xl font-bold">36.5°</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '주문하기', icon: Sprout, color: 'bg-green-100 text-green-700' },
              { label: '배송조회', icon: Truck, color: 'bg-blue-100 text-blue-700' },
              { label: '시세조회', icon: TrendingUp, color: 'bg-orange-100 text-orange-700' },
              { label: '마이', icon: Users, color: 'bg-gray-100 text-gray-700' },
            ].map((item) => (
              <button key={item.label} className="flex flex-col items-center gap-2">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Season Calendar Widget */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-gray-800">이번 달 출하 예측</h2>
              <button className="text-xs text-emerald-600 font-semibold">전체보기</button>
            </div>
            <SeasonCalendar />
          </section>

          {/* Promotion Banner */}
          <div className="bg-gradient-to-r from-pink-50 to-red-50 p-4 rounded-2xl border border-pink-100">
            <div className="flex gap-3">
              <div className="flex-1">
                <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded mb-1">HOT</span>
                <h3 className="font-bold text-gray-800">장미 시즌 마감 임박</h3>
                <p className="text-xs text-gray-500 mt-1">지금 주문하면 새벽 직배송으로<br />내일 아침 도착!</p>
              </div>
              <div className="w-16 h-16 bg-pink-200 rounded-lg shrink-0" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

