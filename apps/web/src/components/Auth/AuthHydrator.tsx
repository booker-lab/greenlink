"use client";

import { useEffect, useRef } from "react";
import { useUserStore } from "@greenlink/lib";

interface AuthHydratorProps {
    initialUser: any | null;
}

/**
 * 서버에서 넘겨받은 인증 정보를 Zustand Store에 즉시 주입하여
 * 클라이언트 렌더링 시 버퍼링(Spinner)을 제거하는 브릿지 컴포넌트입니다.
 */
export function AuthHydrator({ initialUser }: AuthHydratorProps) {
    const { isInitialized } = useUserStore();
    const isHydrated = useRef(false);

    if (!isHydrated.current && initialUser) {
        // 최초 렌더링 시점에 즉시 유저 정보 주입 (Sync)
        useUserStore.setState({
            user: initialUser,
            isAuthenticated: !!initialUser,
            isInitialized: true
        });
        isHydrated.current = true;
        console.log('[Auth Hydrator] Server-side session hydrated successfully.');
    } else if (!isHydrated.current && !initialUser) {
        // 유저 정보가 없더라도 초기화 완료 처리
        useUserStore.setState({ isInitialized: true });
        isHydrated.current = true;
    }

    return null; // UI를 그리지 않는 유틸리티 컴포넌트
}
