'use client';

import { X, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui';
import { CartItem } from './CartItem';
import { useEffect } from 'react';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, total, clearCart } = useCart();

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#E5E5E5]">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-[#228B22]" />
                        <h2 className="text-lg font-bold text-[#333333]">
                            Giỏ hàng ({items.length})
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#F5F5F5] rounded-lg transition"
                        aria-label="Đóng giỏ hàng"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <ShoppingBag className="w-16 h-16 text-[#E5E5E5] mb-4" />
                            <p className="text-[#666666] mb-4">Giỏ hàng trống</p>
                            <Button onClick={onClose}>Tiếp tục mua sắm</Button>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {items.map(item => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-[#E5E5E5] p-4 space-y-4 bg-white">
                        {/* Subtotal */}
                        <div className="flex justify-between items-center">
                            <span className="text-[#666666]">Tạm tính:</span>
                            <span className="text-lg font-semibold text-[#333333]">
                                {formatPrice(total)}
                            </span>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center pt-3 border-t border-[#E5E5E5]">
                            <span className="text-lg font-bold text-[#333333]">Tổng cộng:</span>
                            <span className="text-2xl font-bold text-[#228B22]">
                                {formatPrice(total)}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            <Button fullWidth size="lg" asChild>
                                <Link href="/checkout" onClick={onClose}>
                                    Thanh toán
                                </Link>
                            </Button>
                            <Button fullWidth variant="outline" onClick={onClose}>
                                Tiếp tục mua sắm
                            </Button>
                        </div>

                        {/* Clear Cart */}
                        <button
                            onClick={() => {
                                if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
                                    clearCart();
                                }
                            }}
                            className="w-full text-sm text-[#666666] hover:text-red-600 transition py-2"
                        >
                            Xóa toàn bộ giỏ hàng
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
