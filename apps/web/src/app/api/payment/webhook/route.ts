import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { imp_uid, merchant_uid, status } = body;

        // 1. 필수 파라미터 검증
        if (!imp_uid || !merchant_uid) {
            console.error('[Payment Domain] Webhook Error: Missing imp_uid or merchant_uid');
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        // 2. PortOne API 인증 토큰 발급
        const portoneSecret = process.env.PORTONE_API_SECRET;
        const portoneKey = process.env.PORTONE_API_KEY;

        if (!portoneSecret || !portoneKey) {
            console.error('[Payment Domain] PortOne API credentials missing in environment');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const tokenResponse = await fetch('https://api.iamport.kr/users/getToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imp_key: portoneKey, imp_secret: portoneSecret })
        });

        if (!tokenResponse.ok) {
            console.error(`[Payment Domain] PortOne Token Issuance Failed. Status: ${tokenResponse.status}`);
            return NextResponse.json({ error: 'Token issuance failed' }, { status: 500 });
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.response.access_token;

        // 3. 결제 단건 조회 및 상태 검증 (서버사이드 대조)
        const paymentResponse = await fetch(`https://api.iamport.kr/payments/${imp_uid}`, {
            method: 'GET',
            headers: { 'Authorization': accessToken }
        });

        const paymentData = await paymentResponse.json();
        const paymentInfo = paymentData.response;

        if (paymentInfo.status !== 'paid') {
            console.warn(`[Payment Domain] Payment not complete. Current Status: ${paymentInfo.status}`);
            return NextResponse.json({ message: 'Payment is not in paid status' }, { status: 200 });
        }

        // 4. DB 트랜잭션 연동 (create_escrow_order_txn RPC 호출)
        // Webhook은 백그라운드 서버 투 서버 통신이므로 Service Role Key 사용
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // PortOne custom_data 필드를 통한 상품 메타데이터 파싱
        const customData = paymentInfo.custom_data ? JSON.parse(paymentInfo.custom_data) : {};

        const { data, error } = await supabase.rpc('create_escrow_order_txn', {
            p_product_id: customData.productId || 'UNKNOWN',
            p_buyer_name: paymentInfo.buyer_name,
            p_buyer_phone: paymentInfo.buyer_tel,
            p_buyer_address: paymentInfo.buyer_addr,
            p_quantity: customData.quantity || 1,
            p_total_price: paymentInfo.amount
        });

        if (error) {
            console.error('[Payment Domain] RPC Transaction Failed:', error);
            return NextResponse.json({ error: 'Database transaction failed' }, { status: 500 });
        }

        console.log(`[Payment Domain] Webhook Success. Order created: ${data}`);
        return NextResponse.json({ status: 'success', orderId: data }, { status: 200 });

    } catch (error) {
        console.error('[Payment Domain] Webhook Exception Occurred:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
