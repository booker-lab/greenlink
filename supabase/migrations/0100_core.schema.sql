-- 1. farms (농가 테이블)
create table
  public.farms (
    id uuid not null default gen_random_uuid (),
    name text not null,
    profile_emoji text null,
    description text null,
    location_city text null,
    location_district text null,
    green_temperature double precision null,
    tags text[] null,
    created_at timestamp with time zone not null default now(),
    constraint farms_pkey primary key (id)
  ) tablespace pg_default;

-- 2. zero_inventory_items (제로 인벤토리/공동구매 테이블)
create table
  public.zero_inventory_items (
    id uuid not null default gen_random_uuid (),
    item_nm text not null,
    category_id text not null,
    qty integer not null default 0,
    avg_cost integer not null default 0,
    selling_price integer not null default 0,
    current_participants integer not null default 0,
    target_participants integer not null default 10,
    status text not null default 'RECRUITING'::text,
    image_url text not null,
    metadata jsonb null default '{}'::jsonb,
    created_at timestamp with time zone not null default now(),
    constraint zero_inventory_items_pkey primary key (id)
  ) tablespace pg_default;

-- 3. group_but_deals (공동구매 상세 로직 및 데드라인 연결 테이블)
create table
  public.group_buy_deals (
    id uuid not null default gen_random_uuid (),
    item_id uuid not null,
    title text not null,
    description text null,
    status text not null default 'RECRUITING'::text,
    deadline timestamp with time zone not null,
    created_at timestamp with time zone not null default now(),
    constraint group_buy_deals_pkey primary key (id),
    constraint group_buy_deals_item_id_fkey foreign key (item_id) references zero_inventory_items (id) on delete cascade
  ) tablespace pg_default;

-- 4. Initial Seed Data (Optional, for easy testing)
-- Mock Farm
insert into public.farms (id, name, profile_emoji, location_city, location_district)
values ('11111111-1111-1111-1111-111111111111', '디어 오키드', '🪴', '이천시', '마장면');

-- Mock CUT (절화) Data with JSONB Metadata
insert into public.zero_inventory_items (id, item_nm, category_id, qty, avg_cost, selling_price, target_participants, status, image_url, metadata)
values 
  ('22222222-2222-2222-2222-222222222222', '장미 (레드나오미 특)', 'CUT', 15420, 15000, 18500, 10, 'RECRUITING', 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=800&q=80', '{"bloomStage": 2, "stemLength": 60, "fragrance": "WEAK"}'),
  ('33333333-3333-3333-3333-333333333333', '튤립 (망고 특)', 'CUT', 6230, 22000, 28000, 10, 'RECRUITING', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80', '{"bloomStage": 3, "stemLength": 40, "fragrance": "NONE"}');

-- Mock FOL (관엽) Data with JSONB Metadata
insert into public.zero_inventory_items (id, item_nm, category_id, qty, avg_cost, selling_price, target_participants, status, image_url, metadata)
values 
  ('44444444-4444-4444-4444-444444444444', '몬스테라 (알보 상)', 'FOL', 3000, 35000, 42000, 10, 'RECRUITING', 'https://images.unsplash.com/photo-1548610762-7c6abc94c731?w=800&q=80', '{"plantHeight": 40, "potSize": 5, "formQuality": "B", "difficulty": "NORMAL"}');
