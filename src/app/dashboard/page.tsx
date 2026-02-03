import SeasonCalendar from "@/components/ui/SeasonCalendar";
import { Truck, Users, Sprout, TrendingUp, Bell, Search } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      {/* Header - Mocking app header for context */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shrink-0">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full"><Search className="w-5 h-5 text-gray-600" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full"><Bell className="w-5 h-5 text-gray-600" /></button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: User Status & Quick Actions */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-bold">안녕하세요, 농부님!</h2>
                  <p className="text-emerald-100 text-sm">오늘도 신선한 하루 되세요.</p>
                </div>
                <div className="bg-white/20 p-2 rounded-full">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-emerald-700/50 p-4 rounded-2xl flex-1 text-center backdrop-blur-sm">
                  <p className="text-xs opacity-80 mb-1">그린온도</p>
                  <p className="text-2xl font-bold">98.5°</p>
                </div>
                <div className="bg-emerald-700/50 p-4 rounded-2xl flex-1 text-center backdrop-blur-sm">
                  <p className="text-xs opacity-80 mb-1">핑크온도</p>
                  <p className="text-2xl font-bold">36.5°</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">빠른 실행</h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '주문하기', icon: Sprout, color: 'bg-green-100 text-green-700' },
                  { label: '배송조회', icon: Truck, color: 'bg-blue-100 text-blue-700' },
                  { label: '시세조회', icon: TrendingUp, color: 'bg-orange-100 text-orange-700' },
                  { label: '마이', icon: Users, color: 'bg-gray-100 text-gray-700' },
                ].map((item) => (
                  <button key={item.label} className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column: Season Calendar (Main Feature) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Promotion Banner */}
            <div className="bg-gradient-to-r from-pink-50 to-red-50 p-6 rounded-3xl border border-pink-100 flex items-center justify-between">
              <div>
                <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded mb-2">HOT ISSUE</span>
                <h3 className="text-xl font-bold text-gray-800">장미 시즌 마감 임박</h3>
                <p className="text-gray-500 mt-1">지금 주문하면 새벽 직배송으로 내일 아침 도착!</p>
              </div>
              <div className="w-20 h-20 bg-pink-200 rounded-2xl shrink-0" />
            </div>

            {/* Calendar Widget */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-96 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">이번 달 출하 예측</h2>
                <button className="text-sm text-emerald-600 font-semibold hover:underline">전체보기</button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SeasonCalendar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

