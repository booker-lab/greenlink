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
ALTER PUBLICATION supabase_realtime ADD TABLE public.zero_inventory_items;

-- 3. Create Atomic Transaction RPC for Escrow Orders
CREATE OR REPLACE FUNCTION public.create_escrow_order_txn(
    p_product_id UUID,
    p_buyer_name TEXT,
    p_buyer_phone TEXT,
    p_buyer_address TEXT,
    p_quantity INTEGER,
    p_total_price INTEGER
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id UUID;
    v_updated_item RECORD;
BEGIN
    -- [1] Insert the new order record
    INSERT INTO public.orders (
        product_id, buyer_name, buyer_phone, buyer_address, quantity, total_price, status
    )
    VALUES (
        p_product_id, p_buyer_name, p_buyer_phone, p_buyer_address, p_quantity, p_total_price, 'ESCROW_DEPOSIT'
    )
    RETURNING id INTO v_order_id;
    
    -- [2] Atomically update the participant count of the group buy product
    UPDATE public.zero_inventory_items
    SET current_participants = current_participants + p_quantity
    WHERE id = p_product_id
    RETURNING current_participants, target_participants, status INTO v_updated_item;
    
    -- [3] Automatically complete the deal if the target is met
    IF v_updated_item.current_participants >= v_updated_item.target_participants AND v_updated_item.status = 'RECRUITING' THEN
        UPDATE public.zero_inventory_items
        SET status = 'GOAL_MET'
        WHERE id = p_product_id;
    END IF;

    -- Return the generated order ID to the client
    RETURN json_build_object(
        'order_id', v_order_id,
        'current_participants', v_updated_item.current_participants
    );
END;
$$;
