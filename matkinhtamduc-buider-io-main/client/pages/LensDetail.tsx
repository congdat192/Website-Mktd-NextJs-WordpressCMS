import { useState, useEffect } from "react";
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
  availableRefractiveIndexes: number[];
  availableLensFeatures?: string[];
  careInstructions: string[];
  warranty: string;
  reviews: Review[];
}

const LensDetail = () => {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedRefractiveIndex, setSelectedRefractiveIndex] = useState<string>("");
  const [selectedLensType, setSelectedLensType] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [selectedReviewFilter, setSelectedReviewFilter] = useState("all");
  const [showLensGuide, setShowLensGuide] = useState(false);
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

  // Mock lens product data
  const product: Product = {
    id: "lens-001",
    name: "Tròng Kính Cận Chống Ánh Sáng Xanh Premium",
    brand: "ZEISS",
    basePrice: 1200000,
    priceRange: { min: 800000, max: 2500000 },
    rating: 4.8,
    reviewCount: 156,
    image: "https://images.pexels.com/photos/5612803/pexels-photo-5612803.jpeg",
    images: [
      "https://images.pexels.com/photos/5612803/pexels-photo-5612803.jpeg",
      "https://images.pexels.com/photos/5693050/pexels-photo-5693050.jpeg",
      "https://images.pexels.com/photos/8535167/pexels-photo-8535167.jpeg",
      "https://images.pexels.com/photos/6076679/pexels-photo-6076679.jpeg",
      "https://images.pexels.com/photos/5612803/pexels-photo-5612803.jpeg",
    ],
    category: "Tròng kính",
    gender: "Unisex",
    frameType: "Tròng kính cận",
    shape: "Đơn tròng",
    material: "Polycarbonate",
    features: [
      "Chống ánh sáng xanh",
      "Chống tia UV 100%",
      "Chống phản xạ",
      "Chống trầy xước",
    ],
    description:
      "Tròng kính cận thị cao cấp với công nghệ chống ánh sáng xanh hiện đại, bảo vệ mắt khỏi tác hại của màn hình điện tử. Phủ coating đa lớp chống phản xạ và chống trầy xước, mang lại trải nghiệm nhìn tối ưu.",
    highlights: [
      "Công nghệ Blue Light Filter tiên tiến",
      "Độ trong suốt cao 99.8%",
      "Giảm mỏi mắt khi sử dụng máy tính",
      "Coating chống bám bụi và dầu mỡ",
      "Bảo hành 2 năm chính hãng",
    ],
    specifications: {
      "Thương hiệu": "ZEISS",
      "Model": "BlueProtect Premium",
      "Loại tròng": "Đơn tròng cận thị",
      "Vật liệu": "Polycarbonate",
      "Chiết suất": "1.56 - 1.74",
      "Độ mỏng": "Siêu mỏng",
      "Trọng lượng": "40% nhẹ hơn kính thường",
      "Coating": "Đa lớp chống phản xạ",
      "Bảo vệ UV": "100%",
      "Độ cứng": "9H",
      "Xuất xứ": "Đức",
      "Bảo hành": "2 năm",
    },
    isNew: true,
    isOnSale: true,
    isBestseller: true,
    isPremium: true,
    variants: [
      {
        id: "lens-1-1",
        name: "Chiết suất 1.56 + Coating Cơ Bản",
        price: 800000,
        originalPrice: 1000000,
        stockStatus: "in-stock",
        stockCount: 50,
        refractiveIndex: 1.56,
        lensFeatures: ["Chống phản xạ cơ bản"],
      },
      {
        id: "lens-1-2",
        name: "Chiết suất 1.61 + Blue Light Protection",
        price: 1200000,
        originalPrice: 1500000,
        stockStatus: "in-stock",
        stockCount: 30,
        refractiveIndex: 1.61,
        lensFeatures: ["Chống ánh sáng xanh", "Chống phản xạ"],
      },
      {
        id: "lens-1-3",
        name: "Chiết suất 1.67 + Premium Coating",
        price: 1800000,
        originalPrice: 2200000,
        stockStatus: "in-stock",
        stockCount: 20,
        refractiveIndex: 1.67,
        lensFeatures: ["Chống ánh sáng xanh", "Chống phản xạ", "Chống bám bụi"],
      },
      {
        id: "lens-1-4",
        name: "Chiết suất 1.74 + Luxury Coating",
        price: 2500000,
        originalPrice: 3000000,
        stockStatus: "low-stock",
        stockCount: 5,
        refractiveIndex: 1.74,
        lensFeatures: ["Chống ánh sáng xanh", "Chống phản xạ", "Chống bám bụi", "Hydrophobic"],
      },
    ],
    availableColors: [
      { name: "Trong suốt", code: "#ffffff" },
      { name: "Xanh nhạt", code: "#e0f2ff" },
    ],
    availableRefractiveIndexes: [1.56, 1.61, 1.67, 1.74],
    availableLensFeatures: [
      "Tròng cơ bản",
      "Chống ánh sáng xanh",
      "Chống phản xạ",
      "Chống trầy xước",
      "Chống bám bụi",
      "Chống nước",
      "UV Protection",
    ],
    careInstructions: [
      "Sử dụng khăn microfiber chuyên dụng để lau",
      "Tránh để tròng kính tiếp xúc với nước nóng",
      "Bảo quản trong hộp kính khi không sử dụng",
      "Tránh để tròng kính tiếp xúc với hóa chất mạnh",
      "Định kỳ kiểm tra và bảo dưỡng tại cửa hàng",
    ],
    warranty: "Bảo hành 2 năm cho lỗi kỹ thuật, miễn phí thay thế trong 6 tháng đầu",
    reviews: [
      {
        id: "review-1",
        customerName: "Nguyễn Văn An",
        rating: 5,
        comment: "Tròng kính rất tốt, mắt không bị mỏi khi làm việc với máy tính cả ngày. Coating chống bám bụi rất hiệu quả.",
        date: "15/01/2024",
        verified: true,
        helpful: 12,
        variant: "Chiết suất 1.61"
      },
      {
        id: "review-2",
        customerName: "Trần Thị Bích",
        rating: 4,
        comment: "Chất lượng ok, mỏng và nhẹ hơn tròng cũ rất nhiều. Giá hơi cao nhưng xứng đáng.",
        date: "10/01/2024",
        verified: true,
        helpful: 8,
        variant: "Chiết suất 1.67"
      },
      {
        id: "review-3",
        customerName: "Lê Minh Tuấn",
        rating: 5,
        comment: "Tròng kính chất lượng cao, nhìn rất rõ và không bị phản quang. Staff tư vấn nhiệt tình.",
        date: "05/01/2024",
        verified: true,
        helpful: 15,
        variant: "Chiết suất 1.56"
      },
    ],
  };

  const [currentPrice, setCurrentPrice] = useState(product.basePrice);
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);

  // Login functions
  const handlePhoneSubmit = async () => {
    setLoginError("");
    setIsCheckingPhone(true);

    if (!validatePhoneNumber(loginPhone)) {
      setLoginError("Số điện thoại không hợp lệ");
      setIsCheckingPhone(false);
      return;
    }

    try {
      const phoneExists = await checkPhoneExists(loginPhone);
      
      if (phoneExists) {
        // Phone exists, send OTP
        setIsSendingOTP(true);
        const result = await sendOTP(loginPhone);
        setDemoOTP(result.demoOTP);
        setOtpMessage(`OTP demo: ${result.demoOTP}`);
        setShowLoginFormModal(false);
        setShowOTPModal(true);
        setCountdown(60);
        setCanResendOTP(false);
      } else {
        // Phone doesn't exist, show register modal
        setShowLoginFormModal(false);
        setShowRegisterModal(true);
      }
    } catch (error) {
      setLoginError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsCheckingPhone(false);
      setIsSendingOTP(false);
    }
  };

  const handleOTPVerification = async () => {
    setLoginError("");
    setIsVerifyingOTP(true);

    try {
      const isValid = await verifyOTP(loginPhone, loginOTP);
      
      if (isValid) {
        const customer = await loginCustomer(loginPhone);
        setShowOTPModal(false);
        setShowProfileModal(true);
        setLoginPhone("");
        setLoginOTP("");
      } else {
        setLoginError("OTP không chính xác");
      }
    } catch (error) {
      setLoginError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const result = await sendOTP(loginPhone);
      setDemoOTP(result.demoOTP);
      setOtpMessage(`OTP demo: ${result.demoOTP}`);
      setCountdown(60);
      setCanResendOTP(false);
    } catch (error) {
      setLoginError("Không thể gửi lại OTP");
    }
  };

  // Get current variant based on selections
  const getCurrentVariant = () => {
    return product.variants.find(
      (variant) =>
        variant.refractiveIndex?.toString() === selectedRefractiveIndex
    );
  };

  // Update price when selections change
  useEffect(() => {
    const variant = getCurrentVariant();
    if (variant) {
      setCurrentPrice(variant.price);
      setOriginalPrice(variant.originalPrice || null);
      setSelectedVariant(variant);
    }
  }, [selectedRefractiveIndex]);

  // Initialize with first variant
  useEffect(() => {
    if (product.variants.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedRefractiveIndex(firstVariant.refractiveIndex?.toString() || "");
      setCurrentPrice(firstVariant.price);
      setOriginalPrice(firstVariant.originalPrice || null);
      setSelectedVariant(firstVariant);
    }
  }, []);

  const handleAddToCart = () => {
    if (!requireAuthForCart()) return;
    navigate('/cart');
  };

  const relatedProducts = [
    {
      id: "lens-2",
      name: "Tròng Kính Đa Tròng Premium",
      brand: "HOYA",
      price: 3500000,
      originalPrice: 4200000,
      rating: 4.7,
      reviewCount: 89,
      image: "https://images.pexels.com/photos/5693050/pexels-photo-5693050.jpeg",
      isOnSale: true,
      isPremium: true,
    },
    {
      id: "lens-3", 
      name: "Tròng Kính Chống Nắng Photochromic",
      brand: "Transitions",
      price: 2800000,
      rating: 4.6,
      reviewCount: 124,
      image: "https://images.pexels.com/photos/8535167/pexels-photo-8535167.jpeg",
      isBestseller: true,
    },
    {
      id: "lens-4",
      name: "Tròng Kính Chống Mỏi Mắt",
      brand: "ESSILOR",
      price: 1950000,
      originalPrice: 2300000,
      rating: 4.8,
      reviewCount: 67,
      image: "https://images.pexels.com/photos/6076679/pexels-photo-6076679.jpeg",
      isNew: true,
      isOnSale: true,
    },
    {
      id: "lens-5",
      name: "Tr��ng Kính Siêu Mỏng 1.74",
      brand: "ZEISS",
      price: 4200000,
      rating: 4.9,
      reviewCount: 45,
      image: "https://images.pexels.com/photos/5612803/pexels-photo-5612803.jpeg",
      isPremium: true,
    },
  ];

  const storeLocations = [
    {
      name: "Mắt Kính Tâm Đức - Chi nhánh Thái Hà",
      address: "125 Thái Hà, Đống Đa, Hà Nội",
      phone: "024 3567 8901",
      distance: "1.2 km",
      availability: "Còn hàng"
    },
    {
      name: "Mắt Kính Tâm Đức - Chi nhánh Cầu Giấy",
      address: "456 Cầu Giấy, Cầu Giấy, Hà Nội", 
      phone: "024 3567 8902",
      distance: "2.5 km",
      availability: "Còn hàng"
    },
    {
      name: "Mắt Kính Tâm Đức - Chi nhánh Thanh Xuân",
      address: "789 Nguyễn Trãi, Thanh Xuân, Hà Nội",
      phone: "024 3567 8903", 
      distance: "3.8 km",
      availability: "Sắp hết hàng"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Breadcrumb */}
      <section className="py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-blue-600">
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/lenses" className="text-gray-500 hover:text-blue-600">
              Tròng kính
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden group relative">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 space-y-2">
                  {product.isNew && (
                    <Badge className="bg-green-500 text-white">Mới</Badge>
                  )}
                  {product.isOnSale && (
                    <Badge className="bg-red-500 text-white">
                      <FlameKindling className="w-3 h-3 mr-1" />
                      Sale
                    </Badge>
                  )}
                  {product.isBestseller && (
                    <Badge className="bg-yellow-500 text-white">Bán chạy</Badge>
                  )}
                  {product.isPremium && (
                    <Badge className="bg-purple-500 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <div className="absolute top-4 right-4 space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/80 backdrop-blur-sm"
                    onClick={() => setShowImageZoom(true)}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/80 backdrop-blur-sm"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/80 backdrop-blur-sm"
                    onClick={() => setIsComparing(!isComparing)}
                  >
                    <GitCompare className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-blue-500"
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

              {/* Benefits */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Ưu đãi đặc biệt
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-11 h-11 bg-[#0F3057] rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                      <RefreshCw className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-base text-[#0F3057] mb-1">
                        ĐỔI TRÒNG MIỄN PHÍ
                      </div>
                      <div className="text-sm text-[#555555]">
                        Thay đổi độ kính <span className="text-[#1C8C64] font-medium">Miễn Phí</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-11 h-11 bg-[#0F3057] rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-base text-[#0F3057] mb-1">
                        BẢO HÀNH 2 NĂM
                      </div>
                      <div className="text-sm text-[#555555]">
                        Lỗi kỹ thuật coating và chất liệu
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-11 h-11 bg-[#0F3057] rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-base text-[#0F3057] mb-1">
                        <span className="text-[#1C8C64]">MINH BẠCH</span> SẢN PHẨM
                      </div>
                      <div className="text-sm text-[#555555]">
                        Kiểm tra chất lượng và nguồn gốc tròng kính
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-11 h-11 bg-[#0F3057] rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-base text-[#0F3057] mb-1">
                        <span className="text-[#1C8C64]">MIỄN PHÍ</span>
                      </div>
                      <div className="text-sm text-[#555555]">
                        Kiểm tra thị lực, tư vấn chọn kính & cắt lắp kính
                      </div>
                    </div>
                  </div>
                </div>
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
                      Miễn phí sửa chữa
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-4 sm:space-y-6">
              {/* Product Title & Rating */}
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-sm sm:text-base">
                      {product.rating}
                    </span>
                    <span className="text-gray-500 text-sm sm:text-base">
                      ({product.reviewCount} đánh giá)
                    </span>
                    <span className="text-green-600 font-semibold text-sm sm:text-base">
                      • ✓ Đã bán 200+
                    </span>
                  </div>
                </div>
              </div>

              {/* Listed Price */}
              <div className="mb-3 sm:mb-4">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-sm sm:text-base text-gray-600 font-medium">
                    Giá niêm yết:
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-gray-500 line-through">
                    {originalPrice &&
                      originalPrice.toLocaleString().replace(/,/g, ".")}
                    đ
                  </span>
                </div>
              </div>

              {/* Price - Hoang Ha Mobile Style */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-green-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Member Price */}
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="block p-4 bg-white rounded-xl border-2 border-teal-300 hover:shadow-md transition-all cursor-pointer group text-left w-full"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 font-medium">
                        Dành riêng cho Tâm Đức Member
                      </span>
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">i</span>
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-teal-600 mb-1">
                      {((originalPrice || currentPrice) * 0.9)
                        .toLocaleString()
                        .replace(/,/g, ".")}
                      đ
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-sm text-gray-500 line-through">
                        {(originalPrice || currentPrice)
                          .toLocaleString()
                          .replace(/,/g, ".")}
                        đ
                      </span>
                      <span className="text-sm text-red-500 font-bold">
                        -10%
                      </span>
                    </div>
                    <div className="bg-yellow-100 px-3 py-1 rounded-full inline-flex items-center">
                      <span className="text-yellow-600 text-sm mr-1">⭐</span>
                      <span className="text-sm text-yellow-700 font-bold">
                        {(currentPrice * 0.02).toLocaleString()}đ Điểm thưởng
                      </span>
                    </div>
                  </button>

                  {/* Trade-in Price */}
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="block p-4 bg-white rounded-xl border-2 border-gray-300 hover:shadow-md transition-all cursor-pointer group w-full"
                  >
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2 font-medium">
                        Thu cũ trợ giá tối đa
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                        {((originalPrice || currentPrice) * 0.3)
                          .toLocaleString()
                          .replace(/,/g, ".")}
                        đ
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        Hoặc
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Product Options */}
              <div className="space-y-4 sm:space-y-6">
                {/* Color Selection */}
                <div>
                  <div className="space-y-3">
                    <label className="text-base sm:text-lg font-semibold flex items-center">
                      <Palette className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      M��u sắc:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.availableColors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`relative flex items-center space-x-2 px-3 py-2 border-2 rounded-lg transition-all ${
                            selectedColor === color.name
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.code }}
                          />
                          <span className="text-sm font-medium">
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Refractive Index Selection - Changed from Size */}
                <div>
                  <div className="space-y-3">
                    <label className="text-base sm:text-lg font-semibold flex items-center">
                      <Glasses className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Chiết suất:
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 text-blue-600 p-0 h-auto"
                        onClick={() => setShowLensGuide(true)}
                      >
                        <HelpCircle className="w-4 h-4 mr-1" />
                        Hướng dẫn chọn tròng kính
                      </Button>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {product.availableRefractiveIndexes.map((index) => {
                        const variant = product.variants.find(v => v.refractiveIndex === index);
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedRefractiveIndex(index.toString())}
                            className={`relative p-3 text-center border-2 rounded-lg transition-all ${
                              selectedRefractiveIndex === index.toString()
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="font-semibold text-sm">{index}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              {index === 1.56 && "Standard"}
                              {index === 1.61 && "Thin"}
                              {index === 1.67 && "Ultra Thin"}
                              {index === 1.74 && "Super Thin"}
                            </div>
                            <div className="text-xs font-bold text-green-600 mt-1">
                              {variant?.price.toLocaleString()}đ
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Lens Features */}
                <div>
                  <label className="text-base sm:text-lg font-semibold flex items-center mb-3">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Tính năng tròng kính:
                  </label>
                  <Select value={selectedLensType} onValueChange={setSelectedLensType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn tính năng tròng kính" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.availableLensFeatures?.map((feature) => (
                        <SelectItem key={feature} value={feature}>
                          {feature}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-base sm:text-lg font-semibold mb-3 block">
                    Số lượng:
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center border-0"
                        min="1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedVariant?.stockStatus === "in-stock" ? (
                        <span className="text-green-600">✓ Còn hàng ({selectedVariant.stockCount})</span>
                      ) : selectedVariant?.stockStatus === "low-stock" ? (
                        <span className="text-orange-600">⚠ Sắp hết hàng ({selectedVariant.stockCount})</span>
                      ) : (
                        <span className="text-red-600">✗ Hết hàng</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={selectedVariant?.stockStatus === "out-of-stock"}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Thêm vào gi��� hàng
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                    Yêu thích
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Gọi tư vấn
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat ngay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              Đăng nhập để xem giá ưu đãi
            </DialogTitle>
            <DialogDescription className="text-center">
              Thành viên Tâm Đức được giảm giá đến 10% và tích điểm thưởng
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Đặc quyền thành viên:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Giảm giá 10% cho tất cả sản phẩm</li>
                <li>• Tích điểm thưởng 2% giá trị đơn hàng</li>
                <li>• Ưu tiên bảo hành và hỗ trợ</li>
                <li>• Nhận thông báo khuyến mãi đặc biệt</li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowLoginFormModal(true);
                }}
                className="flex-1"
              >
                <User className="w-4 h-4 mr-2" />
                Đăng nhập
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowLoginModal(false);
                  setShowRegisterModal(true);
                }}
                className="flex-1"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Đăng ký
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Form Modal */}
      <Dialog open={showLoginFormModal} onOpenChange={setShowLoginFormModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Đăng nhập</DialogTitle>
            <DialogDescription>
              Nhập số điện thoại để đăng nhập hoặc tạo tài khoản mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0987654321"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                className="mt-1"
              />
            </div>
            {loginError && (
              <div className="text-red-500 text-sm">{loginError}</div>
            )}
            <Button 
              onClick={handlePhoneSubmit} 
              className="w-full"
              disabled={isCheckingPhone || isSendingOTP}
            >
              {isCheckingPhone || isSendingOTP ? "Đang xử lý..." : "Tiếp tục"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* OTP Modal */}
      <Dialog open={showOTPModal} onOpenChange={setShowOTPModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác thực OTP</DialogTitle>
            <DialogDescription>
              Mã OTP đã được gửi đến số {formatPhoneNumber(loginPhone)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {otpMessage && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">{otpMessage}</p>
              </div>
            )}
            <div>
              <Label htmlFor="otp">Mã OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Nhập mã 6 số"
                value={loginOTP}
                onChange={(e) => setLoginOTP(e.target.value)}
                className="mt-1"
                maxLength={6}
              />
            </div>
            {loginError && (
              <div className="text-red-500 text-sm">{loginError}</div>
            )}
            <Button 
              onClick={handleOTPVerification} 
              className="w-full"
              disabled={isVerifyingOTP || loginOTP.length !== 6}
            >
              {isVerifyingOTP ? "Đang xác thực..." : "Xác thực"}
            </Button>
            <div className="text-center">
              {canResendOTP ? (
                <Button variant="ghost" onClick={handleResendOTP}>
                  Gửi lại OTP
                </Button>
              ) : (
                <span className="text-gray-500 text-sm">
                  Gửi lại OTP sau {countdown}s
                </span>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo tài khoản mới</DialogTitle>
            <DialogDescription>
              Số {formatPhoneNumber(loginPhone)} chưa có tài khoản
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nhập họ và tên"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (tùy chọn)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email"
                className="mt-1"
              />
            </div>
            <Button className="w-full">
              Tạo tài khoản
            </Button>
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRegisterModal(false);
                  setShowLoginFormModal(true);
                }}
              >
                Đã có tài khoản? Đăng nhập
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thông tin tài khoản</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold">Khách hàng VIP</h3>
              <p className="text-gray-600">{formatPhoneNumber(loginPhone)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Ưu đãi hiện tại:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Giảm giá 10% sản phẩm này</li>
                <li>• Tích được {(currentPrice * 0.02).toLocaleString()}đ điểm thưởng</li>
                <li>• Miễn phí giao hàng</li>
              </ul>
            </div>
            <Button
              onClick={() => setShowProfileModal(false)}
              className="w-full"
            >
              Tiếp tục mua hàng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lens Guide Modal */}
      <Dialog open={showLensGuide} onOpenChange={setShowLensGuide}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              <Glasses className="w-6 h-6 mr-2 text-blue-600" />
              Hướng dẫn chọn tròng kính
            </DialogTitle>
            <DialogDescription>
              Tìm hiểu về các loại chiết suất và cách chọn tròng kính phù hợp
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Refractive Index Guide */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">
                Hướng dẫn chọn chiết suất
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    index: "1.56",
                    name: "Standard",
                    thickness: "Dày nhất",
                    price: "Rẻ nhất",
                    suitable: "Cận dưới -2.00D",
                    color: "bg-blue-50 border-blue-200"
                  },
                  {
                    index: "1.61", 
                    name: "Thin",
                    thickness: "Mỏng hơn 25%",
                    price: "Trung bình",
                    suitable: "Cận -2.00D đến -4.00D",
                    color: "bg-green-50 border-green-200"
                  },
                  {
                    index: "1.67",
                    name: "Ultra Thin", 
                    thickness: "Mỏng hơn 40%",
                    price: "Cao",
                    suitable: "Cận -4.00D đến -6.00D",
                    color: "bg-orange-50 border-orange-200"
                  },
                  {
                    index: "1.74",
                    name: "Super Thin",
                    thickness: "Mỏng nhất 60%",
                    price: "Cao nhất", 
                    suitable: "Cận trên -6.00D",
                    color: "bg-purple-50 border-purple-200"
                  }
                ].map((item) => (
                  <div key={item.index} className={`p-4 rounded-lg border-2 ${item.color}`}>
                    <div className="font-bold text-lg mb-2">
                      Chiết suất {item.index} - {item.name}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>📏 <strong>Độ mỏng:</strong> {item.thickness}</div>
                      <div>💰 <strong>Giá:</strong> {item.price}</div>
                      <div>🎯 <strong>Phù hợp:</strong> {item.suitable}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">
                So sánh chiết suất
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-left">Chiết suất</th>
                      <th className="border border-gray-300 p-3 text-left">Độ mỏng</th>
                      <th className="border border-gray-300 p-3 text-left">Trọng lượng</th>
                      <th className="border border-gray-300 p-3 text-left">Phù hợp</th>
                      <th className="border border-gray-300 p-3 text-left">Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3 font-semibold">1.56</td>
                      <td className="border border-gray-300 p-3">6.5mm</td>
                      <td className="border border-gray-300 p-3">Nặng nhất</td>
                      <td className="border border-gray-300 p-3">Cận nhẹ (-0.25 đến -2.00)</td>
                      <td className="border border-gray-300 p-3">800.000đ</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3 font-semibold">1.61</td>
                      <td className="border border-gray-300 p-3">4.8mm</td>
                      <td className="border border-gray-300 p-3">Nhẹ hơn 15%</td>
                      <td className="border border-gray-300 p-3">Cận vừa (-2.00 đến -4.00)</td>
                      <td className="border border-gray-300 p-3">1.200.000đ</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-semibold">1.67</td>
                      <td className="border border-gray-300 p-3">3.2mm</td>
                      <td className="border border-gray-300 p-3">Nhẹ hơn 25%</td>
                      <td className="border border-gray-300 p-3">Cận cao (-4.00 đến -6.00)</td>
                      <td className="border border-gray-300 p-3">1.800.000đ</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3 font-semibold">1.74</td>
                      <td className="border border-gray-300 p-3">2.1mm</td>
                      <td className="border border-gray-300 p-3">Nhẹ nhất 40%</td>
                      <td className="border border-gray-300 p-3">Cận rất cao (trên -6.00)</td>
                      <td className="border border-gray-300 p-3">2.500.000đ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">
                💡 Lời khuyên từ chuyên gia:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Chiết suất càng cao thì tròng kính càng mỏng và nhẹ</li>
                <li>• Với độ cận thấp (dưới -2.00D), chiết suất 1.56 là phù hợp và tiết kiệm</li>
                <li>• Với độ cận cao (trên -4.00D), nên chọn chiết suất cao để tròng đẹp h��n</li>
                <li>• Chiết suất cao giúp gọng kính không bị biến dạng do tròng quá dày</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Tabs */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5">
              <TabsTrigger value="description">Mô tả</TabsTrigger>
              <TabsTrigger value="specifications">Thông số</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
              <TabsTrigger value="stores">Cửa hàng</TabsTrigger>
              <TabsTrigger value="care">Bảo quản</TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    Mô tả sản phẩm
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-4">{product.description}</p>
                    
                    <h4 className="text-lg font-semibold mb-3">Điểm nổi bật:</h4>
                    <ul className="space-y-2">
                      {product.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-lg font-semibold mb-3 mt-6">Tính năng:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-blue-50 p-2 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-800">{feature}</span>
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
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    Thông số kỹ thuật
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="text-gray-900 font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold">
                      Đánh giá từ khách hàng
                    </h3>
                    <Select value={selectedReviewFilter} onValueChange={setSelectedReviewFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả đánh giá</SelectItem>
                        <SelectItem value="5">5 sao</SelectItem>
                        <SelectItem value="4">4 sao</SelectItem>
                        <SelectItem value="3">3 sao</SelectItem>
                        <SelectItem value="2">2 sao</SelectItem>
                        <SelectItem value="1">1 sao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Review Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-500 mb-2">
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
                      <p className="text-gray-600">
                        {product.reviewCount} đánh giá
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <span className="text-sm w-8">{rating} sao</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{
                                  width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : 3}%`
                                }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8">
                              {rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : 3}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold text-gray-900">
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
                                <span className="sm:hidden">Bản đồ</span>
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
              Tâm Đức tự hào là đại lý ủy quyền chính thức với đầy đủ giấy chứng
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
                    title: "Giấy phép hành nghề",
                    desc: "Hành nghề mắt kính hợp pháp",
                  },
                  {
                    img: "https://images.pexels.com/photos/7567541/pexels-photo-7567541.jpeg",
                    title: "Chứng nhận an toàn",
                    desc: "Đảm bảo an toàn sản phẩm",
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
              to="/lenses"
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
                          {relatedProduct.isNew && (
                            <Badge className="bg-green-500 text-white text-xs">
                              Mới
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

      <Footer />
    </div>
  );
};

export default LensDetail;
