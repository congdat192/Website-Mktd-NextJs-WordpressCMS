import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

interface CartSummaryProps {
    showShipping?: boolean;
    showTax?: boolean;
}

export function CartSummary({ showShipping = true, showTax = false }: CartSummaryProps) {
    const { items, total } = useCart();

    const subtotal = total;
    const shipping = showShipping ? (subtotal >= 500000 ? 0 : 30000) : 0;
    const tax = showTax ? subtotal * 0.1 : 0;
    const finalTotal = subtotal + shipping + tax;

    return (
        <div className="bg-[#F5F5F5] rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#333333] mb-4">Tổng đơn hàng</h3>

            <div className="space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between text-[#666666]">
                    <span>Tạm tính ({items.length} sản phẩm)</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>

                {/* Shipping */}
                {showShipping && (
                    <div className="flex justify-between text-[#666666]">
                        <span>Phí vận chuyển</span>
                        <span className="font-semibold">
                            {shipping === 0 ? (
                                <span className="text-[#228B22]">Miễn phí</span>
                            ) : (
                                formatPrice(shipping)
                            )}
                        </span>
                    </div>
                )}

                {/* Tax */}
                {showTax && (
                    <div className="flex justify-between text-[#666666]">
                        <span>Thuế VAT (10%)</span>
                        <span className="font-semibold">{formatPrice(tax)}</span>
                    </div>
                )}

                {/* Free shipping notice */}
                {showShipping && shipping > 0 && (
                    <div className="text-xs text-[#666666] bg-white p-3 rounded-lg">
                        Mua thêm {formatPrice(500000 - subtotal)} để được miễn phí vận chuyển
                    </div>
                )}

                {/* Divider */}
                <div className="border-t border-[#E5E5E5] pt-3">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-[#333333]">Tổng cộng</span>
                        <span className="text-2xl font-bold text-[#228B22]">
                            {formatPrice(finalTotal)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
