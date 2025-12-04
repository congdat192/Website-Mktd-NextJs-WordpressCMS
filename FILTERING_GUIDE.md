# Backend Filtering & Sorting Implementation Guide

## Overview
Hướng dẫn implement filtering và sorting cho products page sử dụng WordPress/WooCommerce API.

---

## 1. Update WordPress API Functions

### File: `lib/wordpress.ts`

Thêm parameters cho filtering và sorting:

```typescript
interface GetProductsParams {
  perPage?: number;
  page?: number;
  category?: string;      // NEW: Filter by category slug
  minPrice?: number;      // NEW: Min price
  maxPrice?: number;      // NEW: Max price
  orderBy?: 'date' | 'title' | 'price';  // NEW: Sort field
  order?: 'asc' | 'desc'; // NEW: Sort direction
}

export async function getProducts(params: GetProductsParams = {}): Promise<WPProduct[]> {
  const { 
    perPage = 10, 
    page = 1,
    category,
    minPrice,
    maxPrice,
    orderBy = 'date',
    order = 'desc'
  } = params;

  const queryParams = new URLSearchParams({
    per_page: perPage.toString(),
    page: page.toString(),
    _embed: 'true',
    orderby: orderBy,
    order: order,
  });

  // Add category filter
  if (category && category !== 'all') {
    // Get category ID from slug first
    const categories = await getProductCategories({ perPage: 100 });
    const cat = categories.find(c => c.slug === category);
    if (cat) {
      queryParams.append('product_cat', cat.id.toString());
    }
  }

  // Add price filter (WooCommerce specific)
  if (minPrice !== undefined) {
    queryParams.append('min_price', minPrice.toString());
  }
  if (maxPrice !== undefined) {
    queryParams.append('max_price', maxPrice.toString());
  }

  const url = `${WP_API_URL}/wp/v2/product?${queryParams}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }

  return res.json();
}
```

---

## 2. Create Client-Side Products Page

### File: `app/products/page.tsx`

Chuyển sang Client Component để handle filtering:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { ProductGrid, ProductFilter } from '@/components/product';
import { Pagination } from '@/components/ui';
import type { WPProduct } from '@/lib/wordpress';

export default function ProductsPage() {
  const [products, setProducts] = useState<WPProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sortBy: 'newest',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Parse filters
      const { category, priceRange, sortBy } = filters;
      
      // Parse price range
      let minPrice, maxPrice;
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        minPrice = min;
        maxPrice = max;
      }

      // Parse sort
      let orderBy: 'date' | 'title' | 'price' = 'date';
      let order: 'asc' | 'desc' = 'desc';
      
      switch (sortBy) {
        case 'newest':
          orderBy = 'date';
          order = 'desc';
          break;
        case 'oldest':
          orderBy = 'date';
          order = 'asc';
          break;
        case 'price-asc':
          orderBy = 'price';
          order = 'asc';
          break;
        case 'price-desc':
          orderBy = 'price';
          order = 'desc';
          break;
        case 'name-asc':
          orderBy = 'title';
          order = 'asc';
          break;
        case 'name-desc':
          orderBy = 'title';
          order = 'desc';
          break;
      }

      // Fetch from API route
      const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: '12',
        orderBy,
        order,
      });

      if (category !== 'all') params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice.toString());
      if (maxPrice) params.append('maxPrice', maxPrice.toString());

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#228B22] to-[#1a6b1a] text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Sản phẩm</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Khám phá bộ sưu tập gọng kính và tròng kính chất lượng cao
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Filter */}
        <ProductFilter onFilterChange={handleFilterChange} />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#666666]">
            {loading ? (
              'Đang tải...'
            ) : (
              <>
                Hiển thị <span className="font-semibold text-[#333333]">{products.length}</span> sản phẩm
              </>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#228B22]"></div>
          </div>
        ) : (
          <ProductGrid products={products} columns={4} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 3. Create API Route

### File: `app/api/products/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/wordpress';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '12');
    const category = searchParams.get('category') || undefined;
    const minPrice = searchParams.get('minPrice') 
      ? parseInt(searchParams.get('minPrice')!) 
      : undefined;
    const maxPrice = searchParams.get('maxPrice')
      ? parseInt(searchParams.get('maxPrice')!)
      : undefined;
    const orderBy = (searchParams.get('orderBy') as 'date' | 'title' | 'price') || 'date';
    const order = (searchParams.get('order') as 'asc' | 'desc') || 'desc';

    const products = await getProducts({
      page,
      perPage,
      category,
      minPrice,
      maxPrice,
      orderBy,
      order,
    });

    // Calculate total pages (you'll need to get this from WordPress headers)
    const totalPages = 10; // TODO: Get from X-WP-TotalPages header

    return NextResponse.json({
      products,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

---

## 4. Get Total Pages from WordPress

Update API route to get total pages from headers:

```typescript
export async function GET(request: NextRequest) {
  try {
    // ... existing code ...

    // Fetch with headers
    const queryParams = new URLSearchParams({
      per_page: perPage.toString(),
      page: page.toString(),
      // ... other params
    });

    const url = `${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/product?${queryParams}`;
    const res = await fetch(url);
    
    const products = await res.json();
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1');

    return NextResponse.json({
      products,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    // ... error handling
  }
}
```

---

## 5. Alternative: Server-Side with Search Params

Nếu muốn giữ Server Component, dùng URL search params:

### File: `app/products/page.tsx`

```typescript
import { getProducts } from '@/lib/wordpress';
import { ProductGrid, ProductFilter } from '@/components/product';
import { Pagination } from '@/components/ui';

interface PageProps {
  searchParams: {
    page?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    orderBy?: string;
    order?: string;
  };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const category = searchParams.category;
  const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice) : undefined;
  const orderBy = (searchParams.orderBy as 'date' | 'title' | 'price') || 'date';
  const order = (searchParams.order as 'asc' | 'desc') || 'desc';

  const products = await getProducts({
    page,
    perPage: 12,
    category,
    minPrice,
    maxPrice,
    orderBy,
    order,
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* ... hero section ... */}
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Filter - will use URL params */}
        <ProductFilter />
        
        <ProductGrid products={products} columns={4} />
        
        {/* Pagination with baseUrl for URL-based navigation */}
        <Pagination
          currentPage={page}
          totalPages={10}
          baseUrl="/products"
        />
      </div>
    </div>
  );
}
```

Update ProductFilter to use URL params:

```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function ProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    params.set('page', '1'); // Reset to page 1
    router.push(`/products?${params.toString()}`);
  };

  // ... rest of component
}
```

---

## 6. Testing

1. **Test category filter:**
   - Select "Gọng kính" → URL: `/products?category=gong-kinh`

2. **Test price filter:**
   - Select "500k-1M" → URL: `/products?minPrice=500000&maxPrice=1000000`

3. **Test sorting:**
   - Select "Giá: Thấp đến cao" → URL: `/products?orderBy=price&order=asc`

4. **Test pagination:**
   - Click page 2 → URL: `/products?page=2`

---

## 7. WordPress Configuration

Ensure WordPress REST API supports these params:

1. **Install WooCommerce** (if not already)
2. **Enable REST API** in WooCommerce settings
3. **Test endpoints:**
   ```bash
   # Test category filter
   curl "https://your-site.com/wp-json/wp/v2/product?product_cat=123"
   
   # Test price filter (WooCommerce)
   curl "https://your-site.com/wp-json/wc/v3/products?min_price=500000&max_price=1000000"
   ```

---

## Recommendation

**Tôi recommend approach #5 (Server-Side with URL params)** vì:
- ✅ SEO friendly (URLs có params)
- ✅ Shareable links
- ✅ Browser back/forward works
- ✅ No API route needed
- ✅ Server-side rendering

Bạn muốn tôi implement approach nào?
