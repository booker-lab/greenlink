import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';

// HMR(Fast Refresh) 시에도 인스턴스를 유지하기 위해 globalThis에 부착
// CLIENT_CONFIG_VERSION: 클라이언트 설정 변경 시 이 값을 올려 구버전 캐시 강제 무효화
const CLIENT_CONFIG_VERSION = 'v2'; // cookieOptions 제거 버전

declare global {
    var __supabaseClient: SupabaseClient | undefined;
    var __supabaseClientVersion: string | undefined;
}

/**
 * Supabase 클라이언트 인스턴스를 생성하거나 반환합니다.
 * 브라우저 환경에서는 전역 싱글톤 패턴을 따르며, SSR 환경에서는 매 요청마다 새 인스턴스를 생성합니다.
 */
let cachedBrowserClient: SupabaseClient | undefined;

const getAuthOptions = () => {
    const isBrowser = typeof window !== 'undefined';
    // 기본적으로 '로그인 상태 유지'가 체크된 경우에만 localStorage 사용
    const rememberMe = isBrowser ? localStorage.getItem('gl_remember_me') === 'true' : false;

    return {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: isBrowser ? (rememberMe ? localStorage : sessionStorage) : undefined,
    };
};

export const createClient = () => {
    // 브라우저 환경 싱글톤 처리
    if (typeof window !== 'undefined') {
        // 버전 불일치 시 구버전 클라이언트 강제 폐기 (HMR 후 설정 변경 반영)
        if (globalThis.__supabaseClientVersion !== CLIENT_CONFIG_VERSION) {
            globalThis.__supabaseClient = undefined;
            cachedBrowserClient = undefined;
        }

        if (!cachedBrowserClient) {
            if (!globalThis.__supabaseClient) {
                const authOptions = getAuthOptions();

                // cookieOptions 제거: auth.storage(localStorage/sessionStorage)와 SSR 쿠키 어댑터가
                // 동일한 Navigator Lock을 경합 → 10초 타임아웃 발생. rememberMe 영속성은
                // auth.storage 선택(localStorage vs sessionStorage)으로 단일 경로에서 제어
                globalThis.__supabaseClient = createBrowserClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    { auth: authOptions }
                );
                globalThis.__supabaseClientVersion = CLIENT_CONFIG_VERSION;
            }
            cachedBrowserClient = globalThis.__supabaseClient;
        }
        return cachedBrowserClient;
    }

    // SSR 환경(서버 컴포넌트 등)용 클라이언트 생성
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: getAuthOptions() }
    );
};

export const resetSupabaseBrowserClient = () => {
    cachedBrowserClient = undefined;
    if (typeof window !== 'undefined') {
        globalThis.__supabaseClient = undefined;
    }
};

export const getSupabaseBrowserClient = createClient;
