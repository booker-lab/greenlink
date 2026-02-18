"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductStore, useOrderStore } from "@greenlink/lib/stores";
import { DeliveryDatePicker } from "@/components/Order/DeliveryDatePicker";
import { PaymentButton } from "@/components/Order/PaymentButton";
import { Card, Input, Button } from "@greenlink/ui";

function OrderPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get("productId");

    const { products } = useProductStore();
    const { addOrder } = useOrderStore();

    const product = products.find((p: any) => p.id === productId);

    const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
    const [buyerName, setBuyerName] = useState("");
    const [buyerPhone, setBuyerPhone] = useState("");
    const [address, setAddress] = useState("");

    const isFormValid = product && deliveryDate && buyerName && buyerPhone && address;

    const handlePaymentSuccess = () => {
        alert("주문이 완료되었습니다! (Mock)");
        router.push("/");
    };

    if (!productId || !product) {
        return <div className="p-8 text-center">상품 정보가 없습니다.</div>;
    }

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <header className="bg-white p-4 sticky top-0 border-b border-gray-100 flex items-center gap-2">
                <Button variant="ghost" size="icon" {...({ onClick: () => router.back() } as any)}>
                    ←
                </Button>
                <h1 className="font-bold text-lg">주문하기</h1>
            </header>

            <main className="p-4 space-y-6">
                <section>
                    <h2 className="font-bold mb-2">주문 상품</h2>
                    <Card className="p-4 flex gap-3 border-none shadow-sm">
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-2xl">
                            🌿
                        </div>
                        <div>
                            <h3 className="font-medium text-sm">{product.name}</h3>
                            <p className="text-gray-500 text-xs">{product.farmId}</p>
                            <p className="font-bold mt-1">{product.price.toLocaleString()}원</p>
                        </div>
                    </Card>
                </section>

                <section>
                    <h2 className="font-bold mb-2">배송 정보</h2>
                    <Card className="p-4 space-y-3 border-none shadow-sm bg-white">
                        <Input
                            placeholder="받는 분 성함"
                            value={buyerName}
                            onChange={(e) => setBuyerName(e.target.value)}
                        />
                        <Input
                            placeholder="연락처 (010-0000-0000)"
                            value={buyerPhone}
                            onChange={(e) => setBuyerPhone(e.target.value)}
                        />
                        <Input
                            placeholder="배송지 주소"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <div className="pt-2">
                            <label className="text-sm font-medium mb-1 block">희망 배송일 (D+2 ~ D+10)</label>
                            <DeliveryDatePicker
                                selectedDate={deliveryDate}
                                onSelect={setDeliveryDate}
                            />
                        </div>
                    </Card>
                </section>

                <section>
                    <h2 className="font-bold mb-2">결제 금액</h2>
                    <Card className="p-4 border-none shadow-sm bg-white">
                        <div className="flex justify-between mb-2 text-sm text-gray-500">
                            <span>상품 금액</span>
                            <span>{product.price.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between mb-2 text-sm text-gray-500">
                            <span>배송비</span>
                            <span>{(3000).toLocaleString()}원</span>
                        </div>
                        <div className="border-t border-gray-100 my-2 pt-2 flex justify-between font-bold text-lg">
                            <span>총 결제금액</span>
                            <span className="text-green-600">{(product.price + 3000).toLocaleString()}원</span>
                        </div>
                    </Card>
                </section>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-area-pb z-50">
                <PaymentButton
                    amount={product.price + 3000}
                    orderName={product.name}
                    onSuccess={handlePaymentSuccess}
                    disabled={!isFormValid}
                />
            </div>
        </div>
    );
}

export default function OrderPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">로딩중...</div>}>
            <OrderPageContent />
        </Suspense>
    );
}
