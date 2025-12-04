'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, MapPin, CreditCard, Truck, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui';

interface CheckoutForm {
    // Customer Info
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    // Shipping Address
    address: string;
    city: string;
    district: string;
    ward: string;
    // Payment
    paymentMethod: 'cod' | 'bank_transfer';
    // Notes
    notes: string;
}

const initialFormData: CheckoutForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Hồ Chí Minh',
    district: '',
    ward: '',
    paymentMethod: 'cod',
    notes: '',
};

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total, itemCount, clearCart } = useCart();
    const [formData, setFormData] = useState<CheckoutForm>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Redirect if cart is empty
    if (items.length === 0 && !isSubmitting) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-white to-[#F5F5F5] flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
                    <ShoppingBag className="w-24 h-24 text-[#E5E5E5] mx-auto mb-6" />
                    <h2 className="text-xl font-semibold text-[#333333] mb-2">
                        Giỏ hàng trống
                    </h2>
                    <p className="text-[#666666] mb-8">
                        Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán
                    </p>
                    <Button asChild size="lg">
                        <Link href="/products">Mua sắm ngay</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name as keyof CheckoutForm]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateStep = (currentStep: number): boolean => {
        const newErrors: Partial<CheckoutForm> = {};

        if (currentStep === 1) {
            if (!formData.firstName.trim()) newErrors.firstName = 'Vui lòng nhập họ';
            if (!formData.lastName.trim()) newErrors.lastName = 'Vui lòng nhập tên';
            if (!formData.email.trim()) {
                newErrors.email = 'Vui lòng nhập email';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Email không hợp lệ';
            }
            if (!formData.phone.trim()) {
                newErrors.phone = 'Vui lòng nhập số điện thoại';
            } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
                newErrors.phone = 'Số điện thoại không hợp lệ';
            }
        }

        if (currentStep === 2) {
            if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
            if (!formData.district.trim()) newErrors.district = 'Vui lòng chọn quận/huyện';
            if (!formData.ward.trim()) newErrors.ward = 'Vui lòng nhập phường/xã';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep(step)) {
            setStep((prev) => Math.min(prev + 1, 3) as 1 | 2 | 3);
        }
    };

    const handlePrevStep = () => {
        setStep((prev) => Math.max(prev - 1, 1) as 1 | 2 | 3);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep(step)) return;

        setIsSubmitting(true);

        try {
            // Prepare order data for WooCommerce
            const orderData = {
                payment_method: formData.paymentMethod,
                payment_method_title: formData.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng',
                set_paid: false,
                billing: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address_1: formData.address,
                    city: formData.city,
                    state: formData.district,
                    postcode: '',
                    country: 'VN',
                },
                shipping: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    address_1: formData.address,
                    city: formData.city,
                    state: formData.district,
                    postcode: '',
                    country: 'VN',
                },
                line_items: items.map(item => ({
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
                customer_note: formData.notes,
            };

            // Call API to create order
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const order = await response.json();

            // Clear cart and redirect to confirmation
            clearCart();
            router.push(`/order-confirmation?order_id=${order.id}`);
        } catch (error) {
            console.error('Order submission error:', error);
            alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { number: 1, title: 'Thông tin', icon: MapPin },
        { number: 2, title: 'Giao hàng', icon: Truck },
        { number: 3, title: 'Thanh toán', icon: CreditCard },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-white to-[#F5F5F5]">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            href="/cart"
                            className="p-2 hover:bg-white rounded-lg transition shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#666666]" />
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#333333]">
                            Thanh toán
                        </h1>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-8">
                        {steps.map((s, index) => (
                            <div key={s.number} className="flex items-center">
                                <div
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${step >= s.number
                                            ? 'bg-[#228B22] text-white'
                                            : 'bg-white text-[#666666]'
                                        }`}
                                >
                                    {step > s.number ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <s.icon className="w-5 h-5" />
                                    )}
                                    <span className="hidden sm:inline text-sm font-medium">{s.title}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 md:w-16 h-1 mx-2 rounded ${step > s.number ? 'bg-[#228B22]' : 'bg-[#E5E5E5]'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit}>
                                {/* Step 1: Customer Info */}
                                {step === 1 && (
                                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                                        <h2 className="text-lg font-bold text-[#333333] mb-6 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-[#228B22]" />
                                            Thông tin khách hàng
                                        </h2>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-[#333333] mb-2">
                                                    Họ *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-[#E5E5E5]'
                                                        } focus:border-[#228B22] focus:ring-2 focus:ring-[#228B22]/20 outline-none transition`}
                                                    placeholder="Nguyễn"
                                                />
                                                {errors.firstName && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-[#333333] mb-2">
                                                    Tên *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-[#E5E5E5]'
                                                        } focus:border-[#228B22] focus:ring-2 focus:ring-[#228B22]/20 outline-none transition`}
                                                    placeholder="Văn A"
                                                />
                                                {errors.lastName && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-[#333333] mb-2">
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-[#E5E5E5]'
                                                        } focus:border-[#228B22] focus:ring-2 focus:ring-[#228B22]/20 outline-none transition`}
                                                    placeholder="email@example.com"
                                                />
                                                {errors.email && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-[#333333] mb-2">
                                                    Số điện thoại *
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-[#E5E5E5]'
                                                        } focus:border-[#228B22] focus:ring-2 focus:ring-[#228B22]/20 outline-none transition`}
                                                    placeholder="0901234567"
                                                />
                                                {errors.phone && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            <Button type="button" onClick={handleNextStep} size="lg">
                                                Tiếp tục
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Shipping */}
                                {step === 2 && (
                                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                                        <h2 className="text-lg font-bold text-[#333333] mb-6 flex items-center gap-2">
                                            <Truck className="w-5 h-5 text-[#228B22]" />
                                            Địa chỉ giao hàng
                                        </h2>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-[#333333] mb-2">
                                                    Địa chỉ *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-lg border ${errors.address ? 'border-red-500' : 'border-[#E5E5E5]'
                                                        } focus:border-[#228B22] focus:ring-2 focus:ring-[#228B22]/20 outline-none transition`}
                                                    placeholder="Số nhà, tên đường"
                                                />
                                                {errors.address && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                                                )}
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-[#333333] mb-2">
                                                        Tỉnh/Thành phố
                                                    </label>
                                                    <select
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] focus:border-[#228B22] focus:ring-2 focus:ring-[#228B22]/20 outline-none transition bg-white"
                                                    >
                                                        <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                                        <option value="Hà Nội">Hà Nội</option>
                                                        <option value="Đà Nẵng">Đà Nẵng</option>
                                                        <option value="Khác">Khác</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-[#333333] mb-2">
                                                        Quận/Huyện *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="district"
                                                        value={formData.district}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 rounded-lg border ${errors.district ? 'border-red-500' : 'border-[#E5E5E5]'
                                                            } focus:border-[#228B22] focus:ring-2 focus:ring-[#228B22]/20 outline-none transition`}
                                                        placeholder="Quận 1"
                                                    />
                                                    {errors.district && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.district}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-[#333333] mb-2">
                                                        Phường/Xã *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="ward"
                                                        value={formData.ward}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 rounded-lg border ${errors.ward ? 'border-red-500' : 'border-[#E5E5E5]'
                                                            } focus:border-[#228B22] focus:ring-2 focus:ring-[#228B22]/20 outline-none transition`}
                                                        placeholder="Phường Bến Nghé"
                                                    />
                                                    {errors.ward && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.ward}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[#333333] mb-2">
                                                    Ghi chú đơn hàng (tùy chọn)
                                                </label>
                                                <textarea
                                                    name="notes"
                                                    value={formData.notes}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] focus:border-[#228B22] focus:ring-2 focus:ring-[#228B22]/20 outline-none transition resize-none"
                                                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian giao hàng, hướng dẫn giao hàng..."
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-between">
                                            <Button type="button" variant="outline" onClick={handlePrevStep}>
                                                Quay lại
                                            </Button>
                                            <Button type="button" onClick={handleNextStep} size="lg">
                                                Tiếp tục
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Payment */}
                                {step === 3 && (
                                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                                        <h2 className="text-lg font-bold text-[#333333] mb-6 flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-[#228B22]" />
                                            Phương thức thanh toán
                                        </h2>

                                        <div className="space-y-4">
                                            {/* COD */}
                                            <label
                                                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${formData.paymentMethod === 'cod'
                                                        ? 'border-[#228B22] bg-[#228B22]/5'
                                                        : 'border-[#E5E5E5] hover:border-[#228B22]/50'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="cod"
                                                    checked={formData.paymentMethod === 'cod'}
                                                    onChange={handleInputChange}
                                                    className="mt-1 w-5 h-5 text-[#228B22] focus:ring-[#228B22]"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-[#333333]">
                                                            Thanh toán khi nhận hàng (COD)
                                                        </span>
                                                        <span className="px-2 py-0.5 bg-[#228B22] text-white text-xs rounded-full">
                                                            Phổ biến
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-[#666666] mt-1">
                                                        Thanh toán bằng tiền mặt khi nhận hàng
                                                    </p>
                                                </div>
                                            </label>

                                            {/* Bank Transfer */}
                                            <label
                                                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${formData.paymentMethod === 'bank_transfer'
                                                        ? 'border-[#228B22] bg-[#228B22]/5'
                                                        : 'border-[#E5E5E5] hover:border-[#228B22]/50'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="bank_transfer"
                                                    checked={formData.paymentMethod === 'bank_transfer'}
                                                    onChange={handleInputChange}
                                                    className="mt-1 w-5 h-5 text-[#228B22] focus:ring-[#228B22]"
                                                />
                                                <div className="flex-1">
                                                    <span className="font-medium text-[#333333]">
                                                        Chuyển khoản ngân hàng
                                                    </span>
                                                    <p className="text-sm text-[#666666] mt-1">
                                                        Chuyển khoản trước khi giao hàng. Thông tin tài khoản sẽ được gửi qua email.
                                                    </p>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="mt-6 flex justify-between">
                                            <Button type="button" variant="outline" onClick={handlePrevStep}>
                                                Quay lại
                                            </Button>
                                            <Button
                                                type="submit"
                                                size="lg"
                                                disabled={isSubmitting}
                                                className="min-w-[160px]"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                        Đang xử lý...
                                                    </>
                                                ) : (
                                                    'Đặt hàng'
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                <h2 className="text-lg font-bold text-[#333333] mb-6">
                                    Đơn hàng của bạn
                                </h2>

                                {/* Items */}
                                <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingBag className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-[#333333] line-clamp-2">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-[#666666]">
                                                    SL: {item.quantity}
                                                </p>
                                                <p className="text-sm font-semibold text-[#228B22]">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 border-t border-[#E5E5E5] pt-4">
                                    <div className="flex justify-between text-sm text-[#666666]">
                                        <span>Tạm tính</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-[#666666]">
                                        <span>Phí vận chuyển</span>
                                        <span className="text-[#228B22]">Miễn phí</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-[#E5E5E5]">
                                        <span className="font-bold text-[#333333]">Tổng cộng</span>
                                        <span className="text-xl font-bold text-[#228B22]">
                                            {formatPrice(total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Edit Cart Link */}
                                <div className="mt-4 text-center">
                                    <Link
                                        href="/cart"
                                        className="text-sm text-[#228B22] hover:underline"
                                    >
                                        Chỉnh sửa giỏ hàng
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
