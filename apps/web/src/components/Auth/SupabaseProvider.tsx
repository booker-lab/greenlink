"use client";

import { useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useUserStore, greenlinkApi, getSupabaseBrowserClient } from "@greenlink/lib";
import type { UserProfile } from "@greenlink/lib";

interface SupabaseProviderProps {
    /** 서버 컴포넌트(layout.tsx)에서 Pre-fetch한 초기 사용자 데이터 */
    initialUser: UserProfile | null;
    children: React.ReactNode;
}

/**
 * GreenLink Auth SSOT Provider
 *
 * 설계 원칙:
 * 1. 서버에서 넘겨받은 initialUser를 스토어에 즉시(Zero-lag) 동기화한다.
 * 2. onAuthStateChange 리스너를 이 컴포넌트 하나에서만 등록한다.
 *    (전역 globalThis 싱글톤 패턴 대신, Provider 마운트/언마운트 생명주기로 관리)
 * 3. 인증 상태의 단방향 흐름: Supabase → onAuthStateChange → useUserStore.setState
 */
export function SupabaseProvider({ initialUser, children }: SupabaseProviderProps) {
    const isHydrated = useRef(false);

    // 1. 최초 렌더링 시 서버 데이터를 즉시 동기화 (React 렌더 중 동기 실행)
    if (!isHydrated.current) {
        useUserStore.setState({
            user: initialUser,
            isAuthenticated: !!initialUser,
            isInitialized: true, // 서버가 이미 확인했으므로 초기화 완료 처리
            cartCount: 0,
        });
        isHydrated.current = true;
    }

    useEffect(() => {
        const supabase = getSupabaseBrowserClient();

        // 2. auth 이벤트 구독 — 모든 상태 변경의 유일한 진원지
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log(`[SupabaseProvider] Auth Event: ${event}`);

                if (event === 'SIGNED_OUT') {
                    useUserStore.setState({
                        user: null,
                        isAuthenticated: false,
                        cartCount: 0,
                        isInitialized: true,
                    });
                    return;
                }

                if (
                    (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') &&
                    session?.user
                ) {
                    try {
                        const profile = await greenlinkApi.getProfile(session.user.id);
                        const count = await greenlinkApi.getCartCount(session.user.id);
                        useUserStore.setState({
                            user: profile,
                            isAuthenticated: true,
                            cartCount: count,
                            isInitialized: true,
                        });
                    } catch (e) {
                        console.error('[SupabaseProvider] Profile fetch failed:', e);
                        // 프로필 조회 실패 시에도 Auth 자체가 성공했으므로 최소 정보 반영
                        useUserStore.setState({
                            isAuthenticated: true,
                            isInitialized: true,
                        });
                    }
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return <>{children}</>;
}
