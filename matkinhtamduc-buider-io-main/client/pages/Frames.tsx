import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import {
  Search,
  Filter,
  Eye,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  TrendingUp,
  Tag,
  Zap,
  Award,
  Timer,
  Settings,
  Package,
  DollarSign,
  Building2,
  Palette,
  Ruler,
  Glasses,
  Grid3X3,
  Sparkle,
  X,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  material: string;
  shape: string;
  gender: string;
  frameType: string;
  isOnSale?: boolean;
  isNew?: boolean;
  isHotDeal?: boolean;
  features: string[];
  colors?: string[];
  discount?: number;
}

interface Brand {
  id: string;
  name: string;
  logo: string;
  count: number;
}

interface FrameStyle {
  id: string;
  name: string;
  image: string;
  count: number;
}

const Frames = () => {
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("popular");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [selectedFrameSize, setSelectedFrameSize] = useState("all");
  const [selectedFrameDesign, setSelectedFrameDesign] = useState("all");
  const [selectedNosepadDesign, setSelectedNosepadDesign] = useState("all");
  const [visibleProducts, setVisibleProducts] = useState(12); // Initial 12 products
  const [currentSlide, setCurrentSlide] = useState(0);

  // Collapsible filter sections state
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    material: true,
    style: true,
    size: true,
    design: true,
    nosepad: true,
  });
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 45,
  });

  // Sample banner data
  const banners = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/5752282/pexels-photo-5752282.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Bộ sưu tập Gọng Kính 2024",
      subtitle: "Giảm giá lên đến 50% cho tất cả sản phẩm",
      cta: "Mua ngay",
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/6140618/pexels-photo-6140618.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Gọng Kính Titanium Premium",
      subtitle: "Siêu nhẹ, bền bỉ, thời trang",
      cta: "Khám phá",
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/11954922/pexels-photo-11954922.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Thiết Kế Độc Quyền",
      subtitle: "Phong cách cá nhân, chất lượng đỉnh cao",
      cta: "Xem ngay",
    },
  ];

  // Sample brands data
  const brands: Brand[] = [
    { id: "rayban", name: "Ray-Ban", logo: "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png", count: 45 },
    { id: "oakley", name: "Oakley", logo: "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png", count: 32 },
    { id: "gucci", name: "Gucci", logo: "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png", count: 28 },
    { id: "prada", name: "Prada", logo: "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png", count: 24 },
    { id: "tomford", name: "Tom Ford", logo: "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png", count: 19 },
    { id: "cartier", name: "Cartier", logo: "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png", count: 15 },
    { id: "boss", name: "Boss", logo: "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png", count: 22 },
    { id: "versace", name: "Versace", logo: "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png", count: 17 },
  ];

  // Sample frame styles data
  const frameStyles: FrameStyle[] = [
    { id: "rectangle", name: "Chữ nhật", image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2F65ec7840c6864134845537f60ff9a88b?format=webp&width=800", count: 45 },
    { id: "round", name: "Tròn", image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2F65ec7840c6864134845537f60ff9a88b?format=webp&width=800", count: 32 },
    { id: "square", name: "Vuông", image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2F65ec7840c6864134845537f60ff9a88b?format=webp&width=800", count: 28 },
    { id: "oval", name: "Oval", image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2F65ec7840c6864134845537f60ff9a88b?format=webp&width=800", count: 24 },
    { id: "cat-eye", name: "Mắt mèo", image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2F65ec7840c6864134845537f60ff9a88b?format=webp&width=800", count: 19 },
    { id: "aviator", name: "Phi công", image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2F65ec7840c6864134845537f60ff9a88b?format=webp&width=800", count: 15 },
  ];

  // Filter options data
  const materials = [
    { id: "all", name: "Tất c��" },
    { id: "titanium", name: "Titanium" },
    { id: "acetate", name: "Acetate" },
    { id: "metal", name: "Kim lo��i" },
    { id: "tr90", name: "TR90" },
    { id: "plastic", name: "Nhựa" },
  ];

  const frameSizes = [
    { id: "all", name: "Tất cả" },
    { id: "small", name: "Nhỏ (48-52mm)" },
    { id: "medium", name: "Vừa (53-57mm)" },
    { id: "large", name: "Lớn (58-62mm)" },
    { id: "xlarge", name: "Rất lớn (63mm+)" },
  ];

  const frameDesigns = [
    { id: "all", name: "T��t cả" },
    { id: "full-rim", name: "Full-rim" },
    { id: "semi-rim", name: "Semi-rim" },
    { id: "rimless", name: "Rimless" },
  ];

  const nosepadDesigns = [
    { id: "all", name: "Tất cả" },
    { id: "adjustable", name: "Có th�� điều chỉnh" },
    { id: "fixed", name: "Cố định" },
    { id: "integrated", name: "Tích hợp" },
  ];

  // Sample products data - 10 mockup products
  const products: Product[] = [
    {
      id: "f1",
      name: "Gọng Kính Ray-Ban Classic Aviator RB3025",
      brand: "Ray-Ban",
      price: 2500000,
      originalPrice: 3200000,
      rating: 4.8,
      reviewCount: 156,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "Titan",
      shape: "aviator",
      gender: "Unisex",
      frameType: "Full-rim",
      isOnSale: true,
      isHotDeal: true,
      features: ["Chống trầy", "Siêu nhẹ", "Chống g��"],
      colors: ["#000000", "#8B4513", "#C0C0C0"],
      discount: 22,
    },
    {
      id: "f2",
      name: "Gọng Kính Boss Business Pro 1156/F",
      brand: "Boss",
      price: 1800000,
      rating: 4.6,
      reviewCount: 89,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "Acetate",
      shape: "rectangle",
      gender: "Nam",
      frameType: "Full-rim",
      isNew: true,
      features: ["Thoải mái", "Bền bỉ", "Chống trầy"],
      colors: ["#000000", "#8B4513"],
    },
    {
      id: "f3",
      name: "Gọng Kính Gucci Fashion Elite GG0317O",
      brand: "Gucci",
      price: 4200000,
      rating: 4.9,
      reviewCount: 234,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "Acetate Premium",
      shape: "cat-eye",
      gender: "Nữ",
      frameType: "Full-rim",
      features: ["Thiết kế độc quyền", "Màu sắc thời trang", "Handmade"],
      colors: ["#FF1493", "#000000", "#FFD700", "#8B4513"],
    },
    {
      id: "f4",
      name: "G���ng Kính Oakley Sport Flex OX8156",
      brand: "Oakley",
      price: 1600000,
      originalPrice: 2100000,
      rating: 4.7,
      reviewCount: 92,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "TR90",
      shape: "square",
      gender: "Nam",
      frameType: "Semi-rim",
      isOnSale: true,
      isHotDeal: true,
      features: ["Linh hoạt", "Chống sốc", "Chống mồ hôi"],
      discount: 24,
    },
    {
      id: "f5",
      name: "Gọng Kính Tom Ford Vintage Round TF5294",
      brand: "Tom Ford",
      price: 3500000,
      rating: 4.8,
      reviewCount: 167,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "Kim loại",
      shape: "round",
      gender: "Unisex",
      frameType: "Full-rim",
      features: ["Cổ điển", "Sang tr��ng", "Titanium"],
      colors: ["#FFD700", "#C0C0C0", "#8B4513"],
    },
    {
      id: "f6",
      name: "Gọng Kính Prada Minimalist PR15VV",
      brand: "Prada",
      price: 2800000,
      rating: 4.5,
      reviewCount: 78,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "Titanium",
      shape: "oval",
      gender: "Nữ",
      frameType: "Rimless",
      features: ["Siêu nhẹ", "Tối giản", "Chống gỉ"],
      colors: ["#C0C0C0", "#FFD700"],
    },
    {
      id: "f7",
      name: "Gọng Kính Cartier Luxury CT0273O",
      brand: "Cartier",
      price: 6500000,
      originalPrice: 7800000,
      rating: 4.9,
      reviewCount: 124,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "Vàng 18K",
      shape: "rectangle",
      gender: "Unisex",
      frameType: "Full-rim",
      isOnSale: true,
      isHotDeal: true,
      features: ["Vàng thật", "Handcrafted", "Limited Edition"],
      colors: ["#FFD700", "#000000"],
      discount: 17,
    },
    {
      id: "f8",
      name: "Gọng Kính Versace Bold VE3284",
      brand: "Versace",
      price: 3800000,
      rating: 4.6,
      reviewCount: 89,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "Acetate",
      shape: "cat-eye",
      gender: "Nữ",
      frameType: "Full-rim",
      isNew: true,
      features: ["Medusa logo", "Italian design", "Luxury"],
      colors: ["#000000", "#8B4513", "#FF1493"],
    },
    {
      id: "f9",
      name: "Gọng Kính Silhouette Lightweight 5540",
      brand: "Silhouette",
      price: 2200000,
      originalPrice: 2800000,
      rating: 4.7,
      reviewCount: 156,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "Titanium",
      shape: "oval",
      gender: "Unisex",
      frameType: "Rimless",
      isOnSale: true,
      isHotDeal: true,
      features: ["Siêu nhẹ 1.8g", "Không gọng", "Titanium"],
      colors: ["#C0C0C0"],
      discount: 21,
    },
    {
      id: "f10",
      name: "Gọng Kính Police Urban PL15405",
      brand: "Police",
      price: 1450000,
      rating: 4.4,
      reviewCount: 67,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "TR90",
      shape: "square",
      gender: "Nam",
      frameType: "Full-rim",
      features: ["Sporty", "Flexible", "Impact resistant"],
      colors: ["#000000", "#0000FF", "#8B4513"],
    },
    {
      id: "f11",
      name: "Gọng Kính Chanel Classic CC3387",
      brand: "Chanel",
      price: 8500000,
      originalPrice: 9200000,
      rating: 4.9,
      reviewCount: 203,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "Acetate Premium",
      shape: "cat-eye",
      gender: "N���",
      frameType: "Full-rim",
      isOnSale: true,
      isHotDeal: true,
      features: ["Luxury Design", "Handcrafted", "Limited Collection"],
      colors: ["#000000", "#8B4513", "#FF1493"],
      discount: 8,
    },
    {
      id: "f12",
      name: "Gọng Kính Dior Essence DT0284",
      brand: "Dior",
      price: 7200000,
      rating: 4.8,
      reviewCount: 145,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "Kim loại cao cấp",
      shape: "round",
      gender: "Nữ",
      frameType: "Semi-rim",
      isNew: true,
      features: ["French Elegance", "Lightweight", "Premium Quality"],
      colors: ["#FFD700", "#C0C0C0", "#FF1493"],
    },
    {
      id: "f13",
      name: "Gọng Kính Persol Steve McQueen PO3108",
      brand: "Persol",
      price: 3200000,
      originalPrice: 3800000,
      rating: 4.7,
      reviewCount: 112,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "Acetate",
      shape: "aviator",
      gender: "Nam",
      frameType: "Full-rim",
      isOnSale: true,
      features: ["Vintage Style", "Italian Craftsmanship", "Iconic Design"],
      colors: ["#8B4513", "#000000", "#C0C0C0"],
      discount: 16,
    },
    {
      id: "f14",
      name: "Gọng Kính Bulgari Serpenti BV4181",
      brand: "Bulgari",
      price: 6800000,
      rating: 4.9,
      reviewCount: 187,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "Titanium & Gold",
      shape: "cat-eye",
      gender: "N�����",
      frameType: "Full-rim",
      isNew: true,
      isHotDeal: true,
      features: ["Serpenti Collection", "18K Gold Details", "Luxury Italian"],
      colors: ["#FFD700", "#000000", "#FF1493"],
    },
    {
      id: "f15",
      name: "Gọng Kính Moncler Sport ML5068",
      brand: "Moncler",
      price: 2800000,
      originalPrice: 3400000,
      rating: 4.6,
      reviewCount: 94,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "TR90 Hybrid",
      shape: "rectangle",
      gender: "Unisex",
      frameType: "Semi-rim",
      isOnSale: true,
      features: ["Alpine Design", "Weather Resistant", "Ultra Durable"],
      colors: ["#000000", "#0000FF", "#FF0000"],
      discount: 18,
    },
    {
      id: "f16",
      name: "Gọng Kính Maui Jim Ocean MJ432",
      brand: "Maui Jim",
      price: 1950000,
      rating: 4.5,
      reviewCount: 78,
      image: "https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2Fa3bbb53fb0fb461c811b796b4a06b0ef?format=webp&width=800",
      material: "Beta Titanium",
      shape: "oval",
      gender: "Unisex",
      frameType: "Rimless",
      features: ["Ocean Inspired", "Corrosion Resistant", "Lightweight"],
      colors: ["#C0C0C0", "#0000FF", "#8B4513"],
    },
  ];

  // Hot deal products
  const hotDealProducts = products.filter(product => product.isHotDeal);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);



  // Filter products
  const filteredProducts = products.filter(product => {
    const brandMatch = selectedBrand === "all" || product.brand.toLowerCase().includes(selectedBrand);
    const styleMatch = selectedStyle === "all" || product.shape === selectedStyle;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    const materialMatch = selectedMaterial === "all" || product.material === selectedMaterial;
    const frameSizeMatch = selectedFrameSize === "all" || product.frameType === selectedFrameSize;
    const frameDesignMatch = selectedFrameDesign === "all" || product.frameType === selectedFrameDesign;
    const nosepadDesignMatch = selectedNosepadDesign === "all" || product.features?.includes(selectedNosepadDesign);

    if (selectedFilter === "sale") return product.isOnSale && brandMatch && styleMatch && priceMatch && materialMatch && frameSizeMatch && frameDesignMatch && nosepadDesignMatch;
    if (selectedFilter === "new") return product.isNew && brandMatch && styleMatch && priceMatch && materialMatch && frameSizeMatch && frameDesignMatch && nosepadDesignMatch;

    return brandMatch && styleMatch && priceMatch && materialMatch && frameSizeMatch && frameDesignMatch && nosepadDesignMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "newest": return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default: return b.rating - a.rating; // popular
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Gọng kính</span>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <section className="py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 h-48 sm:h-64 lg:h-80">
            {/* Main Banner - Left (2/3 width) */}
            <div className="col-span-2 relative rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=400&fit=crop"
                alt="Main Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">Gọng Kính Cao Cấp</h3>
                <p className="text-sm sm:text-base">Phong cách và chất lượng vượt trội</p>
              </div>
            </div>

            {/* Right Side Banners (1/3 width) */}
            <div className="col-span-1 flex flex-col gap-4">
              {/* Top Small Banner */}
              <div className="flex-1 relative rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=1200&h=400&fit=crop"
                  alt="Small Banner 1"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <h4 className="text-sm sm:text-base font-bold">Thương Hiệu Uy Tín</h4>
                </div>
              </div>

              {/* Bottom Small Banner */}
              <div className="flex-1 relative rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=1200&h=400&fit=crop"
                  alt="Small Banner 2"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <h4 className="text-sm sm:text-base font-bold">Kiểu Dáng Hiện Đại</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Brands Section */}
        <section className="mb-3">
          <div className="max-w-7xl mx-auto px-1 sm:px-1 lg:px-2">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Thương hiệu gọng kính</h2>

            {/* Horizontal Scrolling Brands */}
            <div className="relative">
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
                <button
                  onClick={() => setSelectedBrand("all")}
                  className={`flex-shrink-0 flex items-center justify-center px-4 py-2 rounded-lg border transition-all min-w-[80px] ${
                    selectedBrand === "all"
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <span className="text-sm font-medium">Tất cả</span>
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.name.toLowerCase())}
                    className={`flex-shrink-0 flex items-center justify-center px-4 py-2 rounded-lg border transition-all min-w-[80px] ${
                      selectedBrand === brand.name.toLowerCase()
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <span className="text-sm font-medium">{brand.name}</span>
                  </button>
                ))}
              </div>

              {/* Scroll indicators for mobile */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none lg:hidden"></div>
            </div>
          </div>
        </section>

        {/* Frame Styles Section */}
        <section className="mb-3">
          <div className="max-w-7xl mx-auto px-1 sm:px-1 lg:px-2">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Kiểu dáng gọng kính</h3>
            <div className="relative">
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
              {frameStyles.map((style) => {
                const getStyleIcon = (styleId: string) => {
                  switch (styleId) {
                    case "rectangle":
                      return (
                        <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                          <rect x="2" y="6" width="28" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <line x1="2" y1="12" x2="30" y2="12" stroke="currentColor" strokeWidth="1"/>
                        </svg>
                      );
                    case "round":
                      return (
                        <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                          <circle cx="10" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <circle cx="22" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <line x1="18" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      );
                    case "square":
                      return (
                        <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                          <rect x="2" y="6" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <rect x="18" y="6" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <line x1="14" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      );
                    case "oval":
                      return (
                        <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                          <ellipse cx="10" cy="12" rx="8" ry="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <ellipse cx="22" cy="12" rx="8" ry="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <line x1="18" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      );
                    case "cat-eye":
                      return (
                        <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                          <path d="M2 12 L10 6 L18 12 L10 18 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M14 12 L22 6 L30 12 L22 18 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      );
                    case "aviator":
                      return (
                        <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                          <path d="M2 8 Q10 18 18 8" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M14 8 Q22 18 30 8" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <line x1="2" y1="8" x2="30" y2="8" stroke="currentColor" strokeWidth="1"/>
                        </svg>
                      );
                    default:
                      return (
                        <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                          <rect x="2" y="6" width="28" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      );
                  }
                };

                return (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg border transition-all min-w-[80px] ${
                      selectedStyle === style.id
                        ? "bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-200 hover:border-gray-300 text-gray-600"
                    }`}
                  >
                    <div className="w-12 h-12 mb-2 flex items-center justify-center">
                      {getStyleIcon(style.id)}
                    </div>
                    <span className="text-xs font-medium text-center leading-tight">
                      {style.name}
                    </span>
                  </button>
                );
              })}
              </div>

              {/* Scroll indicators for mobile */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none lg:hidden"></div>
            </div>
          </div>
        </section>

        {/* CellphoneS-style Filter Bar */}
        <section className="mb-2 bg-gray-100 border-b border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)] mt-4">
          <div className="max-w-7xl mx-auto px-1 sm:px-1 lg:px-2 py-3">
            {/* Active Filters Display */}
            {(selectedBrand !== "all" || selectedStyle !== "all" || selectedMaterial !== "all" || selectedFrameSize !== "all" || selectedFrameDesign !== "all" || selectedNosepadDesign !== "all" || priceRange[1] !== 10000000) && (
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Bộ lọc đang áp dụng:</span>

                {selectedBrand !== "all" && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    <span>Thương hiệu: {brands.find(b => b.id === selectedBrand)?.name}</span>
                    <button
                      onClick={() => setSelectedBrand("all")}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {selectedStyle !== "all" && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    <span>Kiểu dáng: {frameStyles.find(s => s.id === selectedStyle)?.name}</span>
                    <button
                      onClick={() => setSelectedStyle("all")}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {selectedMaterial !== "all" && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    <span>Chất liệu: {materials.find(m => m.id === selectedMaterial)?.name}</span>
                    <button
                      onClick={() => setSelectedMaterial("all")}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {selectedFrameSize !== "all" && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    <span>Size: {frameSizes.find(s => s.id === selectedFrameSize)?.name}</span>
                    <button
                      onClick={() => setSelectedFrameSize("all")}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {selectedFrameDesign !== "all" && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    <span>Thiết kế: {frameDesigns.find(d => d.id === selectedFrameDesign)?.name}</span>
                    <button
                      onClick={() => setSelectedFrameDesign("all")}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {priceRange[1] !== 10000000 && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    <span>Giá: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
                    <button
                      onClick={() => setPriceRange([0, 10000000])}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedBrand("all");
                    setSelectedStyle("all");
                    setSelectedMaterial("all");
                    setSelectedFrameSize("all");
                    setSelectedFrameDesign("all");
                    setSelectedNosepadDesign("all");
                    setPriceRange([0, 10000000]);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs hover:bg-gray-300 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Xóa tất cả
                </button>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">

              {/* Mobile Filter Bar */}
              <div className="flex sm:hidden items-center gap-1 flex-1">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 h-10 rounded-lg border-2 border-blue-600 bg-blue-600 text-white text-sm font-bold shadow-md hover:bg-blue-700 hover:border-blue-700"
                      >
                        <Filter className="w-4 h-4" />
                        <span>Bộ lọc</span>
                        {(selectedBrand !== "all" || selectedStyle !== "all" || selectedMaterial !== "all" || selectedFrameSize !== "all" || selectedFrameDesign !== "all" || selectedNosepadDesign !== "all" || priceRange[1] !== 10000000) && (
                          <span className="ml-1 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-bold min-w-[20px] text-center">
                            {[selectedBrand !== "all", selectedStyle !== "all", selectedMaterial !== "all", selectedFrameSize !== "all", selectedFrameDesign !== "all", selectedNosepadDesign !== "all", priceRange[1] !== 10000000].filter(Boolean).length}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[85vw] max-w-xs sm:w-80 md:w-96 max-h-[80vh] overflow-hidden p-0 bg-white shadow-xl border border-gray-200" align="start">
                      <div className="flex flex-col h-full">
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-bold text-gray-900">Bộ lọc sản phẩm</h3>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 max-h-[60vh]">
                        <div className="space-y-4">

                            {/* Price Range Section */}
                            <div className="space-y-3">
                              <button
                                onClick={() => toggleSection('price')}
                                className="flex items-center justify-between w-full text-left"
                              >
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">KHOẢNG GIÁ</h4>
                                {expandedSections.price ? (
                                  <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.price && (
                                <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                                  <input
                                    type="range"
                                    min="0"
                                    max="10000000"
                                    step="100000"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full accent-blue-600"
                                  />
                                  <div className="flex justify-between text-xs text-gray-600">
                                    <span className="font-medium">{formatPrice(priceRange[0])}</span>
                                    <span className="font-medium">{formatPrice(priceRange[1])}</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Brand Section */}
                            <div className="space-y-3">
                              <button
                                onClick={() => toggleSection('brand')}
                                className="flex items-center justify-between w-full text-left"
                              >
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">THƯƠNG HIỆU</h4>
                                {expandedSections.brand ? (
                                  <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.brand && (
                                <div className="space-y-2 max-h-40 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                                  <button
                                    onClick={() => setSelectedBrand("all")}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                      selectedBrand === "all"
                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="font-medium">Tất cả</span>
                                  </button>
                                  {brands.map((brand) => (
                                    <button
                                      key={brand.id}
                                      onClick={() => setSelectedBrand(brand.id)}
                                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                        selectedBrand === brand.id
                                          ? "bg-blue-50 border-blue-300 text-blue-700"
                                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                      }`}
                                    >
                                      <span className="font-medium">{brand.name}</span>
                                      <span className="text-xs text-gray-500">({brand.count})</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Material Section */}
                            <div className="space-y-3">
                              <button
                                onClick={() => toggleSection('material')}
                                className="flex items-center justify-between w-full text-left"
                              >
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">CHẤT LIỆU</h4>
                                {expandedSections.material ? (
                                  <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.material && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                  {materials.map((material) => (
                                    <button
                                      key={material.id}
                                      onClick={() => setSelectedMaterial(material.id)}
                                      className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                        selectedMaterial === material.id
                                          ? "bg-blue-50 border-blue-300 text-blue-700"
                                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                      }`}
                                    >
                                      <span className="font-medium">{material.name}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Frame Style Section */}
                            <div className="space-y-3">
                              <button
                                onClick={() => toggleSection('style')}
                                className="flex items-center justify-between w-full text-left"
                              >
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">KIỂU DÁNG</h4>
                                {expandedSections.style ? (
                                  <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.style && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                  <button
                                    onClick={() => setSelectedStyle("all")}
                                    className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                      selectedStyle === "all"
                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="font-medium">Tất cả</span>
                                  </button>
                                  <div className="grid grid-cols-2 gap-2">
                                    {frameStyles.map((style) => (
                                      <button
                                        key={style.id}
                                        onClick={() => setSelectedStyle(style.id)}
                                        className={`flex flex-col items-center p-2 rounded-lg border transition-all duration-200 ${
                                          selectedStyle === style.id
                                            ? "bg-blue-50 border-blue-300 text-blue-700"
                                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                        }`}
                                      >
                                        <Glasses className="w-4 h-4 mb-1" />
                                        <span className="text-xs font-medium text-center">{style.name}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Frame Size Section */}
                            <div className="space-y-3">
                              <button
                                onClick={() => toggleSection('size')}
                                className="flex items-center justify-between w-full text-left"
                              >
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">KÍCH THƯỚC</h4>
                                {expandedSections.size ? (
                                  <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.size && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                  {frameSizes.map((size) => (
                                    <button
                                      key={size.id}
                                      onClick={() => setSelectedFrameSize(size.id)}
                                      className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                        selectedFrameSize === size.id
                                          ? "bg-blue-50 border-blue-300 text-blue-700"
                                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                      }`}
                                    >
                                      <span className="font-medium">{size.name}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-9 border border-gray-300 hover:border-gray-400 text-xs"
                              onClick={() => {
                                setSelectedFilter("popular");
                                setSelectedBrand("all");
                                setSelectedStyle("all");
                                setSelectedMaterial("all");
                                setSelectedFrameSize("all");
                                setSelectedFrameDesign("all");
                                setSelectedNosepadDesign("all");
                                setPriceRange([0, 10000000]);
                              }}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Đặt lại
                            </Button>
                            <PopoverClose asChild>
                              <Button
                                size="sm"
                                className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                              >
                                Áp dụng ({filteredProducts.length})
                              </Button>
                            </PopoverClose>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>


              </div>

              {/* Desktop Filter Bar */}
              <div className="hidden sm:flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-shrink-0 flex items-center gap-2 px-4 py-2 h-10 rounded-lg border-2 border-blue-600 bg-blue-600 text-white text-sm font-bold shadow-md hover:bg-blue-700 hover:border-blue-700 transition-all"
                    >
                      <Filter className="w-4 h-4" />
                      <span>Bộ lọc</span>
                      {(selectedBrand !== "all" || selectedStyle !== "all" || selectedMaterial !== "all" || selectedFrameSize !== "all" || selectedFrameDesign !== "all" || selectedNosepadDesign !== "all" || priceRange[1] !== 10000000) && (
                        <span className="ml-1 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-bold min-w-[20px] text-center">
                          {[selectedBrand !== "all", selectedStyle !== "all", selectedMaterial !== "all", selectedFrameSize !== "all", selectedFrameDesign !== "all", selectedNosepadDesign !== "all", priceRange[1] !== 10000000].filter(Boolean).length}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[95vw] sm:w-[600px] lg:w-[800px] max-h-[80vh] overflow-hidden p-0 bg-white shadow-xl border border-gray-200" align="start">
                    <div className="flex flex-col h-full">
                      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-xl font-bold text-gray-900">B��� l��c sản ph���m</h3>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-h-[60vh]">
                        <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">

                          {/* Price Range Section */}
                          <div className="space-y-3">
                            <button
                              onClick={() => toggleSection('price')}
                              className="flex items-center justify-between w-full text-left"
                            >
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">KHOẢNG GIÁ</h4>
                              {expandedSections.price ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            {expandedSections.price && (
                              <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                                <input
                                  type="range"
                                  min="0"
                                  max="10000000"
                                  step="100000"
                                  value={priceRange[1]}
                                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                  className="w-full accent-blue-600"
                                />
                                <div className="flex justify-between text-xs text-gray-600">
                                  <span className="font-medium">{formatPrice(priceRange[0])}</span>
                                  <span className="font-medium">{formatPrice(priceRange[1])}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Brand Section */}
                          <div className="space-y-3">
                            <button
                              onClick={() => toggleSection('brand')}
                              className="flex items-center justify-between w-full text-left"
                            >
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">THƯƠNG HIỆU</h4>
                              {expandedSections.brand ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            {expandedSections.brand && (
                              <div className="space-y-2 max-h-40 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                                <button
                                  onClick={() => setSelectedBrand("all")}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                    selectedBrand === "all"
                                      ? "bg-blue-50 border-blue-300 text-blue-700"
                                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  <span className="font-medium">Tất cả</span>
                                </button>
                                {brands.map((brand) => (
                                  <button
                                    key={brand.id}
                                    onClick={() => setSelectedBrand(brand.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                      selectedBrand === brand.id
                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="font-medium">{brand.name}</span>
                                    <span className="text-xs text-gray-500">({brand.count})</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Material Section */}
                          <div className="space-y-3">
                            <button
                              onClick={() => toggleSection('material')}
                              className="flex items-center justify-between w-full text-left"
                            >
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">CHẤT LIỆU</h4>
                              {expandedSections.material ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            {expandedSections.material && (
                              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                {materials.map((material) => (
                                  <button
                                    key={material.id}
                                    onClick={() => setSelectedMaterial(material.id)}
                                    className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                      selectedMaterial === material.id
                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="font-medium">{material.name}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Frame Style Section */}
                          <div className="space-y-3">
                            <button
                              onClick={() => toggleSection('style')}
                              className="flex items-center justify-between w-full text-left"
                            >
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">KIỂU DÁNG</h4>
                              {expandedSections.style ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            {expandedSections.style && (
                              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                <button
                                  onClick={() => setSelectedStyle("all")}
                                  className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                    selectedStyle === "all"
                                      ? "bg-blue-50 border-blue-300 text-blue-700"
                                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  <span className="font-medium">Tất cả</span>
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                  {frameStyles.map((style) => (
                                    <button
                                      key={style.id}
                                      onClick={() => setSelectedStyle(style.id)}
                                      className={`flex flex-col items-center p-2 rounded-lg border transition-all duration-200 ${
                                        selectedStyle === style.id
                                          ? "bg-blue-50 border-blue-300 text-blue-700"
                                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                      }`}
                                    >
                                      <Glasses className="w-4 h-4 mb-1" />
                                      <span className="text-xs font-medium text-center">{style.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Frame Size Section */}
                          <div className="space-y-3">
                            <button
                              onClick={() => toggleSection('size')}
                              className="flex items-center justify-between w-full text-left"
                            >
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">KÍCH THƯỚC</h4>
                              {expandedSections.size ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            {expandedSections.size && (
                              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                {frameSizes.map((size) => (
                                  <button
                                    key={size.id}
                                    onClick={() => setSelectedFrameSize(size.id)}
                                    className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                      selectedFrameSize === size.id
                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="font-medium">{size.name}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Frame Design Section */}
                          <div className="space-y-3">
                            <button
                              onClick={() => toggleSection('design')}
                              className="flex items-center justify-between w-full text-left"
                            >
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">THIẾT KẾ</h4>
                              {expandedSections.design ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            {expandedSections.design && (
                              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                {frameDesigns.map((design) => (
                                  <button
                                    key={design.id}
                                    onClick={() => setSelectedFrameDesign(design.id)}
                                    className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                      selectedFrameDesign === design.id
                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="font-medium">{design.name}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-9 border border-gray-300 hover:border-gray-400 text-xs"
                            onClick={() => {
                              setSelectedFilter("popular");
                              setSelectedBrand("all");
                              setSelectedStyle("all");
                              setSelectedMaterial("all");
                              setSelectedFrameSize("all");
                              setSelectedFrameDesign("all");
                              setSelectedNosepadDesign("all");
                              setPriceRange([0, 10000000]);
                            }}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Đặt lại
                          </Button>
                          <PopoverClose asChild>
                            <Button
                              size="sm"
                              className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                            >
                              Áp dụng ({filteredProducts.length})
                            </Button>
                          </PopoverClose>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>


                {/* Desktop Popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`hidden sm:flex flex-shrink-0 items-center gap-2 px-3 py-2 h-9 rounded-lg border shadow-sm text-sm font-medium transition-all ${
                        selectedBrand !== "all"
                          ? "border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Thương hiệu</span>
                      {selectedBrand !== "all" && (
                        <span className="ml-1 bg-blue-600 text-white rounded-full w-2 h-2"></span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <h4 className="font-semibold mb-3">Chọn thương hiệu</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      <button
                        onClick={() => setSelectedBrand("all")}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                          selectedBrand === "all"
                            ? "bg-blue-50 border-blue-300 text-blue-700"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span>Tất cả</span>
                      </button>
                      {brands.map((brand) => (
                        <button
                          key={brand.id}
                          onClick={() => setSelectedBrand(brand.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                            selectedBrand === brand.id
                              ? "bg-blue-50 border-blue-300 text-blue-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{brand.name}</span>
                          <span className="text-xs text-gray-500">({brand.count})</span>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Mobile Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex sm:hidden flex-shrink-0 items-center gap-2 px-3 py-2 h-9 rounded-lg border border-gray-200 shadow-sm bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Thương hiệu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-80">
                    <SheetHeader>
                      <SheetTitle>Chọn thương hiệu</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                      <button
                        onClick={() => setSelectedBrand("all")}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                          selectedBrand === "all"
                            ? "bg-green-50 border-green-300 text-green-700"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span>Tất cả</span>
                      </button>
                      {brands.map((brand) => (
                        <button
                          key={brand.id}
                          onClick={() => setSelectedBrand(brand.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                            selectedBrand === brand.id
                              ? "bg-green-50 border-green-300 text-green-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{brand.name}</span>
                          <span className="text-xs text-gray-500">({brand.count})</span>
                        </button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Desktop Popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`hidden sm:flex flex-shrink-0 items-center gap-2 px-3 py-2 h-9 rounded-lg border shadow-sm text-sm font-medium transition-all ${
                        selectedMaterial !== "all"
                          ? "border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Palette className="w-4 h-4" />
                      <span>Chất liệu</span>
                      {selectedMaterial !== "all" && (
                        <span className="ml-1 bg-blue-600 text-white rounded-full w-2 h-2"></span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-4">
                    <h4 className="font-semibold mb-3">Chọn chất liệu</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {materials.map((material) => (
                        <button
                          key={material.id}
                          onClick={() => setSelectedMaterial(material.id)}
                          className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all ${
                            selectedMaterial === material.id
                              ? "bg-blue-50 border-blue-300 text-blue-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{material.name}</span>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Mobile Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex sm:hidden flex-shrink-0 items-center gap-2 px-3 py-2 h-9 rounded-lg border border-gray-200 shadow-sm bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
                    >
                      <Palette className="w-4 h-4" />
                      <span>Chất liệu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-80">
                    <SheetHeader>
                      <SheetTitle>Chọn chất liệu</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                      {materials.map((material) => (
                        <button
                          key={material.id}
                          onClick={() => setSelectedMaterial(material.id)}
                          className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all ${
                            selectedMaterial === material.id
                              ? "bg-green-50 border-green-300 text-green-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{material.name}</span>
                        </button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 h-9 rounded-lg border shadow-sm text-sm font-medium transition-all ${
                        selectedFrameSize !== "all"
                          ? "border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Ruler className="w-4 h-4" />
                      <span>Size</span>
                      {selectedFrameSize !== "all" && (
                        <span className="ml-1 bg-blue-600 text-white rounded-full w-2 h-2"></span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-80">
                    <SheetHeader>
                      <SheetTitle>Chọn kích thước</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                      {frameSizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedFrameSize(size.id)}
                          className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all ${
                            selectedFrameSize === size.id
                              ? "bg-green-50 border-green-300 text-green-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{size.name}</span>
                        </button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 h-9 rounded-lg border shadow-sm text-sm font-medium transition-all ${
                        selectedStyle !== "all"
                          ? "border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Glasses className="w-4 h-4" />
                      <span>Kiểu dáng</span>
                      {selectedStyle !== "all" && (
                        <span className="ml-1 bg-blue-600 text-white rounded-full w-2 h-2"></span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-80">
                    <SheetHeader>
                      <SheetTitle>Chọn kiểu dáng</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                      <button
                        onClick={() => setSelectedStyle("all")}
                        className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all ${
                          selectedStyle === "all"
                            ? "bg-green-50 border-green-300 text-green-700"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span>Tất cả</span>
                      </button>
                      {frameStyles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                            selectedStyle === style.id
                              ? "bg-green-50 border-green-300 text-green-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{style.name}</span>
                          <span className="text-xs text-gray-500">({style.count})</span>
                        </button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-shrink-0 flex items-center gap-2 px-3 py-2 h-9 rounded-lg border border-gray-200 shadow-sm bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
                    >
                      <Grid3X3 className="w-4 h-4" />
                      <span><p>Thiết kế</p></span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-80">
                    <SheetHeader>
                      <SheetTitle>Chọn thiết k��� gọng</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                      {frameDesigns.map((design) => (
                        <button
                          key={design.id}
                          onClick={() => setSelectedFrameDesign(design.id)}
                          className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all ${
                            selectedFrameDesign === design.id
                              ? "bg-green-50 border-green-300 text-green-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{design.name}</span>
                        </button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-shrink-0 flex items-center gap-2 px-3 py-2 h-9 rounded-lg border border-gray-200 shadow-sm bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
                    >
                      <Package className="w-4 h-4" />
                      <span><p>Ve mũi</p></span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-80">
                    <SheetHeader>
                      <SheetTitle>Chọn thi��t kế ve mũi</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                      {nosepadDesigns.map((design) => (
                        <button
                          key={design.id}
                          onClick={() => setSelectedNosepadDesign(design.id)}
                          className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all ${
                            selectedNosepadDesign === design.id
                              ? "bg-green-50 border-green-300 text-green-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{design.name}</span>
                        </button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Sort Dropdown - Right Side */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36 h-10 rounded-lg border border-green-300 shadow-sm bg-green-50 text-green-700 text-sm font-medium">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    <span><p>Sắp xếp</p></span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                    <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="popular">Bán chạy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Counter */}
              <div className="hidden sm:flex items-center text-sm text-gray-600">
                <span>Tìm thấy {filteredProducts.length} sản phẩm</span>
              </div>

            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="mb-6">
          <div className="max-w-7xl mx-auto px-1 sm:px-1 lg:px-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2 lg:gap-3">
              {sortedProducts.slice(0, visibleProducts).map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="relative">
                      <div className="aspect-square w-full overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute top-2 left-2 space-y-1">
                        {product.isOnSale && (
                          <Badge className="bg-red-600 text-white text-xs">
                            -{product.discount || 20}%
                          </Badge>
                        )}
                        {product.isNew && (
                          <Badge className="bg-green-600 text-white text-xs">
                            Mới
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-2 sm:p-3 md:p-4">
                      <h3 className="font-semibold text-xs sm:text-sm md:text-base mb-1 sm:mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                        <span className="text-sm sm:text-base md:text-lg font-bold text-blue-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs sm:text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {visibleProducts < sortedProducts.length && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => setVisibleProducts(prev => prev + 12)}
                  variant="outline"
                  size="lg"
                  className="px-6 py-3 text-sm font-medium bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  Xem thêm (467+ sản ph��m)
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Category Description Section */}
        <section className="mb-8">
          <div className="max-w-7xl mx-auto px-1 sm:px-1 lg:px-2">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Gọng Kính Chất Lượng Cao - Thời Trang và Bền Bỉ</h2>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Khám phá b��� sưu tập gọng kính đa dạng và chất lượng cao t���i cửa hàng của chúng tôi. Từ các thương hiệu n���i tiếng thế giới như Ray-Ban, Prada, Gucci đến những thiết kế hi�����n đại, chúng tôi mang đến cho b����n những lựa chọn hoàn hảo cho mọi phong cách.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tại sao chọn gọng kính của chúng tôi?</h3>

                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Chất liệu cao cấp:</strong> Titanium, acetate, kim lo��i và nhựa TR90 siêu nhẹ</li>
                  <li><strong>Thi��t k��� đa dạng:</strong> Từ cổ ��iển đến hiện đại, phù hợp mọi khuôn mặt</li>
                  <li><strong>Thương hiệu uy tín:</strong> Ray-Ban, Prada, Gucci, Oakley, Tom Ford</li>
                  <li><strong>Bảo hành chính hãng:</strong> Cam kết chất lượng và dịch vụ sau bán hàng</li>
                  <li><strong>Tư vấn chuyên nghiệp:</strong> Đội ngũ nhân viên giàu kinh nghiệm</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Các kiểu dáng phổ biến</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <h4 className="font-medium mb-2">Gọng vuông (Rectangle)</h4>
                    <p className="text-sm">Phù hợp với khuôn mặt tròn, tạo cảm giác thanh lịch và nghiêm túc.</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Gọng tròn (Round)</h4>
                    <p className="text-sm">Lý tưởng cho khuôn mặt vuông, mang lại vẻ trẻ trung và cá tính.</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Gọng phi công (Aviator)</h4>
                    <p className="text-sm">Kiểu dáng cổ điển, phù hợp với nhiều khuôn mặt khác nhau.</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Gọng mắt mèo (Cat-eye)</h4>
                    <p className="text-sm">Thiết kế nữ tính, tôn lên nét quyến rũ và thời trang.</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Lời khuyên:</strong> Hãy đến trực tiếp cửa hàng để được tư vấn và thử gọng k��nh phù hợp nhất với khuôn mặt của bạn. Chúng tôi cũng cung cấp dịch vụ đo mắt và cắt tròng miễn phí.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
};

export default Frames;
