
import { ApiClient } from '../client';

export interface SmartStoreProduct {
    originProductNo: number;
    statusCode: 'SALE' | 'OUT_OF_STOCK' | 'STOP' | 'CLOSE';
    name: string;
    salePrice: number;
    stockQuantity: number;
}

export class NaverSmartStoreClient extends ApiClient {
    constructor(clientId: string, clientSecret: string) {
        super('https://api.commerce.naver.com/external/v1', {
            headers: {
                'Client-Id': clientId,
                'Client-Secret': clientSecret,
            },
        });
    }

    async getProducts(): Promise<SmartStoreProduct[]> {
        // Mock implementation for skeleton
        return this.get<SmartStoreProduct[]>('/products/search');
    }

    async syncProduct(product: SmartStoreProduct): Promise<void> {
        // Mock sync logic
        console.log(`Syncing product ${product.originProductNo} to SmartStore...`);
    }
}
