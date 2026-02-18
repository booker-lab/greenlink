import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DeliveryTask, DailyQuota, DeliveryStatus } from '../types';
import { MOCK_DELIVERY_TASKS } from '../constants';
import { isSunday, format, addDays, startOfToday } from 'date-fns';

interface DeliveryState {
    tasks: DeliveryTask[];
    dailyQuotas: DailyQuota[];
    addTask: (task: DeliveryTask) => void;
    updateTaskStatus: (id: string, status: DeliveryStatus) => void;
    setDailyQuota: (date: string, maxOrders: number) => void;
    checkAvailability: (date: string) => boolean;
    incrementQuota: (date: string) => void;
}

const generateInitialQuotas = (): DailyQuota[] => {
    const quotas: DailyQuota[] = [];
    const today = startOfToday();
    for (let i = 0; i < 14; i++) {
        const date = addDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const isSun = isSunday(date);
        const isSat = date.getDay() === 6;
        quotas.push({
            date: dateStr,
            maxOrders: isSun ? 0 : isSat ? 10 : 15,
            currentOrders: 0,
        });
    }
    return quotas;
};

export const useDeliveryStore = create<DeliveryState>()(
    persist(
        (set, get) => ({
            tasks: MOCK_DELIVERY_TASKS,
            dailyQuotas: generateInitialQuotas(),
            addTask: (task) =>
                set((state) => ({ tasks: [...state.tasks, task] })),
            updateTaskStatus: (id, status) =>
                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t.id === id ? { ...t, status } : t
                    ),
                })),
            setDailyQuota: (date, maxOrders) =>
                set((state) => ({
                    dailyQuotas: state.dailyQuotas.map((q) =>
                        q.date === date ? { ...q, maxOrders } : q
                    ),
                })),
            checkAvailability: (date) => {
                const quota = get().dailyQuotas.find((q) => q.date === date);
                if (!quota) return false;
                return quota.currentOrders < quota.maxOrders;
            },
            incrementQuota: (date) =>
                set((state) => ({
                    dailyQuotas: state.dailyQuotas.map((q) =>
                        q.date === date
                            ? { ...q, currentOrders: q.currentOrders + 1 }
                            : q
                    ),
                })),
        }),
        {
            name: 'delivery-storage',
        }
    )
);
