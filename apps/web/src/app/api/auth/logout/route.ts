import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        try {
                            cookieStore.set(name, value, {
                                ...options,
                                sameSite: 'lax',
                                secure: process.env.NODE_ENV === 'production'
                            });
                        } catch (error) {
                            // Route Handler 내부에서 쿠키 설정 오류 방지
                        }
                    });
                }
            }
        }
    );

    // 서버측 세션 종료 및 모든 auth 쿠키 즉시 삭제
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
}
