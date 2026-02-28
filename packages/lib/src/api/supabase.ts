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

const authOptions = {
    // 락 제거: 싱글톤 전환으로 더 이상 클라이언트 재생성 충돌이 없으므로, 기본 네이티브 navigator.locks를 사용하여 토큰 갱신 시 Race Condition 방지
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
};

export const createClient = () => {
    // 브라우저 환경 싱글톤 처리
    if (typeof window !== 'undefined') {
        if (!cachedBrowserClient) {
            if (!globalThis.__supabaseClient) {
                globalThis.__supabaseClient = createBrowserClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    {
                        auth: authOptions
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
        { auth: authOptions }
    );
};

export const getSupabaseBrowserClient = createClient;
