"use client";

import { useRouter } from "next/navigation";
import { Button } from "@greenlink/ui";

interface ProductCTAProps {
    productId: string;
}

export function ProductCTA({ productId }: ProductCTAProps) {
    const router = useRouter();
    return (
        <div className="fixed bottom-[72px] pb-[env(safe-area-inset-bottom)] left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white border-t border-gray-100 safe-area-pb z-50 flex gap-2">
            <Button
                variant="outline"
                className="flex-1 border-green-600 text-green-700 hover:bg-green-50 h-12 flex-col gap-0 leading-none py-1"
                onClick={() => router.push("/group-buy")}
            >
                <span className="text-[10px] flex items-center gap-1">함께 사면</span>
                <span className="font-bold">더 저렴해요!</span>
            </Button>

            <Button
                className="flex-[2] bg-green-600 hover:bg-green-700 h-12 text-lg font-bold"
                onClick={() => router.push(`/order?productId=${productId}`)}
            >
                구매하기
            </Button>
        </div>
    );
}
