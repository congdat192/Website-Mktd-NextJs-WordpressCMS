/* eslint-disable @typescript-eslint/no-explicit-any */
import { graphqlClient } from '../graphql-client';
import { GET_POSTS, GET_POST_BY_SLUG, GET_POSTS_BY_CATEGORY } from './queries/posts';

export interface GraphQLPost {
    id: string;
    databaseId: number;
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    content: string;
    featuredImage?: {
        node: {
            sourceUrl: string;
            altText: string;
        };
    };
    categories?: {
        nodes: Array<{
            id: string;
            databaseId: number;
            name: string;
            slug: string;
        }>;
    };
    tags?: {
        nodes: Array<{
            id: string;
            name: string;
            slug: string;
        }>;
    };
    author?: {
        node: {
            name: string;
            avatar?: {
                url: string;
            };
        };
    };
    seo?: {
        title?: string;
        metaDesc?: string;
        opengraphTitle?: string;
        opengraphDescription?: string;
        opengraphImage?: {
            sourceUrl: string;
        };
    };
}

interface GetPostsParams {
    first?: number;
    after?: string;
    categorySlug?: string;
}

export async function getPosts(params: GetPostsParams = {}) {
    try {
        const data: any = await graphqlClient.request(GET_POSTS, params);
        return data.posts;
    } catch (error) {
        console.error('GraphQL Error fetching posts:', error);
        throw error;
    }
}

export async function getPostBySlug(slug: string) {
    try {
        const data: any = await graphqlClient.request(GET_POST_BY_SLUG, { slug });
        return data.post;
    } catch (error) {
        // Return null if post not found
        return null;
    }
}

export async function getPostsByCategory(categorySlug: string, params: GetPostsParams = {}) {
    try {
        const data: any = await graphqlClient.request(GET_POSTS_BY_CATEGORY, {
            categorySlug,
            ...params,
        });
        return data.posts;
    } catch (error) {
        console.error('GraphQL Error fetching posts by category:', error);
        throw error;
    }
}
