import { useState, useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { checkPhoneExists, validatePhoneNumber, formatPhoneNumber, sendOTP, verifyOTP, loginCustomer, getCurrentUser } from "@/lib/auth";
import { requireAuthForCart } from "@/lib/authGuard";
import { getClaimedCoupons, claimVoucher, parseDiscountFromTitle, type CouponCode } from "@/lib/vouchers";
import { getAllVoucherProgramsForCurrentUser } from "@/lib/voucher-programs";
import type { VoucherProgram } from "@/lib/voucher-programs";
import { VoucherCard } from "@/components/VoucherCard";
import {
  Heart,
  Star,
  ShoppingCart,
  Eye,
  Share2,
  ArrowLeft,
  Plus,
  Minus,
  Shield,
  Truck,
  RotateCcw,
  Clock,
  RefreshCw,
  Award,
  CheckCircle2,
  Info,
  Palette,
  Ruler,
  Package,
  MapPin,
  Phone,
  MessageCircle,
  GitCompare,
  Zap,
  Tag,
  Percent,
  Gift,
  X,
  Glasses,
  Sun,
  Users,
  User,
  UserPlus,
  Camera,
  Microscope,
  Target,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  Calendar,
  CreditCard,
  Building2,
  CircleCheck,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Expand,
  ZoomIn,
  Play,
  BookOpen,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  Crown,
  FlameKindling,
  ShoppingBag,
} from "lucide-react";

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  stockCount?: number;
  image?: string;
  color?: {
    name: string;
    code: string;
    image?: string;
  };
  size?: string;
  refractiveIndex?: number;
  lensFeatures?: string[];
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  variant?: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  basePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  category: string;
  gender: string;
  frameType: string;
  shape: string;
  material: string;
  features: string[];
  description: string;
  highlights: string[];
  specifications: Record<string, string>;
  isNew?: boolean;
  isOnSale?: boolean;
  isBestseller?: boolean;
  isPremium?: boolean;
  variants: ProductVariant[];
  availableColors: Array<{
    name: string;
    code: string;
    image?: string;
  }>;
  availableSizes: string[];
  availableRefractiveIndexes?: number[];
  availableLensFeatures?: string[];
  careInstructions: string[];
  warranty: string;
  reviews: Review[];
}

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedLensType, setSelectedLensType] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [selectedReviewFilter, setSelectedReviewFilter] = useState("all");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showTradeInModal, setShowTradeInModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLoginFormModal, setShowLoginFormModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginPhone, setLoginPhone] = useState("");
  const [loginOTP, setLoginOTP] = useState("");
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [demoOTP, setDemoOTP] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResendOTP, setCanResendOTP] = useState(false);
  const [expandDescription, setExpandDescription] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string>("");

  const navigate = useNavigate();
  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResendOTP && showOTPModal) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResendOTP(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResendOTP, showOTPModal]);

  // Mock product data - in real app, this would come from API based on id
  const product: Product = {
    id: "1",
    name: "Kính Cận Classic Series RB5228",
    brand: "Ray-Ban",
    basePrice: 1750000,
    priceRange: { min: 1500000, max: 2200000 },
    rating: 4.8,
    reviewCount: 248,
    image: "https://images.pexels.com/photos/8346914/pexels-photo-8346914.jpeg",
    images: [
      "https://images.pexels.com/photos/8346914/pexels-photo-8346914.jpeg",
      "https://images.pexels.com/photos/5766609/pexels-photo-5766609.jpeg",
      "https://images.pexels.com/photos/3773478/pexels-photo-3773478.jpeg",
      "https://images.pexels.com/photos/8346914/pexels-photo-8346914.jpeg",
      "https://images.pexels.com/photos/5766609/pexels-photo-5766609.jpeg",
    ],
    category: "Kính Cận",
    gender: "Unisex",
    frameType: "G���ng Plastik",
    shape: "Vuông",
    material: "Acetate cao cấp",
    features: [
      "Chống ánh sáng xanh",
      "Chống trầy xước",
      "Siêu nhẹ",
      "Chống b��m bẩn",
    ],
    description:
      "Kính cận Ray-Ban Classic Series RB5228 đại diện cho sự kết hợp hoàn hảo giữa phong cách thời trang hiện đại và công nghệ tiên tiến trong ngành công nghiệp mắt kính. Được thiết kế dành cho những người yêu thích sự tinh tế và chất lượng, chiếc kính này không chỉ là một công cụ hỗ trợ thị lực m�� còn là một phụ ki��n thời trang đẳng cấp thể hiện cá tính và phong cách riêng của người đeo. Gọng kính được chế tác từ chất liệu acetate cao cấp nhập khẩu từ Ý, nổi tiếng với độ bền vượt trội và kh��� năng chống va đập tuyệt vời. Acetate không chỉ nhẹ mà còn c�� độ đàn hồi cao, giúp gọng kính ôm sát khuôn mặt một cách tự nhiên mà không gây cảm giác khó chịu hay đau rát sau thời gian dài sử dụng. Điều đặc biệt ở chất liệu này là khả năng ch���ng phai màu và biến dạng theo thời gian, đ��m b��o chiếc kính luôn gi��� đư���c vẻ đẹp ban đầu ngay cả sau nhiều năm sử dụng. Thiết kế Classic Series RB5228 mang ��ậm dấu ấn đặc trưng của thương hi���u Ray-Ban với đ��ờng nét vuông vức hiện đại nhưng vẫn giữ được sự mềm mại và thanh lịch. Phần gọng trước có độ dày vừa phải, không quá nặng nề nhưng cũng đủ mạnh mẽ để tạo ấn tượng. Cầu mũi được thiết kế ergonomic với các miếng đệm silicon mềm mại, có thể điều chỉnh để phù hợp với mọi dáng mũi, từ mũi cao đến mũi tẹt, đảm bảo sự thoải mái t��i đa trong suốt quá trình sử dụng. Chân gọng đư���c gia công tỉ mỉ với độ cong vừa phải, ôm trọn phần tai mà không gây cảm giác chèn ép hay trượt ngã. Bản lề sử dụng công nghệ gia công chính xác từ Đức với hơn 5000 lần mở đóng mà vẫn giữ được độ chắc chắn. Tròng kính của RB5228 sử dụng công nghệ Blue Light Protection tiên tiến nhất hiện nay, có khả năng l��c đến 95% ánh sáng xanh có hại phát ra từ các thiết bị ��iện tử như máy tính, điện thoại, máy tính bảng và tivi. Công nghệ này đặc biệt quan trọng trong thời đ��i số hóa hiện nay khi chúng ta dành phần lớn thời gian nhìn vào màn hình. Ánh sáng xanh không chỉ g��y mỏi mắt, khô mắt mà còn có thể dẫn đến các vấn đề nghiêm trọng hơn như thoái hóa võng mạc v�� rối loạn giấc ngủ. Lớp phủ chống phản xạ đa tầng giúp giảm thiểu hiện tượng lóa mắt và tăng cường độ rõ nét của hình ảnh. Độ truyền ánh sáng đạt 99.2%, đảm bảo tầm nhìn tự nhiên và sắc nét trong mọi điều kiện ánh sáng. Quy trình sản xuất RB5228 tuân thủ các tiêu chuẩn chất lượng khắt khe của châu Âu với hơn 100 bước kiểm tra chất lượng. Mỗi chiếc kính đều được kiểm tra thủ công bởi các nghệ nhân có kinh nghiệm trên 20 năm trong ngành. Gọng kính trải qua quá trình đánh bóng 12 lần để đạt được độ bóng hoàn hảo và cảm giác mịn màng khi chạm vào. Màu s��c được phối trộn theo công thức bí mật của Ray-Ban, tạo nên những gam màu độc đáo và sang trọng. Đặc biệt, RB5228 còn được trang bị công nghệ chống trầy xước Diamond Hard Coating, giúp bảo vệ b��� mặt tròng kính khỏi các vết xước nhỏ trong quá trình sử dụng h��ng ngày. Lớp phủ này c��ng có tính n��ng chống bám bụi và dầu mỡ, giúp việc vệ sinh kính trở nên dễ dàng hơn. Chỉ cần lau nhẹ bằng khăn microfiber là kính đã sạch như mới. Về mặt thẩm mỹ, RB5228 phù h��p với mọi khuôn mặt từ oval, vuông, tròn đến tim. Kích thước gọng ����ợc tính toán kỹ lưỡng để tạo sự cân bằng hoàn hảo cho gương mặt. Người đeo sẽ trông trẻ trung, hiện đại nhưng v���n giữ được vẻ chín chắn và chuyên nghiệp. Thương hiệu Ray-Ban cam kết bảo hành chính hãng 12 tháng cho toàn bộ s���n phẩm, bao gồm cả gọng và tròng kính. Dịch vụ hậu mãi tận tâm với đội ngũ kỹ thuật viên được đào tạo chuyên nghiệp, sẵn sàng hỗ trợ khách hàng 24/7.",
    highlights: [
      "Thiết kế iconic của Ray-Ban",
      "Tròng kính chống ánh sáng xanh",
      "Gọng acetate cao cấp siêu nhẹ",
      "Phù hợp m���i khuôn mặt",
      "Bảo hành trọn đời gọng kính",
    ],
    specifications: {
      "Thương hiệu": "Ray-Ban",
      Model: "RB5228",
      "Chất liệu gọng": "Acetate",
      "Màu gọng": "Đen Classic",
      "Kích thước": "53-18-145",
      "Chiều rộng gọng": "135mm",
      "Chiều cao gọng": "41mm",
      "Cầu mũi": "18mm",
      "Chân gọng": "145mm",
      "Trọng lượng": "28g",
      "Xuất xứ": "Italy",
      "Giới tính": "Unisex",
      "Hình dạng": "Vuông",
    },
    isNew: false,
    isOnSale: true,
    isBestseller: true,
    isPremium: true,
    variants: [
      {
        id: "1-1",
        name: "Đen Classic + Tròng Cơ Bản",
        price: 1500000,
        originalPrice: 1750000,
        stockStatus: "in-stock",
        stockCount: 15,
        color: { name: "Đen Classic", code: "#1a1a1a" },
        size: "53mm",
      },
      {
        id: "1-2",
        name: "Đen Classic + Tròng Chống Ánh Sáng Xanh",
        price: 1800000,
        originalPrice: 2100000,
        stockStatus: "in-stock",
        stockCount: 8,
        color: { name: "Đen Classic", code: "#1a1a1a" },
        size: "53mm",
        lensFeatures: ["Ch��ng ánh sáng xanh", "Chống phản quang"],
      },
      {
        id: "1-3",
        name: "Nâu Tortoise + Tròng Đa Tròng",
        price: 2200000,
        originalPrice: 2600000,
        stockStatus: "low-stock",
        stockCount: 3,
        color: { name: "Nâu Tortoise", code: "#8B4513" },
        size: "53mm",
        lensFeatures: ["Đa tròng", "Chống phản quang", "Chống trầy"],
      },
    ],
    availableColors: [
      { name: "��en Classic", code: "#1a1a1a" },
      { name: "Nâu Tortoise", code: "#8B4513" },
      { name: "Xanh Navy", code: "#1e3a8a" },
      { name: "Xám Smoke", code: "#6b7280" },
    ],
    availableSizes: ["51mm", "53mm", "55mm"],
    availableLensFeatures: [
      "Tròng cơ bản",
      "Chống ánh sáng xanh",
      "Đa tròng (Progressive)",
      "Chống phản quang",
      "Chống tr��y xước",
    ],
    careInstructions: [
      "Lau sạch bằng khăn microfiber",
      "Tránh để kính tiếp xúc với nhiệt độ cao",
      "Bảo qu���n trong hộp kính khi không sử dụng",
      "Kiểm tra định kỳ 6 tháng/lần tại cửa h��ng",
    ],
    warranty: "Bảo hành trọn đời gọng kính, 2 năm tròng kính",
    reviews: [
      {
        id: "r1",
        customerName: "Nguy��n Văn A",
        rating: 5,
        comment:
          "K��nh rất đẹp và chất lượng. Đeo rất thoải mái, không bị đau mũi. Tròng chống ���nh sáng xanh rất hiệu quả, mắt không còn bị mỏi khi làm việc với máy tính.",
        date: "2024-01-15",
        verified: true,
        helpful: 24,
        variant: "Đen Classic + Tròng Chống Ánh Sáng Xanh",
      },
      {
        id: "r2",
        customerName: "Trần Thị B",
        rating: 5,
        comment:
          "Thiết kế rất đẹp, phù hợp với khuôn mặt. Nhân viên tư vấn nhiệt tình. Giá hợp lý so với chất lượng.",
        date: "2024-01-10",
        verified: true,
        helpful: 18,
        variant: "Nâu Tortoise + Tròng Đa Tròng",
      },
      {
        id: "r3",
        customerName: "Lê Minh C",
        rating: 4,
        comment:
          "Kính đẹp, đeo thoải mái. Hộp đựng và phụ kiện ��ầy đủ. Chỉ có đi��u giao hàng hơi chậm.",
        date: "2024-01-05",
        verified: true,
        helpful: 12,
        variant: "Đen Classic + Tròng Cơ Bản",
      },
    ],
  };

  const relatedProducts = [
    {
      id: "2",
      name: "Kính Cận Modern Series MB2301",
      brand: "Mont Blanc",
      price: 2200000,
      originalPrice: 2800000,
      rating: 4.6,
      reviewCount: 89,
      image:
        "https://images.pexels.com/photos/8346914/pexels-photo-8346914.jpeg",
      isOnSale: true,
    },
    {
      id: "3",
      name: "Kính Cận Luxury Collection LX4402",
      brand: "Lindberg",
      price: 3500000,
      rating: 4.9,
      reviewCount: 156,
      image:
        "https://images.pexels.com/photos/5766609/pexels-photo-5766609.jpeg",
      isPremium: true,
    },
    {
      id: "4",
      name: "Kính Cận Sport Series SP1801",
      brand: "Oakley",
      price: 1800000,
      rating: 4.7,
      reviewCount: 203,
      image:
        "https://images.pexels.com/photos/3773478/pexels-photo-3773478.jpeg",
      isBestseller: true,
    },
  ];

  const storeLocations = [
    {
      name: "Chi nhánh Quận 1",
      address: "123 Nguyễn Huệ, Q.1",
      distance: "2.5km",
      phone: "028 1234 5678",
      availability: "Còn hàng",
    },
    {
      name: "Chi nhánh Qu���n 3",
      address: "456 Võ Văn T��n, Q.3",
      distance: "4.2km",
      phone: "028 2345 6789",
      availability: "Còn hàng",
    },
    {
      name: "Chi nhánh Thủ Đức",
      address: "789 V�� Văn Ngân, Thủ Đức",
      distance: "8.1km",
      phone: "028 3456 7890",
      availability: "Còn 2 chiếc",
    },
  ];

  const currentVariant = selectedVariant || product.variants[0];
  const currentPrice = currentVariant.price;
  const originalPrice = currentVariant.originalPrice;
  const discount = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Voucher Center integration
  const [availableCoupons, setAvailableCoupons] = useState<CouponCode[]>([]);
  const [voucherPrograms, setVoucherPrograms] = useState<VoucherProgram[]>(getAllVoucherProgramsForCurrentUser());
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    setAvailableCoupons(getClaimedCoupons());
    const onUpdated = () => setAvailableCoupons(getClaimedCoupons());
    window.addEventListener("claimed-coupons-updated", onUpdated as EventListener);
    window.addEventListener("storage", onUpdated as EventListener);
    return () => {
      window.removeEventListener("claimed-coupons-updated", onUpdated as EventListener);
      window.removeEventListener("storage", onUpdated as EventListener);
    };
  }, []);

  useEffect(() => {
    const refreshPrograms = () => setVoucherPrograms(getAllVoucherProgramsForCurrentUser());
    window.addEventListener("auth-changed", refreshPrograms as EventListener);
    window.addEventListener("storage", refreshPrograms as EventListener);
    return () => {
      window.removeEventListener("auth-changed", refreshPrograms as EventListener);
      window.removeEventListener("storage", refreshPrograms as EventListener);
    };
  }, []);

  const handleVoucherClick = () => {
    const u = getCurrentUser();
    if (!u) {
      if (typeof window !== "undefined") {
        const back = window.location.pathname + window.location.search;
        window.dispatchEvent(new CustomEvent("open-otp-login", { detail: { redirectTo: back, message: "Mời quý khách đăng nhập để nhận Voucher & Mua hàng v���i ưu đãi tốt nhất cho thành viên." } } as any));
      }
      return;
    }
    setShowVoucherModal(true);
  };


  const voucherCarouselRef = useRef<HTMLDivElement | null>(null);
  const scrollVoucher = (dir: number) => {
    const el = voucherCarouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.9, 200), behavior: "smooth" });
  };
  const handleClaimVoucherFromCarousel = (programId: string) => {
    const u = getCurrentUser();
    if (!u) {
      if (typeof window !== "undefined") {
        const back = window.location.pathname + window.location.search;
        window.dispatchEvent(new CustomEvent("open-otp-login", { detail: { redirectTo: back, message: "Mời quý khách đăng nhập để nh����n Voucher & Mua hàng với ưu đãi tốt nhất cho thành viên." } } as any));
      }
      return;
    }
    try {
      setClaimingId(programId);
      claimVoucher(programId);
    } catch (e) {
    } finally {
      setClaimingId(null);
    }
  };
  const copyVoucherCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {}
  };

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsVoucher, setTermsVoucher] = useState<{ id: string; title: string } | null>(null);
  const [expandedVoucherId, setExpandedVoucherId] = useState<string | null>(null);
  const openTerms = (id: string, title: string) => {
    setTermsVoucher({ id, title });
    setShowTermsModal(true);
  };
  const getVoucherTerms = (voucherId: string) => {
    return {
      generalTerms: [
        "Voucher chỉ áp d��ng cho khách hàng đã đăng ký tài khoản.",
        "Mỗi khách hàng chỉ được sử dụng mỗi voucher 1 lần duy nhất.",
        "Voucher không áp dụng đồng thời với các chương trình khuyến mãi khác.",
        "Voucher không có giá trị quy đổi thành tiền mặt.",
        "Voucher không áp dụng cho các sản phẩm giảm giá hoặc khuyến mãi đặc biệt.",
      ],
      usageConditions: [
        "Không áp dụng cho đơn hàng đã thanh toán trước đó.",
        "Phải xuất trình mã voucher trước khi thanh toán.",
        "Voucher chỉ có hiệu lực trong thời gian quy định.",
      ],
      validityPeriod: [
        "Thời gian hiệu lực: Từ ngày phát hành đến hết hạn ghi trên voucher.",
        "Voucher hết hạn sẽ không thể sử dụng dưới bất kỳ hoàn cảnh nào.",
        "Không gia hạn voucher sau khi hết hiệu lực.",
      ],
      otherTerms: [
        "Công ty có quyền từ chối sử dụng voucher nếu phát hiện có dấu hiệu gian lận.",
        "Công ty có quyền thay đổi điều kiện sử dụng voucher mà không cần thông báo trước.",
        "Mọi thắc mắc vui lòng liên hệ hotline: 1900-123-456.",
      ],
    };
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    setShowLoginFormModal(true);
  };

  const handlePhoneLogin = async () => {
    if (!loginPhone) {
      setLoginError("Vui lòng nhập số điện tho��i");
      return;
    }

    if (!validatePhoneNumber(loginPhone)) {
      setLoginError("Số điện thoại không hợp lệ");
      return;
    }

    setIsSendingOTP(true);
    setLoginError("");

    try {
      // Send OTP to phone number
      const result = await sendOTP(loginPhone);

      if (result.success) {
        setOtpMessage("OTP đã được gửi đến s����� điện thoại của bạn!");
        setDemoOTP(result.otp || "");
        setShowLoginFormModal(false);
        setShowOTPModal(true);
        setCountdown(60);
        setCanResendOTP(false);
      } else {
        setLoginError("Không thể gửi OTP. Vui lòng thử lại.");
      }
    } catch (error) {
      setLoginError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!loginOTP) {
      setLoginError("Vui lòng nhập mã OTP");
      return;
    }

    if (loginOTP.length !== 4) {
      setLoginError("Mã OTP phải có 4 ch�� số");
      return;
    }

    setIsVerifyingOTP(true);
    setLoginError("");

    try {
      // Verify OTP
      const verifyResult = await verifyOTP(loginPhone, loginOTP);

      if (!verifyResult.success) {
        setLoginError(verifyResult.message);
        return;
      }

      // Sau khi xác th��c, đăng nhập và chuy��n tới giỏ hàng
      await loginCustomer(loginPhone);
      setShowOTPModal(false);
      navigate("/cart");
    } catch (error) {
      setLoginError("C�� l��i xảy ra. Vui lòng thử lại.");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    setIsSendingOTP(true);
    setLoginError("");
    setOtpMessage("");

    try {
      const result = await sendOTP(loginPhone);

      if (result.success) {
        setOtpMessage("OTP mới đã được gửi!");
        setDemoOTP(result.otp || "");
        setCountdown(60);
        setCanResendOTP(false);
      } else {
        setLoginError("Không thể gửi OTP. Vui lòng thử lại.");
      }
    } catch (error) {
      setLoginError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    // Find variant with this color
    const variant = product.variants.find((v) => v.color?.name === colorName);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const CART_STORAGE_KEY = "cartItems";
  const addToCartLocal = () => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      const items = raw ? JSON.parse(raw) : [];
      const newItem = {
        id: `${Date.now()}`,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        price: currentVariant.price,
        originalPrice: currentVariant.originalPrice,
        quantity: 1,
        variant: {
          color: currentVariant.color?.name || "",
          size: currentVariant.size || "",
          lensType: Array.isArray(currentVariant.lensFeatures) ? currentVariant.lensFeatures.join(", ") : undefined,
        },
        isInStock: currentVariant.stockStatus !== "out-of-stock",
        maxQuantity: Math.max(currentVariant.stockCount || 5, 1),
        isPremium: product.isPremium,
      };
      items.push(newItem);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {}
  };

  const handleAddToCart = () => {
    const user = getCurrentUser();
    if (!user) {
      window.dispatchEvent(new CustomEvent("open-otp-login", { detail: { redirectTo: window.location.pathname + window.location.search, message: "Mời quý khách đăng nhập để mua hàng với ưu đãi tốt nhất cho thành viên" } } as any));
      return;
    }
    addToCartLocal();
  };

  const handleBuyNow = () => {
    const user = getCurrentUser();
    if (!user) {
      window.dispatchEvent(new CustomEvent("open-otp-login", { detail: { redirectTo: window.location.pathname + window.location.search, message: "Mời quý khách đăng nhập để mua hàng với ưu đãi tốt nhất cho thành viên" } } as any));
      return;
    }
    addToCartLocal();
    navigate("/cart");
  };

  const filteredReviews =
    selectedReviewFilter === "all"
      ? product.reviews
      : product.reviews.filter(
          (r) => r.rating === parseInt(selectedReviewFilter),
        );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumb */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center space-x-2 text-xs sm:text-sm overflow-hidden">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 flex-shrink-0"
            >
              Trang chủ
            </Link>
            <span className="text-gray-300 flex-shrink-0">/</span>
            <Link
              to="/products"
              className="text-gray-500 hover:text-gray-700 flex-shrink-0"
            >
              Sản phẩm
            </Link>
            <span className="text-gray-300 flex-shrink-0">/</span>
            <Link
              to={`/products?category=${product.category}`}
              className="text-gray-500 hover:text-gray-700 flex-shrink-0"
            >
              {product.category}
            </Link>
            <span className="text-gray-300 flex-shrink-0">/</span>
            <span className="text-gray-900 font-medium truncate min-w-0">
              {product.name}
            </span>
          </div>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            {/* Product Images */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => setShowImageZoom(true)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-blue-500 ring-2 ring-blue-500/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Policies and Commitments - Will be moved below "Cần t���� vấn thêm?" on mobile */}
              <div className="hidden lg:block space-y-4" id="warranty-cards">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 4px 10px rgba(224, 232, 239, 0.4)' }}>
                  {/* Title */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 p-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#1C8C64] rounded-full flex items-center justify-center mr-3">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-base lg:text-lg font-bold text-[#1C8C64] tracking-wide">
                        CAM KẾT SẢN PHẨM
                      </span>
                    </div>
                  </div>

                  {/* Accordion Commitments */}
                  <Accordion type="single" collapsible className="w-full" value={expandedAccordion} onValueChange={setExpandedAccordion}>
                    {/* Item 1: Bảo hành 30 ngày */}
                    <AccordionItem value="warranty-30" className="border-b border-gray-200">
                      <AccordionTrigger className="px-4 lg:px-6 py-4 lg:py-5 hover:bg-green-50/50 transition-colors">
                        <div className="flex items-start space-x-3 text-left">
                          <div className="w-6 h-6 bg-[#1C8C64] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <RefreshCw className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm lg:text-base text-gray-800 leading-relaxed">
                              <span className="font-semibold">Bảo hành 30 ngày</span> – Thay đổi độ kính
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 lg:px-6 py-0 text-sm lg:text-base text-gray-700 leading-relaxed">
                        <div className="flex items-start space-x-3 ml-9">
                          <span className="text-[#1C8C64] font-medium">Miễn Phí</span>
                          <span>Thay đổi độ kính hoàn toàn miễn phí trong vòng 30 ngày từ ngày mua</span>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Item 2: Bảo hành 1 năm */}
                    <AccordionItem value="warranty-1year" className="border-b border-gray-200">
                      <AccordionTrigger className="px-4 lg:px-6 py-4 lg:py-5 hover:bg-green-50/50 transition-colors">
                        <div className="flex items-start space-x-3 text-left">
                          <div className="w-6 h-6 bg-[#1C8C64] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Shield className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm lg:text-base text-gray-800 leading-relaxed">
                              <span className="font-semibold">Bảo hành 1 năm</span> – Lỗi kỹ thuật
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 lg:px-6 py-0 text-sm lg:text-base text-gray-700 leading-relaxed">
                        <div className="flex items-start space-x-3 ml-9">
                          <span>Bảo hành toàn bộ lỗi kỹ thuật, lớp vàng phủ, khuyết tật sản xuất trong 1 năm từ ngày mua</span>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Item 3: Minh bạch sản phẩm */}
                    <AccordionItem value="transparency" className="border-b border-gray-200">
                      <AccordionTrigger className="px-4 lg:px-6 py-4 lg:py-5 hover:bg-green-50/50 transition-colors">
                        <div className="flex items-start space-x-3 text-left">
                          <div className="w-6 h-6 bg-[#1C8C64] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm lg:text-base text-gray-800 leading-relaxed">
                              <span className="font-semibold">Minh bạch sản phẩm</span> – Trả vỏ
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 lg:px-6 py-0 text-sm lg:text-base text-gray-700 leading-relaxed">
                        <div className="flex items-start space-x-3 ml-9">
                          <span>Trả vỏ bao sau khi cắt, kiểm tra Logo nếu có để đảm bảo sản phẩm chính hãng và chất lượng tốt nhất</span>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Item 4: Miễn phí dịch vụ */}
                    <AccordionItem value="free-service" className="border-b-0">
                      <AccordionTrigger className="px-4 lg:px-6 py-4 lg:py-5 hover:bg-green-50/50 transition-colors">
                        <div className="flex items-start space-x-3 text-left">
                          <div className="w-6 h-6 bg-[#1C8C64] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Gift className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm lg:text-base text-gray-800 leading-relaxed">
                              <span className="font-semibold">Miễn phí</span> – Dịch vụ tư vấn
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 lg:px-6 py-0 text-sm lg:text-base text-gray-700 leading-relaxed">
                        <div className="flex items-start space-x-3 ml-9 pb-4">
                          <span>Kiểm tra thị lực, tư vấn chọn kính phù hợp & hướng dẫn lắp kính chuyên nghiệp hoàn toàn miễn phí</span>
                        </div>
                        {expandedAccordion === "free-service" && (
                          <div className="mt-4 pt-4 border-t border-gray-300">
                            <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors py-3">
                              Xem thêm!
                            </button>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">
                        Sản phẩm chính hãng
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">
                        Giao hàng toàn quốc
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">
                        Miễn ph�� sửa chữa
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              {/* Product Title */}
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price Section - New Layout */}
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 relative" style={{backgroundColor: 'rgba(250, 250, 250, 1)', border: '1px solid rgba(111, 124, 95, 1)'}}>
                <div className="grid grid-cols-2 gap-0 relative">
                  {/* Left Section - Product Price */}
                  <div className="pr-6 sm:pr-10">
                    <div className="text-xl text-green-900 font-medium mb-2" style={{color: 'rgba(65, 117, 5, 1)'}}>
                      Giá sản phẩm
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {currentPrice.toLocaleString().replace(/,/g, ".")}đ
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-500 line-through">
                        {originalPrice &&
                          originalPrice.toLocaleString().replace(/,/g, ".")}
                        đ
                      </span>
                      {originalPrice && originalPrice > currentPrice && (
                        <span className="text-sm font-bold text-red-500">
                          -{Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="bg-yellow-100 px-3 py-1 rounded-full inline-flex items-center">
                      <span className="text-yellow-600 text-xs sm:text-sm mr-1">⭐</span>
                      <span className="text-xs sm:text-sm text-yellow-700 font-bold">
                        {(currentPrice * 0.02).toLocaleString().replace(/,/g, ".")} điểm
                      </span>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-300 transform -translate-x-1/2"></div>

                  {/* Divider Label "hoặc" */}
                  <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 px-3 py-1">
                    <span className="text-gray-400 text-sm font-medium">hoặc</span>
                  </div>

                  {/* Right Section - Trade-in Price */}
                  <div className="pl-6 sm:pl-10">
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="w-full text-left cursor-pointer group hover:opacity-80 transition-opacity block"
                    >
                      <div className="text-xl text-green-900 font-medium mb-2" style={{color: 'rgba(65, 117, 5, 1)'}}>
                        Thu cũ đổi mới
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        {((originalPrice || currentPrice) * 0.3)
                          .toLocaleString()
                          .replace(/,/g, ".")}
                        đ
                      </div>
                      <div className="text-sm text-red-500 font-medium">
                        Trợ giá đến 500.000
                      </div>
                      <div className="text-sm text-blue-600 font-medium cursor-pointer pt-2.5">
                        Nhận tư vấn ngay
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Options */}
              <div className="space-y-4 sm:space-y-6">
                {/* Color Selection */}
                <div>
                  <div className="space-y-3">
                    <label className="text-base sm:text-lg font-semibold flex items-center">
                      <Palette className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Màu sắc:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.availableColors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => handleColorSelect(color.name)}
                          className={`px-3 py-2 rounded-lg border-2 font-medium transition-all text-sm min-h-[44px] ${
                            (selectedColor || currentVariant.color?.name) ===
                            color.name
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-gray-300 hover:border-gray-400 text-gray-700"
                          }`}
                        >
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Size Information */}
                <div>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="text-base sm:text-lg font-semibold flex items-center">
                          <Ruler className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Size kính:
                        </label>
                        <div className="flex gap-2">
                          {["S", "M", "L"].map((size) => (
                            <button
                              key={size}
                              className={`px-3 py-2 rounded-lg border-2 font-medium transition-all text-sm min-h-[40px] ${
                                size === "M"
                                  ? "border-blue-500 bg-blue-50 text-blue-600"
                                  : "border-gray-300 hover:border-gray-400 text-gray-700"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => setShowSizeGuide(true)}
                        className="text-blue-600 text-sm hover:underline flex items-center self-start sm:self-auto min-h-[44px]"
                      >
                        <HelpCircle className="w-4 h-4 mr-1" />
                        H��ớng dẫn chọn size kính
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Refined Layout */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Main Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddToCart}
                        variant="outline"
                        className="w-12 h-12 sm:w-14 sm:h-12 border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"
                        disabled={currentVariant.stockStatus === "out-of-stock"}
                      >
                        <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                      </Button>
                      <Button
                        onClick={handleBuyNow}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white h-12 rounded-lg font-semibold text-sm sm:text-base"
                        disabled={currentVariant.stockStatus === "out-of-stock"}
                      >
                        MUA NGAY
                      </Button>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full sm:flex-1 border-2 border-red-500 text-red-500 hover:bg-red-50 h-12 rounded-lg font-semibold text-sm sm:text-base"
                    >
                      <Link to="/contact">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">
                          TÌM CỬA HÀNG GẦN NHẤT
                        </span>
                        <span className="sm:hidden">TÌM CỬA HÀNG</span>
                      </Link>
                    </Button>
                  </div>

                  {/* Advisory Section */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm font-medium text-green-700">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                        <span>T�� vấn, đặt lịch & ưu đãi</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Số đi��n thoại của bạn"
                          className="flex-1 px-3 py-2 h-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 h-10"
                        >
                          GỬI
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voucher Carousel Section */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <h3 className="text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap flex-shrink-0">
                  Mã giảm giá
                </h3>
                <div className="flex gap-2 sm:gap-3">
                  <TooltipProvider delayDuration={200}>
                    {voucherPrograms.map((program) => {
                      const claimed = availableCoupons.find((c) => c.programId === program.id);
                      const parsed = parseDiscountFromTitle(program.title);
                      const isClaiming = claimingId === program.id;

                      return (
                        <Tooltip key={program.id}>
                          <TooltipTrigger asChild>
                            <button
                              className="flex-shrink-0 px-4 py-2 rounded-lg border-2 border-orange-300 bg-orange-50 hover:bg-orange-100 transition-all min-w-max cursor-pointer"
                            >
                              <div className="text-sm sm:text-base font-bold text-orange-600">
                                Giảm {parsed.discount}
                                {parsed.type === "percentage" ? "%" : "K"}
                              </div>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white border border-gray-200 shadow-lg p-3 sm:p-4 rounded-lg max-w-xs">
                            <div className="space-y-2 text-sm">
                              <div>
                                <p className="text-gray-700 font-medium">{program.programName}</p>
                              </div>
                              <Button
                                onClick={() => handleClaimVoucherFromCarousel(program.id)}
                                disabled={isClaiming || !!claimed}
                                size="sm"
                                className="w-full h-8 bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs sm:text-sm"
                              >
                                {isClaiming ? "Đang lấy..." : claimed ? "Đã lấy" : "Lấy"}
                              </Button>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                </div>
              </div>

              {/* Promotional Blocks */}
              <div className="space-y-3 sm:space-y-4">
                {/* Main Promotions */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-50 to-red-50 px-3 sm:px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                        <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-red-600 text-base sm:text-lg lg:text-xl">
                        ƯU ĐÃI TÂM ĐỨC
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white p-3 sm:p-4 space-y-3">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                          Nhận báo giá tốt nhất cho kh��ch hàng doanh nghiệp B2B
                          khi mua số lượng lớn{" "}
                          <span className="text-green-600 font-semibold">
                            (Khám phá ngay)
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                          Giảm thêm tới 200,000 cho TÂM ĐỨC Edu: Học sinh, Sinh
                          viên, Giáo viên{" "}
                          <span className="text-green-600 font-semibold">
                            (Xác thực ngay)
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                          Giảm thêm tới 104,000 cho TÂM ĐỨC Members{" "}
                          <span className="text-green-600 font-semibold">
                            (Kiểm tra ngay giá cuối của bạn)
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Warranty Cards - Compact design */}
              <div className="lg:hidden space-y-3" id="warranty-cards-mobile">
                {/* Warranty Section */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 4px 10px rgba(224, 232, 239, 0.4)' }}>
                  {/* Title */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 p-3">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-[#1C8C64] rounded-full flex items-center justify-center mr-2">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold text-[#1C8C64] tracking-wide">
                        CAM K��T SẢN PHẨM
                      </span>
                    </div>
                  </div>

                  {/* Commitments List - Mobile compact */}
                  <div className="space-y-3 p-4">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-[#1C8C64] rounded-full flex items-center justify-center flex-shrink-0">
                        <RefreshCw className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-800 leading-relaxed">
                          <span className="font-semibold">Bảo hành 30 ngày</span> – Thay đổi độ kính <span className="text-[#1C8C64] font-medium">Miễn Phí</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-[#1C8C64] rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-800 leading-relaxed">
                          <span className="font-semibold">Bảo hành 1 năm</span> – Lỗi kỹ thuật lớp vàng phủ
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-[#1C8C64] rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-800 leading-relaxed">
                          <span className="font-semibold">Minh bạch sản phẩm</span> – Trả vỏ bao sau khi cắt, kiểm tra Logo nếu có
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-[#1C8C64] rounded-full flex items-center justify-center flex-shrink-0">
                        <Gift className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-800 leading-relaxed">
                          <span className="font-semibold">Miễn phí</span> – Kiểm tra thị lực, tư vấn chọn kính & mắt lắp kính
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services Section */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">
                        Chính hãng
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">
                        Toàn quốc
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">
                        Miễn phí
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-auto p-2 bg-gray-100 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
              <TabsTrigger
                value="description"
                className="py-3 sm:py-4 text-xs sm:text-sm font-medium flex-col sm:flex-row gap-1 sm:gap-2 min-h-[60px] sm:min-h-auto data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-200 rounded-lg transition-all duration-200"
              >
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="leading-tight">Mô tả</span>
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="py-3 sm:py-4 text-xs sm:text-sm font-medium flex-col sm:flex-row gap-1 sm:gap-2 min-h-[60px] sm:min-h-auto data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-200 rounded-lg transition-all duration-200"
              >
                <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="leading-tight">Thông số</span>
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="py-3 sm:py-4 text-xs sm:text-sm font-medium flex-col sm:flex-row gap-1 sm:gap-2 min-h-[60px] sm:min-h-auto data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-200 rounded-lg transition-all duration-200"
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="leading-tight text-center">
                  <span className="block sm:inline">đánh giá</span>
                  <span className="block sm:inline sm:ml-1">
                    ({product.reviewCount})
                  </span>
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="stores"
                className="py-3 sm:py-4 text-xs sm:text-sm font-medium flex-col sm:flex-row gap-1 sm:gap-2 min-h-[60px] sm:min-h-auto data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-200 rounded-lg transition-all duration-200"
              >
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="leading-tight">Cửa hàng</span>
              </TabsTrigger>
              <TabsTrigger
                value="care"
                className="py-3 sm:py-4 text-xs sm:text-sm font-medium flex-col sm:flex-row gap-1 sm:gap-2 min-h-[60px] sm:min-h-auto data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-200 rounded-lg transition-all duration-200"
              >
                <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="leading-tight">Bảo quản</span>
              </TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="prose max-w-none">
                    <h3 className="text-2xl font-bold mb-6">
                      Giới thiệu sản phẩm
                    </h3>
                    <div className="mb-6">
                      <p className={`text-gray-600 text-lg leading-relaxed transition-all duration-300 ${
                        expandDescription ? '' : 'line-clamp-3'
                      }`}>
                        {product.description}
                      </p>

                      {/* Show More/Less Button */}
                      {product.description.split(' ').length > 30 && (
                        <button
                          onClick={() => setExpandDescription(!expandDescription)}
                          className="mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center space-x-1 transition-colors hover:underline"
                        >
                          <span>{expandDescription ? 'Thu g���n' : 'Xem thêm'}</span>
                          {expandDescription ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    <h4 className="text-xl font-semibold mb-4">Điểm nổi bật</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {product.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    <h4 className="text-xl font-semibold mb-4">Tính năng</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {product.features.map((feature, index) => (
                        <div
                          key={index}
                          className="bg-blue-50 p-4 rounded-lg text-center"
                        >
                          <Sparkles className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <span className="text-sm font-medium text-blue-800">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specifications" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Thông số kỹ thuật</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-3 border-b border-gray-100"
                        >
                          <span className="font-medium text-gray-600">
                            {key}:
                          </span>
                          <span className="text-gray-900">{value}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  {/* Review Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-blue-600 mb-2">
                        {product.rating}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-gray-600">
                        {product.reviewCount} đánh giá
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center space-x-2">
                          <span className="text-sm w-8">{star}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${star === 5 ? 85 : star === 4 ? 10 : 5}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">
                            {star === 5 ? 85 : star === 4 ? 10 : 5}%
                          </span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">L���c đánh giá</h4>
                      <Select
                        value={selectedReviewFilter}
                        onValueChange={setSelectedReviewFilter}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">T���t cả</SelectItem>
                          <SelectItem value="5">5 sao</SelectItem>
                          <SelectItem value="4">4 sao</SelectItem>
                          <SelectItem value="3">3 sao</SelectItem>
                          <SelectItem value="2">2 sao</SelectItem>
                          <SelectItem value="1">1 sao</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {filteredReviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-6"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold">
                                {review.customerName}
                              </span>
                              {review.verified && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Đã mua hàng
                                </Badge>
                              )}
                              <span className="text-gray-500 text-sm">
                                {review.date}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.variant && (
                                <span className="text-sm text-gray-500">
                                  • {review.variant}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 mb-3">
                              {review.comment}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <button className="flex items-center space-x-1 hover:text-blue-600">
                                <ThumbsUp className="w-4 h-4" />
                                <span>Hữu ích ({review.helpful})</span>
                              </button>
                              <button className="hover:text-blue-600">
                                Trả lời
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Write Review Button */}
                  <div className="mt-8 text-center">
                    <Button size="lg" variant="outline">
                      <Star className="w-5 h-5 mr-2" />
                      Viết đánh giá
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stores Tab */}
            <TabsContent value="stores" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    Cửa hàng có sẵn sản phẩm
                  </h3>
                  <div className="space-y-4">
                    {storeLocations.map((store, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-base sm:text-lg mb-2">
                              {store.name}
                            </h4>
                            <div className="space-y-1 text-gray-600 text-sm sm:text-base">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="flex-1">{store.address}</span>
                                <span className="ml-2 text-xs sm:text-sm">
                                  ({store.distance})
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span>{store.phone}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:text-right">
                            <Badge
                              className={`mb-2 self-start sm:self-end ${
                                store.availability === "Còn hàng"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {store.availability}
                            </Badge>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 sm:flex-none"
                              >
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">
                                  Xem bản đồ
                                </span>
                                <span className="sm:hidden">B��n đồ</span>
                              </Button>
                              <Button size="sm" className="flex-1 sm:flex-none">
                                <Phone className="w-4 h-4 mr-1" />
                                Gọi ngay
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Care Tab */}
            <TabsContent value="care" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-6">
                        Hướng dẫn bảo quản
                      </h3>
                      <div className="space-y-4">
                        {product.careInstructions.map((instruction, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{instruction}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold mb-4">
                        Chính sách bảo hành
                      </h4>
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="flex items-center mb-3">
                          <Shield className="w-6 h-6 text-blue-600 mr-2" />
                          <span className="font-semibold text-blue-800">
                            Cam kết chất lượng
                          </span>
                        </div>
                        <p className="text-blue-700">{product.warranty}</p>
                      </div>

                      <div className="mt-6 space-y-3">
                        <div className="flex items-center space-x-3">
                          <Award className="w-5 h-5 text-yellow-500" />
                          <span className="text-gray-700">
                            Sản phẩm chính hãng 100%
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Truck className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">
                            Giao hàng toàn quốc
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-5 h-5 text-purple-500" />
                          <span className="text-gray-700">
                            Thanh toán đa dạng
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Certificates Gallery */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Giấy Chứng Nhận
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tâm ��ức tự hào là đ���i lý ủy quyền chính thức với đầy đủ giấy chứng
              nhận
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 sm:space-x-6 pb-4">
                {[
                  {
                    img: "https://images.pexels.com/photos/7567538/pexels-photo-7567538.jpeg",
                    title: "Giấy phép kinh doanh",
                    desc: "Đăng ký kinh doanh hợp pháp",
                  },
                  {
                    img: "https://images.pexels.com/photos/7567528/pexels-photo-7567528.jpeg",
                    title: "Chứng nhận đại lý",
                    desc: "Đại lý ủy quyền chính thức",
                  },
                  {
                    img: "https://images.pexels.com/photos/7567539/pexels-photo-7567539.jpeg",
                    title: "Chứng nhận ISO",
                    desc: "ISO 9001:2015 chất lượng",
                  },
                  {
                    img: "https://images.pexels.com/photos/7567540/pexels-photo-7567540.jpeg",
                    title: "Gi��y phép hành nghề",
                    desc: "Hành nghề mắt kính hợp pháp",
                  },
                  {
                    img: "https://images.pexels.com/photos/7567541/pexels-photo-7567541.jpeg",
                    title: "Chứng nhận an toàn",
                    desc: "Đảm bảo an toàn s���n phẩm",
                  },
                  {
                    img: "https://images.pexels.com/photos/7567542/pexels-photo-7567542.jpeg",
                    title: "Bảo hiểm trách nhiệm",
                    desc: "Bảo hiểm sản phẩm 100%",
                  },
                ].map((cert, index) => (
                  <div key={index} className="flex-shrink-0 w-64 sm:w-80 group">
                    <div className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden">
                      <div className="aspect-[4/5] overflow-hidden">
                        <img
                          src={cert.img}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1">
                          {cert.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {cert.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            <button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Related Products Carousel */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Sản phẩm tương tự
            </h2>
            <Link
              to="/products"
              className="text-blue-600 hover:underline flex items-center"
            >
              Xem tất cả
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Mobile: 2 products, Tablet: 3 products, Desktop: 4 products */}
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 pb-4">
                {relatedProducts
                  .concat(relatedProducts)
                  .map((relatedProduct, index) => (
                    <Card
                      key={`${relatedProduct.id}-${index}`}
                      className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
                    >
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 space-y-1">
                          {relatedProduct.isOnSale && (
                            <Badge className="bg-red-500 text-white text-xs">
                              <FlameKindling className="w-2 h-2 mr-1" />
                              Sale
                            </Badge>
                          )}
                          {relatedProduct.isPremium && (
                            <Badge className="bg-purple-500 text-white text-xs">
                              <Crown className="w-2 h-2 mr-1" />
                              Premium
                            </Badge>
                          )}
                          {relatedProduct.isBestseller && (
                            <Badge className="bg-yellow-500 text-white text-xs">
                              Bán chạy
                            </Badge>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/80 backdrop-blur-sm w-8 h-8 p-0"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-3 sm:p-4">
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <div className="text-blue-600 font-semibold text-xs sm:text-sm">
                              {relatedProduct.brand}
                            </div>
                            <h3 className="font-bold text-sm sm:text-base group-hover:text-blue-600 transition-colors line-clamp-2">
                              {relatedProduct.name}
                            </h3>
                          </div>

                          <div className="flex items-center space-x-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                    i < Math.floor(relatedProduct.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">
                              ({relatedProduct.reviewCount})
                            </span>
                          </div>

                          <div className="flex flex-col space-y-1">
                            <span className="text-base sm:text-lg font-bold text-blue-600">
                              {relatedProduct.price.toLocaleString()}đ
                            </span>
                            {relatedProduct.originalPrice && (
                              <span className="text-xs text-gray-500 line-through">
                                {relatedProduct.originalPrice.toLocaleString()}đ
                              </span>
                            )}
                          </div>

                          <div className="flex space-x-1 pt-1">
                            <Button
                              size="sm"
                              className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                            >
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">
                                Thêm vào giỏ
                              </span>
                              <span className="sm:hidden">Thêm</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 sm:w-9 sm:h-9 p-0"
                            >
                              <Heart className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            {/* Scroll indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Zoom Modal */}
      {showImageZoom && (
        <Dialog open={showImageZoom} onOpenChange={setShowImageZoom}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{product.name}</DialogTitle>
              <DialogDescription>Hình ảnh chi tiết sản phẩm</DialogDescription>
            </DialogHeader>
            <div className="relative">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-auto rounded-lg"
              />
              <div className="flex justify-center space-x-2 mt-4">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      selectedImageIndex === index
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <Dialog open={showSizeGuide} onOpenChange={setShowSizeGuide}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#0F3057] flex items-center">
                <Glasses className="w-6 h-6 mr-2" />
                Hướng dẫn chọn size kính phù hợp
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Cách đo chính xác và chọn kích thước kính hoàn hảo cho khuôn mặt của bạn
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-8">
              {/* Step 1: Understanding Frame Dimensions */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-[#0F3057] mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Bước 1: Hiểu các thông số kích thước kính
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        A
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Chiều r�����ng tròng kính (Eye Size)</h4>
                        <p className="text-sm text-gray-600">Đường kính ngang của một tròng kính, thường từ 40-60mm</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        B
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Cầu mũi (Bridge Width)</h4>
                        <p className="text-sm text-gray-600">Khoảng cách giữa hai tròng kính, thường từ 14-24mm</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        C
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Chiều dài càng kính (Temple Length)</h4>
                        <p className="text-sm text-gray-600">Độ dài t��� khớp nối đến đầu tai, thường từ 120-150mm</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center text-gray-500 py-8">
                      <Glasses className="w-16 h-16 mx-auto mb-2" />
                      <p className="text-sm">Sơ đồ minh họa thông số kính</p>
                      <p className="text-xs mt-1">[A] - [B] - [C]</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Measuring Your Face */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-[#0F3057] mb-4 flex items-center">
                  <Ruler className="w-5 h-5 mr-2" />
                  Bước 2: Cách đo khuôn mặt chính xác
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Dụng c��� cần thiết:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Thước kẻ mịn (mm) hoặc thước dây</li>
                        <li>• Gương lớn</li>
                        <li>• Kính cũ (nếu có) để tham khảo</li>
                        <li>• Bút và gi��y ghi chép</li>
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Lưu ý quan trọng:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• ��o trong điều ki���n ánh sáng t��t</li>
                        <li>• Giữ đầu thẳng, nhìn về phía trước</li>
                        <li>• Đo ít nhất 2-3 lần đ�� đảm bảo chính xác</li>
                        <li>• Nhờ người khác hỗ trợ nếu có thể</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Các bước đo:</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                          <div className="text-sm">
                            <strong>Chiều rộng mặt:</strong> Đo từ thái dương trái đến thái dương phải
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                          <div className="text-sm">
                            <strong>Khoảng cách mắt:</strong> Đo từ giữa con ngươi mắt trái đến gi���a con ngươi mắt phải
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                          <div className="text-sm">
                            <strong>Chiều rộng mũi:</strong> Đo ph��n hẹp nhất của sống mũi
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">4</span>
                          <div className="text-sm">
                            <strong>Khoảng cách tai:</strong> Đo từ kh��e mắt ngoài đến tai
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Size Recommendations */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-[#0F3057] mb-4 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Bước 3: Chọn size phù hợp theo khuôn mặt
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-lg border border-purple-200 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">Khuôn mặt nhỏ</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Eye Size:</strong> 46-50mm</p>
                      <p><strong>Bridge:</strong> 16-18mm</p>
                      <p><strong>Temple:</strong> 130-135mm</p>
                    </div>
                    <div className="mt-3 text-xs text-gray-600">
                      Chiều r��ng mặt: &lt; 125mm
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg border-2 border-purple-500 text-center relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs">Phổ biến nhất</span>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">Khuôn mặt trung bình</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Eye Size:</strong> 50-54mm</p>
                      <p><strong>Bridge:</strong> 18-20mm</p>
                      <p><strong>Temple:</strong> 135-145mm</p>
                    </div>
                    <div className="mt-3 text-xs text-gray-600">
                      Chiều rộng mặt: 125-140mm
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-purple-200 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">Khuôn mặt lớn</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Eye Size:</strong> 54-58mm</p>
                      <p><strong>Bridge:</strong> 20-24mm</p>
                      <p><strong>Temple:</strong> 145-150mm</p>
                    </div>
                    <div className="mt-3 text-xs text-gray-600">
                      Chiều rộng mặt: &gt; 140mm
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Face Shape Guide */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                <h3 className="text-lg font-semibold text-[#0F3057] mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Bước 4: Chọn gọng theo dáng khuôn mặt
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-center mb-2">Mặt tròn</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Nên chọn:</strong> Gọng vuông, chữ nhật</p>
                      <p><strong>Tránh:</strong> Gọng tròn, oval nhỏ</p>
                      <p><strong>Mục tiêu:</strong> Tạo góc cạnh</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-center mb-2">Mặt vuông</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Nên chọn:</strong> Gọng tròn, oval</p>
                      <p><strong>Tránh:</strong> Gọng vuông lớn</p>
                      <p><strong>Mục tiêu:</strong> Làm mềm đường nét</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-center mb-2">Mặt oval</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Nên ch���n:</strong> Hầu hết các dáng</p>
                      <p><strong>Tr���nh:</strong> Gọng quá lớn/nhỏ</p>
                      <p><strong>Mục tiêu:</strong> Giữ cân bằng</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-center mb-2">Mặt tim</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Nên chọn:</strong> Gọng dưới rim, oval</p>
                      <p><strong>Tránh:</strong> Gọng trên quá nổi bật</p>
                      <p><strong>M���c tiêu:</strong> Cân bằng trán rộng</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips and Notes */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-[#0F3057] mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Mẹo và lưu ý quan trọng
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">💡 Mẹo chọn kính:</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>��� Gọng không nên rộng hơn khuôn mặt</li>
                      <li>�� Đường viền trên gọng nên thẳng hàng với lông mày</li>
                      <li>• Tâm của tròng kính nên thẳng hàng với con ngươi</li>
                      <li>• Kính không được để lại vết đỏ trên mũi và tai</li>
                      <li>• Có thể điều chỉnh cầu mũi và càng kính tại cửa hàng</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">⚠️ Dấu hiệu kính không v��a:</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Kính trượt xuống mũi liên tục</li>
                      <li>• Để lại vết đỏ trên mũi hoặc tai</li>
                      <li>���� Gây đau đầu khi đeo lâu</li>
                      <li>• Kính quá chật hoặc quá lỏng</li>
                      <li>• T��m nhìn bị giới hạn do gọng</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-[#0F3057] to-[#1C8C64] p-6 rounded-xl text-white text-center">
                <h3 className="text-xl font-bold mb-2">Cần tư vấn thêm?</h3>
                <p className="mb-4 opacity-90">Đội ngũ chuyên viên của chúng tôi sẵn sàng hỗ trợ bạn chọn kính phù hợp nhất</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    className="bg-white text-[#0F3057] hover:bg-gray-100 font-semibold"
                    onClick={() => setShowSizeGuide(false)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Gọi tư vấn: 1900 1234
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-[#0F3057]"
                    onClick={() => setShowSizeGuide(false)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Đặt lịch thử kính
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Member Signup Modal */}
      {showMemberModal && (
        <Dialog open={showMemberModal} onOpenChange={setShowMemberModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Đăng ký thành viên Tâm Đức</DialogTitle>
              <DialogDescription>
                Đăng ký ngay để nhận giá ưu đãi member và điểm thưởng
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="member-name">Họ và tên *</Label>
                <Input id="member-name" placeholder="Nhập họ và tên của bạn" />
              </div>
              <div>
                <Label htmlFor="member-phone">Số điện thoại *</Label>
                <Input id="member-phone" placeholder="Nhập số điện thoại" />
              </div>
              <div>
                <Label htmlFor="member-email">Email</Label>
                <Input
                  id="member-email"
                  type="email"
                  placeholder="Nhập email (không bắt buộc)"
                />
              </div>
              <div className="bg-teal-50 p-3 rounded-lg">
                <h4 className="font-semibold text-teal-800 mb-2">
                  Ưu đãi thành viên:
                </h4>
                <ul className="text-sm text-teal-700 space-y-1">
                  <li>���� Giảm 10% tất cả sản phẩm</li>
                  <li>• Tích điểm mỗi giao dịch</li>
                  <li>• Ưu tiên dịch vụ và tư vấn</li>
                  <li>• Nh���n thông báo khuyến mãi sớm nhất</li>
                </ul>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowMemberModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Để sau
                </Button>
                <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
                  Đăng ký ngay
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Trade-in Modal */}
      {showTradeInModal && (
        <Dialog open={showTradeInModal} onOpenChange={setShowTradeInModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Chương trình Thu cũ đổi mới</DialogTitle>
              <DialogDescription>
                Để l��i thông tin để nhận ưu đãi thu cũ đổi mới tốt nhất
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="trade-name">Họ và tên *</Label>
                <Input id="trade-name" placeholder="Nhập họ và tên của bạn" />
              </div>
              <div>
                <Label htmlFor="trade-phone">Số điện thoại *</Label>
                <Input id="trade-phone" placeholder="Nhập số điện thoại" />
              </div>
              <div>
                <Label htmlFor="trade-product">Sản phẩm hiện tại</Label>
                <Input
                  id="trade-product"
                  placeholder="VD: Ray-Ban RB2140 (không bắt buộc)"
                />
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">
                  Thu cũ đổi mới:
                </h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Định giá miễn phí tại cửa hàng</li>
                  <li>• Thu với giá cao nhất thị trường</li>
                  <li>• Trừ trực tiếp vào giá sản phẩm mới</li>
                  <li>• Quy trình nhanh ch��ng, minh bạch</li>
                </ul>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowTradeInModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Để sau
                </Button>
                <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                  Nhận tư vấn
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Voucher Modal */}
      <Dialog open={showVoucherModal} onOpenChange={setShowVoucherModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Tag className="w-5 h-5 mr-2 text-red-600" />
              M�� Giảm Giá Của Chúng Tôi
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {voucherPrograms.map((p) => {
              const claimed = availableCoupons.find((c) => c.programId === p.id) ||
                availableCoupons.find((c) => !c.programId && c.description === p.programName && c.minOrder === p.minOrder);
              const parsed = parseDiscountFromTitle(p.title);
              return (
                <div
                  key={p.id}
                  className="border border-gray-200 rounded-lg p-3 hover:border-red-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Percent className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{p.programName}</h4>
                        <p className="text-xs text-gray-600">{p.title}</p>
                        <p className="text-xs text-gray-500">
                          {p.minOrder ? `Đơn tối thiểu ${p.minOrder.toLocaleString()}đ` : "Không yêu cầu tối thiểu"}
                          {parsed.type === "percentage" && parsed.maxDiscount ? ` • Tối đa ${parsed.maxDiscount.toLocaleString()}đ` : ""}
                        </p>
                        {claimed && (
                          <span className="inline-block text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded mt-1">
                            Đã lấy • {claimed.code}{claimed.validUntil ? ` ��� HSD ${claimed.validUntil}` : ""}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Info className="w-4 h-4" />
                      </button>
                      <Button
                        onClick={() => {
                          if (claimed) return;
                          const u = getCurrentUser();
                          if (!u) {
                            try {
                              setShowVoucherModal(false);
                            } catch {}
                            if (typeof window !== "undefined") {
                              const back = window.location.pathname + window.location.search;
                              window.dispatchEvent(new CustomEvent("open-otp-login", { detail: { redirectTo: back, message: "Mời quý khách đăng nhập để nhận Voucher & Mua hàng với ưu đãi tốt nhất cho thành viên." } } as any));
                            }
                            return;
                          }
                          try {
                            setClaimingId(p.id);
                            claimVoucher(p.id);
                          } catch (e) {
                          } finally {
                            setClaimingId(null);
                          }
                        }}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs"
                        disabled={!!claimed || claimingId === p.id}
                      >
                        {claimed ? "��ã lấy" : claimingId === p.id ? "Đang lấy..." : "Lấy"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Required Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Đăng nhập ��ể xem giá member
            </DialogTitle>
            <DialogDescription className="text-center">
              Mời quý khách đăng nhập/đăng ký tài khoản đ��� xem giá ưu đãi dành riêng cho thành viên
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-3 pt-4">
            <Button
              onClick={handleLoginRedirect}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <User className="w-4 h-4 mr-2" />
              Đăng nhập
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowLoginModal(false)}
              className="w-full"
            >
              Để sau
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms and Conditions Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Điều kiện điều khoản</DialogTitle>
            {termsVoucher?.title ? (
              <DialogDescription>{termsVoucher.title}</DialogDescription>
            ) : null}
          </DialogHeader>
          {(() => {
            const t = getVoucherTerms(termsVoucher?.id || "");
            return (
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-900">��iều khoản chung</h4>
                  <ul className="list-disc ml-5 mt-2 space-y-1 text-gray-700">
                    {t.generalTerms.map((x, i) => (
                      <li key={"g" + i}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Điều kiện sử dụng</h4>
                  <ul className="list-disc ml-5 mt-2 space-y-1 text-gray-700">
                    {t.usageConditions.map((x, i) => (
                      <li key={"u" + i}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Thời hạn hiệu lực</h4>
                  <ul className="list-disc ml-5 mt-2 space-y-1 text-gray-700">
                    {t.validityPeriod.map((x, i) => (
                      <li key={"v" + i}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Khác</h4>
                  <ul className="list-disc ml-5 mt-2 space-y-1 text-gray-700">
                    {t.otherTerms.map((x, i) => (
                      <li key={"o" + i}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Login Form Modal */}
      <Dialog open={showLoginFormModal} onOpenChange={setShowLoginFormModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              Đăng nhập v��i số điện thoại
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Nhập số điện thoại để nhận mã OTP
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Demo Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="font-semibold text-yellow-800 text-sm mb-2">🚀 Hướng dẫn demo:</h4>
              <div className="text-xs text-yellow-700 space-y-1">
                <p><strong>Số ĐT có sẵn:</strong> 0901234567, 0987654321</p>
                <p><strong>Mã OTP luôn là:</strong> 1234</p>
                <p><strong>Số mới:</strong> Sẽ chuyển ��ến đăng ký</p>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-600">{loginError}</span>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="phone-login" className="text-sm font-medium text-gray-700">
                Số đi���n tho���i *
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="phone-login"
                  type="tel"
                  placeholder="Ví dụ: 0901234567"
                  value={loginPhone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '');
                    const limitedDigits = digits.slice(0, 10);
                    setLoginPhone(limitedDigits);
                    if (loginError) setLoginError("");
                  }}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSendingOTP}
                />
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 font-semibold"
              onClick={handlePhoneLogin}
              disabled={isSendingOTP || !loginPhone}
            >
              {isSendingOTP ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang gửi OTP...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Nhận mã OTP
                </>
              )}
            </Button>

            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowLoginFormModal(false);
                  setLoginPhone("");
                  setLoginError("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Modal */}
      <Dialog open={showOTPModal} onOpenChange={setShowOTPModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              Xác thực mã OTP
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Nhập mã OTP đã gửi đến {formatPhoneNumber(loginPhone)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Demo OTP Display */}
            {demoOTP && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-700">
                    <strong>Mã OTP demo:</strong> {demoOTP}
                  </span>
                </div>
              </div>
            )}

            {otpMessage && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-600">{otpMessage}</span>
                </div>
              </div>
            )}

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-600">{loginError}</span>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="otp-input" className="text-sm font-medium text-gray-700">
                Mã OTP *
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="otp-input"
                  type="text"
                  placeholder="Nhập 4 chữ số"
                  value={loginOTP}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '');
                    const limitedDigits = digits.slice(0, 4);
                    setLoginOTP(limitedDigits);
                    if (loginError) setLoginError("");
                  }}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest"
                  disabled={isVerifyingOTP}
                  maxLength={4}
                />
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 font-semibold"
              onClick={handleOTPVerification}
              disabled={isVerifyingOTP || loginOTP.length !== 4}
            >
              {isVerifyingOTP ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang xác thực...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Xác thực OTP
                </>
              )}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              {canResendOTP ? (
                <Button
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={isSendingOTP}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {isSendingOTP ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Gửi lại mã OTP
                    </>
                  )}
                </Button>
              ) : (
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  Gửi lại sau {countdown}s
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowOTPModal(false);
                  setShowLoginFormModal(true);
                  setLoginOTP("");
                  setLoginError("");
                  setOtpMessage("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Quay lại
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowOTPModal(false);
                  setLoginPhone("");
                  setLoginOTP("");
                  setLoginError("");
                  setOtpMessage("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                H��y
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Modal - for existing users */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-green-600">
              Chào mừng trở lại!
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Tài khoản của bạn đã được tìm thấy
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-1">Tài khoản đã xác thực</h3>
                <p className="text-sm text-gray-600">Số điện thoại: {formatPhoneNumber(loginPhone)}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">🎉 Ưu đãi Member đã được áp dụng!</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Giảm 10% tất cả sản phẩm</li>
                <li>• Miễn phí khám mắt</li>
                <li>• Tích điểm mỗi giao dịch</li>
                <li>• Ưu tiên d��ch vụ và tư vấn</li>
              </ul>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 font-semibold"
              onClick={() => {
                setShowProfileModal(false);
                // Optionally refresh the page to show member prices
                window.location.reload();
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Tiếp tục mua sắm với giá Member
            </Button>

            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowProfileModal(false);
                  setLoginPhone("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Đóng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Register Modal - for new users */}
      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-blue-600">
              Tạo tài khoản mới
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Số điện thoại ch��a có tài khoản. Đăng ký ngay để nhận ưu đãi!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-1">Số điện thoại mới</h3>
                <p className="text-sm text-gray-600">{formatPhoneNumber(loginPhone)}</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">🎁 Ưu đãi khi đăng ký:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Giảm 10% đơn hàng ��ầu tiên</li>
                <li>• Tặng voucher 100.000đ</li>
                <li>• Miễn phí khám mắt trọn đời</li>
                <li>• Tích điểm và nhận quà</li>
              </ul>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 font-semibold"
              onClick={() => {
                setShowRegisterModal(false);
                // Navigate to register page with phone pre-filled
                window.location.href = `/register?phone=${encodeURIComponent(loginPhone)}`;
              }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Đăng ký tài khoản ngay
            </Button>

            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
              onClick={() => {
                setShowRegisterModal(false);
                setLoginPhone("");
              }}
            >
              Để sau
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProductDetail;
