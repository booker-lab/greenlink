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
