"use client";

import * as React from "react";
import { format, addDays, isSunday, isAfter, isBefore, startOfToday } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn, Button, Calendar, Popover, PopoverContent, PopoverTrigger } from "@greenlink/ui";

interface DeliveryDatePickerProps {
    selectedDate: Date | undefined;
    onSelect: (date: Date | undefined) => void;
    className?: string;
}

export function DeliveryDatePicker({ selectedDate, onSelect, className }: DeliveryDatePickerProps) {
    const today = startOfToday();
    const minDate = addDays(today, 2); // D+2
    const maxDate = addDays(today, 10); // D+10

    // Disable dates: Before D+2, After D+10, or Sundays
    const isDateDisabled = (date: Date) => {
        return (
            isBefore(date, minDate) ||
            isAfter(date, maxDate) ||
            isSunday(date)
        );
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                        format(selectedDate, "PPP (EEE)", { locale: ko })
                    ) : (
                        <span>배송 받을 날짜를 선택해주세요 (D+2 ~ D+10)</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={onSelect}
                    disabled={isDateDisabled}
                    initialFocus
                    locale={ko as any}
                />
            </PopoverContent>
        </Popover>
    );
}
