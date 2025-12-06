/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GraphQLProduct } from './graphql/products';
import type { GraphQLPost } from './graphql/posts';
import type { GraphQLPage } from './graphql/pages';
import type { WPProduct, WPPost, WPPage, WCProduct } from './wordpress';

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
export function graphQLProductToWPProduct(graphQLProduct: GraphQLProduct): WPProduct & Record<string, any> {
    // Get category databaseIds
    const categoryIds = graphQLProduct.productCategories?.nodes.map(cat => cat.databaseId || 0).filter(id => id > 0) || [];

    return {
        id: graphQLProduct.databaseId,
        date: graphQLProduct.date || new Date().toISOString(),
        slug: graphQLProduct.slug,
        title: {
            rendered: graphQLProduct.name,
        },
        content: {
            rendered: graphQLProduct.description || '',
        },
        excerpt: {
            rendered: graphQLProduct.shortDescription || graphQLProduct.description || '',
        },
        featured_media: 0,
        product_cat: categoryIds,
        product_tag: [],
        product_brand: [],
        _embedded: {
            'wp:featuredmedia': graphQLProduct.image ? [{
                source_url: graphQLProduct.image.sourceUrl,
                alt_text: graphQLProduct.image.altText || '',
            }] : undefined,
            'wp:term': graphQLProduct.productCategories ? [[
                ...graphQLProduct.productCategories.nodes.map(cat => ({
                    id: cat.databaseId || 0,
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
            sku: graphQLProduct.sku || graphQLProduct.slug?.toUpperCase() || '',
            price: parsePrice(graphQLProduct.price),
            regular_price: parsePrice(graphQLProduct.regularPrice),
            sale_price: parsePrice(graphQLProduct.salePrice),
            on_sale: graphQLProduct.onSale || false,
            stock_status: (graphQLProduct.stockStatus?.toLowerCase() as 'instock' | 'outofstock' | 'onbackorder') || 'instock',
            stock_quantity: graphQLProduct.stockQuantity || null,
            attributes: graphQLProduct.attributes?.nodes?.map((attr, index) => ({
                id: index + 1,
                name: attr.name,
                slug: attr.name?.toLowerCase().replace(/\s+/g, '-'),
                position: index,
                visible: true,
                variation: false,
                options: attr.options || [],
            })) || [],
            variations: (graphQLProduct.variations?.nodes?.map(variation => ({
                id: variation.databaseId,
                name: variation.name,
                price: parsePrice(variation.price),
                regular_price: parsePrice(variation.regularPrice),
                sale_price: parsePrice(variation.salePrice),
                stock_status: variation.stockStatus?.toLowerCase() || 'instock',
                stock_quantity: variation.stockQuantity || null,
                image: variation.image ? {
                    src: variation.image.sourceUrl,
                    alt: variation.image.altText || '',
                } : undefined,
                attributes: variation.attributes?.nodes?.map(attr => ({
                    name: attr.name,
                    option: attr.value,
                })) || [],
            })) || []) as any,
            average_rating: graphQLProduct.averageRating?.toString() || '0',
            rating_count: graphQLProduct.reviewCount || 0,
            gallery_images: graphQLProduct.galleryImages?.nodes?.map(img => ({
                src: img.sourceUrl,
                alt: img.altText || '',
            })) || [],
        } as WCProduct,
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
