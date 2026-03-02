"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@greenlink/ui";
import { useUserStore } from "@greenlink/lib";

interface ProductCTAProps {
    productId: string;
}

export function ProductCTA({ productId }: ProductCTAProps) {
    const router = useRouter();
    const { addToCart } = useUserStore();
    const [isAdded, setIsAdded] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAddToCart = async () => {
        setLoading(true);
        const success = await addToCart(productId, 1);
        if (success) {
            setIsAdded(true);
            // 3초 후 다시 원래대로 돌릴 수도 있지만, 사용자 동선을 위해 유지하거나 별도 UI를 둡니다.
        }
        setLoading(false);
    };

    return (
        <div className="fixed bottom-[72px] pb-[env(safe-area-inset-bottom)] left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white border-t border-gray-100 safe-area-pb z-50 flex gap-2">
            {!isAdded ? (
                <Button
                    variant="outline"
                    className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 h-12 flex-col gap-0 leading-none py-1"
                    onClick={handleAddToCart}
                    disabled={loading}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5">
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    <span className="text-[10px] font-bold">담기</span>
                </Button>
            ) : (
                <Button
                    variant="outline"
                    className="flex-1 border-green-600 text-green-700 bg-green-50 h-12 flex-col gap-0 leading-none py-1"
                    onClick={() => router.push("/cart")}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5">
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span className="text-[10px] font-bold">장바구니</span>
                </Button>
            )}

            <Button
                className="flex-[3] bg-green-600 hover:bg-green-700 h-12 text-lg font-bold shadow-lg shadow-green-100"
                onClick={() => router.push(`/order?productId=${productId}`)}
            >
                구매하기
            </Button>
        </div>
    );
}
