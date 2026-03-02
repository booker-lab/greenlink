const { createClient } = require('@supabase/supabase-js');
const assert = require('assert');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in environment");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRpc() {
    console.log("🧪 Testing Phase 2.3 Escrow Order RPC...");

    // 1. Get an active item
    const { data: items, error: fetchErr } = await supabase
        .from('zero_inventory_items')
        .select('*')
        .eq('status', 'RECRUITING')
        .limit(1);

    if (fetchErr || !items || items.length === 0) {
        console.error("❌ Failed to fetch test item:", fetchErr);
        return;
    }

    const testItem = items[0];
    const initialParticipants = testItem.current_participants;
    console.log(`- Target Item: ${testItem.item_nm} (Current Participants: ${initialParticipants})`);

    // 2. Call RPC to buy 3 qty
    const quantityToBuy = 3;
    const testBuyer = { name: "Antigravity Test", phone: "010-0000-0000", address: "AIVille" };

    console.log(`- Calling create_escrow_order_txn to buy ${quantityToBuy} qty...`);

    const { data: rpcResult, error: rpcErr } = await supabase.rpc('create_escrow_order_txn', {
        p_product_id: testItem.id,
        p_buyer_name: testBuyer.name,
        p_buyer_phone: testBuyer.phone,
        p_buyer_address: testBuyer.address,
        p_quantity: quantityToBuy,
        p_total_price: testItem.selling_price * quantityToBuy
    });

    if (rpcErr) {
        console.error("❌ RPC Execution Failed:", rpcErr);
        return;
    }

    console.log("✅ RPC Succeeded:", rpcResult);

    // 3. Verify Order Creation
    const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .select('*')
        .eq('id', rpcResult.order_id)
        .single();

    if (orderErr) {
        console.error("❌ Failed to verify order creation");
    } else {
        console.log(`✅ Order found in DB: ${orderData.id}, Qty: ${orderData.quantity}, Name: ${orderData.buyer_name}`);
    }

    // 4. Verify Atomic Update
    const { data: verifyItem } = await supabase
        .from('zero_inventory_items')
        .select('current_participants')
        .eq('id', testItem.id)
        .single();

    assert.strictEqual(verifyItem.current_participants, initialParticipants + quantityToBuy);
    console.log(`✅ Atomic Update Verified! Participants increased from ${initialParticipants} to ${verifyItem.current_participants}`);
}

testRpc();
