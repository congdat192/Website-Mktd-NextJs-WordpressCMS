/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllProducts } from '@/lib/graphql/products';
import { graphQLProductsToWPProducts } from '@/lib/graphql-adapter';
import { CategoryProductListing } from '@/components/category';

export const metadata = {
    title: 'Sản phẩm - Mắt Kính Tâm Đức',
    description: 'Khám phá bộ sưu tập gọng kính, tròng kính, kính mát và kính áp tròng chất lượng cao từ các thương hiệu uy tín',
};

export default async function ProductsPage() {
    // Fetch ALL products using pagination
    let products: any[] = [];

    try {
        // Use getAllProducts for complete pagination
        const allGraphQLProducts = await getAllProducts();
        products = graphQLProductsToWPProducts(allGraphQLProducts);
        console.log(`[ProductsPage] Loaded ${products.length} products`);
    } catch (error) {
        console.error('Error fetching products:', error);
    }

    return (
        <CategoryProductListing
            categoryName="Sản phẩm"
            categoryDescription=""
            products={products}
            showHeroBanner={false}
        />
    );
}
