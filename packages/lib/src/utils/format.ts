import { addDays, format, isSunday, startOfToday } from 'date-fns';
import { ko } from 'date-fns/locale';

export function getAvailableDeliveryDates(): Date[] {
    const today = startOfToday();
    const availableDates: Date[] = [];

    // D+2 to D+10
    for (let i = 2; i <= 10; i++) {
        const date = addDays(today, i);
        if (!isSunday(date)) {
            availableDates.push(date);
        }
    }

    return availableDates;
}

export function formatDate(date: string | Date, formatStr: string = 'yyyy-MM-dd'): string {
    return format(new Date(date), formatStr, { locale: ko });
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
}
