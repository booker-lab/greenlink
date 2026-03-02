const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iypvelkjrgzjtxrptmph.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_EqDKTIdC2OYP7PJuGG0K1Q_U9jwwixy";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log("Signing up...");
    // Try to use a password that meets complex policies
    const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: `tazan@greenlink.com`,
        password: `Greenlink123!@#`
    });

    if (authErr) {
        console.error("Signup error:", authErr);
        if (authErr.message.includes("User already registered")) {
            console.log("User already exists, trying login...");
            const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
                email: `tazan@greenlink.com`,
                password: `Greenlink123!@#`
            });
            if (loginErr) {
                console.error("Login also failed:", loginErr);
                return;
            }
            console.log("Logged in as:", loginData.user?.id);
        } else {
            return;
        }
    } else {
        console.log("Signed in as:", authData.user?.id);
    }

    // Fetch data parallel like in the app
    try {
        const { data, error } = await supabase
            .from('zero_inventory_items')
            .select('*')
            .eq('category_id', 'CUT');

        if (error) {
            console.log("Error fetching items:", error);
        } else {
            console.log("FETCHED CUT ITEMS:", data ? data.length : 0);
            if (data && data.length > 0) {
                console.log("First item:", data[0].item_nm);
            }
        }
    } catch (e) {
        console.error("Fetch threw:", e);
    }
}
run();
