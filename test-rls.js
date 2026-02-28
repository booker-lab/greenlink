const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iypvelkjrgzjtxrptmph.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_EqDKTIdC2OYP7PJuGG0K1Q_U9jwwixy";

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data: anonData, error: anonError } = await supabase.from('zero_inventory_items').select('*');
    console.log("Anon Fetch Error:", anonError);
    console.log("Anon Data length:", anonData ? anonData.length : 0);
}
test();
