/**
 * Test GraphQL endpoint connectivity
 * Run: node test-graphql.mjs
 */

const GRAPHQL_URL = 'https://matkinhtamduc.com/graphql';

// Correct query with inline fragment
const testQuery = `
  query TestProducts {
    products(first: 2) {
      edges {
        node {
          id
          name
          ... on SimpleProduct {
            price
            regularPrice
            salePrice
          }
        }
      }
    }
  }
`;

async function testGraphQL() {
    console.log('🧪 Testing GraphQL endpoint...');
    console.log('URL:', GRAPHQL_URL);
    console.log('');

    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: testQuery }),
        });

        console.log('Status:', response.status, response.statusText);

        if (!response.ok) {
            const text = await response.text();
            console.error('❌ Error response:', text);
            return;
        }

        const data = await response.json();

        if (data.errors) {
            console.error('❌ GraphQL Errors:', JSON.stringify(data.errors, null, 2));
            return;
        }

        console.log('✅ Success! GraphQL is working!');
        console.log('');
        console.log('📦 Products received:', data.data.products.edges.length);
        console.log('');
        console.log('Sample data:');
        data.data.products.edges.forEach((edge, i) => {
            console.log(`\nProduct ${i + 1}:`);
            console.log('  Name:', edge.node.name);
            console.log('  Price:', edge.node.price || 'N/A');
        });

    } catch (error) {
        console.error('❌ Network error:', error.message);
    }
}

testGraphQL();
