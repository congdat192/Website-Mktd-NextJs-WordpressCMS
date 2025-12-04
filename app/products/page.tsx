import { getProducts, type WPProduct } from '@/lib/wordpress';
import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';

export const metadata: Metadata = {
    title: 'Sản phẩm - Mắt Kính Tâm Đức',
    description: 'Khám phá bộ sưu tập gọng kính, tròng kính và kính mát đa dạng',
};

// Helper function to strip HTML tags
function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
}

export default async function ProductsPage() {
    let products: WPProduct[] = [];
    let error = null;

    try {
        products = await getProducts({ perPage: 24 });
    } catch (err) {
        error = err;
        console.error('Failed to fetch products:', err);
    }

    return (
        <div className="min-h-screen bg-forest-bg">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 pt-8 pb-12">
                <div className="bg-gradient-to-r from-forest-primary to-forest-secondary rounded-3xl p-8 md:p-12 text-white">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
                            Khám Phá Sản Phẩm Thiên Nhiên
                        </h1>
                        <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8 font-sans">
                            Những sản phẩm chất lượng cao, thân thiện với môi trường, mang đến sự bền vững cho cuộc sống của bạn.
                        </p>
                        <button className="bg-forest-cta text-forest-text px-6 md:px-8 py-3 rounded-xl font-semibold hover:bg-forest-cta/90 transition-colors duration-200 cursor-pointer">
                            Xem ngay
                        </button>
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            <section className="max-w-7xl mx-auto px-4 mb-12">
                <ProductFilter />
            </section>

            {/* Products Grid */}
            <section className="max-w-7xl mx-auto px-4 pb-16">
                {error ? (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-600 font-semibold mb-2 text-lg font-heading">
                            Không thể tải sản phẩm
                        </p>
                        <p className="text-sm text-gray-600 font-sans">
                            <button className="px-4 py-2 border border-forest-border rounded-lg hover:bg-white transition-colors duration-200 cursor-pointer">
                                2
                            </button>
                            <button className="px-4 py-2 border border-forest-border rounded-lg hover:bg-white transition-colors duration-200 cursor-pointer">
                                3
                            </button>
                            <button className="px-4 py-2 border border-forest-border rounded-lg hover:bg-white transition-colors duration-200 cursor-pointer">
                                4
                            </button>
                            <button
                                className="p-2 border border-forest-border rounded-lg hover:bg-white transition-colors duration-200 cursor-pointer"
                                aria-label="Trang sau"
                            >
                                <svg className="w-5 h-5 text-forest-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                    </div>
                    </>
                )}
        </section>

            {/* CTA Section */ }
    <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-forest-text mb-4 font-heading">
                Không tìm thấy sản phẩm phù hợp?
            </h2>
            <p className="text-forest-text/70 mb-6 md:mb-8 font-sans max-w-2xl mx-auto">
                Chúng tôi luôn sẵn sàng tư vấn và giúp bạn tìm kiếm sản phẩm hoàn hảo cho không gian của bạn.
            </p>
            <button className="bg-forest-primary text-white px-6 md:px-8 py-3 rounded-xl font-semibold hover:bg-forest-primary/90 transition-colors duration-200 cursor-pointer inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Liên hệ tư vấn
            </button>
        </div>
    </section>
        </div >
    );
}
