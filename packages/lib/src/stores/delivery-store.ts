import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DeliveryTask, DailyQuota, DeliveryStatus } from '../types';
import { MOCK_DELIVERY_TASKS } from '../constants';


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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const isSun = date.getDay() === 0;
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
