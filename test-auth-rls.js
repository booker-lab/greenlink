const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iypvelkjrgzjtxrptmph.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_EqDKTIdC2OYP7PJuGG0K1Q_U9jwwixy";
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log("Starting test...");
    // 1. fetch without auth
    const { data: d1 } = await supabase.from('zero_inventory_items').select('id');
    console.log("Anon count:", d1 ? d1.length : 0);

    // 2. sign up a dummy user
    const email = `test_${Date.now()}@example.com`;
    const password = `pass_${Date.now()}!!`;
    const { data: authData, error: authErr } = await supabase.auth.signUp({ email, password });
    if (authErr) { console.error("Signup error:", authErr.message); return; }

    console.log("Signed in as:", authData.user.id);

    // 3. fetch with auth
    const { data: d2, error: err2 } = await supabase.from('zero_inventory_items').select('id');
    console.log("Auth count:", d2 ? d2.length : 0);
    if (err2) console.log("Auth err:", err2);
}
run();
