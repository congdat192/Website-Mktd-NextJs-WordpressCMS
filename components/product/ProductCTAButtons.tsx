'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';

interface ProductCTAButtonsProps {
    product: {
        id: number;
        productId: number;
        name: string;
        slug: string;
        price: number;
        image: string;
        sku?: string;
    };
    variant?: 'desktop' | 'mobile';
}

export function ProductCTAButtons({ product, variant = 'desktop' }: ProductCTAButtonsProps) {
    const { addItem } = useCart();
    const { showToast } = useToast();
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        await new Promise(resolve => setTimeout(resolve, 300));

        addItem({
            id: product.id,
            productId: product.productId,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.image,
            sku: product.sku,
        });

        setIsAdding(false);
        setIsAdded(true);

        showToast({
            type: 'success',
            message: `Đã thêm "${product.name}" vào giỏ hàng`,
        });

        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        // Navigation will happen via Link
    };

    if (variant === 'mobile') {
        return (
            <div className="flex items-center gap-4">
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`flex-1 flex items-center justify-center h-12 rounded-lg gap-2 font-bold text-base transition-colors ${isAdded
                            ? 'bg-green-500 text-white'
                            : 'bg-[#228B22]/20 text-[#228B22]'
                        }`}
                >
                    {isAdding ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isAdded ? (
                        <>
                            <Check className="w-5 h-5" />
                            Đã thêm
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-5 h-5" />
                            Thêm vào giỏ
                        </>
                    )}
                </button>
                <Link
                    href="/cart"
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center h-12 rounded-lg bg-[#228B22] text-white font-bold text-base"
                >
                    Mua ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-1 flex items-center justify-center h-14 rounded-lg gap-2 font-bold text-base transition-colors ${isAdded
                        ? 'bg-green-500 text-white'
                        : 'bg-[#228B22]/20 text-[#228B22] hover:bg-[#228B22]/30'
                    }`}
            >
                {isAdding ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : isAdded ? (
                    <>
                        <Check className="w-5 h-5" />
                        Đã thêm!
                    </>
                ) : (
                    <>
                        <ShoppingCart className="w-5 h-5" />
                        Thêm vào giỏ
                    </>
                )}
            </button>
            <Link
                href="/cart"
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center h-14 rounded-lg bg-[#228B22] text-white font-bold text-base hover:bg-[#1a6b1a] transition-colors"
            >
                Mua ngay
            </Link>
        </div>
    );
}
