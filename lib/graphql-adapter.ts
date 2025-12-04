import type { GraphQLProduct } from './graphql/products';
import type { GraphQLPost } from './graphql/posts';
import type { GraphQLPage } from './graphql/pages';
import type { WPProduct, WPPost, WPPage } from './wordpress';

/**
 * Parse formatted price string to number
 * Example: "1.920.000 ₫" -> "1920000"
 */
function parsePrice(priceString?: string): string {
    if (!priceString) return '0';
    // Remove all non-digit characters except decimal point
    const cleaned = priceString.replace(/[^\d]/g, '');
    return cleaned || '0';
}

/**
 * Convert GraphQL product to WordPress REST API format
 * This allows us to use GraphQL data with existing components
 */
export function graphQLProductToWPProduct(graphQLProduct: GraphQLProduct): WPProduct {
    return {
        id: graphQLProduct.databaseId,
        date: graphQLProduct.date || new Date().toISOString(),
        slug: graphQLProduct.slug,
        title: {
            rendered: graphQLProduct.name,
        },
        content: {
            rendered: '', // Not fetched in list view
        },
        excerpt: {
            rendered: '', // Not fetched in list view
        },
        featured_media: 0,
        product_cat: graphQLProduct.productCategories?.nodes.map(cat => parseInt(cat.id)) || [],
        product_tag: [],
        product_brand: [],
        _embedded: {
            'wp:featuredmedia': graphQLProduct.image ? [{
                source_url: graphQLProduct.image.sourceUrl,
                alt_text: graphQLProduct.image.altText || '',
            }] : undefined,
            'wp:term': graphQLProduct.productCategories ? [[
                ...graphQLProduct.productCategories.nodes.map(cat => ({
                    id: parseInt(cat.id),
                    name: cat.name,
                    slug: cat.slug,
                    taxonomy: 'product_cat' as const,
                    count: 0,
                    description: '',
                    link: '',
                    parent: 0,
                    meta: {},
                }))
            ]] : undefined,
        },
        wc_data: {
            id: graphQLProduct.databaseId,
            name: graphQLProduct.name,
            slug: graphQLProduct.slug,
            sku: '',
            price: parsePrice(graphQLProduct.price),
            regular_price: parsePrice(graphQLProduct.regularPrice),
            sale_price: parsePrice(graphQLProduct.salePrice),
            on_sale: graphQLProduct.onSale || false,
            stock_status: (graphQLProduct.stockStatus?.toLowerCase() as 'instock' | 'outofstock' | 'onbackorder') || 'instock',
            stock_quantity: null,
            attributes: [],
            variations: [],
            average_rating: graphQLProduct.averageRating?.toString() || '0',
            rating_count: graphQLProduct.reviewCount || 0,
        },
    };
}

/**
 * Convert array of GraphQL products to WP products
 */
export function graphQLProductsToWPProducts(graphQLProducts: GraphQLProduct[]): WPProduct[] {
    return graphQLProducts.map(graphQLProductToWPProduct);
}

/**
 * Convert GraphQL post to WordPress REST API format
 */
export function graphQLPostToWPPost(graphQLPost: GraphQLPost): WPPost {
    return {
        id: graphQLPost.databaseId,
        date: graphQLPost.date,
        slug: graphQLPost.slug,
        title: {
            rendered: graphQLPost.title,
        },
        content: {
            rendered: graphQLPost.content,
        },
        excerpt: {
            rendered: graphQLPost.excerpt,
        },
        author: 0,
        featured_media: 0,
        yoast_head_json: graphQLPost.seo ? {
            title: graphQLPost.seo.title,
            description: graphQLPost.seo.metaDesc,
            og_title: graphQLPost.seo.opengraphTitle,
            og_description: graphQLPost.seo.opengraphDescription,
            og_image: graphQLPost.seo.opengraphImage ? [{
                url: graphQLPost.seo.opengraphImage.sourceUrl,
            }] : undefined,
        } : undefined,
        _embedded: {
            'wp:featuredmedia': graphQLPost.featuredImage ? [{
                source_url: graphQLPost.featuredImage.node.sourceUrl,
                alt_text: graphQLPost.featuredImage.node.altText || '',
            }] : undefined,
        },
    };
}

/**
 * Convert array of GraphQL posts to WP posts
 */
export function graphQLPostsToWPPosts(graphQLPosts: GraphQLPost[]): WPPost[] {
    return graphQLPosts.map(graphQLPostToWPPost);
}

/**
 * Convert GraphQL page to WordPress REST API format
 */
export function graphQLPageToWPPage(graphQLPage: GraphQLPage): WPPage {
    return {
        id: graphQLPage.databaseId,
        date: graphQLPage.date,
        slug: graphQLPage.slug,
        title: {
            rendered: graphQLPage.title,
        },
        content: {
            rendered: graphQLPage.content,
        },
    };
}

/**
 * Convert array of GraphQL pages to WP pages
 */
export function graphQLPagesToWPPages(graphQLPages: GraphQLPage[]): WPPage[] {
    return graphQLPages.map(graphQLPageToWPPage);
}
