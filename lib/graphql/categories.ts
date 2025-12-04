import { graphqlClient } from '../graphql-client';
import {
    GET_PRODUCT_CATEGORIES,
    GET_PRODUCT_CATEGORY_BY_SLUG,
    GET_POST_CATEGORIES,
    GET_POST_CATEGORY_BY_SLUG
} from './queries/categories';

export interface GraphQLCategory {
    id: string;
    databaseId: number;
    name: string;
    slug: string;
    count: number;
    description: string;
    parent?: {
        node: {
            id: string;
            slug: string;
        };
    };
}

export async function getProductCategories() {
    try {
        const data: any = await graphqlClient.request(GET_PRODUCT_CATEGORIES, { first: 100 });
        return data.productCategories.nodes;
    } catch (error) {
        console.error('GraphQL Error fetching product categories:', error);
        throw error;
    }
}

export async function getProductCategoryBySlug(slug: string) {
    try {
        const data: any = await graphqlClient.request(GET_PRODUCT_CATEGORY_BY_SLUG, { slug });
        return data.productCategory;
    } catch (error) {
        // Return null if category not found
        return null;
    }
}

export async function getPostCategories() {
    try {
        const data: any = await graphqlClient.request(GET_POST_CATEGORIES, { first: 100 });
        return data.categories.nodes;
    } catch (error) {
        console.error('GraphQL Error fetching post categories:', error);
        throw error;
    }
}

export async function getPostCategoryBySlug(slug: string) {
    try {
        const data: any = await graphqlClient.request(GET_POST_CATEGORY_BY_SLUG, { slug });
        return data.category;
    } catch (error) {
        // Return null if category not found
        return null;
    }
}
