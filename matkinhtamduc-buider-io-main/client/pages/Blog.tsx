import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Search,
  Clock,
  User,
  Eye,
  Heart,
  Share2,
  ArrowRight,
  Calendar,
  Tag,
  TrendingUp,
  Star,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Mail,
  Bell,
  Lightbulb,
  Shield,
  Target,
  Users,
  Award,
  Glasses,
  Sun,
  Baby,
  Microscope,
  Stethoscope,
  Camera,
  Smartphone,
  Computer,
  Zap,
  Gift,
  Crown,
  Sparkles,
  FlameKindling,
  CircleCheck,
  Quote,
  ThumbsUp,
  BookmarkPlus,
  Rss,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  featuredImage: string;
  views: number;
  likes: number;
  comments: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [emailSubscribe, setEmailSubscribe] = useState("");

  const categories: Category[] = [
    {
      id: "about-us",
      name: "Về chúng tôi",
      description: "Câu chuyện, sứ mệnh và giá trị c���a TÂM ĐỨC",
      count: 8,
      color: "bg-blue-500",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "eye-care",
      name: "Chăm sóc mắt",
      description: "Hướng dẫn chăm sóc và bảo vệ đôi mắt toàn diện",
      count: 24,
      color: "bg-green-500",
      icon: <Eye className="w-5 h-5" />,
    },
    {
      id: "glasses-knowledge",
      name: "Kiến thức mắt kính",
      description: "Tất cả về tròng kính, gọng kính và công nghệ",
      count: 32,
      color: "bg-purple-500",
      icon: <Glasses className="w-5 h-5" />,
    },
    {
      id: "promotions",
      name: "Khuyến mãi",
      description: "Các chương trình ưu đãi và khuyến mãi đặc biệt",
      count: 15,
      color: "bg-orange-500",
      icon: <Gift className="w-5 h-5" />,
    },
  ];

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "Câu Chuyện 30 Năm Đồng Hành Cùng Sự Nghiệp Chăm Sóc Mắt",
      excerpt:
        "Từ những ngày đầu thành lập, TÂM ĐỨC đã không ngừng nỗ lực để mang đến dịch vụ chăm sóc mắt tốt nhất cho người Việt. Cùng khám phá hành trình 30 năm đầy ý nghĩa của chúng tôi.",
      content: "",
      author: "Ban lãnh đạo TÂM ĐỨC",
      authorAvatar:
        "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png",
      publishDate: "2024-01-25",
      readTime: "8 phút",
      category: "about-us",
      tags: ["Lịch sử", "Thành lập", "Sứ mệnh"],
      featuredImage:
        "https://images.pexels.com/photos/5752282/pexels-photo-5752282.jpeg",
      views: 8500,
      likes: 245,
      comments: 42,
      isFeatured: false,
      isPopular: false,
    },
    {
      id: "2",
      title: "10 Cách Bảo Vệ Mắt Khỏi Ánh Sáng Xanh Từ Màn Hình",
      excerpt:
        "Trong thời đại số hóa, việc bảo vệ mắt khỏi tác hại của ánh sáng xanh từ các thiết bị điện tử trở nên vô cùng quan trọng. Bài viết này sẽ chia sẻ 10 cách hiệu quả để bảo vệ đôi mắt của bạn.",
      content: "",
      author: "BS. Nguyễn Văn Minh",
      authorAvatar:
        "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png",
      publishDate: "2024-01-20",
      readTime: "5 phút",
      category: "eye-care",
      tags: ["Chăm sóc mắt", "Ánh sáng xanh", "Công nghệ"],
      featuredImage:
        "https://images.pexels.com/photos/29457406/pexels-photo-29457406.jpeg",
      views: 15420,
      likes: 342,
      comments: 28,
      isFeatured: true,
      isPopular: true,
    },
    {
      id: "3",
      title: "Hướng Dẫn Chọn Kính Cận Phù Hợp Với Khuôn Mặt",
      excerpt:
        "Việc chọn được một cặp kính cận vừa đẹp vừa phù hợp với khuôn mặt kh��ng phải lúc nào cũng dễ dàng. Bài viết này sẽ hướng dẫn bạn cách chọn kính theo từng dáng mặt cụ thể.",
      content: "",
      author: "Chuyên gia Trần Thị Lan",
      authorAvatar:
        "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png",
      publishDate: "2024-01-18",
      readTime: "7 phút",
      category: "glasses-knowledge",
      tags: ["Hướng dẫn", "Kính cận", "Thời trang"],
      featuredImage:
        "https://images.pexels.com/photos/5752282/pexels-photo-5752282.jpeg",
      views: 12840,
      likes: 286,
      comments: 34,
      isPopular: true,
    },
    {
      id: "4",
      title: "Công Nghệ Tròng Kính Đa Tròng: Tất Cả Những Gì Bạn Cần Biết",
      excerpt:
        "Tròng kính đa tròng (Progressive lens) là giải pháp hoàn hảo cho những người cần điều chỉnh nhiều tật khúc xạ khác nhau. Tìm hiểu về công nghệ này và lợi ích mà nó mang lại.",
      content: "",
      author: "TS. Lê Minh Hòa",
      authorAvatar:
        "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png",
      publishDate: "2024-01-16",
      readTime: "8 phút",
      category: "glasses-knowledge",
      tags: ["Công nghệ", "Tròng kính", "Đa tròng"],
      featuredImage:
        "https://images.pexels.com/photos/6981085/pexels-photo-6981085.jpeg",
      views: 9650,
      likes: 198,
      comments: 15,
      isNew: true,
    },
    {
      id: "5",
      title: "Flash Sale Cuối Năm - Giảm Tới 50% Toàn Bộ Sản Phẩm",
      excerpt:
        "Đón chào năm mới với chương trình khuyến mãi lớn nhất trong năm! Giảm giá tới 50% cho tất cả sản phẩm kính mắt, tròng kính và phụ kiện. Cơ h��i không thể bỏ lỡ!",
      content: "",
      author: "Phòng Marketing TÂM ĐỨC",
      authorAvatar:
        "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png",
      publishDate: "2024-01-15",
      readTime: "3 phút",
      category: "promotions",
      tags: ["Khuyến mãi", "Flash Sale", "Giảm giá"],
      featuredImage:
        "https://images.pexels.com/photos/6981024/pexels-photo-6981024.jpeg",
      views: 18750,
      likes: 567,
      comments: 89,
      isPopular: true,
    },
    {
      id: "6",
      title: "Các Vitamin Thiết Yếu Cho Sức Khỏe Đôi Mắt",
      excerpt:
        "Dinh dưỡng đóng vai trò quan trọng trong việc duy trì sức khỏe đôi mắt. Cùng tìm hiểu những vitamin và khoáng chất nào cần thiết để có đôi mắt khỏe mạnh.",
      content: "",
      author: "Dược sĩ Phạm Thu Hà",
      authorAvatar:
        "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png",
      publishDate: "2024-01-14",
      readTime: "6 phút",
      category: "eye-care",
      tags: ["Sức khỏe", "Vitamin", "Dinh dưỡng"],
      featuredImage:
        "https://images.pexels.com/photos/9742773/pexels-photo-9742773.jpeg",
      views: 8320,
      likes: 167,
      comments: 22,
    },
    {
      id: "7",
      title: "Tại Sao Nên Chọn TÂM ĐỨC Cho Dịch Vụ Khám Mắt?",
      excerpt:
        "Với đội ngũ bác sĩ chuyên khoa mắt giàu kinh nghiệm và trang thiết bị hiện đại nhất, TÂM ĐỨC cam kết mang đến dịch vụ khám và điều trị mắt chất lượng cao nhất.",
      content: "",
      author: "BS. Chuyên khoa II Nguyễn Thị Hồng",
      authorAvatar:
        "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png",
      publishDate: "2024-01-12",
      readTime: "6 phút",
      category: "about-us",
      tags: ["Dịch vụ", "Chất lượng", "Bác sĩ"],
      featuredImage:
        "https://images.pexels.com/photos/6981085/pexels-photo-6981085.jpeg",
      views: 6420,
      likes: 134,
      comments: 18,
    },
    {
      id: "8",
      title: "Bảo Hành Trọn Đời - Cam Kết Chất Lượng Từ TÂM ĐỨC",
      excerpt:
        "Chương trình bảo hành tr��n đời dành cho khách hàng thân thiết - một cam kết về chất lượng sản phẩm và dịch vụ hậu mãi tốt nhất từ TÂM ĐỨC.",
      content: "",
      author: "Phòng Chăm sóc khách hàng",
      authorAvatar:
        "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png",
      publishDate: "2024-01-10",
      readTime: "4 phút",
      category: "promotions",
      tags: ["Bảo hành", "Chất lượng", "Khách hàng thân thiết"],
      featuredImage:
        "https://images.pexels.com/photos/8425029/pexels-photo-8425029.jpeg",
      views: 9840,
      likes: 278,
      comments: 35,
    },
  ];

  const popularPosts = blogPosts
    .filter((post) => post.isPopular)
    .slice(0, 5)
    .sort((a, b) => b.views - a.views);

  const featuredPost = blogPosts.find((post) => post.isFeatured);

  const filteredPosts = blogPosts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.views - a.views;
        case "likes":
          return b.likes - a.likes;
        case "oldest":
          return (
            new Date(a.publishDate).getTime() -
            new Date(b.publishDate).getTime()
          );
        default: // latest
          return (
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime()
          );
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat.id === id);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribe:", emailSubscribe);
    setEmailSubscribe("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              <BookOpen className="w-4 h-4 mr-2" />
              Blog Chăm Sóc Mắt
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Tin Tức & Kiến Thức
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Cập nh���t những thông tin mới nhất về chăm sóc mắt, công nghệ
              kính và xu hướng thời trang từ các chuyên gia hàng đầu
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Tìm kiếm bài viết, chủ đề..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 bg-white shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Featured Articles Slider */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                Bài viết nổi bật
              </h2>
              <p className="text-gray-600">Những bài viết được quan tâm nhất</p>
            </div>

            <div className="relative overflow-hidden">
              <div className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide pb-4 px-4 sm:px-0">
                {blogPosts.slice(0, 5).map((post, index) => (
                  <Card
                    key={post.id}
                    className="flex-shrink-0 w-72 sm:w-80 lg:w-96 overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 space-y-2">
                        {index === 0 && (
                          <Badge className="bg-red-500 text-white">
                            <FlameKindling className="w-3 h-3 mr-1" />
                            Nổi bật
                          </Badge>
                        )}
                        {post.isPopular && (
                          <Badge className="bg-orange-500 text-white">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Ph��� biến
                          </Badge>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <Badge className="mb-2 bg-white/20 text-white border-white/30">
                          {getCategoryById(post.category)?.name}
                        </Badge>
                        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-white/80">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{post.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                      <Button size="sm" className="w-full" asChild>
                        <Link to={`/blog/${post.id}`}>
                          Đọc tiếp
                          <ArrowRight className="w-3 h-3 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Scroll indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gray-300"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Chủ đề nổi bật</h2>
          </div>

          {/* Category Pills - Wrapping Layout */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === "all"
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả bài viết
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? `${category.color.replace("bg-", "bg-")} text-white shadow-lg`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="w-4 h-4">{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="text-xs opacity-75">
                      ({category.count})
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Compact Sorting */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {filteredPosts.length} bài viết
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    Sắp xếp theo:
                  </span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32 h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Mới nhất</SelectItem>
                      <SelectItem value="popular">Phổ biến</SelectItem>
                      <SelectItem value="likes">Nhiều like</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Articles Grid */}
              <div className="space-y-8">
                {filteredPosts.slice(0, visiblePosts).map((post) => (
                  <Card
                    key={post.id}
                    className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      <div className="relative aspect-video md:aspect-auto overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 space-y-2">
                          {post.isNew && (
                            <Badge className="bg-green-500 text-white">
                              Mới
                            </Badge>
                          )}
                          {post.isPopular && (
                            <Badge className="bg-orange-500 text-white">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Phổ biến
                            </Badge>
                          )}
                        </div>
                      </div>

                      <CardContent className="md:col-span-2 p-6 lg:p-8">
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <Badge className="bg-blue-100 text-blue-800 w-fit">
                              {getCategoryById(post.category)?.name}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {formatDate(post.publishDate)}
                            </span>
                          </div>

                          <Link to={`/blog/${post.id}`}>
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>

                          <p className="text-gray-600 leading-relaxed text-sm sm:text-base line-clamp-2 sm:line-clamp-3">
                            {post.excerpt}
                          </p>

                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.tags.length - 3}
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 sm:pt-4">
                            <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="truncate max-w-24 sm:max-w-none">
                                  {post.author}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{post.readTime}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{post.views.toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end">
                              <div className="flex items-center space-x-1 sm:space-x-2 sm:mr-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 sm:p-2"
                                >
                                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  <span className="text-xs sm:text-sm">
                                    {post.likes}
                                  </span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 sm:p-2"
                                >
                                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  <span className="text-xs sm:text-sm">
                                    {post.comments}
                                  </span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 sm:p-2"
                                >
                                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                className="text-xs sm:text-sm"
                                asChild
                              >
                                <Link to={`/blog/${post.id}`}>
                                  Đọc tiếp
                                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Load More Button */}
              {visiblePosts < filteredPosts.length && (
                <div className="flex items-center justify-center mt-12">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setVisiblePosts((prev) => prev + 6)}
                    className="px-8 py-3 border-2 hover:bg-blue-50 hover:border-blue-300"
                  >
                    Xem thêm bài viết
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Newsletter Signup */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg">Đăng ký nhận tin</h3>
                    <p className="text-gray-600 text-sm">
                      Nhận những bài viết mới nhất về chăm sóc mắt
                    </p>
                    <form onSubmit={handleSubscribe} className="space-y-3">
                      <Input
                        type="email"
                        placeholder="Email của bạn"
                        value={emailSubscribe}
                        onChange={(e) => setEmailSubscribe(e.target.value)}
                        className="bg-white"
                      />
                      <Button type="submit" className="w-full">
                        <Bell className="w-4 h-4 mr-2" />
                        Đăng ký
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Posts */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                    Bài viết phổ biến
                  </h3>
                  <div className="space-y-4">
                    {popularPosts.map((post, index) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.id}`}
                        className="flex space-x-3 group cursor-pointer"
                      >
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm leading-tight group-hover:text-blue-600 transition-colors mb-1">
                            {post.title}
                          </h4>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>{formatDate(post.publishDate)}</span>
                            <span>{post.views.toLocaleString()} views</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Categories Widget */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-6 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
                    Chủ đề
                  </h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center text-white`}
                          >
                            {category.icon}
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {category.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags Cloud */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-6 flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-green-500" />
                    Tags phổ biến
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Chăm sóc mắt",
                      "Ánh sáng xanh",
                      "Kính cận",
                      "Tròng kính",
                      "Thời trang",
                      "Sức khỏe",
                      "Công nghệ",
                      "UV",
                      "Trẻ em",
                      "Vitamin",
                      "Đa tròng",
                      "Kính râm",
                    ].map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-6">Theo dõi chúng tôi</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center justify-center space-x-2 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Facebook className="w-4 h-4 text-blue-600" />
                      <span>Facebook</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center space-x-2 hover:bg-blue-50 hover:border-blue-400"
                    >
                      <Twitter className="w-4 h-4 text-blue-400" />
                      <span>Twitter</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center space-x-2 hover:bg-pink-50 hover:border-pink-400"
                    >
                      <Instagram className="w-4 h-4 text-pink-500" />
                      <span>Instagram</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center space-x-2 hover:bg-red-50 hover:border-red-400"
                    >
                      <Youtube className="w-4 h-4 text-red-500" />
                      <span>YouTube</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
