"use client";

import { useProductStore } from "@greenlink/lib";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
    Button, Badge,
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@greenlink/ui";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ProductForm } from "@/components/Product/ProductForm";

export default function ProductsPage() {
    const { products, removeProduct } = useProductStore();
    const [mounted, setMounted] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">상품 관리</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                            <Plus className="w-4 h-4 mr-2" /> 상품 등록
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>새 상품 등록</DialogTitle>
                            <DialogDescription>
                                판매할 농산물의 정보를 입력해주세요.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <ProductForm onSuccess={() => setIsDialogOpen(false)} />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">이미지</TableHead>
                            <TableHead>상품명</TableHead>
                            <TableHead>가격</TableHead>
                            <TableHead>재고</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead className="text-right">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xl">
                                        {product.images[0] || '📦'}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.price.toLocaleString()}원</TableCell>
                                <TableCell>{product.stock}개</TableCell>
                                <TableCell>
                                    <Badge variant={product.stock > 0 ? "default" : "secondary"} className={product.stock > 0 ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
                                        {product.stock > 0 ? "판매중" : "품절"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => {
                                                if (confirm('정말 삭제하시겠습니까?')) removeProduct(product.id);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
