import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GroupBuyDeal, GroupBuyStatus } from '../types';
import { MOCK_GROUP_BUYS } from '../constants';

interface GroupBuyState {
    deals: GroupBuyDeal[];
    joinDeal: (dealId: string, userId: string, quantity: number) => void;
    leaveDeal: (dealId: string, userId: string) => void;
    getDealById: (id: string) => GroupBuyDeal | undefined;
    updateSyncData: (dealId: string, currentParticipants: number, status: GroupBuyStatus) => void;
}

export const useGroupBuyStore = create<GroupBuyState>()(
    persist(
        (set, get) => ({
            deals: MOCK_GROUP_BUYS,
            joinDeal: (dealId, userId, quantity) =>
                set((state) => ({
                    deals: state.deals.map((deal) => {
                        if (deal.id !== dealId) return deal;

                        const newCount = deal.zeroInventoryItem.currentParticipants + quantity;
                        const isGoalMet = newCount >= deal.zeroInventoryItem.targetParticipants;
                        const newStatus: GroupBuyStatus = isGoalMet ? 'GOAL_MET' : deal.status;

                        return {
                            ...deal,
                            zeroInventoryItem: {
                                ...deal.zeroInventoryItem,
                                currentParticipants: newCount,
                                status: newStatus,
                            },
                            status: newStatus,
                            participants: [
                                ...deal.participants,
                                { userId, name: 'User', joinedAt: new Date().toISOString(), quantity, isEscrowPaid: true },
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
                            zeroInventoryItem: {
                                ...deal.zeroInventoryItem,
                                currentParticipants: deal.zeroInventoryItem.currentParticipants - participant.quantity,
                            },
                            participants: deal.participants.filter((p) => p.userId !== userId),
                        };
                    }),
                })),
            getDealById: (id) => get().deals.find((d) => d.id === id),
            updateSyncData: (dealId, currentParticipants, status) =>
                set((state) => ({
                    deals: state.deals.map((deal) => {
                        if (deal.id !== dealId) return deal;
                        // zeroInventoryItem.id 도 동일하게 검사해서 매핑할 수 있으나 MVP에선 dealId 와 동일시 취급
                        return {
                            ...deal,
                            status,
                            zeroInventoryItem: {
                                ...deal.zeroInventoryItem,
                                currentParticipants,
                                status,
                            },
                        };
                    }),
                })),
        }),
        {
            name: 'group-buy-storage',
        }
    )
);
