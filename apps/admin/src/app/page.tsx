"use client";

import { useOrderStore, useProductStore } from "@greenlink/lib";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@greenlink/ui";
import { GreenTemperatureGauge } from "@/components/Dashboard/GreenTemperatureGauge";
import { ArrowRight, Package, ShoppingCart, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { products } = useProductStore();
  const { orders } = useOrderStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalSales = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const pendingOrders = orders.filter((o) => o.status === "ORDERED").length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="col-span-1 md:col-span-1 flex flex-col items-center justify-center p-6 bg-white border-none shadow-sm ring-1 ring-gray-100">
          <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 overflow-hidden border-2 border-green-100">
            {/* Placeholder for Profile Image */}
            <div className="w-full h-full flex items-center justify-center text-4xl">👨‍🌾</div>
          </div>
          <h2 className="text-xl font-bold">김철수 농부님</h2>
          <p className="text-sm text-gray-500 mb-6">푸른 언덕 농장</p>

          <GreenTemperatureGauge temperature={42.5} />
        </Card>

        {/* Stats Cards */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-white border-none shadow-sm ring-1 ring-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 매출액</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSales.toLocaleString()}원</div>
              <p className="text-xs text-muted-foreground">+20.1% (지난달 대비)</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm ring-1 ring-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">신규 주문</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}건</div>
              <p className="text-xs text-muted-foreground">배송 준비가 필요합니다</p>
              <Link href="/delivery" className="text-xs text-green-600 hover:underline mt-2 inline-block">
                배송 관리 바로가기 &rarr;
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm ring-1 ring-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">등록된 상품</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}개</div>
              <Link href="/products" className="text-xs text-green-600 hover:underline mt-2 inline-block">
                상품 관리 바로가기 &rarr;
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders (Placeholder) */}
      <h2 className="text-lg font-bold mt-8">최근 주문 내역</h2>
      <Card className="bg-white border-none shadow-sm ring-1 ring-gray-100 p-8 text-center text-gray-400">
        <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-20" />
        <p>최근 주문 내역이 없습니다.</p>
      </Card>
    </div>
  );
}
