// Query WordPress data structure
const GRAPHQL_URL = 'https://matkinhtamduc.com/graphql';

async function queryGraphQL(query) {
    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
    });
    return response.json();
}

// Query all categories
async function getCategories() {
    const query = `
    query GetCategories {
      productCategories(first: 50) {
        nodes {
          id
          name
          slug
          count
          description
          image {
            sourceUrl
          }
          parent {
            node {
              name
              slug
            }
          }
        }
      }
    }
  `;
    return queryGraphQL(query);
}

// Query products sample
async function getProducts() {
    const query = `
    query GetProducts {
      products(first: 20) {
        nodes {
          ... on SimpleProduct {
            id
            databaseId
            name
            slug
            price
            regularPrice
            salePrice
            onSale
            stockStatus
            shortDescription
            image {
              sourceUrl
            }
            productCategories {
              nodes {
                name
                slug
              }
            }
          }
          ... on VariableProduct {
            id
            databaseId
            name
            slug
            price
            regularPrice
            onSale
            stockStatus
            shortDescription
            image {
              sourceUrl
            }
            productCategories {
              nodes {
                name
                slug
              }
            }
            variations {
              nodes {
                id
                name
                price
                regularPrice
                salePrice
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
        }
      }
    }
  `;
    return queryGraphQL(query);
}

// Query product attributes
async function getAttributes() {
    const query = `
    query GetAttributes {
      productAttributes: allPaColor(first: 20) {
        nodes {
          name
          slug
          count
        }
      }
    }
  `;
    return queryGraphQL(query);
}

// Query global attributes from WooCommerce
async function getGlobalAttributes() {
    const query = `
    query GetGlobalAttributes {
      __schema {
        types {
          name
          kind
          description
        }
      }
    }
  `;
    return queryGraphQL(query);
}

// Main execution
async function main() {
    console.log('🔍 Querying WordPress/WooCommerce data...\n');

    console.log('=== CATEGORIES ===');
    const categories = await getCategories();
    console.log(JSON.stringify(categories, null, 2));

    console.log('\n=== PRODUCTS (Sample 20) ===');
    const products = await getProducts();
    console.log(JSON.stringify(products, null, 2));

    // Summary
    console.log('\n=== SUMMARY ===');
    const cats = categories.data?.productCategories?.nodes || [];
    const prods = products.data?.products?.nodes || [];

    console.log(`Total Categories: ${cats.length}`);
    cats.forEach(c => console.log(`  - ${c.name} (${c.slug}) - ${c.count || 0} products`));

    console.log(`\nSample Products: ${prods.length}`);
    prods.slice(0, 5).forEach(p => console.log(`  - ${p.name}: ${p.price}`));
}

main().catch(console.error);
