import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId, deliveryMethod, trackingNumber, driverId, farmId } = body;

        // 1. 필수 파라미터 검증
        if (!orderId || !deliveryMethod) {
            console.error('[Delivery Domain] Missing required parameters: orderId or deliveryMethod');
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        // 2. 관리자/드라이버 RBAC 권한 검증 기틀 (서비스 롤 키 사용 전 클라이언트 세션 토큰 확인 필요)
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            console.error('[Delivery Domain] Unauthorized access attempt: Missing Authorization header');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 백그라운드 트랜잭션 처리를 위한 Service Role Client 생성
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 3. 배송 완료 및 정산 상태 업데이트 트랜잭션
        if (deliveryMethod === 'GREENLINK_DRIVER') {
            // 그린링크 드라이버 직배송: 배송 완료 시 즉시 에스크로 정산 확정
            const { error } = await supabase.rpc('confirm_delivery_and_settle', {
                p_order_id: orderId,
                p_driver_id: driverId || null
            });

            if (error) {
                console.error(`[Delivery Domain] Settlement transaction failed for order: ${orderId}`, error);
                throw error;
            }
            console.log(`[Delivery Domain] Driver delivery completed. Escrow settled for order: ${orderId}`);
        }
        else if (deliveryMethod === 'COURIER') {
            // 일반 택배 배송: 운송장 등록 및 상태 변경 (실제 정산은 택배사 배송 완료 API 연동 시 트리거)
            if (!trackingNumber) {
                console.error('[Delivery Domain] Courier method requires trackingNumber');
                return NextResponse.json({ error: 'Missing tracking number' }, { status: 400 });
            }

            const { error } = await supabase
                .from('orders')
                .update({
                    tracking_number: trackingNumber,
                    status: 'DISPATCHED',
                    delivery_method: 'COURIER'
                })
                .eq('id', orderId);

            if (error) {
                console.error(`[Delivery Domain] Failed to update tracking info for order: ${orderId}`, error);
                throw error;
            }
            console.log(`[Delivery Domain] Courier tracking initiated. Order: ${orderId}, Tracking: ${trackingNumber}`);
        }
        else {
            console.error(`[Delivery Domain] Unknown delivery method: ${deliveryMethod}`);
            return NextResponse.json({ error: 'Invalid delivery method' }, { status: 400 });
        }

        return NextResponse.json({ status: 'success', orderId }, { status: 200 });

    } catch (error) {
        console.error('[Delivery Domain] Delivery processing exception occurred:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
