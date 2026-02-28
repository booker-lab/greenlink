import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. 응답 객체 생성
    let supabaseResponse = NextResponse.next({
        request,
    })

    // 2. SSR 스토리지용 Supabase 클라이언트 생성
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        supabaseResponse.cookies.set({
                            name,
                            value,
                            ...options,
                            sameSite: 'lax',
                            secure: process.env.NODE_ENV === 'production'
                        })
                    })
                },
            },
            auth: {
                lock: async (name: string, timeout: number, acquire: () => Promise<any>) => {
                    return await acquire();
                }
            }
        }
    )

    // 3. 쿠키 세션 갱신 (만료 시 재발급 처리)
    let user = null
    try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        user = authUser
        if (user) {
            console.log(`[Middleware] Session detected for user: ${user.id} on path: ${request.nextUrl.pathname}`)
        } else {
            console.log(`[Middleware] No session for path: ${request.nextUrl.pathname}`)
        }
    } catch (e) {
        console.error('[Middleware] Session check failed:', e)
    }

    // 4. 경로 별 보호(Protected) 로직
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/mypage') ||
        request.nextUrl.pathname.startsWith('/order') ||
        request.nextUrl.pathname.startsWith('/cart')

    const isAuthRoute = request.nextUrl.pathname.startsWith('/login')

    if (isProtectedRoute && !user) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        const nextPath = request.nextUrl.pathname + request.nextUrl.search
        redirectUrl.searchParams.set('next', nextPath)
        const redirectResponse = NextResponse.redirect(redirectUrl)

        // supabaseResponse에 갱신된 세션 쿠키를 리다이렉트 응답에도 반드시 포함시킨다
        // Next.js 15에서는 쿠키 전파가 이전보다 엄격하므로 모든 헤더를 명시적으로 복사한다
        supabaseResponse.cookies.getAll().forEach(cookie => {
            const { name, value, ...options } = cookie;
            redirectResponse.cookies.set(name, value, { ...options });
        })
        return redirectResponse
    }

    if (isAuthRoute && user) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/'
        const redirectResponse = NextResponse.redirect(redirectUrl)

        supabaseResponse.cookies.getAll().forEach(cookie => {
            const { name, value, ...options } = cookie;
            redirectResponse.cookies.set(name, value, { ...options });
        })
        return redirectResponse
    }

    if (isAuthRoute && !user) {
        // 로그아웃 직후 등 비인증 상태로 /login 진입 시,
        // 브라우저 렌더링 인스턴스에 남아있을 수 있는 Lock 경합 잔재 및 유령 캐시 찌꺼기를 완전히 소거(캐시 무효화)
        supabaseResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        supabaseResponse.headers.set('Pragma', 'no-cache')
        supabaseResponse.headers.set('Expires', '0')
        // 보안/스토리지 강제 초기화가 필요할 경우 아래 옵션을 사용할 수 있음
        // supabaseResponse.headers.set('Clear-Site-Data', '"cache", "executionContexts"')
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - 이미지 파일들
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
