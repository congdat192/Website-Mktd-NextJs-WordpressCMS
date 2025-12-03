# WordPress + Next.js Headless CMS

A modern, headless WordPress frontend built with Next.js 15, featuring WooCommerce integration for e-commerce functionality.

## 🚀 Features

- **Headless WordPress CMS**: Decoupled frontend using WordPress REST API
- **WooCommerce Integration**: Full e-commerce support with real product data
- **Modern UI/UX**: Responsive, mobile-first design with Tailwind CSS
- **SEO Optimized**: Built-in SEO support with Yoast integration
- **Server-Side Rendering**: Fast page loads with Next.js SSR
- **TypeScript**: Type-safe development experience
- **Product Detail Pages**: Beautiful, responsive product pages with:
  - Dynamic pricing (regular/sale)
  - Product attributes and variants
  - Star ratings and reviews
  - Related products
  - Sticky CTA on mobile, inline on desktop

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.7 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: WordPress (Headless)
- **E-commerce**: WooCommerce REST API v3
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- WordPress site with:
  - REST API enabled
  - WooCommerce plugin installed
  - WooCommerce REST API credentials

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
   
   Create a `.env.local` file in the root directory:
   ```env
   # WordPress API
   NEXT_PUBLIC_WP_API_URL=https://your-wordpress-site.com/wp-json
   
   # WooCommerce API
   WP_SITE_URL=https://your-wordpress-site.com
   WC_CONSUMER_KEY=ck_your_consumer_key
   WC_CONSUMER_SECRET=cs_your_consumer_secret
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_WP_API_URL`
   - `WP_SITE_URL`
   - `WC_CONSUMER_KEY`
   - `WC_CONSUMER_SECRET`
4. Deploy!

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── [slug]/            # Dynamic routes (posts, pages, products)
│   ├── [...slug]/         # Catch-all routes (categories)
│   ├── blog/              # Blog listing page
│   ├── products/          # Products listing page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── Footer.tsx
│   └── Header.tsx
├── lib/                   # Utility functions
│   └── wordpress.ts       # WordPress & WooCommerce API client
├── public/               # Static assets
└── .env.local           # Environment variables (not in git)
```

## 🔌 API Integration

### WordPress REST API

Fetches posts, pages, and product metadata:
```typescript
// Example: Fetch product by slug
const product = await getProductBySlug('product-slug');
```

### WooCommerce REST API

Fetches product pricing, attributes, and inventory:
```typescript
// Example: Fetch WooCommerce data
const wcData = await getWooCommerceProduct('product-slug');
```

## 🎨 Key Features

### Product Detail Page

- **Responsive Design**: 
  - Mobile: Stacked layout with sticky CTA bar
  - Desktop: 2-column layout with sticky image
- **Dynamic Data**:
  - Real-time pricing from WooCommerce
  - Product attributes (color, size, etc.)
  - Star ratings and review count
  - Stock status
- **Related Products**: Auto-fetched from same category
- **SEO**: Meta tags from Yoast SEO

### Blog & Pages

- Dynamic routing for posts and pages
- Category archives
- Embedded media support
- Yoast SEO integration

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WP_API_URL` | WordPress REST API endpoint | Yes |
| `WP_SITE_URL` | WordPress site URL | Yes |
| `WC_CONSUMER_KEY` | WooCommerce API consumer key | Yes |
| `WC_CONSUMER_SECRET` | WooCommerce API consumer secret | Yes |

## � Troubleshooting

### Build Errors

- **TypeScript errors**: Ensure all imports are correct
- **Missing environment variables**: Check `.env.local` file
- **API connection issues**: Verify WordPress/WooCommerce API credentials

### Common Issues

1. **Images not loading**: Check WordPress media URLs
2. **Products not displaying**: Verify WooCommerce API credentials
3. **404 errors**: Ensure WordPress permalinks are set to "Post name"

## 📝 Development

### Adding New Features

1. Create components in `components/`
2. Add API functions in `lib/wordpress.ts`
3. Create pages in `app/`
4. Update TypeScript interfaces as needed

### Code Style

- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling
- Keep components small and reusable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## � Author

**Cong Dat**
- GitHub: [@congdat192](https://github.com/congdat192)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- WordPress & WooCommerce for the CMS/e-commerce platform
- Vercel for hosting and deployment

---

**Live Site**: [Your deployed URL]

**WordPress Admin**: [Your WordPress admin URL]
