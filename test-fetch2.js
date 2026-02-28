const url = "https://iypvelkjrgzjtxrptmph.supabase.co/rest/v1/zero_inventory_items?select=id,item_nm,category_id,qty,avg_cost,selling_price,current_participants,target_participants,status,image_url,metadata&category_id=eq.CUT";
const headers = {
    apikey: "sb_publishable_EqDKTIdC2OYP7PJuGG0K1Q_U9jwwixy",
    Authorization: "Bearer sb_publishable_EqDKTIdC2OYP7PJuGG0K1Q_U9jwwixy"
};

fetch(url, { headers })
    .then(res => res.json())
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(err => console.error(err));
