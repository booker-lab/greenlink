import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GroupBuyDeal, GroupBuyStatus } from '../types';
import { MOCK_GROUP_BUYS } from '../constants';

interface GroupBuyState {
    deals: GroupBuyDeal[];
    joinDeal: (dealId: string, userId: string, quantity: number) => void;
    leaveDeal: (dealId: string, userId: string) => void;
    getDealById: (id: string) => GroupBuyDeal | undefined;
}

export const useGroupBuyStore = create<GroupBuyState>()(
    persist(
        (set, get) => ({
            deals: MOCK_GROUP_BUYS,
            joinDeal: (dealId, userId, quantity) =>
                set((state) => ({
                    deals: state.deals.map((deal) => {
                        if (deal.id !== dealId) return deal;

                        const newCount = deal.currentQuantity + quantity;
                        const isGoalMet = newCount >= deal.minQuantity;
                        const newStatus: GroupBuyStatus = isGoalMet ? 'GOAL_MET' : deal.status;

                        return {
                            ...deal,
                            currentQuantity: newCount,
                            status: newStatus,
                            participants: [
                                ...deal.participants,
                                { userId, name: 'User', joinedAt: new Date().toISOString(), quantity },
                            ],
                        };
                    }),
                })),
            leaveDeal: (dealId, userId) =>
                set((state) => ({
                    deals: state.deals.map((deal) => {
                        if (deal.id !== dealId) return deal;
                        // Simplified logic: remove participant and decrease count
                        const participant = deal.participants.find((p) => p.userId === userId);
                        if (!participant) return deal;

                        return {
                            ...deal,
                            currentQuantity: deal.currentQuantity - participant.quantity,
                            participants: deal.participants.filter((p) => p.userId !== userId),
                        };
                    }),
                })),
            getDealById: (id) => get().deals.find((d) => d.id === id),
        }),
        {
            name: 'group-buy-storage',
        }
    )
);
