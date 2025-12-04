'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui';
import { useCart } from '@/hooks/useCart';
import type { WPProduct } from '@/lib/wordpress';
import { useState } from 'react';

interface AddToCartProps {
    product: WPProduct;
    variant?: 'default' | 'icon';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function AddToCart({ product, variant = 'default', size = 'md', className }: AddToCartProps) {
    const { addItem } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);

        // Get product image
        const image = product._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

        // Get product price
        const price = product.wc_data?.price
            ? parseFloat(product.wc_data.price)
            : 0;

        // Add to cart
        addItem({
            id: product.id,
            productId: product.id,
            name: product.title.rendered,
            slug: product.slug,
            price,
            image,
            sku: product.wc_data?.sku,
        });

        // Show feedback
        setTimeout(() => {
            setIsAdding(false);
        }, 500);
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`p-2 rounded-lg bg-[#228B22] text-white hover:bg-[#1a6b1a] transition disabled:opacity-50 ${className}`}
                aria-label="Thêm vào giỏ hàng"
            >
                <ShoppingCart className="w-5 h-5" />
            </button>
        );
    }

    return (
        <Button
            onClick={handleAddToCart}
            isLoading={isAdding}
            size={size}
            fullWidth
            className={className}
        >
            {isAdding ? (
                'Đang thêm...'
            ) : (
                <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Thêm vào giỏ
                </>
            )}
        </Button>
    );
}
