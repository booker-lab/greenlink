const url = "https://iypvelkjrgzjtxrptmph.supabase.co/rest/v1/zero_inventory_items?select=created_at&limit=1";
const headers = {
    apikey: "sb_publishable_EqDKTIdC2OYP7PJuGG0K1Q_U9jwwixy",
    Authorization: "Bearer sb_publishable_EqDKTIdC2OYP7PJuGG0K1Q_U9jwwixy"
};

fetch(url, { headers })
    .then(res => res.json())
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(err => console.error(err));
