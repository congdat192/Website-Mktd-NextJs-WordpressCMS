import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Shield,
  Star,
  Award,
  Sparkles,
  Calendar,
  Phone,
  MapPin,
  CheckCircle,
  TrendingUp,
  Users,
  Heart,
  Glasses,
  Sun,
  Baby,
  Zap,
  ArrowRight,
  Gift,
  Clock,
  Headphones,
  Target,
} from "lucide-react";

const TrangChu2 = () => {
  const brandPrimary = "#22c55e";

  const features = [
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Khám mắt miễn phí",
      description: "Kiểm tra thị lực chuyên nghiệp với thiết bị hiện đại nhất",
      highlight: "100% miễn phí",
      color: "bg-green-500",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Bảo hành trọn đời",
      description: "Cam kết chất lượng với chính sách bảo hành vượt trội",
      highlight: "Yên tâm mua sắm",
      color: "bg-blue-500",
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Đánh giá 4.9/5",
      description: "Hơn 50,000 khách hàng hài lòng và tin tưởng sử dụng",
      highlight: "50K+ khách hàng",
      color: "bg-orange-500",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Chính hãng 100%",
      description: "Sản phẩm từ các thương hiệu nổi tiếng thế giới",
      highlight: "Uy tín đảm bảo",
      color: "bg-purple-500",
    },
  ];

  const categories = [
    {
      title: "Gọng kính",
      description: "Đa dạng kiểu dáng, phong cách hiện đại",
      image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=300&fit=crop",
      badge: "500+ mẫu",
      icon: <Glasses className="h-6 w-6" />,
      link: "/frames",
    },
    {
      title: "Tròng kính",
      description: "Công nghệ tiên tiến, bảo vệ mắt tối ưu",
      image: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=300&fit=crop",
      badge: "Chống UV",
      icon: <Eye className="h-6 w-6" />,
      link: "/lenses",
    },
    {
      title: "Kính mát",
      description: "Thời trang, bảo vệ mắt khỏi tia UV",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=300&fit=crop",
      badge: "Hot trend",
      icon: <Sun className="h-6 w-6" />,
      link: "/sunglasses",
    },
    {
      title: "Kính trẻ em",
      description: "An toàn, bền đẹp cho bé yêu",
      image: "https://images.unsplash.com/photo-1584528082829-5d7ab3395a9d?w=400&h=300&fit=crop",
      badge: "Đặc biệt",
      icon: <Baby className="h-6 w-6" />,
      link: "/children-glasses",
    },
  ];

  const services = [
    {
      icon: <Eye className="h-12 w-12 text-primary" />,
      title: "Khám mắt chuyên khoa",
      description: "Đội ngũ bác sĩ chuyên khoa mắt giàu kinh nghiệm, thiết bị đo lường hiện đại nhất",
      features: ["Đo độ chính xác cao", "Kiểm tra sức khỏe mắt", "Tư vấn chuyên sâu"],
    },
    {
      icon: <Target className="h-12 w-12 text-primary" />,
      title: "Tư vấn chọn kính",
      description: "Chuyên gia tư vấn phong cách, giúp bạn chọn được kính phù hợp nhất",
      features: ["Phân tích khuôn mặt", "Gợi ý phong cách", "Thử kính trực tiếp"],
    },
    {
      icon: <Zap className="h-12 w-12 text-primary" />,
      title: "Cắt tròng nhanh",
      description: "Công nghệ cắt tròng tự động, nhận kính chỉ trong 30-60 phút",
      features: ["Cắt chính xác", "Giao nhanh 30-60 phút", "Bảo hành chất lượng"],
    },
    {
      icon: <Headphones className="h-12 w-12 text-primary" />,
      title: "Chăm sóc sau bán",
      description: "Hỗ trợ vệ sinh, điều chỉnh, bảo trì kính miễn phí trọn đời",
      features: ["Vệ sinh miễn phí", "Điều chỉnh kính", "Hỗ trợ 24/7"],
    },
  ];

  const whyChooseUs = [
    {
      number: "16+",
      label: "Năm kinh nghiệm",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      number: "50K+",
      label: "Khách hàng hài lòng",
      icon: <Users className="h-6 w-6" />,
    },
    {
      number: "9",
      label: "Chi nhánh tại TP.HCM",
      icon: <MapPin className="h-6 w-6" />,
    },
    {
      number: "98%",
      label: "Tỷ lệ hài lòng",
      icon: <Heart className="h-6 w-6" />,
    },
  ];

  const testimonials = [
    {
      name: "Nguyễn Văn A",
      role: "Khách hàng thân thiết",
      content: "Dịch vụ tuyệt vời, nhân viên tư vấn nhiệt tình. Tôi đã mua 3 cặp kính ở đây và đều rất hài lòng!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    {
      name: "Trần Thị B",
      role: "Khách hàng mới",
      content: "Khám mắt miễn phí rất chuyên nghiệp, máy móc hiện đại. Kính đẹp và chất lượng tốt.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    {
      name: "Lê Văn C",
      role: "Khách hàng VIP",
      content: "Mua kính cho cả gia đình ở đây. Giá cả hợp lý, chất lượng tốt, bảo hành chu đáo.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
  ];

  const promotions = [
    {
      icon: <Gift className="h-8 w-8" />,
      title: "Giảm 20% đơn đầu tiên",
      description: "Cho khách hàng mới khi đặt lịch khám mắt",
      code: "NEW20",
      color: "bg-red-500",
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Mua 1 tặng 1",
      description: "Mua gọng tặng tròng kính chống ánh sáng xanh",
      code: "COMBO",
      color: "bg-purple-500",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Tích điểm thành viên",
      description: "Đổi quà tặng và nhận ưu đãi độc quyền",
      code: "VIP",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-16 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-white"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="w-fit bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Chuyên gia chăm sóc mắt từ 2008
                </Badge>
                <h1 className="text-4xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Sắm kính chuẩn
                  <br />
                  <span className="text-primary">Bảo vệ đôi mắt</span> bạn
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
                  Hơn 50,000 khách hàng tin tưởng với dịch vụ khám mắt miễn phí, sản phẩm chính hãng 100% và bảo hành trọn đời.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link to="/eye-exam">
                    <Calendar className="mr-2 h-5 w-5" />
                    Đặt lịch khám mắt
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                  <Link to="/products">
                    <Glasses className="mr-2 h-5 w-5" />
                    Xem sản phẩm
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {whyChooseUs.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex justify-center mb-2 text-primary">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-primary">{stat.number}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-200 to-emerald-300 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&h=800&fit=crop"
                  alt="Mắt Kính Tâm Đức"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white p-4 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Khám mắt miễn phí</div>
                    <div className="text-xs text-gray-600">100% miễn phí</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Chính hãng 100%</div>
                    <div className="text-xs text-gray-600">Uy tín đảm bảo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                  <Badge variant="secondary">{feature.highlight}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Danh mục sản phẩm</h2>
            <p className="text-xl text-gray-600">Khám phá bộ sưu tập đa dạng của chúng tôi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link key={index} to={category.link}>
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-0 shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 right-4 bg-primary/90 text-white border-0">
                      {category.badge}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3 text-primary">
                        {category.icon}
                      </div>
                      <h3 className="font-bold text-xl">{category.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                      Xem thêm <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Dịch vụ của chúng tôi</h2>
            <p className="text-xl text-gray-600">Trải nghiệm dịch vụ chăm sóc mắt chuyên nghiệp</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">{service.icon}</div>
                  <h3 className="font-bold text-lg mb-3 text-center">{service.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 text-center">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Ưu đãi đặc biệt</h2>
            <p className="text-xl text-gray-600">Nhận ngay các chương trình khuyến mãi hấp dẫn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {promotions.map((promo, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all border-0 shadow-lg">
                <div className={`${promo.color} p-6 text-white`}>
                  <div className="flex justify-center mb-4">{promo.icon}</div>
                  <h3 className="font-bold text-xl text-center mb-2">{promo.title}</h3>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4 text-center">{promo.description}</p>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg text-center">
                    <span className="text-xs text-gray-600">Mã:</span>
                    <span className="font-bold text-primary ml-2">{promo.code}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Khách hàng nói gì</h2>
            <p className="text-xl text-gray-600">Hơn 50,000 khách hàng hài lòng</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Đặt lịch khám mắt miễn phí ngay hôm nay
          </h2>
          <p className="text-xl lg:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
            Nhận tư vấn chuyên nghiệp từ đội ngũ bác sĩ giàu kinh nghiệm. Khám mắt miễn phí, chọn kính phù hợp với bạn.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">Khám mắt miễn phí</h3>
              <p className="text-green-100 text-sm">Kiểm tra thị lực toàn diện</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">Tư vấn chuyên nghiệp</h3>
              <p className="text-green-100 text-sm">Đội ngũ bác sĩ giàu kinh nghiệm</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">Chất lư��ng đảm bảo</h3>
              <p className="text-green-100 text-sm">Sản phẩm chính hãng 100%</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" variant="secondary" className="text-xl px-10 py-6 shadow-xl" asChild>
              <Link to="/eye-exam">
                <Calendar className="mr-3 h-6 w-6" />
                Đặt lịch ngay
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-xl px-10 py-6 border-2 border-white text-white hover:bg-white hover:text-primary"
              asChild
            >
              <Link to="/contact">
                <Phone className="mr-3 h-6 w-6" />
                Liên hệ: 1900 1234
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TrangChu2;
