import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireAuthForCart } from "@/lib/authGuard";
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  Heart,
  Star,
  ShoppingCart,
  X,
  Glasses,
  Sun,
  Circle,
  Square,
  Hexagon,
  Triangle,
  Users,
  User,
  UserCheck,
  Zap,
  Award,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  SlidersHorizontal,
  GitCompare,
  ShoppingBag,
  CheckCircle2,
  Palette,
  Ruler,
} from "lucide-react";

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  stockCount?: number;
  image?: string;
  // Variant specific attributes
  color?: {
    name: string;
    code: string;
    image?: string;
  };
  size?: string;
  refractiveIndex?: number;
  lensFeatures?: string[];
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
  images?: string[];
  category: string;
  gender: string;
  frameType: string;
  shape: string;
  material: string;
  features: string[];
  description: string;
  highlights: string[];
  isNew?: boolean;
  isOnSale?: boolean;
  isBestseller?: boolean;
  isPremium?: boolean;
  variants: ProductVariant[];
  // Available options for this product
  availableColors?: Array<{
    name: string;
    code: string;
    image?: string;
  }>;
  availableSizes?: string[];
  availableRefractiveIndexes?: number[];
  availableLensFeatures?: string[];
}

const ProductListing = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([500000, 5000000]);
  const [selectedFrameType, setSelectedFrameType] = useState<string>("all");
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>("all");
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    genders: [] as string[],
    shapes: [] as string[],
    materials: [] as string[],
    features: [] as string[],
  });
  const [compareList, setCompareList] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );
  // Variant selection state for each product
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, ProductVariant>
  >({});

  // Mock data for products
  const productsMock: Product[] = [
    {
      id: "1",
      name: "Kính Cận Classic Series RB5228",
      brand: "Ray-Ban",
      basePrice: 1500000,
      priceRange: { min: 1500000, max: 1800000 },
      rating: 4.8,
      reviewCount: 124,
      image: "/placeholder.svg",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      category: "prescription",
      gender: "unisex",
      frameType: "full-rim",
      shape: "rectangular",
      material: "Acetate",
      features: ["Chống trầy xước", "Kháng UV", "Nhẹ"],
      description:
        "Thiết kế classic với chất liệu acetate cao cấp, phù hợp với mọi khuôn mặt",
      highlights: ["Bán chạy #1", "Chất liệu cao cấp", "Bảo hành 2 năm"],
      isOnSale: true,
      isBestseller: true,
      availableColors: [
        { name: "Đen", code: "#000000", image: "/placeholder.svg" },
        { name: "Nâu Tortoise", code: "#8B4513", image: "/placeholder.svg" },
        { name: "Xanh Navy", code: "#000080", image: "/placeholder.svg" },
        { name: "Xám", code: "#808080", image: "/placeholder.svg" },
      ],
      availableSizes: ["S (48-17)", "M (50-19)", "L (52-21)"],
      variants: [
        {
          id: "1-black-s",
          name: "Đen - Size S",
          price: 1500000,
          originalPrice: 2000000,
          stockStatus: "in-stock",
          stockCount: 12,
          color: { name: "Đen", code: "#000000" },
          size: "S (48-17)",
        },
        {
          id: "1-black-m",
          name: "Đen - Size M",
          price: 1500000,
          originalPrice: 2000000,
          stockStatus: "in-stock",
          stockCount: 8,
          color: { name: "Đen", code: "#000000" },
          size: "M (50-19)",
        },
        {
          id: "1-tortoise-m",
          name: "Nâu Tortoise - Size M",
          price: 1600000,
          originalPrice: 2000000,
          stockStatus: "low-stock",
          stockCount: 2,
          color: { name: "Nâu Tortoise", code: "#8B4513" },
          size: "M (50-19)",
        },
        {
          id: "1-navy-l",
          name: "Xanh Navy - Size L",
          price: 1800000,
          originalPrice: 2000000,
          stockStatus: "in-stock",
          stockCount: 5,
          color: { name: "Xanh Navy", code: "#000080" },
          size: "L (52-21)",
        },
      ],
    },
    {
      id: "2",
      name: "Tròng Kính Essilor Varilux",
      brand: "Essilor",
      basePrice: 2500000,
      priceRange: { min: 2500000, max: 4500000 },
      rating: 4.9,
      reviewCount: 89,
      image: "/placeholder.svg",
      images: ["/placeholder.svg", "/placeholder.svg"],
      category: "lenses",
      gender: "unisex",
      frameType: "lens-only",
      shape: "universal",
      material: "Polycarbonate",
      features: ["Chống trầy", "Kháng UV", "Chống phản quang"],
      description:
        "Tròng kính đa tròng cao cấp với công nghệ Varilux cho thị lực hoàn hảo",
      highlights: ["Công nghệ Varilux", "Chống mỏi mắt", "Bảo hành 2 năm"],
      isNew: true,
      availableRefractiveIndexes: [1.5, 1.56, 1.6, 1.67, 1.74],
      availableLensFeatures: [
        "Chống ánh sáng xanh",
        "Đổi màu",
        "Chống phản quang",
        "Siêu mỏng",
      ],
      variants: [
        {
          id: "2-1.5-basic",
          name: "Chiết suất 1.5 - Cơ bản",
          price: 2500000,
          stockStatus: "in-stock",
          stockCount: 20,
          refractiveIndex: 1.5,
          lensFeatures: ["Chống trầy", "Kháng UV"],
        },
        {
          id: "2-1.56-ar",
          name: "Chiết suất 1.56 - Chống phản quang",
          price: 3200000,
          stockStatus: "in-stock",
          stockCount: 15,
          refractiveIndex: 1.56,
          lensFeatures: ["Chống trầy", "Kháng UV", "Chống phản quang"],
        },
        {
          id: "2-1.67-premium",
          name: "Chiết suất 1.67 - Siêu mỏng + Blue Block",
          price: 4200000,
          stockStatus: "low-stock",
          stockCount: 3,
          refractiveIndex: 1.67,
          lensFeatures: [
            "Chống trầy",
            "Kháng UV",
            "Chống ánh sáng xanh",
            "Siêu mỏng",
          ],
        },
        {
          id: "2-1.74-ultra",
          name: "Chiết suất 1.74 - Ultra mỏng + Đổi màu",
          price: 4500000,
          stockStatus: "in-stock",
          stockCount: 8,
          refractiveIndex: 1.74,
          lensFeatures: ["Chống trầy", "Kháng UV", "Đổi màu", "Siêu mỏng"],
        },
      ],
    },
    {
      id: "3",
      name: "Kính Râm Sport Pro Prizm",
      brand: "Oakley",
      basePrice: 2800000,
      priceRange: { min: 2800000, max: 3200000 },
      rating: 4.9,
      reviewCount: 89,
      image: "/placeholder.svg",
      images: ["/placeholder.svg", "/placeholder.svg"],
      category: "sunglasses",
      gender: "men",
      frameType: "full-rim",
      shape: "aviator",
      material: "Titanium",
      features: ["Prizm Lens", "Chống nước", "Thể thao"],
      description:
        "Kính râm thể thao với công nghệ Prizm lens cho tầm nhìn tối ưu",
      highlights: ["Công nghệ Prizm", "Dành cho thể thao", "Chống nước IP67"],
      isNew: true,
      availableColors: [
        { name: "Đen", code: "#000000" },
        { name: "Xám", code: "#808080" },
        { name: "Xanh Dương", code: "#0066CC" },
      ],
      availableSizes: ["M (55-18)", "L (58-18)"],
      variants: [
        {
          id: "3-black-m",
          name: "Đen - Size M",
          price: 2800000,
          stockStatus: "in-stock",
          stockCount: 10,
          color: { name: "Đen", code: "#000000" },
          size: "M (55-18)",
        },
        {
          id: "3-black-l",
          name: "Đen - Size L",
          price: 2800000,
          stockStatus: "in-stock",
          stockCount: 7,
          color: { name: "Đen", code: "#000000" },
          size: "L (58-18)",
        },
        {
          id: "3-blue-m",
          name: "Xanh Dương - Size M",
          price: 3200000,
          stockStatus: "low-stock",
          stockCount: 2,
          color: { name: "Xanh Dương", code: "#0066CC" },
          size: "M (55-18)",
        },
      ],
    },
  ];

  // Supabase: load products and variants, use as source if available
  const [supaProducts, setSupaProducts] = useState<Product[] | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data: prods, error } = await supabase
          .from("products")
          .select("id,name,brand,base_price,image,category,description,is_new,is_on_sale,is_bestseller,is_premium");
        if (error) throw error;
        const ids = (prods || []).map((p: any) => p.id);
        let variants: any[] = [];
        if (ids.length) {
          const { data: vars } = await supabase
            .from("product_variants")
            .select("id,product_id,name,price,original_price,stock_status,stock_count,image,color_name,color_code,size,refractive_index,lens_features")
            .in("product_id", ids);
          variants = vars || [];
        }
        const mapped: Product[] = (prods || []).map((p: any) => {
          const v = (variants.filter((x: any) => x.product_id === p.id) || []).map((r: any) => ({
            id: r.id,
            name: r.name,
            price: Number(r.price) || 0,
            originalPrice: r.original_price == null ? undefined : Number(r.original_price),
            stockStatus: (r.stock_status as ProductVariant["stockStatus"]) || "in-stock",
            stockCount: r.stock_count == null ? undefined : Number(r.stock_count),
            image: r.image || p.image || "/placeholder.svg",
            color: r.color_name || r.color_code ? { name: r.color_name || "", code: r.color_code || "" } : undefined,
            size: r.size || undefined,
            refractiveIndex: r.refractive_index == null ? undefined : Number(r.refractive_index),
            lensFeatures: Array.isArray(r.lens_features) ? (r.lens_features as string[]) : undefined,
          })) as ProductVariant[];
          const availableColors = Array.from(new Map(v.filter(x => x.color?.code).map(x => [x.color!.code, x.color!])).values());
          const availableSizes = Array.from(new Set(v.filter(x => x.size).map(x => x.size!)));
          const availableRefractiveIndexes = Array.from(new Set(v.filter(x => x.refractiveIndex != null).map(x => Number(x.refractiveIndex!))));
          const priceVals = v.length ? v.map(x => x.price) : [Number(p.base_price) || 0];
          const min = Math.min(...priceVals);
          const max = Math.max(...priceVals);
          const prod: Product = {
            id: p.id,
            name: p.name,
            brand: p.brand,
            basePrice: Number(p.base_price) || 0,
            priceRange: { min, max },
            rating: 4.8,
            reviewCount: 120,
            image: p.image || "/placeholder.svg",
            images: [p.image || "/placeholder.svg"],
            category: p.category || "prescription",
            gender: "unisex",
            frameType: p.category === "lenses" ? "lens-only" : "full-rim",
            shape: "rectangular",
            material: "Acetate",
            features: [],
            description: p.description || "",
            highlights: [],
            isNew: !!p.is_new,
            isOnSale: !!p.is_on_sale,
            isBestseller: !!p.is_bestseller,
            isPremium: !!p.is_premium,
            variants: v,
            availableColors,
            availableSizes,
            availableRefractiveIndexes,
            availableLensFeatures: undefined,
          };
          return prod;
        });
        setSupaProducts(mapped);
      } catch {
        setSupaProducts(null);
      }
    })();
  }, []);

  const products: Product[] = supaProducts ?? productsMock;

  // Frame type carousel data
  const frameTypes = [
    {
      id: "all",
      label: "Tất cả",
      icon: <Glasses className="h-5 w-5" />,
      count: products.length,
    },
    {
      id: "full-rim",
      label: "Gọng đầy",
      icon: <Square className="h-5 w-5" />,
      count: products.filter((p) => p.frameType === "full-rim").length,
    },
    {
      id: "semi-rim",
      label: "Nửa gọng",
      icon: <Circle className="h-5 w-5" />,
      count: products.filter((p) => p.frameType === "semi-rim").length,
    },
    {
      id: "rimless",
      label: "Không gọng",
      icon: <Triangle className="h-5 w-5" />,
      count: products.filter((p) => p.frameType === "rimless").length,
    },
  ];

  // Quick filter tabs
  const quickFilters = [
    {
      id: "all",
      label: "Tất cả",
      icon: <Grid3X3 className="h-4 w-4" />,
      count: products.length,
    },
    {
      id: "sale",
      label: "Giảm giá",
      icon: <Zap className="h-4 w-4" />,
      count: products.filter((p) => p.isOnSale).length,
    },
    {
      id: "new",
      label: "Mới nhất",
      icon: <Star className="h-4 w-4" />,
      count: products.filter((p) => p.isNew).length,
    },
    {
      id: "bestseller",
      label: "Bán chạy",
      icon: <TrendingUp className="h-4 w-4" />,
      count: products.filter((p) => p.isBestseller).length,
    },
    {
      id: "premium",
      label: "Cao cấp",
      icon: <Award className="h-4 w-4" />,
      count: products.filter((p) => p.isPremium).length,
    },
  ];

  const filterOptions = {
    brands: [
      {
        id: "ray-ban",
        label: "Ray-Ban",
        count: products.filter((p) => p.brand === "Ray-Ban").length,
      },
      {
        id: "oakley",
        label: "Oakley",
        count: products.filter((p) => p.brand === "Oakley").length,
      },
      {
        id: "essilor",
        label: "Essilor",
        count: products.filter((p) => p.brand === "Essilor").length,
      },
    ],
    shapes: [
      {
        id: "rectangular",
        label: "Vuông",
        icon: <Square className="h-4 w-4" />,
      },
      { id: "round", label: "Tròn", icon: <Circle className="h-4 w-4" /> },
      {
        id: "oval",
        label: "Oval",
        icon: <Circle className="h-4 w-4 transform scale-x-75" />,
      },
      {
        id: "aviator",
        label: "Phi công",
        icon: <Triangle className="h-4 w-4 rotate-180" />,
      },
      {
        id: "cat-eye",
        label: "Mắt mèo",
        icon: <Hexagon className="h-4 w-4" />,
      },
    ],
    materials: [
      { id: "acetate", label: "Acetate" },
      { id: "titanium", label: "Titanium" },
      { id: "metal", label: "Metal" },
      { id: "polycarbonate", label: "Polycarbonate" },
    ],
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Utility functions
  const toggleFilter = (
    filterKey: keyof typeof selectedFilters,
    value: string,
  ) => {
    const currentFilters = selectedFilters[filterKey];
    if (currentFilters.includes(value)) {
      setSelectedFilters({
        ...selectedFilters,
        [filterKey]: currentFilters.filter((item) => item !== value),
      });
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [filterKey]: [...currentFilters, value],
      });
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const toggleCompare = (productId: string) => {
    setCompareList((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : prev.length < 3
          ? [...prev, productId]
          : prev,
    );
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      brands: [],
      genders: [],
      shapes: [],
      materials: [],
      features: [],
    });
    setSelectedFrameType("all");
    setSelectedQuickFilter("all");
    setPriceRange([500000, 5000000]);
    setSearchQuery("");
  };

  const getActiveFiltersCount = () => {
    return Object.values(selectedFilters).flat().length;
  };

  // Get selected variant for a product or default to first variant
  const getSelectedVariant = (product: Product): ProductVariant => {
    return selectedVariants[product.id] || product.variants[0];
  };

  // Select a variant for a product
  const selectVariant = (productId: string, variant: ProductVariant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variant,
    }));
  };

  // Filter products based on selections
  const filteredProducts = products.filter((product) => {
    // Frame type filter
    if (selectedFrameType !== "all" && product.frameType !== selectedFrameType)
      return false;

    // Quick filter
    if (selectedQuickFilter === "sale" && !product.isOnSale) return false;
    if (selectedQuickFilter === "new" && !product.isNew) return false;
    if (selectedQuickFilter === "bestseller" && !product.isBestseller)
      return false;
    if (selectedQuickFilter === "premium" && !product.isPremium) return false;

    // Other filters
    if (
      selectedFilters.brands.length > 0 &&
      !selectedFilters.brands.includes(
        product.brand.toLowerCase().replace(/\s+/g, "-"),
      )
    )
      return false;
    if (
      selectedFilters.shapes.length > 0 &&
      !selectedFilters.shapes.includes(product.shape)
    )
      return false;
    if (
      selectedFilters.materials.length > 0 &&
      !selectedFilters.materials.includes(product.material.toLowerCase())
    )
      return false;

    // Price range - check against product price range
    if (
      product.priceRange.max < priceRange[0] ||
      product.priceRange.min > priceRange[1]
    )
      return false;

    // Search query
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    return true;
  });

  // Modern Product Card Component with Variants
  const ProductCard = ({ product }: { product: Product }) => {
    const navigate = useNavigate();
    const selectedVariant = getSelectedVariant(product);
    const currentPrice = selectedVariant.price;
    const currentOriginalPrice = selectedVariant.originalPrice;
    const currentStock = selectedVariant.stockStatus;

    return (
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md">
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Product Badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-green-500 text-white shadow-lg">
                <Star className="h-3 w-3 mr-1" />
                Mới
              </Badge>
            )}
            {product.isBestseller && (
              <Badge className="bg-orange-500 text-white shadow-lg">
                <TrendingUp className="h-3 w-3 mr-1" />
                Bán chạy
              </Badge>
            )}
            {product.isPremium && (
              <Badge className="bg-purple-500 text-white shadow-lg">
                <Award className="h-3 w-3 mr-1" />
                Cao cấp
              </Badge>
            )}
          </div>

          {/* Sale Badge */}
          {product.isOnSale && currentOriginalPrice && (
            <Badge className="absolute top-3 right-3 z-20 bg-red-500 text-white shadow-lg">
              <Zap className="h-3 w-3 mr-1" />-
              {Math.round(
                ((currentOriginalPrice - currentPrice) / currentOriginalPrice) *
                  100,
              )}
              %
            </Badge>
          )}

          {/* Product Image */}
          <img
            src={selectedVariant.image || product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="flex space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="shadow-lg"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Xem nhanh
                  </Button>
                </DialogTrigger>
              </Dialog>

              <Button
                size="sm"
                variant="secondary"
                className={`shadow-lg ${wishlist.includes(product.id) ? "text-red-500" : ""}`}
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart
                  className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-current" : ""}`}
                />
              </Button>

              <Button
                size="sm"
                variant="secondary"
                className={`shadow-lg ${compareList.includes(product.id) ? "text-blue-500" : ""}`}
                onClick={() => toggleCompare(product.id)}
                disabled={
                  !compareList.includes(product.id) && compareList.length >= 3
                }
              >
                <GitCompare className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="absolute bottom-3 left-3 z-20">
            {currentStock === "low-stock" && (
              <Badge variant="destructive" className="text-xs">
                Sắp hết hàng
              </Badge>
            )}
            {currentStock === "out-of-stock" && (
              <Badge variant="secondary" className="text-xs">
                Hết hàng
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Brand */}
          <div className="text-sm font-medium text-primary">
            {product.brand}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Selected Variant Info */}
          <div className="text-xs text-muted-foreground">
            {selectedVariant.color && (
              <span className="mr-2">Màu: {selectedVariant.color.name}</span>
            )}
            {selectedVariant.size && (
              <span className="mr-2">Size: {selectedVariant.size}</span>
            )}
            {selectedVariant.refractiveIndex && (
              <span>Chiết suất: {selectedVariant.refractiveIndex}</span>
            )}
          </div>

          {/* Variant Selection */}
          <div className="space-y-2">
            {/* Color Selection */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div className="flex items-center space-x-2">
                <Palette className="h-3 w-3 text-gray-400" />
                <div className="flex space-x-1">
                  {product.availableColors.map((color) => {
                    const variantWithColor = product.variants.find(
                      (v) => v.color?.code === color.code,
                    );
                    if (!variantWithColor) return null;
                    return (
                      <button
                        key={color.code}
                        onClick={() =>
                          selectVariant(product.id, variantWithColor)
                        }
                        className={`w-5 h-5 rounded-full border-2 transition-all ${
                          selectedVariant.color?.code === color.code
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color.code }}
                        title={color.name}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="flex items-center space-x-2">
                <Ruler className="h-3 w-3 text-gray-400" />
                <div className="flex space-x-1">
                  {product.availableSizes.map((size) => {
                    const variantWithSize = product.variants.find(
                      (v) => v.size === size,
                    );
                    if (!variantWithSize) return null;
                    return (
                      <button
                        key={size}
                        onClick={() =>
                          selectVariant(product.id, variantWithSize)
                        }
                        className={`px-2 py-1 text-xs border rounded transition-all ${
                          selectedVariant.size === size
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {size.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Refractive Index Selection for Lenses */}
            {product.availableRefractiveIndexes &&
              product.availableRefractiveIndexes.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Chiết suất:</div>
                  <div className="flex flex-wrap gap-1">
                    {product.availableRefractiveIndexes.map((index) => {
                      const variantWithIndex = product.variants.find(
                        (v) => v.refractiveIndex === index,
                      );
                      if (!variantWithIndex) return null;
                      return (
                        <button
                          key={index}
                          onClick={() =>
                            selectVariant(product.id, variantWithIndex)
                          }
                          className={`px-2 py-1 text-xs border rounded transition-all ${
                            selectedVariant.refractiveIndex === index
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {index}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(currentPrice)}
            </span>
            {currentOriginalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(currentOriginalPrice)}
              </span>
            )}
          </div>

          {/* Price Range for variants */}
          {product.priceRange.min !== product.priceRange.max && (
            <div className="text-xs text-muted-foreground">
              Từ {formatPrice(product.priceRange.min)} -{" "}
              {formatPrice(product.priceRange.max)}
            </div>
          )}

          {/* Stock Info */}
          {selectedVariant.stockCount &&
            selectedVariant.stockCount <= 5 &&
            currentStock === "low-stock" && (
              <div className="text-xs text-orange-600">
                Chỉ còn {selectedVariant.stockCount} sản phẩm
              </div>
            )}

          {/* Add to Cart Button */}
          <Button
            className="w-full shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={currentStock === "out-of-stock"}
            onClick={() => { if (!requireAuthForCart()) return; navigate('/cart'); }}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            {currentStock === "out-of-stock" ? "Hết hàng" : "Thêm vào giỏ"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  // Quick View Modal Component
  const QuickViewModal = ({ product }: { product: Product }) => {
    const selectedVariant = getSelectedVariant(product);

    return (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {product.name}
          </DialogTitle>
          <DialogDescription className="text-primary font-medium">
            {product.brand}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
              <img
                src={selectedVariant.image || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images?.slice(0, 3).map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-square bg-gray-100 rounded overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} đánh giá)
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(selectedVariant.price)}
              </span>
              {selectedVariant.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(selectedVariant.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            {/* Variant selection in quick view */}
            <div className="space-y-3 border-t pt-3">
              <h4 className="font-semibold">Tùy chọn sản phẩm:</h4>

              {/* Color options */}
              {product.availableColors && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Màu sắc:</label>
                  <div className="flex space-x-2">
                    {product.availableColors.map((color) => {
                      const variantWithColor = product.variants.find(
                        (v) => v.color?.code === color.code,
                      );
                      if (!variantWithColor) return null;
                      return (
                        <button
                          key={color.code}
                          onClick={() =>
                            selectVariant(product.id, variantWithColor)
                          }
                          className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-all ${
                            selectedVariant.color?.code === color.code
                              ? "border-primary bg-primary/10"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color.code }}
                          />
                          <span className="text-sm">{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size options */}
              {product.availableSizes && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kích cỡ:</label>
                  <div className="flex space-x-2">
                    {product.availableSizes.map((size) => {
                      const variantWithSize = product.variants.find(
                        (v) => v.size === size,
                      );
                      if (!variantWithSize) return null;
                      return (
                        <button
                          key={size}
                          onClick={() =>
                            selectVariant(product.id, variantWithSize)
                          }
                          className={`px-3 py-2 border rounded-lg transition-all ${
                            selectedVariant.size === size
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Refractive index for lenses */}
              {product.availableRefractiveIndexes && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chiết suất:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {product.availableRefractiveIndexes.map((index) => {
                      const variantWithIndex = product.variants.find(
                        (v) => v.refractiveIndex === index,
                      );
                      if (!variantWithIndex) return null;
                      return (
                        <button
                          key={index}
                          onClick={() =>
                            selectVariant(product.id, variantWithIndex)
                          }
                          className={`p-2 border rounded-lg text-sm transition-all ${
                            selectedVariant.refractiveIndex === index
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {index} - {formatPrice(variantWithIndex.price)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                className="flex-1"
                disabled={selectedVariant.stockStatus === "out-of-stock"}
                onClick={() => { if (!requireAuthForCart()) return; navigate('/cart'); }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Thêm vào giỏ hàng
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleWishlist(product.id)}
                className={wishlist.includes(product.id) ? "text-red-500" : ""}
              >
                <Heart
                  className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Bộ Sưu Tập Kính Mắt Cao Cấp
            </h1>
            <p className="text-xl mb-6 text-green-100">
              Khám phá hàng nghìn mẫu kính mắt từ những thương hiệu hàng đầu thế
              giới. Thiết kế hiện đại, chất lượng tuyệt vời, giá cả cạnh tranh.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary" className="shadow-lg">
                <Eye className="h-5 w-5 mr-2" />
                Khám Mắt Miễn Phí
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-green-600"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Xem Sản Phẩm
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>Sản phẩm</span>
        </div>

        {/* Quick Filter Tabs */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Lọc nhanh</h3>
          <Tabs
            value={selectedQuickFilter}
            onValueChange={setSelectedQuickFilter}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 w-full max-w-2xl h-auto p-1">
              {quickFilters.map((filter) => (
                <TabsTrigger
                  key={filter.id}
                  value={filter.id}
                  className="flex flex-col items-center space-y-1 p-3 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {filter.icon}
                  <span className="text-xs font-medium">{filter.label}</span>
                  <Badge variant="secondary" className="text-xs h-5">
                    {filter.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Frame Type Carousel */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Loại gọng kính</h3>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {frameTypes.map((frameType) => (
              <Button
                key={frameType.id}
                variant={
                  selectedFrameType === frameType.id ? "default" : "outline"
                }
                onClick={() => setSelectedFrameType(frameType.id)}
                className="flex-shrink-0 flex items-center space-x-2 min-w-fit"
              >
                {frameType.icon}
                <span>{frameType.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {frameType.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Search and Advanced Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Advanced Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-12 relative">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Bộ lọc nâng cao
                  {getActiveFiltersCount() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Bộ lọc nâng cao</SheetTitle>
                  <SheetDescription>
                    Tùy chỉnh để tìm sản phẩm phù hợp nhất
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Price Range */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Khoảng giá</h4>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={5000000}
                      min={500000}
                      step={100000}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Thương hiệu</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {filterOptions.brands.map((brand) => (
                        <Button
                          key={brand.id}
                          variant={
                            selectedFilters.brands.includes(brand.id)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => toggleFilter("brands", brand.id)}
                          className="w-full justify-between h-10"
                        >
                          <span>{brand.label}</span>
                          <Badge variant="secondary" className="text-xs">
                            {brand.count}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {getActiveFiltersCount() > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Xóa tất cả bộ lọc
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">
              Hiển thị{" "}
              <span className="font-medium">{filteredProducts.length}</span> sản
              phẩm
              {getActiveFiltersCount() > 0 && (
                <span> với {getActiveFiltersCount()} bộ lọc được áp dụng</span>
              )}
            </p>

            {compareList.length > 0 && (
              <Badge variant="outline" className="text-blue-600">
                <GitCompare className="h-3 w-3 mr-1" />
                So sánh ({compareList.length})
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Nổi bật
                  </div>
                </SelectItem>
                <SelectItem value="price-low">
                  <div className="flex items-center">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Giá thấp → cao
                  </div>
                </SelectItem>
                <SelectItem value="price-high">
                  <div className="flex items-center">
                    <ArrowUpDown className="h-4 w-4 mr-2 rotate-180" />
                    Giá cao → thấp
                  </div>
                </SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="rating">Đánh giá cao</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div
            className={`grid gap-6 mb-12 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-muted-foreground mb-4">
              Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <Button onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-2" />
              Xóa tất cả bộ lọc
            </Button>
          </div>
        )}

        {/* Enhanced Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t pt-6">
            <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
              Hiển thị{" "}
              <span className="font-medium">
                1-{Math.min(12, filteredProducts.length)}
              </span>{" "}
              trong tổng số{" "}
              <span className="font-medium">{filteredProducts.length}</span> sản
              phẩm
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" disabled className="h-10">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Trước
              </Button>
              <Button variant="default" className="h-10 w-10">
                1
              </Button>
              <Button variant="outline" className="h-10 w-10">
                2
              </Button>
              <Button variant="outline" className="h-10 w-10">
                3
              </Button>
              <span className="text-muted-foreground">...</span>
              <Button variant="outline" className="h-10 w-10">
                10
              </Button>
              <Button variant="outline" className="h-10">
                Sau
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quick View Dialog */}
      <Dialog
        open={!!quickViewProduct}
        onOpenChange={() => setQuickViewProduct(null)}
      >
        {quickViewProduct && <QuickViewModal product={quickViewProduct} />}
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProductListing;
