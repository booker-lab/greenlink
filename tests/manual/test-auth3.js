const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iypvelkjrgzjtxrptmph.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_EqDKTIdC2OYP7PJuGG0K1Q_U9jwwixy";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    // We can use a random email that looks real
    const randid = Math.floor(Math.random() * 1000000);
    const email = `user${randid}@example.com`;
    const password = `Test1234!@#$`;

    console.log("Signing up...");
    const { data: authData, error: authErr } = await supabase.auth.signUp({ email, password });
    if (authErr) { console.error("Signup error:", authErr); return; }

    console.log("Signed in as:", authData.user?.id);

    // 2. Fetch data parallel like in the app
    try {
        const { data, error } = await supabase
            .from('zero_inventory_items')
            .select('id, item_nm, category_id, qty, avg_cost, selling_price, current_participants, target_participants, status, image_url, metadata')
            .eq('category_id', 'CUT')
            .order('created_at', { ascending: false });

        if (error) {
            console.log("Error fetching items:", error);
        } else {
            console.log("FETCHED CUT ITEMS:", data ? data.length : 0);
        }
    } catch (e) {
        console.error("Fetch threw:", e);
    }
}
run();
