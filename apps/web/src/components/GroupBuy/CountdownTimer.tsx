"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
    targetDate: string; // ISO string
    className?: string; // Additional classes
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState<{ h: number, m: number, s: number } | null>(null);

    useEffect(() => {
        setIsMounted(true);
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0) {
                return {
                    h: Math.floor((difference / (1000 * 60 * 60))), // Total hours left
                    m: Math.floor((difference / 1000 / 60) % 60),
                    s: Math.floor((difference / 1000) % 60),
                };
            } else {
                return null; // Expired
            }
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!isMounted) return null;
    if (!timeLeft) return <span className="text-gray-500">마감됨</span>;

    return (
        <div className={className}>
            <span className="font-mono font-bold text-red-500">
                {String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}
            </span>
        </div>
    );
}
