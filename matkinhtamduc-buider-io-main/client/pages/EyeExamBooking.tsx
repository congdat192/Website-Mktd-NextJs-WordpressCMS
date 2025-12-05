import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Eye,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  Star,
  Shield,
  Users,
  Award,
  Zap,
  Gift,
  Percent,
  ChevronRight,
  Stethoscope,
  Microscope,
  Target,
  Heart,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  Building2,
  User,
  Mail,
  MessageCircle,
  ArrowRight,
  AlertCircle,
  Info,
} from "lucide-react";

const EyeExamBooking = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    branch: "",
    date: "",
    time: "",
    services: [] as string[],
    notes: "",
    hasSymptoms: "",
    urgency: "",
  });

  const promotions = [
    {
      id: 1,
      title: "KHÁM MẮT MIỄN PHÍ",
      subtitle: "Cho khách hàng mới",
      description: "Kiểm tra thị lực toàn diện + Tư vấn chuyên nghiệp",
      originalPrice: "200,000đ",
      currentPrice: "MIỄN PHÍ",
      badge: "HOT",
      color: "bg-red-500",
      features: [
        "Đo độ cận, viễn, loạn thị",
        "Kiểm tra sức khỏe mắt",
        "Tư vấn chọn kính",
      ],
      expires: "31/12/2024",
    },
    {
      id: 2,
      title: "COMBO KHÁM + KÍNH",
      subtitle: "Tiết kiệm đến 30%",
      description: "Khám mắt + Gọng kính + Tròng kính chất lượng cao",
      originalPrice: "2,500,000đ",
      currentPrice: "1,750,000đ",
      badge: "SALE",
      color: "bg-orange-500",
      features: [
        "Khám mắt miễn phí",
        "Gọng kính cao cấp",
        "Tròng kính chống ánh sáng xanh",
      ],
      expires: "15/01/2025",
    },
    {
      id: 3,
      title: "GÓI VIP PREMIUM",
      subtitle: "Dành cho gia đình",
      description: "Khám mắt cho cả gia đình + Ưu đãi đặc biệt",
      originalPrice: "1,000,000đ",
      currentPrice: "699,000đ",
      badge: "VIP",
      color: "bg-purple-500",
      features: ["Khám cho 4 người", "Bảo hành trọn đời", "Tặng voucher 500K"],
      expires: "28/02/2025",
    },
  ];

  const branches = [
    {
      id: "q1",
      name: "Chi nhánh Quận 1 (Flagship)",
      address: "123 Nguyễn Huệ, Quận 1",
      phone: "028 1234 5678",
      distance: "2.3km",
      rating: 4.9,
      availableToday: true,
      nextSlot: "14:30",
    },
    {
      id: "q3",
      name: "Chi nhánh Quận 3",
      address: "456 Võ Văn Tần, Quận 3",
      phone: "028 2345 6789",
      distance: "3.1km",
      rating: 4.8,
      availableToday: true,
      nextSlot: "15:00",
    },
    {
      id: "thuduc",
      name: "Chi nhánh Thủ Đức",
      address: "789 Võ Văn Ngân, Thủ Đức",
      phone: "028 3456 7890",
      distance: "5.7km",
      rating: 4.7,
      availableToday: false,
      nextSlot: "09:00 (mai)",
    },
    {
      id: "q7",
      name: "Chi nhánh Quận 7",
      address: "654 Nguyễn Thị Thập, Quận 7",
      phone: "028 5678 9012",
      distance: "8.2km",
      rating: 4.8,
      availableToday: true,
      nextSlot: "16:30",
    },
  ];

  const examServices = [
    {
      id: "basic",
      name: "Khám mắt cơ bản",
      description: "Đo độ cận, viễn, loạn thị + Kiểm tra thị lực",
      duration: "30 phút",
      price: "MIỄN PHÍ",
      icon: <Eye className="h-6 w-6" />,
    },
    {
      id: "comprehensive",
      name: "Khám mắt tổng quát",
      description: "Khám toàn diện + Soi đáy mắt + Đo nhãn áp",
      duration: "45 phút",
      price: "150,000đ",
      icon: <Stethoscope className="h-6 w-6" />,
    },
    {
      id: "children",
      name: "Khám mắt trẻ em",
      description: "Chuyên biệt cho trẻ dưới 12 tuổi",
      duration: "40 phút",
      price: "MIỄN PHÍ",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      id: "specialty",
      name: "Khám chuyên khoa",
      description: "Bệnh lý mắt + Tư vấn chuyên sâu",
      duration: "60 phút",
      price: "300,000đ",
      icon: <Microscope className="h-6 w-6" />,
    },
  ];

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
  ];

  const benefits = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Nhanh chóng",
      description: "Đặt lịch dễ dàng, không phải chờ đợi",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "An toàn",
      description: "Thiết bị hiện đại, quy trình chuẩn quốc tế",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Chuyên nghiệp",
      description: "Đội ngũ bác sĩ giàu kinh nghiệm",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Tận tâm",
      description: "Tư vấn chi tiết, hỗ trợ suốt đời",
    },
  ];

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking submitted:", formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-green-50 to-emerald-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-5"></div>
        <div className="container mx-auto px-4 py-16 lg:py-24 relative">
          <div className="text-center max-w-5xl mx-auto">
            <Badge className="mb-6 bg-red-500 text-white animate-pulse">
              <Gift className="h-4 w-4 mr-2" />
              KHUYẾN MÃI ĐẶC BIỆT - MIỄN PHÍ KHÁM MẮT
            </Badge>
            <h1 className="text-4xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Đặt lịch <span className="text-primary">Khám Mắt</span>
              <br />
              <span className="text-3xl lg:text-5xl">
                Miễn phí ngay hôm nay
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              Kiểm tra thị lực chuyên nghiệp với công nghệ hiện đại nhất.
              <br />
              <span className="text-primary font-semibold">
                Đặt lịch online - Nhận ưu đãi ngay!
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="text-xl px-10 py-6 shadow-xl hover:shadow-2xl transition-all"
              >
                <Calendar className="mr-3 h-6 w-6" />
                Đặt lịch ngay
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-xl px-10 py-6 border-2 hover:bg-primary hover:text-white"
              >
                <Phone className="mr-3 h-6 w-6" />
                Gọi hotline: 1900 1234
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-white/80 rounded-lg backdrop-blur-sm border"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                    {benefit.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>Đặt lịch khám mắt</span>
        </div>

        {/* Promotions */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              🔥 Ưu đãi đặc biệt tháng này
            </h2>
            <p className="text-xl text-gray-600">
              Đặt lịch ngay để nhận được ưu đãi tốt nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {promotions.map((promo) => (
              <Card
                key={promo.id}
                className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group"
              >
                <div
                  className={`absolute top-4 right-4 ${promo.color} text-white px-3 py-1 rounded-full text-sm font-bold z-10`}
                >
                  {promo.badge}
                </div>
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Percent className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-primary">
                    {promo.title}
                  </CardTitle>
                  <p className="text-gray-600 font-medium">{promo.subtitle}</p>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-700">{promo.description}</p>

                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      {promo.currentPrice}
                    </div>
                    <div className="text-lg text-gray-500 line-through">
                      {promo.originalPrice}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {promo.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-orange-700">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Hết hạn: {promo.expires}
                    </p>
                  </div>

                  <Button className="w-full group-hover:shadow-lg transition-all">
                    <Gift className="mr-2 h-4 w-4" />
                    Chọn ưu đãi này
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-2">⚡ ƯU ĐÃI FLASH SALE</h3>
            <p className="text-lg mb-4">
              Giảm thêm 20% cho 10 khách hàng đầu tiên đặt lịch hôm nay!
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Badge className="bg-white text-red-500 font-bold">
                CÒN 7 SUẤT
              </Badge>
              <Button variant="secondary" size="lg">
                <Zap className="mr-2 h-5 w-5" />
                Đặt ngay kẻo lỡ
              </Button>
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Calendar className="mr-3 h-6 w-6 text-primary" />
                    Đặt lịch khám mắt
                  </CardTitle>
                  <p className="text-gray-600">
                    Điền thông tin để đặt lịch khám miễn phí
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center">
                        <User className="mr-2 h-5 w-5 text-primary" />
                        Thông tin cá nhân
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Họ và tên *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            placeholder="Nhập h�� và tên"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Số điện thoại *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            placeholder="Nhập số điện thoại"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            placeholder="Nhập email (không bắt buộc)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="age">Tuổi</Label>
                          <Select
                            value={formData.age}
                            onValueChange={(value) =>
                              handleInputChange("age", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn độ tuổi" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-12">
                                Dưới 12 tuổi
                              </SelectItem>
                              <SelectItem value="12-18">12-18 tuổi</SelectItem>
                              <SelectItem value="18-30">18-30 tuổi</SelectItem>
                              <SelectItem value="30-50">30-50 tuổi</SelectItem>
                              <SelectItem value="over-50">
                                Trên 50 tuổi
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Branch Selection */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center">
                        <MapPin className="mr-2 h-5 w-5 text-primary" />
                        Chọn chi nhánh
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {branches.map((branch) => (
                          <div
                            key={branch.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              formData.branch === branch.id
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-primary/50"
                            }`}
                            onClick={() =>
                              handleInputChange("branch", branch.id)
                            }
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold">{branch.name}</h4>
                              {branch.availableToday && (
                                <Badge className="bg-green-500 text-xs">
                                  Còn chỗ
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {branch.address}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                <span>{branch.rating}</span>
                                <span className="text-gray-500 mx-2">•</span>
                                <span>{branch.distance}</span>
                              </div>
                              <span className="text-primary font-medium">
                                Slot: {branch.nextSlot}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Service Selection */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center">
                        <Stethoscope className="mr-2 h-5 w-5 text-primary" />
                        Chọn dịch vụ khám
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {examServices.map((service) => (
                          <div
                            key={service.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              formData.services.includes(service.id)
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-primary/50"
                            }`}
                            onClick={() => handleServiceToggle(service.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="text-primary">{service.icon}</div>
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">
                                  {service.name}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  {service.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">
                                    {service.duration}
                                  </span>
                                  <span
                                    className={`font-bold ${service.price === "MIỄN PHÍ" ? "text-green-600" : "text-primary"}`}
                                  >
                                    {service.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-primary" />
                        Chọn ngày và giờ
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">Ngày khám *</Label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                              handleInputChange("date", e.target.value)
                            }
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Giờ khám *</Label>
                          <Select
                            value={formData.time}
                            onValueChange={(value) =>
                              handleInputChange("time", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn giờ" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center">
                        <MessageCircle className="mr-2 h-5 w-5 text-primary" />
                        Thông tin bổ sung
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="symptoms">
                            Bạn có triệu chứng gì về mắt không?
                          </Label>
                          <Select
                            value={formData.hasSymptoms}
                            onValueChange={(value) =>
                              handleInputChange("hasSymptoms", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn tình trạng" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">
                                Không có triệu chứng
                              </SelectItem>
                              <SelectItem value="blurred">Mờ mắt</SelectItem>
                              <SelectItem value="pain">Đau mắt</SelectItem>
                              <SelectItem value="tired">Mỏi mắt</SelectItem>
                              <SelectItem value="dry">Khô mắt</SelectItem>
                              <SelectItem value="other">
                                Triệu chứng khác
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="notes">Ghi chú thêm</Label>
                          <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) =>
                              handleInputChange("notes", e.target.value)
                            }
                            placeholder="Mô tả triệu chứng hoặc yêu cầu đặc biệt..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full text-lg py-6 shadow-xl hover:shadow-2xl transition-all"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Xác nhận đặt lịch
                    </Button>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-1">
                            Lưu ý quan trọng:
                          </p>
                          <ul className="space-y-1 text-xs">
                            <li>
                              • Chúng tôi sẽ gọi xác nhận trong vòng 30 phút
                            </li>
                            <li>• Vui lòng đến sớm 10 phút để làm thủ tục</li>
                            <li>• Mang theo CCCD/CMND khi đến khám</li>
                            <li>• Có thể hủy/đổi lịch trước 2 tiếng</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-8">
              {/* Why Choose Us */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Award className="mr-3 h-5 w-5 text-primary" />
                    Tại sao chọn Tâm Đức?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-sm">Khám mắt miễn phí</p>
                      <p className="text-xs text-gray-600">Không phụ thu</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-sm">
                        Đội ngũ chuyên gia
                      </p>
                      <p className="text-xs text-gray-600">
                        15+ năm kinh nghiệm
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Microscope className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-sm">Thiết bị hiện đại</p>
                      <p className="text-xs text-gray-600">
                        Công nghệ Nhật Bản
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <Shield className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-semibold text-sm">Bảo hành trọn đời</p>
                      <p className="text-xs text-gray-600">
                        Chất lượng đảm bảo
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Phone className="mr-3 h-5 w-5 text-primary" />
                    Cần hỗ trợ?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Hotline: 1900 1234
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat trực tuyến
                  </Button>
                  <div className="text-center text-sm text-gray-600">
                    <p>Hỗ trợ 24/7</p>
                    <p>Phản hồi trong 5 phút</p>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Reviews */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Star className="mr-3 h-5 w-5 text-primary" />
                    Khách hàng nói gì?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-2xl font-bold">4.9/5</p>
                    <p className="text-sm text-gray-600">Từ 10,000+ đánh giá</p>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm italic">
                        "Dịch vụ tuyệt vời, khám mắt rất kỹ càng"
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        - Nguyễn Thị Mai
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm italic">
                        "Nhân viên tận tình, giá cả hợp lý"
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        - Trần Văn Nam
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Quick */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Câu hỏi thường gặp</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">
                Khám mắt có thật sự miễn phí?
              </h3>
              <p className="text-sm text-gray-600">
                Có, hoàn toàn miễn phí cho khám mắt cơ bản bao gồm đo độ và kiểm
                tra thị lực.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">
                Thời gian khám mất bao lâu?
              </h3>
              <p className="text-sm text-gray-600">
                Khám cơ bản mất 30 phút, khám tổng quát 45-60 phút tùy theo tình
                trạng mắt.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">
                Có cần chuẩn bị gì trước khi khám?
              </h3>
              <p className="text-sm text-gray-600">
                Chỉ cần mang CCCD/CMND và đến sớm 10 phút. Không cần nhịn ăn hay
                chuẩn bị gì đặc biệt.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Có thể hủy lịch hẹn không?</h3>
              <p className="text-sm text-gray-600">
                Có thể hủy hoặc đổi lịch miễn phí trước 2 tiếng. Gọi hotline để
                thay đổi.
              </p>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center bg-gradient-to-r from-primary to-green-600 text-white rounded-3xl p-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Đừng để mắt chờ đợi thêm!
          </h2>
          <p className="text-xl mb-8">
            Đặt lịch ngay hôm nay để bảo vệ thị lực và nhận ưu đãi đặc biệt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-xl px-10 py-6"
            >
              <Calendar className="mr-3 h-6 w-6" />
              Đặt lịch miễn phí
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-xl px-10 py-6 border-white text-white hover:bg-white hover:text-primary"
            >
              <Phone className="mr-3 h-6 w-6" />
              Gọi tư vấn ngay
            </Button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default EyeExamBooking;
