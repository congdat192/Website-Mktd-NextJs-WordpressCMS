# Project Context

## Overview

This is a headless WordPress frontend application built with Next.js 15, designed for **Mắt Kính Tâm Đức** (matkinhtamduc.com) - an eyewear e-commerce website. The project decouples the frontend from WordPress, using it purely as a headless CMS and WooCommerce for product management. Features a premium UI design inspired by Builder.io.

## Migration Status (Updated Dec 2024)

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | GraphQL Migration | ✅ **DONE** |
| Phase 2 | Cart & Checkout | ✅ **DONE** |
| Phase 3 | UI Redesign (Builder.io) | ✅ **DONE** |
| Phase 4 | User Authentication | ⏳ Pending |
| Phase 5 | SEO & Performance | ⏳ Pending |
| Phase 6 | Production Launch | ⏳ Pending |

## Architecture

### Frontend
- **Framework**: Next.js 15.5.7 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (Cart)
- **Deployment**: Vercel

### Backend
- **CMS**: WordPress (Headless)
- **E-commerce**: WooCommerce
- **APIs**: 
  - **WPGraphQL** (Primary - products, posts, pages, categories)
  - WooCommerce REST API v3 (orders, cart operations)

### Data Flow
```
WordPress/WooCommerce (Backend)
    ↓ (WPGraphQL)
Next.js Server (SSR/SSG)
    ↓ (HTML + React)
User Browser
    ↓ (Zustand Cart State)
WooCommerce Orders API
```

## Key Integrations

### 1. WPGraphQL (Primary API - 100% Migrated)
**Endpoint**: `/graphql`

**WordPress Plugins Required**:
- WPGraphQL
- WPGraphQL for WooCommerce

**Used for**:
- ✅ Products listing & details
- ✅ Posts & Blog
- ✅ Pages
- ✅ Product Categories
- ✅ Post Categories
- ✅ Static params generation

**Files**:
- `lib/graphql-client.ts` - GraphQL client setup with retry logic
- `lib/graphql/queries/` - GraphQL query definitions
- `lib/graphql/products.ts` - Product operations
- `lib/graphql/posts.ts` - Blog post operations
- `lib/graphql/pages.ts` - Page operations
- `lib/graphql/categories.ts` - Category operations
- `lib/graphql-adapter.ts` - Convert GraphQL → WP format for compatibility

**API Resilience**:
- Retry logic with exponential backoff (3 retries)
- Defensive error handling prevents build crashes
- Graceful fallback to empty arrays on API failure

### 2. WooCommerce REST API v3
**Endpoint**: `/wp-json/wc/v3/`

**Authentication**: Basic Auth (Consumer Key + Secret)

**Used for**:
- ✅ Creating orders (`POST /orders`)
- ✅ Order retrieval (`GET /orders`)
- Products by category (legacy, for category pages)

### 3. Cart System (Zustand)
**Client-side state management with localStorage persistence**

**Features**:
- Add/remove items
- Update quantities
- Persist across sessions
- Cart drawer & page

**Files**:
- `store/cartStore.ts` - Zustand store
- `hooks/useCart.ts` - Cart hook
- `components/cart/` - Cart components

## Project Structure

```
wordpress-nextjs-frontend/
├── app/                          # Next.js App Router
│   ├── [slug]/                  # Dynamic routes (posts/pages/products)
│   ├── [...slug]/               # Catch-all routes (nested categories)
│   ├── blog/                    # Blog listing
│   ├── products/                # Products listing with filters
│   ├── cart/                    # Cart page ✨ NEW
│   ├── checkout/                # Checkout page ✨ NEW
│   ├── order-confirmation/      # Order success page ✨ NEW
│   ├── api/
│   │   └── orders/              # Orders API route ✨ NEW
│   ├── layout.tsx               # Root layout (with ToastProvider)
│   └── page.tsx                 # Homepage
├── components/
│   ├── cart/                    # Cart components
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── product/                 # Product components
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCTAButtons.tsx  # Add to cart ✨ NEW
│   │   └── ProductActions.tsx     # Full actions ✨ NEW
│   ├── ui/                      # UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Toast.tsx
│   ├── layout/
│   └── Header.tsx               # With cart icon & badge
├── hooks/
│   ├── useCart.ts
│   └── useToast.ts              # ✨ NEW
├── store/
│   └── cartStore.ts             # Zustand cart store
├── lib/
│   ├── graphql-client.ts        # GraphQL client
│   ├── graphql/                 # GraphQL operations
│   │   ├── queries/
│   │   ├── products.ts
│   │   ├── posts.ts
│   │   ├── pages.ts
│   │   └── categories.ts
│   ├── graphql-adapter.ts       # Data adapters
│   ├── wordpress.ts             # Legacy REST API (some functions)
│   └── utils.ts                 # Utilities (formatPrice, etc.)
└── public/
```

## E-Commerce Flow

### Cart to Checkout Flow
```
Product Page
    → Click "Thêm vào giỏ"
    → Zustand adds to cart + localStorage
    → Toast notification
    → Header cart badge updates
    
Cart Drawer / Page
    → View cart items
    → Adjust quantities
    → Click "Thanh toán"
    
Checkout Page (3 steps)
    1. Customer Info (name, email, phone)
    2. Shipping Address
    3. Payment Method (COD / Bank Transfer)
    → Submit → POST /api/orders
    
Order Confirmation
    → Show order details
    → Clear cart
    → Thank you message
```

## Data Models

### GraphQL Product
```typescript
{
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  price: string;           // Formatted: "100.000 ₫"
  regularPrice: string;
  salePrice: string;
  onSale: boolean;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK';
  shortDescription: string;
  description: string;
  image: { sourceUrl, altText };
  productCategories: { nodes: [...] };
}
```

### Cart Item (Zustand)
```typescript
{
  id: number;
  productId: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
  attributes?: { color?, size?, ... };
}
```

### WooCommerce Order
```typescript
{
  payment_method: 'cod' | 'bank_transfer';
  billing: { first_name, last_name, email, phone, address_1, city, ... };
  shipping: { ... };
  line_items: [{ product_id, quantity }];
  customer_note: string;
}
```

## Routing Strategy

### Product/Content Routes
- `/[slug]` - Tries: Product → Post → Page → 404

### Category Routes  
- `/[...slug]` - Handles: Product categories, Blog categories

### Static Routes
- `/` - Homepage
- `/blog` - Blog listing
- `/products` - Products with filters
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/order-confirmation` - Order success

## Design System

### Colors
```css
Primary Green: #228B22
Primary Green Hover: #1a6b1a
Background: #F5F5F5
Card Background: #FFFFFF
Text Primary: #333333
Text Muted: #666666
Border: #E5E5E5
Success: #228B22
Error: #EF4444
```

### Components (UI Library)
- Button (primary, secondary, outline, ghost)
- Card (with CardContent, CardHeader)
- Toast (success, error, warning, info)
- Pagination
- Inputs (text, select, textarea)

## Environment Configuration

```env
# GraphQL (Primary)
NEXT_PUBLIC_GRAPHQL_URL=https://matkinhtamduc.com/graphql

# REST API (Legacy & Orders)
NEXT_PUBLIC_WP_API_URL=https://matkinhtamduc.com/wp-json
WP_SITE_URL=https://matkinhtamduc.com

# WooCommerce (Orders)
WC_CONSUMER_KEY=ck_xxxxxxxxxxxxx
WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxx
```

### WordPress Requirements
- WordPress 6.0+
- WooCommerce 8.0+
- WPGraphQL plugin
- WPGraphQL for WooCommerce plugin
- Pretty permalinks enabled

## Current Features

### ✅ Completed
1. GraphQL data fetching (100% migrated)
2. Product listing with filters & sorting
3. Product detail pages
4. Blog listing & posts
5. Static pages
6. Category pages
7. Shopping cart (client-side)
8. Cart drawer & page
9. Multi-step checkout
10. WooCommerce order creation
11. Order confirmation
12. Toast notifications

### ✅ Phase 3 - UI Redesign (Builder.io)
1. **New Header Component**
   - Top bar with hotline and utility links
   - Mega menus for product categories
   - Mobile drawer with expandable categories
   - Cart badge with item count

2. **Product Card Enhanced**
   - Badges (New, Bestseller, Premium, Sale %)
   - Hover overlay with quick view
   - Color variant swatches
   - Rating display

3. **Quick View Modal**
   - Image gallery
   - Variant selection
   - Add to cart functionality

4. **Category Product Listing**
   - Quick filter tabs
   - Search & advanced filters
   - Grid/List view toggle
   - Pagination

5. **Product Detail Redesign**
   - Image gallery with zoom
   - Price comparison (regular vs trade-in)
   - Variant selectors (color, size)
   - Commitment accordion
   - Product tabs (Description, Specs, Reviews)
   - Related products

6. **Full Product Pagination**
   - Cursor-based pagination
   - Fetches all products (1400+)
   - Child category support

### ⏳ Pending
1. User authentication (login/register)
2. Order history (for logged-in users)
3. SEO optimization (RankMath integration)
4. Product search
5. Wishlist
6. Product reviews

## Troubleshooting

### Cart not persisting
- Check localStorage permissions
- Clear localStorage and try again

### Orders failing
- Verify WooCommerce API credentials
- Check server logs for errors
- Ensure products exist in WooCommerce

### GraphQL errors
- Verify WPGraphQL plugins are activated
- Check GraphQL endpoint is accessible
- Review query syntax

## Contact & Support

**Developer**: Cong Dat
**Repository**: https://github.com/congdat192/Website-Mktd-NextJs-WordpressCMS
**WordPress Site**: https://matkinhtamduc.com

---

Last Updated: December 6, 2024
