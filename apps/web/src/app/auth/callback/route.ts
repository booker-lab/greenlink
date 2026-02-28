import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/mypage";

    if (!code) {
        console.warn('[Auth Callback] No code provided in searchParams');
        return NextResponse.redirect(`${origin}/login?error=no_code`);
    }

    const cookieStore = await cookies();

    // 최종 목적지 Response 객체를 먼저 생성한다
    const redirectResponse = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        // cookieStore.set()은 Route Handler에서 에러가 날 수 있으나 
                        // 최대한 동기화를 위해 시도한다
                        try { cookieStore.set(name, value, options); } catch { }

                        // 실제 응답 객체에 쿠키 심기
                        redirectResponse.cookies.set({
                            name,
                            value,
                            ...options,
                            sameSite: 'lax',
                            secure: process.env.NODE_ENV === 'production'
                        });
                    });
                },
            },
            auth: {
                lock: async (name: string, timeout: number, acquire: () => Promise<any>) => {
                    return await acquire();
                }
            }
        }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
        console.log(`[Auth Callback] Login success. Cookies set in redirectResponse. Target: ${next}`);
        return redirectResponse;
    }

    console.error('[Auth Callback] exchangeCodeForSession Error:', error.message);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
}
