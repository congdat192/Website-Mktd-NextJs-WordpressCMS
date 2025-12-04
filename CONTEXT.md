# Project Context

## Overview

This is a headless WordPress frontend application built with Next.js 15, designed for **Mắt Kính Tâm Đức** (matkinhtamduc.com) - an eyewear e-commerce website. The project decouples the frontend from WordPress, using it purely as a headless CMS and WooCommerce for product management.

## Architecture

### Frontend
- **Framework**: Next.js 15.5.7 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

### Backend
- **CMS**: WordPress (Headless)
- **E-commerce**: WooCommerce
- **APIs**: 
  - **WPGraphQL** (products - migrated)
  - WordPress REST API (posts, pages)
  - WooCommerce REST API v3

### Data Flow
```
WordPress/WooCommerce (Backend)
    ↓ (GraphQL + REST API)
Next.js Server (SSR)
    ↓ (HTML)
User Browser
```

## Key Integrations

### 1. WPGraphQL (Primary for Products)
**Endpoint**: `/graphql`

**WordPress Plugins Required**:
- WPGraphQL
- WPGraphQL for WooCommerce

**Used for**:
- Products listing (`/products` page)
- Product filtering & sorting
- Product categories

**Benefits**:
- Fetch only needed fields
- Single request for related data
- Better performance
- Type-safe with TypeScript

**Files**:
- `lib/graphql-client.ts` - GraphQL client
- `lib/graphql/queries/products.ts` - Product queries
- `lib/graphql/products.ts` - GraphQL functions
- `lib/graphql-adapter.ts` - Convert GraphQL → REST API format

### 2. WordPress REST API
**Endpoint**: `/wp-json/wp/v2/`

**Used for**:
- Posts (`/posts`)
- Pages (`/pages`)
- Categories (`/categories`, `/product_cat`)
- Media (`/media`)

**Features**:
- Embedded responses (`?_embed`)
- Yoast SEO metadata
- Custom post types

### 3. WooCommerce REST API v3
**Endpoint**: `/wp-json/wc/v3/`

**Authentication**: Basic Auth (Consumer Key + Secret)

**Used for**:
- Product details (fallback)
- Pricing (regular, sale)
- Attributes (color, size, brand, etc.)
- Variations
- Stock status
- Ratings and reviews

## Project Structure

```
wordpress-nextjs-frontend/
├── app/                          # Next.js App Router
│   ├── [slug]/                  # Dynamic single routes
│   │   ├── page.tsx            # Main handler (posts/pages/products)
│   │   ├── not-found.tsx       # 404 page
│   │   └── styles.css          # Page-specific styles
│   ├── [...slug]/              # Catch-all routes (categories)
│   │   └── page.tsx
│   ├── blog/                   # Blog listing
│   ├── products/               # Products listing
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
├── components/                  # React components
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/                        # Utilities
│   └── wordpress.ts            # API client & types
├── public/                     # Static files
├── .env.local                  # Environment variables (gitignored)
└── next.config.ts              # Next.js configuration
```

## Data Models

### WPProduct (WordPress)
```typescript
{
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  product_cat: number[];
  _embedded: {
    'wp:featuredmedia': [...];
    'wp:term': [...];
  };
  wc_data?: WCProduct;  // Merged WooCommerce data
}
```

### WCProduct (WooCommerce)
```typescript
{
  id: number;
  name: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  attributes: WCProductAttribute[];
  average_rating: string;
  rating_count: number;
}
```

## Routing Strategy

### Dynamic Routes
- `/[slug]` - Handles posts, pages, and products
  - Tries to fetch as post first
  - Falls back to page
  - Falls back to product
  - Returns 404 if none found

### Category Routes
- `/[...slug]` - Handles category archives
  - Blog categories: `/category/[slug]`
  - Product categories: `/product-category/[slug]`

### Static Routes
- `/` - Homepage
- `/blog` - Blog listing
- `/products` - Products listing

## Design System

### Colors
```css
Primary Green: #228B22
Background: #F5F5F5
Card Background: #FFFFFF
Text Primary: #333333
Text Muted: #666666
Border: #E5E5E5
```

### Breakpoints
```css
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
Max Width: 1280px (7xl)
```

### Typography
- Headings: Bold, tracking-tight
- Body: Normal weight
- Links: Hover effects with transitions

## Performance Optimizations

### Caching
- **Revalidation**: 60 seconds for all API calls
- **Build Cache**: Enabled on Vercel

### Image Optimization
- WordPress serves optimized images
- Future: Migrate to Next.js `<Image />` component

### Code Splitting
- Automatic with Next.js App Router
- Dynamic imports where needed

## SEO Strategy

### Meta Tags
- Pulled from Yoast SEO (`yoast_head_json`)
- Fallback to WordPress title/excerpt
- Open Graph tags for social sharing

### Structured Data
- Product schema (future enhancement)
- Breadcrumbs (future enhancement)

### Sitemap
- Generated from WordPress (future enhancement)

## Development Workflow

### Local Development
1. Start WordPress locally or use staging
2. Configure `.env.local`
3. Run `npm run dev`
4. Test on `localhost:3000`

### Deployment
1. Push to GitHub (main branch)
2. Vercel auto-deploys
3. Environment variables set in Vercel dashboard

### Testing
- Manual testing on localhost
- Vercel preview deployments for PRs
- Production testing on live site

## Known Limitations

1. **No Cart Functionality**: Add to cart is UI-only (not functional)
2. **Static Attributes**: Product attributes are display-only
3. **No User Authentication**: No login/register functionality
4. **Image Warnings**: Using `<img>` instead of Next.js `<Image />`
5. **No Search**: Search functionality not implemented

## Future Enhancements

### High Priority
1. Implement shopping cart with WooCommerce API
2. Add user authentication
3. Replace `<img>` with Next.js `<Image />`
4. Add product search functionality

### Medium Priority
5. Implement product variations
6. Add customer reviews display
7. Implement wishlist/favorites
8. Add social sharing buttons

### Low Priority
9. Add product comparison
10. Implement live chat
11. Add newsletter signup
12. Implement blog comments

## Environment Configuration

### Required Variables
```env
NEXT_PUBLIC_WP_API_URL=https://matkinhtamduc.com/wp-json
WP_SITE_URL=https://matkinhtamduc.com
WC_CONSUMER_KEY=ck_xxxxxxxxxxxxx
WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxx
```

### WordPress Requirements
- WordPress 6.0+
- WooCommerce 8.0+
- Yoast SEO (recommended)
- Pretty permalinks enabled

## Troubleshooting

### Common Issues

**Build fails with TypeScript errors**
- Check all imports are correct
- Ensure types are properly defined
- Run `npm run build` locally first

**Products not loading**
- Verify WooCommerce API credentials
- Check CORS settings on WordPress
- Ensure products are published

**Images not displaying**
- Check WordPress media URLs
- Verify HTTPS is used
- Check image permissions

**Slow page loads**
- Check WordPress server performance
- Verify caching is enabled
- Consider CDN for WordPress

## Security Considerations

1. **API Keys**: Never commit to git (use `.env.local`)
2. **CORS**: Configure WordPress to allow Next.js domain
3. **Rate Limiting**: WooCommerce API has rate limits
4. **HTTPS**: Always use HTTPS in production

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor WordPress/WooCommerce updates
- Check Vercel deployment logs
- Review and fix ESLint warnings

### Monitoring
- Vercel Analytics for performance
- WordPress error logs
- API response times

## Contact & Support

**Developer**: Cong Dat
**Repository**: https://github.com/congdat192/Website-Mktd-NextJs-WordpressCMS
**WordPress Site**: https://matkinhtamduc.com

---

Last Updated: December 4, 2024
