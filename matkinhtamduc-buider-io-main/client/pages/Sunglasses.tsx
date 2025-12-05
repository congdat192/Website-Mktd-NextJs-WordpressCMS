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
  Sun,
  Grid3X3,
  Sparkle,
  X,
  Shield,
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
  lensColor: string;
  uvProtection: string;
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

const Sunglasses = () => {
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("popular");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [selectedFrameSize, setSelectedFrameSize] = useState("all");
  const [selectedFrameDesign, setSelectedFrameDesign] = useState("all");
  const [selectedNosepadDesign, setSelectedNosepadDesign] = useState("all");
  const [selectedLensColor, setSelectedLensColor] = useState("all");
  const [selectedUVProtection, setSelectedUVProtection] = useState("all");
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Collapsible filter sections state
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    material: true,
    style: true,
    size: true,
    design: true,
    lensColor: true,
    uvProtection: true,
  });

  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 45
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Sample data for sunglasses
  const products: Product[] = [
    {
      id: "1",
      name: "Kính Mát Ray-Ban Aviator Classic RB3025",
      brand: "Ray-Ban",
      price: 3500000,
      originalPrice: 4200000,
      rating: 4.8,
      reviewCount: 256,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop",
      material: "Kim loại",
      shape: "Aviator",
      gender: "Unisex",
      frameType: "Không gọng",
      lensColor: "Xám gradient",
      uvProtection: "UV400",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["Chống tia UV", "Kính cường lực", "Gọng titanium"],
      colors: ["Vàng", "Bạc", "Đen"],
      discount: 17
    },
    {
      id: "2",
      name: "Kính Mát Oakley Holbrook OO9102",
      brand: "Oakley",
      price: 4200000,
      originalPrice: 5000000,
      rating: 4.7,
      reviewCount: 189,
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500&h=500&fit=crop",
      material: "Nhựa O-Matter",
      shape: "Vuông",
      gender: "Nam",
      frameType: "Toàn gọng",
      lensColor: "Đen polarized",
      uvProtection: "UV400",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["Polarized", "Chống va đập", "Chống nước"],
      colors: ["Đen", "Xanh navy", "Nâu"],
      discount: 16
    },
    {
      id: "3",
      name: "Kính Mát Gucci GG0061S",
      brand: "Gucci",
      price: 8500000,
      rating: 4.9,
      reviewCount: 87,
      image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=500&h=500&fit=crop",
      material: "Acetate",
      shape: "Mắt mèo",
      gender: "Nữ",
      frameType: "Toàn gọng",
      lensColor: "Nâu gradient",
      uvProtection: "UV400",
      isOnSale: false,
      isNew: true,
      isHotDeal: false,
      features: ["Thiết kế Italy", "Kính gradient", "Logo Gucci"],
      colors: ["Nâu", "Đen", "Hồng"]
    },
    {
      id: "4",
      name: "Kính Mát Prada PR 17WS",
      brand: "Prada",
      price: 7200000,
      originalPrice: 8500000,
      rating: 4.6,
      reviewCount: 134,
      image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&h=500&fit=crop",
      material: "Acetate",
      shape: "Tròn",
      gender: "Nữ",
      frameType: "Toàn gọng",
      lensColor: "Xanh mirror",
      uvProtection: "UV400",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["Mirror coating", "Thiết kế retro", "Logo Prada"],
      colors: ["Đen", "Nâu", "Xanh"],
      discount: 15
    },
    {
      id: "5",
      name: "Kính Mát Tom Ford TF5178",
      brand: "Tom Ford",
      price: 9800000,
      rating: 4.8,
      reviewCount: 92,
      image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&h=500&fit=crop",
      material: "Acetate",
      shape: "Vuông",
      gender: "Nam",
      frameType: "Toàn gọng",
      lensColor: "Đen",
      uvProtection: "UV400",
      isOnSale: false,
      isNew: true,
      isHotDeal: false,
      features: ["Thiết kế luxury", "Made in Italy", "Logo vàng"],
      colors: ["Đen", "Nâu tortoise", "Xanh navy"]
    },
    {
      id: "6",
      name: "Kính Mát Versace VE4361",
      brand: "Versace",
      price: 6800000,
      originalPrice: 8000000,
      rating: 4.7,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
      material: "Acetate",
      shape: "Mắt mèo",
      gender: "Nữ",
      frameType: "Toàn gọng",
      lensColor: "Gradient",
      uvProtection: "UV400",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["Medusa logo", "Gradient lens", "Thiết kế Ý"],
      colors: ["Đen", "Vàng", "Hồng"],
      discount: 15
    },
    {
      id: "7",
      name: "Kính Mát Dior DiorSoStellaire1",
      brand: "Dior",
      price: 11200000,
      rating: 4.9,
      reviewCount: 78,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop",
      material: "Kim loại",
      shape: "Aviator",
      gender: "Unisex",
      frameType: "Không gọng",
      lensColor: "Blue mirror",
      uvProtection: "UV400",
      isOnSale: false,
      isNew: true,
      isHotDeal: false,
      features: ["Mirror coating", "Thiết kế Pháp", "Dior signature"],
      colors: ["Vàng", "Bạc", "Rose gold"]
    },
    {
      id: "8",
      name: "Kính Mát Persol PO3159S",
      brand: "Persol",
      price: 5400000,
      originalPrice: 6200000,
      rating: 4.6,
      reviewCount: 203,
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&h=500&fit=crop",
      material: "Acetate",
      shape: "Pilot",
      gender: "Nam",
      frameType: "Toàn gọng",
      lensColor: "Xanh lá",
      uvProtection: "UV400",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["Made in Italy", "Crystal lens", "Persol signature"],
      colors: ["Nâu", "Đen", "Xanh"],
      discount: 13
    },
    {
      id: "9",
      name: "Kính Mát Chanel CH5450",
      brand: "Chanel",
      price: 13500000,
      rating: 4.9,
      reviewCount: 67,
      image: "https://images.unsplash.com/photo-1506629905333-89e25e24c3ae?w=500&h=500&fit=crop",
      material: "Acetate",
      shape: "Tròn",
      gender: "Nữ",
      frameType: "Toàn gọng",
      lensColor: "Đen gradient",
      uvProtection: "UV400",
      isOnSale: false,
      isNew: true,
      isHotDeal: false,
      features: ["CC logo", "Luxury design", "Made in Italy"],
      colors: ["Đen", "Nâu", "Vàng"]
    },
    {
      id: "10",
      name: "Kính Mát Maui Jim Cliff House B247",
      brand: "Maui Jim",
      price: 4800000,
      originalPrice: 5600000,
      rating: 4.8,
      reviewCount: 178,
      image: "https://images.unsplash.com/photo-1556306545-d1928e16e93b?w=500&h=500&fit=crop",
      material: "Nylon",
      shape: "Wraparound",
      gender: "Unisex",
      frameType: "Toàn gọng",
      lensColor: "HCL Bronze",
      uvProtection: "UV400",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["PolarizedPlus2", "Maui Brilliant", "Sport design"],
      colors: ["Đen", "Xanh", "Nâu"],
      discount: 14
    },
    {
      id: "11",
      name: "Kính Mát Police SPLA37",
      brand: "Police",
      price: 2800000,
      originalPrice: 3400000,
      rating: 4.5,
      reviewCount: 124,
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop",
      material: "Kim loại",
      shape: "Pilot",
      gender: "Nam",
      frameType: "Không gọng",
      lensColor: "Đen",
      uvProtection: "UV400",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["Police signature", "Flexible frame", "Anti-scratch"],
      colors: ["Đen", "Bạc", "Vàng"],
      discount: 18
    },
    {
      id: "12",
      name: "Kính Mát Polo Ralph Lauren PH3128",
      brand: "Polo Ralph Lauren",
      price: 3200000,
      originalPrice: 3800000,
      rating: 4.4,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1671884687876-8a4b04f14b52?w=500&h=500&fit=crop",
      material: "Acetate",
      shape: "Vuông",
      gender: "Nam",
      frameType: "Toàn gọng",
      lensColor: "Xám",
      uvProtection: "UV400",
      isOnSale: true,
      isNew: false,
      isHotDeal: false,
      features: ["Polo logo", "Classic design", "Comfort fit"],
      colors: ["Nâu", "Đen", "Xanh navy"],
      discount: 16
    },
    {
      id: "13",
      name: "Kính Mát Armani Exchange AX4080S",
      brand: "Armani Exchange",
      price: 2400000,
      rating: 4.3,
      reviewCount: 89,
      image: "https://images.unsplash.com/photo-1620987278429-ab178d6eb547?w=500&h=500&fit=crop",
      material: "Nhựa",
      shape: "Tròn",
      gender: "Unisex",
      frameType: "Toàn gọng",
      lensColor: "Blue gradient",
      uvProtection: "UV400",
      isOnSale: false,
      isNew: true,
      isHotDeal: false,
      features: ["AX logo", "Lightweight", "Trendy design"],
      colors: ["Đen", "Nâu", "Xanh"]
    },
    {
      id: "14",
      name: "Kính Mát Burberry BE4302",
      brand: "Burberry",
      price: 6200000,
      originalPrice: 7200000,
      rating: 4.7,
      reviewCount: 112,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop",
      material: "Acetate",
      shape: "Mắt mèo",
      gender: "Nữ",
      frameType: "Toàn gọng",
      lensColor: "Brown gradient",
      uvProtection: "UV400",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["Burberry check", "Luxury acetate", "British design"],
      colors: ["Nâu", "Đen", "Hồng"],
      discount: 14
    },
    {
      id: "15",
      name: "Kính Mát Coach HC8280",
      brand: "Coach",
      price: 4600000,
      rating: 4.5,
      reviewCount: 98,
      image: "https://images.unsplash.com/photo-1599446820518-0de31c8bfab0?w=500&h=500&fit=crop",
      material: "Acetate",
      shape: "Vuông",
      gender: "Nữ",
      frameType: "Toàn gọng",
      lensColor: "Purple gradient",
      uvProtection: "UV400",
      isOnSale: false,
      isNew: true,
      isHotDeal: false,
      features: ["Coach signature", "Elegant design", "Premium acetate"],
      colors: ["Nâu", "Đen", "Tím"]
    },
    {
      id: "16",
      name: "Kính Mát Fossil FOS 2098/S",
      brand: "Fossil",
      price: 1800000,
      originalPrice: 2200000,
      rating: 4.2,
      reviewCount: 134,
      image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=500&h=500&fit=crop",
      material: "Kim loại",
      shape: "Pilot",
      gender: "Nam",
      frameType: "Không gọng",
      lensColor: "Green",
      uvProtection: "UV400",
      isOnSale: true,
      isNew: false,
      isHotDeal: false,
      features: ["Vintage style", "Metal frame", "Affordable luxury"],
      colors: ["Vàng", "Bạc", "Đen"],
      discount: 18
    }
  ];

  const hotDealProducts = products.filter(product => product.isHotDeal);

  const brands: Brand[] = [
    { id: "ray-ban", name: "Ray-Ban", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 46 },
    { id: "oakley", name: "Oakley", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 32 },
    { id: "gucci", name: "Gucci", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 28 },
    { id: "prada", name: "Prada", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 24 },
    { id: "tom-ford", name: "Tom Ford", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 18 },
    { id: "versace", name: "Versace", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 15 },
    { id: "dior", name: "Dior", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 12 },
    { id: "persol", name: "Persol", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 10 }
  ];

  const frameStyles: FrameStyle[] = [
    { id: "aviator", name: "Aviator", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=100&h=100&fit=crop", count: 45 },
    { id: "wayfarer", name: "Wayfarer", image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=100&h=100&fit=crop", count: 38 },
    { id: "cat-eye", name: "Mắt mèo", image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=100&h=100&fit=crop", count: 32 },
    { id: "round", name: "Tròn", image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=100&h=100&fit=crop", count: 28 },
    { id: "square", name: "Vuông", image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=100&h=100&fit=crop", count: 25 },
    { id: "pilot", name: "Pilot", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=100&h=100&fit=crop", count: 22 },
    { id: "wraparound", name: "Wraparound", image: "https://images.unsplash.com/photo-1556306545-d1928e16e93b?w=100&h=100&fit=crop", count: 18 }
  ];

  const materials = [
    { id: "all", name: "Tất cả" },
    { id: "acetate", name: "Acetate" },
    { id: "metal", name: "Kim loại" },
    { id: "plastic", name: "Nhựa" },
    { id: "titanium", name: "Titanium" },
    { id: "nylon", name: "Nylon" }
  ];

  const frameSizes = [
    { id: "all", name: "Tất cả" },
    { id: "small", name: "Nhỏ (48-52mm)" },
    { id: "medium", name: "Vừa (53-57mm)" },
    { id: "large", name: "Lớn (58-62mm)" },
    { id: "extra-large", name: "Rất lớn (63mm+)" }
  ];

  const frameDesigns = [
    { id: "all", name: "Tất cả" },
    { id: "full-rim", name: "Toàn gọng" },
    { id: "semi-rim", name: "Nửa gọng" },
    { id: "rimless", name: "Không gọng" }
  ];

  const nosepadDesigns = [
    { id: "all", name: "Tất cả" },
    { id: "adjustable", name: "Có thể điều chỉnh" },
    { id: "fixed", name: "Cố định" }
  ];

  const lensColors = [
    { id: "all", name: "Tất cả" },
    { id: "black", name: "Đen" },
    { id: "brown", name: "Nâu" },
    { id: "gray", name: "Xám" },
    { id: "green", name: "Xanh lá" },
    { id: "blue", name: "Xanh dương" },
    { id: "gradient", name: "Gradient" },
    { id: "mirror", name: "Mirror" }
  ];

  const uvProtections = [
    { id: "all", name: "Tất cả" },
    { id: "uv400", name: "UV400" },
    { id: "uv380", name: "UV380" },
    { id: "polarized", name: "Polarized" }
  ];

  const banners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&h=400&fit=crop",
      title: "Kính Mát Cao Cấp",
      subtitle: "Bảo vệ đôi mắt với phong cách"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&h=400&fit=crop",
      title: "Thương Hiệu Nổi Tiếng",
      subtitle: "Ray-Ban, Oakley, Gucci và nhiều hơn"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=1200&h=400&fit=crop",
      title: "Xu Hướng 2024",
      subtitle: "Thiết kế hiện đại, bảo vệ tối ưu"
    }
  ];

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
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
    const lensColorMatch = selectedLensColor === "all" || product.lensColor === selectedLensColor;
    const uvProtectionMatch = selectedUVProtection === "all" || product.uvProtection === selectedUVProtection;

    if (selectedFilter === "sale") return product.isOnSale && brandMatch && styleMatch && priceMatch && materialMatch && frameSizeMatch && frameDesignMatch && nosepadDesignMatch && lensColorMatch && uvProtectionMatch;
    if (selectedFilter === "new") return product.isNew && brandMatch && styleMatch && priceMatch && materialMatch && frameSizeMatch && frameDesignMatch && nosepadDesignMatch && lensColorMatch && uvProtectionMatch;

    return brandMatch && styleMatch && priceMatch && materialMatch && frameSizeMatch && frameDesignMatch && nosepadDesignMatch && lensColorMatch && uvProtectionMatch;
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
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
            <span className="text-gray-900 font-medium">Kính mát</span>
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
                src={banners[0].image}
                alt="Main Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{banners[0].title}</h3>
                <p className="text-sm sm:text-base mb-3">{banners[0].subtitle}</p>
                <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  {banners[0].cta}
                </button>
              </div>
            </div>

            {/* Right Side Banners (1/3 width) */}
            <div className="col-span-1 flex flex-col gap-4">
              {/* Top Small Banner */}
              <div className="flex-1 relative rounded-lg overflow-hidden">
                <img
                  src={banners[1].image}
                  alt="Small Banner 1"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <h4 className="text-sm sm:text-base font-bold mb-1">{banners[1].title}</h4>
                  <button className="bg-white text-gray-900 px-2 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors">
                    {banners[1].cta}
                  </button>
                </div>
              </div>

              {/* Bottom Small Banner */}
              <div className="flex-1 relative rounded-lg overflow-hidden">
                <img
                  src={banners[2].image}
                  alt="Small Banner 2"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <h4 className="text-sm sm:text-base font-bold mb-1">{banners[2].title}</h4>
                  <button className="bg-white text-gray-900 px-2 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors">
                    {banners[2].cta}
                  </button>
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
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Thương hiệu kính mát</h2>

            {/* Horizontal Scrolling Brands */}
            <div className="relative">
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
                <button
                  onClick={() => setSelectedBrand("all")}
                  className={`flex-shrink-0 flex items-center justify-center px-4 py-2 rounded-lg border transition-all min-w-[80px] ${
                    selectedBrand === "all"
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  <span className="font-medium text-sm">Tất cả</span>
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.name.toLowerCase())}
                    className={`flex-shrink-0 flex items-center justify-center px-4 py-2 rounded-lg border transition-all min-w-[80px] ${
                      selectedBrand === brand.name.toLowerCase()
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >
                    <span className="font-medium text-sm">{brand.name}</span>
                  </button>
                ))}
              </div>

              {/* Scroll indicators for mobile */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none lg:hidden"></div>
            </div>
          </div>
        </section>

        {/* Frame Styles Section */}
        <section className="mb-6">
          <div className="max-w-7xl mx-auto px-1 sm:px-1 lg:px-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Kiểu dáng kính mát</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
              {frameStyles.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg border transition-all min-w-[80px] ${
                      isSelected
                        ? "bg-blue-50 border-blue-300 text-blue-700 shadow-md"
                        : "bg-white border-gray-200 text-gray-700 hover:border-blue-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="w-12 h-12 mb-2 rounded-full overflow-hidden">
                      <img
                        src={style.image}
                        alt={style.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-medium text-center">{style.name}</span>
                    <span className="text-xs text-gray-500 mt-1">({style.count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* CellphoneS-style Filter Bar */}
        <section className="mb-2 bg-gray-100 border-b border-gray-200 sticky top-16 z-40 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="max-w-7xl mx-auto px-1 sm:px-1 lg:px-2 py-3">
            {/* Active Filters Display */}
            {(selectedBrand !== "all" || selectedStyle !== "all" || selectedMaterial !== "all" || selectedLensColor !== "all" || selectedUVProtection !== "all" || priceRange[1] !== 10000000) && (
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

                {selectedLensColor !== "all" && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    <span>Màu tròng: {lensColors.find(c => c.id === selectedLensColor)?.name}</span>
                    <button
                      onClick={() => setSelectedLensColor("all")}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {selectedUVProtection !== "all" && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    <span>Chống UV: {uvProtections.find(u => u.id === selectedUVProtection)?.name}</span>
                    <button
                      onClick={() => setSelectedUVProtection("all")}
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
                    setSelectedLensColor("all");
                    setSelectedUVProtection("all");
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
                        {(selectedBrand !== "all" || selectedStyle !== "all" || selectedMaterial !== "all" || selectedLensColor !== "all" || selectedUVProtection !== "all" || priceRange[1] !== 10000000) && (
                          <span className="ml-1 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-bold min-w-[20px] text-center">
                            {[selectedBrand !== "all", selectedStyle !== "all", selectedMaterial !== "all", selectedLensColor !== "all", selectedUVProtection !== "all", priceRange[1] !== 10000000].filter(Boolean).length}
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

                            {/* Lens Color Section */}
                            <div className="space-y-3">
                              <button
                                onClick={() => toggleSection('lensColor')}
                                className="flex items-center justify-between w-full text-left"
                              >
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">MÀU TRÒNG</h4>
                                {expandedSections.lensColor ? (
                                  <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.lensColor && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                  {lensColors.map((color) => (
                                    <button
                                      key={color.id}
                                      onClick={() => setSelectedLensColor(color.id)}
                                      className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                        selectedLensColor === color.id
                                          ? "bg-blue-50 border-blue-300 text-blue-700"
                                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                      }`}
                                    >
                                      <span className="font-medium">{color.name}</span>
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
                                        <Sun className="w-4 h-4 mb-1" />
                                        <span className="text-xs font-medium text-center">{style.name}</span>
                                      </button>
                                    ))}
                                  </div>
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
                                setSelectedLensColor("all");
                                setSelectedUVProtection("all");
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
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[95vw] sm:w-[600px] lg:w-[800px] max-h-[80vh] overflow-hidden p-0 bg-white shadow-xl border border-gray-200" align="start">
                    <div className="flex flex-col h-full">
                      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-xl font-bold text-gray-900">Bộ lọc sản phẩm</h3>
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

                          {/* Lens Color Section */}
                          <div className="space-y-3">
                            <button
                              onClick={() => toggleSection('lensColor')}
                              className="flex items-center justify-between w-full text-left"
                            >
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">MÀU TRÒNG</h4>
                              {expandedSections.lensColor ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            {expandedSections.lensColor && (
                              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                {lensColors.map((color) => (
                                  <button
                                    key={color.id}
                                    onClick={() => setSelectedLensColor(color.id)}
                                    className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                      selectedLensColor === color.id
                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="font-medium">{color.name}</span>
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
                                      <Sun className="w-4 h-4 mb-1" />
                                      <span className="text-xs font-medium text-center">{style.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* UV Protection Section */}
                          <div className="space-y-3">
                            <button
                              onClick={() => toggleSection('uvProtection')}
                              className="flex items-center justify-between w-full text-left"
                            >
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">CHỐNG UV</h4>
                              {expandedSections.uvProtection ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            {expandedSections.uvProtection && (
                              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                {uvProtections.map((protection) => (
                                  <button
                                    key={protection.id}
                                    onClick={() => setSelectedUVProtection(protection.id)}
                                    className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                      selectedUVProtection === protection.id
                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="font-medium">{protection.name}</span>
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
                              setSelectedLensColor("all");
                              setSelectedUVProtection("all");
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
                      className="hidden sm:flex flex-shrink-0 items-center gap-2 px-3 py-2 h-9 rounded-lg border border-gray-200 shadow-sm bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Thương hiệu</span>
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
                      className="hidden sm:flex flex-shrink-0 items-center gap-2 px-3 py-2 h-9 rounded-lg border border-gray-200 shadow-sm bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
                    >
                      <Palette className="w-4 h-4" />
                      <span>Màu tròng</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-4">
                    <h4 className="font-semibold mb-3">Chọn màu tròng kính</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {lensColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedLensColor(color.id)}
                          className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all ${
                            selectedLensColor === color.id
                              ? "bg-blue-50 border-blue-300 text-blue-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{color.name}</span>
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
                      <span>Màu tròng</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-80">
                    <SheetHeader>
                      <SheetTitle>Chọn màu tròng kính</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                      {lensColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedLensColor(color.id)}
                          className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all ${
                            selectedLensColor === color.id
                              ? "bg-green-50 border-green-300 text-green-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{color.name}</span>
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
                      <Shield className="w-4 h-4" />
                      <span>Chống UV</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-80">
                    <SheetHeader>
                      <SheetTitle>Chọn mức chống UV</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                      {uvProtections.map((protection) => (
                        <button
                          key={protection.id}
                          onClick={() => setSelectedUVProtection(protection.id)}
                          className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all ${
                            selectedUVProtection === protection.id
                              ? "bg-green-50 border-green-300 text-green-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{protection.name}</span>
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
                      <Sun className="w-4 h-4" />
                      <span>Kiểu dáng</span>
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
                  Xem thêm (467+ sản phẩm)
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">Kính Mát Chính Hãng - Bảo Vệ Đôi Mắt Với Phong Cách</h2>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Khám phá bộ sưu tập kính mát đa dạng và chất lượng cao tại cửa hàng của chúng tôi. Từ các thương hiệu nổi tiếng thế giới như Ray-Ban, Oakley, Gucci đến những thiết kế hiện đại, chúng tôi mang đến cho bạn những lựa chọn hoàn hảo cho mọi phong cách và nhu cầu bảo vệ mắt.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tại sao ch���n kính mát của chúng tôi?</h3>

                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Chống tia UV hoàn hảo:</strong> UV400, Polarized và các công nghệ tiên tiến</li>
                  <li><strong>Thiết kế đa dạng:</strong> Từ cổ điển đến thời trang, phù hợp mọi khuôn mặt</li>
                  <li><strong>Thương hiệu uy tín:</strong> Ray-Ban, Oakley, Gucci, Prada, Tom Ford</li>
                  <li><strong>Chất lượng cao cấp:</strong> Kính cường lực, gọng bền, thiết kế ergonomic</li>
                  <li><strong>Bảo hành chính hãng:</strong> Cam kết chất lượng và dịch vụ sau bán hàng</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Các kiểu dáng phổ biến</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <h4 className="font-medium mb-2">Aviator (Phi công)</h4>
                    <p className="text-sm">Kiểu dáng cổ điển, phù hợp với mọi khuôn mặt và phong cách.</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Wayfarer</h4>
                    <p className="text-sm">Thiết kế vuông vức cá tính, thích hợp cho nam và nữ.</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Cat-eye (Mắt mèo)</h4>
                    <p className="text-sm">Thiết kế nữ tính, tôn lên nét quyến rũ và thời trang.</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Sport/Wraparound</h4>
                    <p className="text-sm">Thiết kế thể thao, bảo vệ tối đa cho các hoạt động ngoài trời.</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Lời khuyên:</strong> Hãy đến trực tiếp cửa hàng để được tư vấn và thử kính mát phù hợp nhất với khuôn mặt và nhu cầu sử dụng của bạn. Chúng tôi cũng cung cấp dịch vụ kiểm tra UV và tư vấn chuyên nghiệp.
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

export default Sunglasses;
