import { useState, useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OtpLoginDialog from "@/components/auth/OtpLoginDialog";
import { ProfilePromoTooltip } from "@/components/ProfilePromoTooltip";
import {
  Menu,
  Phone,
  Calendar,
  Search,
  ShoppingCart,
  ChevronDown,
  Glasses,
  Sun,
  Circle,
  Star,
  Tag,
  ArrowRight,
  Sparkles,
  Gift,
  Zap,
  User,
  Heart,
  LogIn,
  UserPlus,
  Package,
  Settings,
  Target,
  Activity,
  Square,
  Shield,
  Award,
  X,
  ChevronRight,
  Download,
  MapPin,
  Eye,
  Stethoscope,
  Baby,
  Monitor,
  BookOpen,
} from "lucide-react";

import { getCurrentUser, logout } from "@/lib/auth";

const Navigation = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showFramesMegaMenu, setShowFramesMegaMenu] = useState(false);
  const [showLensesMegaMenu, setShowLensesMegaMenu] = useState(false);
  const [showSunglassesMegaMenu, setShowSunglassesMegaMenu] = useState(false);
  const [expandedMobileItems, setExpandedMobileItems] = useState<
    Record<string, boolean>
  >({});
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpRedirect, setOtpRedirect] = useState<string>("/cart");
  const [otpPrompt, setOtpPrompt] = useState<string>("");
  const [showPromoTooltip, setShowPromoTooltip] = useState(false);
  const location = useLocation();

  // Show promo tooltip on every page navigation
  useEffect(() => {
    // Hide tooltip first
    setShowPromoTooltip(false);

    // Show tooltip after a short delay on route change
    const timer = setTimeout(() => {
      setShowPromoTooltip(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]); // Re-trigger whenever route changes

  const handleClosePromoTooltip = () => {
    setShowPromoTooltip(false);
  };

  const navigationItems = [
    { name: "Trang chủ", href: "/", nameEn: "Home" },
    { name: "Gọng kính", href: "/frames", nameEn: "Frames" },
    { name: "Tròng kính", href: "/lenses", nameEn: "Lenses" },
    { name: "Kính Mát", href: "/sunglasses", nameEn: "Sunglasses" },
    { name: "Giới thiệu", href: "/about", nameEn: "About" },
    { name: "Tin tức", href: "/blog", nameEn: "News" },
    { name: "Liên h��", href: "/contact", nameEn: "Contact" },
  ];

  const productCategories = [
    {
      name: "Gọng Kính",
      href: "/frames",
      icon: <Glasses className="h-5 w-5" />,
      description: "Gọng kính thời trang, cận thị",
      color: "bg-blue-50 border-blue-200",
      products: [
        "Gọng nhựa",
        "Gọng kim loại",
        "Gọng không viền",
        "Gọng trẻ em",
        "Gọng titan",
        "Gọng acetate",
      ],
    },
    {
      name: "Tròng Kính",
      href: "/lenses",
      icon: <Circle className="h-5 w-5" />,
      description: "Tròng kính chất lượng cao",
      color: "bg-purple-50 border-purple-200",
      products: [
        "Tròng đơn tháng",
        "Tròng đa tròng",
        "Tròng chống ánh sáng xanh",
        "Tròng đổi màu",
        "Tròng siêu mỏng",
        "Tròng c��ờng lực",
      ],
    },
    {
      name: "Kính Mát",
      href: "/sunglasses",
      icon: <Sun className="h-5 w-5" />,
      description: "Kính mát thời trang, bảo vệ UV",
      color: "bg-yellow-50 border-yellow-200",
      products: [
        "Ray-Ban",
        "Oakley",
        "Gucci",
        "Polarized",
        "Aviator Style",
        "Sport Sunglasses",
      ],
    },
  ];

  const featuredBrands = [
    { name: "Ray-Ban", logo: "/placeholder.svg", popular: true },
    { name: "Oakley", logo: "/placeholder.svg", popular: true },
    { name: "Gucci", logo: "/placeholder.svg", popular: false },
    { name: "Silhouette", logo: "/placeholder.svg", popular: false },
    { name: "Tom Ford", logo: "/placeholder.svg", popular: true },
    { name: "Boss", logo: "/placeholder.svg", popular: false },
  ];

  const promotions = [
    {
      title: "Khuyến mãi mùa hè",
      description: "Giảm giá đến 50% tất cả kính mát",
      badge: "50% OFF",
      color: "bg-red-500",
      bgGradient: "from-red-50 to-red-100",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      title: "Combo siêu tiết kiệm",
      description: "Mua gọng tặng ngay tròng kính",
      badge: "Tặng ngay",
      color: "bg-green-500",
      bgGradient: "from-green-50 to-green-100",
      icon: <Gift className="h-4 w-4" />,
    },
  ];

  const quickActions = [
    {
      title: "Sản phẩm khuyến mãi",
      href: "/products?filter=sale",
      icon: <Tag className="h-4 w-4" />,
      count: "156",
    },
    {
      title: "Sản phẩm mới",
      href: "/products?filter=new",
      icon: <Sparkles className="h-4 w-4" />,
      count: "89",
    },
    {
      title: "Bán chạy nhất",
      href: "/products?filter=bestseller",
      icon: <Star className="h-4 w-4" />,
      count: "234",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Listen for global auth requests to open OTP dialog
  useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as
        | { redirectTo?: string; message?: string }
        | undefined;
      if (detail?.redirectTo) setOtpRedirect(detail.redirectTo);
      setOtpPrompt(detail?.message || "");
      setShowOtp(true);
    };
    window.addEventListener("open-otp-login", handler as EventListener);
    return () =>
      window.removeEventListener("open-otp-login", handler as EventListener);
  }, []);

  // Mobile menu items with subcategories
  const mobileMenuItems = [
    {
      id: "frames",
      title: "Gọng Kính",
      icon: <Glasses className="h-5 w-5" />,
      href: "/frames",
      expandable: true,
      subcategories: [
        { title: "Gọng nhựa", href: "/frames?type=plastic" },
        { title: "Gọng kim loại", href: "/frames?type=metal" },
        { title: "Gọng titan", href: "/frames?type=titanium" },
        { title: "Gọng không viền", href: "/frames?type=rimless" },
      ],
    },
    {
      id: "lenses",
      title: "Tròng Kính",
      icon: <Circle className="h-5 w-5" />,
      href: "/lenses",
      expandable: true,
      subcategories: [
        { title: "Tròng đơn", href: "/lenses?type=single" },
        { title: "Tròng đa tròng", href: "/lenses?type=progressive" },
        { title: "Tròng đổi màu", href: "/lenses?type=photochromic" },
        { title: "Tròng chống ánh sáng xanh", href: "/lenses?type=blue-light" },
      ],
    },
    {
      id: "sunglasses",
      title: "Kính Mát",
      icon: <Sun className="h-5 w-5" />,
      href: "/sunglasses",
      expandable: true,
      subcategories: [
        { title: "Kính phân cực", href: "/sunglasses?type=polarized" },
        { title: "Kính thể thao", href: "/sunglasses?type=sport" },
        { title: "Kính thời trang", href: "/sunglasses?type=fashion" },
        { title: "Kính lái xe", href: "/sunglasses?type=driving" },
      ],
    },
    {
      id: "eye-exam",
      title: "Dịch Vụ",
      icon: <Eye className="h-5 w-5" />,
      href: "/eye-exam",
      expandable: true,
      subcategories: [
        { title: "Khám mắt tổng quát", href: "/eye-exam?type=general" },
        { title: "Đo độ cận", href: "/eye-exam?type=myopia" },
        { title: "Kiểm tra mắt trẻ em", href: "/eye-exam?type=children" },
        { title: "Tư vấn chọn kính", href: "/eye-exam?type=consultation" },
      ],
    },
    {
      id: "promotions",
      title: "Khuyến Mãi",
      icon: <Tag className="h-5 w-5" />,
      href: "/promotions",
      expandable: false,
    },
    {
      id: "about",
      title: "Về chúng tôi",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/about",
      expandable: true,
      subcategories: [
        { title: "Câu Chuyện Thương Hiệu", href: "/brand-stories" },
        { title: "Tin tức", href: "/blog" },
      ],
    },
    {
      id: "store-locator",
      title: "Tìm Cửa Hàng",
      icon: <MapPin className="h-5 w-5" />,
      href: "/store-locator",
      expandable: false,
    },
  ];

  // Toggle mobile menu item expansion
  const toggleMobileItem = (itemId: string) => {
    setExpandedMobileItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Optimized hover handlers to prevent re-rendering issues
  const handleFramesHover = useCallback((show: boolean) => {
    setShowFramesMegaMenu(show);
  }, []);

  const handleLensesHover = useCallback((show: boolean) => {
    setShowLensesMegaMenu(show);
  }, []);

  const handleSunglassesHover = useCallback((show: boolean) => {
    setShowSunglassesMegaMenu(show);
  }, []);

  // Handle cart click
  const handleCartClick = () => {
    const user = getCurrentUser();
    if (user) {
      navigate("/cart");
    } else {
      setOtpRedirect("/cart");
      setShowOtp(true);
    }
  };

  // Handle profile click
  const handleProfileClick = () => {
    const user = getCurrentUser();
    if (user) {
      navigate("/profile");
    } else {
      setOtpRedirect("/profile");
      setOtpPrompt(
        "Mời quý khách đăng nhập hàng với ưu đãi tốt nhất cho thành viên",
      );
      setShowOtp(true);
    }
  };

  // Handle login redirect from cart popup
  const handleLoginFromCart = () => {
    setShowCartPopup(false);
    navigate("/login");
  };

  // Frames Mega Menu
  const FramesMegaMenu = () => (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-4xl bg-white border-t shadow-xl z-50">
      <div className="px-4 py-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Frame Types */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Glasses className="h-4 w-4 mr-2 text-primary" />
              Loại gọng
            </h3>
            <div className="space-y-2">
              <Link
                to="/frames?type=full-rim"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Gọng đầy
              </Link>
              <Link
                to="/frames?type=semi-rim"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Nửa gọng
              </Link>
              <Link
                to="/frames?type=rimless"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Không gọng
              </Link>
              <Link
                to="/frames?type=children"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Gọng trẻ em
              </Link>
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Circle className="h-4 w-4 mr-2 text-primary" />
              Chất liệu
            </h3>
            <div className="space-y-2">
              <Link
                to="/frames?material=acetate"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Acetate
              </Link>
              <Link
                to="/frames?material=titan"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Titan
              </Link>
              <Link
                to="/frames?material=metal"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Kim loại
              </Link>
              <Link
                to="/frames?material=tr90"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                TR90
              </Link>
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Star className="h-4 w-4 mr-2 text-primary" />
              Thương hiệu
            </h3>
            <div className="space-y-2">
              <Link
                to="/frames?brand=rayban"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Ray-Ban
              </Link>
              <Link
                to="/frames?brand=oakley"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Oakley
              </Link>
              <Link
                to="/frames?brand=gucci"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Gucci
              </Link>
              <Link
                to="/frames?brand=tomford"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Tom Ford
              </Link>
            </div>
          </div>

          {/* Promotions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Zap className="h-4 w-4 mr-2 text-primary" />
              Khuyến mãi
            </h3>
            <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg border">
              <div className="text-sm font-medium text-primary mb-1">
                Giảm giá 30%
              </div>
              <div className="text-xs text-gray-700 mb-2">
                Gọng kính thời trang
              </div>
              <Button size="sm" className="w-full text-xs">
                Xem ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Lenses Mega Menu
  const LensesMegaMenu = () => (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-4xl bg-white border-t shadow-xl z-50">
      <div className="px-4 py-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Lens Types */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Circle className="h-4 w-4 mr-2 text-primary" />
              Loại tròng
            </h3>
            <div className="space-y-2">
              <Link
                to="/lenses?type=progressive"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Đa tròng
              </Link>
              <Link
                to="/lenses?type=single-vision"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Đơn tròng
              </Link>
              <Link
                to="/lenses?type=photochromic"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Đổi màu
              </Link>
              <Link
                to="/lenses?type=office"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Văn phòng
              </Link>
            </div>
          </div>

          {/* Refractive Index */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Target className="h-4 w-4 mr-2 text-primary" />
              Chiết suất
            </h3>
            <div className="space-y-2">
              <Link
                to="/lenses?index=1.5"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                1.5 (C�� bản)
              </Link>
              <Link
                to="/lenses?index=1.56"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                1.56 (Trung b��nh)
              </Link>
              <Link
                to="/lenses?index=1.67"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                1.67 (Siêu mỏng)
              </Link>
              <Link
                to="/lenses?index=1.74"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                1.74 (Ultra mỏng)
              </Link>
            </div>
          </div>

          {/* Coatings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-primary" />
              Lớp phủ
            </h3>
            <div className="space-y-2">
              <Link
                to="/lenses?coating=anti-reflective"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Chống phản quang
              </Link>
              <Link
                to="/lenses?coating=blue-control"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Chống ánh sáng xanh
              </Link>
              <Link
                to="/lenses?coating=scratch-resistant"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Chống trầy
              </Link>
              <Link
                to="/lenses?coating=uv-protection"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Kháng UV
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              Tính năng đặc biệt
            </h3>
            <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg border">
              <div className="text-sm font-medium text-primary mb-1">
                Công nghệ mới
              </div>
              <div className="text-xs text-gray-700 mb-2">
                Tròng chống ánh sáng xanh
              </div>
              <Button size="sm" className="w-full text-xs">
                Tìm hiểu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Sunglasses Mega Menu
  const SunglassesMegaMenu = () => (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-4xl bg-white border-t shadow-xl z-50">
      <div className="px-4 py-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Lens Types */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Sun className="h-4 w-4 mr-2 text-primary" />
              Lo��i tròng
            </h3>
            <div className="space-y-2">
              <Link
                to="/sunglasses?lens=polarized"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Phân cực
              </Link>
              <Link
                to="/sunglasses?lens=gradient"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Gradient
              </Link>
              <Link
                to="/sunglasses?lens=mirror"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Mirror
              </Link>
              <Link
                to="/sunglasses?lens=prizm"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Prizm
              </Link>
            </div>
          </div>

          {/* Frame Shapes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Square className="h-4 w-4 mr-2 text-primary" />
              Hình d��ng
            </h3>
            <div className="space-y-2">
              <Link
                to="/sunglasses?shape=aviator"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Phi công
              </Link>
              <Link
                to="/sunglasses?shape=wayfarer"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Wayfarer
              </Link>
              <Link
                to="/sunglasses?shape=round"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Tròn
              </Link>
              <Link
                to="/sunglasses?shape=cat-eye"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Mắt mèo
              </Link>
            </div>
          </div>

          {/* Activities */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Activity className="h-4 w-4 mr-2 text-primary" />
              Hoạt động
            </h3>
            <div className="space-y-2">
              <Link
                to="/sunglasses?activity=driving"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Lái xe
              </Link>
              <Link
                to="/sunglasses?activity=sport"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Thể thao
              </Link>
              <Link
                to="/sunglasses?activity=fashion"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Thời trang
              </Link>
              <Link
                to="/sunglasses?activity=beach"
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
              >
                Du lịch biển
              </Link>
            </div>
          </div>

          {/* Summer Collection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Gift className="h-4 w-4 mr-2 text-primary" />
              Bộ sưu tập hè
            </h3>
            <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg border">
              <div className="text-sm font-medium text-primary mb-1">
                Giảm 50%
              </div>
              <div className="text-xs text-gray-700 mb-2">
                Kính râm thời trang
              </div>
              <Button size="sm" className="w-full text-xs">
                Mua ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MegaMenu = () => (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-4xl bg-white border-t shadow-xl z-50">
      <div className="px-4 py-5">
        <div className="flex gap-6">
          {/* Categories - 70% width */}
          <div className="flex-[2]">
            <div className="flex gap-4 mb-4">
              {productCategories.map((category, index) => (
                <div key={index} className="flex-1">
                  {/* Category Header */}
                  <Link
                    to={category.href}
                    className={`block p-3 rounded-lg border hover:border-primary/50 transition-all group ${category.color} mb-3`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Product List */}
                  <div className="space-y-0.5 mb-2">
                    {category.products
                      .slice(0, 3)
                      .map((product, productIndex) => (
                        <Link
                          key={productIndex}
                          to={`${category.href}?type=${product.toLowerCase().replace(/\s+/g, "-")}`}
                          className="block text-xs text-gray-600 hover:text-primary transition-colors py-0.5 px-1 rounded hover:bg-gray-50"
                        >
                          • {product}
                        </Link>
                      ))}
                  </div>

                  {/* View All */}
                  <Link
                    to={category.href}
                    className="inline-flex items-center text-xs text-primary hover:underline font-medium px-1"
                  >
                    Xem tất cả
                    <ArrowRight className="h-2.5 w-2.5 ml-1" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Brands */}
            <div className="pt-3 border-t">
              <h4 className="font-semibold mb-2 text-sm text-gray-900">
                Thương hiệu nổi bật
              </h4>
              <div className="flex gap-2">
                {featuredBrands.slice(0, 4).map((brand, index) => (
                  <Link
                    key={index}
                    to={`/products?brand=${brand.name.toLowerCase()}`}
                    className="flex-1 p-2 border rounded-lg hover:border-primary hover:bg-gray-50 transition-colors text-center"
                  >
                    <div className="h-6 bg-gray-100 rounded mb-1 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {brand.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Promotions Sidebar - 30% width */}
          <div className="flex-[1] space-y-3">
            <h4 className="font-semibold flex items-center text-gray-900 text-sm">
              <Tag className="h-3 w-3 mr-1 text-primary" />
              Khuyến mãi HOT
            </h4>

            {promotions.map((promo, index) => (
              <div
                key={index}
                className={`rounded-lg bg-gradient-to-r ${promo.bgGradient} p-3 border`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-1">
                      {promo.icon}
                    </div>
                  </div>
                  <div
                    className={`px-1.5 py-0.5 rounded text-xs text-white font-semibold ${promo.color}`}
                  >
                    {promo.badge}
                  </div>
                </div>
                <h5 className="font-semibold text-gray-900 mb-1 text-sm">
                  {promo.title}
                </h5>
                <p className="text-xs text-gray-600 mb-2">
                  {promo.description}
                </p>
                <Button size="sm" className="w-full text-xs py-1">
                  Xem chi tiết
                </Button>
              </div>
            ))}

            {/* VIP Banner */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-3 text-white">
              <div className="flex items-center mb-1">
                <Star className="h-3 w-3 mr-1" />
                <span className="font-semibold text-xs">Dịch vụ VIP</span>
              </div>
              <h4 className="font-bold text-sm mb-1">Khám mắt miễn phí</h4>
              <p className="text-xs text-white/80 mb-2">
                Đặt lịch ngay để đư���c tư vấn miễn phí!
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs py-1"
              >
                Đặt lịch ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm text-muted-foreground border-b">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span>Hotline: 0123 456 789</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Thứ 2 - CN: 8:00 - 21:00</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="hover:text-primary transition-colors">
              Tiếng Việt
            </button>
            <button className="hover:text-primary transition-colors">
              English
            </button>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Mobile/Tablet: Menu button and Logo grouped on left */}
          <div className="flex items-center space-x-2 lg:space-x-0">
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[85vw] sm:w-[400px] p-0 bg-white border-r-0 shadow-2xl flex flex-col h-full"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                {/* Header */}
                <div className="flex items-center p-4 sm:pb-4 border-b bg-white" style={{ paddingBottom: "16px" }}>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md"
                      style={{
                        backgroundImage: "url(https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fb816e29bb4c94c7dbeb58161f3783fce)",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        overflow: "hidden",
                        border: "1px solid rgba(65, 117, 5, 1)",
                      }}
                    >
                      <div className="text-white font-bold text-lg hidden sm:block">MK</div>
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-gray-900">
                        Mắt Kính Tâm Đức
                      </h2>
                      <p className="text-xs text-gray-500">
                        Giá trị & Trải nghiệm
                      </p>
                    </div>
                  </div>
                </div>

                {/* Member Section */}
                <div className="px-4 pt-4 sm:pt-0 pb-4 bg-green-50" style={{ marginTop: "-16px" }}>
                  <p className="text-sm mb-4 text-center text-gray-700">
                    Đăng nhập để nhận ưu đãi giành riêng cho thành viên
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      className="h-11 rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 text-white font-semibold shadow-md hover:shadow-lg hover:from-green-900 hover:to-emerald-800 transition-all duration-300"
                      asChild
                    >
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        Đăng nhập
                      </Link>
                    </Button>
                    <Button
                      className="h-11 rounded-xl border-2 border-green-800 text-green-800 font-semibold hover:bg-green-100 hover:border-green-900 hover:text-green-900 transition-all duration-300"
                      variant="outline"
                      asChild
                    >
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        Đăng ký
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto py-2">
                  <nav className="space-y-1 px-4">
                    {mobileMenuItems.map((item) => (
                      <div
                        key={item.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <div className="py-3">
                          {item.expandable ? (
                            <button
                              onClick={() => toggleMobileItem(item.id)}
                              className="w-full flex items-center justify-between text-left group"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 flex items-center justify-center text-primary">
                                  {item.icon}
                                </div>
                                <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                  {item.title}
                                </span>
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                                  expandedMobileItems[item.id]
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>
                          ) : (
                            <Link
                              to={item.href}
                              onClick={() => setIsOpen(false)}
                              className="w-full flex items-center space-x-3 group"
                            >
                              <div className="w-8 h-8 flex items-center justify-center text-primary">
                                {item.icon}
                              </div>
                              <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                {item.title}
                              </span>
                            </Link>
                          )}

                          {/* Subcategories */}
                          {item.expandable &&
                            expandedMobileItems[item.id] &&
                            item.subcategories && (
                              <div className="mt-3 ml-11 space-y-1 animate-in slide-in-from-top-2 duration-200 bg-gray-50 rounded-lg p-3">
                                {item.subcategories.map((subItem, index) => (
                                  <Link
                                    key={index}
                                    to={subItem.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block py-2 px-3 text-sm text-gray-600 hover:text-primary hover:bg-white rounded-md transition-all"
                                  >
                                    {subItem.title}
                                  </Link>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </nav>

                  {/* Image Advertisement Banners - positioned after menu items */}
                  <div className="px-4 pt-4 pb-4 space-y-3">
                    {/* First Banner */}
                    <div className="relative rounded-lg overflow-hidden shadow-lg">
                      <img
                        src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                        alt="Khuyến mãi kính mắt"
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-pink-600/80 flex items-center justify-center">
                        <div className="text-center text-white">
                          <p className="font-bold text-sm mb-1">
                            GIẢM GIÁ ĐẾN 70%
                          </p>
                          <p className="text-xs">Tất c�� kính mắt thời trang</p>
                        </div>
                      </div>
                    </div>

                    {/* Second Banner */}
                    <div className="relative rounded-lg overflow-hidden shadow-lg">
                      <img
                        src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                        alt="Khám mắt miễn phí"
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 flex items-center justify-center">
                        <div className="text-center text-white">
                          <p className="font-bold text-sm mb-1">
                            KHÁM MẮT MIỄN PHÍ
                          </p>
                          <p className="text-xs">Khi mua kính tại cửa hàng</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed CTA Button at Bottom */}
                <div className="p-4 bg-white border-t shadow-lg">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 text-sm shadow-lg"
                    asChild
                  >
                    <Link to="/eye-exam" onClick={() => setIsOpen(false)}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Đặt lịch & Nhận ưu đãi
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            </div>

            {/* Logo - Left aligned next to menu on mobile/tablet, left on desktop */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <div className="text-white font-bold text-lg">MK</div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-xl text-foreground">
                  Mắt Kính Tâm Đức
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Chuyên gia chăm sóc mắt
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Products with Mega Menu */}
            <div
              className="relative group"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <Link
                to="/products"
                className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/products")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Sản phẩm
                <ChevronDown className="h-3 w-3 ml-1 transform group-hover:rotate-180 transition-transform" />
              </Link>

              {showMegaMenu && <MegaMenu />}
            </div>

            {/* Gọng kính with Mega Menu */}
            <div
              className="relative group"
              onMouseEnter={() => handleFramesHover(true)}
              onMouseLeave={() => handleFramesHover(false)}
            >
              <Link
                to="/frames"
                className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/frames") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Gọng kính
                <ChevronDown className="h-3 w-3 ml-1 transform group-hover:rotate-180 transition-transform" />
              </Link>

              {showFramesMegaMenu && <FramesMegaMenu />}
            </div>

            {/* Tròng kính with Mega Menu */}
            <div
              className="relative group"
              onMouseEnter={() => handleLensesHover(true)}
              onMouseLeave={() => handleLensesHover(false)}
            >
              <Link
                to="/lenses"
                className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/lenses") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Tròng kính
                <ChevronDown className="h-3 w-3 ml-1 transform group-hover:rotate-180 transition-transform" />
              </Link>

              {showLensesMegaMenu && <LensesMegaMenu />}
            </div>

            {/* Kính mát with Mega Menu */}
            <div
              className="relative group"
              onMouseEnter={() => handleSunglassesHover(true)}
              onMouseLeave={() => handleSunglassesHover(false)}
            >
              <Link
                to="/sunglasses"
                className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/sunglasses")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Kính mát
                <ChevronDown className="h-3 w-3 ml-1 transform group-hover:rotate-180 transition-transform" />
              </Link>

              {showSunglassesMegaMenu && <SunglassesMegaMenu />}
            </div>

            {/* Other navigation items */}
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/about") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Giới thiệu
            </Link>
            <Link
              to="/blog"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/blog") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Tin tức
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/contact") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Liên hệ
            </Link>
          </nav>

          {/* Action buttons - Right side */}
          <div className="flex items-center space-x-2">
            {/* Search - Desktop only */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* User/Profile - Show on mobile and desktop */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleProfileClick}
              >
                <User className="h-4 w-4" />
              </Button>

              {/* Promo Tooltip */}
              {showPromoTooltip && (
                <ProfilePromoTooltip onClose={handleClosePromoTooltip} />
              )}
            </div>

            {/* Cart - Show on mobile and desktop */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                3
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      {/* OTP Login for Cart Access */}
      <OtpLoginDialog
        open={showOtp}
        onOpenChange={(v) => {
          setShowOtp(v);
          if (!v) setOtpPrompt("");
        }}
        prompt={otpPrompt}
        onSuccess={({ isNew, phone }) => {
          const fallback = location.pathname + location.search;
          const back = otpRedirect || fallback;
          if (isNew) {
            navigate(
              `/register?phone=${encodeURIComponent(phone)}&redirectTo=${encodeURIComponent(back)}`,
            );
          } else {
            navigate(back || "/cart");
          }
        }}
      />
    </header>
  );
};

// Listen to global auth requests
if (typeof window !== "undefined") {
  // attach once per module load
  const w = window as any;
  if (!w.__otp_login_listener__) {
    w.__otp_login_listener__ = true;
    window.addEventListener("open-otp-login", ((e: Event) => {
      try {
        const navRoot = document.querySelector("header");
        // No-op here; Navigation component instance handles state. This module-level listener is for SSR safety.
      } catch {}
    }) as any);
  }
}

export default Navigation;
