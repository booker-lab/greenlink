import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: (cookiesToSet) => {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch (e) { }
                }
            }
        }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    const { data, error } = await supabase
        .from('zero_inventory_items')
        .select('id, item_nm, category_id, qty, avg_cost, selling_price, current_participants, target_participants, status, image_url, metadata')
        .eq('category_id', 'CUT')
        .order('created_at', { ascending: false });

    return NextResponse.json({
        isLoggedIn: !!session,
        userId: session?.user?.id || null,
        sessionError: sessionError?.message,
        fetchError: error?.message,
        dataLength: data ? data.length : 0,
        data: data || []
    });
}
