import Link from 'next/link';
import { ArrowRight, Eye, ShoppingBag, TrendingUp } from 'lucide-react';
import { getProducts, getProductCategories } from '@/lib/wordpress';
import { ProductGrid } from '@/components/product';
import { Button } from '@/components/ui';

export const metadata = {
    title: 'Mắt Kính Tâm Đức - Hệ thống mắt kính uy tín',
    description: 'Chuyên cung cấp gọng kính, tròng kính và kính mát chất lượng cao với giá tốt nhất',
};

export default async function HomePage() {
    // Fetch featured products
    let featuredProducts = [];
    let categories = [];

    try {
        [featuredProducts, categories] = await Promise.all([
            getProducts({ perPage: 8 }),
            getProductCategories({ perPage: 6 }),
        ]);
    } catch (error) {
        console.error('Error fetching homepage data:', error);
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#228B22] via-[#1a6b1a] to-[#2ea82e] text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
                <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-medium">Ưu đãi đặc biệt tháng 12</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Bảo vệ đôi mắt,
                                <br />
                                <span className="text-[#FFD700]">Tỏa sáng phong cách</span>
                            </h1>

                            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                                Hơn 20 năm kinh nghiệm cung cấp gọng kính, tròng kính và kính mát
                                chất lượng cao từ các thương hiệu uy tín hàng đầu thế giới.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" variant="secondary" asChild>
                                    <Link href="/products">
                                        <ShoppingBag className="w-5 h-5 mr-2" />
                                        Xem sản phẩm
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-[#228B22]" asChild>
                                    <Link href="/about">
                                        Về chúng tôi
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                                <div>
                                    <p className="text-3xl font-bold mb-1">20+</p>
                                    <p className="text-sm text-white/80">Năm kinh nghiệm</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold mb-1">10K+</p>
                                    <p className="text-sm text-white/80">Khách hàng</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold mb-1">500+</p>
                                    <p className="text-sm text-white/80">Sản phẩm</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative hidden md:block">
                            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="/hero-glasses.jpg"
                                    alt="Mắt kính cao cấp"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Floating Card */}
                            <div className="absolute -bottom-6 -left-6 bg-white text-[#333333] p-6 rounded-2xl shadow-xl">
                                <p className="text-sm text-[#666666] mb-1">Giảm giá lên đến</p>
                                <p className="text-3xl font-bold text-[#228B22]">50%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
                            Danh mục sản phẩm
                        </h2>
                        <p className="text-lg text-[#666666] max-w-2xl mx-auto">
                            Khám phá bộ sưu tập đa dạng từ gọng kính thời trang đến tròng kính chống ánh sáng xanh
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.slice(0, 6).map((category) => (
                            <Link
                                key={category.id}
                                href={`/categories/${category.slug}`}
                                className="group relative aspect-square rounded-2xl overflow-hidden bg-[#F5F5F5] hover:shadow-lg transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                                {category.image && (
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                )}
                                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                    <h3 className="text-white font-semibold text-sm md:text-base">
                                        {category.name}
                                    </h3>
                                    <p className="text-white/80 text-xs mt-1">
                                        {category.count} sản phẩm
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 md:py-20 bg-[#F5F5F5]">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2">
                                Sản phẩm nổi bật
                            </h2>
                            <p className="text-lg text-[#666666]">
                                Những sản phẩm được yêu thích nhất
                            </p>
                        </div>
                        <Button variant="outline" asChild className="hidden md:inline-flex">
                            <Link href="/products">
                                Xem tất cả
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>

                    <ProductGrid products={featuredProducts} columns={4} />

                    <div className="text-center mt-8 md:hidden">
                        <Button variant="outline" asChild fullWidth>
                            <Link href="/products">
                                Xem tất cả sản phẩm
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-[#228B22]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Eye className="w-8 h-8 text-[#228B22]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#333333] mb-2">
                                Kiểm tra mắt miễn phí
                            </h3>
                            <p className="text-[#666666]">
                                Đội ngũ chuyên gia tư vấn và kiểm tra thị lực chuyên nghiệp
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-[#228B22]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="w-8 h-8 text-[#228B22]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#333333] mb-2">
                                Miễn phí vận chuyển
                            </h3>
                            <p className="text-[#666666]">
                                Giao hàng nhanh chóng cho đơn hàng trên 500.000₫
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-[#228B22]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-[#228B22]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#333333] mb-2">
                                Bảo hành 12 tháng
                            </h3>
                            <p className="text-[#666666]">
                                Cam kết chất lượng với chính sách bảo hành toàn diện
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-[#228B22] to-[#1a6b1a] text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Bạn cần tư vấn chọn kính phù hợp?
                    </h2>
                    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                        Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn tìm được sản phẩm hoàn hảo
                    </p>
                    <Button size="lg" variant="secondary" asChild>
                        <Link href="/contact">
                            Liên hệ ngay
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
