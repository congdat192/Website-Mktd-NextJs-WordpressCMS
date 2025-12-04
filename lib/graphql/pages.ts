import { graphqlClient } from '../graphql-client';
import { GET_PAGES, GET_PAGE_BY_SLUG } from './queries/pages';

export interface GraphQLPage {
    id: string;
    databaseId: number;
    title: string;
    slug: string;
    content: string;
    date: string;
    featuredImage?: {
        node: {
            sourceUrl: string;
            altText: string;
        };
    };
}

export async function getPages() {
    try {
        const data: any = await graphqlClient.request(GET_PAGES);
        return data.pages.nodes;
    } catch (error) {
        console.error('GraphQL Error fetching pages:', error);
        throw error;
    }
}

export async function getPageBySlug(slug: string) {
    try {
        const data: any = await graphqlClient.request(GET_PAGE_BY_SLUG, { slug });
        return data.page;
    } catch (error) {
        // Return null if page not found
        return null;
    }
}
