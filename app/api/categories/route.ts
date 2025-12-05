import { NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/graphql-client';

const GET_SUBCATEGORIES = `
query GetSubCategories($parentSlug: String!) {
  productCategories(first: 100, where: { parent: $parentSlug }) {
    nodes {
      id
      databaseId
      name
      slug
      count
    }
  }
}
`;

const GET_CATEGORIES_BY_PARENT = `
query GetCategoriesByParent($parentSlug: ID!) {
  productCategory(id: $parentSlug, idType: SLUG) {
    children {
      nodes {
        databaseId
        name
        slug
        count
      }
    }
  }
}
`;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const parentSlug = searchParams.get('parent');

    if (!parentSlug) {
        return NextResponse.json({ error: 'Parent slug required' }, { status: 400 });
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await graphqlClient.request(GET_CATEGORIES_BY_PARENT, {
            parentSlug,
        });

        const categories = data?.productCategory?.children?.nodes || [];

        // Filter out empty categories and map to simpler structure
        const result = categories
            .filter((cat: { count: number | null }) => cat.count && cat.count > 0)
            .map((cat: { name: string; slug: string; count: number }) => ({
                name: cat.name,
                slug: cat.slug,
                count: cat.count,
            }));

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
