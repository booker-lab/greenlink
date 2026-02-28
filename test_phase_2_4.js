const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in environment");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTables() {
    console.log("🧪 Verifying Phase 2.4 Tables...");

    // 1. Check Profiles table
    const { error: profileErr } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

    if (profileErr && profileErr.code !== 'PGRST116') {
        console.error("❌ Failed to query profiles table:", profileErr.message);
    } else {
        console.log("✅ Profiles table exists and is accessible.");
    }

    // 2. Check Cart Items table
    const { error: cartErr } = await supabase
        .from('cart_items')
        .select('id')
        .limit(1);

    if (cartErr && cartErr.code !== 'PGRST116') {
        console.error("❌ Failed to query cart_items table:", cartErr.message);
    } else {
        console.log("✅ Cart Items table exists and is accessible.");
    }
}

verifyTables();
