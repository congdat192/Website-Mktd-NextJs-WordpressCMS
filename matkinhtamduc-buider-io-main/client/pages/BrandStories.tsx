import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star, Award, Heart, Users } from "lucide-react";

const BrandStories = () => {
  const stories = [
    {
      id: 1,
      title: "Ray-Ban: Huyền Thoại Của Thế Giới Kính Mắt",
      excerpt: "Từ năm 1937, Ray-Ban đã trở thành biểu tượng của phong cách và chất lượng trong ngành kính mắt...",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=400&fit=crop",
      category: "Thương hiệu",
      readTime: "5 phút đọc",
      featured: true,
    },
    {
      id: 2,
      title: "Essilor: Đi Đầu Trong Công Nghệ Tròng Kính",
      excerpt: "Khám phá hành trình 170 năm của Essilor trong việc phát triển các giải pháp thị lực tiên tiến...",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=400&fit=crop",
      category: "Công nghệ",
      readTime: "7 phút đọc",
      featured: true,
    },
    {
      id: 3,
      title: "Oakley: Đam Mê Thể Thao Và Hiệu Suất",
      excerpt: "Tìm hiểu về cam kết của Oakley trong việc tạo ra kính mắt cho các vận động viên hàng đầu thế giới...",
      image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&h=400&fit=crop",
      category: "Thể thao",
      readTime: "6 phút đọc",
      featured: false,
    },
    {
      id: 4,
      title: "Zeiss: Sự Hoàn Hảo Của Quang Học Đức",
      excerpt: "Câu chuyện về tinh thần thủ công Đức và công nghệ quang học đỉnh cao của Zeiss...",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=400&fit=crop",
      category: "Chất lư��ng",
      readTime: "8 phút đọc",
      featured: false,
    },
    {
      id: 5,
      title: "Gucci: Thời Trang Xa Xỉ Gặp Công Nghệ",
      excerpt: "Khám phá cách Gucci kết hợp di sản thời trang Italy với công nghệ kính mắt hiện đại...",
      image: "https://images.unsplash.com/photo-1556306545-d1928e16e93b?w=600&h=400&fit=crop",
      category: "Thời trang",
      readTime: "4 phút đọc",
      featured: false,
    },
    {
      id: 6,
      title: "Tom Ford: Định Nghĩa Lại Kính Mắt Cao Cấp",
      excerpt: "Cái nhìn sâu sắc về triết lý thiết kế và cam kết chất lượng của Tom Ford...",
      image: "https://images.unsplash.com/photo-1620987278429-ab178d6eb547?w=600&h=400&fit=crop",
      category: "Thiết kế",
      readTime: "5 phút đọc",
      featured: false,
    },
  ];

  const categories = [
    "Tất cả",
    "Thương hiệu", 
    "Công nghệ",
    "Thể thao",
    "Chất lượng",
    "Thời trang",
    "Thiết kế"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-white/90" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Câu Chuyện Thương Hiệu
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Khám phá lịch sử, triết lý và cam kết chất lượng của những thương hiệu kính mắt hàng đầu thế giới
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">150+</div>
              <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-sm text-gray-600">Thương hiệu nổi tiếng</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">1M+</div>
              <div className="text-sm text-gray-600">Khách hàng tin tưởng</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">100+</div>
              <div className="text-sm text-gray-600">Cửa hàng toàn quốc</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "Tất cả" ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Câu Chuyện Nổi Bật
            </h2>
            <p className="text-xl text-gray-600">
              Những câu chuyện truyền cảm hứng về các thương hiệu hàng đầu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-48 object-cover"
                  />
                  {story.featured && (
                    <Badge className="absolute top-4 left-4 bg-primary">
                      Nổi bật
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className="absolute top-4 right-4 bg-white"
                  >
                    {story.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {story.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{story.readTime}</span>
                    <button className="text-primary font-medium hover:underline">
                      Đọc thêm →
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-6 text-white/90" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Đăng Ký Nhận Câu Chuyện Mới
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Nhận thông tin về những câu chuyện thương hiệu và xu hướng mới nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BrandStories;
