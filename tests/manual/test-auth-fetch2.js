const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iypvelkjrgzjtxrptmph.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_EqDKTIdC2OYP7PJuGG0K1Q_U9jwwixy";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    // 1. sign up a dummy user (valid email)
    const email = `test_${Date.now()}@test.com`;
    const password = `pass_${Date.now()}!!`;
    const { data: authData, error: authErr } = await supabase.auth.signUp({ email, password });
    if (authErr) { console.error("Signup error:", authErr.message); return; }

    console.log("Signed in as:", authData.user.id);

    // Wait for auth to propagate locally in case of anything
    await new Promise(r => setTimeout(r, 500));

    // 2. Fetch data parallel like in the app
    try {
        const [profile, cart, itemsCUT, itemsORC, itemsFOL] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', authData.user.id).single(),
            supabase.from('cart_items').select('*').eq('user_id', authData.user.id),
            supabase.from('zero_inventory_items').select('id, category_id').eq('category_id', 'CUT'),
            supabase.from('zero_inventory_items').select('id, category_id').eq('category_id', 'ORC'),
            supabase.from('zero_inventory_items').select('id, category_id').eq('category_id', 'FOL')
        ]);

        console.log("CUT length:", itemsCUT.data ? itemsCUT.data.length : 0);
        console.log("ORC length:", itemsORC.data ? itemsORC.data.length : 0);
        console.log("FOL length:", itemsFOL.data ? itemsFOL.data.length : 0);

        if (itemsCUT.error) console.log("Items CUT Error:", itemsCUT.error);
        if (profile.error) console.log("Profile Error:", profile.error);
        if (cart.error) console.log("Cart Error:", cart.error);
    } catch (e) {
        console.error("Parallel fetch threw:", e);
    }
}
run();
