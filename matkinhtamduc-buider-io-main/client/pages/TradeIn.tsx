import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RefreshCw,
  Star,
  Shield,
  Clock,
  CheckCircle2,
  Upload,
  Camera,
  ArrowRight,
  Gift,
  Calculator,
  Phone,
  MessageCircle,
  MapPin,
  Banknote,
  Eye,
  Award,
  TrendingUp,
  ChevronRight,
  Heart,
  Sparkles,
} from "lucide-react";

const TradeIn = () => {
  const [selectedCondition, setSelectedCondition] = useState("");
  const [estimatedValue, setEstimatedValue] = useState(0);

  const tradeInProcess = [
    {
      step: 1,
      title: "Định giá online",
      description: "Nhập thông tin sản phẩm cũ để nhận báo giá nhanh",
      icon: <Calculator className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      step: 2,
      title: "Mang đến cửa hàng",
      description: "Đến cửa hàng để kiểm tra và xác nhận giá thực tế",
      icon: <MapPin className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      step: 3,
      title: "Nhận tiền hoặc đổi mới",
      description: "Nhận tiền mặt hoặc trừ vào giá sản phẩm mới",
      icon: <Banknote className="w-6 h-6" />,
      color: "bg-purple-500",
    },
  ];

  const conditionOptions = [
    {
      value: "like-new",
      label: "Như mới",
      description: "Không có vết xước, hoạt động hoàn hảo",
      multiplier: 0.8,
    },
    {
      value: "good",
      label: "Tốt",
      description: "Có vài vết xư��c nhỏ, hoạt động bình thường",
      multiplier: 0.6,
    },
    {
      value: "fair",
      label: "Trung bình",
      description: "Có vết xước rõ, một số chức năng bị ảnh hưởng",
      multiplier: 0.4,
    },
    {
      value: "poor",
      label: "Kém",
      description: "Nhiều hư hỏng, cần sửa chữa",
      multiplier: 0.2,
    },
  ];

  const popularBrands = [
    { name: "Ray-Ban", baseValue: 1200000, image: "/placeholder.svg" },
    { name: "Oakley", baseValue: 1000000, image: "/placeholder.svg" },
    { name: "Gucci", baseValue: 2500000, image: "/placeholder.svg" },
    { name: "Tom Ford", baseValue: 2000000, image: "/placeholder.svg" },
    { name: "Boss", baseValue: 800000, image: "/placeholder.svg" },
    { name: "Silhouette", baseValue: 1500000, image: "/placeholder.svg" },
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Giá thu cao nhất thị trường",
      description: "Cam kết giá thu cạnh tranh nhất",
      color: "bg-green-50 border-green-200 text-green-800",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Định giá nhanh chóng",
      description: "Chỉ 5 phút là có kết quả",
      color: "bg-blue-50 border-blue-200 text-blue-800",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Minh bạch, uy tín",
      description: "Quy trình rõ ràng, không phí ẩn",
      color: "bg-purple-50 border-purple-200 text-purple-800",
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Ưu đãi đổi mới",
      description: "Giảm thêm khi mua sản phẩm mới",
      color: "bg-orange-50 border-orange-200 text-orange-800",
    },
  ];

  const calculateEstimate = (brand: string, condition: string) => {
    const brandData = popularBrands.find((b) => b.name === brand);
    const conditionData = conditionOptions.find((c) => c.value === condition);

    if (brandData && conditionData) {
      return Math.round(brandData.baseValue * conditionData.multiplier);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-emerald-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge className="w-fit bg-green-600">Thu Cũ Đổi Mới</Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Đổi kính cũ{" "}
                  <span className="text-green-600">lấy kính mới</span>
                  <br />
                  giá tốt nhất
                </h1>
                <p className="text-xl text-gray-600">
                  Định giá miễn phí, thu mua với giá cao nhất thị trường. Quy
                  trình nhanh chóng, minh bạch và uy tín.
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    5 phút
                  </div>
                  <div className="text-sm text-gray-600">Định giá</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-600">Minh bạch</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">24/7</div>
                  <div className="text-sm text-gray-600">Hỗ trợ</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Định giá ngay
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Gọi tư vấn
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-200 to-emerald-300 rounded-3xl overflow-hidden">
                <img
                  src="/placeholder.svg"
                  alt="Thu cũ đổi mới"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn dịch vụ thu cũ đổi mới của chúng tôi?
            </h2>
            <p className="text-xl text-gray-600">
              Những ưu điểm vượt trội mà bạn nhận được
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className={`border-2 ${benefit.color} hover:shadow-lg transition-shadow`}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${benefit.color.split(" ")[0]}`}
                  >
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm opacity-80">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trade-in Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quy trình thu cũ đổi mới
            </h2>
            <p className="text-xl text-gray-600">
              3 bước đơn giản để đổi kính cũ lấy kính mới
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tradeInProcess.map((process, index) => (
              <div key={index} className="relative">
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full ${process.color} flex items-center justify-center text-white`}
                    >
                      {process.icon}
                    </div>
                    <Badge className="mb-3">Bước {process.step}</Badge>
                    <h3 className="font-semibold text-xl mb-3">
                      {process.title}
                    </h3>
                    <p className="text-gray-600">{process.description}</p>
                  </div>
                </Card>
                {index < tradeInProcess.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trade-in Calculator */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Định giá nhanh kính cũ của bạn
            </h2>
            <p className="text-xl text-gray-600">
              Nhận báo giá sơ bộ chỉ trong vài phút
            </p>
          </div>

          <Card className="p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="brand">Thương hiệu *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thương hiệu" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularBrands.map((brand) => (
                        <SelectItem
                          key={brand.name}
                          value={brand.name.toLowerCase()}
                        >
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="model">Model/Tên sản phẩm *</Label>
                  <Input placeholder="VD: RB5228, Aviator Classic..." />
                </div>

                <div>
                  <Label htmlFor="condition">Tình trạng sản phẩm *</Label>
                  <Select
                    value={selectedCondition}
                    onValueChange={setSelectedCondition}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tình trạng" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">
                              {option.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="purchase-year">Năm mua</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn năm mua" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="older">Trước 2021</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="accessories">Phụ kiện kèm theo</Label>
                <Textarea
                  placeholder="VD: Hộp đựng, khăn lau, giấy bảo hành..."
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label>Hình ảnh sản phẩm (tùy chọn)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Chụp ảnh hoặc tải lên hình ảnh sản phẩm
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    (Tối đa 5 ảnh, định dạng JPG, PNG)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Định giá ngay
                </Button>
                <Button type="button" variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Gọi t�� vấn
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cần hỗ trợ thêm?
            </h2>
            <p className="text-xl text-gray-600">
              Liên hệ với chúng tôi để được tư vấn chi tiết
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Phone className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <h3 className="font-semibold text-xl mb-2">Hotline</h3>
              <p className="text-gray-600 mb-4">Tư vấn miễn phí 24/7</p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                0123 456 789
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <MessageCircle className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="font-semibold text-xl mb-2">Chat Zalo</h3>
              <p className="text-gray-600 mb-4">Nhắn tin trực tiếp</p>
              <Button variant="outline" className="w-full">
                Chat ngay
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <MapPin className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <h3 className="font-semibold text-xl mb-2">Cửa hàng</h3>
              <p className="text-gray-600 mb-4">Đến trực tiếp cửa hàng</p>
              <Button variant="outline" className="w-full">
                Xem địa chỉ
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TradeIn;
