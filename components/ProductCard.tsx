'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
    id: number;
    slug: string;
    title: string;
    excerpt?: string;
    featuredImage?: {
        url: string;
        alt: string;
    };
    badge?: 'hot' | 'new' | 'best';
    price?: string;
    originalPrice?: string;
}

const badgeStyles = {
    hot: 'bg-forest-cta text-forest-text',
    new: 'bg-forest-secondary text-white',
    best: 'bg-forest-cta text-forest-text',
};

const badgeLabels = {
    hot: 'Hot',
    new: 'Mới',
    best: 'Best',
};

export default function ProductCard({
    slug,
    title,
    excerpt,
    featuredImage,
    badge,
    price,
    originalPrice,
}: ProductCardProps) {
    return (
        <Link href={`/${slug}`} className="group">
            <article className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200 cursor-pointer h-full flex flex-col">
                {/* Product Image */}
                <div className="aspect-square bg-forest-bg relative overflow-hidden">
                    {featuredImage ? (
                        <Image
                            src={featuredImage.url}
                            alt={featuredImage.alt || title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-forest-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}

                    {/* Badge */}
                    {badge && (
                        <div className={`absolute top-3 right-3 ${badgeStyles[badge]} px-3 py-1 rounded-full text-sm font-semibold`}>
                            {badgeLabels[badge]}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4 flex-grow flex flex-col">
                    <div className="flex-grow">
                        <h3 className="font-semibold text-lg text-forest-text mb-2 font-heading line-clamp-2">
                            {title}
                        </h3>
                        {excerpt && (
                            <p className="text-sm text-forest-text/70 font-sans line-clamp-2">
                                {excerpt}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        {price ? (
                            <div>
                                <span className="text-2xl font-bold text-forest-primary">{price}</span>
                                {originalPrice && (
                                    <span className="text-sm text-forest-text/50 line-through ml-2">{originalPrice}</span>
                                )}
                            </div>
                        ) : (
                            <div className="text-sm text-forest-text/70">Xem chi tiết</div>
                        )}

                        <div className="p-2 bg-forest-primary text-white rounded-lg group-hover:bg-forest-primary/90 transition-colors duration-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
