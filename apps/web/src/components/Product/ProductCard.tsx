"use client";

import { Card } from "@greenlink/ui";
import { Product } from "@greenlink/lib/types";
import { cn } from "@greenlink/ui";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";



interface ProductCardProps {
    product: Product;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const defaultPlaceholder = "/images/placeholder.svg"; // 로컬 정적 파일 (외부 CDN 불필요)
    const [imgSrc, setImgSrc] = useState(product.images?.[0] || "");
    const [imgError, setImgError] = useState(false);

    return (
        <Link href={`/product/${product.id}`} className={cn("block", className)}>
            <Card className="overflow-hidden border-none shadow-none hover:shadow-sm transition-shadow">
                <div className="aspect-square bg-slate-50 relative rounded-xl mb-2 flex items-center justify-center text-4xl border border-slate-100/50">
                    {/* Fallback pattern for broken image links */}
                    {imgSrc && !imgError ? (
                        <Image
                            src={imgSrc}
                            alt={product.name}
                            fill
                            className="object-cover rounded-xl"
                            onError={() => {
                                setImgError(true);
                                setImgSrc(defaultPlaceholder);
                            }}
                        />
                    ) : (
                        <Image
                            src={defaultPlaceholder}
                            alt="Fallback placeholder"
                            fill
                            className="object-cover rounded-xl opacity-80"
                        />
                    )}
                </div>
                <div className="space-y-1.5 px-1">
                    <p className="text-[11px] text-gray-400 font-medium">{product.farmId} {/* Resolve farm name later via store or prop */}</p>
                    <h3 className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-snug">{product.name}</h3>
                    <div className="flex flex-col gap-0">
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[11px] text-gray-400 line-through">{product.originalPrice.toLocaleString()}원</span>
                        )}
                        <span className="text-[15px] font-extrabold text-gray-900">{product.price.toLocaleString()}원</span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
