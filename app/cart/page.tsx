'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui';
import { CartItem } from '@/components/cart/CartItem';

export default function CartPage() {
    const { items, total, clearCart, itemCount } = useCart();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-white to-[#F5F5F5]">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/products"
                                className="p-2 hover:bg-white rounded-lg transition shadow-sm"
                            >
                                <ArrowLeft className="w-5 h-5 text-[#666666]" />
                            </Link>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-[#333333]">
                                    Giỏ hàng
                                </h1>
                                <p className="text-[#666666] text-sm">
                                    {itemCount} sản phẩm
                                </p>
                            </div>
                        </div>
                        {items.length > 0 && (
                            <button
                                onClick={() => {
                                    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
                                        clearCart();
                                    }
                                }}
                                className="flex items-center gap-2 text-sm text-[#666666] hover:text-red-600 transition"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden md:inline">Xóa tất cả</span>
                            </button>
                        )}
                    </div>

                    {items.length === 0 ? (
                        /* Empty Cart */
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <ShoppingBag className="w-24 h-24 text-[#E5E5E5] mx-auto mb-6" />
                            <h2 className="text-xl font-semibold text-[#333333] mb-2">
                                Giỏ hàng trống
                            </h2>
                            <p className="text-[#666666] mb-8">
                                Hãy khám phá các sản phẩm tuyệt vời của chúng tôi
                            </p>
                            <Button asChild size="lg">
                                <Link href="/products">
                                    Tiếp tục mua sắm
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                    <div className="divide-y divide-[#E5E5E5]">
                                        {items.map(item => (
                                            <div key={item.id} className="p-4 md:p-6">
                                                <CartItem item={item} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Continue Shopping */}
                                <div className="mt-6">
                                    <Link
                                        href="/products"
                                        className="inline-flex items-center gap-2 text-[#228B22] hover:text-[#1a6b1a] transition font-medium"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Tiếp tục mua sắm
                                    </Link>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                    <h2 className="text-lg font-bold text-[#333333] mb-6">
                                        Tóm tắt đơn hàng
                                    </h2>

                                    {/* Summary Details */}
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-[#666666]">
                                            <span>Tạm tính ({itemCount} sản phẩm)</span>
                                            <span>{formatPrice(total)}</span>
                                        </div>
                                        <div className="flex justify-between text-[#666666]">
                                            <span>Phí vận chuyển</span>
                                            <span className="text-[#228B22]">Miễn phí</span>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-[#E5E5E5] pt-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-[#333333]">Tổng cộng</span>
                                            <span className="text-2xl font-bold text-[#228B22]">
                                                {formatPrice(total)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#666666] mt-1">
                                            (Đã bao gồm VAT nếu có)
                                        </p>
                                    </div>

                                    {/* Checkout Button */}
                                    <Button fullWidth size="lg" asChild>
                                        <Link href="/checkout">
                                            Tiến hành thanh toán
                                        </Link>
                                    </Button>

                                    {/* Trust Badges */}
                                    <div className="mt-6 pt-6 border-t border-[#E5E5E5]">
                                        <div className="flex items-center justify-center gap-4 text-xs text-[#666666]">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-[#228B22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                <span>Thanh toán an toàn</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-[#228B22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                                <span>Đa dạng thanh toán</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
