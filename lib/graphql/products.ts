/* eslint-disable @typescript-eslint/no-explicit-any */
import { graphqlClient } from '../graphql-client';
import { GET_PRODUCTS, GET_PRODUCT_BY_SLUG, GET_PRODUCT_CATEGORIES } from './queries/products';

interface GetProductsParams {
    first?: number;
    after?: string;
    categorySlug?: string;
    categoryIn?: string[];
    minPrice?: number;
    maxPrice?: number;
    orderBy?: 'DATE' | 'TITLE' | 'PRICE';
    order?: 'ASC' | 'DESC';
}

export interface GraphQLProductVariation {
    id: string;
    databaseId: number;
    name: string;
    price?: string;
    regularPrice?: string;
    salePrice?: string;
    stockStatus?: string;
    stockQuantity?: number;
    image?: {
        sourceUrl: string;
        altText: string;
    };
    attributes?: {
        nodes: Array<{
            name: string;
            value: string;
        }>;
    };
}

export interface GraphQLProduct {
    id: string;
    databaseId: number;
    name: string;
    slug: string;
    date: string;
    type?: string;
    description?: string;
    shortDescription?: string;
    sku?: string;
    price?: string;
    regularPrice?: string;
    salePrice?: string;
    onSale?: boolean;
    stockStatus?: string;
    stockQuantity?: number;
    averageRating?: number;
    reviewCount?: number;
    image?: {
        sourceUrl: string;
        altText: string;
    };
    galleryImages?: {
        nodes: Array<{
            sourceUrl: string;
            altText: string;
        }>;
    };
    productCategories?: {
        nodes: Array<{
            id: string;
            databaseId?: number;
            name: string;
            slug: string;
        }>;
    };
    attributes?: {
        nodes: Array<{
            name: string;
            options: string[];
        }>;
    };
    variations?: {
        nodes: GraphQLProductVariation[];
    };
}

export async function getProducts(params: GetProductsParams = {}) {
    try {
        const data: any = await graphqlClient.request(GET_PRODUCTS, params);
        return data.products;
    } catch (error) {
        console.error('GraphQL Error fetching products:', error);
        throw error;
    }
}

/**
 * Fetch ALL products using cursor-based pagination
 * WPGraphQL limits to ~100 products per request, so we paginate
 * For category filtering: fetches all products then filters by category
 */
export async function getAllProducts(categorySlug?: string): Promise<GraphQLProduct[]> {
    const allProducts: GraphQLProduct[] = [];
    let hasNextPage = true;
    let afterCursor: string | null = null;

    // Get category info if provided
    let targetCategorySlugs: string[] = [];
    if (categorySlug) {
        try {
            const data: any = await graphqlClient.request(GET_PRODUCT_CATEGORIES);
            const allCategories = data.productCategories?.nodes || [];

            // Find main category
            const mainCategory = allCategories.find((c: any) => c.slug === categorySlug);
            if (mainCategory) {
                targetCategorySlugs.push(categorySlug);

                // Find children by parentDatabaseId
                const children = allCategories.filter((c: any) =>
                    c.parentDatabaseId === mainCategory.databaseId
                );
                targetCategorySlugs.push(...children.map((c: any) => c.slug));

                // Find grandchildren
                children.forEach((child: any) => {
                    const grandchildren = allCategories.filter((c: any) =>
                        c.parentDatabaseId === child.databaseId
                    );
                    targetCategorySlugs.push(...grandchildren.map((c: any) => c.slug));
                });

                console.log(`[getAllProducts] Category ${categorySlug} tree has ${targetCategorySlugs.length} slugs`);
            }
        } catch (error) {
            console.error('Error building category tree:', error);
            targetCategorySlugs = [categorySlug];
        }
    }

    // Fetch products - use category filter if we have targets, otherwise fetch all
    while (hasNextPage) {
        try {
            const params: GetProductsParams = {
                first: 100,
            };

            // Only use category filter if we found category slugs
            if (targetCategorySlugs.length > 0) {
                params.categoryIn = targetCategorySlugs;
            }

            if (afterCursor) {
                params.after = afterCursor;
            }

            const data: any = await graphqlClient.request(GET_PRODUCTS, params);
            const products = data.products;

            const nodes = products.edges.map((edge: any) => edge.node);
            allProducts.push(...nodes);

            hasNextPage = products.pageInfo.hasNextPage;
            afterCursor = products.pageInfo.endCursor;

            if (allProducts.length > 2000) {
                console.warn('getAllProducts: Safety limit reached');
                break;
            }
        } catch (error) {
            console.error('GraphQL Error fetching products:', error);
            break;
        }
    }

    // If category filter didn't work well (few products), try filtering from all products
    if (categorySlug && allProducts.length < 50 && targetCategorySlugs.length === 1) {
        console.log(`[getAllProducts] Few products found, fetching all and filtering client-side`);

        // Fetch ALL products without category filter
        const allProds: GraphQLProduct[] = [];
        hasNextPage = true;
        afterCursor = null;

        while (hasNextPage) {
            try {
                const params: GetProductsParams = { first: 100 };
                if (afterCursor) params.after = afterCursor;

                const data: any = await graphqlClient.request(GET_PRODUCTS, params);
                const products = data.products;

                allProds.push(...products.edges.map((edge: any) => edge.node));
                hasNextPage = products.pageInfo.hasNextPage;
                afterCursor = products.pageInfo.endCursor;

                if (allProds.length > 2000) break;
            } catch {
                break;
            }
        }

        // Filter products that have categorySlug in their productCategories
        const filtered = allProds.filter((p: any) => {
            const cats = p.productCategories?.nodes || [];
            return cats.some((c: any) =>
                c.slug === categorySlug ||
                c.slug?.includes(categorySlug) ||
                categorySlug.includes(c.slug)
            );
        });

        console.log(`[getAllProducts] Client-side filter: ${filtered.length} products match ${categorySlug}`);
        if (filtered.length > allProducts.length) {
            return filtered;
        }
    }

    console.log(`[getAllProducts] Total: ${allProducts.length} products`);
    return allProducts;
}

export async function getProductBySlug(slug: string) {
    try {
        const data: any = await graphqlClient.request(GET_PRODUCT_BY_SLUG, { slug });
        return data.product;
    } catch (error) {
        // Return null if product not found (don't log error for 404s)
        return null;
    }
}

export async function getProductCategories() {
    try {
        const data: any = await graphqlClient.request(GET_PRODUCT_CATEGORIES);
        return data.productCategories.nodes;
    } catch (error) {
        console.error('GraphQL Error fetching categories:', error);
        return [];
    }
}
