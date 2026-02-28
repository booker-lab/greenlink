"use client";

import { useEffect, useState } from "react";
import { cn } from "@greenlink/ui";

interface GreenTemperatureGaugeProps {
    temperature: number;
}

export function GreenTemperatureGauge({ temperature }: GreenTemperatureGaugeProps) {
    const [fillLevel, setFillLevel] = useState(0);

    useEffect(() => {
        // Animate fill
        const timer = setTimeout(() => setFillLevel(temperature), 300);
        return () => clearTimeout(timer);
    }, [temperature]);

    const getEmoji = (temp: number) => {
        if (temp >= 50) return "🔥";
        if (temp >= 36.5) return "😊";
        return "😐";
    };

    const getColor = (temp: number) => {
        if (temp >= 50) return "text-orange-500";
        if (temp >= 36.5) return "text-green-500";
        return "text-gray-500";
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-green-300 to-green-600 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(fillLevel, 100)}%` }}
                />
            </div>
            <div className="mt-2 flex items-center gap-2">
                <span className={cn("text-2xl font-bold", getColor(temperature))}>
                    {temperature}°C
                </span>
                <span className="text-2xl">{getEmoji(temperature)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">나의 초록 온도 (매너 온도)</p>
        </div>
    );
}
