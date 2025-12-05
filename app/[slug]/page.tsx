import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    getPostsByCategory,
    WPProduct,
} from '@/lib/wordpress';
import { getProductBySlug, getProducts, getAllProducts } from '@/lib/graphql/products';
import { getPostBySlug, getPosts } from '@/lib/graphql/posts';
import { getPageBySlug, getPages } from '@/lib/graphql/pages';
import {
    getProductCategoryBySlug,
    getPostCategoryBySlug,
    getProductCategories,
    getPostCategories
} from '@/lib/graphql/categories';
import { graphQLProductToWPProduct, graphQLProductsToWPProducts } from '@/lib/graphql-adapter';
import { ProductDetailRedesign } from '@/components/product/ProductDetailRedesign';
import { CategoryProductListing } from '@/components/category';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    // Try to get as product category first (GraphQL)
    try {
        const category = await getProductCategoryBySlug(slug);
        if (category) {
            return {
                title: `${category.name} - Mắt Kính Tâm Đức`,
                description: category.description || `Khám phá ${category.name}`,
            };
        }
    } catch {
        // Not a product category
    }

    // Try to get as blog category (GraphQL)
    try {
        const category = await getPostCategoryBySlug(slug);
        if (category) {
            return {
                title: `${category.name} - Mắt Kính Tâm Đức`,
                description: category.description || `Tin tức ${category.name}`,
            };
        }
    } catch {
        // Not a blog category
    }

    // Try to get as blog post (GraphQL)
    try {
        const graphQLPost = await getPostBySlug(slug);
        if (graphQLPost) {
            // Extract plain text from excerpt
            const tempDiv = graphQLPost.excerpt?.replace(/<[^>]*>/g, '') || '';
            const description = tempDiv.substring(0, 160);
            return {
                title: `${graphQLPost.title} - Mắt Kính Tâm Đức`,
                description: description || graphQLPost.title,
            };
        }
    } catch {
        // Not a blog post
    }

    // Try to get as product (GraphQL)
    try {
        const product = await getProductBySlug(slug);
        if (product) {
            const description = product.shortDescription?.replace(/<[^>]*>/g, '').substring(0, 160) || '';
            return {
                title: `${product.name} - Mắt Kính Tâm Đức`,
                description: description || product.name,
            };
        }
    } catch {
        // Not a product
    }

    // Try to get as page (GraphQL)
    try {
        const graphQLPage = await getPageBySlug(slug);
        if (graphQLPage) {
            return {
                title: `${graphQLPage.title} - Mắt Kính Tâm Đức`,
                description: graphQLPage.title,
            };
        }
    } catch {
        // Not a page
    }

    return {
        title: 'Không tìm thấy trang - Mắt Kính Tâm Đức',
    };
}

// Generate static params for static generation
export async function generateStaticParams() {
    const slugs: { slug: string }[] = [];

    try {
        // Get all product categories (GraphQL - single level only)
        const productCategories = await getProductCategories();
        slugs.push(...productCategories.filter((c: any) => !c.parent).map((cat: any) => ({ slug: cat.slug })));
    } catch (error) {
        console.error('Failed to generate static params for product categories:', error);
    }

    try {
        // Get all blog categories (GraphQL - single level only)
        const categories = await getPostCategories();
        slugs.push(...categories.filter((c: any) => !c.parent).map((cat: any) => ({ slug: cat.slug })));
    } catch (error) {
        console.error('Failed to generate static params for categories:', error);
    }

    try {
        // Get all blog posts (GraphQL)
        const postsResult = await getPosts({ first: 100 });
        const posts = postsResult.nodes || [];
        slugs.push(...posts.map((post: any) => ({ slug: post.slug })));
    } catch (error) {
        console.error('Failed to generate static params for posts:', error);
    }

    try {
        // Get all products (GraphQL)
        const productsResult = await getProducts({ first: 100 });
        const products = productsResult.edges.map((edge: any) => edge.node);
        slugs.push(...products.map((product: any) => ({ slug: product.slug })));
    } catch (error) {
        console.error('Failed to generate static params for products:', error);
    }

    try {
        // Get all pages (GraphQL)
        const pagesResult = await getPages();
        const pages = pagesResult.nodes || [];
        slugs.push(...pages.map((page: any) => ({ slug: page.slug })));
    } catch (error) {
        console.error('Failed to generate static params for pages:', error);
    }

    return slugs;
}

export default async function WordPressPage({ params }: PageProps) {
    const { slug } = await params;

    // Try to get as product category first (GraphQL)
    try {
        const category = await getProductCategoryBySlug(slug);
        if (category) {
            // Fetch ALL products using pagination
            const allGraphQLProducts = await getAllProducts(slug);
            const products = graphQLProductsToWPProducts(allGraphQLProducts);
            console.log(`[${slug}] Loaded ${products.length} products`);

            return (
                <CategoryProductListing
                    categoryName={category.name}
                    categoryDescription={category.description || ''}
                    products={products}
                    showHeroBanner={false}
                />
            );
        }
    } catch {
        // Not a product category
    }

    // Try to get as blog category (GraphQL)
    try {
        const category = await getPostCategoryBySlug(slug);
        if (category) {
            const posts = await getPostsByCategory(category.databaseId, { perPage: 20 });

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

    // Try to get as PRODUCT first (before blog post)
    try {
        const graphQLProduct = await getProductBySlug(slug);
        if (graphQLProduct) {
            // Convert GraphQL product to WP format
            const product = graphQLProductToWPProduct(graphQLProduct);

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
                <ProductDetailRedesign
                    product={product}
                    relatedProducts={relatedProducts}
                />
            );
        }
    } catch {
        // Not a product, continue
    }

    // Try to get as blog post (GraphQL)
    try {
        const graphQLPost = await getPostBySlug(slug);
        if (graphQLPost) {
            return (
                <article className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto">
                        {/* Post Header */}
                        <header className="mb-8">
                            <time className="text-sm text-gray-500">
                                {new Date(graphQLPost.date).toLocaleDateString('vi-VN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                            <h1 className="text-4xl font-bold mt-2 mb-6">
                                {graphQLPost.title}
                            </h1>
                        </header>

                        {/* Featured Image */}
                        {graphQLPost.featuredImage?.node?.sourceUrl && (
                            <div className="mb-8 rounded-lg overflow-hidden">
                                <img
                                    src={graphQLPost.featuredImage.node.sourceUrl}
                                    alt={graphQLPost.featuredImage.node.altText || graphQLPost.title}
                                    className="w-full h-auto"
                                />
                            </div>
                        )}

                        {/* Post Content */}
                        <div
                            className="wp-content prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: graphQLPost.content }}
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

    // Try to get as page (GraphQL)
    const graphQLPage = await getPageBySlug(slug);

    if (!graphQLPage) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Page Header */}
                <header className="mb-8">
                    <h1 className="text-4xl font-bold">
                        {graphQLPage.title}
                    </h1>
                </header>

                {/* Page Content */}
                <div
                    className="wp-content prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: graphQLPage.content }}
                />
            </div>
        </div>
    );
}
