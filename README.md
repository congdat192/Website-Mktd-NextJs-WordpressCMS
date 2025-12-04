# WordPress + Next.js Headless E-commerce

A modern, headless WordPress e-commerce frontend built with Next.js 15, featuring full WPGraphQL integration and WooCommerce shopping cart/checkout functionality.

## 🎯 Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | GraphQL Migration | ✅ Complete |
| Phase 2 | Cart & Checkout | ✅ Complete |
| Phase 3 | User Authentication | ⏳ Upcoming |
| Phase 4 | SEO & Performance | ⏳ Planned |
| Phase 5 | Search & Filters | ⏳ Planned |
| Phase 6 | Production Launch | ⏳ Planned |

## 🚀 Features

### ✅ Implemented
- **100% GraphQL Data Fetching**: All pages use WPGraphQL for optimal performance
- **Full E-commerce Flow**: Cart → Checkout → Order → Confirmation
- **Shopping Cart**: Zustand-powered with localStorage persistence
- **Multi-step Checkout**: Customer info, shipping, payment selection
- **WooCommerce Orders**: Real order creation via WooCommerce REST API
- **Product Pages**: Beautiful, responsive product details with:
  - Dynamic pricing (regular/sale)
  - Product attributes and variants
  - Star ratings and reviews
  - Related products
  - Add to cart with toast notifications
- **Blog System**: Posts, categories, and archives
- **Responsive Design**: Mobile-first with sticky CTAs
- **TypeScript**: Full type safety

### ⏳ Coming Soon
- User authentication (login/register)
- Order history
- Product search
- Advanced filters
- Wishlist/favorites

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.7 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **CMS**: WordPress (Headless)
- **APIs**: 
  - WPGraphQL (products, posts, pages, categories)
  - WooCommerce REST API v3 (orders)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+
- WordPress site with:
  - WPGraphQL plugin
  - WPGraphQL for WooCommerce plugin
  - WooCommerce plugin
  - REST API enabled

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/congdat192/Website-Mktd-NextJs-WordpressCMS.git
   cd Website-Mktd-NextJs-WordpressCMS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file:
   ```env
   # GraphQL API (Primary)
   NEXT_PUBLIC_GRAPHQL_URL=https://your-wordpress-site.com/graphql
   
   # WordPress REST API
   NEXT_PUBLIC_WP_API_URL=https://your-wordpress-site.com/wp-json
   WP_SITE_URL=https://your-wordpress-site.com
   
   # WooCommerce API (for orders)
   WC_CONSUMER_KEY=ck_your_consumer_key
   WC_CONSUMER_SECRET=cs_your_consumer_secret
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/
│   ├── [slug]/              # Dynamic routes (products/posts/pages)
│   ├── [...slug]/           # Category routes
│   ├── blog/                # Blog listing
│   ├── products/            # Products with filters
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Multi-step checkout
│   ├── order-confirmation/  # Order success
│   ├── api/orders/          # Orders API route
│   └── layout.tsx           # Root layout
├── components/
│   ├── cart/                # Cart components
│   ├── product/             # Product components
│   ├── ui/                  # UI components
│   └── Header.tsx           # Navigation with cart
├── hooks/
│   ├── useCart.ts           # Cart hook
│   └── useToast.ts          # Toast notifications
├── store/
│   └── cartStore.ts         # Zustand cart store
├── lib/
│   ├── graphql/             # GraphQL operations
│   ├── graphql-client.ts    # GraphQL client
│   ├── graphql-adapter.ts   # Data adapters
│   └── wordpress.ts         # Legacy REST functions
└── public/
```

## 🛒 E-commerce Flow

```
Product Page → "Thêm vào giỏ" → Cart updates + Toast
                    ↓
              Cart Drawer/Page
                    ↓
              Checkout (3 steps)
                    ↓
         WooCommerce Order Created
                    ↓
           Order Confirmation Page
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_GRAPHQL_URL`
   - `NEXT_PUBLIC_WP_API_URL`
   - `WP_SITE_URL`
   - `WC_CONSUMER_KEY`
   - `WC_CONSUMER_SECRET`
4. Deploy!

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GRAPHQL_URL` | WPGraphQL endpoint | Yes |
| `NEXT_PUBLIC_WP_API_URL` | WordPress REST API | Yes |
| `WP_SITE_URL` | WordPress site URL | Yes |
| `WC_CONSUMER_KEY` | WooCommerce API key | Yes |
| `WC_CONSUMER_SECRET` | WooCommerce API secret | Yes |

## 🐛 Troubleshooting

### Build Errors
- Check all imports are correct
- Verify environment variables
- Run `npm run build` locally first

### Cart Issues
- Clear localStorage and refresh
- Check browser console for errors

### Orders Not Creating
- Verify WooCommerce API credentials
- Check server logs
- Ensure products exist in WooCommerce

### GraphQL Errors
- Verify WPGraphQL plugins are active
- Check GraphQL endpoint accessibility
- Test queries in GraphiQL IDE

## 📝 Development

### Adding Features
1. Create components in `components/`
2. Add GraphQL queries in `lib/graphql/queries/`
3. Create API functions in `lib/graphql/`
4. Build pages in `app/`

### Code Style
- TypeScript for type safety
- Next.js App Router conventions
- Tailwind CSS for styling
- Zustand for client state

## 👤 Author

**Cong Dat**
- GitHub: [@congdat192](https://github.com/congdat192)

## 🙏 Acknowledgments

- Next.js team
- WordPress & WooCommerce
- WPGraphQL community
- Vercel

---

**Live Site**: https://matkinhtamduc.com

**Last Updated**: December 4, 2024
