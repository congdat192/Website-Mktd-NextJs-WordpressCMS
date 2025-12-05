import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import type { CouponCode } from "@/lib/vouchers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  User,
  Phone,
  Shield,
  LogOut,
  Edit,
  Gift,
  Calendar,
  ShoppingBag,
  Star,
  Eye,
  Bell,
  CheckCircle2,
  AlertCircle,
  Download,
  FileText,
  MessageCircle,
  CreditCard,
  History,
  Settings,
  Award,
  DollarSign,
  Crown,
  Ticket,
  Package,
  Clock,
  TrendingUp,
  Users,
  ChevronRight,
  Percent,
  Info,
  Loader2,
  Share2,
  Copy,
  QrCode,
  ExternalLink,
  ShoppingCart,
  Plus,
  Minus,
  X,
  ArrowLeft,
  Truck,
  Tag,
  AlertTriangle,
  MapPin,
  Trash2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { getCurrentUser, logout, formatPhoneNumber } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import QRCode from "qrcode";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ChevronLeft } from "lucide-react";

type OrderItem = {
  code: string;
  date: string; // ISO string
  seller: string;
  branch: string;
  total: number;
  status: "Hoàn thành" | "Đang xử lý" | "Đã hủy";
};

type WebsiteOrder = OrderItem & {
  contact?: { fullName?: string; phone?: string; email?: string };
  address?: string;
  shipping?: { method: string; fee: number; duration?: string };
  payment?: { method: string; fee?: number; discount?: number };
  coupon?: { code: string; description?: string; discount: number } | null;
  items?: Array<{
    id: string;
    productId: string;
    name: string;
    brand: string;
    image: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    variant: { color: string; size: string; lensType?: string };
  }>;
  summary?: { subtotal: number; savedAmount: number; couponDiscount: number; paymentDiscount: number; shippingFee: number; totalBeforeDiscounts: number; total: number };
  note?: string;
};

const baseOrders: OrderItem[] = [
  { code: "HD251595", date: "2025-08-08T13:48:00", seller: "PC Quận 7", branch: "07. Quận 7", total: 0, status: "Hoàn thành" },
  { code: "HD231566", date: "2025-03-15T10:35:00", seller: "PC T��n B����nh", branch: "01. Tân Bình", total: 436000, status: "Hoàn thành" },
  { code: "HD230359", date: "2025-03-07T11:17:00", seller: "PC Tân Bình", branch: "01. Tân Bình", total: 0, status: "Hoàn thành" },
  { code: "HD225521", date: "2025-02-05T10:25:00", seller: "Đinh Công Đạt", branch: "07. Quận 7", total: 2290000, status: "Hoàn thành" },
  { code: "HD219161", date: "2024-12-23T19:34:00", seller: "TB - Xưởng", branch: "01. Tân Bình", total: 0, status: "Hoàn thành" },
  { code: "HD215210", date: "2024-11-26T22:30:00", seller: "Đinh Công Đạt", branch: "06. Gò Vấp", total: 500000, status: "Hoàn thành" },
  { code: "HD211775", date: "2024-11-03T18:00:00", seller: "Đinh Công Đạt", branch: "05. Quận 1", total: 0, status: "Hoàn thành" },
  { code: "HD208191", date: "2024-10-11T14:21:00", seller: "Đinh Công Đạt", branch: "01. Tân Bình", total: 1500000, status: "Hoàn thành" },
  { code: "HD201130", date: "2024-08-25T12:20:00", seller: "Q1 - Duy", branch: "05. Quận 1", total: 0, status: "Hoàn thành" },
  { code: "HD194790", date: "2024-07-11T12:26:00", seller: "PC Quận 7", branch: "07. Quận 7", total: 0, status: "Hoàn thành" },
];

const sellers = ["PC Quận 7", "PC Tân Bình", "Đinh Công Đạt", "TB - Xưởng", "Q1 - Duy"];
const branches = ["07. Quận 7", "01. Tân Bình", "06. Gò V���p", "05. Quận 1"];

const startGenDate = new Date("2024-01-01T09:00:00").getTime();
const additionalCount = 78 - baseOrders.length;
const generated: OrderItem[] = Array.from({ length: Math.max(additionalCount, 0) }, (_, i) => {
  const date = new Date(startGenDate + i * 24 * 60 * 60 * 1000);
  const code = `HD${(100000 + i).toString()}`;
  const seller = sellers[i % sellers.length];
  const branch = branches[i % branches.length];
  const totals = [0, 150000, 350000, 500000, 750000, 1200000, 2290000, 436000];
  const total = totals[i % totals.length];
  return { code, date: date.toISOString(), seller, branch, total, status: "Hoàn th��nh" };
});

const mockOrders: OrderItem[] = [...baseOrders, ...generated].slice(0, 78);

// Website orders are loaded from localStorage, no mock fallback

const formatDateTime = (iso: string) => new Date(iso).toLocaleString("vi-VN", { hour12: false });
const formatRelative = (iso: string) => {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const diff = Math.max(0, now - t);
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
};
const formatVnd = (n: number) => n.toLocaleString("vi-VN");
const statusClass = (s: OrderItem["status"]) =>
  s === "Hoàn thành" ? "bg-green-100 text-green-700 border-0" : s === "Đã hủy" ? "bg-red-100 text-red-700 border-0" : "bg-yellow-100 text-yellow-700 border-0";

const overviewStats = { totalSpent: 37190000, tier: "Gold", orders: 12, vouchers: 3 };

type VoucherItem = {
  id: string;
  kind: "VOUCHER" | "COUPON";
  title: string; // e.g., "50,000đ OFF" or "10% OFF"
  minOrder: number; // in VND
  startDate: string; // ISO
  color: "green" | "red";
  programName: string; // Tên chương trình
};

type VoucherState = {
  isLoading: boolean;
  voucherCode: string | null;
  expiryDate: string | null;
  isClaimed: boolean;
  status: "Chưa phát hành" | "Đã phát hành";
};

import { getAllVoucherProgramsForCurrentUser } from "@/lib/voucher-programs";
import type { VoucherProgram } from "@/lib/voucher-programs";

const formatDateLongVi = (iso: string) => {
  const d = new Date(iso);
  return `Có hiệu lực từ ${d.getDate()} tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
};

// Mock data for voucher history
const voucherHistory = [
  {
    id: "VH001",
    name: "Voucher Giảm 50K Tết",
    code: "TET50K2024",
    issueDate: "15/01/2024",
    expiryDate: "29/02/2024",
    voucherStatus: "Đã phát hành",
    usageStatus: "Đã sử dụng",
    issuer: "Nguyễn Văn An"
  },
  {
    id: "VH002",
    name: "Voucher 20% Black Friday",
    code: "BF20PERCENT",
    issueDate: "20/11/2023",
    expiryDate: "30/11/2023",
    voucherStatus: "Đã phát hành",
    usageStatus: "Chưa sử dụng",
    issuer: "Hệ thống"
  },
  {
    id: "VH003",
    name: "Voucher Sinh Nhật 100K",
    code: "BIRTHDAY100",
    issueDate: "12/03/2024",
    expiryDate: "12/04/2024",
    voucherStatus: "Đã phát hành",
    usageStatus: "Đã sử dụng",
    issuer: "Trần Thị Bình"
  },
  {
    id: "VH004",
    name: "Voucher Khách VIP 15%",
    code: "VIP15SPECIAL",
    issueDate: "05/05/2024",
    expiryDate: "05/08/2024",
    voucherStatus: "Đã phát hành",
    usageStatus: "Chưa sử d��ng",
    issuer: "Hệ thống"
  },
  {
    id: "VH005",
    name: "Voucher Flash Sale 30K",
    code: "FLASH30K",
    issueDate: "18/06/2024",
    expiryDate: "20/06/2024",
    voucherStatus: "Đã phát hành",
    usageStatus: "Đã sử dụng",
    issuer: "Lê V��n Cường"
  },
  {
    id: "VH006",
    name: "Voucher Mùa Hè 25%",
    code: "SUMMER25OFF",
    issueDate: "01/07/2024",
    expiryDate: "31/08/2024",
    voucherStatus: "Đã phát hành",
    usageStatus: "Chưa sử dụng",
    issuer: "Hệ th��ng"
  },
  {
    id: "VH007",
    name: "Voucher Khai Trương 40K",
    code: "OPENING40K",
    issueDate: "10/09/2024",
    expiryDate: "30/09/2024",
    voucherStatus: "Chưa phát hành",
    usageStatus: "Chưa sử dụng",
    issuer: "Phạm Thị Dung"
  },
  {
    id: "VH008",
    name: "Voucher Trung Thu 35K",
    code: "MOONCAKE35",
    issueDate: "25/08/2024",
    expiryDate: "15/09/2024",
    voucherStatus: "Đã phát hành",
    usageStatus: "��ã sử dụng",
    issuer: "Hệ thống"
  },
  {
    id: "VH009",
    name: "Voucher Học Sinh 10%",
    code: "STUDENT10",
    issueDate: "01/09/2024",
    expiryDate: "31/12/2024",
    voucherStatus: "Đã phát hành",
    usageStatus: "Chưa sử dụng",
    issuer: "Hoàng Văn Em"
  },
  {
    id: "VH010",
    name: "Voucher Cuối Năm 50%",
    code: "YEAREND50",
    issueDate: "15/12/2024",
    expiryDate: "31/12/2024",
    voucherStatus: "Chưa phát hành",
    usageStatus: "Chưa sử dụng",
    issuer: "Hệ thống"
  }
];

// Mock invoice detail generator (deterministic, no placeholders)
const getInvoiceDetails = (code: string) => {
  const items = [
    { sku: "H6802-C10T", name: "Gọng kính HANWIS H6802 - XÁM ĐỒNG - TR90 - NGUYÊN KHUNG - CHỮ NHẬT - KHÔNG - 52", qty: 1, price: 520000, discount: 121000 },
    { sku: "LV-86248-CG5", name: "Gọng kính Levius 86248", qty: 1, price: 650000, discount: 195000 },
    { sku: "480k-kodak156", name: "Tròng kính KODAK 1.56 ASPH UV400 Clean'N'ClieAR (Super HMC A+) - Clear (Clear)", qty: 4, price: 240000, discount: 48000 },
  ];
  const sell = (p: number, d: number) => p - d;
  const totalLine = (p: number, d: number, q: number) => (p - d) * q;
  const computed = items.map((it) => ({ ...it, sell: sell(it.price, it.discount), total: totalLine(it.price, it.discount, it.qty) }));
  const subtotal = computed.reduce((s, it) => s + it.total, 0);
  const orderDiscount = 0;
  const toPay = subtotal - orderDiscount;
  const paid = toPay;
  return { code, items: computed, summary: { subtotal, orderDiscount, toPay, paid }, note: "Cắt kính xong gọi khách" };
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<{ phone: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [voucherStates, setVoucherStates] = useState<Record<string, VoucherState>>({});
  const [qrPopup, setQrPopup] = useState<{ isOpen: boolean; voucherCode: string; qrCodeUrl: string }>({ isOpen: false, voucherCode: "", qrCodeUrl: "" });
  const [termsPopup, setTermsPopup] = useState<{ isOpen: boolean; voucherId: string; voucherTitle: string }>({ isOpen: false, voucherId: "", voucherTitle: "" });
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    email: "nguyenvana@email.com",
    address: "",
    birthday: "1990-01-15",
    gender: "male",
    notes: "Khách hàng thân thiết, ưu tiên dịch vụ tốt nhất",
    createdDate: "2023-05-15"
  });
  const [ordersPage, setOrdersPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [websiteOrders, setWebsiteOrders] = useState<WebsiteOrder[]>([]);
  const toggleExpand = (code: string) => setExpanded((m) => ({ ...m, [code]: !m[code] }));

  const [vouchers, setVouchers] = useState<VoucherProgram[]>(getAllVoucherProgramsForCurrentUser());
  useEffect(() => {
    const refresh = () => setVouchers(getAllVoucherProgramsForCurrentUser());
    window.addEventListener("auth-changed", refresh as EventListener);
    window.addEventListener("storage", refresh as EventListener);
    return () => {
      window.removeEventListener("auth-changed", refresh as EventListener);
      window.removeEventListener("storage", refresh as EventListener);
    };
  }, []);

  // Load website orders for current user (Supabase)
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!user) return;
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data: orders, error } = await supabase
          .from("website_orders")
          .select("code,date,seller,branch,total,status,contact_full_name,contact_phone,contact_email,address,shipping_method,shipping_fee,shipping_duration,payment_method,payment_fee,payment_discount,coupon_code,coupon_description,coupon_discount,subtotal,saved_amount,total_before_discounts,note")
          .eq("user_phone", user.phone)
          .order("date", { ascending: false });
        if (error) throw error;
        const codes = (orders || []).map((o:any)=>o.code);
        let grouped: Record<string, any[]> = {};
        if (codes.length) {
          const { data: items } = await supabase
            .from("website_order_items")
            .select("order_code,product_id,name,brand,image,price,original_price,quantity,variant_color,variant_size,variant_lens_type")
            .in("order_code", codes);
          (items||[]).forEach((it:any)=>{
            (grouped[it.order_code] ||= []).push({
              id: `${it.order_code}:${it.product_id}:${it.variant_color}:${it.variant_size}`,
              productId: it.product_id,
              name: it.name,
              brand: it.brand,
              image: it.image,
              price: it.price,
              originalPrice: it.original_price ?? undefined,
              quantity: it.quantity,
              variant: { color: it.variant_color, size: it.variant_size, lensType: it.variant_lens_type ?? undefined },
            });
          });
        }
        const mapped: WebsiteOrder[] = (orders||[]).map((r:any)=>({
          code: r.code,
          date: r.date,
          seller: r.seller,
          branch: r.branch,
          total: r.total,
          status: r.status,
          contact: { fullName: r.contact_full_name, phone: r.contact_phone, email: r.contact_email },
          address: r.address,
          shipping: { method: r.shipping_method, fee: r.shipping_fee, duration: r.shipping_duration },
          payment: { method: r.payment_method, fee: r.payment_fee, discount: r.payment_discount },
          coupon: r.coupon_code ? { code: r.coupon_code, description: r.coupon_description, discount: r.coupon_discount } : null,
          items: grouped[r.code] || [],
          summary: { subtotal: r.subtotal, savedAmount: r.saved_amount, couponDiscount: r.coupon_discount, paymentDiscount: r.payment_discount, shippingFee: r.shipping_fee, totalBeforeDiscounts: r.total_before_discounts, total: r.total },
          note: r.note,
        }));
        if (!cancelled) setWebsiteOrders(mapped);
      } catch {
        // fallback to localStorage if any error
        try {
          if (!user) return;
          const raw = localStorage.getItem(`websiteOrders:${user.phone}`);
          const parsed = raw ? JSON.parse(raw) : [];
          setWebsiteOrders(parsed as WebsiteOrder[]);
        } catch {}
      }
    };
    run();
    return () => { cancelled = true; };
  }, [user]);

  // Support selecting tab via query parameter (?tab=history)
  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    const allowed = new Set(["overview","orders","voucher","history","website","profile"]);
    if (tab && allowed.has(tab)) setActiveTab(tab);
  }, [location.search]);

  // Cart types and state
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

  interface CouponCode {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  description: string;
  minOrder?: number;
  validUntil: string;
  maxDiscount?: number;
}

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      productId: "rb5228",
      name: "Kính Cận Classic Series RB5228",
      brand: "Ray-Ban",
      image: "https://images.pexels.com/photos/8346914/pexels-photo-8346914.jpeg",
      price: 1800000,
      originalPrice: 2100000,
      quantity: 1,
      variant: { color: "Đen Classic", size: "53mm", lensType: "Chống ánh sáng xanh" },
      isInStock: true,
      maxQuantity: 5,
      isPremium: true,
    },
    {
      id: "2",
      productId: "oakley-sport",
      name: "Kính Râm Sport Series OO9208",
      brand: "Oakley",
      image: "https://images.pexels.com/photos/5766609/pexels-photo-5766609.jpeg",
      price: 2200000,
      quantity: 2,
      variant: { color: "Đen Matrix", size: "55mm" },
      isInStock: true,
      maxQuantity: 3,
    },
    {
      id: "3",
      productId: "lindberg-luxury",
      name: "Kính Cận Luxury Collection LX4402",
      brand: "Lindberg",
      image: "https://images.pexels.com/photos/3773478/pexels-photo-3773478.jpeg",
      price: 3500000,
      quantity: 1,
      variant: { color: "Titanium Silver", size: "52mm", lensType: "Đa tròng Premium" },
      isInStock: false,
      maxQuantity: 1,
      isPremium: true,
    },
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);
  const [couponError, setCouponError] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");

  const availableCoupons: CouponCode[] = [
    {
      code: "NEWBIE10",
      discount: 10,
      type: "percentage",
      description: "Giảm 10% cho khách hàng mới",
      minOrder: 1000000,
      validUntil: "2024-03-31",
    },
    {
      code: "SAVE500K",
      discount: 500000,
      type: "fixed",
      description: "Giảm 500,000đ cho đơn hàng từ 3 triệu",
      minOrder: 3000000,
      validUntil: "2024-02-29",
    },
    {
      code: "VIP20",
      discount: 20,
      type: "percentage",
      description: "Giảm 20% cho thành viên VIP",
      minOrder: 2000000,
      validUntil: "2024-04-15",
    },
  ];

  const shippingOptions = [
    { id: "standard", name: "Giao hàng tiêu chuẩn", price: 0, duration: "2-3 ngày", description: "Miễn phí cho đơn hàng từ 1 triệu" },
    { id: "express", name: "Giao hàng nhanh", price: 50000, duration: "1-2 ngày", description: "Nhận hàng trong 24-48 giờ" },
  ];

  const [address, setAddress] = useState({ fullName: "", phone: "", line1: "" });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Helpers: map claimed vouchers to usable coupons in Cart
  const parseAmount = (s: string): number => {
    if (!s) return 0;
    const kMatch = s.match(/(\d+[\d.,]*)\s*[kK]/);
    if (kMatch) return parseInt(kMatch[1].replace(/[^\d]/g, ""), 10) * 1000;
    const dMatch = s.match(/(\d+[\d.,]*)\s*(đ|d|vnđ)/i);
    if (dMatch) return parseInt(dMatch[1].replace(/[^\d]/g, ""), 10);
    return parseInt(s.replace(/[^\d]/g, ""), 10) || 0;
  };

  const parseDiscountFromTitle = (
    title: string,
  ): { type: "percentage" | "fixed"; discount: number; maxDiscount?: number } => {
    const pct = title.match(/(\d+)\s*%/);
    if (pct) {
      const percent = parseInt(pct[1], 10);
      const cap = title.match(/max\s*([\d.,]+\s*[kK]|[\d.,]+\s*(?:đ|vnđ|d))/i);
      const maxDiscount = cap ? parseAmount(cap[1]) : undefined;
      return { type: "percentage", discount: percent, maxDiscount };
    }
    const fixed = title.match(/([\d.,]+)\s*(?:đ|vnđ|d)\s*off/i);
    if (fixed) {
      return { type: "fixed", discount: parseAmount(fixed[1]) };
    }
    return { type: "percentage", discount: 0 };
  };

  const getClaimedCoupons = (): CouponCode[] => {
    return vouchers.flatMap((v) => {
      const vs = voucherStates[v.id];
      if (!vs?.voucherCode) return [];
      const parsed = parseDiscountFromTitle(v.title);
      return [{
        code: vs.voucherCode,
        discount: parsed.discount,
        type: parsed.type,
        description: v.programName,
        minOrder: v.minOrder,
        validUntil: vs.expiryDate || "",
        maxDiscount: parsed.maxDiscount,
      }];
    });
  };

  const getAllAvailableCoupons = (_claimedFirst = true): CouponCode[] => {
    const claimed = getClaimedCoupons();
    return claimed;
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const quantity = Math.max(1, Math.min(newQuantity, item.maxQuantity));
          return { ...item, quantity };
        }
        return item;
      }),
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };


  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savedAmount = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice ? item.originalPrice - item.price : 0) * item.quantity,
    0,
  );

  const applyCoupon = () => {
    setCouponError("");
    const coupon = getAllAvailableCoupons().find((c) => c.code.toLowerCase() === couponCode.toLowerCase());
    if (!coupon) {
      setCouponError("Mã giảm giá không hợp lệ");
      return;
    }
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      setCouponError(`Đơn hàng tối thiểu ${coupon.minOrder.toLocaleString()}đ`);
      return;
    }
    setAppliedCoupon(coupon);
    setCouponCode("");
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? Math.min((subtotal * appliedCoupon.discount) / 100, appliedCoupon.maxDiscount ?? Number.POSITIVE_INFINITY)
      : appliedCoupon.discount
    : 0;

  const selectedShipping = shippingOptions.find((o) => o.id === shippingMethod);
  const shippingFee = subtotal >= 1000000 && shippingMethod === "standard" ? 0 : selectedShipping?.price || 0;
  const total = subtotal - couponDiscount + shippingFee;
  const hasOutOfStockItems = cartItems.some((i) => !i.isInStock);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
      setProfileData(prev => ({
        ...prev,
        name: currentUser.name,
        phone: currentUser.phone
      }));
      try {
        const raw = localStorage.getItem(`profile:${currentUser.phone}`);
        if (raw) {
          const data = JSON.parse(raw);
          setProfileData((p) => ({ ...p, ...data, name: currentUser.name, phone: currentUser.phone }));
        }
      } catch {}
    }
  }, [navigate]);

  // Load profile details from Supabase if available
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data } = await supabase
          .from("profiles")
          .select("name,phone,email,address,birthday,gender,created_at")
          .eq("phone", user.phone)
          .maybeSingle();
        if (cancelled) return;
        if (data) {
          setProfileData((p) => ({
            ...p,
            name: data.name || p.name,
            phone: data.phone || p.phone,
            email: data.email || p.email,
            address: data.address || p.address,
            birthday: data.birthday ? new Date(data.birthday).toISOString().slice(0,10) : p.birthday,
            gender: data.gender || p.gender,
            createdDate: data.created_at ? new Date(data.created_at).toISOString().slice(0,10) : p.createdDate,
          }));
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [user]);

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setUser({
      name: profileData.name,
      phone: profileData.phone
    });
    try {
      localStorage.setItem(`profile:${profileData.phone}`, JSON.stringify(profileData));
    } catch {}
    // Persist to Supabase (best-effort)
    (async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        await supabase.from("profiles").upsert({
          phone: profileData.phone,
          name: profileData.name,
          email: profileData.email || null,
          address: profileData.address || null,
          birthday: profileData.birthday || null,
          gender: profileData.gender || null,
        }, { onConflict: "phone" as any });
      } catch {}
    })();
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    // Reset to original values
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name,
        phone: user.phone
      }));
    }
    setIsEditingProfile(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const generateVoucherCode = () => {
    const codes = ["NEW123ABC", "BD456DEF", "VIP789GHI", "CAMP012JKL"];
    return codes[Math.floor(Math.random() * codes.length)];
  };

  const generateExpiryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // 30 days from now
    return date.toLocaleDateString('vi-VN');
  };

  const handleClaimVoucher = async (voucherId: string) => {
    // Set loading state
    setVoucherStates(prev => ({
      ...prev,
      [voucherId]: {
        ...prev[voucherId],
        isLoading: true,
        isClaimed: false,
        voucherCode: null,
        expiryDate: null,
        status: "Chưa phát hành"
      }
    }));

    try {
      // Simulate API call with 1.5 second delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate random success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        const { claimVoucher } = await import("@/lib/vouchers");
        const claimed = claimVoucher(voucherId);

        setVoucherStates(prev => ({
          ...prev,
          [voucherId]: {
            isLoading: false,
            voucherCode: claimed.code,
            expiryDate: claimed.validUntil,
            isClaimed: true,
            status: "Đã phát hành"
          }
        }));

        toast({
          title: "Lấy voucher thành công!",
          description: `Mã voucher: ${claimed.code}`,
          variant: "default"
        });
      } else {
        // Reset to initial state on failure
        setVoucherStates(prev => ({
          ...prev,
          [voucherId]: {
            isLoading: false,
            voucherCode: null,
            expiryDate: null,
            isClaimed: false,
            status: "Chưa phát hành"
          }
        }));

        toast({
          title: "Không thể lấy voucher, thử lại",
          variant: "destructive"
        });
      }
    } catch (error) {
      // Reset to initial state on error
      setVoucherStates(prev => ({
        ...prev,
        [voucherId]: {
          isLoading: false,
          voucherCode: null,
          expiryDate: null,
          isClaimed: false,
          status: "Chưa phát hành"
        }
      }));

      toast({
        title: "Không thể lấy voucher, thử lại",
        variant: "destructive"
      });
    }
  };

  const handleDownloadVoucher = (voucherId: string) => {
    // Implement download functionality
    toast({
      title: "Tải voucher",
      description: "Chức năng tải xuống đang được phát triển",
    });
  };

  const handleShareVoucher = (voucherId: string) => {
    // Implement share functionality
    toast({
      title: "Chia sẻ voucher",
      description: "Chức năng chia sẻ đang được phát triển",
    });
  };

  const handleCopyVoucherCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Đã sao chép mã voucher",
        description: `Mã ${code} đã được sao chép vào clipboard`,
      });
    } catch (err) {
      toast({
        title: "Không thể sao chép",
        description: "Vui lòng thử lại",
        variant: "destructive"
      });
    }
  };

  const handleShowQRCode = async (voucherId: string, code: string) => {
    try {
      // Generate QR code as data URL
      const qrCodeUrl = await QRCode.toDataURL(code, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setQrPopup({
        isOpen: true,
        voucherCode: code,
        qrCodeUrl: qrCodeUrl
      });
    } catch (error) {
      toast({
        title: "Không thể tạo mã QR",
        description: "Vui lòng thử lại",
        variant: "destructive"
      });
    }
  };

  const closeQrPopup = () => {
    setQrPopup({ isOpen: false, voucherCode: "", qrCodeUrl: "" });
  };

  const handleShowTerms = (voucherId: string, voucherTitle: string) => {
    setTermsPopup({
      isOpen: true,
      voucherId,
      voucherTitle
    });
  };

  const closeTermsPopup = () => {
    setTermsPopup({ isOpen: false, voucherId: "", voucherTitle: "" });
  };

  // Mock terms and conditions data
  const getVoucherTerms = (voucherId: string) => {
    return {
      generalTerms: [
        "Voucher chỉ áp dụng cho khách hàng đã đăng ký tài khoản.",
        "Mỗi khách hàng chỉ được sử dụng mỗi voucher 1 lần duy nhất.",
        "Voucher không áp dụng đồng thời với các chương trình khuyến mãi khác.",
        "Voucher không có giá tr�� quy đổi thành tiền mặt.",
        "Voucher không áp dụng cho các sản phẩm giảm giá hoặc khuyến mãi đặc biệt."
      ],
      usageConditions: [
        "Giá trị đơn hàng tối thiểu: 300,000 VNĐ",
        "Chỉ áp dụng cho mua hàng trực tiếp tại cửa hàng hoặc website chính thức.",
        "Không áp dụng cho đơn hàng đã thanh toán trước đó.",
        "Phải xuất trình mã voucher trước khi thanh toán.",
        "Voucher chỉ có hiệu lực trong thời gian quy định."
      ],
      validityPeriod: [
        "Thời gian hiệu lực: Từ ngày phát hành đến hết hạn ghi trên voucher.",
        "Voucher hết hạn sẽ không thể sử dụng dưới bất kỳ hoàn cảnh nào.",
        "Không gia hạn voucher sau khi hết hiệu lực."
      ],
      otherTerms: [
        "Công ty có quyền từ chối sử dụng voucher nếu phát hiện có dấu hiệu gian lận.",
        "Công ty có quyền thay đổi điều kiện sử dụng voucher mà không cần thông báo trước.",
        "Mọi thắc mắc vui lòng liên hệ hotline: 1900-123-456.",
        "Quý khách vui lòng đọc kỹ điều kiện trước khi sử dụng."
      ]
    };
  };

  const sidebarItems = [
    { id: "overview", label: "Tổng quan", icon: Eye, active: true },
    { id: "voucher", label: "Trung tâm Voucher", icon: Ticket },
    { id: "history", label: "Lịch sử mua hàng", icon: History },
    { id: "website", label: "Đơn hàng website", icon: FileText },
    { id: "profile", label: "Thông tin khách hàng", icon: User },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="lg:flex max-w-full overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-100 min-h-screen border-r border-gray-200 hidden lg:block">
          <div className="p-4 lg:p-6">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const isActive = activeTab === item.id;
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      isActive
                        ? "bg-green-50 text-[#1C8C64] border-l-4 border-[#1C8C64]"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isActive ? "text-[#1C8C64]" : ""}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="pt-4">
              <Button
                onClick={() => setShowLogoutConfirm(true)}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Navigation */}
        <div className="lg:hidden bg-white">
          {/* User Info Card - Pinned at top */}
          <div className="bg-gradient-to-r from-[#1C8C64] to-green-500 text-white p-4 mx-4 mt-4 rounded-lg shadow-lg">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <h3 className="text-lg font-bold text-white truncate">{user.name}</h3>
                  <p className="text-sm text-white opacity-90 truncate">{formatPhoneNumber(user.phone)}</p>
                </div>
                <div className="flex flex-col gap-2 ml-2">
                  <Button
                    onClick={() => setActiveTab("profile")}
                    variant="outline"
                    size="sm"
                    className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-30 text-xs px-3 py-1 h-auto whitespace-nowrap w-20"
                  >
                    Thông tin
                  </Button>
                  <Button
                    onClick={() => setShowLogoutConfirm(true)}
                    variant="outline"
                    size="sm"
                    className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-30 text-xs px-3 py-1 h-auto w-20"
                  >
                    Đăng xuất
                  </Button>
                </div>
              </div>
              <div className="flex items-center">
                <Badge className="bg-amber-100 text-amber-700 text-xs px-2 py-1">
                  <Crown className="w-3 h-3 mr-1" />
                  Hạng thành viên {overviewStats.tier}
                </Badge>
              </div>
            </div>
          </div>

          <div className="px-4 mt-3 lg:hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-green-50 border border-green-200 p-4 shadow-sm flex items-center gap-3 min-h-[80px]">
                <div className="w-9 h-9 rounded-full bg-[#1C8C64]/10 text-[#1C8C64] flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Tổng chi tiêu</div>
                  <div className="mt-1 text-xl font-bold text-[#1C8C64]">{formatVnd(overviewStats.totalSpent)}đ</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm text-center min-h-[80px] flex flex-col justify-center">
                  <div className="text-xl font-bold text-[#1C8C64]">{overviewStats.orders}</div>
                  <div className="text-sm text-gray-600">Đơn hàng đã mua</div>
                </div>
                <div className="rounded-xl bg-green-50 border border-green-200 p-4 shadow-md text-center min-h-[80px] flex flex-col justify-center">
                  <div className="text-xl font-bold text-[#1C8C64]">{overviewStats.vouchers}</div>
                  <div className="text-sm font-medium text-[#1C8C64]">Voucher hiện có</div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Banner */}

          {/* Navigation Grid */}
          <div className="p-4">
            <div className="grid grid-cols-4 gap-4">
              {sidebarItems.filter(item => item.id !== 'profile').map((item) => {
                const isActive = activeTab === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="flex flex-col items-center p-3 rounded-lg relative"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isActive ? 'bg-[#1C8C64]' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    {item.id === 'voucher' && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                    )}
                    <span className={`text-xs text-center leading-tight ${
                      isActive ? 'text-[#1C8C64] font-medium' : 'text-gray-600'
                    }`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>


        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 min-w-0 overflow-hidden">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Header Section - Hidden on mobile */}
              <div className="hidden lg:block">
                {/* User Information Section */}
                <Card className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Cột 1: Thông tin khách hàng */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{user.name}</h4>
                          <p className="text-lg text-gray-600 mt-1">{formatPhoneNumber(user.phone)}</p>
                        </div>
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <Badge className="bg-amber-100 text-amber-700 text-sm px-3 py-1">
                            <Crown className="w-4 h-4 mr-1" />
                            Hạng thành viên {overviewStats.tier}
                          </Badge>
                          <div className="flex space-x-2 flex-wrap">
                            <Button
                              onClick={() => setActiveTab("profile")}
                              variant="outline"
                              size="sm"
                              className="text-xs px-3 py-1 h-auto"
                            >
                              Thông tin khách hàng
                            </Button>
                            <Button
                              onClick={() => setShowLogoutConfirm(true)}
                              variant="outline"
                              size="sm"
                              className="text-xs px-3 py-1 h-auto"
                            >
                              <LogOut className="w-3 h-3 mr-1" />
                              Đăng xuất
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cột 2: Chỉ số th���ng kê */}
                    <div className="space-y-6">
                      <div className="rounded-xl bg-green-50 border border-green-200 p-5 shadow-sm flex items-center gap-4 min-h-[88px]">
                        <div className="w-10 h-10 rounded-full bg-[#1C8C64]/10 text-[#1C8C64] flex items-center justify-center">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Tổng chi tiêu</div>
                          <div className="mt-1 text-2xl font-bold text-[#1C8C64]">{formatVnd(overviewStats.totalSpent)}đ</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm text-center">
                          <div className="text-3xl font-bold text-[#1C8C64]">{overviewStats.orders}</div>
                          <div className="text-sm text-gray-600 mt-1">Đơn hàng đã mua</div>
                        </div>
                        <div className="rounded-xl bg-green-50 border border-green-200 p-6 shadow-md">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#1C8C64]">{overviewStats.vouchers}</div>
                            <div className="text-sm font-medium text-[#1C8C64] mt-1">Voucher hiện có</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>


              {/* Membership Tier Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Khám phá ưu đãi thành viên</h3>

                {/* Membership Cards */}
                <div className="lg:grid lg:grid-cols-3 lg:gap-4 mb-6">
                  {/* Mobile: Horizontal Scroll */}
                  <div className="lg:hidden flex space-x-4 overflow-x-auto pb-2">
                    {/* Silver Card */}
                    <Card className="bg-gray-200 text-gray-800 p-4 min-w-[200px] flex-shrink-0">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-3"></div>
                        <h4 className="font-bold text-lg mb-2">Silver</h4>
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium">Đã mở khóa thành viên</span>
                        </div>
                      </div>
                    </Card>

                    {/* Gold Card - Active */}
                    <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-4 min-w-[240px] flex-shrink-0">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full mx-auto mb-3"></div>
                        <h4 className="font-bold text-lg mb-2">Gold</h4>
                        <p className="text-sm opacity-90 mb-2">Đã mua 37,190,000đ/120,000,000đ</p>
                        <p className="text-xs opacity-75 mb-1">Hạng thành viên được c���p nhật 13/02/2025</p>
                        <p className="text-xs opacity-75">Cần cập nhật 52,810,000đ để lên hạng</p>
                      </div>
                    </Card>

                    {/* Diamond Card */}
                    <Card className="bg-gradient-to-br from-gray-800 to-black text-white p-4 min-w-[200px] flex-shrink-0">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <Crown className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg mb-2">Diamond</h4>
                        <div className="flex items-center justify-center space-x-2">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium opacity-75">Chưa mở khóa thành viên</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Desktop: Grid Layout */}
                  <div className="hidden lg:contents">
                    {/* Silver Card */}
                    <Card className="bg-gray-200 text-gray-800 p-6">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-3"></div>
                        <h4 className="font-bold text-lg mb-2">Silver</h4>
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium">Đ�� mở khóa thành viên</span>
                        </div>
                      </div>
                    </Card>

                    {/* Gold Card - Active */}
                    <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full mx-auto mb-3"></div>
                        <h4 className="font-bold text-lg mb-2">Gold</h4>
                        <p className="text-sm opacity-90 mb-2">Đã mua 37,190,000��/120,000,000đ</p>
                        <p className="text-xs opacity-75 mb-1">Hạng thành viên được cập nhật 13/02/2025</p>
                        <p className="text-xs opacity-75">Cần cập nhật 52,810,000đ đ����� lên hạng</p>
                      </div>
                    </Card>

                    {/* Diamond Card */}
                    <Card className="bg-gradient-to-br from-gray-800 to-black text-white p-6">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <Crown className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg mb-2">Diamond</h4>
                        <div className="flex items-center justify-center space-x-2">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium opacity-75">Chưa mở khóa thành vi��n</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-[#1C8C64] h-3 rounded-full" style={{ width: "31%" }}></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="w-3 h-3 bg-[#1C8C64] rounded-full"></div>
                    <div className="w-3 h-3 bg-[#1C8C64] rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>



              {/* Benefits & Conditions */}
              <div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Điều kiện & Ưu ��ãi</h3>
                <div className="space-y-3">
                  {[
                    {
                      title: "Điều kiện",
                      subtitle: "Tổng số tiền mua hàng tích l��y trong thời gian đã 90 ngày đều ����ến 120 triệu đồng",
                    },
                    {
                      title: "Nguyên tắc t��ch điểm (nguyên t���c chung áp dụng với tất cả nghành hàng)",
                      subtitle: "Qúy để tăm g��i từ đơn hàng hiện tài",
                    },
                    {
                      title: "Nguyên tắc chiết khấu",
                      subtitle: "0.3%",
                    },
                    {
                      title: "Ưu đ��i thu cũ đổi mới",
                      subtitle: "Tăng thêm 5% tối đa 400,000đ giá thu cũ",
                    },
                    {
                      title: "Ưu đ��i trợ giá lên đ���i",
                      subtitle: "Trợ giá lên đời thêm 5% tối đa 400,000đ",
                    },
                  ].map((item, index) => (
                    <Card key={index} className="p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Gift className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm lg:text-base text-gray-900 mb-1 leading-tight">{item.title}</h4>
                          <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">{item.subtitle}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
                <Card className="p-4 lg:p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Họ và tên</Label>
                        <Input
                          value={isEditingProfile ? profileData.name : user.name}
                          readOnly={!isEditingProfile}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Số điện thoại</Label>
                        <Input
                          value={isEditingProfile ? profileData.phone : formatPhoneNumber(user.phone)}
                          readOnly={!isEditingProfile}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                        <Input
                          type="email"
                          value={profileData.email}
                          readOnly={!isEditingProfile}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Địa chỉ</Label>
                        <Input
                          value={profileData.address}
                          readOnly={!isEditingProfile}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="mt-1"
                          placeholder="Số nhà, tên đường..."
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Sinh nhật</Label>
                        <Input
                          type="date"
                          value={profileData.birthday}
                          readOnly={!isEditingProfile}
                          onChange={(e) => handleInputChange('birthday', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Giới tính</Label>
                        {isEditingProfile ? (
                          <Select value={profileData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Nam</SelectItem>
                              <SelectItem value="female">Nữ</SelectItem>
                              <SelectItem value="other">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            value={profileData.gender === 'male' ? 'Nam' : profileData.gender === 'female' ? 'Nữ' : 'Khác'}
                            readOnly
                            className="mt-1"
                          />
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Ngày tạo khách hàng</Label>
                        <Input
                          value={new Date(profileData.createdDate).toLocaleDateString('vi-VN')}
                          readOnly
                          className="mt-1 bg-gray-50"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Ghi chú</Label>
                      <Textarea
                        value={profileData.notes}
                        readOnly={!isEditingProfile}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        className="mt-1"
                        rows={3}
                        placeholder="Thêm ghi chú về khách hàng..."
                      />
                    </div>
                    <div className="flex gap-2">
                      {!isEditingProfile ? (
                        <Button onClick={handleEditProfile} className="w-full lg:w-auto">
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa thông tin
                        </Button>
                      ) : (
                        <>
                          <Button onClick={handleSaveProfile} className="w-full lg:w-auto">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Lưu thay đổi
                          </Button>
                          <Button onClick={handleCancelEdit} variant="outline" className="w-full lg:w-auto">
                            Hủy
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
                  <p className="text-gray-600 mb-8">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
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
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold flex items-center">
                        <ShoppingCart className="w-8 h-8 mr-3 text-blue-600" />
                        Giỏ hàng ({cartItems.length} sản phẩm)
                      </h1>
                      <Button variant="outline" asChild>
                        <Link to="/products">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Tiếp tục mua sắm
                        </Link>
                      </Button>
                    </div>

                    {/* Out of Stock Warning */}
                    {hasOutOfStockItems && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                          <span className="font-medium text-orange-800">Một số sản phẩm hiện tại hết hàng</span>
                        </div>
                        <p className="text-orange-700 text-sm mt-1">Vui lòng xóa hoặc thay thế các sản phẩm hết hàng để tiếp tục thanh toán</p>
                      </div>
                    )}

                    {/* Cart Items List */}
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <Card key={item.id} className={`border-0 shadow-lg ${!item.isInStock ? "bg-gray-50" : ""}`}>
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              {/* Product Image */}
                              <div className="relative">
                                <img src={item.image} alt={item.name} className={`w-24 h-24 object-cover rounded-lg ${!item.isInStock ? "grayscale" : ""}`} />
                                {item.isPremium && (
                                  <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Premium
                                  </Badge>
                                )}
                                {!item.isInStock && (
                                  <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">Hết hàng</span>
                                  </div>
                                )}
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                                    <p className="text-blue-600 font-medium">{item.brand}</p>
                                  </div>
                                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <X className="w-5 h-5" />
                                  </button>
                                </div>

                                {/* Variants */}
                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="outline">Màu: {item.variant.color}</Badge>
                                  <Badge variant="outline">Size: {item.variant.size}</Badge>
                                  {item.variant.lensType && <Badge variant="outline">{item.variant.lensType}</Badge>}
                                </div>

                                {/* Price & Actions */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                                  <div className="space-y-1">
                                    <div className="flex items-baseline space-x-2">
                                      <span className="text-xl font-bold text-blue-600">{item.price.toLocaleString()}đ</span>
                                      {item.originalPrice && (
                                        <span className="text-gray-500 line-through">{item.originalPrice.toLocaleString()}đ</span>
                                      )}
                                    </div>
                                    {item.originalPrice && (
                                      <span className="text-green-600 text-sm font-medium">
                                        Tiết kiệm {(item.originalPrice - item.price).toLocaleString()}đ
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                      >
                                        <Minus className="w-4 h-4" />
                                      </button>
                                      <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        disabled={item.quantity >= item.maxQuantity}
                                        className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2">
                                      <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Xóa
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                {/* Stock Status */}
                                {item.isInStock ? (
                                  <div className="flex items-center space-x-1 text-green-600 text-sm">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>
                                      Còn hàng {item.maxQuantity <= 5 && (
                                        <span className="text-orange-600">(chỉ còn {item.maxQuantity} sản phẩm)</span>
                                      )}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-1 text-red-600 text-sm">
                                    <X className="w-4 h-4" />
                                    <span>Tạm hết hàng</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Recommended Products */}
                    <Card className="border-0 shadow-lg hidden lg:block">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                          <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                          Có thể bạn quan tâm
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="group cursor-pointer border rounded-lg p-3 hover:shadow-lg transition-all">
                              <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                                <img src="https://images.pexels.com/photos/8346914/pexels-photo-8346914.jpeg" alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              </div>
                              <h4 className="font-medium text-sm mb-1">Kính Cận Modern {i}</h4>
                              <p className="text-blue-600 font-bold text-sm">{(1500000 + i * 100000).toLocaleString()}đ</p>
                              <Button size="sm" className="w-full mt-2">
                                <Plus className="w-4 h-4 mr-1" />
                                Thêm
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Address & Shipping & Payment & Summary */}
                  <div className="space-y-6">
                    {/* Shipping Address */}
                    <Card className="border-0 shadow-lg sticky top-4">
                      <CardContent className="p-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-xl flex items-center"><MapPin className="w-5 h-5 mr-2" />Địa ch�� giao hàng</h3>
                          <Button variant="outline" size="sm" onClick={() => setIsEditingAddress((v) => !v)}>{isEditingAddress ? "Lưu" : "Thay đổi"}</Button>
                        </div>
                        {isEditingAddress ? (
                          <div className="grid grid-cols-1 gap-3">
                            <Input placeholder="Họ tên" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                            <Input placeholder="Số điện thoại" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                            <Input placeholder="Địa chỉ" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
                          </div>
                        ) : (
                          <div className="text-sm text-gray-700">
                            <div className="font-medium">{address.fullName || user?.name}</div>
                            <div>{address.phone || (user ? formatPhoneNumber(user.phone) : "")}</div>
                            <div>{address.line1 || "Chưa có địa chỉ"}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Shipping Options */}
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6 space-y-4">
                        <h4 className="font-semibold flex items-center"><Truck className="w-4 h-4 mr-2" />Phương thức vận chuyển</h4>
                        <Select value={shippingMethod} onValueChange={setShippingMethod}>
                          <SelectTrigger className="whitespace-nowrap">
                            <SelectValue className="truncate" placeholder="Chọn phương thức" />
                          </SelectTrigger>
                          <SelectContent>
                            {shippingOptions.map((o) => (
                              <SelectItem key={o.id} value={o.id}>{`${o.name} - ${o.price === 0 ? "Miễn phí" : `${o.price.toLocaleString()}đ`}`}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">{selectedShipping?.description}</p>
                      </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6 space-y-3">
                        <h4 className="font-semibold flex items-center"><CreditCard className="w-4 h-4 mr-2" />Phương thức thanh toán</h4>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                          <div className="flex items-center space-x-3 p-3 border rounded-lg">
                            <RadioGroupItem value="cod" id="pm-cod" />
                            <Label htmlFor="pm-cod">Thanh toán khi nhận hàng (COD)</Label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 border rounded-lg">
                            <RadioGroupItem value="card" id="pm-card" />
                            <Label htmlFor="pm-card">Thẻ/Ví điện tử</Label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 border rounded-lg">
                            <RadioGroupItem value="bank" id="pm-bank" />
                            <Label htmlFor="pm-bank">Chuyển khoản ngân hàng</Label>
                          </div>
                        </RadioGroup>
                      </CardContent>
                    </Card>

                    {/* Summary Card */}
                    <Card className="border-0 shadow-lg sticky top-4">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-xl mb-6">Tóm tắt đơn hàng</h3>

                        {/* Price Breakdown */}
                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between">
                            <span>Tạm tính:</span>
                            <span>{subtotal.toLocaleString()}đ</span>
                          </div>

                          {savedAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Tiết kiệm:</span>
                              <span>-{savedAmount.toLocaleString()}đ</span>
                            </div>
                          )}

                          {appliedCoupon && (
                            <div className="flex justify-between text-green-600">
                              <span>Giảm giá ({appliedCoupon.code}):</span>
                              <span>-{couponDiscount.toLocaleString()}đ</span>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <span>Phí vận chuyển:</span>
                            <span>{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString()}đ`}</span>
                          </div>

                          <Separator />

                          <div className="flex justify-between text-xl font-bold">
                            <span>Tổng cộng:</span>
                            <span className="text-blue-600">{total.toLocaleString()}đ</span>
                          </div>
                        </div>



                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <Button className="w-full h-12 bg-orange-600 hover:bg-orange-700 rounded-full hidden lg:block" disabled={hasOutOfStockItems} asChild>
                            <Link to="/cart">
                              <CreditCard className="w-5 h-5 mr-2" />
                              Đặt hàng
                            </Link>
                          </Button>
                          <Button variant="outline" className="w-full" asChild>
                            <Link to="/products">
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Tiếp tục mua sắm
                            </Link>
                          </Button>
                        </div>

                        {/* Security & Features */}
                        <div className="mt-6 space-y-3 pt-6 border-t">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span>Thanh toán an toàn SSL</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <RotateCcw className="w-4 h-4 text-blue-600" />
                            <span>Đổi trả trong 30 ngày</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Package className="w-4 h-4 text-purple-600" />
                            <span>Bảo hành chính hãng</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recommended Products (mobile/tablet below summary) */}
                    <Card className="border-0 shadow-lg lg:hidden">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                          <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                          Có thể bạn quan tâm
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="group cursor-pointer border rounded-lg p-3 hover:shadow-lg transition-all">
                              <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                                <img src="https://images.pexels.com/photos/8346914/pexels-photo-8346914.jpeg" alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              </div>
                              <h4 className="font-medium text-sm mb-1">Kính Cận Modern {i}</h4>
                              <p className="text-blue-600 font-bold text-sm">{(1500000 + i * 100000).toLocaleString()}đ</p>
                              <Button size="sm" className="w-full mt-2">
                                <Plus className="w-4 h-4 mr-1" />
                                Thêm
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              {cartItems.length > 0 && (
                <div className="fixed inset-x-0 bottom-0 z-40 bg-white border-t p-4 lg:hidden">
                  <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Tổng thanh toán</div>
                      <div className="text-xl font-bold text-orange-600">{total.toLocaleString()}đ</div>
                    </div>
                    <Button className="h-12 px-6 rounded-full bg-orange-600 hover:bg-orange-700" disabled={hasOutOfStockItems} asChild>
                      <Link to="/cart">Đặt hàng</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Voucher Tab */}
          {activeTab === "voucher" && (
            <div className="space-y-4">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Trung tâm voucher</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
                {vouchers.map((v) => {
                  const isGreen = v.color === "green";
                  const voucherState = voucherStates[v.id] || { isLoading: false, voucherCode: null, expiryDate: null, isClaimed: false, status: "Chưa phát hành" };

                  return (
                    <Card key={v.id} className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
                      {/* Phần voucher chính */}
                      <div className="main-voucher-content">
                        <div className="flex min-h-[140px]">
                          {/* Left: Icon + VOUCHER/COUPON */}
                          <div className={`${isGreen ? "bg-[#1C8C64]" : "bg-red-500"} w-20 shrink-0 text-white flex flex-col items-center justify-center p-4 rounded-l-xl`}>
                            {v.kind === "VOUCHER" ? <Gift className="w-8 h-8 mb-2" /> : <Percent className="w-8 h-8 mb-2" />}
                            <div className="text-xs font-bold uppercase tracking-wide text-center">{v.kind}</div>
                          </div>

                          {/* Right: Discount + Description + Nút "Lấy" */}
                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 mr-3">
                                <div className="text-xl font-bold text-gray-900 mb-1">{v.title}</div>
                                <div className="text-sm text-gray-600 mb-3">{v.minOrder > 0 ? `Đơn tối thiểu ${v.minOrder.toLocaleString()}đ` : "Không yêu cầu tối thiểu"}</div>
                                <div className="mt-1 flex items-center gap-2 flex-wrap">
                                  <Badge className={`border-0 text-xs px-2 py-1 rounded-md ${voucherState.status === "Đã phát hành" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                                    {voucherState.status}
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs h-7 px-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                                    onClick={() => handleShowTerms(v.id, v.title)}
                                  >
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Điều kiện
                                  </Button>
                                </div>
                              </div>

                              {/* Conditional rendering cho nút Lấy - centered vertically */}
                              {!voucherState.voucherCode && (
                                <div className="flex items-center h-full">
                                  <Button
                                    className="bg-[#1C8C64] hover:bg-[#167455] text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={voucherState.isLoading}
                                    onClick={() => handleClaimVoucher(v.id)}
                                  >
                                    {voucherState.isLoading ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        <span className="text-xs">Đang tạo mã voucher...</span>
                                      </>
                                    ) : (
                                      "Lấy"
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Hiển thị tên chương trình - lu��n hiển thị */}
                            <div className="text-xs text-blue-600 mt-4 flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>{v.programName}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Phần mã voucher - CHỈ HIỆN SAU KHI CLAIM */}
                      {voucherState.voucherCode && (
                        <div className="border-t border-gray-200 bg-gray-50 p-4">
                          {/* Khung m�� voucher */}
                          <div className="bg-white rounded-lg p-3 border-2 border-dashed border-gray-300 mb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="text-left">
                                  <span className="text-xs text-gray-500">Mã: </span>
                                  <span className="font-mono text-lg font-bold">{voucherState.voucherCode}</span>
                                </div>
                                <div className="text-xs text-blue-600 mt-1">
                                  Hạn sử dụng: {voucherState.expiryDate}
                                </div>
                              </div>
                              <div className="flex gap-2 ml-3">
                                <button
                                  onClick={() => handleCopyVoucherCode(voucherState.voucherCode!)}
                                  className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                                  title="Sao chép mã"
                                  type="button"
                                >
                                  <Copy className="w-5 h-5 text-gray-600" />
                                </button>
                                <button
                                  onClick={() => handleShowQRCode(v.id, voucherState.voucherCode!)}
                                  className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                                  title="Hiển thị mã QR"
                                  type="button"
                                >
                                  <QrCode className="w-5 h-5 text-gray-600" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 2 nút Album + Tặng */}
                          <div className="flex gap-2 justify-center mb-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleDownloadVoucher(v.id)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Tải voucher
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleShareVoucher(v.id)}
                            >
                              <Share2 className="w-4 h-4 mr-1" />
                              Tặng
                            </Button>
                          </div>

                          {/* Hiển th�� tên chương trình trong phần đã claim */}
                          <div className="text-xs text-blue-600 flex items-center gap-1.5 justify-center">
                            <Calendar className="w-4 h-4" />
                            <span>{v.programName}</span>
                          </div>

                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>

              {/* Voucher History Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Lịch sử voucher</h3>
                <Card className="p-0 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">STT</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên voucher</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã voucher</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày phát hành</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hạn sử dụng</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái voucher</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái sử dụng</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người phát hành</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {voucherHistory.map((voucher, index) => (
                          <tr key={voucher.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{voucher.name}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-mono font-semibold text-blue-600">{voucher.code}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                              {voucher.issueDate}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                              {voucher.expiryDate}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Badge className={`${
                                voucher.voucherStatus === "Đã phát hành"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
                              }`}>
                                {voucher.voucherStatus}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Badge className={`${
                                voucher.usageStatus === "Đã sử dụng"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                              }`}>
                                {voucher.usageStatus}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                              {voucher.issuer}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination for voucher history */}
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{voucherHistory.length}</span> trong tổng số <span className="font-medium">{voucherHistory.length}</span> voucher
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>
                          Trước
                        </Button>
                        <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200">
                          1
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          Sau
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (() => {
            const pageSize = 10;
            const total = mockOrders.length;
            const totalPages = Math.ceil(total / pageSize);
            const startIdx = (historyPage - 1) * pageSize;
            const endIdx = Math.min(startIdx + pageSize, total);
            const items = mockOrders.slice(startIdx, endIdx);
            return (
              <div className="space-y-4">
                <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Lịch sử mua hàng</h2>
                <Card className="p-0 overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table className="min-w-[900px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mã hóa đơn</TableHead>
                          <TableHead>Thời gian</TableHead>
                          <TableHead>Người bán</TableHead>
                          <TableHead>Chi nhánh</TableHead>
                          <TableHead className="text-right">Tổng cộng</TableHead>
                          <TableHead>Trạng thái</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((o) => (
                          <React.Fragment key={o.code}>
                            <TableRow>
                              <TableCell>
                                <button className="text-blue-600 hover:underline font-medium" onClick={() => toggleExpand(o.code)}>{o.code}</button>
                              </TableCell>
                              <TableCell>{formatDateTime(o.date)}</TableCell>
                              <TableCell>{o.seller}</TableCell>
                              <TableCell>{o.branch}</TableCell>
                              <TableCell className="text-right">{formatVnd(o.total)}</TableCell>
                              <TableCell>
                                <Badge className={statusClass(o.status)}>{o.status}</Badge>
                              </TableCell>
                            </TableRow>
                            {expanded[o.code] && (
                              <TableRow>
                                <TableCell colSpan={6} className="bg-muted/30 p-0">
                                  <div className="px-4 py-3 text-sm text-gray-700 flex items-center space-x-2">
                                    <FileText className="w-4 h-4 text-gray-500" />
                                    <span>Chi tiết hóa đơn {o.code}</span>
                                  </div>
                                  <div className="px-4 pb-4 overflow-x-auto">
                                    <Table className="min-w-[900px]">
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Mã hàng</TableHead>
                                          <TableHead>Tên hàng</TableHead>
                                          <TableHead className="text-right">Số lượng</TableHead>
                                          <TableHead className="text-right">Đơn giá</TableHead>
                                          <TableHead className="text-right">Giảm giá</TableHead>
                                          <TableHead className="text-right">Giá bán</TableHead>
                                          <TableHead className="text-right">Thành tiền</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {getInvoiceDetails(o.code).items.map((it) => (
                                          <TableRow key={it.sku}>
                                            <TableCell>
                                              <span className="text-blue-600 hover:underline cursor-pointer">{it.sku}</span>
                                            </TableCell>
                                            <TableCell className="max-w-xl">{it.name}</TableCell>
                                            <TableCell className="text-right">{it.qty}</TableCell>
                                            <TableCell className="text-right">{formatVnd(it.price)}</TableCell>
                                            <TableCell className="text-right">{formatVnd(it.discount)}</TableCell>
                                            <TableCell className="text-right">{formatVnd(it.sell)}</TableCell>
                                            <TableCell className="text-right font-medium">{formatVnd(it.total)}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                    {(() => { const d = getInvoiceDetails(o.code); return (
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                        <div>
                                          <textarea className="w-full h-24 p-3 border rounded-md text-sm" defaultValue={d.note} readOnly />
                                        </div>
                                        <div className="ml-auto w-full lg:w-96 text-sm space-y-2">
                                          <div className="flex justify-between">
                                            <span>Tổng tiền hàng ({d.items.reduce((s, it) => s + it.qty, 0)})</span>
                                            <span className="font-medium">{formatVnd(d.summary.subtotal)}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Giảm giá hóa đơn</span>
                                            <span>{formatVnd(d.summary.orderDiscount)}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Khách cần tr���</span>
                                            <span className="font-semibold">{formatVnd(d.summary.toPay)}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Khách đã trả</span>
                                            <span className="font-semibold">{formatVnd(d.summary.paid)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    ); })()}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {/* Expanded detail rows */}
                  <div className="hidden divide-y">
                    {items.filter((o) => expanded[o.code]).map((o) => {
                      const d = getInvoiceDetails(o.code);
                      return (
                        <div key={`${o.code}-details`} className="bg-white">
                          <div className="px-4 py-3 text-sm text-gray-700 flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span>Chi tiết hóa đơn {o.code}</span>
                          </div>
                          <div className="px-4 pb-4 overflow-x-auto">
                            <Table className="min-w-[900px]">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Mã hàng</TableHead>
                                  <TableHead>Tên hàng</TableHead>
                                  <TableHead className="text-right">Số lượng</TableHead>
                                  <TableHead className="text-right">Đơn giá</TableHead>
                                  <TableHead className="text-right">Giảm giá</TableHead>
                                  <TableHead className="text-right">Giá bán</TableHead>
                                  <TableHead className="text-right">Thành tiền</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {d.items.map((it) => (
                                  <TableRow key={it.sku}>
                                    <TableCell>
                                      <span className="text-blue-600 hover:underline cursor-pointer">{it.sku}</span>
                                    </TableCell>
                                    <TableCell className="max-w-xl">{it.name}</TableCell>
                                    <TableCell className="text-right">{it.qty}</TableCell>
                                    <TableCell className="text-right">{formatVnd(it.price)}</TableCell>
                                    <TableCell className="text-right">{formatVnd(it.discount)}</TableCell>
                                    <TableCell className="text-right">{formatVnd(it.sell)}</TableCell>
                                    <TableCell className="text-right font-medium">{formatVnd(it.total)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                              <div>
                                <textarea className="w-full h-24 p-3 border rounded-md text-sm" defaultValue={d.note} readOnly />
                              </div>
                              <div className="ml-auto w-full lg:w-96 text-sm space-y-2">
                                <div className="flex justify-between">
                                  <span>T���ng tiền hàng ({d.items.reduce((s, it) => s + it.qty, 0)})</span>
                                  <span className="font-medium">{formatVnd(d.summary.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Giảm giá hóa đơn</span>
                                  <span>{formatVnd(d.summary.orderDiscount)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Khách cần trả</span>
                                  <span className="font-semibold">{formatVnd(d.summary.toPay)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Khách đã trả</span>
                                  <span className="font-semibold">{formatVnd(d.summary.paid)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
                    <div className="text-sm text-gray-600">
                      {startIdx + 1} - {endIdx} trong {total} dòng
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setHistoryPage((p) => Math.max(1, p - 1))} disabled={historyPage === 1}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div className="px-3 py-1 rounded bg-white border text-sm">{historyPage}</div>
                      <Button variant="outline" size="sm" onClick={() => setHistoryPage((p) => Math.min(totalPages, p + 1))} disabled={historyPage === totalPages}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })()}

          {/* Website Orders Tab */}
          {activeTab === "website" && (
            <div className="space-y-4">
              <Card className="p-0 overflow-hidden">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-900">Đơn hàng website</h3>
                </div>
                <div className="overflow-x-auto">
                  <Table className="min-w-[700px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã đơn</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead className="text-right">Tổng cộng</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {websiteOrders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-sm text-gray-500">Chưa có đơn hàng website</TableCell>
                        </TableRow>
                      )}
                      {websiteOrders.map((o) => (
                        <React.Fragment key={o.code}>
                          <TableRow>
                            <TableCell>
                              <button className="text-blue-600 hover:underline font-medium" onClick={() => toggleExpand(o.code)}>{o.code}</button>
                            </TableCell>
                            <TableCell>
                              {formatDateTime(o.date)}
                              <span className="text-xs text-gray-500 ml-2">({formatRelative(o.date)})</span>
                            </TableCell>
                            <TableCell className="text-right">{formatVnd(o.total)}đ</TableCell>
                            <TableCell>
                              <Badge className={statusClass(o.status)}>{o.status}</Badge>
                            </TableCell>
                          </TableRow>
                          {expanded[o.code] && (
                            <TableRow>
                              <TableCell colSpan={4} className="bg-muted/30 p-0">
                                <div className="px-4 py-3 text-sm text-gray-700 flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-gray-500" />
                                  <span>Chi tiết đơn hàng {o.code}</span>
                                </div>
                                <div className="px-4 pb-4 overflow-x-auto">
                                  <Table className="min-w-[900px]">
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Mã hàng</TableHead>
                                        <TableHead>Tên hàng</TableHead>
                                        <TableHead className="text-right">Số lượng</TableHead>
                                        <TableHead className="text-right">Đơn giá</TableHead>
                                        <TableHead className="text-right">Giảm giá</TableHead>
                                        <TableHead className="text-right">Giá bán</TableHead>
                                        <TableHead className="text-right">Thành tiền</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {(o.items || []).map((it) => {
                                        const line = (it.price * it.quantity);
                                        const sell = it.originalPrice ? it.price : it.price;
                                        return (
                                          <TableRow key={it.id}>
                                            <TableCell>
                                              <span className="text-gray-700">{it.productId}</span>
                                            </TableCell>
                                            <TableCell className="max-w-xl">
                                              <div className="font-medium">{it.name}</div>
                                              <div className="text-xs text-gray-500">{it.brand} ��� {it.variant.color} • {it.variant.size}{it.variant.lensType ? ` • ${it.variant.lensType}` : ""}</div>
                                            </TableCell>
                                            <TableCell className="text-right">{it.quantity}</TableCell>
                                            <TableCell className="text-right">{formatVnd(it.originalPrice || it.price)}</TableCell>
                                            <TableCell className="text-right">{it.originalPrice ? formatVnd((it.originalPrice - it.price)) : "0"}</TableCell>
                                            <TableCell className="text-right">{formatVnd(sell)}</TableCell>
                                            <TableCell className="text-right font-medium">{formatVnd(line)}</TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                    <div>
                                      <textarea className="w-full h-24 p-3 border rounded-md text-sm" defaultValue={o.note || ""} readOnly />
                                      <div className="text-sm text-gray-600 mt-2">
                                        <div><span className="text-gray-500">Địa chỉ:</span> {o.address || ""}</div>
                                        <div><span className="text-gray-500">Thanh toán:</span> {o.payment?.method || ""}</div>
                                        <div><span className="text-gray-500">Vận chuyển:</span> {o.shipping?.method} {o.shipping?.duration ? `(${o.shipping?.duration})` : ""}</div>
                                        {o.coupon?.code && <div><span className="text-gray-500">Voucher:</span> {o.coupon.code} — {o.coupon.description}</div>}
                                      </div>
                                    </div>
                                    <div className="ml-auto w-full lg:w-96 text-sm space-y-2">
                                      <div className="flex justify-between">
                                        <span>Tổng tiền hàng</span>
                                        <span className="font-medium">{formatVnd(o.summary?.subtotal || 0)}</span>
                                      </div>
                                      {o.summary?.savedAmount ? (
                                        <div className="flex justify-between">
                                          <span>Giảm giá trực tiếp</span>
                                          <span>-{formatVnd(o.summary.savedAmount)}</span>
                                        </div>
                                      ) : null}
                                      {o.summary?.couponDiscount ? (
                                        <div className="flex justify-between">
                                          <span>Giảm giá voucher</span>
                                          <span>-{formatVnd(o.summary.couponDiscount)}</span>
                                        </div>
                                      ) : null}
                                      {typeof o.summary?.shippingFee === 'number' && o.summary.shippingFee > 0 ? (
                                        <div className="flex justify-between">
                                          <span>Phí vận chuyển</span>
                                          <span>{formatVnd(o.summary.shippingFee)}</span>
                                        </div>
                                      ) : null}
                                      <div className="flex justify-between">
                                        <span>Khách cần trả</span>
                                        <span className="font-semibold">{formatVnd(o.summary?.total || o.total)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
              <Card className="p-4 lg:p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Họ và tên</Label>
                      <Input
                        value={isEditingProfile ? profileData.name : user.name}
                        readOnly={!isEditingProfile}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Số điện thoại</Label>
                      <Input
                        value={isEditingProfile ? profileData.phone : formatPhoneNumber(user.phone)}
                        readOnly={!isEditingProfile}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        type="email"
                        value={profileData.email}
                        readOnly={!isEditingProfile}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Địa ch��</Label>
                      <Input
                        value={profileData.address}
                        readOnly={!isEditingProfile}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="mt-1"
                        placeholder="Số nhà, tên đường..."
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Sinh nhật</Label>
                      <Input
                        type="date"
                        value={profileData.birthday}
                        readOnly={!isEditingProfile}
                        onChange={(e) => handleInputChange('birthday', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Giới tính</Label>
                      {isEditingProfile ? (
                        <Select value={profileData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Nam</SelectItem>
                            <SelectItem value="female">N���</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={profileData.gender === 'male' ? 'Nam' : profileData.gender === 'female' ? 'Nữ' : 'Khác'}
                          readOnly
                          className="mt-1"
                        />
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Ngày tạo kh��ch hàng</Label>
                      <Input
                        value={new Date(profileData.createdDate).toLocaleDateString('vi-VN')}
                        readOnly
                        className="mt-1 bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Ghi chú</Label>
                    <Textarea
                      value={profileData.notes}
                      readOnly={!isEditingProfile}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="mt-1"
                      rows={3}
                      placeholder="Thêm ghi chú về khách hàng..."
                    />
                  </div>
                  <div className="flex gap-2">
                    {!isEditingProfile ? (
                      <Button onClick={handleEditProfile} className="w-full lg:w-auto">
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa thông tin
                      </Button>
                    ) : (
                      <>
                        <Button onClick={handleSaveProfile} className="w-full lg:w-auto">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Lưu thay đổi
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline" className="w-full lg:w-auto">
                          Hủy
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}

        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Xác nhận đăng xuất</h3>
              <p className="text-sm lg:text-base text-gray-600 mb-6">Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?</p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
      <Toaster />

      {/* QR Code Popup Modal */}
      {qrPopup.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Mã QR Voucher</h3>
                <button
                  onClick={closeQrPopup}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block mb-4">
                  <img
                    src={qrPopup.qrCodeUrl}
                    alt={`QR Code for ${qrPopup.voucherCode}`}
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                {/* Voucher Code */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Mã voucher:</p>
                  <p className="font-mono text-lg font-bold text-gray-900">{qrPopup.voucherCode}</p>
                </div>

                {/* Instructions */}
                <p className="text-xs text-gray-500 mb-4">
                  Quét mã QR này để sử dụng voucher tại cửa hàng
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleCopyVoucherCode(qrPopup.voucherCode)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Sao chép mã
                  </Button>
                  <Button
                    className="flex-1 bg-[#1C8C64] hover:bg-[#167455]"
                    onClick={closeQrPopup}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions Popup Modal */}
      {termsPopup.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Đi���u kiện điều khoản</h3>
                  <p className="text-sm text-gray-600 mt-1">{termsPopup.voucherTitle}</p>
                </div>
                <button
                  onClick={closeTermsPopup}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {(() => {
                  const terms = getVoucherTerms(termsPopup.voucherId);
                  return (
                    <div className="space-y-6">
                      {/* General Terms */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-blue-600 text-sm font-bold">1</span>
                          </div>
                          Điều kiện chung
                        </h4>
                        <ul className="space-y-2 ml-8">
                          {terms.generalTerms.map((term, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="text-gray-400 mr-2">���</span>
                              <span>{term}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Usage Conditions */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-green-600 text-sm font-bold">2</span>
                          </div>
                          Điều kiện sử dụng
                        </h4>
                        <ul className="space-y-2 ml-8">
                          {terms.usageConditions.map((condition, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="text-gray-400 mr-2">•</span>
                              <span>{condition}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Validity Period */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-yellow-600 text-sm font-bold">3</span>
                          </div>
                          Thời hạn hiệu l���c
                        </h4>
                        <ul className="space-y-2 ml-8">
                          {terms.validityPeriod.map((period, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="text-gray-400 mr-2">•</span>
                              <span>{period}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Other Terms */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-red-600 text-sm font-bold">4</span>
                          </div>
                          Các điều khoản khác
                        </h4>
                        <ul className="space-y-2 ml-8">
                          {terms.otherTerms.map((term, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="text-gray-400 mr-2">•</span>
                              <span>{term}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={closeTermsPopup}
                  >
                    Đóng
                  </Button>
                  <Button
                    className="bg-[#1C8C64] hover:bg-[#167455]"
                    onClick={closeTermsPopup}
                  >
                    Đã hiểu
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
