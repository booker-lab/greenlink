-- 2026-03-03 | Fix orders table to include user_id and update create_escrow_order_txn
-- 이 마이그레이션은 주문이 사용자 정보와 연동되지 않아 '나의 주문 내역'에 나타나지 않는 문제를 해결합니다.

-- 1. orders 테이블에 user_id 컬럼 추가 (비어있을 수 있으므로 NULL 허용 후 나중에 필수 처리 권장)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='user_id') THEN
        ALTER TABLE public.orders ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 2. create_escrow_order_txn 함수를 p_user_id를 받도록 업데이트
CREATE OR REPLACE FUNCTION public.create_escrow_order_txn(
    p_user_id UUID,
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
    -- [1] Insert the new order record WITH user_id
    INSERT INTO public.orders (
        user_id, product_id, buyer_name, buyer_phone, buyer_address, quantity, total_price, status
    )
    VALUES (
        p_user_id, p_product_id, p_buyer_name, p_buyer_phone, p_buyer_address, p_quantity, p_total_price, 'ESCROW_DEPOSIT'
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

-- 3. RLS 정책 업데이트 (사용자가 자신의 주문만 볼 수 있도록)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users can insert their own orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);
