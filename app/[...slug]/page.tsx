import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    getPostsByCategory,
    getProductsByCategory,
    getCategories,
} from '@/lib/wordpress';
import { getProductCategoryBySlug, getPostCategoryBySlug, getProductCategories, getPostCategories } from '@/lib/graphql/categories';
import type { Metadata } from 'next';

interface CategoryPageProps {
    params: Promise<{
        slug: string[];
    }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const lastSlug = slug[slug.length - 1];

    // Try product category first (GraphQL)
    try {
        const category = await getProductCategoryBySlug(lastSlug);
        if (category) {
            return {
                title: `${category.name} - Mắt Kính Tâm Đức`,
                description: category.description || `Khám phá ${category.name}`,
            };
        }
    } catch {
        // Not a product category
    }

    // Try blog category (GraphQL)
    try {
        const category = await getPostCategoryBySlug(lastSlug);
        if (category) {
            return {
                title: `${category.name} - Mắt Kính Tâm Đức`,
                description: category.description || `Tin tức ${category.name}`,
            };
        }
    } catch {
        // Not found
    }

    return {
        title: 'Danh mục - Mắt Kính Tâm Đức',
    };
}

// Generate static params for static generation
export async function generateStaticParams() {
    const slugs: { slug: string[] }[] = [];

    try {
        // Get all product categories and create paths (GraphQL)
        const productCategories = await getProductCategories();
        for (const category of productCategories) {
            // Handle parent/child relationships
            if (category.parent) {
                // Find parent category
                const parentCat = productCategories.find((c: any) => c.databaseId === category.parent.node?.databaseId);
                if (parentCat) {
                    slugs.push({ slug: [parentCat.slug, category.slug] });
                }
            }
        }
    } catch (error) {
        console.error('Failed to generate static params for product categories:', error);
    }

    try {
        // Get all blog categories and create paths (GraphQL)
        const categories = await getPostCategories();
        for (const category of categories) {
            if (category.parent) {
                const parentCat = categories.find((c: any) => c.databaseId === category.parent.node?.databaseId);
                if (parentCat) {
                    slugs.push({ slug: [parentCat.slug, category.slug] });
                }
            }
        }
    } catch (error) {
        console.error('Failed to generate static params for categories:', error);
    }

    return slugs;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const lastSlug = slug[slug.length - 1];

    // Try to get as product category
    try {
        const category = await getProductCategoryBySlug(lastSlug);
        if (category) {
            const products = await getProductsByCategory(category.id, { perPage: 24 });

            return (
                <div className="min-h-screen bg-gradient-to-br from-luxury-bg via-white to-luxury-bg/50">
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-7xl mx-auto">
                            {/* Breadcrumb with Glassmorphism */}
                            <nav className="mb-8" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-2 text-sm backdrop-blur-glass bg-white/70 border border-luxury-border rounded-full px-6 py-3 shadow-sm w-fit">
                                    <li>
                                        <Link href="/" className="text-luxury-secondary hover:text-luxury-cta transition-colors duration-200 font-medium">
                                            Trang chủ
                                        </Link>
                                    </li>
                                    {slug.map((s, index) => {
                                        const path = `/${slug.slice(0, index + 1).join('/')}`;
                                        const isLast = index === slug.length - 1;
                                        return (
                                            <li key={s} className="flex items-center">
                                                <svg className="w-4 h-4 mx-2 text-luxury-border" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                                {isLast ? (
                                                    <span className="text-luxury-text font-semibold">{category.name}</span>
                                                ) : (
                                                    <Link href={path} className="text-luxury-secondary hover:text-luxury-cta transition-colors duration-200 font-medium capitalize">
                                                        {s}
                                                    </Link>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ol>
                            </nav>

                            {/* Category Header */}
                            <div className="mb-12 text-center">
                                <h1 className="font-heading text-5xl md:text-6xl font-bold text-luxury-primary mb-4 tracking-tight">
                                    {category.name}
                                </h1>
                                {category.description && (
                                    <p className="text-lg text-luxury-secondary max-w-3xl mx-auto leading-relaxed">
                                        {category.description}
                                    </p>
                                )}
                            </div>

                            {products.length === 0 ? (
                                <div className="backdrop-blur-glass bg-white/50 border border-luxury-border rounded-2xl p-12 text-center shadow-lg">
                                    <svg className="w-20 h-20 text-luxury-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-luxury-secondary text-lg">Chưa có sản phẩm nào trong danh mục này.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/${product.slug}`}
                                            className="group cursor-pointer"
                                        >
                                            <article className="relative backdrop-blur-glass bg-white/80 border border-luxury-border rounded-2xl overflow-hidden hover:shadow-2xl hover:border-luxury-cta/50 transition-all duration-300 hover:-translate-y-1">
                                                {product._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                                                    <div className="aspect-square bg-luxury-bg/30 overflow-hidden relative">
                                                        <Image
                                                            src={product._embedded['wp:featuredmedia'][0].source_url}
                                                            alt={product._embedded['wp:featuredmedia'][0].alt_text || product.title.rendered}
                                                            fill
                                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    </div>
                                                ) : (
                                                    <div className="aspect-square bg-gradient-to-br from-luxury-bg to-luxury-border/20 flex items-center justify-center">
                                                        <svg className="w-16 h-16 text-luxury-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="p-5">
                                                    <h3 className="font-heading font-semibold text-luxury-text group-hover:text-luxury-cta transition-colors duration-200 line-clamp-2 mb-2 text-lg">
                                                        {product.title.rendered}
                                                    </h3>
                                                    {product.excerpt.rendered && (
                                                        <div
                                                            className="text-sm text-luxury-secondary line-clamp-2 leading-relaxed"
                                                            dangerouslySetInnerHTML={{ __html: product.excerpt.rendered }}
                                                        />
                                                    )}
                                                    <div className="mt-4 flex items-center text-luxury-cta font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <span>Xem chi tiết</span>
                                                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </article>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    } catch {
        // Not a product category, continue
    }

    // Try to get as blog category
    try {
        const category = await getCategoryBySlug(lastSlug);
        if (category) {
            const posts = await getPostsByCategory(category.id, { perPage: 20 });

            return (
                <div className="min-h-screen bg-gradient-to-br from-luxury-bg via-white to-luxury-bg/50">
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto">
                            {/* Breadcrumb */}
                            <nav className="mb-8" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-2 text-sm backdrop-blur-glass bg-white/70 border border-luxury-border rounded-full px-6 py-3 shadow-sm w-fit">
                                    <li><Link href="/" className="text-luxury-secondary hover:text-luxury-cta transition-colors duration-200 font-medium">Trang chủ</Link></li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 mx-2 text-luxury-border" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <Link href="/blog" className="text-luxury-secondary hover:text-luxury-cta transition-colors duration-200 font-medium">Tin tức</Link>
                                    </li>
                                    {slug.map((s, index) => {
                                        const path = `/${slug.slice(0, index + 1).join('/')}`;
                                        const isLast = index === slug.length - 1;
                                        return (
                                            <li key={s} className="flex items-center">
                                                <svg className="w-4 h-4 mx-2 text-luxury-border" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                                {isLast ? (
                                                    <span className="text-luxury-text font-semibold">{category.name}</span>
                                                ) : (
                                                    <Link href={path} className="text-luxury-secondary hover:text-luxury-cta transition-colors duration-200 font-medium capitalize">{s}</Link>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ol>
                            </nav>

                            <div className="mb-12 text-center">
                                <h1 className="font-heading text-5xl md:text-6xl font-bold text-luxury-primary mb-4 tracking-tight">{category.name}</h1>
                                {category.description && (
                                    <p className="text-lg text-luxury-secondary max-w-3xl mx-auto leading-relaxed">{category.description}</p>
                                )}
                            </div>

                            {posts.length === 0 ? (
                                <div className="backdrop-blur-glass bg-white/50 border border-luxury-border rounded-2xl p-12 text-center shadow-lg">
                                    <p className="text-luxury-secondary text-lg">Chưa có bài viết nào trong danh mục này.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {posts.map((post) => (
                                        <article
                                            key={post.id}
                                            className="backdrop-blur-glass bg-white/80 border border-luxury-border rounded-2xl overflow-hidden hover:shadow-2xl hover:border-luxury-cta/50 transition-all duration-300 group"
                                        >
                                            <div className="md:flex">
                                                {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                                                    <div className="md:w-1/3 bg-luxury-bg/30 relative overflow-hidden">
                                                        <div className="relative h-64 md:h-full">
                                                            <Image
                                                                src={post._embedded['wp:featuredmedia'][0].source_url}
                                                                alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                                                                fill
                                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="p-6 md:w-2/3">
                                                    <time className="text-sm text-luxury-secondary font-medium">
                                                        {new Date(post.date).toLocaleDateString('vi-VN', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </time>
                                                    <h2 className="font-heading text-2xl font-bold mt-2 mb-3">
                                                        <Link
                                                            href={`/${post.slug}`}
                                                            className="text-luxury-text hover:text-luxury-cta transition-colors duration-200"
                                                        >
                                                            {post.title.rendered}
                                                        </Link>
                                                    </h2>
                                                    <div
                                                        className="text-luxury-secondary line-clamp-3 mb-4 leading-relaxed"
                                                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                                                    />
                                                    <Link
                                                        href={`/${post.slug}`}
                                                        className="inline-flex items-center text-luxury-cta hover:text-luxury-gold font-semibold transition-colors duration-200 cursor-pointer"
                                                    >
                                                        Đọc thêm
                                                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                </div>
            );
        }
    } catch {
        // Not a blog category
    }

    // If not found, show 404
    notFound();
}
