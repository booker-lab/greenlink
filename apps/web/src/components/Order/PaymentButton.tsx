"use client";

import { useState } from "react";
import { Button } from "@greenlink/ui";
import { CreditCard, Loader2 } from "lucide-react";

interface PaymentButtonProps {
    amount: number;
    orderName: string;
    onSuccess: () => void;
    disabled?: boolean;
}

export function PaymentButton({ amount, orderName, onSuccess, disabled }: PaymentButtonProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);

        // Mock Payment Delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock Success
        // In real app, triggering Toss Payments widget here
        alert(`[Toss Payments] ${amount.toLocaleString()}원 결제가 완료되었습니다.`);

        setIsProcessing(false);
        onSuccess();
    };

    return (
        <Button
            className="w-full h-12 text-lg font-bold bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handlePayment}
            disabled={disabled || isProcessing}
        >
            {isProcessing ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    결제 진행중...
                </>
            ) : (
                <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {amount.toLocaleString()}원 결제하기
                </>
            )}
        </Button>
    );
}
