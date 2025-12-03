'use client';

import { useState } from 'react';

interface ProductFilterProps {
    categories?: Array<{
        id: string;
        name: string;
        count?: number;
    }>;
    onCategoryChange?: (categoryId: string) => void;
    onSortChange?: (sortBy: string) => void;
}

const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá thấp đến cao' },
    { value: 'price-desc', label: 'Giá cao đến thấp' },
    { value: 'popular', label: 'Phổ biến nhất' },
];

const defaultCategories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'green', name: 'Sản phẩm xanh' },
    { id: 'furniture', name: 'Nội thất' },
    { id: 'decor', name: 'Trang trí' },
    { id: 'care', name: 'Chăm sóc' },
];

export default function ProductFilter({
    categories = defaultCategories,
    onCategoryChange,
    onSortChange,
}: ProductFilterProps) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSort, setSelectedSort] = useState('newest');

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(categoryId);
        onCategoryChange?.(categoryId);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedSort(value);
        onSortChange?.(value);
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Categories */}
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-semibold text-forest-text font-heading">Danh mục:</span>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer font-sans ${
                                selectedCategory === category.id
                                    ? 'bg-forest-primary text-white'
                                    : 'bg-white border border-forest-border text-forest-text hover:bg-forest-bg'
                            }`}
                        >
                            {category.name}
                            {category.count !== undefined && (
                                <span className="ml-1.5 text-xs opacity-70">({category.count})</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-forest-text font-heading whitespace-nowrap">
                        Sắp xếp:
                    </span>
                    <select
                        value={selectedSort}
                        onChange={handleSortChange}
                        className="px-4 py-2 border border-forest-border rounded-lg bg-white text-forest-text cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest-primary font-sans"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
