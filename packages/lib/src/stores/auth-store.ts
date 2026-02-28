import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Driver } from '../types';

interface AuthState {
    driver: Driver | null;
    isAuthenticated: boolean;
    otpSent: boolean;
    loginPhone: string | null;
    sendOtp: (phone: string) => Promise<boolean>;
    verifyOtp: (code: string) => Promise<boolean>;
    logout: () => void;
}

const MOCK_DRIVER: Driver = {
    id: 'driver-001',
    name: '박기사',
    phone: '010-9999-8888',
    vehicleInfo: 'Kia PV5',
    farmId: 'farm-dear-orchid-001',
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            driver: null,
            isAuthenticated: false,
            otpSent: false,
            loginPhone: null,
            sendOtp: async (phone) => {
                // Mock API call
                await new Promise((resolve) => setTimeout(resolve, 500));
                set({ otpSent: true, loginPhone: phone });
                return true;
            },
            verifyOtp: async (code) => {
                // Mock API call
                await new Promise((resolve) => setTimeout(resolve, 500));
                if (code === '000000') {
                    set({
                        isAuthenticated: true,
                        driver: MOCK_DRIVER,
                        otpSent: false,
                        loginPhone: null,
                    });
                    return true;
                }
                return false;
            },
            logout: () =>
                set({
                    driver: null,
                    isAuthenticated: false,
                    otpSent: false,
                    loginPhone: null,
                }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
