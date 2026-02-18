"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@greenlink/ui";

interface LongPressButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onLongPress: () => void;
    duration?: number; // ms, default 1500
    label: string;
}

export function LongPressButton({
    onLongPress,
    duration = 1500,
    label,
    className,
    ...props
}: LongPressButtonProps) {
    const [isPressing, setIsPressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const startPress = () => {
        setIsPressing(true);
        startTimeRef.current = Date.now();

        // Timer for completion
        timerRef.current = setTimeout(() => {
            onLongPress();
            resetPress();
        }, duration);

        // Animation loop for progress bar
        const animate = () => {
            if (!startTimeRef.current) return;
            const elapsed = Date.now() - startTimeRef.current;
            const newProgress = Math.min((elapsed / duration) * 100, 100);
            setProgress(newProgress);

            if (elapsed < duration) {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };
        animationFrameRef.current = requestAnimationFrame(animate);
    };

    const cancelPress = () => {
        resetPress();
    };

    const resetPress = () => {
        setIsPressing(false);
        setProgress(0);
        if (timerRef.current) clearTimeout(timerRef.current);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        timerRef.current = null;
        startTimeRef.current = null;
        animationFrameRef.current = null;
    };

    return (
        <button
            className={cn(
                "relative w-full h-14 rounded-xl overflow-hidden font-bold text-lg select-none touch-none active:scale-95 transition-transform",
                "bg-gray-800 text-white border border-gray-700",
                className
            )}
            onMouseDown={startPress}
            onMouseUp={cancelPress}
            onMouseLeave={cancelPress}
            onTouchStart={startPress}
            onTouchEnd={cancelPress}
            {...props}
        >
            {/* Background Progress Fill */}
            <div
                className="absolute inset-0 bg-emerald-600 transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
            />

            {/* Label */}
            <span className="relative z-10">{label}</span>
        </button>
    );
}
