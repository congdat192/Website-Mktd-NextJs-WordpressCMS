'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { formatPrice } from '@/lib/utils';

interface ProductAttribute {
    name: string;
    options: string[];
}

interface ProductVariation {
    id: number;
    price: string;
    regularPrice: string;
    salePrice: string;
    stockStatus: string;
    attributes: Array<{
        name: string;
        option: string;
    }>;
}

interface ProductActionsProps {
    product: {
        id: number;
        databaseId: number;
        name: string;
        slug: string;
        price: number;
        regularPrice?: number;
        image: string;
        sku?: string;
        stockStatus: string;
        description?: string;
        shortDescription?: string;
        attributes?: ProductAttribute[];
        variations?: ProductVariation[];
    };
}

export function ProductActions({ product }: ProductActionsProps) {
    const { addItem, items } = useCart();
    const { showToast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    const isInStock = product.stockStatus === 'IN_STOCK' || product.stockStatus === 'instock';
    const isInCart = items.some(item => item.productId === product.databaseId);

    const handleAttributeChange = (attributeName: string, value: string) => {
        setSelectedAttributes(prev => ({
            ...prev,
            [attributeName]: value,
        }));
    };

    const handleAddToCart = async () => {
        if (!isInStock) return;

        setIsAdding(true);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Generate unique ID based on product + variations
        const variationKey = Object.entries(selectedAttributes)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}:${v}`)
            .join('|');

        const uniqueId = variationKey
            ? `${product.databaseId}-${variationKey}`.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)
            : product.databaseId;

        addItem({
            id: Math.abs(uniqueId),
            productId: product.databaseId,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.image,
            sku: product.sku,
            attributes: selectedAttributes,
        });

        // Add multiple times based on quantity
        for (let i = 1; i < quantity; i++) {
            addItem({
                id: Math.abs(uniqueId),
                productId: product.databaseId,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.image,
                sku: product.sku,
                attributes: selectedAttributes,
            });
        }

        setIsAdding(false);
        setIsAdded(true);

        showToast({
            type: 'success',
            message: `Đã thêm ${quantity} "${product.name}" vào giỏ hàng`,
        });

        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Price */}
            <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#228B22]">
                    {formatPrice(product.price)}
                </span>
                {product.regularPrice && product.regularPrice > product.price && (
                    <span className="text-lg text-[#666666] line-through">
                        {formatPrice(product.regularPrice)}
                    </span>
                )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isInStock ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                    {isInStock ? 'Còn hàng' : 'Hết hàng'}
                </span>
                {product.sku && (
                    <span className="text-sm text-[#666666]">• SKU: {product.sku}</span>
                )}
            </div>

            {/* Attributes/Variations */}
            {product.attributes && product.attributes.length > 0 && (
                <div className="space-y-4">
                    {product.attributes.map((attr) => (
                        <div key={attr.name}>
                            <label className="block text-sm font-medium text-[#333333] mb-2">
                                {attr.name}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {attr.options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleAttributeChange(attr.name, option)}
                                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${selectedAttributes[attr.name] === option
                                                ? 'border-[#228B22] bg-[#228B22]/10 text-[#228B22]'
                                                : 'border-[#E5E5E5] hover:border-[#228B22]/50'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quantity */}
            <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                    Số lượng
                </label>
                <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#E5E5E5] rounded-lg">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center hover:bg-[#F5F5F5] transition"
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-14 h-10 text-center border-x border-[#E5E5E5] outline-none"
                            min="1"
                        />
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-[#F5F5F5] transition"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={!isInStock || isAdding}
                    className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-lg font-bold text-base transition ${!isInStock
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : isAdded
                                ? 'bg-green-500 text-white'
                                : 'bg-[#228B22]/20 text-[#228B22] hover:bg-[#228B22]/30'
                        }`}
                >
                    {isAdding ? (
                        <span className="animate-pulse">Đang thêm...</span>
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
                    href="/checkout"
                    className={`flex-1 flex items-center justify-center h-14 rounded-lg font-bold text-base transition ${isInStock
                            ? 'bg-[#228B22] text-white hover:bg-[#1a6b1a]'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
                        }`}
                    onClick={(e) => {
                        if (!isInStock) {
                            e.preventDefault();
                            return;
                        }
                        // Add to cart before going to checkout
                        handleAddToCart();
                    }}
                >
                    Mua ngay
                </Link>
            </div>

            {/* Wishlist & Share */}
            <div className="flex gap-4 pt-4 border-t border-[#E5E5E5]">
                <button className="flex items-center gap-2 text-[#666666] hover:text-[#228B22] transition">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">Yêu thích</span>
                </button>
                <button className="flex items-center gap-2 text-[#666666] hover:text-[#228B22] transition">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">Chia sẻ</span>
                </button>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
                <div className="pt-4 border-t border-[#E5E5E5]">
                    <button
                        onClick={() => setShowDescription(!showDescription)}
                        className="flex items-center justify-between w-full text-left"
                    >
                        <span className="font-medium text-[#333333]">Mô tả ngắn</span>
                        {showDescription ? (
                            <ChevronUp className="w-5 h-5 text-[#666666]" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-[#666666]" />
                        )}
                    </button>
                    {showDescription && (
                        <div
                            className="mt-3 text-sm text-[#666666] prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                        />
                    )}
                </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="flex items-center gap-2 p-3 bg-[#F5F5F5] rounded-lg">
                    <svg className="w-5 h-5 text-[#228B22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-[#666666]">Chính hãng 100%</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-[#F5F5F5] rounded-lg">
                    <svg className="w-5 h-5 text-[#228B22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs text-[#666666]">Bảo hành 12 tháng</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-[#F5F5F5] rounded-lg">
                    <svg className="w-5 h-5 text-[#228B22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-xs text-[#666666]">Thanh toán an toàn</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-[#F5F5F5] rounded-lg">
                    <svg className="w-5 h-5 text-[#228B22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="text-xs text-[#666666]">Đổi trả 7 ngày</span>
                </div>
            </div>
        </div>
    );
}
