import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || `${process.env.NEXT_PUBLIC_WP_API_URL?.replace('/wp-json', '')}/graphql`;

if (!endpoint) {
    throw new Error('GraphQL endpoint not configured');
}

export const graphqlClient = new GraphQLClient(endpoint, {
    headers: {
        'Content-Type': 'application/json',
    },
    next: {
        revalidate: 60, // ISR: revalidate every 60 seconds
    },
});

// For authenticated requests (future use)
export const authenticatedClient = (token: string) => {
    return new GraphQLClient(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
};
