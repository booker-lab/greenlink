"use client";

import { Card } from "@greenlink/ui";
import { Product } from "@greenlink/lib/types";
import { cn } from "@greenlink/ui";
import Link from "next/link";

interface ProductCardProps {
    product: Product;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    return (
        <Link href={`/product/${product.id}`} className={cn("block", className)}>
            <Card className="overflow-hidden border-none shadow-none hover:shadow-sm transition-shadow">
                <div className="aspect-square bg-gray-100 relative rounded-lg mb-2 flex items-center justify-center text-4xl">
                    {/* Using mock images or simple placeholders if no image */}
                    {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <span className="text-6xl">🌿</span> // Default placeholder
                    )}

                    {/* Badge for Eco/Local if needed */}
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-gray-500">{product.farmId} {/* Resolve farm name later via store or prop */}</p>
                    <h3 className="text-sm font-medium line-clamp-2 leading-tight">{product.name}</h3>
                    <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-gray-900">{product.price.toLocaleString()}원</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString()}원</span>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
}
