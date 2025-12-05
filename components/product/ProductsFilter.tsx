'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface ProductsFilterProps {
    currentSort: string;
    category: string;
    priceRange: string;
}

export function ProductsFilter({ currentSort, category, priceRange }: ProductsFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set('sortBy', e.target.value);
        params.set('page', '1');
        router.push(`/products?${params.toString()}`);
    };

    return (
        <select
            value={currentSort}
            onChange={handleSortChange}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm 
                     bg-white text-gray-700 focus:outline-none focus:ring-2 
                     focus:ring-primary focus:border-transparent cursor-pointer"
        >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="price-asc">Giá: Thấp → Cao</option>
            <option value="price-desc">Giá: Cao → Thấp</option>
            <option value="name-asc">Tên: A → Z</option>
            <option value="name-desc">Tên: Z → A</option>
        </select>
    );
}
