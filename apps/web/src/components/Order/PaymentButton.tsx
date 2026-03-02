"use client";

import { Button } from "@greenlink/ui";
import { useState, useRef, useEffect } from "react";

interface PaymentButtonProps {
    amount: number;
    orderName: string;
    onSuccess: () => void;
    disabled?: boolean;
}

export function PaymentButton({ amount, onSuccess, disabled }: PaymentButtonProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handlePayment = async () => {
        setIsProcessing(true);
        // Mock payment delay
        timerRef.current = setTimeout(() => {
            if (isMountedRef.current) {
                setIsProcessing(false);
                onSuccess();
            }
        }, 1500);
    };

    return (
        <Button
            className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700"
            disabled={disabled || isProcessing}
            onClick={handlePayment}
        >
            {isProcessing ? (
                <>
                    <span className="mr-2">⏳</span>
                    결제 진행중...
                </>
            ) : (
                <>
                    <span className="mr-2">💳</span>
                    {amount.toLocaleString()}원 결제하기
                </>
            )}
        </Button>
    );
}
