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
            // Get related products from same category
            let relatedProducts: WPProduct[] = [];
            try {
                if (product.product_cat && product.product_cat.length > 0) {
                    const categoryId = product.product_cat[0];
                    const allProducts = await getProductsByCategory(categoryId, { perPage: 5 });
                    relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);
                }
            } catch {
                // Ignore related products error
            }

            return (
                <div className="relative flex min-h-screen w-full flex-col bg-[#F5F5F5]">
                    {/* Header */}
                    <header className="sticky top-0 z-20">
                        <div className="flex items-center bg-white p-4 justify-between border-b border-[#E5E5E5] max-w-7xl mx-auto">
                            <Link href="/products" className="flex items-center justify-center size-10 text-[#333333] hover:bg-gray-100 rounded-lg transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div className="hidden md:block">
                                <h1 className="text-lg font-semibold text-[#333333]">Chi tiết sản phẩm</h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center justify-center size-10 text-[#333333] hover:bg-gray-100 rounded-lg transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </header>

                    <main className="flex-grow pb-32 md:pb-8 max-w-7xl w-full mx-auto">
                        {/* Desktop: 2-column layout, Mobile: stacked */}
                        <div className="md:grid md:grid-cols-2 md:gap-8 md:p-6">
                            {/* Left Column: Image Carousel */}
                            <div className="md:sticky md:top-24 md:self-start">
                                <div className="relative bg-white md:rounded-2xl md:overflow-hidden md:shadow-lg">
                                    <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                                        {product._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                                            <div className="flex items-stretch snap-center shrink-0 w-full">
                                                <div className="flex h-full flex-1 flex-col">
                                                    <div className="w-full aspect-square bg-gray-100 bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${product._embedded['wp:featuredmedia'][0].source_url})` }} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-stretch snap-center shrink-0 w-full">
                                                <div className="flex h-full flex-1 flex-col">
                                                    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                                                        <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-4 left-0 right-0">
                                        <div className="flex w-full flex-row items-center justify-center gap-2 py-5">
                                            <div className="h-2 w-8 rounded-full bg-[#228B22]" />
                                            <div className="h-2 w-2 rounded-full bg-gray-300" />
                                            <div className="h-2 w-2 rounded-full bg-gray-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Product Info */}
                            <div className="space-y-2 md:space-y-4">
                                {/* Product Header */}
                                <div className="bg-white px-4 md:px-6 pt-6 pb-4 md:rounded-2xl md:shadow-lg">
                                    <h1 className="text-[#333333] tracking-tight text-2xl md:text-3xl font-bold leading-tight">
                                        {product.title.rendered}
                                    </h1>
                                    <p className="text-[#666666] text-sm font-normal leading-normal pt-1">
                                        SKU: {product.wc_data?.sku || product.slug.toUpperCase()}
                                    </p>
                                    <div className="flex items-baseline justify-between mt-3 md:mt-4">
                                        {product.wc_data?.price ? (
                                            <div>
                                                {product.wc_data.on_sale && product.wc_data.sale_price ? (
                                                    <>
                                                        <p className="text-[#228B22] text-3xl md:text-4xl font-bold">
                                                            {parseInt(product.wc_data.sale_price).toLocaleString('vi-VN')}₫
                                                        </p>
                                                        <p className="text-[#666666] text-lg line-through mt-1">
                                                            {parseInt(product.wc_data.regular_price).toLocaleString('vi-VN')}₫
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-[#228B22] text-3xl md:text-4xl font-bold">
                                                        {parseInt(product.wc_data.price).toLocaleString('vi-VN')}₫
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-[#228B22] text-3xl md:text-4xl font-bold">Liên hệ</p>
                                        )}
                                        {product.wc_data && parseFloat(product.wc_data.average_rating) > 0 ? (
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => {
                                                    const rating = parseFloat(product.wc_data!.average_rating);
                                                    if (star <= Math.floor(rating)) {
                                                        return (
                                                            <svg key={star} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                            </svg>
                                                        );
                                                    } else if (star === Math.ceil(rating) && rating % 1 !== 0) {
                                                        return (
                                                            <svg key={star} className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                            </svg>
                                                        );
                                                    } else {
                                                        return (
                                                            <svg key={star} className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                            </svg>
                                                        );
                                                    }
                                                })}
                                                <span className="text-[#666666] text-sm ml-1">({product.wc_data.rating_count})</span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Variant Selector - Only show color attribute */}
                                {product.wc_data?.attributes && (() => {
                                    const colorAttr = product.wc_data.attributes.find(attr =>
                                        attr.name.toLowerCase().includes('màu') ||
                                        attr.slug?.toLowerCase().includes('color') ||
                                        attr.slug?.toLowerCase().includes('mau')
                                    );

                                    if (!colorAttr || colorAttr.options.length === 0) return null;

                                    return (
                                        <div className="bg-white px-4 md:px-6 py-4 md:rounded-2xl md:shadow-lg">
                                            <h2 className="text-[#333333] text-base font-semibold mb-3">
                                                {colorAttr.name}: {colorAttr.options[0]}
                                            </h2>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {colorAttr.options.map((option, index) => (
                                                    <button
                                                        key={index}
                                                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${index === 0
                                                            ? 'border-[#228B22] bg-[#228B22] text-white'
                                                            : 'border-[#E5E5E5] text-[#333333] hover:border-[#228B22] hover:text-[#228B22]'
                                                            }`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Desktop CTA Buttons - Show only on desktop */}
                                <div className="hidden md:block bg-white px-6 py-6 rounded-2xl shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <button className="flex-1 flex items-center justify-center h-14 rounded-lg bg-[#228B22]/20 text-[#228B22] gap-2 font-bold text-base hover:bg-[#228B22]/30 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Thêm vào giỏ
                                        </button>
                                        <Link
                                            href="/lien-he"
                                            className="flex-1 flex items-center justify-center h-14 rounded-lg bg-[#228B22] text-white font-bold text-base hover:bg-[#1a6b1a] transition-colors"
                                        >
                                            Mua ngay
                                        </Link>
                                    </div>
                                </div>

                                {/* Accordion for Details */}
                                <div className="space-y-2 md:space-y-3">
                                    {/* Description */}
                                    <div className="bg-white px-4 md:px-6 md:rounded-2xl md:shadow-lg">
                                        <details className="group">
                                            <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm md:text-base font-semibold text-[#333333]">
                                                Mô tả sản phẩm
                                                <span className="transition group-open:rotate-180">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </span>
                                            </summary>
                                            {product.excerpt.rendered && (
                                                <div
                                                    className="pb-4 text-[#666666] text-sm md:text-base prose prose-sm md:prose-base max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: product.excerpt.rendered }}
                                                />
                                            )}
                                        </details>
                                    </div>

                                    {/* Specifications */}
                                    <div className="bg-white px-4 md:px-6 md:rounded-2xl md:shadow-lg">
                                        <details className="group">
                                            <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm md:text-base font-semibold text-[#333333]">
                                                Thông số kỹ thuật
                                                <span className="transition group-open:rotate-180">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </span>
                                            </summary>
                                            <div className="pb-4 text-[#666666] text-sm md:text-base">
                                                <ul className="space-y-1 list-disc pl-5">
                                                    <li>Chất liệu: Acetate cao cấp</li>
                                                    <li>Chiều rộng mắt kính: 52mm</li>
                                                    <li>Chiều dài cầu kính: 18mm</li>
                                                    <li>Chiều dài gọng: 145mm</li>
                                                    <li>Xuất xứ: Hàn Quốc</li>
                                                </ul>
                                            </div>
                                        </details>
                                    </div>

                                    {/* Warranty */}
                                    <div className="bg-white px-4 md:px-6 md:rounded-2xl md:shadow-lg">
                                        <details className="group">
                                            <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm md:text-base font-semibold text-[#333333]">
                                                Chính sách bảo hành & Đổi trả
                                                <span className="transition group-open:rotate-180">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </span>
                                            </summary>
                                            <p className="pb-4 text-[#666666] text-sm md:text-base">
                                                Bảo hành 12 tháng cho các lỗi từ nhà sản xuất. Hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm không đúng mô tả hoặc có lỗi. Vui lòng giữ nguyên tem mác và hóa đơn mua hàng.
                                            </p>
                                        </details>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Related Products */}
                        {relatedProducts.length > 0 && (
                            <div className="mt-6 md:mt-12 md:px-6">
                                <h2 className="text-[#333333] text-xl md:text-2xl font-bold px-4 md:px-0 mb-3 md:mb-6">Có thể bạn sẽ thích</h2>
                                <div className="flex overflow-x-auto scrollbar-hide md:grid md:grid-cols-4 md:gap-6">
                                    <div className="flex items-stretch px-4 md:px-0 gap-4 md:contents">
                                        {relatedProducts.map((relatedProduct) => (
                                            <Link
                                                key={relatedProduct.id}
                                                href={`/${relatedProduct.slug}`}
                                                className="flex h-full flex-col gap-2 rounded-lg min-w-40 md:min-w-0 bg-white md:shadow-lg md:p-4 hover:shadow-xl transition-shadow"
                                            >
                                                <div
                                                    className="w-full aspect-square bg-gray-100 bg-center bg-no-repeat bg-cover rounded-lg"
                                                    style={{
                                                        backgroundImage: relatedProduct._embedded?.['wp:featuredmedia']?.[0]?.source_url
                                                            ? `url(${relatedProduct._embedded['wp:featuredmedia'][0].source_url})`
                                                            : 'none'
                                                    }}
                                                />
                                                <p className="text-sm font-medium text-[#333333] line-clamp-2">
                                                    {relatedProduct.title.rendered}
                                                </p>
                                                <p className="text-sm font-semibold text-[#228B22]">Liên hệ</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Sticky CTA Bar - Mobile only */}
                    <footer className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm p-4 border-t border-[#E5E5E5]">
                        <div className="flex items-center gap-4">
                            <button className="flex-1 flex items-center justify-center h-12 rounded-lg bg-[#228B22]/20 text-[#228B22] gap-2 font-bold text-base">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Thêm vào giỏ
                            </button>
                            <Link
                                href="/lien-he"
                                className="flex-1 flex items-center justify-center h-12 rounded-lg bg-[#228B22] text-white font-bold text-base"
                            >
                                Mua ngay
                            </Link>
                        </div>
                    </footer>
                </div>
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
