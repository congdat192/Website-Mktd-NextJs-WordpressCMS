import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    getPageBySlug,
    getPages,
    getPostBySlug,
    getProductBySlug,
    getPosts,
    getProducts,
    getCategoryBySlug,
    getProductCategoryBySlug,
    getPostsByCategory,
    getProductsByCategory,
    getCategories,
    getProductCategories,
} from '@/lib/wordpress';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    // Try to get as product category first (most likely for single slug)
    try {
        const category = await getProductCategoryBySlug(slug);
        if (category) {
            return {
                title: category.yoast_head_json?.title || `${category.name} - Mắt Kính Tâm Đức`,
                description: category.yoast_head_json?.description || category.description || `Khám phá ${category.name}`,
            };
        }
    } catch {
        // Not a product category
    }

    // Try to get as blog category
    try {
        const category = await getCategoryBySlug(slug);
        if (category) {
            return {
                title: category.yoast_head_json?.title || `${category.name} - Mắt Kính Tâm Đức`,
                description: category.yoast_head_json?.description || category.description || `Tin tức ${category.name}`,
            };
        }
    } catch {
        // Not a blog category
    }

    // Try to get as blog post
    try {
        const post = await getPostBySlug(slug);
        if (post) {
            const description = post.excerpt.rendered
                .replace(/<[^>]*>/g, '')
                .substring(0, 160);
            return {
                title: post.yoast_head_json?.title || `${post.title.rendered} - Mắt Kính Tâm Đức`,
                description: post.yoast_head_json?.description || description,
            };
        }
    } catch {
        // Not a blog post
    }

    // Try to get as product
    try {
        const product = await getProductBySlug(slug);
        if (product) {
            const description = product.excerpt.rendered
                .replace(/<[^>]*>/g, '')
                .substring(0, 160);
            return {
                title: product.yoast_head_json?.title || `${product.title.rendered} - Mắt Kính Tâm Đức`,
                description: product.yoast_head_json?.description || description,
            };
        }
    } catch {
        // Not a product
    }

    // Try to get as page
    const page = await getPageBySlug(slug);
    if (!page) {
        return {
            title: 'Không tìm thấy trang',
        };
    }

    return {
        title: `${page.title.rendered} - Mắt Kính Tâm Đức`,
        description: page.title.rendered,
    };
}

// Generate static params for static generation
export async function generateStaticParams() {
    const slugs: { slug: string }[] = [];

    try {
        // Get all product categories (single level only)
        const productCategories = await getProductCategories();
        slugs.push(...productCategories.filter(c => !c.parent).map((cat) => ({ slug: cat.slug })));
    } catch (error) {
        console.error('Failed to generate static params for product categories:', error);
    }

    try {
        // Get all blog categories (single level only)
        const categories = await getCategories();
        slugs.push(...categories.filter(c => !c.parent).map((cat) => ({ slug: cat.slug })));
    } catch (error) {
        console.error('Failed to generate static params for categories:', error);
    }

    try {
        // Get all blog posts
        const posts = await getPosts({ perPage: 100 });
        slugs.push(...posts.map((post) => ({ slug: post.slug })));
    } catch (error) {
        console.error('Failed to generate static params for posts:', error);
    }

    try {
        // Get all products
        const products = await getProducts({ perPage: 100 });
        slugs.push(...products.map((product) => ({ slug: product.slug })));
    } catch (error) {
        console.error('Failed to generate static params for products:', error);
    }

    try {
        // Get all pages
        const pages = await getPages();
        slugs.push(...pages.map((page) => ({ slug: page.slug })));
    } catch (error) {
        console.error('Failed to generate static params for pages:', error);
    }

    return slugs;
}

export default async function WordPressPage({ params }: PageProps) {
    const { slug } = await params;

    // Try to get as product category first
    try {
        const category = await getProductCategoryBySlug(slug);
        if (category) {
            const products = await getProductsByCategory(category.id, { perPage: 24 });

            return (
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
                        {category.description && (
                            <p className="text-gray-600 mb-12">{category.description}</p>
                        )}

                        {products.length === 0 ? (
                            <p className="text-center text-gray-500">Chưa có sản phẩm nào trong danh mục này.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/${product.slug}`}
                                        className="group"
                                    >
                                        <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                                            {product._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                                                <div className="aspect-square bg-gray-100 overflow-hidden">
                                                    <img
                                                        src={product._embedded['wp:featuredmedia'][0].source_url}
                                                        alt={product._embedded['wp:featuredmedia'][0].alt_text || product.title.rendered}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                                                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                                                    {product.title.rendered}
                                                </h3>
                                                {product.excerpt.rendered && (
                                                    <div
                                                        className="text-sm text-gray-600 line-clamp-2"
                                                        dangerouslySetInnerHTML={{ __html: product.excerpt.rendered }}
                                                    />
                                                )}
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    } catch {
        // Not a product category
    }

    // Try to get as blog category
    try {
        const category = await getCategoryBySlug(slug);
        if (category) {
            const posts = await getPostsByCategory(category.id, { perPage: 20 });

            return (
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
                        {category.description && (
                            <p className="text-gray-600 mb-12">{category.description}</p>
                        )}

                        {posts.length === 0 ? (
                            <p className="text-center text-gray-500">Chưa có bài viết nào trong danh mục này.</p>
                        ) : (
                            <div className="space-y-8">
                                {posts.map((post) => (
                                    <article
                                        key={post.id}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                                    >
                                        <div className="md:flex">
                                            {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                                                <div className="md:w-1/3 bg-gray-200">
                                                    <img
                                                        src={post._embedded['wp:featuredmedia'][0].source_url}
                                                        alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="p-6 md:w-2/3">
                                                <time className="text-sm text-gray-500">
                                                    {new Date(post.date).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </time>
                                                <h2 className="text-2xl font-bold mt-2 mb-3">
                                                    <Link
                                                        href={`/${post.slug}`}
                                                        className="hover:text-blue-600 transition-colors"
                                                    >
                                                        {post.title.rendered}
                                                    </Link>
                                                </h2>
                                                <div
                                                    className="text-gray-600 line-clamp-3 mb-4"
                                                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                                                />
                                                <Link
                                                    href={`/${post.slug}`}
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                                                >
                                                    Đọc thêm
                                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    } catch {
        // Not a blog category
    }

    // Try to get as blog post
    try {
        const post = await getPostBySlug(slug);
        if (post) {
            return (
                <article className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto">
                        {/* Post Header */}
                        <header className="mb-8">
                            <time className="text-sm text-gray-500">
                                {new Date(post.date).toLocaleDateString('vi-VN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                            <h1 className="text-4xl font-bold mt-2 mb-6">
                                {post.title.rendered}
                            </h1>
                        </header>

                        {/* Featured Image */}
                        {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                            <div className="mb-8 rounded-lg overflow-hidden">
                                <img
                                    src={post._embedded['wp:featuredmedia'][0].source_url}
                                    alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                                    className="w-full h-auto"
                                />
                            </div>
                        )}

                        {/* Post Content */}
                        <div
                            className="wp-content prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                        />

                        {/* Back to Blog Link */}
                        <div className="mt-12 pt-8 border-t">
                            <Link
                                href="/blog"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Quay lại danh sách tin tức
                            </Link>
                        </div>
                    </div>
                </article>
            );
        }
    } catch {
        // Not a blog post, continue
    }

    // Try to get as product
    try {
        const product = await getProductBySlug(slug);
        if (product) {
            return (
                <article className="min-h-screen bg-forest-bg">
                    <div className="max-w-7xl mx-auto px-4 py-12">
                        {/* Breadcrumb */}
                        <nav className="mb-8" aria-label="Breadcrumb">
                            <ol className="flex items-center gap-2 text-sm">
                                <li>
                                    <Link href="/" className="text-forest-text/70 hover:text-forest-primary transition-colors">
                                        Trang chủ
                                    </Link>
                                </li>
                                <li className="text-forest-text/40">/</li>
                                <li>
                                    <Link href="/products" className="text-forest-text/70 hover:text-forest-primary transition-colors">
                                        Sản phẩm
                                    </Link>
                                </li>
                                <li className="text-forest-text/40">/</li>
                                <li className="text-forest-primary font-medium" aria-current="page">
                                    {product.title.rendered}
                                </li>
                            </ol>
                        </nav>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                            {/* Product Image Gallery */}
                            <div className="sticky top-4 self-start">
                                {product._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                                    <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                                        <div className="aspect-square bg-forest-bg">
                                            <img
                                                src={product._embedded['wp:featuredmedia'][0].source_url}
                                                alt={product._embedded['wp:featuredmedia'][0].alt_text || product.title.rendered}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                                        <div className="aspect-square bg-forest-bg flex items-center justify-center">
                                            <svg className="w-24 h-24 text-forest-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                {/* Trust Badges */}
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div className="bg-white rounded-xl p-4 text-center shadow-md">
                                        <svg className="w-8 h-8 mx-auto text-forest-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        <p className="text-xs font-semibold text-forest-text font-heading">Chất lượng</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 text-center shadow-md">
                                        <svg className="w-8 h-8 mx-auto text-forest-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        <p className="text-xs font-semibold text-forest-text font-heading">Thanh toán</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 text-center shadow-md">
                                        <svg className="w-8 h-8 mx-auto text-forest-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                        <p className="text-xs font-semibold text-forest-text font-heading">Giao hàng</p>
                                    </div>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div>
                                <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
                                    {/* Product Title */}
                                    <h1 className="text-3xl md:text-4xl font-bold text-forest-text mb-6 font-heading">
                                        {product.title.rendered}
                                    </h1>

                                    {/* Product Excerpt */}
                                    {product.excerpt.rendered && (
                                        <div
                                            className="text-lg text-forest-text/80 mb-8 pb-8 border-b border-forest-border font-sans"
                                            dangerouslySetInnerHTML={{ __html: product.excerpt.rendered }}
                                        />
                                    )}

                                    {/* Product Features */}
                                    <div className="space-y-4 mb-8 pb-8 border-b border-forest-border">
                                        <h3 className="text-lg font-semibold text-forest-text font-heading mb-4">
                                            Đặc điểm nổi bật:
                                        </h3>
                                        <div className="flex items-start gap-3">
                                            <svg className="w-6 h-6 text-forest-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-forest-text font-sans">100% thiên nhiên, thân thiện môi trường</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <svg className="w-6 h-6 text-forest-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-forest-text font-sans">Chất lượng cao, bền đẹp theo thời gian</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <svg className="w-6 h-6 text-forest-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-forest-text font-sans">Hỗ trợ tư vấn và chăm sóc miễn phí</span>
                                        </div>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                        <a
                                            href="tel:1900xxxx"
                                            className="flex-1 bg-forest-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-forest-primary/90 transition-colors text-center inline-flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            Gọi tư vấn ngay
                                        </a>
                                        <Link
                                            href="/lien-he"
                                            className="flex-1 border-2 border-forest-primary text-forest-primary px-8 py-4 rounded-xl font-semibold hover:bg-forest-bg transition-colors text-center inline-flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            Liên hệ
                                        </Link>
                                    </div>

                                    {/* Shipping Info */}
                                    <div className="bg-forest-bg rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <svg className="w-5 h-5 text-forest-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-semibold text-forest-text font-heading">Thông tin giao hàng</span>
                                        </div>
                                        <p className="text-sm text-forest-text/70 font-sans">
                                            Giao hàng toàn quốc. Miễn phí vận chuyển cho đơn hàng trên 500.000đ trong nội thành.
                                        </p>
                                    </div>
                                </div>

                                {/* Product Description */}
                                {product.content.rendered && (
                                    <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 mt-6">
                                        <h2 className="text-2xl font-bold text-forest-text mb-6 font-heading">
                                            Mô tả chi tiết
                                        </h2>
                                        <div
                                            className="wp-content prose prose-lg max-w-none"
                                            dangerouslySetInnerHTML={{ __html: product.content.rendered }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Back to Products Link */}
                        <div className="bg-white rounded-3xl shadow-lg p-6 max-w-7xl mx-auto">
                            <Link
                                href="/products"
                                className="inline-flex items-center text-forest-primary hover:text-forest-primary/80 font-semibold transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Quay lại danh sách sản phẩm
                            </Link>
                        </div>
                    </div>
                </article>
            );
        }
    } catch {
        // Not a product, continue
    }

    // Try to get as page
    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Page Header */}
                <header className="mb-8">
                    <h1 className="text-4xl font-bold">
                        {page.title.rendered}
                    </h1>
                </header>

                {/* Page Content */}
                <div
                    className="wp-content prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: page.content.rendered }}
                />
            </div>
        </div>
    );
}
