import { getProducts, WPProduct } from '@/lib/wordpress';
import { ProductGrid } from '@/components/product';

export const metadata = {
    title: 'Sản phẩm - Mắt Kính Tâm Đức',
    description: 'Khám phá bộ sưu tập gọng kính và tròng kính chất lượng cao',
};

export default async function ProductsPage() {
    let products: WPProduct[] = [];

    try {
        products = await getProducts({ perPage: 12 });
    } catch (error) {
        console.error('Error fetching products:', error);
    }

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
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-[#666666]">
                        Hiển thị <span className="font-semibold text-[#333333]">{products.length}</span> sản phẩm
                    </p>
                    {/* TODO: Add sort dropdown */}
                </div>

                {/* Products Grid */}
                <ProductGrid products={products} columns={4} />

                {/* TODO: Add pagination */}
            </div>
        </div>
    );
}
