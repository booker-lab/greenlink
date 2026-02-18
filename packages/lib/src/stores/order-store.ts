import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderStatus } from '../types';
import { MOCK_ORDERS } from '../constants';

interface OrderState {
    orders: Order[];
    addOrder: (order: Order) => void;
    updateOrderStatus: (id: string, status: OrderStatus) => void;
    getOrdersByFarm: (farmId: string) => Order[];
    getOrdersByStatus: (status: OrderStatus) => Order[];
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            orders: MOCK_ORDERS,
            addOrder: (order) =>
                set((state) => ({ orders: [...state.orders, order] })),
            updateOrderStatus: (id, status) =>
                set((state) => ({
                    orders: state.orders.map((o) =>
                        o.id === id ? { ...o, status } : o
                    ),
                })),
            getOrdersByFarm: (farmId) =>
                get().orders.filter((o) => o.farmId === farmId),
            getOrdersByStatus: (status) =>
                get().orders.filter((o) => o.status === status),
        }),
        {
            name: 'order-storage',
        }
    )
);
