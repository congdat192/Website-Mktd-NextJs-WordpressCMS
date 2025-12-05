import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAuthForCart } from "@/lib/authGuard";
import { Monitor, Shield, Eye, Clock, Star, Zap, CheckCircle } from "lucide-react";

const BlueLightProtection = () => {
  const products = [
    {
      id: 1,
      name: "Kính Chống Ánh Sáng Xanh Premium",
      price: "1,800,000đ",
      originalPrice: "2,200,000đ",
      rating: 4.9,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
      features: ["Lọc 95% ánh sáng xanh", "Chống phản quang", "Siêu nhẹ"],
      protection: "95%",
      bestseller: true,
    },
    {
      id: 2,
      name: "Kính Gaming Chuyên Nghiệp",
      price: "1,500,000đ",
      originalPrice: "1,800,000đ",
      rating: 4.8,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=400&fit=crop",
      features: ["Thiết kế gaming", "Giảm mỏi mắt", "Tăng độ tương phản"],
      protection: "90%",
      bestseller: false,
    },
    // Add more products...
  ];

  const benefits = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Bảo Vệ Toàn Diện",
      description: "Lọc đến 95% ánh sáng xanh có hại từ màn hình điện tử"
    },
    {
      icon: <Eye className="h-8 w-8 text-blue-600" />,
      title: "Giảm Mỏi Mắt",
      description: "Giảm thiểu triệu chứng mỏi mắt, khô mắt khi sử dụng máy tính"
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Cải Thiện Giấc Ngủ",
      description: "Giúp điều hòa nhịp sinh học tự nhiên, ngủ ngon hơn"
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "Tăng Hiệu Suất",
      description: "Làm việc lâu hơn mà không bị mỏi mắt hay đau đầu"
    },
  ];

  const symptoms = [
    "Mỏi mắt sau khi sử dụng máy tính",
    "Khô mắt, ngứa mắt",
    "Đau đầu, căng thẳng",
    "Khó ngủ sau khi dùng điện thoại",
    "Mờ mắt tạm thời",
    "Khó tập trung khi làm việc"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Monitor className="h-16 w-16 mx-auto mb-6 text-white/90" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Chống Ánh Sáng Xanh
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Bảo vệ mắt khỏi tác hại của ánh sáng xanh từ màn hình điện tử với công nghệ tiên tiến
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Bạn Có Đang Gặp Những Triệu Chứng Này?
              </h2>
              <div className="space-y-3">
                {symptoms.map((symptom, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{symptom}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Cảnh báo:</strong> Việc tiếp xúc lâu dài với ánh sáng xanh có thể gây tổn hại 
                  nghiêm trọng đến mắt và ảnh hưởng đến sức khỏe tổng thể.
                </p>
              </div>
            </div>
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop"
                alt="Person using computer"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lợi Ích Của Kính Chống Ánh Sáng Xanh
            </h2>
            <p className="text-xl text-gray-600">
              Giải pháp toàn diện cho sức khỏe mắt trong thời đại số
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Công Nghệ Tiên Tiến
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">95%</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Lọc Ánh Sáng Xanh
              </h3>
              <p className="text-gray-600">
                Công nghệ lọc tiên tiến loại bỏ đến 95% ánh sáng xanh có hại
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Chống Phản Quang
              </h3>
              <p className="text-gray-600">
                Lớp phủ đặc biệt giảm thiểu phản quang và chói lóa
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Bảo Vệ UV
              </h3>
              <p className="text-gray-600">
                Chống 100% tia UV có hại, bảo vệ toàn diện cho mắt
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sản Phẩm Nổi Bật
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/2 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 md:h-full object-cover"
                    />
                    {product.bestseller && (
                      <Badge className="absolute top-4 left-4 bg-blue-600">
                        Bán chạy
                      </Badge>
                    )}
                    <div className="absolute top-4 right-4 bg-white rounded-full p-2">
                      <span className="text-sm font-bold text-blue-600">{product.protection}</span>
                    </div>
                  </div>
                  <CardContent className="md:w-1/2 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center text-yellow-400 mr-2">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews} đánh giá)</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => { if (!requireAuthForCart()) return; location.assign('/cart'); }}>
                      Mua ngay
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-12 w-12 mx-auto mb-6 text-white/90" />
          <h2 className="text-3xl font-bold mb-4">
            Bảo Vệ Mắt Ngay Hôm Nay
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Đừng để ánh sáng xanh tàn phá sức khỏe mắt của bạn. Hãy bảo vệ ngay!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Xem tất cả sản phẩm
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              Tư vấn miễn phí
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlueLightProtection;
