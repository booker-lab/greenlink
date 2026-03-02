import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';

// HMR(Fast Refresh) 시에도 인스턴스를 유지하기 위해 globalThis에 부착
declare global {
    var __supabaseClient: SupabaseClient | undefined;
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
        if (!cachedBrowserClient) {
            if (!globalThis.__supabaseClient) {
                const authOptions = getAuthOptions();
                const rememberMe = typeof window !== 'undefined' ? localStorage.getItem('gl_remember_me') === 'true' : false;

                globalThis.__supabaseClient = createBrowserClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    {
                        auth: authOptions,
                        cookieOptions: {
                            // rememberMe가 꺼져있으면 undefined(세션 쿠키), 켜져있으면 1년(31536000초) 설정
                            maxAge: rememberMe ? 60 * 60 * 24 * 365 : undefined,
                            path: '/',
                            sameSite: 'lax',
                            secure: process.env.NODE_ENV === 'production',
                        } as any
                    }
                );
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
