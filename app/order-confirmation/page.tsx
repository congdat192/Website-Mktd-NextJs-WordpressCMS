'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Mail, Phone, MapPin, CreditCard, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { formatPrice } from '@/lib/utils';

interface OrderDetails {
    id: number;
    number: string;
    status: string;
    total: string;
    date_created: string;
    billing: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        address_1: string;
        city: string;
        state: string;
    };
    payment_method_title: string;
    line_items?: Array<{
        id: number;
        name: string;
        quantity: number;
        total: string;
    }>;
}

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError('Không tìm thấy mã đơn hàng');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/orders?id=${orderId}`);
                if (!response.ok) {
                    throw new Error('Order not found');
                }
                const data = await response.json();
                setOrder(data);
            } catch (err) {
                setError('Không thể tải thông tin đơn hàng');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-white to-[#F5F5F5] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-[#228B22] animate-spin" />
                    <p className="text-[#666666]">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-white to-[#F5F5F5] flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">❌</span>
                    </div>
                    <h2 className="text-xl font-semibold text-[#333333] mb-2">
                        {error || 'Có lỗi xảy ra'}
                    </h2>
                    <p className="text-[#666666] mb-8">
                        Vui lòng liên hệ với chúng tôi để được hỗ trợ
                    </p>
                    <Button asChild>
                        <Link href="/">Về trang chủ</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            'pending': 'Chờ xác nhận',
            'processing': 'Đang xử lý',
            'on-hold': 'Tạm giữ',
            'completed': 'Hoàn thành',
            'cancelled': 'Đã hủy',
            'refunded': 'Đã hoàn tiền',
            'failed': 'Thất bại',
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'processing': 'bg-blue-100 text-blue-800',
            'on-hold': 'bg-orange-100 text-orange-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
            'refunded': 'bg-purple-100 text-purple-800',
            'failed': 'bg-red-100 text-red-800',
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-white to-[#F5F5F5]">
            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="max-w-3xl mx-auto">
                    {/* Success Header */}
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 bg-[#228B22]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <CheckCircle className="w-14 h-14 text-[#228B22]" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
                            Đặt hàng thành công!
                        </h1>
                        <p className="text-lg text-[#666666]">
                            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận sớm nhất.
                        </p>
                    </div>

                    {/* Order Info Card */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                        {/* Order Header */}
                        <div className="bg-[#228B22] text-white p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <p className="text-sm opacity-80">Mã đơn hàng</p>
                                    <p className="text-2xl font-bold">#{order.number}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                    <p className="text-sm opacity-80">
                                        {new Date(order.date_created).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-[#333333] mb-3 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-[#228B22]" />
                                        Thông tin liên hệ
                                    </h3>
                                    <div className="space-y-2 text-sm text-[#666666]">
                                        <p className="font-medium text-[#333333]">
                                            {order.billing.first_name} {order.billing.last_name}
                                        </p>
                                        <p>{order.billing.email}</p>
                                        <p>{order.billing.phone}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#333333] mb-3 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#228B22]" />
                                        Địa chỉ giao hàng
                                    </h3>
                                    <div className="text-sm text-[#666666]">
                                        <p>{order.billing.address_1}</p>
                                        <p>{order.billing.state}, {order.billing.city}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="border-t border-[#E5E5E5] pt-6">
                                <h3 className="font-semibold text-[#333333] mb-3 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-[#228B22]" />
                                    Phương thức thanh toán
                                </h3>
                                <p className="text-[#666666]">{order.payment_method_title}</p>
                            </div>

                            {/* Order Items */}
                            {order.line_items && order.line_items.length > 0 && (
                                <div className="border-t border-[#E5E5E5] pt-6">
                                    <h3 className="font-semibold text-[#333333] mb-4 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-[#228B22]" />
                                        Sản phẩm đã đặt
                                    </h3>
                                    <div className="space-y-3">
                                        {order.line_items.map(item => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span className="text-[#666666]">
                                                    {item.name} × {item.quantity}
                                                </span>
                                                <span className="font-medium text-[#333333]">
                                                    {formatPrice(parseFloat(item.total))}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            <div className="border-t border-[#E5E5E5] pt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-[#333333]">Tổng cộng</span>
                                    <span className="text-2xl font-bold text-[#228B22]">
                                        {formatPrice(parseFloat(order.total))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <h3 className="font-semibold text-[#333333] mb-4">Các bước tiếp theo</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-[#228B22]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-[#228B22] font-bold text-sm">1</span>
                                </div>
                                <div>
                                    <p className="font-medium text-[#333333]">Xác nhận đơn hàng</p>
                                    <p className="text-sm text-[#666666]">
                                        Chúng tôi sẽ gọi điện xác nhận đơn hàng trong vòng 30 phút
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-[#228B22]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-[#228B22] font-bold text-sm">2</span>
                                </div>
                                <div>
                                    <p className="font-medium text-[#333333]">Chuẩn bị hàng</p>
                                    <p className="text-sm text-[#666666]">
                                        Đơn hàng sẽ được đóng gói cẩn thận và giao cho đơn vị vận chuyển
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-[#228B22]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-[#228B22] font-bold text-sm">3</span>
                                </div>
                                <div>
                                    <p className="font-medium text-[#333333]">Giao hàng</p>
                                    <p className="text-sm text-[#666666]">
                                        Dự kiến giao hàng trong 2-3 ngày làm việc
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg">
                            <Link href="/products">
                                Tiếp tục mua sắm
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                        <Button variant="outline" asChild size="lg">
                            <Link href="/">
                                Về trang chủ
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-white to-[#F5F5F5] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-[#228B22] animate-spin" />
                    <p className="text-[#666666]">Đang tải...</p>
                </div>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}
