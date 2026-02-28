/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useGroupBuyStore } from '../src/stores/group-buy-store';
import { MOCK_GROUP_BUYS } from '../src/constants';

describe('useGroupBuyStore', () => {
    // 각 테스트 전에 스토어를 초기화(MOCK 데이터 원복)합니다.
    beforeEach(() => {
        useGroupBuyStore.setState({ deals: [...MOCK_GROUP_BUYS] });
    });

    it('updateSyncData 액션이 주어진 dealId의 status와 currentParticipants를 제대로 업데이트해야 합니다.', () => {
        const testDealId = 'gb-001'; // MOCK_GROUP_BUYS에 존재하는 거래 ID

        // 초기 상태 확인 (MOCK 구조 기반)
        const initialDeal = useGroupBuyStore.getState().getDealById(testDealId);
        expect(initialDeal).toBeDefined();

        const initialParticipants = initialDeal?.zeroInventoryItem.currentParticipants || 0;

        // 업데이트 수행: 현재 인원을 +5 증가시키고, 상태를 GOAL_MET으로 강제 동기화 (Supabase Realtime 이벤트 시뮬레이션)
        const newParticipants = initialParticipants + 5;
        const newStatus = 'GOAL_MET';

        // 스토어 액션 직접 호출
        useGroupBuyStore.getState().updateSyncData(testDealId, newParticipants, newStatus);

        // 상태 반영 확인
        const updatedDeal = useGroupBuyStore.getState().getDealById(testDealId);

        // 1. 최상위 status 업데이트 여부
        expect(updatedDeal?.status).toBe(newStatus);

        // 2. nested zeroInventoryItem 속성 업데이트 여부
        expect(updatedDeal?.zeroInventoryItem.currentParticipants).toBe(newParticipants);
        expect(updatedDeal?.zeroInventoryItem.status).toBe(newStatus);

        // 3. 다른 deal은 영향을 받지 않아야 함
        const otherDealId = 'orc-2';
        const otherDeal = useGroupBuyStore.getState().getDealById(otherDealId);
        const originalOtherDeal = MOCK_GROUP_BUYS.find(d => d.id === otherDealId);
        expect(otherDeal?.zeroInventoryItem.currentParticipants).toBe(originalOtherDeal?.zeroInventoryItem.currentParticipants);
    });

    it('존재하지 않는 dealId에 대해 updateSyncData를 호출하면 아무 변화가 없어야 합니다.', () => {
        const originalDeals = useGroupBuyStore.getState().deals;

        // 존재하지 않는 UUID
        const fakeId = '00000000-0000-0000-0000-000000000000';

        useGroupBuyStore.getState().updateSyncData(fakeId, 999, 'COMPLETED');

        const newDeals = useGroupBuyStore.getState().deals;
        expect(newDeals).toEqual(originalDeals);
    });
});
