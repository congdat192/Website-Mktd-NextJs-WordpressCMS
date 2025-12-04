'use client';

import { X, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui';
import type { CartItem as CartItemType } from '@/store/cartStore';

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCart();

    return (
        <div className="flex gap-4 py-4 border-b border-[#E5E5E5]">
            {/* Image */}
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#F5F5F5]">
                <img
                    src={item.image || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#333333] truncate">{item.name}</h3>
                {item.sku && (
                    <p className="text-sm text-[#666666] mt-0.5">SKU: {item.sku}</p>
                )}
                {item.attributes && Object.keys(item.attributes).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(item.attributes).map(([key, value]) => (
                            value && (
                                <span key={key} className="text-xs text-[#666666]">
                                    {key}: {value}
                                </span>
                            )
                        ))}
                    </div>
                )}

                {/* Price & Quantity */}
                <div className="flex items-center justify-between mt-2">
                    <p className="font-semibold text-[#228B22]">
                        {formatPrice(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E5E5E5] hover:bg-[#F5F5F5] transition"
                            aria-label="Giảm số lượng"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E5E5E5] hover:bg-[#F5F5F5] transition"
                            aria-label="Tăng số lượng"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Remove Button */}
            <button
                onClick={() => removeItem(item.id)}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 text-[#666666] hover:text-red-600 transition"
                aria-label="Xóa sản phẩm"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}
