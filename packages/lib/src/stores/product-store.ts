import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

interface ProductState {
    products: Product[];
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    removeProduct: (id: string) => void;
    getProductsByFarm: (farmId: string) => Product[];
    getActiveProducts: () => Product[];
}

export const useProductStore = create<ProductState>()(
    persist(
        (set, get) => ({
            products: MOCK_PRODUCTS,
            addProduct: (product) =>
                set((state) => ({ products: [...state.products, product] })),
            updateProduct: (id, updates) =>
                set((state) => ({
                    products: state.products.map((p) =>
                        p.id === id ? { ...p, ...updates } : p
                    ),
                })),
            removeProduct: (id) =>
                set((state) => ({
                    products: state.products.filter((p) => p.id !== id),
                })),
            getProductsByFarm: (farmId) =>
                get().products.filter((p) => p.farmId === farmId),
            getActiveProducts: () =>
                get().products.filter((p) => p.status === 'ACTIVE'),
        }),
        {
            name: 'product-storage',
        }
    )
);
