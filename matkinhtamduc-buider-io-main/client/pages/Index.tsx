import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Eye,
  Star,
  MapPin,
  Shield,
  Award,
  Users,
  Calendar,
  ArrowRight,
  Play,
  CheckCircle,
  Clock,
  Phone,
  Glasses,
  Heart,
  Camera,
  Sun,
  ShoppingBag,
  Truck,
  CreditCard,
  Mail,
  Quote,
  ChevronRight,
  Building2,
  Gift,
  Send,
  Target,
  TrendingUp,
  Gem,
  Coffee,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Timer,
  Percent,
  BookOpen,
  ExternalLink,
  Star as StarIcon,
  ChevronLeft,
  Headphones,
  Sparkles,
  Zap,
  Lightbulb,
  ThumbsUp,
  Gauge,
  Microscope,
  Stethoscope,
  Hammer,
  Search,
  Store,
  BadgeCheck,
  PhoneCall,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MobileFrameBrandsCarousel = () => {
  const [scrollPos, setScrollPos] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const frameBrands = [
    { logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1580704982984-ebccc8f83ba7?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1606590098283-3562d9f7f355?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1606590098283-3562d9f7f355?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1580704982984-ebccc8f83ba7?w=200&auto=format&fit=crop&q=80" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        const logoWidth = 152; // 140 + 12px gap
        const logosPerRow = 2;
        const scrollAmount = logoWidth * logosPerRow;
        const maxScroll = logoWidth * (frameBrands.length / 2 - 1);
        const nextPos = scrollPos + scrollAmount;

        if (nextPos > maxScroll) {
          setScrollPos(0);
        } else {
          setScrollPos(nextPos);
        }
      }, 2000);
      return () => clearInterval(interval);
    }, 2000);

    return () => clearTimeout(timer);
  }, [scrollPos, frameBrands.length]);

  return (
    <div className="overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${scrollPos}px)` }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 140px)', gap: '12px', width: 'fit-content' }}>
          {frameBrands.map((brand, i) => (
            <img
              key={i}
              src={brand.logo}
              alt={`Frame brand logo ${i + 1}`}
              className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              style={{ width: '140px', height: '90px', objectFit: 'contain', padding: '8px' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MobileLensBrandsCarousel = () => {
  const [scrollPos, setScrollPos] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const lensBrands = [
    { logo: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1606590098283-3562d9f7f355?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1580704982984-ebccc8f83ba7?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1606590098283-3562d9f7f355?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1580704982984-ebccc8f83ba7?w=200&auto=format&fit=crop&q=80" },
    { logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&auto=format&fit=crop&q=80" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        const logoWidth = 152; // 140 + 12px gap
        const logosPerRow = 2;
        const scrollAmount = logoWidth * logosPerRow;
        const maxScroll = logoWidth * (lensBrands.length / 2 - 1);
        const nextPos = scrollPos + scrollAmount;

        if (nextPos > maxScroll) {
          setScrollPos(0);
        } else {
          setScrollPos(nextPos);
        }
      }, 2000);
      return () => clearInterval(interval);
    }, 2000);

    return () => clearTimeout(timer);
  }, [scrollPos, lensBrands.length]);

  return (
    <div className="overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${scrollPos}px)` }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 140px)', gap: '12px', width: 'fit-content' }}>
          {lensBrands.map((brand, i) => (
            <img
              key={i}
              src={brand.logo}
              alt={`Lens brand logo ${i + 1}`}
              className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              style={{ width: '140px', height: '90px', objectFit: 'contain', padding: '8px' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Homepage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();

  const brandPrimary = "#1B5E20";
  const [timeLeft, setTimeLeft] = useState<{d:number;h:number;m:number;s:number}>({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 14);
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target.getTime() - now);
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff / 3600000) % 24);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const hero = {
    headline: "Sắm kính chuẩn – Bảo vệ ��ôi mắt bạn",
    sub: "Dịch vụ khám mắt chuẩn, gọng kính thời trang, tròng kính chính hãng.",
  } as const;

  // Prefer store-interior images (multiple fallbacks to ensure it always loads)
  const storeImages = [
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520975922203-b6ea1b2463f2?w=1600&auto=format&fit=crop&q=80",
    "https://images.pexels.com/photos/3736244/pexels-photo-3736244.jpeg?w=1600&auto=compress&cs=tinysrgb"
  ];
  const [heroSrc, setHeroSrc] = useState<string>(storeImages[0]);
  const onHeroImgError = () => {
    const idx = storeImages.indexOf(heroSrc);
    if (idx < storeImages.length - 1) setHeroSrc(storeImages[idx + 1]);
    else setHeroSrc("/placeholder.svg");
  };

  type SProduct = {
    id: string;
    name: string;
    brand: string;
    image: string;
    price: number;
    originalPrice?: number;
    category: string;
    isOnSale?: boolean;
    isNew?: boolean;
    discount?: number;
    colors?: string[];
  };

  // Mockup featured products data matching Frames page structure
  const mockProducts: SProduct[] = [
    // Frames (Gọng kính)
    {
      id: "1",
      name: "Gọng Kính Ray-Ban Classic Aviator TF5025",
      brand: "Ray-Ban",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80",
      price: 2500000,
      originalPrice: 3200000,
      category: "frames",
      isOnSale: true,
      discount: 22,
      colors: ["#000000", "#8B4513", "#4169E1", "#DC143C", "#FFD700"]
    },
    {
      id: "2",
      name: "Gọng Kính Tom Ford Vintage Round TF5294",
      brand: "Tom Ford",
      image: "https://images.unsplash.com/photo-1580704982984-ebccc8f83ba7?w=600&auto=format&fit=crop&q=80",
      price: 3500000,
      category: "frames",
      isNew: true,
      colors: ["#000000", "#654321", "#B8860B", "#2F4F4F", "#8B0000"]
    },
    {
      id: "3",
      name: "Gọng Kính Dior Essence DT0284",
      brand: "Dior",
      image: "https://images.unsplash.com/photo-1571478942049-d69ea9360f61?w=600&auto=format&fit=crop&q=80",
      price: 7200000,
      category: "frames",
      isNew: true,
      colors: ["#000000", "#C0C0C0", "#FFD700", "#FF69B4", "#9370DB"]
    },
    {
      id: "4",
      name: "Gọng Kính Oakley Sport Flex OX8156",
      brand: "Oakley",
      image: "https://images.unsplash.com/photo-1606590098283-3562d9f7f355?w=600&auto=format&fit=crop&q=80",
      price: 1600000,
      originalPrice: 2100000,
      category: "frames",
      isOnSale: true,
      discount: 24,
      colors: ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFFFF"]
    },

    // Lenses (Tròng kính)
    {
      id: "5",
      name: "Tròng kính chống ánh sáng xanh Premium Essilor",
      brand: "Essilor",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80",
      price: 890000,
      category: "lenses",
      isNew: true,
      colors: ["#E6F3FF", "#D4E6F1", "#AED6F1"]
    },
    {
      id: "6",
      name: "Tròng kính đổi màu Transitions Zeiss",
      brand: "Zeiss",
      image: "https://images.unsplash.com/photo-1580704982984-ebccc8f83ba7?w=600&auto=format&fit=crop&q=80",
      price: 1520000,
      originalPrice: 1790000,
      category: "lenses",
      isOnSale: true,
      discount: 15,
      colors: ["#F5F5F5", "#D3D3D3", "#A9A9A9"]
    },
    {
      id: "7",
      name: "Tròng kính cận viễn đa tròng Hoya",
      brand: "Hoya",
      image: "https://images.unsplash.com/photo-1571478942049-d69ea9360f61?w=600&auto=format&fit=crop&q=80",
      price: 2190000,
      category: "lenses",
      colors: ["#FFFFFF", "#F0F0F0", "#E0E0E0"]
    },

    // Sunglasses (Kính mát)
    {
      id: "8",
      name: "Kính mát Ray-Ban Polarized UV400",
      brand: "Ray-Ban",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80",
      price: 1490000,
      category: "sunglasses",
      isNew: true,
      colors: ["#000000", "#8B4513", "#2F4F4F", "#556B2F", "#8B0000"]
    },
    {
      id: "9",
      name: "Kính mát Oakley Sport Aviator",
      brand: "Oakley",
      image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80",
      price: 1600000,
      originalPrice: 1890000,
      category: "sunglasses",
      isOnSale: true,
      discount: 15,
      colors: ["#000000", "#C0C0C0", "#4169E1", "#FF4500", "#32CD32"]
    },
    {
      id: "10",
      name: "Kính mát Gucci Square Classic",
      brand: "Gucci",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
      price: 2490000,
      category: "sunglasses",
      colors: ["#000000", "#8B4513", "#FFD700", "#DC143C", "#00CED1"]
    },

    // Kids (Kính trẻ em)
    {
      id: "11",
      name: "Gọng kính trẻ em Nike Kids chống va đập",
      brand: "Nike Kids",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80",
      price: 690000,
      category: "kids",
      isNew: true,
      colors: ["#FF69B4", "#87CEEB", "#32CD32", "#FFD700", "#FF6347"]
    },
    {
      id: "12",
      name: "Kính mát trẻ em Disney UV Protection",
      brand: "Disney Junior",
      image: "https://images.unsplash.com/photo-1605585103174-c5e6c59e5f01?w=600&auto=format&fit=crop&q=80",
      price: 590000,
      category: "kids",
      colors: ["#FF1493", "#00BFFF", "#FFD700", "#7FFF00", "#FF69B4"]
    },
  ];

  const formatPrice = (price: number | undefined) => {
    const safePrice = price || 0;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(safePrice);
  };

  const [featured, setFeatured] = useState<SProduct[]>(mockProducts);
  useEffect(() => {
    (async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data } = await supabase.from("products").select("id,name,brand,image,base_price,category").limit(12);
        if (data && data.length > 0) {
          setFeatured(data.map((p: any) => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            image: p.image || "/placeholder.svg",
            price: Number(p.base_price) || 0,
            originalPrice: p.original_price ? Number(p.original_price) : undefined,
            category: p.category || 'frames',
            isOnSale: p.is_on_sale || false,
            isNew: p.is_new || false,
            discount: p.discount || 0,
            colors: p.colors || []
          })));
        }
      } catch {
        // Keep mockup data if fetch fails
      }
    })();
  }, []);

  // Product grid filters state
  const [tab, setTab] = useState<'frames' | 'lenses'>('frames');
  const [shapeFilter, setShapeFilter] = useState<'chu-nhat' | 'tron' | 'vuong' | 'oval' | 'mat-meo' | null>(null);
  const [lensFilter, setLensFilter] = useState<'anh-sang-xanh' | 'doi-mau' | 'sieu-mong' | 'da-trong' | 'kiem-soat-can-thi' | 'chong-be' | 'lai-xe' | null>(null);
  const [brandFilter, setBrandFilter] = useState<string | null>(null);

  useEffect(()=>{ setShapeFilter(null); setLensFilter(null); setBrandFilter(null); }, [tab]);

  const framesBrandList = ['Ray-Ban','Oakley','Gucci','Prada','Tom Ford','Cartier','Boss','Versace'];
  const lensesBrandList = ['Essilor','Zeiss','Hoya','Nikon','Rodenstock','Seiko','Pentax','Indo','Chemi','Kodak','Younger','Shamir','BBGR','Tokai','Norville','Cyxus'];

  const inferShape = (name: string): 'chu-nhat' | 'tron' | 'vuong' | 'oval' | 'mat-meo' => {
    const n = name.toLowerCase();
    if (n.includes('round')) return 'tron';
    if (n.includes('square')) return 'vuong';
    if (n.includes('oval')) return 'oval';
    if (n.includes('cat')) return 'mat-meo';
    return 'chu-nhat';
  };

  const inferLensType = (name: string): 'anh-sang-xanh' | 'doi-mau' | 'sieu-mong' | 'da-trong' | 'kiem-soat-can-thi' | 'chong-be' | 'lai-xe' | null => {
    const n = name.toLowerCase();
    if (n.includes('ánh sáng xanh') || n.includes('blue') || n.includes('bluelight')) return 'anh-sang-xanh';
    if (n.includes('đổi màu') || n.includes('transitions') || n.includes('photochrom')) return 'doi-mau';
    if (n.includes('siêu mỏng') || n.includes('high index') || n.includes('1.67') || n.includes('1.74')) return 'sieu-mong';
    if (n.includes('đa tròng') || n.includes('progressive')) return 'da-trong';
    if (n.includes('kiểm soát cận') || n.includes('myopia')) return 'kiem-soat-can-thi';
    if (n.includes('chống bể') || n.includes('impact')) return 'chong-be';
    if (n.includes('lái xe') || n.includes('driving')) return 'lai-xe';
    return null;
  };

  const filteredProducts = featured
    .filter((p) => p.category === tab)
    .filter((p) => tab === 'frames' ? (!shapeFilter || inferShape(p.name) === shapeFilter) : true)
    .filter((p) => tab === 'lenses' ? (!lensFilter || inferLensType(p.name) === lensFilter) : true)
    .filter((p) => !brandFilter || (p.brand && p.brand.toLowerCase() === brandFilter.toLowerCase()));

  const chunk = <T,>(arr: T[], size: number): T[][] => {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Giá trị nổi bật của thương hiệu
  const brandValues = [
    {
      icon: <BadgeCheck className="w-8 h-8" />,
      title: "Uy tín 16 năm",
      description: "Thương hiệu đ��ợc tin tưởng bởi hàng ngàn khách hàng trên toàn quốc",
      number: "16+",
      unit: "năm"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Khách hàng hài lòng",
      description: "Tỷ l��� khách hàng quay lại và giới thiệu bạn bè cao nhất thị trường",
      number: "99%",
      unit: "hài lòng"
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: "Hệ thống cửa hàng",
      description: "Mạng lưới cửa hàng rộng khắp, phục vụ tận nơi cho khách hàng",
      number: "25+",
      unit: "chi nhánh"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Sản phẩm chính hãng",
      description: "100% sản phẩm chính hãng từ các thương hiệu uy tín thế giới",
      number: "100%",
      unit: "chính hãng"
    }
  ];

  // Sản phẩm chính
  const mainProducts = [
    {
      id: 1,
      title: "Gọng kính th���i trang",
      description: "Bộ sưu tập đa dạng từ cổ điển đến hiện đại, phù hợp mọi khuôn mặt và phong cách",
      image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      features: ["Hơn 1000 mẫu thiết kế", "Chất liệu cao cấp", "Bảo hành 2 năm"],
      link: "/frames",
      badge: "Bán chạy nhất",
      badgeColor: "bg-green-500"
    },
    {
      id: 2,
      title: "Kính mát bảo vệ",
      description: "Chống tia UV hiệu quả, bảo vệ đôi mắt khỏi ánh nắng mặt trời và tia sáng có hại",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      features: ["Chống UV 100%", "Thi����t kế thời trang", "Phân cực cao cấp"],
      link: "/sunglasses",
      badge: "Xu hướng 2024",
      badgeColor: "bg-blue-500"
    },
    {
      id: 3,
      title: "Tròng kính công nghệ",
      description: "Tròng kính chống ánh sáng xanh, đa tròng và các công nghệ tiên tiến khác",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      features: ["Ch���ng ánh sáng xanh", "Tròng đa tròng", "Công nghệ Zeiss"],
      link: "/lenses",
      badge: "Công nghệ mới",
      badgeColor: "bg-purple-500"
    }
  ];

  // Dịch vụ nổi bật
  const featuredServices = [
    {
      icon: <Stethoscope className="w-12 h-12" />,
      title: "Khám m����t miễn phí",
      description: "Kiểm tra thị lực toàn diện với thiết bị hiện đại nhất",
      features: ["Đo độ cận, viễn, loạn", "Kiểm tra s��c khỏe mắt", "Tư vấn chuyên nghiệp"],
      color: "from-blue-500 to-blue-600",
      time: "15 phút"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Bảo hành trọn đời",
      description: "Cam kết chất lượng với chế độ bảo hành và hỗ trợ tốt nhất",
      features: ["Bảo hành 2 năm", "Sửa chữa miễn phí", "Đổi trả trong 30 ngày"],
      color: "from-green-500 to-green-600",
      time: "24/7"
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Lắp kính nhanh chóng",
      description: "Dịch vụ lắp kính t��i chỗ, nhận ngay trong ngày",
      features: ["Lắp kính trong 30 phút", "Tư vấn ch���n tr��ng", "Điều chỉnh gọng"],
      color: "from-orange-500 to-orange-600",
      time: "30 phút"
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Chăm sóc khách hàng",
      description: "Đội ngũ hỗ trợ t�����n tình, chu đáo trong mọi tình huống",
      features: ["Hotline 24/7", "Tư vấn trực tuyến", "Hỗ trợ tại nh��"],
      color: "from-pink-500 to-pink-600",
      time: "24/7"
    }
  ];

  // Chương trình khuyến mãi
  const promotions = [
    {
      id: 1,
      title: "Ưu đãi tháng 12",
      description: "Giảm giá lên đến 40% toàn bộ gọng kính thời trang",
      discount: "40%",
      validUntil: "31/12/2024",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      cta: "Mua ngay",
      highlight: true
    },
    {
      id: 2,
      title: "Combo tiết kiệm",
      description: "Mua gọng tặng tròng chống ánh sáng xanh",
      discount: "1+1",
      validUntil: "15/01/2025",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      cta: "Xem chi tiết",
      highlight: false
    }
  ];

  // Hệ thống cửa hàng
  const storeLocations = [
    {
      id: 1,
      name: "Chi nhánh Quận 1",
      address: "123 Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM",
      phone: "028 3825 1234",
      hours: "8:00 - 21:30",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      featured: true
    },
    {
      id: 2,
      name: "Chi nhánh Quận 3",
      address: "456 Võ Văn T����n, P.6, Q.3, TP.HCM",
      phone: "028 3930 5678",
      hours: "8:00 - 21:30",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      featured: true
    },
    {
      id: 3,
      name: "Chi nhánh Thủ Đức",
      address: "789 Võ Văn Ngân, P. Bình Thọ, TP. Thủ Đức",
      phone: "028 3720 9012",
      hours: "8:00 - 21:30",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      featured: false
    }
  ];

  // Phản hồi khách hàng
  const testimonials = [
    {
      id: 1,
      name: "Chị Nguyễn Thị Lan",
      age: "35 tuổi",
      role: "Gi��o viên",
      content: "Dịch vụ khám mắt rất chuyên nghiệp, nhân viên t�� vấn tận tình. Kính đẹp, chất lượng tốt và giá cả h��p lý. Tôi sẽ giới thiệu bạn bè đến đây.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b332e234?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "TP. Hồ Chí Minh"
    },
    {
      id: 2,
      name: "Anh Trần Minh Đức",
      age: "28 tuổi",
      role: "Lập trình viên",
      content: "Kính chống ánh sáng xanh thực sự hiệu quả. Làm việc cả ngày với máy tính mà mắt không còn bị mỏi. Cảm ơn Tâm Đức đã tư vấn sản phẩm phù hợp.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "Hà Nội"
    },
    {
      id: 3,
      name: "Cô Lê Thị Hoa",
      age: "52 tuổi",
      role: "Kế toán",
      content: "Tôi đã sử dụng dịch vụ tại Tâm Đức được 3 năm. Từ kính cận đến kính đọc sách, tất cả đ��u rất chất lượng. Nhân viên luôn nhắc lịch kiểm tra định kỳ.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "Đà Nẵng"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* 2. Hero Banner (Forest Green) */}
      <section className="relative py-8 md:py-14 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white shadow-sm border rounded-full px-3 py-1 text-sm mb-4">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandPrimary }} />
                <span className="text-gray-700">Đang có ưu đãi đặc biệt</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
                Sắm kính chuẩn
                <span className="mx-2 align-middle text-2xl md:text-3xl text-slate-400">•</span>
                <span style={{ color: brandPrimary }}>Bảo vệ đôi mắt bạn</span>
              </h1>
              <p className="text-gray-600 text-lg mt-4">{hero.sub}</p>

              {/* Stat cards */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <Card className="p-4 border bg-white">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" style={{ color: brandPrimary }} />
                    <div>
                      <div className="font-bold">100%</div>
                      <div className="text-xs text-gray-500">Khám mắt miễn phí</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border bg-white">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" style={{ color: brandPrimary }} />
                    <div>
                      <div className="font-bold">Bảo hành</div>
                      <div className="text-xs text-gray-500">Trọn đời gọng kính</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border bg-white">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="font-bold">4.9</div>
                      <div className="text-xs text-gray-500">Đánh giá 5 sao</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* CTAs */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild className="px-7 py-6 font-semibold text-white" style={{ backgroundColor: brandPrimary }}>
                  <Link to="/eye-exam">
                    <Calendar className="mr-2 h-5 w-5" />
                    Đặt lịch khám mắt
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="px-6 py-6 font-semibold">
                  <Link to="/products" className="inline-flex items-center">
                    <Play className="mr-2" />
                    Xem demo sản phẩm
                  </Link>
                </Button>
              </div>

              {/* Trust stats - large format */}
              <div className="mt-8 grid grid-cols-3 gap-6 py-6 px-4 bg-white rounded-2xl shadow-sm border">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">1M+</div>
                  <div className="text-sm text-gray-600 font-medium">Khách hàng tin tưởng</div>
                </div>
                <div className="text-center border-l border-r border-gray-100 px-2">
                  <div className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">50+</div>
                  <div className="text-sm text-gray-600 font-medium">Cửa hàng toàn quốc</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">20+</div>
                  <div className="text-sm text-gray-600 font-medium">Năm kinh nghiệm</div>
                </div>
              </div>
            </div>

            {/* Right visual card */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-white border">
                <img src={heroSrc} onError={onHeroImgError} alt="Không gian trưng bày cửa hàng kính" className="w-full h-[320px] sm:h-[360px] md:h-[440px] object-cover" />
              </div>
              {/* Floating badges */}
              <div className="absolute -top-3 left-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-sm shadow-lg">
                  <span>Giảm 30% - Chỉ hôm nay!</span>
                </div>
              </div>
              <div className="absolute -top-3 right-6">
                <div className="bg-white rounded-xl shadow-lg px-4 py-2 text-sm font-semibold border">
                  Từ <span className="text-slate-900">890.000đ</span>
                </div>
              </div>
              <div className="absolute bottom-6 right-6">
                <div className="bg-white rounded-xl shadow-lg px-3 py-2 text-sm font-semibold border flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  4.9/5
                  <span className="text-gray-500 text-xs">Đánh giá khách hàng</span>
                </div>
              </div>
              <div className="absolute bottom-6 left-6">
                <div className="bg-white rounded-xl shadow-lg p-3 border flex items-center gap-3">
                  <div className="shrink-0">
                    <div className="relative w-10 h-10">
                      <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80" alt="Nguyễn Thị Lan" className="w-10 h-10 rounded-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Nguyễn Thị Lan</div>
                    <div className="text-xs text-gray-500">“Dịch vụ tuyệt v���i!”</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Benefits */}
      <section className="py-16 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Tại sao chọn chúng t��i</h2>
            <p className="text-gray-600">Cam kết mang đến dịch vụ tốt nhất</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <Stethoscope className="w-7 h-7" />, title: "Khám mắt miễn phí", desc: "Khám mắt miễn phí cho mọi khách h��ng" },
              { icon: <Glasses className="w-7 h-7" />, title: "Gọng kính thời trang", desc: "Xu hướng thời trang, đa dạng kiểu dáng" },
              { icon: <Shield className="w-7 h-7" />, title: "Tròng kính chính hãng", desc: "Tròng kính chính hãng, bảo vệ mắt tối đa" },
              { icon: <BadgeCheck className="w-7 h-7" />, title: "Bảo hành uy tín", desc: "Bảo hành rõ ràng, hỗ trợ tận tâm" },
            ].map((b, i) => (
              <Card key={i} className="p-6 border bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: brandPrimary }}>{b.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{b.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{b.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Services & Appointment */}
      {/* 5. Premium Product Grid */}
      <section className="py-16" style={{ backgroundColor: '#F9FAF9', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <style>{`
          .hk-tab { background: transparent; border-bottom: 2px solid transparent; color: #334155; font-weight: 700; border-radius: 0; }
          .hk-tab[data-state="active"] { color: #006A4E !important; border-color: #006A4E !important; }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900" style={{ fontFamily: 'Montserrat, Inter, system-ui, sans-serif' }}>Sản phẩm chính hãng</h2>
            <Button asChild variant="outline" className="border-2 hover:border-emerald-500">
              <Link to="/products" className="inline-flex items-center font-semibold">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Top tabs */}
          <Tabs value={tab} onValueChange={(v)=>setTab(v as any)} className="w-full">
            <TabsList className="w-full mb-5 grid grid-cols-2 gap-2 bg-transparent p-0 border-b">
              <TabsTrigger value="frames" className="hk-tab py-3">Gọng kính</TabsTrigger>
              <TabsTrigger value="lenses" className="hk-tab py-3">Tròng kính</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filters per active tab */}
          {tab === 'frames' ? (
            <div className="flex items-stretch gap-3 overflow-x-auto pb-3 -mx-1 px-1">
              {[
                {k:'chu-nhat', label:'Chữ nhật', icon:(<svg viewBox="0 0 24 24" className="w-6 h-6"><rect x="3" y="6" width="18" height="12" rx="3" fill="currentColor"/></svg>)},
                {k:'tron', label:'Tròn', icon:(<svg viewBox="0 0 24 24" className="w-6 h-6"><circle cx="12" cy="12" r="8" fill="currentColor"/></svg>)},
                {k:'vuong', label:'Vuông', icon:(<svg viewBox="0 0 24 24" className="w-6 h-6"><rect x="6" y="6" width="12" height="12" fill="currentColor"/></svg>)},
                {k:'oval', label:'Oval', icon:(<svg viewBox="0 0 24 24" className="w-7 h-6"><ellipse cx="12" cy="12" rx="8" ry="5" fill="currentColor"/></svg>)},
                {k:'mat-meo', label:'Mắt mèo', icon:(<svg viewBox="0 0 24 24" className="w-7 h-6"><path d="M2 12c3-3 6-4 10-4s7 1 10 4c-3 3-6 4-10 4s-7-1-10-4Z" fill="currentColor"/></svg>)},
              ].map(s => (
                <button
                  key={s.k}
                  onClick={()=> setShapeFilter(shapeFilter===s.k ? null : s.k as any)}
                  className={`w-28 shrink-0 grid place-items-center gap-2 py-3 rounded-xl border bg-white text-sm shadow-sm transition ${shapeFilter===s.k? 'text-white' : 'text-slate-700'}`}
                  style={{ borderColor: '#e2e8f0', backgroundColor: shapeFilter===s.k? '#006A4E' : undefined }}
                >
                  <div className="w-12 h-12 rounded-lg grid place-items-center bg-gray-100 text-current">{s.icon}</div>
                  <span className="font-semibold text-center leading-tight">{s.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto pb-3 -mx-1 px-1">
              {[
                {k:'anh-sang-xanh', label:'Ánh sáng xanh'},
                {k:'doi-mau', label:'Đổi màu'},
                {k:'sieu-mong', label:'Siêu mỏng'},
                {k:'da-trong', label:'Đa tròng'},
                {k:'kiem-soat-can-thi', label:'Kiểm soát cận thị'},
                {k:'chong-be', label:'Chống bể'},
                {k:'lai-xe', label:'Lái xe'},
              ].map(s => (
                <button
                  key={s.k}
                  onClick={()=> setLensFilter(lensFilter===s.k ? null : s.k as any)}
                  className={`px-4 py-2 rounded-full border text-sm shadow-sm whitespace-nowrap ${lensFilter===s.k? 'text-white' : 'text-slate-700'} ${lensFilter===s.k? '' : 'bg-white'}`}
                  style={{ borderColor: '#e2e8f0', backgroundColor: lensFilter===s.k? '#006A4E' : undefined }}
                >
                  <span className="font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Brand chips per tab */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {(tab==='frames' ? framesBrandList : lensesBrandList).map((b) => (
              <button
                key={b}
                onClick={()=> setBrandFilter(brandFilter===b ? null : b)}
                className={`px-4 py-2 rounded-full border text-sm shadow-sm whitespace-nowrap ${brandFilter===b? 'text-white' : 'text-slate-700'} ${brandFilter===b? '' : 'bg-white'}`}
                style={{ borderColor: '#e2e8f0', backgroundColor: brandFilter===b? '#006A4E' : undefined }}
              >
                <span className="font-medium">{b}</span>
              </button>
            ))}
          </div>

          {/* Desktop grid 4 per row */}
          <div className="hidden lg:grid grid-cols-4 gap-6 mt-8">
            {filteredProducts.slice(0,8).map((p) => {
              const isBest = ['ray-ban','oakley','gucci'].includes((p.brand||'').toLowerCase());
              return (
                <div key={p.id} role="link" tabIndex={0} onClick={()=>navigate(`/products/${p.id}`)} onKeyDown={(e:any)=>{ if(e.key==='Enter' || e.key===' ') navigate(`/products/${p.id}`); }} className="cursor-pointer">
                  <Card className="group overflow-hidden border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition">
                    <div className="relative">
                      <div className="aspect-square w-full overflow-hidden bg-gray-50">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="absolute top-3 left-3 space-y-1">
                        {p.isOnSale && <Badge className="bg-red-600 text-white text-xs">-{p.discount || 20}%</Badge>}
                        {p.isNew && <Badge className="bg-green-600 text-white text-xs">Mới</Badge>}
                        {isBest && <Badge className="bg-amber-500 text-white text-xs">Bán chạy</Badge>}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-base mb-1 line-clamp-2 text-slate-900">{p.name}</h3>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-emerald-700 font-bold text-lg">{formatPrice(p.price || 0)}</span>
                        {p.originalPrice && <span className="text-xs text-gray-500 line-through">{formatPrice(p.originalPrice)}</span>}
                      </div>
                      <p className="text-xs text-gray-500">Chính hãng – Bảo hành 12T</p>
                      <div className="mt-3">
                        <Button asChild size="sm" className="text-white" style={{ backgroundColor: '#006A4E' }}>
                          <Link to="/eye-exam">Đặt lịch đo mắt</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Tablet grid 2 per row */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 mt-8">
            {filteredProducts.slice(0,8).map((p) => {
              const isBest = ['ray-ban','oakley','gucci'].includes((p.brand||'').toLowerCase());
              return (
                <div key={p.id} role="link" tabIndex={0} onClick={()=>navigate(`/products/${p.id}`)} onKeyDown={(e:any)=>{ if(e.key==='Enter' || e.key===' ') navigate(`/products/${p.id}`); }} className="cursor-pointer">
                  <Card className="group overflow-hidden border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition">
                    <div className="relative">
                      <div className="aspect-square w-full overflow-hidden bg-gray-50">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="absolute top-3 left-3 space-y-1">
                        {p.isOnSale && <Badge className="bg-red-600 text-white text-xs">-{p.discount || 20}%</Badge>}
                        {p.isNew && <Badge className="bg-green-600 text-white text-xs">Mới</Badge>}
                        {isBest && <Badge className="bg-amber-500 text-white text-xs">Bán chạy</Badge>}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-slate-900">{p.name}</h3>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-emerald-700 font-bold">{formatPrice(p.price || 0)}</span>
                        {p.originalPrice && <span className="text-xs text-gray-500 line-through">{formatPrice(p.originalPrice)}</span>}
                      </div>
                      <p className="text-xs text-gray-500">Chính hãng – Bảo hành 12T</p>
                      <div className="mt-3">
                        <Button asChild size="sm" className="text-white" style={{ backgroundColor: '#006A4E' }}>
                          <Link to="/eye-exam">Đ���t lịch đo mắt</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Mobile carousel 2x2 */}
          <div className="md:hidden mt-8">
            <Carousel className="w-full max-w-sm mx-auto">
              <CarouselContent>
                {chunk(filteredProducts, 4).map((group, idx) => (
                  <CarouselItem key={idx}>
                    <div className="grid grid-cols-2 gap-4">
                      {group.map((p) => {
                        const isBest = ['ray-ban','oakley','gucci'].includes((p.brand||'').toLowerCase());
                        return (
                          <div key={p.id} role="link" tabIndex={0} onClick={()=>navigate(`/products/${p.id}`)} onKeyDown={(e:any)=>{ if(e.key==='Enter' || e.key===' ') navigate(`/products/${p.id}`); }} className="cursor-pointer">
                            <Card className="group overflow-hidden border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition">
                              <div className="relative">
                                <div className="aspect-square w-full overflow-hidden bg-gray-50">
                                  <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="absolute top-2 left-2 space-y-1">
                                  {p.isOnSale && <Badge className="bg-red-600 text-white text-[10px]">-{p.discount || 20}%</Badge>}
                                  {p.isNew && <Badge className="bg-green-600 text-white text-[10px]">Mới</Badge>}
                                  {isBest && <Badge className="bg-amber-500 text-white text-[10px]">Bán chạy</Badge>}
                                </div>
                              </div>
                              <CardContent className="p-3">
                                <h3 className="font-semibold text-xs mb-1 line-clamp-2 text-slate-900">{p.name}</h3>
                                <div className="flex items-baseline gap-2 mb-1">
                                  <span className="text-emerald-700 font-bold text-sm">{formatPrice(p.price || 0)}</span>
                                  {p.originalPrice && <span className="text-[10px] text-gray-500 line-through">{formatPrice(p.originalPrice)}</span>}
                                </div>
                                <p className="text-[10px] text-gray-500">Chính hãng – Bảo hành 12T</p>
                                <div className="mt-2">
                                  <Button asChild size="sm" className="h-8 px-3 text-white" style={{ backgroundColor: '#006A4E' }}>
                                    <Link to="/eye-exam">Đặt lịch đo mắt</Link>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        );
                      })}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
          </div>
        </div>
      </section>

      {/* 6. Frame Brands Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Các th��ơng hiệu gọng kính</h2>
            <p className="text-gray-600 text-lg">Tập hợp những thương hiệu g���ng kính nổi tiếng thế giới</p>
          </div>

          <div className="frameBrandsLogos">
            {/* Desktop - flex wrap */}
            <div className="hidden lg:flex flex-wrap justify-center gap-6">
              {[
                { logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1580704982984-ebccc8f83ba7?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1606590098283-3562d9f7f355?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1606590098283-3562d9f7f355?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1580704982984-ebccc8f83ba7?w=200&auto=format&fit=crop&q=80" },
              ].map((brand, i) => (
                <img
                  key={i}
                  src={brand.logo}
                  alt={`Brand logo ${i + 1}`}
                  className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  style={{ width: '145px', height: '87px', objectFit: 'contain', padding: '8px' }}
                />
              ))}
            </div>

            {/* Mobile & Tablet - carousel with auto-scroll */}
            <div className="lg:hidden">
              <MobileFrameBrandsCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* 6B. Lens Brands Gallery */}
      <section className="py-16 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Các thương hiệu tròng kính</h2>
            <p className="text-gray-600 text-lg">Tập hợp những thương hiệu tròng kính công nghệ hàng đầu thế giới</p>
          </div>

          <div className="lensBrandsLogos">
            {/* Desktop - flex wrap */}
            <div className="hidden lg:flex flex-wrap justify-center gap-6">
              {[
                { logo: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1606590098283-3562d9f7f355?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1580704982984-ebccc8f83ba7?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1606590098283-3562d9f7f355?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1580704982984-ebccc8f83ba7?w=200&auto=format&fit=crop&q=80" },
                { logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&auto=format&fit=crop&q=80" },
              ].map((brand, i) => (
                <img
                  key={i}
                  src={brand.logo}
                  alt={`Lens brand logo ${i + 1}`}
                  className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  style={{ width: '145px', height: '87px', objectFit: 'contain', padding: '8px' }}
                />
              ))}
            </div>

            {/* Mobile & Tablet - carousel with auto-scroll */}
            <div className="lg:hidden">
              <MobileLensBrandsCarousel />
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default Homepage;
