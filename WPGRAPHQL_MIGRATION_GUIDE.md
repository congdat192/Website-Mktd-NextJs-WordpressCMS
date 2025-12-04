# Migration Guide: REST API → WPGraphQL

**Date**: December 4, 2024  
**Project**: Mắt Kính Tâm Đức - WordPress Headless CMS

---

## 📋 Overview

Hướng dẫn chuyển đổi từ WordPress REST API sang WPGraphQL để optimize performance và flexibility.

---

## 🎯 Benefits of WPGraphQL

### REST API (hiện tại)
- ❌ Over-fetching data
- ❌ Multiple requests cho related data
- ❌ Fixed response structure
- ✅ Simple, built-in
- ✅ No plugins needed

### WPGraphQL (sau migration)
- ✅ Fetch chính xác data cần thiết
- ✅ Single request cho nhiều resources
- ✅ Strongly typed với TypeScript
- ✅ Better performance
- ✅ Flexible queries
- ❌ Cần cài plugins
- ❌ Learning curve

---

## 📦 Step 1: WordPress Setup

### 1.1 Install Required Plugins

```bash
# On WordPress admin
1. WPGraphQL (core)
   https://wordpress.org/plugins/wp-graphql/

2. WPGraphQL for WooCommerce
   https://github.com/wp-graphql/wp-graphql-woocommerce

3. WPGraphQL for Advanced Custom Fields (optional)
   https://github.com/wp-graphql/wp-graphql-acf
```

### 1.2 Verify GraphQL Endpoint

```bash
# Test endpoint
https://your-site.com/graphql

# GraphiQL IDE (for testing)
https://your-site.com/wp-admin/admin.php?page=graphiql-ide
```

---

## 📦 Step 2: Next.js Setup

### 2.1 Install Dependencies

```bash
npm install graphql graphql-request
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations
```

### 2.2 Create GraphQL Client

**File**: `lib/graphql-client.ts`

```typescript
import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://matkinhtamduc.com/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// For authenticated requests
export const authenticatedClient = (token: string) => {
  return new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
};
```

### 2.3 Update Environment Variables

**File**: `.env.local`

```bash
# Add GraphQL endpoint
NEXT_PUBLIC_GRAPHQL_URL=https://matkinhtamduc.com/graphql

# Keep REST API for fallback
NEXT_PUBLIC_WP_API_URL=https://matkinhtamduc.com/wp-json
```

---

## 🔄 Step 3: Migration Strategy

### Option A: Gradual Migration (Recommended)
1. Keep REST API functions
2. Create new GraphQL functions
3. Migrate page by page
4. Remove REST API when done

### Option B: Full Migration
1. Replace all at once
2. Higher risk
3. Faster completion

**Recommendation**: Option A (Gradual)

---

## 📝 Step 4: GraphQL Queries

### 4.1 Products Query

**File**: `lib/graphql/queries/products.ts`

```typescript
import { gql } from 'graphql-request';

export const GET_PRODUCTS = gql`
  query GetProducts(
    $first: Int = 12
    $after: String
    $categorySlug: String
    $minPrice: Float
    $maxPrice: Float
    $orderBy: ProductsOrderByEnum = DATE
    $order: OrderEnum = DESC
  ) {
    products(
      first: $first
      after: $after
      where: {
        category: $categorySlug
        minPrice: $minPrice
        maxPrice: $maxPrice
        orderby: { field: $orderBy, order: $order }
      }
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          databaseId
          name
          slug
          date
          ... on SimpleProduct {
            price
            regularPrice
            salePrice
            onSale
            stockStatus
            averageRating
            reviewCount
          }
          image {
            sourceUrl
            altText
          }
          productCategories {
            nodes {
              id
              name
              slug
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      shortDescription
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        onSale
        stockStatus
        stockQuantity
        averageRating
        reviewCount
      }
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      productCategories {
        nodes {
          id
          name
          slug
        }
      }
      attributes {
        nodes {
          name
          options
        }
      }
    }
  }
`;
```

### 4.2 Posts Query

**File**: `lib/graphql/queries/posts.ts`

```typescript
import { gql } from 'graphql-request';

export const GET_POSTS = gql`
  query GetPosts(
    $first: Int = 12
    $after: String
    $categorySlug: String
  ) {
    posts(
      first: $first
      after: $after
      where: { categoryName: $categorySlug }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          databaseId
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  }
`;
```

---

## 🔨 Step 5: Create GraphQL Functions

### 5.1 Products Functions

**File**: `lib/graphql/products.ts`

```typescript
import { graphqlClient } from '../graphql-client';
import { GET_PRODUCTS, GET_PRODUCT_BY_SLUG } from './queries/products';

interface GetProductsParams {
  first?: number;
  after?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  orderBy?: 'DATE' | 'TITLE' | 'PRICE';
  order?: 'ASC' | 'DESC';
}

export async function getProducts(params: GetProductsParams = {}) {
  try {
    const data = await graphqlClient.request(GET_PRODUCTS, params);
    return data.products;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const data = await graphqlClient.request(GET_PRODUCT_BY_SLUG, { slug });
    return data.product;
  } catch (error) {
    console.error('GraphQL Error:', error);
    return null;
  }
}
```

---

## 🔄 Step 6: Update Pages (Gradual Migration)

### 6.1 Products Page

**Before (REST API)**:
```typescript
import { getProducts } from '@/lib/wordpress';
```

**After (GraphQL)**:
```typescript
import { getProducts } from '@/lib/graphql/products';
```

### 6.2 Update Component

```typescript
export default async function ProductsPage({ searchParams }: PageProps) {
  const { category, minPrice, maxPrice, sortBy } = searchParams;
  
  // GraphQL query
  const { edges, pageInfo } = await getProducts({
    first: 12,
    categorySlug: category,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    orderBy: sortBy === 'price-asc' ? 'PRICE' : 'DATE',
    order: sortBy === 'price-asc' ? 'ASC' : 'DESC',
  });

  const products = edges.map(edge => edge.node);

  return (
    // ... render products
  );
}
```

---

## 📊 Step 7: TypeScript Types

### 7.1 Generate Types from Schema

**File**: `codegen.yml`

```yaml
schema: https://matkinhtamduc.com/graphql
documents: 'lib/graphql/**/*.ts'
generates:
  lib/graphql/generated.ts:
    plugins:
      - typescript
      - typescript-operations
```

**Run codegen**:
```bash
npx graphql-codegen
```

### 7.2 Use Generated Types

```typescript
import { Product, ProductsQuery } from '@/lib/graphql/generated';

export async function getProducts(): Promise<Product[]> {
  // Fully typed!
}
```

---

## 🧪 Step 8: Testing

### 8.1 Test GraphQL Queries

```bash
# Use GraphiQL IDE
https://your-site.com/wp-admin/admin.php?page=graphiql-ide

# Test query
query {
  products(first: 5) {
    edges {
      node {
        name
        price
      }
    }
  }
}
```

### 8.2 Test Next.js Integration

```bash
npm run dev
# Visit http://localhost:3000/products
```

---

## 📈 Step 9: Performance Optimization

### 9.1 Enable Caching

```typescript
export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
  cache: 'force-cache', // Enable caching
  next: {
    revalidate: 60, // ISR: revalidate every 60 seconds
  },
});
```

### 9.2 Query Optimization

```graphql
# Only fetch needed fields
query GetProducts {
  products(first: 12) {
    edges {
      node {
        id
        name
        price
        # Don't fetch description if not needed
      }
    }
  }
}
```

---

## 🗺️ Migration Roadmap

### Week 1: Setup
- [ ] Install WPGraphQL plugins
- [ ] Install npm packages
- [ ] Create GraphQL client
- [ ] Test GraphQL endpoint

### Week 2: Core Queries
- [ ] Create product queries
- [ ] Create post queries
- [ ] Create category queries
- [ ] Generate TypeScript types

### Week 3: Page Migration
- [ ] Migrate products page
- [ ] Migrate blog page
- [ ] Migrate homepage
- [ ] Test all pages

### Week 4: Cleanup
- [ ] Remove REST API functions
- [ ] Update documentation
- [ ] Performance testing
- [ ] Deploy to production

---

## 🔧 Troubleshooting

### Issue: GraphQL endpoint not found
**Solution**: Verify WPGraphQL plugin is activated

### Issue: Authentication errors
**Solution**: Use JWT tokens for authenticated requests

### Issue: Query too complex
**Solution**: Break into multiple queries or use fragments

---

## 📚 Resources

- [WPGraphQL Docs](https://www.wpgraphql.com/docs/introduction)
- [GraphQL Request](https://github.com/jasonkuhrt/graphql-request)
- [GraphQL Code Generator](https://www.graphql-code-generator.com/)

---

## ✅ Checklist

- [ ] Install WPGraphQL plugins on WordPress
- [ ] Install npm packages
- [ ] Create GraphQL client
- [ ] Write GraphQL queries
- [ ] Create GraphQL functions
- [ ] Migrate products page
- [ ] Migrate blog page
- [ ] Generate TypeScript types
- [ ] Test thoroughly
- [ ] Remove REST API code
- [ ] Update documentation

---

**Next Steps**: Bạn muốn tôi bắt đầu migration từ đâu?

1. Setup WordPress plugins
2. Create GraphQL client
3. Migrate products page
4. Full migration plan
