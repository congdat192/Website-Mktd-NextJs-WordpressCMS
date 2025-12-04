# WPGraphQL Setup Instructions

## ⚠️ IMPORTANT: WordPress Plugin Setup Required

Before the GraphQL integration works, you need to install plugins on your WordPress site.

---

## 📦 Step 1: Install WordPress Plugins

### 1.1 WPGraphQL (Core Plugin)

**Via WordPress Admin:**
1. Go to `Plugins` → `Add New`
2. Search for "WPGraphQL"
3. Install and Activate "WPGraphQL" by WPGraphQL

**Or download:**
https://wordpress.org/plugins/wp-graphql/

---

### 1.2 WPGraphQL for WooCommerce

**Via WordPress Admin:**
1. Go to `Plugins` → `Add New`
2. Search for "WPGraphQL WooCommerce (WooGraphQL)"
3. Install and Activate

**Or download:**
https://github.com/wp-graphql/wp-graphql-woocommerce

---

## 🧪 Step 2: Verify GraphQL Endpoint

After installing plugins:

1. **Test GraphQL endpoint:**
   ```
   https://matkinhtamduc.com/graphql
   ```

2. **Access GraphiQL IDE (for testing queries):**
   ```
   https://matkinhtamduc.com/wp-admin/admin.php?page=graphiql-ide
   ```

3. **Test a simple query:**
   ```graphql
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

---

## ✅ Step 3: Update Environment Variables

Add to `.env.local`:

```bash
# GraphQL endpoint (auto-configured from WP_API_URL)
NEXT_PUBLIC_GRAPHQL_URL=https://matkinhtamduc.com/graphql
```

---

## 🚀 Step 4: Test Next.js Integration

```bash
npm run dev
```

Visit: http://localhost:3000/products

---

## 🔧 Troubleshooting

### Error: "GraphQL endpoint not found"
**Solution:** Verify WPGraphQL plugin is activated

### Error: "products field not found"
**Solution:** Install WPGraphQL for WooCommerce plugin

### Error: "Authentication required"
**Solution:** Check WordPress GraphQL settings → Enable public access

---

## 📊 Current Status

✅ **Next.js Side (Complete):**
- GraphQL client configured
- Product queries created
- Products page migrated
- Data adapter for backward compatibility

⏳ **WordPress Side (Pending):**
- [ ] Install WPGraphQL plugin
- [ ] Install WPGraphQL for WooCommerce
- [ ] Verify GraphQL endpoint
- [ ] Test queries in GraphiQL

---

## 🎯 Next Steps

1. Install WordPress plugins (see above)
2. Test GraphQL endpoint
3. Refresh products page
4. Verify data loads correctly

---

**Note:** The app will fallback to REST API if GraphQL fails, so existing functionality is preserved.
