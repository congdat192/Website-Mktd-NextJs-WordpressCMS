'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    X,
    Heart,
    Star,
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
    Check,
    Minus,
    Plus,
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

interface QuickViewModalProps {
    product: {
        id: number;
        slug: string;
        title: { rendered: string };
        content?: { rendered: string };
        excerpt?: { rendered: string };
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
            }>;
            gallery_images?: Array<{ src: string; alt: string }>;
            variations?: ProductVariant[];
        };
    };
    isOpen: boolean;
    onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addItem } = useCart();
    const { showToast } = useToast();

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentImageIndex(0);
            setSelectedVariant(null);
            setQuantity(1);
        }
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const mainImage = product._embedded?.['wp:featuredmedia']?.[0];
    const galleryImages = product.wc_data?.gallery_images || [];
    const variations = product.wc_data?.variations || [];
    const currentVariant = selectedVariant || (variations.length > 0 ? variations[0] : null);

    // Build all images
    const allImages = [
        ...(mainImage ? [{ src: mainImage.source_url, alt: mainImage.alt_text || '' }] : []),
        ...galleryImages,
    ];

    // Pricing
    const hasPrice = product.wc_data?.price;
    const isOnSale = product.wc_data?.on_sale;
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

    // Rating
    const rating = parseFloat(product.wc_data?.average_rating || '0');
    const ratingCount = product.wc_data?.rating_count || 0;

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

    // Get unique sizes from variations
    const uniqueSizes = variations.reduce((acc, v) => {
        const sizeOption = v.attributes.find(a =>
            a.name.toLowerCase().includes('size') ||
            a.name.toLowerCase().includes('kích')
        );
        if (sizeOption && !acc.some(s => s.option === sizeOption.option)) {
            acc.push({ option: sizeOption.option, variant: v });
        }
        return acc;
    }, [] as Array<{ option: string; variant: ProductVariant }>);

    const productName = product.title.rendered.replace(/&amp;/g, '&');
    const stockStatus = currentVariant?.stock_status || product.wc_data?.stock_status || 'instock';

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            productId: product.id,
            name: productName,
            slug: product.slug,
            price: currentPrice,
            image: currentVariant?.image?.src || mainImage?.source_url || '',
            sku: product.wc_data?.sku,
        });
        showToast({ type: 'success', message: 'Đã thêm vào giỏ hàng!' });
        onClose();
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Image Gallery */}
                    <div className="p-6 space-y-4">
                        <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                            {allImages.length > 0 ? (
                                <Image
                                    src={allImages[currentImageIndex]?.src || ''}
                                    alt={allImages[currentImageIndex]?.alt || productName}
                                    fill
                                    className="object-contain p-4"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}

                            {/* Navigation Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {allImages.slice(0, 4).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${currentImageIndex === idx
                                            ? 'border-primary'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <Image
                                            src={img.src}
                                            alt={img.alt}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6 space-y-5 border-l">
                        {/* Name */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {productName}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                SKU: {product.wc_data?.sku || product.slug.toUpperCase()}
                            </p>
                        </div>

                        {/* Rating */}
                        {ratingCount > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-4 w-4 ${star <= Math.round(rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                    ({ratingCount} đánh giá)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-primary">
                                {currentPrice.toLocaleString('vi-VN')}₫
                            </span>
                            {originalPrice > currentPrice && (
                                <span className="text-lg text-gray-400 line-through">
                                    {originalPrice.toLocaleString('vi-VN')}₫
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {product.excerpt?.rendered && (
                            <div
                                className="text-gray-600 text-sm line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: product.excerpt.rendered }}
                            />
                        )}

                        {/* Variant Selection */}
                        <div className="space-y-4 border-t pt-4">
                            <h4 className="font-semibold text-gray-900">Tùy chọn sản phẩm:</h4>

                            {/* Color Options */}
                            {uniqueColors.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Màu sắc:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {uniqueColors.map(({ option, variant }) => (
                                            <button
                                                key={option}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition ${currentVariant?.id === variant.id
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                            >
                                                <div
                                                    className="w-4 h-4 rounded-full border"
                                                    style={{ backgroundColor: getColorCode(option) }}
                                                />
                                                <span className="text-sm">{option}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Options */}
                            {uniqueSizes.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Kích cỡ:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {uniqueSizes.map(({ option, variant }) => (
                                            <button
                                                key={option}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`px-3 py-2 border rounded-lg transition ${currentVariant?.id === variant.id
                                                    ? 'border-primary bg-primary text-white'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Số lượng:</label>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border border-gray-200 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 hover:bg-gray-50 transition"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-2 hover:bg-gray-50 transition"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <span className="text-sm">
                                    {stockStatus === 'instock' ? (
                                        <span className="text-green-600 flex items-center gap-1">
                                            <Check className="h-4 w-4" /> Còn hàng
                                        </span>
                                    ) : (
                                        <span className="text-red-500">Hết hàng</span>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={stockStatus === 'outofstock'}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition ${stockStatus === 'outofstock'
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-primary text-white hover:bg-primary/90'
                                    }`}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Thêm vào giỏ hàng
                            </button>
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={`p-3 border rounded-lg transition ${isWishlisted
                                    ? 'border-red-500 text-red-500 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        {/* View Full Details Link */}
                        <div className="text-center pt-2">
                            <Link
                                href={`/${product.slug}`}
                                className="text-primary hover:underline text-sm font-medium"
                            >
                                Xem chi tiết sản phẩm →
                            </Link>
                        </div>
                    </div>
                </div>
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
        'nâu': '#8B4513',
        'brown': '#8B4513',
        'xanh': '#0066CC',
        'blue': '#0066CC',
        'navy': '#000080',
        'đỏ': '#DC2626',
        'red': '#DC2626',
        'vàng': '#F59E0B',
        'yellow': '#F59E0B',
        'hồng': '#EC4899',
        'pink': '#EC4899',
        'tím': '#8B5CF6',
        'purple': '#8B5CF6',
        'xanh lá': '#22C55E',
        'green': '#22C55E',
    };

    const lowerName = colorName.toLowerCase();
    for (const [key, value] of Object.entries(colorMap)) {
        if (lowerName.includes(key)) {
            return value;
        }
    }
    return '#9CA3AF';
}
