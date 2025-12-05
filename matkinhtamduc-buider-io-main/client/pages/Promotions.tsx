import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAuthForCart } from "@/lib/authGuard";
import { Tag, Gift, Zap, Star, Clock, ArrowRight } from "lucide-react";

const Promotions = () => {
  const promotions = [
    {
      id: 1,
      title: "Khuyến Mãi Mùa Hè 2024",
      description: "Giảm giá đến 50% cho tất cả kính mát thời trang",
      discount: "50%",
      validUntil: "31/12/2024",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=400&fit=crop",
      category: "Kính mát",
      type: "percentage",
      featured: true,
      code: "SUMMER50"
    },
    {
      id: 2,
      title: "Combo Siêu Tiết Kiệm",
      description: "Mua gọng kính tặng ngay tròng kính cao cấp",
      discount: "Tặng tròng",
      validUntil: "15/01/2025",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=400&fit=crop",
      category: "Gọng + Tròng",
      type: "gift",
      featured: true,
      code: "COMBO2024"
    },
    {
      id: 3,
      title: "Sinh Viên Ưu Đãi",
      description: "Giảm 30% cho sinh viên khi mua kính cận",
      discount: "30%",
      validUntil: "30/06/2025",
      image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&h=400&fit=crop",
      category: "Kính cận",
      type: "percentage",
      featured: false,
      code: "STUDENT30"
    },
    // Add more promotions...
  ];

  const flashSales = [
    {
      id: 1,
      name: "Ray-Ban Aviator Classic",
      originalPrice: "4,500,000đ",
      salePrice: "2,250,000đ",
      discount: 50,
      timeLeft: "02:15:30",
      sold: 45,
      total: 100,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Gọng Titan Premium",
      originalPrice: "3,200,000đ",
      salePrice: "1,920,000đ",
      discount: 40,
      timeLeft: "05:42:18",
      sold: 28,
      total: 50,
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&h=300&fit=crop"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-500 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Tag className="h-16 w-16 mx-auto mb-6 text-white/90" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Khuyến Mãi Đặc Biệt
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Những ưu đãi hấp dẫn nhất cho kính mắt chất lượng cao - Tiết kiệm đến 50%
            </p>
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      <section className="py-8 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <Zap className="h-8 w-8 mr-3 animate-pulse" />
            <h2 className="text-2xl font-bold">FLASH SALE - SẮP KẾT THÚC!</h2>
            <Zap className="h-8 w-8 ml-3 animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {flashSales.map((item) => (
              <Card key={item.id} className="bg-white text-gray-900">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-red-600">{item.salePrice}</span>
                        <span className="text-sm text-gray-500 line-through">{item.originalPrice}</span>
                        <Badge className="bg-red-500">-{item.discount}%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <Clock className="h-4 w-4 inline mr-1" />
                          Còn lại: <span className="font-bold text-red-600">{item.timeLeft}</span>
                        </div>
                        <div className="text-sm">
                          Đã bán: {item.sold}/{item.total}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(item.sold / item.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Promotions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ưu Đãi Nổi Bật
            </h2>
            <p className="text-xl text-gray-600">
              Những chương trình khuyến mãi đặc biệt không thể bỏ lỡ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {promotions.filter(p => p.featured).map((promotion) => (
              <Card key={promotion.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={promotion.image}
                    alt={promotion.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white text-lg px-3 py-1">
                      {promotion.discount}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white">
                      {promotion.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {promotion.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {promotion.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Có hiệu lực đến: {promotion.validUntil}
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {promotion.code}
                    </Badge>
                  </div>
                  <Button className="w-full" onClick={() => { if (!requireAuthForCart()) return; location.assign('/cart'); }}>
                    Mua ngay
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Promotions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Tất Cả Khuyến Mãi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promotion) => (
              <Card key={promotion.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={promotion.image}
                    alt={promotion.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-red-500">
                    {promotion.discount}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="absolute top-3 right-3 bg-white"
                  >
                    {promotion.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {promotion.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {promotion.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>
                      <Clock className="h-3 w-3 inline mr-1" />
                      Đến {promotion.validUntil}
                    </span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {promotion.code}
                    </span>
                  </div>
                  <Button size="sm" className="w-full">
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cách Sử Dụng Mã Khuyến Mãi
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Chọn sản phẩm</h3>
              <p className="text-gray-600 text-sm">
                Thêm sản phẩm yêu thích vào giỏ hàng
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Nhập mã</h3>
              <p className="text-gray-600 text-sm">
                Nhập mã khuyến mãi tại trang thanh toán
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Tiết kiệm</h3>
              <p className="text-gray-600 text-sm">
                Hoàn tất đơn hàng và nhận ưu đãi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Gift className="h-12 w-12 mx-auto mb-6 text-white/90" />
          <h2 className="text-3xl font-bold mb-4">
            Nhận Ưu Đãi Độc Quyền
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Đăng ký email để không bỏ lỡ các chương trình khuyến mãi mới nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white text-gray-900"
            />
            <Button variant="secondary" className="px-6 py-3">
              Đăng ký ngay
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Promotions;
