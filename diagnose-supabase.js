const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iypvelkjrgzjtxrptmph.supabase.co';
const supabaseAnonKey = 'sb_publishable_EqDKTIdC2OYP7PJuGG0K1Q_U9jwwixy';

console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseAnonKey?.length);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log('Testing connection...');
    const startTime = Date.now();

    try {
        const { data, error } = await supabase
            .from('zero_inventory_items')
            .select('*')
            .limit(5);

        const duration = Date.now() - startTime;
        console.log(`Query took ${duration}ms`);

        if (error) {
            console.error('Error fetching items:', error);
        } else {
            console.log('Fetched items count:', data?.length);
            console.log('Items:', JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error('Fatal execution error:', e);
    }
}

test();
