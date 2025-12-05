/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Eye, ShoppingBag, Shield, Truck, Award, Sparkles } from 'lucide-react';
import { getProducts } from '@/lib/graphql/products';
import { getPosts } from '@/lib/graphql/posts';
import { graphQLProductsToWPProducts } from '@/lib/graphql-adapter';
import { getProductCategories } from '@/lib/wordpress';
import { ProductGrid } from '@/components/product';
import { Button } from '@/components/ui';
import { BrandsSection, TestimonialsSection, BlogPreviewSection } from '@/components/home';

export const metadata = {
    title: 'Mắt Kính Tâm Đức - Hệ thống mắt kính uy tín',
    description: 'Chuyên cung cấp gọng kính, tròng kính và kính mát chất lượng cao với giá tốt nhất. Kiểm tra mắt miễn phí, bảo hành 12 tháng.',
};

export default async function HomePage() {
    // Fetch all data in parallel
    let featuredProducts: any[] = [];
    let categories: any[] = [];
    let latestPosts: any[] = [];

    try {
        const [productsResult, categoriesData, postsResult] = await Promise.all([
            getProducts({ first: 8 }),
            getProductCategories(),
            getPosts({ first: 3 }),
        ]);

        const graphQLProducts = productsResult.edges.map((edge: any) => edge.node);
        featuredProducts = graphQLProductsToWPProducts(graphQLProducts);
        categories = categoriesData;

        // Transform posts
        latestPosts = (postsResult?.nodes || []).map((post: any) => ({
            id: post.databaseId,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            date: post.date,
            author: post.author?.node?.name,
            featuredImage: post.featuredImage?.node ? {
                url: post.featuredImage.node.sourceUrl,
                alt: post.featuredImage.node.altText,
            } : null,
        }));
    } catch (error) {
        console.error('Error fetching homepage data:', error);
    }

    return (
        <div className="min-h-screen">
            {/* ========== HERO SECTION ========== */}
            <section className="relative bg-gradient-to-br from-primary via-primary-dark to-[#0f5f0f] text-white overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }} />
                </div>

                {/* Floating Shapes */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left Content */}
                        <div className="max-w-xl">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm 
                                          px-4 py-2 rounded-full mb-6 animate-fade-in">
                                <Sparkles className="w-4 h-4 text-yellow-300" />
                                <span className="text-sm font-medium">Ưu đãi đặc biệt tháng 12</span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Bảo vệ đôi mắt,
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                                    Tỏa sáng phong cách
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                                Hơn 20 năm kinh nghiệm cung cấp gọng kính, tròng kính và kính mát
                                chất lượng cao từ các thương hiệu uy tín hàng đầu thế giới.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" variant="secondary" asChild className="shadow-lg hover:shadow-xl transition-shadow">
                                    <Link href="/products">
                                        <ShoppingBag className="w-5 h-5 mr-2" />
                                        Xem sản phẩm
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
                                    asChild
                                >
                                    <Link href="/about">
                                        Về chúng tôi
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                                <div>
                                    <p className="text-3xl md:text-4xl font-bold mb-1">20+</p>
                                    <p className="text-sm text-white/70">Năm kinh nghiệm</p>
                                </div>
                                <div>
                                    <p className="text-3xl md:text-4xl font-bold mb-1">10K+</p>
                                    <p className="text-sm text-white/70">Khách hàng</p>
                                </div>
                                <div>
                                    <p className="text-3xl md:text-4xl font-bold mb-1">500+</p>
                                    <p className="text-sm text-white/70">Sản phẩm</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative hidden lg:block">
                            <div className="relative aspect-square max-w-lg mx-auto">
                                {/* Main Image Container */}
                                <div className="absolute inset-4 rounded-3xl overflow-hidden shadow-2xl 
                                              bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm
                                              border border-white/20">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Eye className="w-32 h-32 text-white/20" />
                                    </div>
                                </div>

                                {/* Floating Card - Discount */}
                                <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 p-5 rounded-2xl shadow-2xl
                                              transform hover:scale-105 transition-transform">
                                    <p className="text-xs text-gray-500 mb-1">Giảm giá lên đến</p>
                                    <p className="text-3xl font-bold text-primary">50%</p>
                                </div>

                                {/* Floating Card - Rating */}
                                <div className="absolute -top-4 -right-4 bg-white text-gray-900 p-4 rounded-2xl shadow-2xl">
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-500 text-lg">★★★★★</span>
                                        <span className="text-sm font-medium">4.9/5</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">10K+ đánh giá</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 100" fill="none" className="w-full h-auto">
                        <path
                            d="M0 50L60 45C120 40 240 30 360 35C480 40 600 60 720 65C840 70 960 60 1080 50C1200 40 1320 30 1380 25L1440 20V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z"
                            fill="white"
                        />
                    </svg>
                </div>
            </section>

            {/* ========== BRANDS SECTION ========== */}
            <BrandsSection />

            {/* ========== CATEGORIES SECTION ========== */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                            Danh mục
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Khám phá bộ sưu tập
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Từ gọng kính thời trang đến tròng kính chống ánh sáng xanh
                        </p>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.slice(0, 6).map((category) => (
                            <Link
                                key={category.id}
                                href={`/categories/${category.slug}`}
                                className="group relative aspect-square rounded-2xl overflow-hidden 
                                         bg-gradient-to-br from-gray-100 to-gray-50
                                         hover:shadow-elevated transition-all duration-300
                                         border border-gray-100 hover:border-primary/20"
                            >
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent z-10" />

                                {/* Image */}
                                {category.image && (
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                )}

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                    <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2
                                                 group-hover:translate-y-0 transition-transform">
                                        {category.name}
                                    </h3>
                                    <p className="text-white/70 text-xs mt-1">
                                        {category.count} sản phẩm
                                    </p>
                                </div>

                                {/* Hover Arrow */}
                                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 
                                              translate-x-2 group-hover:translate-x-0 transition-all">
                                    <ArrowRight className="w-5 h-5 text-white" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== FEATURED PRODUCTS SECTION ========== */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                                Sản phẩm
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Sản phẩm nổi bật
                            </h2>
                            <p className="text-lg text-gray-600">
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

                    {/* Products Grid */}
                    <ProductGrid products={featuredProducts} columns={4} />

                    {/* Mobile CTA */}
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

            {/* ========== FEATURES SECTION ========== */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Eye,
                                title: 'Kiểm tra mắt miễn phí',
                                description: 'Đội ngũ chuyên gia tư vấn và kiểm tra thị lực chuyên nghiệp',
                            },
                            {
                                icon: Truck,
                                title: 'Miễn phí vận chuyển',
                                description: 'Giao hàng nhanh chóng cho đơn hàng trên 500.000₫',
                            },
                            {
                                icon: Shield,
                                title: 'Bảo hành 12 tháng',
                                description: 'Cam kết chất lượng với chính sách bảo hành toàn diện',
                            },
                            {
                                icon: Award,
                                title: 'Sản phẩm chính hãng',
                                description: '100% sản phẩm có nguồn gốc xuất xứ rõ ràng',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group text-center p-6 rounded-2xl hover:bg-gray-50 
                                         transition-colors duration-300"
                            >
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center 
                                              justify-center mx-auto mb-4 group-hover:bg-primary/20 
                                              group-hover:scale-110 transition-all duration-300">
                                    <feature.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== TESTIMONIALS SECTION ========== */}
            <TestimonialsSection />

            {/* ========== BLOG PREVIEW SECTION ========== */}
            <BlogPreviewSection posts={latestPosts} />

            {/* ========== CTA SECTION ========== */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary-dark to-[#0f5f0f] text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '32px 32px',
                    }} />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Bạn cần tư vấn chọn kính phù hợp?
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn tìm được sản phẩm hoàn hảo
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" asChild className="shadow-lg">
                            <Link href="/contact">
                                Liên hệ tư vấn
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
                            asChild
                        >
                            <a href="tel:0901234567">
                                Gọi ngay: 090 123 4567
                            </a>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
