'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';

interface AddToCartButtonProps {
    product: {
        id: number;
        productId: number;
        name: string;
        slug: string;
        price: number;
        image: string;
        sku?: string;
        attributes?: {
            color?: string;
            size?: string;
            [key: string]: string | undefined;
        };
    };
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    showIcon?: boolean;
    className?: string;
}

export function AddToCartButton({
    product,
    variant = 'secondary',
    size = 'md',
    fullWidth = false,
    showIcon = true,
    className = '',
}: AddToCartButtonProps) {
    const { addItem } = useCart();
    const { showToast } = useToast();
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);

        // Simulate a slight delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));

        addItem({
            id: product.id,
            productId: product.productId,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.image,
            sku: product.sku,
            attributes: product.attributes,
        });

        setIsAdding(false);
        setIsAdded(true);

        showToast({
            type: 'success',
            message: `Đã thêm "${product.name}" vào giỏ hàng`,
        });

        // Reset the added state after 2 seconds
        setTimeout(() => {
            setIsAdded(false);
        }, 2000);
    };

    const sizeClasses = {
        sm: 'h-10 px-4 text-sm',
        md: 'h-12 px-5 text-base',
        lg: 'h-14 px-6 text-base',
    };

    const variantClasses = {
        primary: 'bg-[#228B22] text-white hover:bg-[#1a6b1a]',
        secondary: 'bg-[#228B22]/20 text-[#228B22] hover:bg-[#228B22]/30',
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`
                flex items-center justify-center gap-2 rounded-lg font-bold transition-all duration-200
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${fullWidth ? 'w-full' : ''}
                ${isAdding ? 'opacity-70 cursor-wait' : ''}
                ${isAdded ? 'bg-green-500 text-white' : ''}
                ${className}
            `}
        >
            {isAdding ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang thêm...</span>
                </>
            ) : isAdded ? (
                <>
                    <Check className="w-5 h-5" />
                    <span>Đã thêm!</span>
                </>
            ) : (
                <>
                    {showIcon && <ShoppingCart className="w-5 h-5" />}
                    <span>Thêm vào giỏ</span>
                </>
            )}
        </button>
    );
}
