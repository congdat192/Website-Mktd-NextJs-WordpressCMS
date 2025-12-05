import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Baby, Shield, Heart, Star, Eye, Sparkles } from "lucide-react";

const ChildrenGlasses = () => {
  const products = [
    {
      id: 1,
      name: "Gọng Kính Trẻ Em Ray-Ban Junior",
      price: "1,200,000đ",
      originalPrice: "1,500,000đ",
      rating: 4.8,
      reviews: 45,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
      features: ["Siêu nhẹ", "An toàn", "Đàn hồi tốt"],
      ageGroup: "8-12 tuổi",
      isNew: true,
    },
    {
      id: 2,
      name: "Kính Chống Ánh Sáng Xanh Trẻ Em",
      price: "800,000đ",
      originalPrice: "1,000,000đ",
      rating: 4.9,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=400&fit=crop",
      features: ["Chống ánh sáng xanh", "Bảo vệ mắt", "Thoải mái"],
      ageGroup: "6-10 tuổi",
      isNew: false,
    },
    // Add more products...
  ];

  const benefits = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "An Toàn Tuyệt Đối",
      description: "Chất liệu không độc hại, không gây dị ứng cho trẻ em"
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Thiết Kế Thân Thiện",
      description: "Màu sắc và hình dáng được thiết kế riêng cho trẻ em"
    },
    {
      icon: <Eye className="h-8 w-8 text-primary" />,
      title: "Bảo Vệ Thị Lực",
      description: "Công nghệ tiên tiến bảo vệ mắt trẻ khỏi tác hại"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Chống Va Đập",
      description: "Khung và tròng siêu bền, chống va đập an toàn"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Baby className="h-16 w-16 mx-auto mb-6 text-white/90" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Kính Trẻ Em
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Bảo vệ đôi mắt của bé với các sản phẩm kính mắt an toàn, thân thiện và chất lượng cao
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại Sao Chọn Kính Trẻ Em Của Chúng Tôi?
            </h2>
            <p className="text-xl text-gray-600">
              An toàn, chất lượng và được thiết kế đặc biệt cho trẻ em
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Age Groups */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lựa Chọn Theo Độ Tuổi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">👶</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  3-6 Tuổi
                </h3>
                <p className="text-gray-600 mb-4">
                  Kính siêu nhẹ, mềm mại và an toàn cho trẻ nhỏ
                </p>
                <Button className="w-full">Xem sản phẩm</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🧒</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  7-12 Tuổi
                </h3>
                <p className="text-gray-600 mb-4">
                  Thiết kế năng động, bền bỉ cho trẻ học sinh
                </p>
                <Button className="w-full">Xem sản phẩm</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">👦</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  13-16 Tuổi
                </h3>
                <p className="text-gray-600 mb-4">
                  Phong cách trẻ trung, hiện đại cho teen
                </p>
                <Button className="w-full">Xem sản phẩm</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sản Phẩm Nổi Bật
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.isNew && (
                    <Badge className="absolute top-4 left-4 bg-pink-500">
                      Mới
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className="absolute top-4 right-4 bg-white"
                  >
                    {product.ageGroup}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-yellow-400 mr-2">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews} đánh giá)</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <span className="text-xl font-bold text-primary">{product.price}</span>
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
                  <Button className="w-full">Xem chi tiết</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Care Tips */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-12 w-12 mx-auto mb-6 text-white/90" />
          <h2 className="text-3xl font-bold mb-4">
            Chăm Sóc Mắt Trẻ Em
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Nhận tư vấn miễn phí từ các chuyên gia về cách bảo vệ thị lực của bé
          </p>
          <Button variant="secondary" size="lg">
            Đặt lịch tư vấn miễn phí
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ChildrenGlasses;
