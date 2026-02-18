
import { ApiClient } from '../client';

export interface PaymentTransaction {
    paymentKey: string;
    orderId: string;
    amount: number;
    status: 'READY' | 'IN_PROGRESS' | 'WAITING_FOR_DEPOSIT' | 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED';
    requestedAt: string;
    approvedAt: string | null;
}

export class TossPaymentsClient extends ApiClient {
    constructor(secretKey: string) {
        super('https://api.tosspayments.com/v1', {
            headers: {
                Authorization: `Basic ${btoa(secretKey + ':')}`,
            },
        });
    }

    async getPayment(paymentKey: string): Promise<PaymentTransaction> {
        return this.get<PaymentTransaction>(`/payments/${paymentKey}`);
    }

    async cancelPayment(paymentKey: string, cancelReason: string): Promise<PaymentTransaction> {
        return this.post<PaymentTransaction>(`/payments/${paymentKey}/cancel`, { cancelReason });
    }
}
