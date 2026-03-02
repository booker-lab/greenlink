const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const mockItems = [
    // --- ORC (난) ---
    {
        item_nm: "호접란 (블루 스카이 특)",
        category_id: 'ORC',
        qty: 8500,
        avg_cost: 15000,
        selling_price: 19000,
        current_participants: 8,
        target_participants: 10,
        status: 'RECRUITING',
        image_url: "https://images.unsplash.com/photo-1495480174641-32599268f775?w=400&h=400&fit=crop",
        metadata: { grade: 'SPECIAL', shootCount: 3, auctionParams: { flowerGubun: 3, itemNm: '서양란' } }
    },
    {
        item_nm: "동양란 (철골소심 상)",
        category_id: 'ORC',
        qty: 3200,
        avg_cost: 25000,
        selling_price: 32000,
        current_participants: 10,
        target_participants: 10,
        status: 'GOAL_MET',
        image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop",
        metadata: { grade: 'HIGH', shootCount: 5, auctionParams: { flowerGubun: 1, itemNm: '동양란' } }
    },
    // --- CUT (절화) ---
    {
        item_nm: "장미 (레드나오미 특)",
        category_id: 'CUT',
        qty: 15420,
        avg_cost: 15000,
        selling_price: 18500,
        current_participants: 7,
        target_participants: 10,
        status: 'RECRUITING',
        image_url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=400&fit=crop",
        metadata: { bloomStage: 2, stemLength: 60, fragrance: 'WEAK' }
    },
    {
        item_nm: "튤립 (망고 특)",
        category_id: 'CUT',
        qty: 8200,
        avg_cost: 12000,
        selling_price: 15900,
        current_participants: 15,
        target_participants: 20,
        status: 'RECRUITING',
        image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop",
        metadata: { bloomStage: 1, stemLength: 50, fragrance: 'NONE' }
    },
    {
        item_nm: "안개꽃 (화이트 화형상)",
        category_id: 'CUT',
        qty: 5400,
        avg_cost: 8000,
        selling_price: 11000,
        current_participants: 10,
        target_participants: 10,
        status: 'GOAL_MET',
        image_url: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400&h=400&fit=crop",
        metadata: { bloomStage: 3, stemLength: 70, fragrance: 'NONE' }
    },
    // --- FOL (관엽) ---
    {
        item_nm: "몬스테라 (알보 상)",
        category_id: 'FOL',
        qty: 3000,
        avg_cost: 35000,
        selling_price: 42000,
        current_participants: 3,
        target_participants: 10,
        status: 'RECRUITING',
        image_url: "https://images.unsplash.com/photo-1495480174641-32599268f775?w=400&h=400&fit=crop",
        metadata: { plantHeight: 40, potSize: 5, formQuality: 'B', difficulty: 'NORMAL' }
    },
    {
        item_nm: "금전수 (돈나무 대)",
        category_id: 'FOL',
        qty: 1200,
        avg_cost: 45000,
        selling_price: 55000,
        current_participants: 10,
        target_participants: 10,
        status: 'GOAL_MET',
        image_url: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=400&fit=crop",
        metadata: { plantHeight: 80, potSize: 10, formQuality: 'A', difficulty: 'EASY' }
    },
    {
        item_nm: "뱅갈고무나무 (중)",
        category_id: 'FOL',
        qty: 2500,
        avg_cost: 28000,
        selling_price: 35000,
        current_participants: 5,
        target_participants: 10,
        status: 'RECRUITING',
        image_url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=400&fit=crop",
        metadata: { plantHeight: 120, potSize: 8, formQuality: 'A', difficulty: 'EASY' }
    }
];

async function seedData() {
    console.log("🌱 Starting Database Seeding...");

    // 1. Clear existing items to ensure fresh seed
    console.log("🧹 Clearing existing mock data...");
    await supabase.from('zero_inventory_items').delete().neq('status', 'INVALID_STATUS_TO_DELETE_ALL');

    // 2. Insert Mock Items
    console.log(`Inserting ${mockItems.length} mock products...`);
    const { data, error } = await supabase.from('zero_inventory_items').insert(mockItems).select();

    if (error) {
        console.error("❌ Error inserting data:", error);
    } else {
        console.log(`✅ Successfully inserted ${data.length} items!`);
        data.forEach(item => {
            console.log(`  - [${item.category_id}] ${item.item_nm} (ID: ${item.id})`);
        });
    }
}

seedData();
