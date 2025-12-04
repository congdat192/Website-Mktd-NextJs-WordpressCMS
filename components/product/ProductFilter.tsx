'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, Button } from '@/components/ui';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

export function ProductFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    // Get current filter values from URL
    const category = searchParams.get('category') || 'all';
    const priceRange = searchParams.get('priceRange') || 'all';
    const sortBy = searchParams.get('sortBy') || 'newest';

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set(key, value);
        params.set('page', '1'); // Reset to page 1 when filters change
        router.push(`/products?${params.toString()}`);
    };

    const handleReset = () => {
        router.push('/products');
    };

    const hasActiveFilters = category !== 'all' || priceRange !== 'all';

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-4">
                <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Bộ lọc
                    {hasActiveFilters && (
                        <span className="ml-2 bg-[#228B22] text-white text-xs px-2 py-0.5 rounded-full">
                            {[category !== 'all', priceRange !== 'all'].filter(Boolean).length}
                        </span>
                    )}
                </Button>
            </div>

            {/* Filters */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Category Filter */}
                    <Select
                        label="Danh mục"
                        value={category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        options={[
                            { value: 'all', label: 'Tất cả' },
                            { value: 'gong-kinh', label: 'Gọng kính' },
                            { value: 'trong-kinh', label: 'Tròng kính' },
                            { value: 'kinh-mat', label: 'Kính mát' },
                            { value: 'kinh-ap-trong', label: 'Kính áp tròng' },
                        ]}
                    />

                    {/* Price Range Filter */}
                    <Select
                        label="Khoảng giá"
                        value={priceRange}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        options={[
                            { value: 'all', label: 'Tất cả' },
                            { value: '0-500000', label: 'Dưới 500.000₫' },
                            { value: '500000-1000000', label: '500.000₫ - 1.000.000₫' },
                            { value: '1000000-2000000', label: '1.000.000₫ - 2.000.000₫' },
                            { value: '2000000-5000000', label: '2.000.000₫ - 5.000.000₫' },
                            { value: '5000000-999999999', label: 'Trên 5.000.000₫' },
                        ]}
                    />

                    {/* Sort By */}
                    <Select
                        label="Sắp xếp"
                        value={sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        options={[
                            { value: 'newest', label: 'Mới nhất' },
                            { value: 'oldest', label: 'Cũ nhất' },
                            { value: 'price-asc', label: 'Giá: Thấp đến cao' },
                            { value: 'price-desc', label: 'Giá: Cao đến thấp' },
                            { value: 'name-asc', label: 'Tên: A-Z' },
                            { value: 'name-desc', label: 'Tên: Z-A' },
                        ]}
                    />

                    {/* Reset Button */}
                    <div className="flex items-end">
                        <Button
                            variant="ghost"
                            fullWidth
                            onClick={handleReset}
                            disabled={!hasActiveFilters && sortBy === 'newest'}
                        >
                            <X className="w-5 h-5 mr-2" />
                            Xóa bộ lọc
                        </Button>
                    </div>
                </div>

                {/* Active Filters Tags */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E5E5E5]">
                        <span className="text-sm text-[#666666]">Đang lọc:</span>
                        {category !== 'all' && (
                            <span className="inline-flex items-center gap-1 bg-[#228B22]/10 text-[#228B22] text-sm px-3 py-1 rounded-full">
                                Danh mục
                                <button
                                    onClick={() => handleFilterChange('category', 'all')}
                                    className="hover:bg-[#228B22]/20 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {priceRange !== 'all' && (
                            <span className="inline-flex items-center gap-1 bg-[#228B22]/10 text-[#228B22] text-sm px-3 py-1 rounded-full">
                                Khoảng giá
                                <button
                                    onClick={() => handleFilterChange('priceRange', 'all')}
                                    className="hover:bg-[#228B22]/20 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
