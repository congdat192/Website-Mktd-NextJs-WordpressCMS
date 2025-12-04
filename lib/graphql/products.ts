/* eslint-disable @typescript-eslint/no-explicit-any */
import { graphqlClient } from '../graphql-client';
import { GET_PRODUCTS, GET_PRODUCT_BY_SLUG, GET_PRODUCT_CATEGORIES } from './queries/products';

interface GetProductsParams {
    first?: number;
    after?: string;
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    orderBy?: 'DATE' | 'TITLE' | 'PRICE';
    order?: 'ASC' | 'DESC';
}

export interface GraphQLProduct {
    id: string;
    databaseId: number;
    name: string;
    slug: string;
    date: string;
    price?: string;
    regularPrice?: string;
    salePrice?: string;
    onSale?: boolean;
    stockStatus?: string;
    averageRating?: number;
    reviewCount?: number;
    image?: {
        sourceUrl: string;
        altText: string;
    };
    productCategories?: {
        nodes: Array<{
            id: string;
            name: string;
            slug: string;
        }>;
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
