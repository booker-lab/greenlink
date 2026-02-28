-- 1. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.zero_inventory_items(id) ON DELETE CASCADE,
    buyer_name TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    buyer_address TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'ESCROW_DEPOSIT', -- 'ESCROW_DEPOSIT', 'COMPLETED', 'REFUNDED'
    delivery_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_escrow BOOLEAN DEFAULT TRUE
);

-- 2. Enable Realtime for zero_inventory_items to broadcast current_participants changes
alter publication supabase_realtime add table public.zero_inventory_items;
