'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';

interface ProductCardProps {
    id: number;
    slug: string;
    title: string;
    excerpt?: string;
    featuredImage?: {
        url: string;
        alt: string;
    };
    badge?: 'sale' | 'new' | 'hot';
    price?: string;
    originalPrice?: string;
    numericPrice?: number;
}

const badgeConfig = {
    sale: { label: 'Sale', className: 'bg-red-500 text-white' },
    new: { label: 'Mới', className: 'bg-primary text-white' },
    hot: { label: 'Hot', className: 'bg-orange-500 text-white' },
};

export default function ProductCard({
    id,
    slug,
    title,
    excerpt,
    featuredImage,
    badge,
    price,
    originalPrice,
    numericPrice,
}: ProductCardProps) {
    const { addItem } = useCart();
    const { showToast } = useToast();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addItem({
            id,
            productId: id,
            name: title,
            slug,
            price: numericPrice || 0,
            image: featuredImage?.url || '',
        });

        showToast({
            type: 'success',
            message: `Đã thêm "${title}" vào giỏ hàng`,
        });
    };

    return (
        <Link href={`/${slug}`} className="group block">
            <article className="card h-full flex flex-col">
                {/* Image Container */}
                <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden">
                    {featuredImage ? (
                        <Image
                            src={featuredImage.url}
                            alt={featuredImage.alt || title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}

                    {/* Badge */}
                    {badge && (
                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold 
                            ${badgeConfig[badge].className} animate-fade-in`}>
                            {badgeConfig[badge].label}
                        </span>
                    )}

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full 
                          group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-white text-gray-900 py-2.5 px-4 rounded-lg font-medium
                           flex items-center justify-center gap-2 hover:bg-primary hover:text-white
                           transition-colors duration-200 shadow-lg"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Thêm vào giỏ
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    className="p-2.5 bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                                    aria-label="Thêm yêu thích"
                                >
                                    <Heart className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                    {/* Title */}
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary 
                       transition-colors duration-200 font-heading">
                        {title}
                    </h3>

                    {/* Description */}
                    {excerpt && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">
                            {excerpt.replace(/<[^>]*>/g, '')}
                        </p>
                    )}

                    {/* Price */}
                    <div className="mt-auto pt-2">
                        {price ? (
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-lg font-bold text-primary">{price}</span>
                                {originalPrice && originalPrice !== price && (
                                    <span className="text-sm text-gray-400 line-through">{originalPrice}</span>
                                )}
                            </div>
                        ) : (
                            <span className="text-sm text-gray-500">Xem chi tiết</span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
}
