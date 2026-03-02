-- DDD: Delivery & Settlement Domain Schema Update
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_method VARCHAR(50) DEFAULT 'GREENLINK_DRIVER';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS settlement_status VARCHAR(50) DEFAULT 'PENDING';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS settled_at TIMESTAMP WITH TIME ZONE;

-- Create RPC for atomic settlement processing
CREATE OR REPLACE FUNCTION confirm_delivery_and_settle(p_order_id UUID, p_driver_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.orders
    SET status = 'DELIVERED',
        settlement_status = 'COMPLETED',
        settled_at = NOW(),
        delivery_task_id = p_driver_id::TEXT
    WHERE id = p_order_id AND status != 'DELIVERED';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
