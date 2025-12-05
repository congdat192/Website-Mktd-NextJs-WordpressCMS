'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Heart,
    Star,
    ShoppingCart,
    Share2,
    Plus,
    Minus,
    Shield,
    RefreshCw,
    CheckCircle2,
    Palette,
    Ruler,
    MapPin,
    ZoomIn,
    ChevronDown,
    ChevronUp,
    Gift,
    Truck,
    Phone,
    Clock,
    Award,
    Eye,
    Package,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface WPProduct {
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
        variations?: Array<{
            id: number;
            name: string;
            price: number;
            regular_price?: number;
            sale_price?: number;
            stock_status: string;
            image?: { src: string; alt: string };
            attributes: Array<{ name: string; option: string }>;
        }>;
    };
}

interface ProductDetailRedesignProps {
    product: WPProduct;
    relatedProducts?: WPProduct[];
}

export function ProductDetailRedesign({ product, relatedProducts = [] }: ProductDetailRedesignProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('description');
    const [showImageZoom, setShowImageZoom] = useState(false);

    const { addToCart } = useCart();

    // Get images
    const mainImage = product._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg';
    const galleryImages = product.wc_data?.gallery_images || [];
    const allImages = [mainImage, ...galleryImages.map(img => img.src)];

    // Get product data
    const price = parseInt(product.wc_data?.price || '0');
    const regularPrice = parseInt(product.wc_data?.regular_price || '0');
    const salePrice = parseInt(product.wc_data?.sale_price || '0');
    const isOnSale = product.wc_data?.on_sale;
    const discount = regularPrice > 0 && price < regularPrice
        ? Math.round(((regularPrice - price) / regularPrice) * 100)
        : 0;
    const rating = parseFloat(product.wc_data?.average_rating || '0');
    const reviewCount = product.wc_data?.rating_count || 0;
    const stockStatus = product.wc_data?.stock_status || 'instock';
    const sku = product.wc_data?.sku || '';

    // Get attributes
    const attributes = product.wc_data?.attributes || [];
    const colorAttr = attributes.find(a => a.name.toLowerCase().includes('màu') || a.name.toLowerCase().includes('color'));
    const sizeAttr = attributes.find(a => a.name.toLowerCase().includes('size') || a.name.toLowerCase().includes('kích'));

    // Get variations
    const variations = product.wc_data?.variations || [];

    // Find selected variation
    const selectedVariation = variations.find(v => {
        const colorMatch = !selectedColor || v.attributes.some(a => a.option === selectedColor);
        const sizeMatch = !selectedSize || v.attributes.some(a => a.option === selectedSize);
        return colorMatch && sizeMatch;
    });

    // Update image when variation changes
    const currentImage = selectedVariation?.image?.src || allImages[selectedImageIndex];

    // Format price
    const formatPrice = (p: number) => p.toLocaleString('vi-VN') + 'đ';

    // Handle add to cart
    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.title.rendered,
            price: selectedVariation?.price || price,
            image: currentImage,
            quantity,
            variant: selectedColor || selectedSize ? `${selectedColor || ''} ${selectedSize || ''}`.trim() : undefined,
        });
    };

    // Accordion items
    const commitments = [
        {
            id: 'warranty-30',
            icon: <RefreshCw className="w-4 h-4" />,
            title: 'Bảo hành 30 ngày',
            subtitle: 'Thay đổi độ kính',
            content: 'Miễn Phí thay đổi độ kính hoàn toàn miễn phí trong vòng 30 ngày từ ngày mua',
        },
        {
            id: 'warranty-1year',
            icon: <Shield className="w-4 h-4" />,
            title: 'Bảo hành 1 năm',
            subtitle: 'Lỗi kỹ thuật',
            content: 'Bảo hành toàn bộ lỗi kỹ thuật, lớp phủ, khuyết tật sản xuất trong 1 năm',
        },
        {
            id: 'transparency',
            icon: <CheckCircle2 className="w-4 h-4" />,
            title: 'Minh bạch sản phẩm',
            subtitle: 'Trả vỏ',
            content: 'Trả vỏ bao sau khi cắt, kiểm tra Logo nếu có để đảm bảo chính hãng',
        },
        {
            id: 'free-service',
            icon: <Gift className="w-4 h-4" />,
            title: 'Miễn phí',
            subtitle: 'Dịch vụ tư vấn',
            content: 'Kiểm tra thị lực, tư vấn chọn kính & hướng dẫn lắp kính hoàn toàn miễn phí',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
                        <span className="text-gray-300">/</span>
                        <Link href="/products" className="text-gray-500 hover:text-primary">Sản phẩm</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-900 font-medium truncate">{product.title.rendered}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Left: Images */}
                    <div className="lg:col-span-5 space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-white rounded-2xl overflow-hidden group shadow-sm">
                            <Image
                                src={currentImage}
                                alt={product.title.rendered}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <button
                                onClick={() => setShowImageZoom(true)}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            >
                                <ZoomIn className="w-5 h-5" />
                            </button>
                            {isOnSale && discount > 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    -{discount}%
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImageIndex(idx)}
                                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === idx
                                            ? 'border-primary ring-2 ring-primary/20'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Commitments Card - Desktop */}
                        <div className="hidden lg:block bg-white rounded-2xl border shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-bold text-primary">CAM KẾT SẢN PHẨM</span>
                                </div>
                            </div>
                            <div className="divide-y">
                                {commitments.map((item) => (
                                    <div key={item.id} className="border-b last:border-0">
                                        <button
                                            onClick={() => setExpandedAccordion(expandedAccordion === item.id ? null : item.id)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-green-50/50 transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white">
                                                    {item.icon}
                                                </div>
                                                <div className="text-left">
                                                    <span className="font-semibold">{item.title}</span>
                                                    <span className="text-gray-600"> – {item.subtitle}</span>
                                                </div>
                                            </div>
                                            {expandedAccordion === item.id ? (
                                                <ChevronUp className="w-4 h-4 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            )}
                                        </button>
                                        {expandedAccordion === item.id && (
                                            <div className="px-4 pb-4 pl-14 text-sm text-gray-600">
                                                {item.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Title */}
                        <div>
                            <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-2">
                                {product.title.rendered}
                            </h1>
                            {sku && <p className="text-sm text-gray-500">SKU: {sku}</p>}

                            {/* Rating */}
                            {rating > 0 && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${star <= Math.round(rating)
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">({reviewCount} đánh giá)</span>
                                </div>
                            )}
                        </div>

                        {/* Price Section */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <div className="grid grid-cols-2 gap-6 relative">
                                {/* Regular Price */}
                                <div className="pr-6 border-r border-gray-300">
                                    <div className="text-lg font-medium text-primary mb-2">Giá sản phẩm</div>
                                    <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                                        {formatPrice(selectedVariation?.price || price)}
                                    </div>
                                    {isOnSale && regularPrice > price && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-gray-500 line-through">
                                                {formatPrice(regularPrice)}
                                            </span>
                                            <span className="text-sm font-bold text-red-500">-{discount}%</span>
                                        </div>
                                    )}
                                    <div className="mt-2 bg-yellow-100 px-3 py-1 rounded-full inline-flex items-center">
                                        <span className="text-yellow-600 text-xs mr-1">⭐</span>
                                        <span className="text-xs text-yellow-700 font-bold">
                                            +{Math.round(price * 0.02).toLocaleString()} điểm
                                        </span>
                                    </div>
                                </div>

                                {/* Trade-in Price */}
                                <div className="pl-6">
                                    <div className="text-lg font-medium text-primary mb-2">Thu cũ đổi mới</div>
                                    <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                                        {formatPrice(Math.round(price * 0.7))}
                                    </div>
                                    <div className="text-sm text-red-500 font-medium mt-1">Trợ giá đến 500.000</div>
                                    <button className="text-sm text-blue-600 font-medium mt-2 hover:underline">
                                        Nhận tư vấn ngay
                                    </button>
                                </div>

                                {/* Divider label */}
                                <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2">
                                    <span className="text-gray-400 text-sm">hoặc</span>
                                </div>
                            </div>
                        </div>

                        {/* Variants */}
                        <div className="space-y-4">
                            {/* Color */}
                            {colorAttr && colorAttr.options.length > 0 && (
                                <div>
                                    <label className="flex items-center gap-2 font-semibold mb-3">
                                        <Palette className="w-5 h-5" />
                                        Màu sắc:
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {colorAttr.options.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-2 rounded-lg border-2 font-medium transition ${selectedColor === color
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size */}
                            {sizeAttr && sizeAttr.options.length > 0 && (
                                <div>
                                    <label className="flex items-center gap-2 font-semibold mb-3">
                                        <Ruler className="w-5 h-5" />
                                        Kích cỡ:
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {sizeAttr.options.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 rounded-lg border-2 font-medium transition ${selectedSize === size
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quantity & Actions */}
                        <div className="space-y-4">
                            {/* Quantity */}
                            <div className="flex items-center gap-4">
                                <span className="font-semibold">Số lượng:</span>
                                <div className="flex items-center border rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 hover:bg-gray-100"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-2 hover:bg-gray-100"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {stockStatus === 'instock' ? 'Còn hàng' : 'Hết hàng'}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={stockStatus !== 'instock'}
                                    className="flex-shrink-0 w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-red-400 hover:bg-red-50 transition disabled:opacity-50"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={stockStatus !== 'instock'}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white h-12 rounded-lg font-semibold transition disabled:opacity-50"
                                >
                                    MUA NGAY
                                </button>
                                <Link
                                    href="/contact"
                                    className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-50 h-12 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                                >
                                    <MapPin className="w-4 h-4" />
                                    TÌM CỬA HÀNG
                                </Link>
                            </div>

                            {/* Wishlist & Share */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className="flex items-center gap-2 text-gray-600 hover:text-red-500"
                                >
                                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                                    Yêu thích
                                </button>
                                <button className="flex items-center gap-2 text-gray-600 hover:text-primary">
                                    <Share2 className="w-5 h-5" />
                                    Chia sẻ
                                </button>
                            </div>
                        </div>

                        {/* Advisory Box */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-green-700 mb-3">
                                <CheckCircle2 className="w-4 h-4" />
                                Tư vấn, đặt lịch & ưu đãi
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="tel"
                                    placeholder="Số điện thoại của bạn"
                                    className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2 rounded-lg transition">
                                    GỬI
                                </button>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                <Truck className="w-5 h-5 text-primary" />
                                <div>
                                    <div className="text-sm font-medium">Giao hàng miễn phí</div>
                                    <div className="text-xs text-gray-500">Đơn từ 500K</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                <Clock className="w-5 h-5 text-primary" />
                                <div>
                                    <div className="text-sm font-medium">Giao trong 2h</div>
                                    <div className="text-xs text-gray-500">Nội thành HCM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Tabs */}
                <div className="mt-12 bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Tab Headers */}
                    <div className="flex border-b">
                        {[
                            { id: 'description', label: 'Mô tả sản phẩm' },
                            { id: 'specs', label: 'Thông số kỹ thuật' },
                            { id: 'reviews', label: `Đánh giá (${reviewCount})` },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 font-medium transition ${activeTab === tab.id
                                        ? 'text-primary border-b-2 border-primary bg-primary/5'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'description' && (
                            <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: product.content?.rendered || product.excerpt?.rendered || '' }}
                            />
                        )}

                        {activeTab === 'specs' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {attributes.map((attr, idx) => (
                                    <div key={idx} className="flex border-b pb-2">
                                        <span className="w-1/2 font-medium text-gray-600">{attr.name}</span>
                                        <span className="w-1/2 text-gray-900">{attr.options.join(', ')}</span>
                                    </div>
                                ))}
                                {sku && (
                                    <div className="flex border-b pb-2">
                                        <span className="w-1/2 font-medium text-gray-600">Mã sản phẩm</span>
                                        <span className="w-1/2 text-gray-900">{sku}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="text-center py-8 text-gray-500">
                                {reviewCount > 0 ? (
                                    <div>
                                        <p className="text-lg mb-2">⭐ {rating}/5 ({reviewCount} đánh giá)</p>
                                    </div>
                                ) : (
                                    <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {relatedProducts.slice(0, 4).map((rp) => (
                                <Link key={rp.id} href={`/${rp.slug}`} className="group">
                                    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                            {rp._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                                                <Image
                                                    src={rp._embedded['wp:featuredmedia'][0].source_url}
                                                    alt={rp.title.rendered}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform"
                                                />
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-primary transition">
                                                {rp.title.rendered}
                                            </h3>
                                            {rp.wc_data?.price && (
                                                <p className="text-primary font-bold mt-1">
                                                    {formatPrice(parseInt(rp.wc_data.price))}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Image Zoom Modal */}
            {showImageZoom && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowImageZoom(false)}
                >
                    <button
                        onClick={() => setShowImageZoom(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300"
                    >
                        ✕
                    </button>
                    <Image
                        src={currentImage}
                        alt={product.title.rendered}
                        width={800}
                        height={800}
                        className="max-w-full max-h-[90vh] object-contain"
                    />
                </div>
            )}
        </div>
    );
}
