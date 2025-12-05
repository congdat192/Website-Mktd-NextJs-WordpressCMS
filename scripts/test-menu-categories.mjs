/**
 * Test Menu and Category Hierarchy
 * Run: node scripts/test-menu-categories.mjs
 */

const GRAPHQL_URL = 'https://matkinhtamduc.com/graphql';

// Get menus with full hierarchy
const MENU_QUERY = `
query GetMenus {
  menus(first: 10) {
    nodes {
      id
      name
      slug
      menuItems(first: 100) {
        nodes {
          id
          label
          url
          path
          parentId
          childItems {
            nodes {
              id
              label
              url
              path
            }
          }
        }
      }
    }
  }
}
`;

// Get product categories with parent-child
const CATEGORIES_QUERY = `
query GetCategories {
  productCategories(first: 100) {
    nodes {
      id
      databaseId
      name
      slug
      count
      parent {
        node {
          id
          name
          slug
        }
      }
    }
  }
}
`;

async function runQuery(name, query) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 ${name}`);
    console.log('='.repeat(60));

    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();
        if (data.errors) {
            console.log('⚠️ Errors:', data.errors);
        }
        return data.data;
    } catch (error) {
        console.log('❌ Error:', error.message);
        return null;
    }
}

async function main() {
    // 1. Test Menus
    const menuData = await runQuery('MENUS', MENU_QUERY);
    if (menuData?.menus?.nodes) {
        menuData.menus.nodes.forEach(menu => {
            console.log(`\n📌 Menu: ${menu.name}`);
            console.log('-'.repeat(40));

            // Build hierarchy
            const topLevel = menu.menuItems?.nodes?.filter(item => !item.parentId) || [];

            topLevel.forEach(item => {
                console.log(`  ├─ ${item.label} → ${item.path || item.url}`);

                // Get children
                if (item.childItems?.nodes?.length > 0) {
                    item.childItems.nodes.forEach((child, i, arr) => {
                        const prefix = i === arr.length - 1 ? '└' : '├';
                        console.log(`  │  ${prefix}─ ${child.label} → ${child.path || child.url}`);
                    });
                }
            });
        });
    }

    // 2. Test Categories
    const catData = await runQuery('PRODUCT CATEGORIES', CATEGORIES_QUERY);
    if (catData?.productCategories?.nodes) {
        const categories = catData.productCategories.nodes;

        // Build hierarchy
        const rootCats = categories.filter(c => !c.parent);
        const childCats = categories.filter(c => c.parent);

        console.log(`\n📦 Danh mục gốc (${rootCats.length}):`);
        rootCats.forEach(cat => {
            console.log(`  ├─ ${cat.name} (${cat.count} sản phẩm) [${cat.slug}]`);

            // Find children
            const children = childCats.filter(c => c.parent?.node?.slug === cat.slug);
            children.forEach((child, i, arr) => {
                const prefix = i === arr.length - 1 ? '└' : '├';
                console.log(`  │  ${prefix}─ ${child.name} (${child.count}) [${child.slug}]`);
            });
        });

        console.log(`\n📊 Tổng: ${categories.length} danh mục`);
    }
}

main();
