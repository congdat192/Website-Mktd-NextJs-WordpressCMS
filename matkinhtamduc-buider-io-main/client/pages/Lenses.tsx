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
  Shield,
  Monitor,
  Lightbulb,
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
  lensType: string;
  coating: string;
  index: string;
  diameter: string;
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

interface LensType {
  id: string;
  name: string;
  image: string;
  count: number;
}

const Lenses = () => {
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedLensType, setSelectedLensType] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("popular");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [selectedCoating, setSelectedCoating] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState("all");
  const [selectedDiameter, setSelectedDiameter] = useState("all");
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Collapsible filter sections state
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    lensType: true,
    coating: true,
    index: true,
    diameter: true,
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

  // Sample data for lenses
  const products: Product[] = [
    {
      id: "1",
      name: "Tròng Kính Cận Essilor Varilux Comfort Max",
      brand: "Essilor",
      price: 4500000,
      originalPrice: 5200000,
      rating: 4.9,
      reviewCount: 234,
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&h=500&fit=crop",
      material: "Polycarbonate",
      lensType: "Đa tròng",
      coating: "Chống phản quang",
      index: "1.67",
      diameter: "65mm",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["Chống tia UV", "Chống trầy xước", "Chống phản quang"],
      colors: ["Trong suốt", "Tím nhạt"],
      discount: 13
    },
    {
      id: "2",
      name: "Tròng Kính Zeiss Single Vision",
      brand: "Zeiss",
      price: 3200000,
      originalPrice: 3800000,
      rating: 4.8,
      reviewCount: 189,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop",
      material: "Mineral",
      lensType: "Đơn tròng",
      coating: "DuraVision Platinum",
      index: "1.5",
      diameter: "70mm",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["Chống bụi", "Chống nước", "Chống dầu"],
      colors: ["Trong suốt"],
      discount: 16
    },
    {
      id: "3",
      name: "Tròng Kính Hoya Sensity",
      brand: "Hoya",
      price: 5800000,
      rating: 4.7,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1556306545-d1928e16e93b?w=500&h=500&fit=crop",
      material: "Trivex",
      lensType: "Đổi màu",
      coating: "HiVision LongLife",
      index: "1.59",
      diameter: "65mm",
      isOnSale: false,
      isNew: true,
      isHotDeal: false,
      features: ["Tự động đổi màu", "Chống tia UV", "Siêu nhẹ"],
      colors: ["Xám", "Nâu"]
    },
    {
      id: "4",
      name: "Tròng Kính Nikon Presio W3+",
      brand: "Nikon",
      price: 6200000,
      originalPrice: 7000000,
      rating: 4.8,
      reviewCount: 98,
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop",
      material: "High Index",
      lensType: "Đa tròng",
      coating: "SeeCoat Plus",
      index: "1.74",
      diameter: "60mm",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["Siêu mỏng", "Chống ánh sáng xanh", "Chống phản quang"],
      colors: ["Trong suốt", "Xanh nhạt"],
      discount: 11
    },
    {
      id: "5",
      name: "Tròng Kính Rodenstock X-tra Clean",
      brand: "Rodenstock",
      price: 3800000,
      rating: 4.6,
      reviewCount: 134,
      image: "https://images.unsplash.com/photo-1620987278429-ab178d6eb547?w=500&h=500&fit=crop",
      material: "CR-39",
      lensType: "Đơn tròng",
      coating: "Clean Coat",
      index: "1.6",
      diameter: "72mm",
      isOnSale: false,
      isNew: true,
      isHotDeal: false,
      features: ["Dễ vệ sinh", "Chống bụi", "Chống tĩnh điện"],
      colors: ["Trong suốt"]
    },
    {
      id: "6",
      name: "Tròng Kính Seiko Addpower",
      brand: "Seiko",
      price: 2800000,
      originalPrice: 3200000,
      rating: 4.5,
      reviewCount: 167,
      image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=500&h=500&fit=crop",
      material: "Polycarbonate",
      lensType: "Chống mỏi mắt",
      coating: "Super Resistant Coat",
      index: "1.67",
      diameter: "68mm",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["Chống ánh sáng xanh", "Gi��m mỏi mắt", "Độ bền cao"],
      colors: ["Trong suốt", "Vàng nhạt"],
      discount: 13
    },
    {
      id: "7",
      name: "Tròng Kính Pentax Ultra Blue",
      brand: "Pentax",
      price: 1800000,
      originalPrice: 2100000,
      rating: 4.4,
      reviewCount: 89,
      image: "https://images.unsplash.com/photo-1599446820518-0de31c8bfab0?w=500&h=500&fit=crop",
      material: "Organic",
      lensType: "Chống ánh sáng xanh",
      coating: "Multi Coat",
      index: "1.56",
      diameter: "70mm",
      isOnSale: true,
      isNew: false,
      isHotDeal: false,
      features: ["L���c ánh sáng xanh", "Bảo vệ mắt", "Giá rẻ"],
      colors: ["Trong suốt"],
      discount: 14
    },
    {
      id: "8",
      name: "Tròng Kính Indo Aspherical",
      brand: "Indo",
      price: 1200000,
      rating: 4.2,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop",
      material: "CR-39",
      lensType: "Đơn tròng",
      coating: "Hard Multi Coat",
      index: "1.5",
      diameter: "75mm",
      isOnSale: false,
      isNew: false,
      isHotDeal: false,
      features: ["Giá rẻ", "Chất lượng tốt", "B���o hành 1 năm"],
      colors: ["Trong suốt"]
    },
    {
      id: "9",
      name: "Tròng Kính Chemi Blue Light Cut",
      brand: "Chemi",
      price: 950000,
      originalPrice: 1200000,
      rating: 4.1,
      reviewCount: 203,
      image: "https://images.unsplash.com/photo-1506629905333-89e25e24c3ae?w=500&h=500&fit=crop",
      material: "PC",
      lensType: "Chống ánh sáng xanh",
      coating: "Blue Cut",
      index: "1.59",
      diameter: "70mm",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["Chống ánh sáng xanh", "Giá rẻ", "Phù hợp dân văn phòng"],
      colors: ["Trong suốt", "Vàng nhạt"],
      discount: 21
    },
    {
      id: "10",
      name: "Tròng Kính Kodak Precise PGX",
      brand: "Kodak",
      price: 4200000,
      originalPrice: 4800000,
      rating: 4.7,
      reviewCount: 112,
      image: "https://images.unsplash.com/photo-1571019613531-85d32b3b2c80?w=500&h=500&fit=crop",
      material: "High Index",
      lensType: "Đa tròng",
      coating: "Clean n Clear",
      index: "1.74",
      diameter: "60mm",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["Siêu mỏng", "Chống phản quang", "Chống trầy"],
      colors: ["Trong suốt"],
      discount: 13
    },
    {
      id: "11",
      name: "Tròng Kính Younger Optics NuPolar",
      brand: "Younger",
      price: 3600000,
      rating: 4.5,
      reviewCount: 87,
      image: "https://images.unsplash.com/photo-1574027542338-98e75410c3c8?w=500&h=500&fit=crop",
      material: "Trivex",
      lensType: "Phân cực",
      coating: "NuCoat",
      index: "1.53",
      diameter: "65mm",
      isOnSale: false,
      isNew: true,
      isHotDeal: false,
      features: ["Phân cực", "Siêu bền", "Chống va đập"],
      colors: ["Xám", "Nâu", "Xanh"]
    },
    {
      id: "12",
      name: "Tròng Kính Shamir Autograph III",
      brand: "Shamir",
      price: 7800000,
      originalPrice: 8900000,
      rating: 4.9,
      reviewCount: 67,
      image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&h=500&fit=crop",
      material: "High Index",
      lensType: "Đa tròng cá nhân",
      coating: "Glacier Plus",
      index: "1.67",
      diameter: "60mm",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["Thiết kế cá nhân", "AI tối ưu", "Siêu sắc nét"],
      colors: ["Trong suốt"],
      discount: 12
    },
    {
      id: "13",
      name: "Tròng Kính BBGR Office Pro",
      brand: "BBGR",
      price: 2200000,
      rating: 4.3,
      reviewCount: 145,
      image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&h=500&fit=crop",
      material: "CR-39",
      lensType: "Văn phòng",
      coating: "Office Coat",
      index: "1.56",
      diameter: "68mm",
      isOnSale: false,
      isNew: true,
      isHotDeal: false,
      features: ["Chống ánh sáng xanh", "Giảm mỏi mắt", "Phù hợp dân VP"],
      colors: ["Trong suốt", "Vàng nhạt"]
    },
    {
      id: "14",
      name: "Tròng Kính Tokai Lutina",
      brand: "Tokai",
      price: 5200000,
      originalPrice: 6000000,
      rating: 4.8,
      reviewCount: 98,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
      material: "High Index",
      lensType: "Chống ánh sáng xanh",
      coating: "TRC",
      index: "1.76",
      diameter: "58mm",
      isOnSale: true,
      isNew: false,
      isHotDeal: true,
      features: ["Siêu mỏng", "Ch��ng ánh sáng xanh", "Made in Japan"],
      colors: ["Trong suốt", "Vàng nhạt"],
      discount: 13
    },
    {
      id: "15",
      name: "Tròng Kính Norville Bluemax",
      brand: "Norville",
      price: 1600000,
      originalPrice: 1900000,
      rating: 4.2,
      reviewCount: 123,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop",
      material: "Polycarbonate",
      lensType: "Chống ánh sáng xanh",
      coating: "Blue Block",
      index: "1.59",
      diameter: "70mm",
      isOnSale: true,
      isNew: false,
      isHotDeal: false,
      features: ["Chống ánh sáng xanh", "Giá tốt", "Chất lượng ổn"],
      colors: ["Trong suốt"],
      discount: 16
    },
    {
      id: "16",
      name: "Tròng Kính Cyxus Gaming Pro",
      brand: "Cyxus",
      price: 800000,
      originalPrice: 1000000,
      rating: 4.0,
      reviewCount: 187,
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500&h=500&fit=crop",
      material: "PC",
      lensType: "Gaming",
      coating: "Blue Light Filter",
      index: "1.56",
      diameter: "72mm",
      isOnSale: true,
      isNew: false,
      isHotDeal: false,
      features: ["Chống ánh sáng xanh", "Chuyên game", "Giá rẻ"],
      colors: ["Trong suốt", "Vàng"],
      discount: 20
    }
  ];

  const hotDealProducts = products.filter(product => product.isHotDeal);

  const brands: Brand[] = [
    { id: "essilor", name: "Essilor", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 46 },
    { id: "zeiss", name: "Zeiss", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 38 },
    { id: "hoya", name: "Hoya", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 32 },
    { id: "nikon", name: "Nikon", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 28 },
    { id: "rodenstock", name: "Rodenstock", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 24 },
    { id: "seiko", name: "Seiko", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 22 },
    { id: "kodak", name: "Kodak", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 18 },
    { id: "chemi", name: "Chemi", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=50&fit=crop", count: 15 }
  ];

  const lensTypes: LensType[] = [
    { id: "single", name: "Đơn tròng", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=100&h=100&fit=crop", count: 45 },
    { id: "progressive", name: "Đa tròng", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop", count: 32 },
    { id: "blue-light", name: "Chống ánh sáng xanh", image: "https://images.unsplash.com/photo-1556306545-d1928e16e93b?w=100&h=100&fit=crop", count: 38 },
    { id: "photochromic", name: "Đổi màu", image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=100&h=100&fit=crop", count: 25 },
    { id: "office", name: "Văn phòng", image: "https://images.unsplash.com/photo-1620987278429-ab178d6eb547?w=100&h=100&fit=crop", count: 28 },
    { id: "gaming", name: "Gaming", image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=100&h=100&fit=crop", count: 18 }
  ];

  const materials = [
    { id: "all", name: "Tất cả" },
    { id: "cr39", name: "CR-39" },
    { id: "polycarbonate", name: "Polycarbonate" },
    { id: "trivex", name: "Trivex" },
    { id: "high-index", name: "High Index" },
    { id: "mineral", name: "Mineral" }
  ];

  const coatings = [
    { id: "all", name: "Tất cả" },
    { id: "anti-reflection", name: "Chống phản quang" },
    { id: "blue-light", name: "Chống ánh sáng xanh" },
    { id: "scratch-resistant", name: "Chống trầy xước" },
    { id: "uv-protection", name: "Chống tia UV" },
    { id: "easy-clean", name: "Dễ vệ sinh" }
  ];

  const indexes = [
    { id: "all", name: "Tất cả" },
    { id: "1.5", name: "1.5 (Standard)" },
    { id: "1.56", name: "1.56 (Mid Index)" },
    { id: "1.59", name: "1.59 (Mid Index)" },
    { id: "1.6", name: "1.6 (High Index)" },
    { id: "1.67", name: "1.67 (High Index)" },
    { id: "1.74", name: "1.74 (Ultra High)" },
    { id: "1.76", name: "1.76 (Ultra High)" }
  ];

  const diameters = [
    { id: "all", name: "Tất cả" },
    { id: "small", name: "Nhỏ (< 60mm)" },
    { id: "medium", name: "Vừa (60-70mm)" },
    { id: "large", name: "Lớn (> 70mm)" }
  ];

  const banners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=400&fit=crop",
      title: "Tròng Kính Chất Lượng Cao",
      subtitle: "Bảo vệ đôi mắt với công nghệ tiên tiến"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&h=400&fit=crop",
      title: "Thương Hiệu Uy Tín",
      subtitle: "Essilor, Zeiss, Hoya và nhiều hơn"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1556306545-d1928e16e93b?w=1200&h=400&fit=crop",
      title: "Công Nghệ Mới Nhất",
      subtitle: "Chống ánh sáng xanh, đa tròng hiện đại"
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
    const lensTypeMatch = selectedLensType === "all" || product.lensType === selectedLensType;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    const materialMatch = selectedMaterial === "all" || product.material === selectedMaterial;
    const coatingMatch = selectedCoating === "all" || product.coating === selectedCoating;
    const indexMatch = selectedIndex === "all" || product.index === selectedIndex;
    const diameterMatch = selectedDiameter === "all" || product.diameter === selectedDiameter;

    if (selectedFilter === "sale") return product.isOnSale && brandMatch && lensTypeMatch && priceMatch && materialMatch && coatingMatch && indexMatch && diameterMatch;
    if (selectedFilter === "new") return product.isNew && brandMatch && lensTypeMatch && priceMatch && materialMatch && coatingMatch && indexMatch && diameterMatch;

    return brandMatch && lensTypeMatch && priceMatch && materialMatch && coatingMatch && indexMatch && diameterMatch;
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
            <span className="text-gray-900 font-medium">Tròng kính</span>
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
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Thương hiệu tròng kính</h2>

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

        {/* Lens Types Section */}
        <section className="mb-6">
          <div className="max-w-7xl mx-auto px-1 sm:px-1 lg:px-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Loại tròng kính</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-3">
              {lensTypes.map((type) => {
                const isSelected = selectedLensType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedLensType(type.id)}
                    className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg border transition-all min-w-[80px] ${
                      isSelected
                        ? "bg-blue-50 border-blue-300 text-blue-700 shadow-md"
                        : "bg-white border-gray-200 text-gray-700 hover:border-blue-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="w-12 h-12 mb-2 rounded-full overflow-hidden">
                      <img
                        src={type.image}
                        alt={type.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-medium text-center">{type.name}</span>
                    <span className="text-xs text-gray-500 mt-1">({type.count})</span>
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
            {(selectedBrand !== "all" || selectedLensType !== "all" || selectedMaterial !== "all" || selectedCoating !== "all" || selectedIndex !== "all" || selectedDiameter !== "all" || priceRange[1] !== 10000000) && (
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

                {selectedLensType !== "all" && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    <span>Loại tròng: {lensTypes.find(t => t.id === selectedLensType)?.name}</span>
                    <button
                      onClick={() => setSelectedLensType("all")}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {selectedCoating !== "all" && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    <span>Coating: {coatings.find(c => c.id === selectedCoating)?.name}</span>
                    <button
                      onClick={() => setSelectedCoating("all")}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {selectedIndex !== "all" && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    <span>Chỉ số: {indexes.find(i => i.id === selectedIndex)?.name}</span>
                    <button
                      onClick={() => setSelectedIndex("all")}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {selectedDiameter !== "all" && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    <span>Đường kính: {diameters.find(d => d.id === selectedDiameter)?.name}</span>
                    <button
                      onClick={() => setSelectedDiameter("all")}
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
                    setSelectedLensType("all");
                    setSelectedMaterial("all");
                    setSelectedCoating("all");
                    setSelectedIndex("all");
                    setSelectedDiameter("all");
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

                            {/* Lens Type Section */}
                            <div className="space-y-3">
                              <button
                                onClick={() => toggleSection('lensType')}
                                className="flex items-center justify-between w-full text-left"
                              >
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">LOẠI TRÒNG</h4>
                                {expandedSections.lensType ? (
                                  <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.lensType && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                  <button
                                    onClick={() => setSelectedLensType("all")}
                                    className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                      selectedLensType === "all"
                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="font-medium">Tất cả</span>
                                  </button>
                                  <div className="grid grid-cols-2 gap-2">
                                    {lensTypes.map((type) => (
                                      <button
                                        key={type.id}
                                        onClick={() => setSelectedLensType(type.id)}
                                        className={`flex flex-col items-center p-2 rounded-lg border transition-all duration-200 ${
                                          selectedLensType === type.id
                                            ? "bg-blue-50 border-blue-300 text-blue-700"
                                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                        }`}
                                      >
                                        <Glasses className="w-4 h-4 mb-1" />
                                        <span className="text-xs font-medium text-center">{type.name}</span>
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
                                setSelectedLensType("all");
                                setSelectedMaterial("all");
                                setSelectedCoating("all");
                                setSelectedIndex("all");
                                setSelectedDiameter("all");
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

                          {/* Lens Type Section */}
                          <div className="space-y-3">
                            <button
                              onClick={() => toggleSection('lensType')}
                              className="flex items-center justify-between w-full text-left"
                            >
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">LOẠI TRÒNG</h4>
                              {expandedSections.lensType ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            {expandedSections.lensType && (
                              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                <button
                                  onClick={() => setSelectedLensType("all")}
                                  className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                    selectedLensType === "all"
                                      ? "bg-blue-50 border-blue-300 text-blue-700"
                                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  <span className="font-medium">Tất cả</span>
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                  {lensTypes.map((type) => (
                                    <button
                                      key={type.id}
                                      onClick={() => setSelectedLensType(type.id)}
                                      className={`flex flex-col items-center p-2 rounded-lg border transition-all duration-200 ${
                                        selectedLensType === type.id
                                          ? "bg-blue-50 border-blue-300 text-blue-700"
                                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                      }`}
                                    >
                                      <Glasses className="w-4 h-4 mb-1" />
                                      <span className="text-xs font-medium text-center">{type.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Coating Section */}
                          <div className="space-y-3">
                            <button
                              onClick={() => toggleSection('coating')}
                              className="flex items-center justify-between w-full text-left"
                            >
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">COATING</h4>
                              {expandedSections.coating ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            {expandedSections.coating && (
                              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                {coatings.map((coating) => (
                                  <button
                                    key={coating.id}
                                    onClick={() => setSelectedCoating(coating.id)}
                                    className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                      selectedCoating === coating.id
                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="font-medium">{coating.name}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Index Section */}
                          <div className="space-y-3">
                            <button
                              onClick={() => toggleSection('index')}
                              className="flex items-center justify-between w-full text-left"
                            >
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">CHỈ SỐ</h4>
                              {expandedSections.index ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            {expandedSections.index && (
                              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                {indexes.map((index) => (
                                  <button
                                    key={index.id}
                                    onClick={() => setSelectedIndex(index.id)}
                                    className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                      selectedIndex === index.id
                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="font-medium">{index.name}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Diameter Section */}
                          <div className="space-y-3">
                            <button
                              onClick={() => toggleSection('diameter')}
                              className="flex items-center justify-between w-full text-left"
                            >
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">ĐƯỜNG KÍNH</h4>
                              {expandedSections.diameter ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            {expandedSections.diameter && (
                              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                {diameters.map((diameter) => (
                                  <button
                                    key={diameter.id}
                                    onClick={() => setSelectedDiameter(diameter.id)}
                                    className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                      selectedDiameter === diameter.id
                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="font-medium">{diameter.name}</span>
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
                              setSelectedLensType("all");
                              setSelectedMaterial("all");
                              setSelectedCoating("all");
                              setSelectedIndex("all");
                              setSelectedDiameter("all");
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
                      <Glasses className="w-4 h-4" />
                      <span>Loại tròng</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <h4 className="font-semibold mb-3">Chọn loại tròng kính</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      <button
                        onClick={() => setSelectedLensType("all")}
                        className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all ${
                          selectedLensType === "all"
                            ? "bg-blue-50 border-blue-300 text-blue-700"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span>Tất cả</span>
                      </button>
                      {lensTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedLensType(type.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                            selectedLensType === type.id
                              ? "bg-blue-50 border-blue-300 text-blue-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{type.name}</span>
                          <span className="text-xs text-gray-500">({type.count})</span>
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
                      <Glasses className="w-4 h-4" />
                      <span>Loại tròng</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-80">
                    <SheetHeader>
                      <SheetTitle>Chọn loại tròng kính</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                      <button
                        onClick={() => setSelectedLensType("all")}
                        className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all ${
                          selectedLensType === "all"
                            ? "bg-green-50 border-green-300 text-green-700"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span>Tất cả</span>
                      </button>
                      {lensTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedLensType(type.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                            selectedLensType === type.id
                              ? "bg-green-50 border-green-300 text-green-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{type.name}</span>
                          <span className="text-xs text-gray-500">({type.count})</span>
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
                      <span>Coating</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-80">
                    <SheetHeader>
                      <SheetTitle>Chọn loại coating</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                      {coatings.map((coating) => (
                        <button
                          key={coating.id}
                          onClick={() => setSelectedCoating(coating.id)}
                          className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all ${
                            selectedCoating === coating.id
                              ? "bg-green-50 border-green-300 text-green-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{coating.name}</span>
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
                      <Ruler className="w-4 h-4" />
                      <span>Chỉ số</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-80">
                    <SheetHeader>
                      <SheetTitle>Chọn chỉ số khúc xạ</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                      {indexes.map((index) => (
                        <button
                          key={index.id}
                          onClick={() => setSelectedIndex(index.id)}
                          className={`w-full flex items-center px-3 py-2 rounded-lg border transition-all ${
                            selectedIndex === index.id
                              ? "bg-green-50 border-green-300 text-green-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{index.name}</span>
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tròng Kính Chất Lượng Cao - Bảo Vệ Đôi Mắt Với Công Nghệ Tiên Tiến</h2>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Khám phá bộ sưu tập tròng kính đa dạng và chất lượng cao tại cửa hàng của chúng tôi. Từ các thương hiệu nổi tiếng thế giới như Essilor, Zeiss, Hoya ��ến những công nghệ tiên tiến nhất, chúng tôi mang đến cho bạn những lựa chọn hoàn hảo cho mọi nhu cầu thị lực.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tại sao chọn tròng kính của chúng tôi?</h3>

                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Thương hiệu uy tín:</strong> Essilor, Zeiss, Hoya, Nikon, Rodenstock</li>
                  <li><strong>Công nghệ tiên tiến:</strong> Chống ánh sáng xanh, đa tròng, đổi màu</li>
                  <li><strong>Chất liệu cao cấp:</strong> Polycarbonate, Trivex, High Index</li>
                  <li><strong>Coating đa dạng:</strong> Chống phản quang, chống trầy, dễ vệ sinh</li>
                  <li><strong>Tư vấn chuyên nghiệp:</strong> Đội ngũ nhân viên giàu kinh nghiệm</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Các loại tròng kính phổ biến</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <h4 className="font-medium mb-2">Đơn tròng (Single Vision)</h4>
                    <p className="text-sm">Ph�� hợp cho cận thị, viễn thị hoặc loạn thị đơn thuần.</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Đa tròng (Progressive)</h4>
                    <p className="text-sm">Giải pháp hoàn hảo cho lão thị, nhìn rõ mọi khoảng cách.</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Chống ánh sáng xanh</h4>
                    <p className="text-sm">Bảo vệ mắt khỏi tác hại của màn hình máy tính và điện thoại.</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Đổi màu (Photochromic)</h4>
                    <p className="text-sm">Tự động thay đổi màu sắc theo điều kiện ánh sáng.</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Lời khuyên:</strong> Hãy đến trực tiếp cửa hàng để được tư vấn và đo độ chính xác nhất. Chúng tôi cũng cung cấp dịch vụ kiểm tra mắt và tư vấn chọn tròng kính phù hợp với nhu cầu sử dụng c���a bạn.
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

export default Lenses;
