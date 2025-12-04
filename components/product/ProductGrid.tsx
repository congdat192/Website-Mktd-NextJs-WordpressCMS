import { ProductCard } from './ProductCard';
import type { WPProduct } from '@/lib/wordpress';

interface ProductGridProps {
    products: WPProduct[];
    columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
    const gridCols = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    };

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-[#666666] text-lg">Không tìm thấy sản phẩm nào</p>
            </div>
        );
    }

    return (
        <div className={`grid ${gridCols[columns]} gap-6`}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
