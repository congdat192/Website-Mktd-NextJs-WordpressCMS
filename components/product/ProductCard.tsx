import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui';
import { AddToCart } from './AddToCart';
import { formatPrice } from '@/lib/utils';
import type { WPProduct } from '@/lib/wordpress';

interface ProductCardProps {
    product: WPProduct;
}

export function ProductCard({ product }: ProductCardProps) {
    const image = product._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder-product.jpg';
    const price = product.wc_data?.price ? parseFloat(product.wc_data.price) : null;
    const regularPrice = product.wc_data?.regular_price ? parseFloat(product.wc_data.regular_price) : null;
    const onSale = product.wc_data?.on_sale || false;
    const stockStatus = product.wc_data?.stock_status || 'instock';

    return (
        <div className="group relative bg-white rounded-xl border border-[#E5E5E5] overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Image */}
            <Link href={`/${product.slug}`} className="block relative aspect-square overflow-hidden bg-[#F5F5F5]">
                <img
                    src={image}
                    alt={product.title.rendered}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {onSale && (
                        <Badge variant="error" className="shadow-sm">
                            Sale
                        </Badge>
                    )}
                    {stockStatus === 'outofstock' && (
                        <Badge variant="warning" className="shadow-sm">
                            Hết hàng
                        </Badge>
                    )}
                </div>

                {/* Quick View */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex gap-2">
                        <Link
                            href={`/${product.slug}`}
                            className="p-3 bg-white rounded-full hover:bg-[#228B22] hover:text-white transition"
                            aria-label="Xem chi tiết"
                        >
                            <Eye className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </Link>

            {/* Content */}
            <div className="p-4">
                {/* Category */}
                {product._embedded?.['wp:term']?.[0]?.[0] && (
                    <p className="text-xs text-[#666666] mb-2">
                        {product._embedded['wp:term'][0][0].name}
                    </p>
                )}

                {/* Title */}
                <Link href={`/${product.slug}`}>
                    <h3 className="font-semibold text-[#333333] mb-2 line-clamp-2 hover:text-[#228B22] transition min-h-[3rem]">
                        {product.title.rendered}
                    </h3>
                </Link>

                {/* Rating */}
                {product.wc_data && parseFloat(product.wc_data.average_rating) > 0 && (
                    <div className="flex items-center gap-1 mb-3">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    className={`w-4 h-4 ${star <= Math.round(parseFloat(product.wc_data!.average_rating))
                                            ? 'text-yellow-500 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-xs text-[#666666]">
                            ({product.wc_data.rating_count})
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="mb-3">
                    {price !== null ? (
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-[#228B22]">
                                {formatPrice(price)}
                            </span>
                            {onSale && regularPrice && (
                                <span className="text-sm text-[#666666] line-through">
                                    {formatPrice(regularPrice)}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-lg font-semibold text-[#228B22]">
                            Liên hệ
                        </span>
                    )}
                </div>

                {/* Add to Cart */}
                {stockStatus === 'instock' && price !== null && (
                    <AddToCart product={product} size="sm" />
                )}
            </div>
        </div>
    );
}
