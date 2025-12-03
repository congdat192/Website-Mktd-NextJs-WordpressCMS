// WordPress REST API client
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL;

if (!WP_API_URL) {
    throw new Error('NEXT_PUBLIC_WP_API_URL is not defined in environment variables');
}

// WooCommerce API configuration
const WC_SITE_URL = process.env.WP_SITE_URL || 'https://matkinhtamduc.com';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

// WooCommerce Product Attribute
export interface WCProductAttribute {
    id: number;
    name: string;
    slug?: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
}

// WooCommerce Product Variation
export interface WCProductVariation {
    id: number;
    sku: string;
    price: string;
    regular_price: string;
    sale_price: string;
    on_sale: boolean;
    attributes: Array<{
        id: number;
        name: string;
        option: string;
    }>;
    image?: {
        id: number;
        src: string;
        alt: string;
    };
}

// WooCommerce Product Data
export interface WCProduct {
    id: number;
    name: string;
    slug: string;
    sku: string;
    price: string;
    regular_price: string;
    sale_price: string;
    on_sale: boolean;
    stock_status: 'instock' | 'outofstock' | 'onbackorder';
    stock_quantity: number | null;
    attributes: WCProductAttribute[];
    variations: number[];
    average_rating: string;
    rating_count: number;
}

// WordPress Post type
export interface WPPost {
    id: number;
    date: string;
    slug: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    author: number;
    featured_media: number;
    yoast_head?: string;
    yoast_head_json?: {
        title?: string;
        description?: string;
        og_title?: string;
        og_description?: string;
        og_image?: Array<{ url: string }>;
    };
    _embedded?: {
        'wp:featuredmedia'?: Array<{
            source_url: string;
            alt_text: string;
        }>;
    };
}

// WordPress Page type
export interface WPPage {
    id: number;
    date: string;
    slug: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
}

// Fetch options for posts
interface GetPostsOptions {
    perPage?: number;
    page?: number;
}

/**
 * Get posts from WordPress REST API
 */
export async function getPosts(options: GetPostsOptions = {}): Promise<WPPost[]> {
    const { perPage = 10, page = 1 } = options;

    try {
        const url = `${WP_API_URL}/wp/v2/posts?per_page=${perPage}&page=${page}&_embed`;

        const response = await fetch(url, {
            next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
        }

        const posts: WPPost[] = await response.json();
        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
    try {
        const url = `${WP_API_URL}/wp/v2/posts?slug=${slug}&_embed`;

        const response = await fetch(url, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
        }

        const posts: WPPost[] = await response.json();

        if (posts.length === 0) {
            return null;
        }

        return posts[0];
    } catch (error) {
        console.error(`Error fetching post with slug "${slug}":`, error);
        throw error;
    }
}

/**
 * Get all pages from WordPress
 */
export async function getPages(): Promise<WPPage[]> {
    try {
        const url = `${WP_API_URL}/wp/v2/pages?per_page=100`;

        const response = await fetch(url, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch pages: ${response.status} ${response.statusText}`);
        }

        const pages: WPPage[] = await response.json();
        return pages;
    } catch (error) {
        console.error('Error fetching pages:', error);
        throw error;
    }
}

/**
 * Get a single page by slug
 */
export async function getPageBySlug(slug: string): Promise<WPPage | null> {
    try {
        const url = `${WP_API_URL}/wp/v2/pages?slug=${slug}`;

        const response = await fetch(url, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
        }

        const pages: WPPage[] = await response.json();

        if (pages.length === 0) {
            return null;
        }

        return pages[0];
    } catch (error) {
        console.error(`Error fetching page with slug "${slug}":`, error);
        throw error;
    }
}

// WordPress Category type
export interface WPCategory {
    id: number;
    count: number;
    description: string;
    link: string;
    name: string;
    slug: string;
    taxonomy: string;
    parent: number;
    meta: Record<string, unknown>;
    yoast_head?: string;
    yoast_head_json?: {
        title?: string;
        description?: string;
        og_title?: string;
        og_description?: string;
        og_image?: Array<{ url: string }>;
    };
}

// WordPress Product Category type
export interface WPProductCategory extends WPCategory {
    taxonomy: 'product_cat';
}

// WordPress Product type
export interface WPProduct {
    id: number;
    date: string;
    slug: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    featured_media: number;
    product_cat: number[];
    product_tag: number[];
    product_brand: number[];
    yoast_head?: string;
    yoast_head_json?: {
        title?: string;
        description?: string;
        og_title?: string;
        og_description?: string;
        og_image?: Array<{ url: string }>;
    };
    _embedded?: {
        'wp:featuredmedia'?: Array<{
            source_url: string;
            alt_text: string;
        }>;
        'wp:term'?: Array<Array<WPProductCategory>>;
    };
    // WooCommerce data (fetched separately)
    wc_data?: WCProduct;
}

/**
 * Fetch WooCommerce product data by slug
 */
export async function getWooCommerceProduct(slug: string): Promise<WCProduct | null> {
    if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
        console.warn('WooCommerce API credentials not configured');
        return null;
    }

    try {
        const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');
        const url = `${WC_SITE_URL}/wp-json/wc/v3/products?slug=${slug}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Basic ${auth}`,
            },
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            console.error(`Failed to fetch WooCommerce product: ${response.status} ${response.statusText}`);
            return null;
        }

        const products: WCProduct[] = await response.json();
        return products.length > 0 ? products[0] : null;
    } catch (error) {
        console.error('Error fetching WooCommerce product:', error);
        return null;
    }
}

/**
 * Get products from WordPress REST API
 */
export async function getProducts(options: GetPostsOptions = {}): Promise<WPProduct[]> {
    const { perPage = 12, page = 1 } = options;

    try {
        const url = `${WP_API_URL}/wp/v2/product?per_page=${perPage}&page=${page}&_embed`;

        const response = await fetch(url, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        const products: WPProduct[] = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<WPProduct | null> {
    try {
        const url = `${WP_API_URL}/wp/v2/product?slug=${slug}&_embed`;

        const response = await fetch(url, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
        }

        const products: WPProduct[] = await response.json();

        if (products.length === 0) {
            return null;
        }

        const product = products[0];

        // Fetch WooCommerce data
        const wcData = await getWooCommerceProduct(slug);
        if (wcData) {
            product.wc_data = wcData;
        }

        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

/**
 * Get all post categories
 */
export async function getCategories(): Promise<WPCategory[]> {
    try {
        const url = `${WP_API_URL}/wp/v2/categories?per_page=100&_fields=id,name,slug,count,parent,description,yoast_head,yoast_head_json`;

        const response = await fetch(url, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
        }

        const categories: WPCategory[] = await response.json();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<WPCategory | null> {
    try {
        const url = `${WP_API_URL}/wp/v2/categories?slug=${slug}&_fields=id,name,slug,count,parent,description,yoast_head,yoast_head_json`;

        const response = await fetch(url, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch category: ${response.status} ${response.statusText}`);
        }

        const categories: WPCategory[] = await response.json();

        if (categories.length === 0) {
            return null;
        }

        return categories[0];
    } catch (error) {
        console.error(`Error fetching category with slug "${slug}":`, error);
        throw error;
    }
}

/**
 * Get posts by category ID
 */
export async function getPostsByCategory(categoryId: number, options: GetPostsOptions = {}): Promise<WPPost[]> {
    const { perPage = 10, page = 1 } = options;

    try {
        const url = `${WP_API_URL}/wp/v2/posts?categories=${categoryId}&per_page=${perPage}&page=${page}&_embed`;

        const response = await fetch(url, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch posts by category: ${response.status} ${response.statusText}`);
        }

        const posts: WPPost[] = await response.json();
        return posts;
    } catch (error) {
        console.error(`Error fetching posts by category ${categoryId}:`, error);
        throw error;
    }
}

/**
 * Get all product categories
 */
export async function getProductCategories(): Promise<WPProductCategory[]> {
    try {
        const url = `${WP_API_URL}/wp/v2/product_cat?per_page=100&_fields=id,name,slug,count,parent,description,yoast_head,yoast_head_json`;

        const response = await fetch(url, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch product categories: ${response.status} ${response.statusText}`);
        }

        const categories: WPProductCategory[] = await response.json();
        return categories;
    } catch (error) {
        console.error('Error fetching product categories:', error);
        throw error;
    }
}

/**
 * Get a single product category by slug
 */
export async function getProductCategoryBySlug(slug: string): Promise<WPProductCategory | null> {
    try {
        const url = `${WP_API_URL}/wp/v2/product_cat?slug=${slug}&_fields=id,name,slug,count,parent,description,yoast_head,yoast_head_json`;

        const response = await fetch(url, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch product category: ${response.status} ${response.statusText}`);
        }

        const categories: WPProductCategory[] = await response.json();

        if (categories.length === 0) {
            return null;
        }

        return categories[0];
    } catch (error) {
        console.error(`Error fetching product category with slug "${slug}":`, error);
        throw error;
    }
}

/**
 * Get products by category ID
 */
export async function getProductsByCategory(categoryId: number, options: GetPostsOptions = {}): Promise<WPProduct[]> {
    const { perPage = 12, page = 1 } = options;

    try {
        const url = `${WP_API_URL}/wp/v2/product?product_cat=${categoryId}&per_page=${perPage}&page=${page}&_embed`;

        const response = await fetch(url, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products by category: ${response.status} ${response.statusText}`);
        }

        const products: WPProduct[] = await response.json();
        return products;
    } catch (error) {
        console.error(`Error fetching products by category ${categoryId}:`, error);
        throw error;
    }
}

/**
 * Build category hierarchy path (for nested categories)
 * Example: ['gong-kinh', 'seeson'] for /gong-kinh/seeson
 */
export async function getCategoryPath(category: WPCategory | WPProductCategory): Promise<string[]> {
    const path: string[] = [category.slug];

    if (category.parent) {
        try {
            const isProductCategory = category.taxonomy === 'product_cat';
            const endpoint = isProductCategory ? 'product_cat' : 'categories';
            const url = `${WP_API_URL}/wp/v2/${endpoint}/${category.parent}?_fields=id,slug,parent`;

            const response = await fetch(url, {
                next: { revalidate: 60 },
            });

            if (response.ok) {
                const parentCategory = await response.json();
                const parentPath = await getCategoryPath(parentCategory);
                return [...parentPath, category.slug];
            }
        } catch (error) {
            console.error('Error building category path:', error);
        }
    }

    return path;
}

