import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    // Admin app defaults to the root dashboard (/) after social login
    const next = requestUrl.searchParams.get('next') ?? '/'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // Ignore potential errors during server-side cookie setting
                        }
                    },
                },
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
            console.error('[Admin Auth Callback] Session exchange error:', error.message)
            return NextResponse.redirect(`${requestUrl.origin}/login?error=session_error`)
        }
    }

    // Redirect to the intended next page within the admin app
    console.log(`[Admin Auth Callback] Redirecting to: ${next}`)
    return NextResponse.redirect(`${requestUrl.origin}${next}`)
}
