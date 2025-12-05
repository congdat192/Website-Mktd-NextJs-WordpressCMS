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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Users,
  Calendar,
  Eye,
  Headphones,
  Building2,
  Navigation as NavigationIcon,
  Star,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Award,
  ChevronRight,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    branch: "",
    message: "",
    service: "",
  });

  const storeLocations = [
    {
      id: 1,
      name: "Chi nhánh Quận 1 (Flagship Store)",
      address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
      phone: "028 1234 5678",
      email: "quan1@matkinhtamduc.com",
      hours: "8:00 - 21:00 (Thứ 2 - Chủ nhật)",
      isMain: true,
      features: ["Showroom lớn nhất", "Khám mắt cao cấp", "Tư vấn chuyên sâu"],
      manager: "Bác sĩ Nguyễn Văn A",
    },
    {
      id: 2,
      name: "Chi nhánh Quận 3",
      address: "456 Đường Võ Văn Tần, Quận 3, TP.HCM",
      phone: "028 2345 6789",
      email: "quan3@matkinhtamduc.com",
      hours: "8:00 - 21:00 (Thứ 2 - Chủ nh���t)",
      features: ["Gần trung tâm", "Parking miễn phí", "Express service"],
      manager: "Bác sĩ Lê Thị B",
    },
    {
      id: 3,
      name: "Chi nhánh Thủ Đức",
      address: "789 Đường Võ Văn Ngân, TP. Thủ Đức, TP.HCM",
      phone: "028 3456 7890",
      email: "thuduc@matkinhtamduc.com",
      hours: "8:00 - 21:00 (Thứ 2 - Chủ nhật)",
      features: ["Khu vực sinh viên", "Giá ưu đãi", "Khám mắt miễn phí"],
      manager: "Bác sĩ Trần Văn C",
    },
    {
      id: 4,
      name: "Chi nhánh Bình Thạnh",
      address: "321 Đường Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM",
      phone: "028 4567 8901",
      email: "binhthanhh@matkinhtamduc.com",
      hours: "8:00 - 21:00 (Thứ 2 - Chủ nhật)",
      features: ["Gần Metro", "Dịch vụ nhanh", "Tư vấn online"],
      manager: "Bác sĩ Phạm Thị D",
    },
    {
      id: 5,
      name: "Chi nhánh Quận 7",
      address: "654 Đường Nguyễn Thị Thập, Quận 7, TP.HCM",
      phone: "028 5678 9012",
      email: "quan7@matkinhtamduc.com",
      hours: "8:00 - 21:00 (Thứ 2 - Chủ nhật)",
      features: ["Khu Nam Sài Gòn", "Gia đình trẻ", "Kids zone"],
      manager: "Bác sĩ Hoàng Văn E",
    },
  ];

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Hotline 24/7",
      subtitle: "Hỗ trợ khẩn cấp",
      contact: "1900 1234",
      description: "Gọi ngay để được tư vấn miễn phí",
      action: "Gọi ngay",
      color: "bg-green-500",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Chat trực tuyến",
      subtitle: "Phản hồi nhanh chóng",
      contact: "Chat ngay",
      description: "Tư vấn trực tiếp qua chat",
      action: "Bắt đầu chat",
      color: "bg-blue-500",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email hỗ trợ",
      subtitle: "Phản hồi trong 24h",
      contact: "info@matkinhtamduc.com",
      description: "Gửi câu hỏi chi tiết qua email",
      action: "Gửi email",
      color: "bg-purple-500",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Đặt lịch hẹn",
      subtitle: "Khám mắt miễn phí",
      contact: "Đặt lịch",
      description: "Chọn thời gian phù hợp với bạn",
      action: "Đặt hẹn ngay",
      color: "bg-orange-500",
    },
  ];

  const faqs = [
    {
      question: "Tại sao nên chọn Mắt Kính Tâm Đức?",
      answer:
        "Chúng tôi có hơn 15 năm kinh nghiệm trong ngành chăm sóc mắt với đội ngũ bác sĩ chuyên nghiệp, thiết bị hiện đại nhất và cam kết bảo hành trọn đời. Hệ thống 9 chi nhánh phục vụ khắp TP.HCM với hơn 100,000 khách hàng tin tưởng.",
    },
    {
      question: "Dịch vụ khám mắt có thật sự miễn phí không?",
      answer:
        "Có, chúng tôi cung cấp dịch vụ khám mắt hoàn toàn miễn phí bao gồm đo độ cận, viễn, loạn thị và kiểm tra sức khỏe mắt cơ bản. Đối với khám chuyên sâu về bệnh lý mắt sẽ có phí theo quy định.",
    },
    {
      question: "Thời gian bảo hành kính như thế nào?",
      answer:
        "Tất cả sản phẩm tại Tâm Đức đều được bảo hành trọn đời về chất lượng gọng và tròng kính. Bảo hành 2 năm đối với hư hỏng do lỗi sản xuất và miễn phí điều chỉnh, vệ sinh kính suốt đời.",
    },
    {
      question: "Có thể đổi trả sản phẩm không?",
      answer:
        "Có, bạn có thể đổi trả trong vòng 30 ngày nếu không hài lòng với sản phẩm. Điều kiện: sản phẩm còn nguyên vẹn, chưa qua sử dụng và có đầy đủ hóa đơn, phụ kiện.",
    },
    {
      question: "Làm thế nào để đặt lịch khám mắt?",
      answer:
        "Bạn có thể đặt lịch qua: (1) Hotline 1900 1234, (2) Website, (3) Fanpage Facebook, (4) Trực tiếp tại cửa hàng. Chúng tôi sẽ xác nhận lịch hẹn trong vòng 2 giờ và gửi SMS nhắc nhở trước 1 ngày.",
    },
    {
      question: "Chi phí làm kính cận khoảng bao nhiêu?",
      answer:
        "Chi phí phụ thuộc vào loại gọng và tròng kính bạn chọn. Gọng từ 500K-10M, tròng từ 300K-5M. Chúng tôi có nhiều chương trình ưu đãi và hỗ trợ trả góp 0% lãi suất.",
    },
    {
      question: "Có dịch vụ giao hàng tận nhà không?",
      answer:
        "Có, chúng tôi cung cấp dịch vụ giao hàng miễn phí trong phạm vi TP.HCM cho đơn hàng từ 1 triệu đồng. Thời gian giao hàng 2-4 giờ trong ngày hoặc theo lịch hẹn của khách hàng.",
    },
    {
      question: "Tại sao kính mắt của tôi bị mờ/bẩn nhanh?",
      answer:
        "Có thể do: (1) Chưa có lớp phủ chống bụi, (2) Vệ sinh không đúng cách, (3) Môi trường làm việc bụi bặm. Chúng tôi tư vấn miễn phí cách chăm sóc và có dịch vụ phủ nano chống bụi.",
    },
  ];

  const services = [
    {
      title: "Khám mắt tổng quát",
      description: "Kiểm tra toàn diện thị lực và sức khỏe mắt",
      duration: "30 phút",
      price: "Miễn phí",
    },
    {
      title: "Tư vấn chọn gọng",
      description: "Chọn gọng phù hợp với khuôn mặt và phong cách",
      duration: "20 phút",
      price: "Miễn phí",
    },
    {
      title: "Đo và cắt tròng",
      description: "Đo độ chính xác và cắt tròng theo yêu cầu",
      duration: "45 phút",
      price: "Theo sản phẩm",
    },
    {
      title: "Điều chỉnh kính",
      description: "Điều chỉnh độ ôm, cân bằng kính cho thoải mái",
      duration: "15 phút",
      price: "Miễn phí",
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-green-50 to-emerald-100 overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Users className="h-4 w-4 mr-2" />
              Luôn sẵn sàng hỗ trợ bạn
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Liên hệ với <span className="text-primary">Mắt Kính Tâm Đức</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              Đội ngũ chuyên gia sẵn sàng tư vấn và hỗ trợ bạn 24/7. Hãy để
              chúng tôi giúp bạn tìm giải pháp tối ưu cho thị lực của mình.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4">
                <Phone className="mr-2 h-5 w-5" />
                Gọi ngay: 1900 1234
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                <Calendar className="mr-2 h-5 w-5" />
                Đặt lịch khám
              </Button>
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
          <span>Liên hệ</span>
        </div>

        {/* Contact Methods */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Nhiều cách để liên hệ
            </h2>
            <p className="text-xl text-gray-600">
              Chọn cách liên hệ phù hợp nhất với bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform`}
                  >
                    {method.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{method.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {method.subtitle}
                  </p>
                  <p className="font-semibold text-primary mb-3">
                    {method.contact}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {method.description}
                  </p>
                  <Button className="w-full group-hover:shadow-lg transition-all">
                    {method.action}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Form & Store Info */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Send className="mr-3 h-6 w-6 text-primary" />
                  Gửi tin nhắn cho chúng tôi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Họ và tên *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Nhập họ và tên"
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
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="service">Dịch vụ quan tâm</Label>
                      <Select
                        value={formData.service}
                        onValueChange={(value) =>
                          handleInputChange("service", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn dịch vụ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kham-mat">Khám mắt</SelectItem>
                          <SelectItem value="kinh-can">Kính cận</SelectItem>
                          <SelectItem value="kinh-ram">Kính râm</SelectItem>
                          <SelectItem value="trong-kinh">Tròng kính</SelectItem>
                          <SelectItem value="tu-van">Tư vấn chung</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="branch">Chi nhánh</Label>
                      <Select
                        value={formData.branch}
                        onValueChange={(value) =>
                          handleInputChange("branch", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chi nhánh" />
                        </SelectTrigger>
                        <SelectContent>
                          {storeLocations.map((store) => (
                            <SelectItem
                              key={store.id}
                              value={store.id.toString()}
                            >
                              {store.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Tiêu đề</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      placeholder="Nhập tiêu đề tin nhắn"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Nội dung tin nhắn *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      placeholder="Nhập nội dung chi tiết..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Gửi tin nhắn
                  </Button>

                  <p className="text-sm text-gray-600 text-center">
                    Chúng tôi sẽ phản hồi trong vòng{" "}
                    <span className="font-semibold text-primary">24 giờ</span>
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Quick Info & Services */}
            <div className="space-y-8">
              {/* Quick Contact Info */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Headphones className="mr-3 h-5 w-5 text-primary" />
                    Thông tin liên hệ nhanh
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Hotline 24/7</p>
                      <p className="text-green-600">1900 1234</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">Email hỗ trợ</p>
                      <p className="text-blue-600">info@matkinhtamduc.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-semibold">Giờ làm việc</p>
                      <p className="text-purple-600">8:00 - 21:00 hàng ngày</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-semibold">Hệ thống cửa hàng</p>
                      <p className="text-orange-600">9 chi nhánh tại TP.HCM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Star className="mr-3 h-5 w-5 text-primary" />
                    Dịch vụ của chúng tôi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold">{service.title}</h4>
                          <p className="text-sm text-gray-600">
                            {service.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            Thời gian: {service.duration}
                          </p>
                        </div>
                        <Badge
                          variant={
                            service.price === "Miễn phí"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {service.price}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl">
                    Kết nối với chúng tôi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-blue-600 hover:text-white"
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-pink-600 hover:text-white"
                    >
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-red-600 hover:text-white"
                    >
                      <Youtube className="h-4 w-4 mr-2" />
                      YouTube
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Store Locations */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Hệ thống cửa hàng
            </h2>
            <p className="text-xl text-gray-600">
              9 chi nhánh phục vụ khắp TP. Hồ Chí Minh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {storeLocations.map((store) => (
              <Card
                key={store.id}
                className={`shadow-lg border-0 hover:shadow-xl transition-all duration-300 ${
                  store.isMain ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                          store.isMain
                            ? "bg-primary text-white"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{store.name}</h3>
                        {store.isMain && (
                          <Badge className="text-xs">Flagship Store</Badge>
                        )}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <NavigationIcon className="h-4 w-4 text-gray-400 mt-1" />
                      <p className="text-sm text-gray-600">{store.address}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium">{store.phone}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600">{store.email}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600">{store.hours}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600">{store.manager}</p>
                    </div>
                  </div>

                  {store.features && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">
                        Đặc điểm nổi bật:
                      </h4>
                      {store.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-xs text-green-600"
                        >
                          <CheckCircle className="h-3 w-3 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      Bản đồ
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-1" />
                      Gọi ngay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Câu hỏi thường gặp
            </h2>
            <p className="text-xl text-gray-600">
              Tìm câu trả lời cho những thắc mắc phổ biến
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-lg px-6 shadow-sm"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="font-semibold text-lg">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                Không tìm thấy câu trả lời bạn cần?
              </p>
              <Button variant="outline" size="lg">
                <MessageCircle className="mr-2 h-5 w-5" />
                Đặt câu hỏi khác
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section - Booking & Consultation */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-primary to-green-700 text-white rounded-3xl p-8 lg:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] opacity-10"></div>
            <div className="relative text-center max-w-4xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Đặt lịch hẹn ngay hôm nay
              </h2>
              <p className="text-xl lg:text-2xl mb-8 text-green-100 leading-relaxed">
                Nhận tư vấn miễn phí từ các chuyên gia hàng đầu. Khám mắt, chọn
                kính và trải nghiệm dịch vụ 5 sao tại Mắt Kính Tâm Đức.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Khám mắt miễn phí</h3>
                  <p className="text-green-100 text-sm">
                    Kiểm tra thị l���c và sức khỏe mắt toàn diện
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    Tư vấn chuyên nghiệp
                  </h3>
                  <p className="text-green-100 text-sm">
                    Đội ngũ bác sĩ và chuyên gia giàu kinh nghiệm
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Dịch vụ 5 sao</h3>
                  <p className="text-green-100 text-sm">
                    Trải nghiệm đẳng cấp từ khám đến nhận kính
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-xl px-10 py-6 shadow-xl hover:shadow-2xl transition-all"
                  asChild
                >
                  <Link to="/eye-exam">
                    <Calendar className="mr-3 h-6 w-6" />
                    Đặt lịch khám ngay
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-xl px-10 py-6 border-2 border-white text-white hover:bg-white hover:text-primary transition-all"
                >
                  <Phone className="mr-3 h-6 w-6" />
                  Gọi tư vấn: 1900 1234
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center">
                <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Zap className="h-8 w-8 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Nhanh chóng</h4>
                  <p className="text-green-100 text-sm">
                    Đặt lịch dễ dàng, phục vụ tận tình
                  </p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Shield className="h-8 w-8 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">An toàn</h4>
                  <p className="text-green-100 text-sm">
                    Thiết bị hiện đại, quy trình chuẩn quốc tế
                  </p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Award className="h-8 w-8 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Chất lượng</h4>
                  <p className="text-green-100 text-sm">
                    15 năm kinh nghiệm, 100K+ khách hàng tin tưởng
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

export default Contact;
