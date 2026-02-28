"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input } from "@greenlink/ui";
import { useProductStore } from "@greenlink/lib";

const productSchema = z.object({
    name: z.string().min(2, "상품명은 2글자 이상이어야 합니다."),
    price: z.coerce.number().min(100, "가격은 100원 이상이어야 합니다."),
    stock: z.coerce.number().min(0, "재고는 0개 이상이어야 합니다."),
    category: z.string().min(1, "카테고리를 선택해주세요."),
    description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    onSuccess: () => void;
}

export function ProductForm({ onSuccess }: ProductFormProps) {
    const { addProduct } = useProductStore();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            price: 0,
            stock: 0,
            category: "cat-cut",
            description: "",
        },
    });

    const onSubmit = (data: ProductFormValues) => {
        addProduct({
            id: `prod-${Date.now()}`,
            name: data.name,
            price: data.price,
            originalPrice: data.price * 1.2,
            stock: data.stock,
            category: data.category as "CUT" | "ORC" | "FOL" | "ETC",
            images: ["📦"],
            description: data.description || "상세 설명이 없습니다.",
            farmId: "farm-001",
            unit: '개',
            status: 'ACTIVE', // Default
            createdAt: new Date().toISOString(),
        });

        onSuccess();
        form.reset();
    };

    return (
        <Form {...(form as any)}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control as any}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>상품명</FormLabel>
                            <FormControl>
                                <Input placeholder="예: 맛있는 딸기" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <FormField
                        control={form.control as any}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>가격 (원)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="10000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control as any}
                        name="stock"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>재고 (개)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="100" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">등록하기</Button>
            </form>
        </Form>
    );
}
