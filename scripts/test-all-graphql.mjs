/**
 * Comprehensive GraphQL Test Script
 * Tests all GraphQL queries including WooGraphQL and RankMath SEO
 * Run: node scripts/test-all-graphql.mjs
 */

const GRAPHQL_URL = 'https://matkinhtamduc.com/graphql';

// ============ QUERY DEFINITIONS ============

// 1. Test Products (WooGraphQL)
const PRODUCTS_QUERY = `
query TestProducts {
  products(first: 5) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        databaseId
        name
        slug
        type
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          onSale
          stockStatus
          averageRating
          reviewCount
          productCategories {
            nodes {
              name
              slug
            }
          }
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          onSale
          stockStatus
          productCategories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  }
}
`;

// 2. Test Product Categories
const CATEGORIES_QUERY = `
query TestCategories {
  productCategories(first: 20) {
    nodes {
      id
      databaseId
      name
      slug
      count
      description
      parent {
        node {
          slug
        }
      }
    }
  }
}
`;

// 3. Test Single Product by Slug
const SINGLE_PRODUCT_QUERY = `
query TestSingleProduct($slug: ID!) {
  product(id: $slug, idType: SLUG) {
    id
    databaseId
    name
    slug
    description
    shortDescription
    type
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
    ... on SimpleProduct {
      price
      regularPrice
      salePrice
      onSale
      stockStatus
      stockQuantity
    }
    ... on VariableProduct {
      price
      regularPrice
      salePrice
      onSale
      stockStatus
      variations(first: 10) {
        nodes {
          name
          price
          stockStatus
          attributes {
            nodes {
              name
              value
            }
          }
        }
      }
    }
    productCategories {
      nodes {
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
    related(first: 4) {
      nodes {
        name
        slug
        ... on SimpleProduct {
          price
        }
        image {
          sourceUrl
        }
      }
    }
  }
}
`;

// 4. Test Posts (Blog)
const POSTS_QUERY = `
query TestPosts {
  posts(first: 5) {
    nodes {
      id
      databaseId
      title
      slug
      excerpt
      date
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
      author {
        node {
          name
        }
      }
    }
  }
}
`;

// 5. Test Pages
const PAGES_QUERY = `
query TestPages {
  pages(first: 10) {
    nodes {
      id
      databaseId
      title
      slug
      content
    }
  }
}
`;

// 6. Test RankMath SEO (if installed)
const SEO_QUERY = `
query TestSEO {
  posts(first: 1) {
    nodes {
      title
      slug
      seo {
        title
        description
        focusKeywords
        canonicalUrl
        robots
        breadcrumbs {
          text
          url
        }
        openGraph {
          title
          description
          image {
            secureUrl
          }
        }
        jsonLd {
          raw
        }
      }
    }
  }
}
`;

// 7. Test Product SEO (RankMath for WooCommerce)
const PRODUCT_SEO_QUERY = `
query TestProductSEO {
  products(first: 1) {
    nodes {
      ... on SimpleProduct {
        name
        slug
        seo {
          title
          description
          focusKeywords
          canonicalUrl
          robots
          breadcrumbs {
            text
            url
          }
          openGraph {
            title
            description
            image {
              secureUrl
            }
          }
        }
      }
      ... on VariableProduct {
        name
        slug
        seo {
          title
          description
          focusKeywords
          canonicalUrl
          robots
          breadcrumbs {
            text
            url
          }
          openGraph {
            title
            description
            image {
              secureUrl
            }
          }
        }
      }
    }
  }
}
`;

// 8. Test Menu (Navigation)
const MENU_QUERY = `
query TestMenu {
  menus(first: 5) {
    nodes {
      id
      name
      slug
      menuItems {
        nodes {
          id
          label
          url
          path
          parentId
        }
      }
    }
  }
}
`;

// 9. Test Site Settings
const SETTINGS_QUERY = `
query TestSettings {
  generalSettings {
    title
    description
    url
    language
  }
}
`;

// ============ TEST RUNNER ============

async function runQuery(name, query, variables = {}) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 Testing: ${name}`);
    console.log('='.repeat(60));

    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) {
            console.log(`❌ HTTP Error: ${response.status} ${response.statusText}`);
            return { success: false, error: `HTTP ${response.status}` };
        }

        const data = await response.json();

        if (data.errors) {
            console.log('⚠️ GraphQL Errors:');
            data.errors.forEach((err, i) => {
                console.log(`  ${i + 1}. ${err.message}`);
            });
            return { success: false, errors: data.errors };
        }

        console.log('✅ SUCCESS');
        return { success: true, data: data.data };

    } catch (error) {
        console.log(`❌ Network Error: ${error.message}`);
        return { success: false, error: error.message };
    }
}

function summarizeData(name, result) {
    if (!result.success) return;

    const data = result.data;

    switch (name) {
        case 'Products':
            const products = data.products?.edges || [];
            console.log(`📦 Found ${products.length} products`);
            products.slice(0, 3).forEach(({ node: p }) => {
                console.log(`  - ${p.name} | ${p.price || 'No price'} | Categories: ${p.productCategories?.nodes?.map(c => c.name).join(', ') || 'None'}`);
            });
            break;

        case 'Categories':
            const categories = data.productCategories?.nodes || [];
            console.log(`📁 Found ${categories.length} categories`);
            categories.slice(0, 5).forEach(c => {
                console.log(`  - ${c.name} (${c.count} products) | slug: ${c.slug}`);
            });
            break;

        case 'Single Product':
            const product = data.product;
            if (product) {
                console.log(`🔍 Product: ${product.name}`);
                console.log(`  Price: ${product.price || 'N/A'}`);
                console.log(`  Stock: ${product.stockStatus || 'N/A'}`);
                console.log(`  Gallery: ${product.galleryImages?.nodes?.length || 0} images`);
                console.log(`  Variations: ${product.variations?.nodes?.length || 0}`);
                console.log(`  Related: ${product.related?.nodes?.length || 0} products`);
            } else {
                console.log('  No product found with that slug');
            }
            break;

        case 'Posts':
            const posts = data.posts?.nodes || [];
            console.log(`📝 Found ${posts.length} posts`);
            posts.slice(0, 3).forEach(p => {
                console.log(`  - ${p.title} | ${p.date?.split('T')[0]} | By: ${p.author?.node?.name || 'Unknown'}`);
            });
            break;

        case 'Pages':
            const pages = data.pages?.nodes || [];
            console.log(`📄 Found ${pages.length} pages`);
            pages.forEach(p => {
                console.log(`  - ${p.title} | slug: ${p.slug}`);
            });
            break;

        case 'Post SEO (RankMath)':
        case 'Product SEO (RankMath)':
            const items = data.posts?.nodes || data.products?.nodes || [];
            if (items.length > 0 && items[0].seo) {
                const seo = items[0].seo;
                console.log(`🔍 SEO Data for: ${items[0].title || items[0].name}`);
                console.log(`  Title: ${seo.title || 'Not set'}`);
                console.log(`  Description: ${seo.description?.substring(0, 80) || 'Not set'}...`);
                console.log(`  Keywords: ${seo.focusKeywords?.join(', ') || 'None'}`);
                console.log(`  Canonical: ${seo.canonicalUrl || 'Not set'}`);
                console.log(`  Breadcrumbs: ${seo.breadcrumbs?.length || 0} items`);
            } else {
                console.log('  ⚠️ SEO field not available (RankMath SEO plugin may not be configured for GraphQL)');
            }
            break;

        case 'Menus':
            const menus = data.menus?.nodes || [];
            console.log(`🔗 Found ${menus.length} menus`);
            menus.forEach(m => {
                console.log(`  - ${m.name} | ${m.menuItems?.nodes?.length || 0} items`);
            });
            break;

        case 'Site Settings':
            const settings = data.generalSettings;
            if (settings) {
                console.log(`⚙️ Site Settings:`);
                console.log(`  Title: ${settings.title}`);
                console.log(`  Description: ${settings.description}`);
                console.log(`  URL: ${settings.url}`);
                console.log(`  Language: ${settings.language}`);
            }
            break;
    }
}

async function main() {
    console.log('🚀 =====================================================');
    console.log('   COMPREHENSIVE WORDPRESS GRAPHQL TEST');
    console.log('   Endpoint:', GRAPHQL_URL);
    console.log('   Time:', new Date().toISOString());
    console.log('=====================================================');

    const tests = [
        { name: 'Products', query: PRODUCTS_QUERY },
        { name: 'Categories', query: CATEGORIES_QUERY },
        { name: 'Posts', query: POSTS_QUERY },
        { name: 'Pages', query: PAGES_QUERY },
        { name: 'Menus', query: MENU_QUERY },
        { name: 'Site Settings', query: SETTINGS_QUERY },
        { name: 'Post SEO (RankMath)', query: SEO_QUERY },
        { name: 'Product SEO (RankMath)', query: PRODUCT_SEO_QUERY },
    ];

    const results = {};

    for (const test of tests) {
        const result = await runQuery(test.name, test.query, test.variables);
        results[test.name] = result;
        summarizeData(test.name, result);
    }

    // Get a product slug for single product test
    if (results['Products']?.success) {
        const firstProductSlug = results['Products'].data.products?.edges?.[0]?.node?.slug;
        if (firstProductSlug) {
            const singleResult = await runQuery('Single Product', SINGLE_PRODUCT_QUERY, { slug: firstProductSlug });
            results['Single Product'] = singleResult;
            summarizeData('Single Product', singleResult);
        }
    }

    // ============ SUMMARY ============
    console.log('\n' + '='.repeat(60));
    console.log('📋 TEST SUMMARY');
    console.log('='.repeat(60));

    let passed = 0;
    let failed = 0;
    let partial = 0;

    for (const [name, result] of Object.entries(results)) {
        if (result.success) {
            console.log(`✅ ${name}: PASSED`);
            passed++;
        } else if (result.errors) {
            console.log(`⚠️ ${name}: PARTIAL (GraphQL errors)`);
            partial++;
        } else {
            console.log(`❌ ${name}: FAILED`);
            failed++;
        }
    }

    console.log('\n' + '-'.repeat(60));
    console.log(`Total: ${passed} passed, ${partial} partial, ${failed} failed`);
    console.log('='.repeat(60));
}

main();
