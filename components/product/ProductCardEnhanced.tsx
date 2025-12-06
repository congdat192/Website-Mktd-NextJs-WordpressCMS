'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Heart,
    Eye,
    Star,
    ShoppingBag,
    Zap,
    TrendingUp,
    Award,
    Check,
    Palette,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';

interface ProductVariant {
    id: number;
    name: string;
    price: number;
    regular_price?: number;
    sale_price?: number;
    stock_status: string;
    image?: {
        src: string;
        alt: string;
    };
    attributes: Array<{
        name: string;
        option: string;
    }>;
}

interface ProductCardEnhancedProps {
    product: {
        id: number;
        slug: string;
        title: { rendered: string };
        _embedded?: {
            'wp:featuredmedia'?: Array<{
                source_url: string;
                alt_text?: string;
            }>;
        };
        wc_data?: {
            price: string;
            regular_price: string;
            sale_price: string;
            on_sale: boolean;
            sku: string;
            stock_status: string;
            average_rating: string;
            rating_count: number;
            attributes?: Array<{
                name: string;
                options: string[];
                slug?: string;
            }>;
            gallery_images?: Array<{ src: string; alt: string }>;
            variations?: ProductVariant[];
        };
    };
    isNew?: boolean;
    isBestseller?: boolean;
    isPremium?: boolean;
    onQuickView?: () => void;
}

export function ProductCardEnhanced({
    product,
    isNew = false,
    isBestseller = false,
    isPremium = false,
    onQuickView,
}: ProductCardEnhancedProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const { addItem } = useCart();
    const { showToast } = useToast();

    // Get main image
    const mainImage = product._embedded?.['wp:featuredmedia']?.[0];
    const variations = product.wc_data?.variations || [];

    // Get current variant or default
    const currentVariant = selectedVariant || (variations.length > 0 ? variations[0] : null);

    // Pricing
    const hasPrice = product.wc_data?.price;
    const isOnSale = product.wc_data?.on_sale && product.wc_data?.sale_price;
    const currentPrice = currentVariant
        ? parseInt(currentVariant.sale_price?.toString() || currentVariant.price?.toString() || '0')
        : isOnSale
            ? parseInt(product.wc_data!.sale_price)
            : hasPrice
                ? parseInt(product.wc_data!.price)
                : 0;
    const originalPrice = currentVariant?.regular_price
        ? parseInt(currentVariant.regular_price.toString())
        : isOnSale
            ? parseInt(product.wc_data!.regular_price)
            : 0;
    const discountPercent = originalPrice > 0 && currentPrice < originalPrice
        ? Math.round((1 - currentPrice / originalPrice) * 100)
        : 0;

    // Rating
    const rating = parseFloat(product.wc_data?.average_rating || '0');
    const ratingCount = product.wc_data?.rating_count || 0;

    // Stock status
    const stockStatus = currentVariant?.stock_status || product.wc_data?.stock_status || 'instock';

    // Get color attribute
    const colorAttr = product.wc_data?.attributes?.find(attr =>
        attr.name.toLowerCase().includes('màu') ||
        attr.slug?.toLowerCase().includes('color') ||
        attr.slug?.toLowerCase().includes('mau')
    );

    // Get unique colors from variations
    const uniqueColors = variations.reduce((acc, v) => {
        const colorOption = v.attributes.find(a =>
            a.name.toLowerCase().includes('màu') ||
            a.name.toLowerCase().includes('color')
        );
        if (colorOption && !acc.some(c => c.option === colorOption.option)) {
            acc.push({ option: colorOption.option, variant: v });
        }
        return acc;
    }, [] as Array<{ option: string; variant: ProductVariant }>);

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            productId: product.id,
            name: product.title.rendered.replace(/&amp;/g, '&'),
            slug: product.slug,
            price: currentPrice,
            image: currentVariant?.image?.src || mainImage?.source_url || '',
            sku: product.wc_data?.sku,
        });
        showToast({ type: 'success', message: 'Đã thêm vào giỏ hàng!' });
    };

    const productName = product.title.rendered.replace(/&amp;/g, '&');

    return (
        <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
            {/* Image Container */}
            <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Badges */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                    {isNew && (
                        <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            <Star className="h-3 w-3" />
                            Mới
                        </span>
                    )}
                    {isBestseller && (
                        <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            <TrendingUp className="h-3 w-3" />
                            Bán chạy
                        </span>
                    )}
                    {isPremium && (
                        <span className="inline-flex items-center gap-1 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            <Award className="h-3 w-3" />
                            Cao cấp
                        </span>
                    )}
                </div>

                {/* Sale Badge */}
                {discountPercent > 0 && (
                    <span className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        <Zap className="h-3 w-3" />
                        -{discountPercent}%
                    </span>
                )}

                {/* Product Image */}
                <Link href={`/${product.slug}`}>
                    {mainImage?.source_url ? (
                        <Image
                            src={currentVariant?.image?.src || mainImage.source_url}
                            alt={mainImage.alt_text || productName}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </Link>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {onQuickView && (
                            <button
                                onClick={onQuickView}
                                className="flex items-center gap-1.5 bg-white text-gray-900 px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-gray-100 transition"
                            >
                                <Eye className="h-4 w-4" />
                                Xem nhanh
                            </button>
                        )}
                        <button
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className={`p-2.5 rounded-lg shadow-lg transition ${isWishlisted
                                ? 'bg-red-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Stock Status */}
                {stockStatus !== 'instock' && (
                    <div className="absolute bottom-3 left-3 z-20">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${stockStatus === 'outofstock'
                            ? 'bg-gray-500 text-white'
                            : 'bg-orange-500 text-white'
                            }`}>
                            {stockStatus === 'outofstock' ? 'Hết hàng' : 'Sắp hết'}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Product Name */}
                <Link href={`/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors min-h-[48px]">
                        {productName}
                    </h3>
                </Link>

                {/* Variant Info */}
                {currentVariant && (
                    <p className="text-xs text-gray-500">
                        {currentVariant.attributes.map(a => a.option).join(' - ')}
                    </p>
                )}

                {/* Color Selection */}
                {uniqueColors.length > 1 && (
                    <div className="flex items-center gap-2">
                        <Palette className="h-3 w-3 text-gray-400" />
                        <div className="flex gap-1">
                            {uniqueColors.slice(0, 5).map(({ option, variant }) => (
                                <button
                                    key={option}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`w-5 h-5 rounded-full border-2 transition-all ${currentVariant?.id === variant.id
                                        ? 'border-primary ring-2 ring-primary/30'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    style={{
                                        backgroundColor: getColorCode(option),
                                    }}
                                    title={option}
                                />
                            ))}
                            {uniqueColors.length > 5 && (
                                <span className="text-xs text-gray-400 ml-1">
                                    +{uniqueColors.length - 5}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Rating */}
                {ratingCount > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-3 w-3 ${star <= Math.round(rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">
                            {rating.toFixed(1)} ({ratingCount})
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                    {hasPrice ? (
                        <>
                            <span className="text-lg font-bold text-primary">
                                {currentPrice.toLocaleString('vi-VN')}₫
                            </span>
                            {originalPrice > currentPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                    {originalPrice.toLocaleString('vi-VN')}₫
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-lg font-bold text-primary">Liên hệ</span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={stockStatus === 'outofstock'}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${stockStatus === 'outofstock'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'
                        }`}
                >
                    {stockStatus === 'outofstock' ? (
                        'Hết hàng'
                    ) : (
                        <>
                            <ShoppingBag className="h-4 w-4" />
                            Thêm vào giỏ
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

// Helper function to get color code from color name
function getColorCode(colorName: string): string {
    const colorMap: Record<string, string> = {
        'đen': '#000000',
        'black': '#000000',
        'trắng': '#FFFFFF',
        'white': '#FFFFFF',
        'xám': '#808080',
        'gray': '#808080',
        'grey': '#808080',
        'nâu': '#8B4513',
        'brown': '#8B4513',
        'tortoise': '#8B4513',
        'xanh': '#0066CC',
        'blue': '#0066CC',
        'navy': '#000080',
        'đỏ': '#DC2626',
        'red': '#DC2626',
        'vàng': '#F59E0B',
        'yellow': '#F59E0B',
        'gold': '#D4AF37',
        'hồng': '#EC4899',
        'pink': '#EC4899',
        'tím': '#8B5CF6',
        'purple': '#8B5CF6',
        'xanh lá': '#22C55E',
        'green': '#22C55E',
        'cam': '#F97316',
        'orange': '#F97316',
        'bạc': '#C0C0C0',
        'silver': '#C0C0C0',
    };

    const lowerName = colorName.toLowerCase();
    for (const [key, value] of Object.entries(colorMap)) {
        if (lowerName.includes(key)) {
            return value;
        }
    }
    return '#9CA3AF'; // Default gray
}
