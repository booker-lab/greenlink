export function getAvailableDeliveryDates(): Date[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const availableDates: Date[] = [];

    // D+2 to D+10
    for (let i = 2; i <= 10; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        if (date.getDay() !== 0) { // 0 is Sunday
            availableDates.push(date);
        }
    }

    return availableDates;
}

export function formatDate(date: string | Date, formatStr: string = 'yyyy-MM-dd'): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';

    if (formatStr === 'yyyy-MM-dd') {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Default to a long date format if not yyyy-MM-dd
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    }).format(d);
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
}
