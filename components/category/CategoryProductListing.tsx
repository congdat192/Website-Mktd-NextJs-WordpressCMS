'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Search,
    Grid3X3,
    List,
    Eye,
    Star,
    ChevronRight,
    SlidersHorizontal,
    X,
    Glasses,
    Square,
    Circle,
    Triangle,
    Zap,
    TrendingUp,
    Award,
    ChevronLeft,
    ShoppingBag,
} from 'lucide-react';
import { ProductCardEnhanced } from '@/components/product/ProductCardEnhanced';
import { QuickViewModal } from '@/components/product/QuickViewModal';

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

interface CategoryProductListingProps {
    categoryName?: string;
    categoryDescription?: string;
    products: WPProduct[];
    showHeroBanner?: boolean;
}

export function CategoryProductListing({
    categoryName = 'Bộ Sưu Tập Kính Mắt Cao Cấp',
    categoryDescription = 'Khám phá hàng nghìn mẫu kính mắt từ những thương hiệu hàng đầu thế giới. Thiết kế hiện đại, chất lượng tuyệt vời, giá cả cạnh tranh.',
    products,
    showHeroBanner = true,
}: CategoryProductListingProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('featured');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [selectedQuickFilter, setSelectedQuickFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState<WPProduct | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    // Quick filter tabs
    const quickFilters = [
        { id: 'all', label: 'Tất cả', icon: <Grid3X3 className="h-4 w-4" /> },
        { id: 'sale', label: 'Giảm giá', icon: <Zap className="h-4 w-4" /> },
        { id: 'new', label: 'Mới nhất', icon: <Star className="h-4 w-4" /> },
        { id: 'bestseller', label: 'Bán chạy', icon: <TrendingUp className="h-4 w-4" /> },
        { id: 'premium', label: 'Cao cấp', icon: <Award className="h-4 w-4" /> },
    ];

    // Frame type filters
    const frameTypes = [
        { id: 'all', label: 'Tất cả', icon: <Glasses className="h-5 w-5" /> },
        { id: 'full-rim', label: 'Gọng đầy', icon: <Square className="h-5 w-5" /> },
        { id: 'semi-rim', label: 'Nửa gọng', icon: <Circle className="h-5 w-5" /> },
        { id: 'rimless', label: 'Không gọng', icon: <Triangle className="h-5 w-5" /> },
    ];
    const [selectedFrameType, setSelectedFrameType] = useState('all');

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.rendered.toLowerCase().includes(query) ||
                p.wc_data?.sku?.toLowerCase().includes(query)
            );
        }

        // Price filter
        result = result.filter(p => {
            const price = parseInt(p.wc_data?.price || '0');
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Quick filter
        if (selectedQuickFilter === 'sale') {
            result = result.filter(p => p.wc_data?.on_sale);
        }

        // Sort
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => parseInt(a.wc_data?.price || '0') - parseInt(b.wc_data?.price || '0'));
                break;
            case 'price-high':
                result.sort((a, b) => parseInt(b.wc_data?.price || '0') - parseInt(a.wc_data?.price || '0'));
                break;
            case 'newest':
                // Default order from WP is usually newest first
                break;
            case 'rating':
                result.sort((a, b) => parseFloat(b.wc_data?.average_rating || '0') - parseFloat(a.wc_data?.average_rating || '0'));
                break;
        }

        return result;
    }, [products, searchQuery, priceRange, selectedQuickFilter, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    // Get counts for filters
    const saleCount = products.filter(p => p.wc_data?.on_sale).length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            {showHeroBanner && (
                <div className="relative bg-gradient-to-r from-primary to-green-800 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative container mx-auto px-4 py-12 lg:py-16">
                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                {categoryName}
                            </h1>
                            <p className="text-lg lg:text-xl mb-6 text-green-100">
                                {categoryDescription}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/booking"
                                    className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-lg font-medium shadow-lg hover:bg-gray-100 transition"
                                >
                                    <Eye className="h-5 w-5" />
                                    Khám Mắt Miễn Phí
                                </Link>
                                <button className="inline-flex items-center gap-2 border-2 border-white text-white px-5 py-2.5 rounded-lg font-medium hover:bg-white hover:text-primary transition">
                                    <ShoppingBag className="h-5 w-5" />
                                    Xem Sản Phẩm
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Decorative */}
                    <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl hidden lg:block" />
                    <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-lg hidden lg:block" />
                </div>
            )}

            <div className="container mx-auto px-4 py-6 lg:py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-primary transition">Trang chủ</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-gray-900">{categoryName}</span>
                </div>

                {/* Quick Filter Tabs */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Lọc nhanh</h3>
                    <div className="flex flex-wrap gap-2">
                        {quickFilters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedQuickFilter(filter.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${selectedQuickFilter === filter.id
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {filter.icon}
                                {filter.label}
                                {filter.id === 'sale' && saleCount > 0 && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedQuickFilter === filter.id
                                        ? 'bg-white/20'
                                        : 'bg-red-100 text-red-600'
                                        }`}>
                                        {saleCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Frame Type Carousel */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Loại gọng kính</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {frameTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedFrameType(type.id)}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${selectedFrameType === type.id
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {type.icon}
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search & Filters Bar */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                    >
                        <SlidersHorizontal className="h-5 w-5" />
                        Bộ lọc nâng cao
                    </button>
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Bộ lọc nâng cao</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Price Range */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Khoảng giá</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="Từ"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        placeholder="Đến"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000000])}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <p className="text-sm text-gray-600">
                        Hiển thị <span className="font-semibold">{filteredProducts.length}</span> sản phẩm
                    </p>

                    <div className="flex items-center gap-3">
                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="featured">Nổi bật</option>
                            <option value="price-low">Giá thấp → cao</option>
                            <option value="price-high">Giá cao → thấp</option>
                            <option value="newest">Mới nhất</option>
                            <option value="rating">Đánh giá cao</option>
                        </select>

                        {/* View Mode */}
                        <div className="flex border border-gray-200 rounded-lg p-1 bg-white">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded transition ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded transition ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {paginatedProducts.length > 0 ? (
                    <div className={`grid gap-6 mb-8 ${viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                        }`}>
                        {paginatedProducts.map((product, idx) => (
                            <ProductCardEnhanced
                                key={product.id}
                                product={product}
                                isNew={idx < 3}
                                isBestseller={idx === 0 || idx === 4}
                                isPremium={idx === 2}
                                onQuickView={() => setQuickViewProduct(product)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h3>
                        <p className="text-gray-500 mb-4">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedQuickFilter('all');
                                setPriceRange([0, 10000000]);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                        >
                            <X className="h-4 w-4" />
                            Xóa tất cả bộ lọc
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
                        <p className="text-sm text-gray-500">
                            Hiển thị {(currentPage - 1) * productsPerPage + 1}-{Math.min(currentPage * productsPerPage, filteredProducts.length)} trong tổng số {filteredProducts.length} sản phẩm
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Trước
                            </button>
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                const page = i + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-lg text-sm font-medium transition ${currentPage === page
                                            ? 'bg-primary text-white'
                                            : 'border border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            {totalPages > 5 && <span className="text-gray-400">...</span>}
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sau
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick View Modal */}
            {quickViewProduct && (
                <QuickViewModal
                    product={quickViewProduct}
                    isOpen={!!quickViewProduct}
                    onClose={() => setQuickViewProduct(null)}
                />
            )}
        </div>
    );
}
