// WordPress REST API client
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL;

if (!WP_API_URL) {
    throw new Error('NEXT_PUBLIC_WP_API_URL is not defined in environment variables');
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
    categories: number[];
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
        'wp:term'?: Array<Array<WPCategory>>;
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

        return products[0];
    } catch (error) {
        console.error(`Error fetching product with slug "${slug}":`, error);
        throw error;
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

