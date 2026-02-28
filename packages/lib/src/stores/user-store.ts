import { create } from 'zustand';
import { greenlinkApi } from '../api';
import { getSupabaseBrowserClient } from '../api/supabase';

export interface UserProfile {
    id: string;
    nickname: string;
    pinkTemperature: {
        value: number;
        level: string;
        emoji: string;
    };
    points: number;
}

interface UserState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    cartCount: number;

    // Actions
    loginWithProvider: (provider: 'kakao' | 'naver' | 'google') => Promise<void>;
    logout: () => Promise<void>;
    fetchProfileAndCart: () => Promise<void>;
    incrementCart: (qty?: number) => void;
}

/**
 * GreenLink 사용자 상태 스토어 (Simplified SSOT 버전)
 *
 * 설계 원칙:
 * - `persist` 미들웨어를 제거하여 "유령 세션(Ghost Session)" 문제를 원천 차단한다.
 * - 인증 상태의 초기화 책임은 SupabaseProvider에 완전히 위임한다.
 * - 이 스토어는 오직 메모리 상의 파생 상태(Derived State)만 보관하는 얇은 컨테이너다.
 * - `initializeAuthListener`는 더이상 필요하지 않으므로 제거한다.
 */
export const useUserStore = create<UserState>()(
    (set, get) => ({
        user: null,
        isAuthenticated: false,
        isInitialized: false,
        cartCount: 0,

        loginWithProvider: async (provider) => {
            const supabase = getSupabaseBrowserClient();
            const options: any = {
                redirectTo: `${window.location.origin}/auth/callback`,
                // 자동 로그인 루프 방지: 매번 계정 선택 창을 강제 표시
                queryParams: {
                    prompt: 'consent select_account'
                }
            };
            if (provider === 'kakao') {
                options.scopes = 'profile_nickname profile_image';
            }
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider as any,
                options
            });
            if (error) throw error;
        },

        logout: async () => {
            console.log('[User Store] Initiating logout...');
            try {
                // 병렬 로그아웃 처리 중 Standoff(교착) 방지를 위해
                // API 호출 최우선 실행 후 즉시 강제 리다이렉트를 보장함.
                const supabase = getSupabaseBrowserClient();

                // 로컬 정리 및 서버 정리를 백그라운드에서 던지고
                const localSignOut = supabase.auth.signOut().catch(e => console.error('Local signOut error:', e));
                const serverSignOut = fetch('/api/auth/logout', { method: 'POST' }).catch(e => console.error('Server signOut error:', e));

                // 최대 1.5초만 대기한 후 강제로 페이지를 이동시킴
                await Promise.race([
                    Promise.all([localSignOut, serverSignOut]),
                    new Promise(resolve => setTimeout(resolve, 1500))
                ]);
            } catch (e) {
                console.error('[User Store] Fatal error during signOut:', e);
            } finally {
                // 세션 상태 완전 초기화를 위한 강제 리다이렉트
                window.location.href = '/login';
            }
        },

        fetchProfileAndCart: async () => {
            const { isAuthenticated, user } = get();
            if (!isAuthenticated || !user) return;
            try {
                const profile = await greenlinkApi.getProfile(user.id);
                const count = await greenlinkApi.getCartCount(user.id);
                set({ user: profile, cartCount: count });
            } catch (e) {
                console.error('[User Store] Data fetch failed', e);
            }
        },

        incrementCart: (qty = 1) => {
            set((state) => ({ cartCount: state.cartCount + qty }));
        }
    })
);
