import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || `${process.env.NEXT_PUBLIC_WP_API_URL?.replace('/wp-json', '')}/graphql`;

if (!endpoint) {
    throw new Error('GraphQL endpoint not configured');
}

// Create client with ISR support
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

/**
 * Make a GraphQL request with retry logic for resilience
 * Helps prevent build failures from transient API errors
 */
export async function graphqlRequestWithRetry<T>(
    query: string,
    variables?: Record<string, unknown>,
    maxRetries: number = 3
): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await graphqlClient.request<T>(query, variables);
            return result;
        } catch (error) {
            lastError = error as Error;
            console.warn(`GraphQL request failed (attempt ${attempt}/${maxRetries}):`, error);

            // Don't retry on 4xx errors (except 429 rate limit)
            if (error instanceof Error && error.message.includes('400')) {
                throw error;
            }

            // Wait before retry (exponential backoff)
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }

    throw lastError || new Error('GraphQL request failed after retries');
}
