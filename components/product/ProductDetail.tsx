'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Share2,
    ShieldCheck,
    Truck,
    RefreshCw,
    Award,
    Star,
    Check,
    Minus,
    Plus
} from 'lucide-react';
import { ProductCTAButtons } from './ProductCTAButtons';

interface ProductImage {
    src: string;
    alt: string;
}

interface ProductAttribute {
    name: string;
    options: string[];
    slug?: string;
}

interface ProductVariation {
    id: number;
    name: string;
    price: string;
    regular_price: string;
    sale_price: string;
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

interface ProductDetailProps {
    product: {
        id: number;
        slug: string;
        title: { rendered: string };
        content: { rendered: string };
        excerpt: { rendered: string };
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
            attributes?: ProductAttribute[];
            gallery_images?: ProductImage[];
            variations?: ProductVariation[];
        };
    };
    relatedProducts?: Array<{
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
            sale_price?: string;
        };
    }>;
}

export function ProductDetail({ product, relatedProducts = [] }: ProductDetailProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'warranty'>('description');

    // Get variations
    const variations = product.wc_data?.variations || [];

    // Get all product images including from selected variation
    const mainImage = product._embedded?.['wp:featuredmedia']?.[0];
    const galleryImages = product.wc_data?.gallery_images || [];

    // Build images array - if variation selected and has image, show it first
    const variationImage = selectedVariation?.image;
    const allImages: ProductImage[] = [
        ...(variationImage ? [{ src: variationImage.src, alt: variationImage.alt }] : []),
        ...(mainImage && !variationImage ? [{ src: mainImage.source_url, alt: mainImage.alt_text || product.title.rendered }] : []),
        ...galleryImages,
        // Add variation images to gallery
        ...variations
            .filter(v => v.image && v.id !== selectedVariation?.id)
            .map(v => ({ src: v.image!.src, alt: v.image!.alt }))
    ];

    // Get color attribute if exists
    const colorAttr = product.wc_data?.attributes?.find(attr =>
        attr.name.toLowerCase().includes('màu') ||
        attr.slug?.toLowerCase().includes('color') ||
        attr.slug?.toLowerCase().includes('mau')
    );

    // Pricing
    const hasPrice = product.wc_data?.price;
    const isOnSale = product.wc_data?.on_sale && product.wc_data?.sale_price;
    const currentPrice = isOnSale
        ? parseInt(product.wc_data!.sale_price)
        : hasPrice
            ? parseInt(product.wc_data!.price)
            : 0;
    const originalPrice = isOnSale ? parseInt(product.wc_data!.regular_price) : 0;
    const discountPercent = isOnSale ? Math.round((1 - currentPrice / originalPrice) * 100) : 0;

    // Rating
    const rating = parseFloat(product.wc_data?.average_rating || '0');
    const ratingCount = product.wc_data?.rating_count || 0;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % Math.max(allImages.length, 1));
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + Math.max(allImages.length, 1)) % Math.max(allImages.length, 1));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-primary transition">Trang chủ</Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <Link href="/products" className="text-gray-500 hover:text-primary transition">Sản phẩm</Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-medium truncate max-w-[200px]">
                            {product.title.rendered.replace(/&amp;/g, '&')}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Main Product Section */}
            <div className="container mx-auto px-4 py-6 lg:py-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm group">
                            <div className="aspect-square relative">
                                {allImages.length > 0 ? (
                                    <Image
                                        src={allImages[currentImageIndex]?.src || ''}
                                        alt={allImages[currentImageIndex]?.alt || product.title.rendered}
                                        fill
                                        className="object-contain p-4"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}

                                {/* Sale Badge */}
                                {isOnSale && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        -{discountPercent}%
                                    </div>
                                )}

                                {/* Wishlist & Share */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`p-2.5 rounded-full shadow-md transition-all
                                            ${isWishlisted
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white text-gray-600 hover:text-red-500'}`}
                                    >
                                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                    </button>
                                    <button className="p-2.5 bg-white rounded-full shadow-md text-gray-600 hover:text-primary transition">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Navigation Arrows */}
                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md 
                                                     opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md
                                                     opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        {allImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition
                                            ${currentImageIndex === idx
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <Image
                                            src={img.src}
                                            alt={img.alt}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="space-y-6">
                        {/* Title & SKU */}
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                {product.title.rendered.replace(/&amp;/g, '&')}
                            </h1>
                            <p className="text-gray-500 text-sm mt-2">
                                SKU: {product.wc_data?.sku || product.slug.toUpperCase()}
                            </p>
                        </div>

                        {/* Rating */}
                        {ratingCount > 0 && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-5 h-5 ${star <= Math.round(rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {rating.toFixed(1)} ({ratingCount} đánh giá)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            {hasPrice ? (
                                <>
                                    <span className="text-3xl lg:text-4xl font-bold text-primary">
                                        {currentPrice.toLocaleString('vi-VN')}₫
                                    </span>
                                    {isOnSale && (
                                        <span className="text-xl text-gray-400 line-through">
                                            {originalPrice.toLocaleString('vi-VN')}₫
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-3xl lg:text-4xl font-bold text-primary">Liên hệ</span>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                <span>Hàng chính hãng 100%</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Truck className="w-5 h-5 text-primary" />
                                <span>Miễn phí vận chuyển</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <RefreshCw className="w-5 h-5 text-primary" />
                                <span>Đổi trả trong 7 ngày</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Award className="w-5 h-5 text-primary" />
                                <span>Bảo hành 12 tháng</span>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Color/Variation Selection */}
                        {colorAttr && colorAttr.options.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Màu sắc: <span className="font-normal text-gray-600">
                                        {selectedVariation
                                            ? selectedVariation.attributes.find(a => a.name.toLowerCase().includes('màu'))?.option || colorAttr.options[0]
                                            : colorAttr.options[0]}
                                    </span>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {colorAttr.options.map((option, idx) => {
                                        // Find variation with this color
                                        const matchingVariation = variations.find(v =>
                                            v.attributes.some(a =>
                                                a.name.toLowerCase().includes('màu') && a.option === option
                                            )
                                        );
                                        const isSelected = selectedVariation
                                            ? selectedVariation.attributes.some(a => a.option === option)
                                            : idx === 0;

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    if (matchingVariation) {
                                                        setSelectedVariation(matchingVariation);
                                                        setCurrentImageIndex(0); // Reset to show variation image
                                                    }
                                                }}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all
                                                    ${isSelected
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-gray-200 text-gray-700 hover:border-primary/50'}`}
                                            >
                                                {matchingVariation?.image && (
                                                    <Image
                                                        src={matchingVariation.image.src}
                                                        alt={option}
                                                        width={24}
                                                        height={24}
                                                        className="rounded-sm object-cover"
                                                    />
                                                )}
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Số lượng</h3>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border border-gray-200 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {product.wc_data?.stock_status === 'instock' ? (
                                        <span className="text-green-600 flex items-center gap-1">
                                            <Check className="w-4 h-4" /> Còn hàng
                                        </span>
                                    ) : (
                                        <span className="text-red-500">Hết hàng</span>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="pt-4">
                            <ProductCTAButtons
                                product={{
                                    id: product.id,
                                    productId: product.id,
                                    name: product.title.rendered.replace(/&amp;/g, '&'),
                                    slug: product.slug,
                                    price: currentPrice,
                                    image: mainImage?.source_url || '',
                                    sku: product.wc_data?.sku,
                                }}
                                variant="desktop"
                            />
                        </div>

                        {/* Hotline */}
                        <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-4 border border-primary/10">
                            <p className="text-sm text-gray-600 mb-1">Cần tư vấn? Gọi ngay hotline:</p>
                            <a href="tel:0901234567" className="text-xl font-bold text-primary hover:underline">
                                📞 090 123 4567
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details Tabs */}
            <div className="bg-white border-t">
                <div className="container mx-auto px-4 py-8 lg:py-12">
                    {/* Tabs */}
                    <div className="flex gap-1 border-b border-gray-200 mb-8">
                        {[
                            { key: 'description', label: 'Mô tả sản phẩm' },
                            { key: 'specs', label: 'Thông số kỹ thuật' },
                            { key: 'warranty', label: 'Bảo hành & Đổi trả' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors
                                    ${activeTab === tab.key
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="max-w-4xl">
                        {activeTab === 'description' && (
                            <div
                                className="prose prose-gray max-w-none"
                                dangerouslySetInnerHTML={{ __html: product.content.rendered || product.excerpt.rendered }}
                            />
                        )}

                        {activeTab === 'specs' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">Chất liệu</p>
                                        <p className="font-medium">Acetate cao cấp</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">Chiều rộng mắt kính</p>
                                        <p className="font-medium">52mm</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">Chiều dài cầu kính</p>
                                        <p className="font-medium">18mm</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">Chiều dài gọng</p>
                                        <p className="font-medium">145mm</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">Xuất xứ</p>
                                        <p className="font-medium">Hàn Quốc</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">Giới tính</p>
                                        <p className="font-medium">Unisex</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'warranty' && (
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Award className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Bảo hành 12 tháng</h4>
                                        <p className="text-gray-600">
                                            Bảo hành miễn phí cho các lỗi từ nhà sản xuất. Hỗ trợ sửa chữa, thay thế linh kiện với chi phí ưu đãi.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <RefreshCw className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Đổi trả trong 7 ngày</h4>
                                        <p className="text-gray-600">
                                            Hoàn tiền 100% nếu sản phẩm không đúng mô tả hoặc có lỗi. Vui lòng giữ nguyên tem mác và hóa đơn mua hàng.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="bg-gray-50 border-t">
                    <div className="container mx-auto px-4 py-10 lg:py-14">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Sản phẩm liên quan</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                            {relatedProducts.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/${item.slug}`}
                                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                                >
                                    <div className="aspect-square relative bg-gray-100">
                                        {item._embedded?.['wp:featuredmedia']?.[0] && (
                                            <Image
                                                src={item._embedded['wp:featuredmedia'][0].source_url}
                                                alt={item.title.rendered}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-primary transition mb-2">
                                            {item.title.rendered.replace(/&amp;/g, '&')}
                                        </h3>
                                        <p className="text-primary font-bold">
                                            {item.wc_data?.price
                                                ? `${parseInt(item.wc_data.sale_price || item.wc_data.price).toLocaleString('vi-VN')}₫`
                                                : 'Liên hệ'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Sticky CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
                <ProductCTAButtons
                    product={{
                        id: product.id,
                        productId: product.id,
                        name: product.title.rendered.replace(/&amp;/g, '&'),
                        slug: product.slug,
                        price: currentPrice,
                        image: mainImage?.source_url || '',
                        sku: product.wc_data?.sku,
                    }}
                    variant="mobile"
                />
            </div>
        </div>
    );
}
