/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProducts as getProductsGraphQL } from '@/lib/graphql/products';
import { graphQLProductsToWPProducts } from '@/lib/graphql-adapter';
import { ProductGrid, ProductFilter } from '@/components/product';
import { Pagination } from '@/components/ui';

export const metadata = {
    title: 'Sản phẩm - Mắt Kính Tâm Đức',
    description: 'Khám phá bộ sưu tập gọng kính và tròng kính chất lượng cao',
};

interface PageProps {
    searchParams: Promise<{
        page?: string;
        category?: string;
        priceRange?: string;
        sortBy?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
    // Await search params (Next.js 15)
    const params = await searchParams;

    // Parse search params
    const pageNum = parseInt(params.page || '1');
    const category = params.category || 'all';
    const priceRange = params.priceRange || 'all';
    const sortBy = params.sortBy || 'newest';

    // Parse price range
    let minPrice, maxPrice;
    if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        minPrice = min;
        maxPrice = max;
    }

    // Parse sort
    let orderBy: 'DATE' | 'TITLE' | 'PRICE' = 'DATE';
    let order: 'ASC' | 'DESC' = 'DESC';

    switch (sortBy) {
        case 'newest':
            orderBy = 'DATE';
            order = 'DESC';
            break;
        case 'oldest':
            orderBy = 'DATE';
            order = 'ASC';
            break;
        case 'price-asc':
            orderBy = 'PRICE';
            order = 'ASC';
            break;
        case 'price-desc':
            orderBy = 'PRICE';
            order = 'DESC';
            break;
        case 'name-asc':
            orderBy = 'TITLE';
            order = 'ASC';
            break;
        case 'name-desc':
            orderBy = 'TITLE';
            order = 'DESC';
            break;
    }

    // Fetch products with GraphQL
    let products: any[] = [];
    let hasNextPage = false;

    try {
        const result = await getProductsGraphQL({
            first: 12,
            categorySlug: category !== 'all' ? category : undefined,
            minPrice,
            maxPrice,
            orderBy,
            order,
        });

        // Convert GraphQL products to WP format for existing components
        const graphQLProducts = result.edges.map((edge: any) => edge.node);
        products = graphQLProductsToWPProducts(graphQLProducts);
        hasNextPage = result.pageInfo.hasNextPage;
    } catch (error) {
        console.error('Error fetching products:', error);
    }

    // Calculate total pages (simplified)
    const totalPages = hasNextPage ? pageNum + 1 : pageNum;

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#228B22] to-[#1a6b1a] text-white py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Sản phẩm</h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                        Khám phá bộ sưu tập gọng kính và tròng kính chất lượng cao từ các thương hiệu uy tín
                    </p>
                </div>
            </div>

            {/* Products Section */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Filter */}
                <ProductFilter />

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-[#666666]">
                        Hiển thị <span className="font-semibold text-[#333333]">{products.length}</span> sản phẩm
                    </p>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-[#666666] text-lg">Không tìm thấy sản phẩm nào.</p>
                    </div>
                ) : (
                    <ProductGrid products={products} columns={4} />
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12">
                        <Pagination
                            currentPage={pageNum}
                            totalPages={totalPages}
                            baseUrl="/products"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
