"use client";

import * as React from "react";
import { cn } from "@greenlink/ui";
import { Button } from "@greenlink/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@greenlink/ui";
import { getAvailableDeliveryDates } from "../../../../../packages/lib/src/utils/format";

interface DeliveryDatePickerProps {
    className?: string;
    selectedDate?: Date;
    onSelect: (date: Date | undefined) => void;
}

export function DeliveryDatePicker({
    className,
    selectedDate,
    onSelect
}: DeliveryDatePickerProps) {
    const availableDates = getAvailableDeliveryDates();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    {...({
                        className: cn(
                            "w-full justify-start text-left font-normal h-12 shadow-sm border-gray-100",
                            !selectedDate && "text-muted-foreground",
                            className
                        )
                    } as any)}
                >
                    <span className="mr-3 text-lg">📅</span>
                    {selectedDate ? (
                        <span className="font-bold text-gray-900">
                            {new Intl.DateTimeFormat('ko-KR', {
                                month: 'long',
                                day: 'numeric',
                                weekday: 'short'
                            }).format(selectedDate)}
                        </span>
                    ) : (
                        <span className="text-gray-400">배송 희망일을 선택해주세요</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4 bg-white rounded-xl shadow-xl border-none" align="start">
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h4 className="text-sm font-black text-gray-900">배송 희망일 선택</h4>
                        <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">직송 가능</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {availableDates.map((date: Date) => {
                            const isSelected = selectedDate?.toDateString() === date.toDateString();
                            const dayName = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

                            return (
                                <button
                                    key={date.toISOString()}
                                    onClick={() => onSelect(date)}
                                    className={cn(
                                        "flex flex-col items-center justify-center py-3 px-1 rounded-xl border transition-all active:scale-95",
                                        isSelected
                                            ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-100"
                                            : "bg-gray-50 border-transparent text-gray-900 hover:bg-gray-100"
                                    )}
                                >
                                    <span className={cn(
                                        "text-[10px] font-bold mb-0.5",
                                        isSelected ? "text-green-100" : "text-gray-400"
                                    )}>
                                        {dayName}
                                    </span>
                                    <span className="text-sm font-black">
                                        {date.getDate()}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="bg-orange-50 p-2.5 rounded-lg border border-orange-100/50">
                        <p className="text-[10px] text-orange-700 leading-relaxed font-medium">
                            🌿 <span className="font-bold">안내:</span> 산지 직송 시스템 특성상 주문 2일 이후부터 수령이 가능하며 일요일은 배송하지 않습니다.
                        </p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
