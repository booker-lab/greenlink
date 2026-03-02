/**
 * @deprecated Mock 데이터 기반 스토어. Supabase farms 테이블 직접 조회로 대체 예정.
 * stores/index.ts 공개 API에서 제거됨. 참고용으로 파일 보존.
 */
import { create } from 'zustand';
import { Farm } from '../types';
import { MOCK_FARMS } from '../constants/farms';

interface FarmState {
    farms: Farm[];
    setFarms: (farms: Farm[]) => void;
}

export const useFarmStore = create<FarmState>((set) => ({
    farms: MOCK_FARMS as Farm[],
    setFarms: (farms) => set({ farms }),
}));
