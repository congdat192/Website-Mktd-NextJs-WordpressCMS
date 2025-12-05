import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCurrentUser, formatPhoneNumber } from "@/lib/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CouponCode } from "@/lib/vouchers";
import {
  getClaimedCoupons,
  claimVoucher,
  parseDiscountFromTitle,
} from "@/lib/vouchers";
import { getAllVoucherProgramsForCurrentUser } from "@/lib/voucher-programs";
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  ArrowLeft,
  Heart,
  Shield,
  Truck,
  Gift,
  Tag,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Star,
  Trash2,
  RotateCcw,
  Percent,
  Package,
  Calendar,
  ShoppingBag,
  Crown,
  Sparkles,
  ChevronRight,
  Copy,
  QrCode,
} from "lucide-react";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  variant: {
    color: string;
    size: string;
    lensType?: string;
  };
  isInStock: boolean;
  maxQuantity: number;
  isPremium?: boolean;
}

const Cart = () => {
  const CART_STORAGE_KEY = "cartItems";
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const [couponCode, setCouponCode] = useState("");
  const user = getCurrentUser();
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: "",
    address: "",
    city: "",
    district: "",
    ward: "",
  });
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);
  const [couponError, setCouponError] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<CouponCode[]>([]);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [selectedCouponCode, setSelectedCouponCode] = useState<string | null>(
    null,
  );
  const [voucherSearchCode, setVoucherSearchCode] = useState("");
  const [claimingId, setClaimingId] = useState<string | null>(null);

  // Order note (persisted)
  const ORDER_NOTE_KEY = "orderNote";
  const [orderNote, setOrderNote] = useState("");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ORDER_NOTE_KEY);
      if (typeof saved === "string") setOrderNote(saved);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(ORDER_NOTE_KEY, orderNote);
    } catch {}
  }, [orderNote]);

  // Inline order placement state and handler
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{
    code: string;
    date: string;
  } | null>(null);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any | null>(
    null,
  );
  const ORDER_SEQ_KEY = "orderSeq";
  const generateOrderCode = () => {
    try {
      const raw = localStorage.getItem(ORDER_SEQ_KEY);
      let seq = raw ? parseInt(raw, 10) || 0 : 0;
      seq = (seq % 9999) + 1;
      localStorage.setItem(ORDER_SEQ_KEY, String(seq));
      return `Order#${seq.toString().padStart(4, "0")}`;
    } catch {
      const seq = Math.floor(1 + Math.random() * 9999);
      return `Order#${seq.toString().padStart(4, "0")}`;
    }
  };
  const handlePlaceOrder = async () => {
    if (hasOutOfStockItems || cartItems.length === 0) return;
    const code = generateOrderCode();
    const nowIso = new Date().toISOString();
    try {
      const u = user || getCurrentUser();
      const key = `websiteOrders:${u?.phone ?? "guest"}`;
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      const addressFull = [
        shippingInfo.address,
        shippingInfo.ward,
        shippingInfo.district,
        shippingInfo.city,
      ]
        .filter(Boolean)
        .join(", ");
      const order = {
        code,
        date: nowIso,
        seller: "Website",
        branch: "Online",
        total: total,
        status: "Đang xử lý",
        contact: {
          fullName: shippingInfo.fullName || u?.name || "",
          phone: shippingInfo.phone || u?.phone || "",
          email: shippingInfo.email || "",
        },
        address: addressFull,
        shipping: {
          method: shippingMethod,
          fee: shippingFee,
          duration: selectedShipping?.duration || "",
        },
        payment: {
          method: paymentMethod,
          fee: paymentFee,
          discount: paymentDiscount,
        },
        coupon: appliedCoupon
          ? {
              code: appliedCoupon.code,
              description: appliedCoupon.description,
              discount: couponDiscount,
            }
          : null,
        items: cartItems.map(
          ({
            id,
            productId,
            name,
            brand,
            image,
            price,
            originalPrice,
            quantity,
            variant,
          }) => ({
            id,
            productId,
            name,
            brand,
            image,
            price,
            originalPrice,
            quantity,
            variant,
          }),
        ),
        summary: {
          subtotal,
          savedAmount,
          couponDiscount,
          paymentDiscount,
          shippingFee,
          totalBeforeDiscounts,
          total,
        },
        note: orderNote,
      };
      list.unshift(order);
      localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
      setPlacedOrderDetails(order);

      // Insert into Supabase (best-effort)
      try {
        const { supabase } = await import("@/lib/supabase");
        const o = order;
        await supabase.from("website_orders").insert({
          code: o.code,
          user_phone: o.contact.phone || u?.phone || null,
          date: o.date,
          seller: o.seller,
          branch: o.branch,
          total: o.summary.total,
          status: o.status,
          contact_full_name: o.contact.fullName,
          contact_phone: o.contact.phone,
          contact_email: o.contact.email,
          address: o.address,
          shipping_method: o.shipping.method,
          shipping_fee: o.shipping.fee,
          shipping_duration: o.shipping.duration,
          payment_method: o.payment.method,
          payment_fee: o.payment.fee,
          payment_discount: o.payment.discount,
          coupon_code: o.coupon?.code || null,
          coupon_description: o.coupon?.description || null,
          coupon_discount: o.coupon?.discount || 0,
          subtotal: o.summary.subtotal,
          saved_amount: o.summary.savedAmount,
          total_before_discounts: o.summary.totalBeforeDiscounts,
          note: o.note || null,
        });
        if (o.items?.length) {
          await supabase.from("website_order_items").insert(
            o.items.map((it) => ({
              order_code: o.code,
              product_id: it.productId,
              name: it.name,
              brand: it.brand,
              image: it.image,
              price: it.price,
              original_price: it.originalPrice ?? null,
              quantity: it.quantity,
              variant_color: it.variant.color,
              variant_size: it.variant.size,
              variant_lens_type: it.variant.lensType ?? null,
            })),
          );
        }
      } catch {}
    } catch {}
    setPlacedOrder({ code, date: nowIso });
    setOrderPlaced(true);
    setAppliedCoupon(null);
    setCartItems([]);
  };

  useEffect(() => {
    // Load saved shipping info for this user if available
    try {
      const key = user ? `shippingInfo:${user.phone}` : null;
      if (key) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          setShippingInfo((prev) => ({ ...prev, ...parsed }));
        }
        // Prefill email from profile if available
        const pRaw = localStorage.getItem(`profile:${user?.phone}`);
        if (pRaw) {
          const p = JSON.parse(pRaw);
          if (p?.email)
            setShippingInfo((prev) => ({
              ...prev,
              email: prev.email || p.email,
            }));
        }
      }
    } catch {}

    (async () => {
      try {
        const { fetchClaimedCouponsForCurrentUser } = await import(
          "@/lib/vouchers"
        );
        const rows = await fetchClaimedCouponsForCurrentUser();
        setAvailableCoupons(rows);
      } catch {
        setAvailableCoupons(getClaimedCoupons());
      }
    })();
    const onUpdated = async () => {
      try {
        const { fetchClaimedCouponsForCurrentUser } = await import(
          "@/lib/vouchers"
        );
        const rows = await fetchClaimedCouponsForCurrentUser();
        setAvailableCoupons(rows);
      } catch {
        setAvailableCoupons(getClaimedCoupons());
      }
    };
    window.addEventListener(
      "claimed-coupons-updated",
      onUpdated as EventListener,
    );
    window.addEventListener("storage", onUpdated as EventListener);
    return () => {
      window.removeEventListener(
        "claimed-coupons-updated",
        onUpdated as EventListener,
      );
      window.removeEventListener("storage", onUpdated as EventListener);
    };
  }, []);

  const shippingOptions = [
    {
      id: "standard",
      name: "Giao hàng tiêu chuẩn",
      price: 0,
      duration: "2-3 ngày",
      description: "Miễn phí cho đơn hàng từ 1 triệu",
    },
    {
      id: "express",
      name: "Giao hàng nhanh",
      price: 50000,
      duration: "1-2 ngày",
      description: "Nhận hàng trong 24-48 giờ",
    },
    {
      id: "pickup",
      name: "Nhận tại cửa hàng",
      price: 0,
      duration: "Ngay hôm nay",
      description: "Chọn cửa hàng gần bạn",
    },
  ];

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === itemId) {
          const quantity = Math.max(1, Math.min(newQuantity, item.maxQuantity));
          return { ...item, quantity };
        }
        return item;
      }),
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const moveToWishlist = (itemId: string) => {
    console.log("Move to wishlist:", itemId);
    removeItem(itemId);
  };

  const applyCouponByCode = (code: string, closeOnSuccess = false): boolean => {
    setCouponError("");
    const coupon = availableCoupons.find(
      (c) => c.code.toLowerCase() === code.toLowerCase(),
    );

    if (!coupon) {
      setCouponError("Mã giảm giá không hợp lệ");
      return false;
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      setCouponError(`Đơn hàng tối thiểu ${coupon.minOrder.toLocaleString()}đ`);
      return false;
    }

    setAppliedCoupon(coupon);
    if (closeOnSuccess) setVoucherOpen(false);
    return true;
  };

  const applyCoupon = () => {
    const ok = applyCouponByCode(couponCode);
    if (ok) setCouponCode("");
  };

  const applySelectedCoupon = (coupon: CouponCode) => {
    setCouponError("");
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      setCouponError(`Đơn hàng tối thiểu ${coupon.minOrder.toLocaleString()}đ`);
      return;
    }
    setAppliedCoupon(coupon);
    setVoucherOpen(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const paymentMethods = [
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng (COD)",
      info: "Thanh toán tiền mặt khi nhận hàng. Nhân viên giao hàng sẽ liên hệ trước khi giao.",
    },
    {
      id: "bank_transfer",
      name: "Chuyển khoản ngân hàng",
      info: "Chuyển khoản theo hướng dẫn sau khi đ���t hàng. Vui lòng ghi đúng nội dung mã đơn hàng.",
    },
  ];

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [tempPaymentMethod, setTempPaymentMethod] = useState<string>("cod");

  const originalSubtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.originalPrice ? item.originalPrice : item.price) * item.quantity,
    0,
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const savedAmount = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.originalPrice ? item.originalPrice - item.price : 0) *
        item.quantity,
    0,
  );

  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? Math.min(
          (subtotal * appliedCoupon.discount) / 100,
          appliedCoupon.maxDiscount ?? Number.POSITIVE_INFINITY,
        )
      : appliedCoupon.discount
    : 0;

  const selectedShipping = shippingOptions.find(
    (option) => option.id === shippingMethod,
  );
  const shippingFee =
    subtotal >= 1000000 && shippingMethod === "standard"
      ? 0
      : selectedShipping?.price || 0;

  const selectedPayment = paymentMethods.find((pm) => pm.id === paymentMethod);
  const paymentFee = 0;
  const paymentDiscount = 0;

  const total =
    subtotal - couponDiscount - paymentDiscount + paymentFee + shippingFee;
  // Snapshot values for success view
  const viewSubtotal = placedOrderDetails?.summary?.subtotal ?? subtotal;
  const viewSavedAmount =
    placedOrderDetails?.summary?.savedAmount ?? savedAmount;
  const viewCouponDiscount =
    placedOrderDetails?.summary?.couponDiscount ?? couponDiscount;
  const viewShippingFee =
    placedOrderDetails?.summary?.shippingFee ?? shippingFee;
  const viewTotal = placedOrderDetails?.summary?.total ?? total;
  const viewContact = placedOrderDetails?.contact ?? {
    fullName: shippingInfo.fullName || user?.name || "",
    phone: shippingInfo.phone || user?.phone || "",
    email: shippingInfo.email || "",
  };
  const viewAddress =
    placedOrderDetails?.address ??
    [
      shippingInfo.address,
      shippingInfo.ward,
      shippingInfo.district,
      shippingInfo.city,
    ]
      .filter(Boolean)
      .join(", ");
  const viewShippingMethod =
    placedOrderDetails?.shipping?.method ?? shippingMethod;
  const viewShippingDuration =
    placedOrderDetails?.shipping?.duration ?? selectedShipping?.duration ?? "";
  const viewPaymentMethod =
    placedOrderDetails?.payment?.method ?? paymentMethod;
  const viewPaymentName =
    paymentMethods.find((m) => m.id === viewPaymentMethod)?.name || "";
  const viewShippingName =
    shippingOptions.find((s) => s.id === viewShippingMethod)?.name ||
    viewShippingMethod;
  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalBeforeDiscounts = originalSubtotal + paymentFee + shippingFee;
  const totalSavings = savedAmount + couponDiscount + paymentDiscount;
  const voucherCount = getAllVoucherProgramsForCurrentUser().length;

  const getCouponSavings = (c: CouponCode): number => {
    if (c.minOrder && subtotal < c.minOrder) return 0;
    return c.type === "percentage"
      ? Math.min(
          (subtotal * c.discount) / 100,
          c.maxDiscount ?? Number.POSITIVE_INFINITY,
        )
      : c.discount;
  };
  const bestCoupon = availableCoupons.reduce<{
    code: string | null;
    saving: number;
  }>(
    (acc, c) => {
      const s = getCouponSavings(c);
      if (s > acc.saving) return { code: c.code, saving: s };
      return acc;
    },
    { code: null, saving: 0 },
  );

  useEffect(() => {
    if (!voucherOpen) return;
    // compute best eligible coupon based on current subtotal and available coupons
    const best = availableCoupons.reduce<{
      code: string | null;
      saving: number;
    }>(
      (acc, c) => {
        const saving =
          c.type === "percentage"
            ? Math.min(
                (subtotal * c.discount) / 100,
                c.maxDiscount ?? Number.POSITIVE_INFINITY,
              )
            : c.discount;
        const eligible = !c.minOrder || subtotal >= c.minOrder;
        const effective = eligible ? saving : 0;
        if (effective > acc.saving) return { code: c.code, saving: effective };
        return acc;
      },
      { code: null, saving: 0 },
    );

    setSelectedCouponCode(appliedCoupon?.code ?? best.code);
    setVoucherSearchCode("");
    setCouponError("");
  }, [voucherOpen, availableCoupons, appliedCoupon?.code, subtotal]);

  const hasOutOfStockItems = cartItems.some((item) => !item.isInStock);

  // Payment info helper functions
  const bankDetails = {
    name: "Ngân hàng Á châu ACB",
    account: "9221666888",
    accountName: "DINH CONG DAT",
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could show a toast here
      console.log(`Copied ${label}: ${text}`);
    });
  };

  const qrCodeImageUrl =
    "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2F8c341ec17fad41b0a91280759eb7dca6?format=webp&width=800";

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeImageUrl;
    link.download = `QR-BankTransfer-${placedOrder?.code || "order"}.png`;
    link.target = "_blank";
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumb */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Trang chủ
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Giỏ hàng</span>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {orderPlaced ? (
            <div className="max-w-3xl mx-auto">
              <Card className="border-2 border-green-300 shadow-lg">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold">Đặt hàng thành công</h2>
                  <p className="text-gray-600">
                    Cảm ơn bạn đã mua hàng! Chúng tôi sẽ liên hệ để xác nhận và
                    giao hàng sớm nhất.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">
                        Thông tin giao hàng
                      </div>
                      <div className="p-3 border rounded-lg bg-gray-50">
                        <div className="font-medium">
                          {viewContact.fullName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatPhoneNumber(viewContact.phone || "")}
                        </div>
                        <div className="text-sm text-gray-700 mt-1">
                          {viewAddress}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">
                        Thanh toán & Vận chuyển
                      </div>
                      <div className="p-3 border rounded-lg bg-gray-50 text-sm space-y-1">
                        <div>
                          Thanh toán:{" "}
                          <span className="font-medium">{viewPaymentName}</span>
                        </div>
                        <div>
                          Vận chuyển:{" "}
                          <span className="font-medium">
                            {viewShippingName}
                          </span>{" "}
                          ({viewShippingDuration})
                        </div>
                        {placedOrderDetails?.coupon?.code ? (
                          <div>
                            Voucher:{" "}
                            <span className="font-mono">
                              {placedOrderDetails.coupon.code}
                            </span>{" "}
                            — {placedOrderDetails.coupon.description}
                          </div>
                        ) : appliedCoupon && couponDiscount > 0 ? (
                          <div>
                            Voucher:{" "}
                            <span className="font-mono">
                              {appliedCoupon.code}
                            </span>{" "}
                            — {appliedCoupon.description}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 p-3 border rounded-lg bg-white text-sm">
                    <div className="flex justify-between">
                      <span>Tổng tiền hàng</span>
                      <span className="font-medium">
                        {viewSubtotal.toLocaleString()}đ
                      </span>
                    </div>
                    {viewSavedAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Giảm giá trực tiếp</span>
                        <span className="text-green-600">
                          -{viewSavedAmount.toLocaleString()}đ
                        </span>
                      </div>
                    )}
                    {viewCouponDiscount > 0 && (
                      <div className="flex justify-between">
                        <span>Giảm giá voucher</span>
                        <span className="text-green-600">
                          -{viewCouponDiscount.toLocaleString()}đ
                        </span>
                      </div>
                    )}
                    {viewShippingFee > 0 && (
                      <div className="flex justify-between">
                        <span>Phí vận chuyển</span>
                        <span>{viewShippingFee.toLocaleString()}đ</span>
                      </div>
                    )}
                    <div className="border-t mt-2 pt-2 flex justify-between text-base">
                      <span className="font-semibold">Thành tiền</span>
                      <span className="font-bold text-blue-600">
                        {viewTotal.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                  {placedOrder && (
                    <div className="bg-gray-50 border rounded-lg p-4 text-left space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Mã đơn hàng</span>
                        <span className="font-mono font-semibold text-blue-600">
                          {placedOrder.code}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Thời gian</span>
                        <span className="text-gray-800">
                          {new Date(placedOrder.date).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Payment Information Section - Bank Transfer */}
                  {placedOrderDetails &&
                    viewPaymentMethod === "bank_transfer" && (
                      <div className="bg-white border border-blue-200 rounded-lg p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* QR Code Section */}
                          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white rounded-lg border-2 border-blue-300">
                            <div className="mb-3">
                              <h4 className="text-sm font-semibold text-blue-900 text-center">
                                Quét mã QR để thanh toán
                              </h4>
                            </div>
                            <img
                              src={qrCodeImageUrl}
                              alt="QR Code for bank transfer"
                              className="w-full max-w-xs rounded-lg shadow-lg"
                            />
                            <div className="mt-4 flex gap-2 w-full">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={downloadQRCode}
                                className="flex-1 text-blue-600 border-blue-300 hover:bg-blue-50"
                              >
                                <QrCode className="w-4 h-4 mr-2" />
                                Tải ảnh QR
                              </Button>
                            </div>
                          </div>

                          {/* Bank Details Section */}
                          <div className="space-y-4">
                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                              <CreditCard className="w-5 h-5 text-blue-600" />
                              Thông tin chuyển khoản
                            </h3>

                            <div className="space-y-3">
                              <div className="border-b border-gray-200 pb-3">
                                <div className="text-sm text-gray-600 mb-1">
                                  Ngân hàng
                                </div>
                                <div className="text-base font-semibold text-gray-900">
                                  {bankDetails.name}
                                </div>
                              </div>

                              <div className="border-b border-gray-200 pb-3">
                                <div className="text-sm text-gray-600 mb-1">
                                  Thụ hưởng
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-base font-semibold text-gray-900 flex-1">
                                    {bankDetails.accountName}
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      copyToClipboard(
                                        bankDetails.accountName,
                                        "account name",
                                      )
                                    }
                                    title="Copy to clipboard"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="border-b border-gray-200 pb-3">
                                <div className="text-sm text-gray-600 mb-1">
                                  Số tài khoản
                                </div>
                                <div className="flex items-center gap-2">
                                  <code className="text-base font-mono font-semibold text-gray-900 flex-1">
                                    {bankDetails.account}
                                  </code>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      copyToClipboard(
                                        bankDetails.account,
                                        "account number",
                                      )
                                    }
                                    title="Copy to clipboard"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              <div>
                                <div className="text-sm text-gray-600 mb-1">
                                  Nội dung chuyển khoản
                                </div>
                                <div className="flex items-center gap-2">
                                  <code className="text-base font-mono font-semibold text-blue-600 flex-1">
                                    {placedOrder?.code || "Order"}
                                  </code>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      copyToClipboard(
                                        placedOrder?.code || "",
                                        "order code",
                                      )
                                    }
                                    title="Copy to clipboard"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Instructions */}
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-orange-900 mb-1">
                                Hướng dẫn thanh toán
                              </p>
                              <p className="text-sm text-orange-800">
                                Vui lòng chuyển khoản đến tài khoản ngân hàng
                                trên. Nhập nội dung chuyển khoản chính xác là mã
                                đơn hàng. Chúng tôi sẽ liên hệ với quý khách
                                trong thời gian sớm nhất để xác nhận đơn hàng.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                    <Button asChild>
                      <Link to="/products">Tiếp tục mua sắm</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/profile?tab=website">Xem đơn của tôi</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Giỏ h��ng trống</h2>
              <p className="text-gray-600 mb-8">
                Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
              </p>
              <Button size="lg" asChild>
                <Link to="/products">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Tiếp tục mua sắm
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header */}

                {/* Out of Stock Warning */}
                {hasOutOfStockItems && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <span className="font-medium text-orange-800">
                        Một số sản phẩm hiện tại hết hàng
                      </span>
                    </div>
                    <p className="text-orange-700 text-sm mt-1">
                      Vui lòng xóa hoặc thay thế các sản phẩm hết hàng để ti���p
                      tục thanh toán
                    </p>
                  </div>
                )}

                {/* Cart Items List */}
                <Card className="border-2 border-gray-300 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h2 className="text-xl sm:text-2xl font-bold flex items-center truncate">
                        <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 mr-2 text-blue-600" />
                        <span className="truncate">
                          Giỏ hàng{" "}
                          <span className="text-sm sm:text-xl font-semibold text-gray-500 ml-1">
                            ({cartItems.length} sản phẩm)
                          </span>
                        </span>
                      </h2>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/products" className="whitespace-nowrap">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Tiếp tục mua sắm
                        </Link>
                      </Button>
                    </div>
                    <div className="divide-y">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className={`py-4 ${!item.isInStock ? "bg-gray-50" : ""}`}
                        >
                          <div className="space-y-2">
                            <h3 className="font-bold text-lg leading-tight break-words sm:hidden">
                              {item.name}
                            </h3>
                            <div className="flex items-center sm:items-start gap-3 sm:gap-4">
                              {/* Product Image */}
                              <div className="relative">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className={`w-20 h-20 sm:w-24 sm:h-24 object-cover object-center rounded-lg flex-shrink-0 ${!item.isInStock ? "grayscale" : ""}`}
                                />
                                {!item.isInStock && (
                                  <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                      Hết hàng
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 space-y-2">
                                <div className="hidden sm:block">
                                  <h3 className="font-bold text-lg leading-tight break-words">
                                    {item.name}
                                  </h3>
                                </div>

                                {/* Variants */}
                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="outline">
                                    Màu: {item.variant.color}
                                  </Badge>
                                  <Badge variant="outline">
                                    Size: {item.variant.size}
                                  </Badge>
                                  {item.variant.lensType && (
                                    <Badge variant="outline">
                                      {item.variant.lensType}
                                    </Badge>
                                  )}
                                </div>

                                {/* Price & Actions */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                                  <div className="space-y-1">
                                    <div className="flex items-baseline space-x-2">
                                      <span className="text-xl font-bold text-blue-600">
                                        {item.price.toLocaleString()}đ
                                      </span>
                                      {item.originalPrice && (
                                        <span className="text-gray-500 line-through">
                                          {item.originalPrice.toLocaleString()}đ
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-4">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                      <button
                                        onClick={() =>
                                          updateQuantity(
                                            item.id,
                                            item.quantity - 1,
                                          )
                                        }
                                        disabled={item.quantity <= 1}
                                        className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                      >
                                        <Minus className="w-4 h-4" />
                                      </button>
                                      <span className="px-4 py-2 font-semibold">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() =>
                                          updateQuantity(
                                            item.id,
                                            item.quantity + 1,
                                          )
                                        }
                                        disabled={
                                          item.quantity >= item.maxQuantity
                                        }
                                        className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Xóa
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="order-note">Ghi chú</Label>
                      <Textarea
                        id="order-note"
                        placeholder="Ghi chú cho đơn hàng..."
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Mobile/Tablet Order Summary (hidden - moved below) */}
                <div className="lg:hidden hidden">
                  <Card className="border-2 border-gray-300 shadow-lg">
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-bold text-xl mb-4">
                        Tóm tắt đơn hàng
                      </h3>
                      <button
                        onClick={() => setVoucherOpen(true)}
                        className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl px-4 py-3 mb-4 border border-blue-200"
                      >
                        <span className="font-semibold flex items-center gap-2">
                          Voucher của bạn{" "}
                          <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-blue-600 text-white text-xs font-bold">
                            {voucherCount}
                          </span>
                        </span>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span>Tổng tiền:</span>
                          <span>{originalSubtotal.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Giảm giá trực tiếp</span>
                          <span>-{savedAmount.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Giảm giá voucher</span>
                          <span
                            className={
                              couponDiscount > 0 ? "text-orange-500" : undefined
                            }
                          >
                            {couponDiscount > 0
                              ? `-${couponDiscount.toLocaleString()}đ`
                              : `0đ`}
                          </span>
                        </div>
                        {appliedCoupon && couponDiscount > 0 && (
                          <div className="text-xs text-blue-600">
                            Mã: {appliedCoupon.code} —{" "}
                            {appliedCoupon.description}
                          </div>
                        )}
                        <Separator />
                        <div className="flex items-end justify-between">
                          <span className="text-xl font-bold">Thành tiền</span>
                          <div className="text-right">
                            {totalSavings > 0 && (
                              <div className="text-gray-400 line-through text-base">
                                {totalBeforeDiscounts.toLocaleString()}đ
                              </div>
                            )}
                            <div className="text-2xl font-extrabold text-blue-600">
                              {total.toLocaleString()}đ
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Button
                          className="w-full h-12"
                          disabled={hasOutOfStockItems}
                          onClick={handlePlaceOrder}
                        >
                          <CreditCard className="w-5 h-5 mr-2" />
                          Đặt hàng
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/products">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Tiếp tục mua sắm
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Checkout - Customer Info and Address */}
                <Card className="border-2 border-gray-300 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2 whitespace-nowrap">
                      <CardTitle className="flex items-center min-w-0 truncate text-lg sm:text-xl">
                        <MapPin className="w-5 h-5 mr-2 text-green-600" />
                        Thông tin giao hàng
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 whitespace-nowrap px-0 h-auto"
                        onClick={() => setIsEditingShipping(true)}
                      >
                        Cập nhật &gt;
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isEditingShipping ? (
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-semibold text-gray-900 truncate">
                              {shippingInfo.fullName ||
                                user?.name ||
                                "Chưa có tên"}
                            </div>
                            <div className="text-sm text-gray-500 whitespace-nowrap">
                              {formatPhoneNumber(
                                shippingInfo.phone || user?.phone || "",
                              )}
                            </div>
                          </div>
                          <div className="text-gray-700 text-sm mt-1 break-words">
                            {(() => {
                              const full = [
                                shippingInfo.address,
                                shippingInfo.ward,
                                shippingInfo.district,
                                shippingInfo.city,
                              ]
                                .filter(Boolean)
                                .join(", ");
                              return full || "Chưa có địa chỉ";
                            })()}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="p-2 text-gray-400 hover:text-gray-600"
                          onClick={() => setIsEditingShipping(true)}
                          aria-label="Thay đổi địa chỉ"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Họ và tên</Label>
                            <Input
                              placeholder="Nguyễn Văn A"
                              value={shippingInfo.fullName}
                              onChange={(e) =>
                                setShippingInfo({
                                  ...shippingInfo,
                                  fullName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Số điện thoại</Label>
                            <Input
                              placeholder="0901234567"
                              value={shippingInfo.phone}
                              onChange={(e) =>
                                setShippingInfo({
                                  ...shippingInfo,
                                  phone: e.target.value.replace(/\s+/g, ""),
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            placeholder="email@domain.com"
                            value={shippingInfo.email}
                            onChange={(e) =>
                              setShippingInfo({
                                ...shippingInfo,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Địa chỉ</Label>
                          <Textarea
                            placeholder="Số nhà, tên đường..."
                            value={shippingInfo.address}
                            onChange={(e) =>
                              setShippingInfo({
                                ...shippingInfo,
                                address: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Thành phố</Label>
                            <Input
                              placeholder="TP. Hồ Chí Minh"
                              value={shippingInfo.city}
                              onChange={(e) =>
                                setShippingInfo({
                                  ...shippingInfo,
                                  city: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Quận/Huyện</Label>
                            <Input
                              placeholder="Quận 1"
                              value={shippingInfo.district}
                              onChange={(e) =>
                                setShippingInfo({
                                  ...shippingInfo,
                                  district: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Phường/Xã</Label>
                            <Input
                              placeholder="Bến Nghé"
                              value={shippingInfo.ward}
                              onChange={(e) =>
                                setShippingInfo({
                                  ...shippingInfo,
                                  ward: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            type="button"
                            onClick={() => setIsEditingShipping(false)}
                          >
                            Hủy
                          </Button>
                          <Button
                            type="button"
                            onClick={() => {
                              try {
                                if (user)
                                  localStorage.setItem(
                                    `shippingInfo:${user.phone}`,
                                    JSON.stringify(shippingInfo),
                                  );
                              } catch {}
                              setIsEditingShipping(false);
                            }}
                          >
                            Lưu địa chỉ
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Checkout - Payment Method (Selection) */}
                <Card className="border-2 border-gray-300 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2 whitespace-nowrap">
                      <CardTitle className="flex items-center min-w-0 truncate text-lg sm:text-xl">
                        <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                        Phương thức thanh toán
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 whitespace-nowrap px-0 h-auto"
                        onClick={() => {
                          setTempPaymentMethod(paymentMethod);
                          setPaymentDialogOpen(true);
                        }}
                      >
                        Xem tất cả &gt;
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm sm:text-base">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">
                          {paymentMethods.find((m) => m.id === paymentMethod)
                            ?.name || ""}
                        </span>
                      </div>
                      {(() => {
                        const m = paymentMethods.find(
                          (x) => x.id === paymentMethod,
                        );
                        return m?.info ? (
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="text-gray-400 hover:text-gray-600"
                                  aria-label="Thông tin ph��ơng th��c thanh toán"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line
                                      x1="12"
                                      x2="12"
                                      y1="16"
                                      y2="12"
                                    ></line>
                                    <line
                                      x1="12"
                                      x2="12.01"
                                      y1="8"
                                      y2="8"
                                    ></line>
                                  </svg>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="left"
                                className="max-w-xs text-xs"
                              >
                                {m.info}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : null;
                      })()}
                    </div>
                  </CardContent>
                </Card>

                {/* Mobile/Tablet Order Summary (moved below shipping & payment) */}
                <div className="lg:hidden">
                  <Card className="border-2 border-gray-300 shadow-lg">
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-bold text-xl mb-4">
                        Tóm tắt đơn hàng
                      </h3>
                      <button
                        onClick={() => setVoucherOpen(true)}
                        className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl px-4 py-3 mb-4 border border-blue-200"
                      >
                        <span className="font-semibold flex items-center gap-2">
                          Voucher của bạn{" "}
                          <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-blue-600 text-white text-xs font-bold">
                            {voucherCount}
                          </span>
                        </span>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span>Tổng tiền:</span>
                          <span>{originalSubtotal.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Giảm giá trực tiếp</span>
                          <span>-{savedAmount.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Giảm giá voucher</span>
                          <span
                            className={
                              couponDiscount > 0 ? "text-orange-500" : undefined
                            }
                          >
                            {couponDiscount > 0
                              ? `-${couponDiscount.toLocaleString()}đ`
                              : `0đ`}
                          </span>
                        </div>
                        {appliedCoupon && couponDiscount > 0 && (
                          <div className="text-xs text-blue-600">
                            M��: {appliedCoupon.code} —{" "}
                            {appliedCoupon.description}
                          </div>
                        )}
                        <Separator />
                        <div className="flex items-end justify-between">
                          <span className="text-xl font-bold">Thành tiền</span>
                          <div className="text-right">
                            {totalSavings > 0 && (
                              <div className="text-gray-400 line-through text-base">
                                {totalBeforeDiscounts.toLocaleString()}đ
                              </div>
                            )}
                            <div className="text-2xl font-extrabold text-blue-600">
                              {total.toLocaleString()}đ
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                {/* Summary Card */}
                <Card className="border-2 border-gray-300 shadow-lg lg:sticky lg:top-4 hidden lg:block">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-bold text-xl mb-4">
                      Tóm tắt đ��n hàng
                    </h3>

                    {/* Voucher CTA */}
                    <button
                      onClick={() => setVoucherOpen(true)}
                      className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl px-4 py-3 mb-4 border border-blue-200"
                    >
                      <span className="font-semibold flex items-center gap-2">
                        Voucher của bạn{" "}
                        <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-blue-600 text-white text-xs font-bold">
                          {voucherCount}
                        </span>
                      </span>
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Price Breakdown */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span>Tổng tiền:</span>
                        <span>{originalSubtotal.toLocaleString()}đ</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Giảm giá trực tiếp</span>
                        <span>-{savedAmount.toLocaleString()}đ</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Giảm giá voucher</span>
                        <span
                          className={
                            couponDiscount > 0 ? "text-orange-500" : undefined
                          }
                        >
                          {couponDiscount > 0
                            ? `-${couponDiscount.toLocaleString()}đ`
                            : `0đ`}
                        </span>
                      </div>

                      {appliedCoupon && couponDiscount > 0 && (
                        <div className="text-xs text-blue-600">
                          Mã: {appliedCoupon.code} — {appliedCoupon.description}
                        </div>
                      )}

                      <Separator />

                      <div className="flex items-end justify-between">
                        <span className="text-xl font-bold">Thành tiền</span>
                        <div className="text-right">
                          {totalSavings > 0 && (
                            <div className="text-gray-400 line-through text-base">
                              {totalBeforeDiscounts.toLocaleString()}đ
                            </div>
                          )}
                          <div className="text-2xl font-extrabold text-blue-600">
                            {total.toLocaleString()}đ
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coupon Section replaced by Voucher CTA */}
                    <div className="hidden">
                      <h4 className="font-semibold flex items-center">
                        <Tag className="w-4 h-4 mr-2" />
                        Mã giảm giá
                      </h4>

                      {appliedCoupon ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-green-800">
                              {appliedCoupon.code}
                            </span>
                            <button
                              onClick={removeCoupon}
                              className="text-green-600 hover:text-green-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-green-700 text-sm">
                            {appliedCoupon.description}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Nhập mã giảm giá"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              onClick={applyCoupon}
                              disabled={!couponCode.trim()}
                            >
                              Áp dụng
                            </Button>
                          </div>
                          {couponError && (
                            <p className="text-red-500 text-sm">
                              {couponError}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Available Coupons from Profile voucher center */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            Mã giảm giá khả dụng (đã lấy từ Trung tâm voucher):
                          </p>
                          <Link
                            to="/profile"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Xem Trung tâm voucher
                          </Link>
                        </div>
                        {availableCoupons.length === 0 && (
                          <p className="text-xs text-gray-500">
                            Chưa có mã nào. Vào Trung tâm voucher để lấy mã.
                          </p>
                        )}
                        {availableCoupons
                          .filter(
                            (coupon) => coupon.code !== appliedCoupon?.code,
                          )
                          .map((coupon) => (
                            <button
                              key={coupon.code}
                              onClick={() => {
                                setCouponCode(coupon.code);
                                applyCoupon();
                              }}
                              className="w-full text-left p-3 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-blue-600">
                                  {coupon.code}
                                </span>
                                <Percent className="w-4 h-4 text-blue-600" />
                              </div>
                              <p className="text-xs text-gray-600">
                                {coupon.description}
                              </p>
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        className="w-full h-12"
                        disabled={hasOutOfStockItems}
                        onClick={handlePlaceOrder}
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Đặt hàng
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Voucher Dialog */}
      <Dialog open={voucherOpen} onOpenChange={setVoucherOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Chọn Voucher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Enter code */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã voucher"
                  value={voucherSearchCode}
                  onChange={(e) => setVoucherSearchCode(e.target.value)}
                />
                <Button
                  onClick={() => {
                    applyCouponByCode(voucherSearchCode, true);
                  }}
                  disabled={!voucherSearchCode.trim()}
                >
                  Áp dụng
                </Button>
              </div>
              {couponError && (
                <p className="text-red-500 text-sm">{couponError}</p>
              )}
            </div>

            {/* Voucher list from Profile */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Mã gi��m giá
                </h4>
                <Link
                  to="/profile"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Trung tâm voucher
                </Link>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {getAllVoucherProgramsForCurrentUser().map((p) => {
                  const claimed =
                    availableCoupons.find((c) => c.programId === p.id) ||
                    availableCoupons.find(
                      (c) =>
                        !c.programId &&
                        c.description === p.programName &&
                        c.minOrder === p.minOrder,
                    );
                  if (claimed) {
                    const c = claimed;
                    const eligible = !c.minOrder || subtotal >= c.minOrder;
                    const isBest =
                      bestCoupon.code === c.code && bestCoupon.saving > 0;
                    const savings = getCouponSavings(c);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-center gap-3 border rounded-lg p-3 ${eligible ? "" : "opacity-60"}`}
                      >
                        <input
                          type="radio"
                          name="voucher"
                          className="h-4 w-4"
                          checked={selectedCouponCode === c.code}
                          onChange={() => setSelectedCouponCode(c.code)}
                          disabled={!eligible}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="font-semibold">{c.description}</div>
                            <div className="flex items-center gap-2">
                              {appliedCoupon?.code === c.code && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                  Đang áp dụng
                                </span>
                              )}
                              {isBest && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                                  Lựa chọn tốt nhất
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-blue-600 font-mono mt-1">
                            {c.code}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {c.minOrder
                              ? `Đơn tối thiểu ${c.minOrder.toLocaleString()}đ`
                              : "Không yêu cầu t��i thiểu"}
                            {c.validUntil ? ` • Hết hạn ${c.validUntil}` : ""}
                            {savings > 0
                              ? ` • Tiết kiệm ~ ${savings.toLocaleString()}đ`
                              : ""}
                          </div>
                        </div>
                      </label>
                    );
                  }

                  const parsed = parseDiscountFromTitle(p.title);
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 border rounded-lg p-3"
                    >
                      <div className="flex-1">
                        <div className="font-semibold">{p.programName}</div>
                        <div className="text-sm text-gray-700">{p.title}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {p.minOrder
                            ? `Đơn tối thiểu ${p.minOrder.toLocaleString()}đ`
                            : "Không yêu cầu tối thiểu"}
                          {parsed.type === "percentage" && parsed.maxDiscount
                            ? ` • Tối đa ${parsed.maxDiscount.toLocaleString()}đ`
                            : ""}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setCouponError("");
                          try {
                            setClaimingId(p.id);
                            const c = claimVoucher(p.id);
                            setSelectedCouponCode(c.code);
                          } catch (e: any) {
                            setCouponError(
                              e?.message || "Không thể lấy voucher",
                            );
                          } finally {
                            setClaimingId(null);
                          }
                        }}
                        disabled={claimingId === p.id}
                      >
                        {claimingId === p.id ? "Đang lấy..." : "Lấy"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <div className="text-sm text-gray-600">
                {selectedCouponCode ? (
                  <span>
                    1 voucher đã chọn:{" "}
                    <span className="font-mono text-blue-600">
                      {selectedCouponCode}
                    </span>
                  </span>
                ) : (
                  "Chưa chọn voucher."
                )}
              </div>
              <div className="flex gap-2">
                {appliedCoupon && (
                  <Button
                    variant="outline"
                    onClick={() => setAppliedCoupon(null)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" /> Bỏ mã {appliedCoupon.code}
                  </Button>
                )}
                <Button
                  onClick={() => {
                    const c = availableCoupons.find(
                      (x) => x.code === selectedCouponCode,
                    );
                    if (c) {
                      setVoucherOpen(false);
                      setCouponError("");
                      setAppliedCoupon(c);
                    }
                  }}
                  disabled={!selectedCouponCode}
                >
                  Đồng ý
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Methods Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
          </DialogHeader>
          <RadioGroup
            value={tempPaymentMethod}
            onValueChange={setTempPaymentMethod}
            className="space-y-3 mt-2"
          >
            {paymentMethods.map((m) => (
              <label
                key={m.id}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={m.id} id={`pm-${m.id}-dlg`} />
                  <span className="font-medium">{m.name}</span>
                </div>
                {m.info && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-600"
                          aria-label="Thông tin phương thức thanh toán"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" x2="12" y1="16" y2="12"></line>
                            <line x1="12" x2="12.01" y1="8" y2="8"></line>
                          </svg>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs text-xs">
                        {m.info}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </label>
            ))}
          </RadioGroup>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setPaymentDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                setPaymentMethod(tempPaymentMethod);
                setPaymentDialogOpen(false);
              }}
            >
              Chọn
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile pinned checkout bar */}
      {!orderPlaced && cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Tổng ({totalQty} sp)</div>
              <div className="text-lg font-extrabold text-blue-600">
                {total.toLocaleString()}đ
              </div>
            </div>
            <Button
              className="flex-1 h-12"
              disabled={hasOutOfStockItems}
              onClick={handlePlaceOrder}
            >
              <div className="w-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Đặt hàng
              </div>
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Cart;
