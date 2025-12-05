import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  User,
  Phone,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  Shield,
} from "lucide-react";
import { registerCustomer, formatPhoneNumber } from "@/lib/auth";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phoneFromUrl = searchParams.get("phone") || "";
  const redirectTo = searchParams.get("redirectTo") || "";

  const [formData, setFormData] = useState({
    phone: phoneFromUrl,
    name: "",
    gender: "" as "male" | "female" | "other" | "",
    birthDate: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  // Redirect if no phone number
  useEffect(() => {
    if (!formData.phone) {
      navigate("/login");
    }
  }, [formData.phone, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Clear specific field error when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }

    if (message) setMessage("");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Họ và tên phải có ít nhất 2 ký tự";
    }

    // Optional validations
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 10 || age > 120) {
        newErrors.birthDate = "Ngày sinh không hợp lệ";
      }
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerCustomer({
        phone: formData.phone,
        name: formData.name.trim(),
        gender: formData.gender as "male" | "female" | "other" | undefined,
        birthDate: formData.birthDate || undefined,
        email: formData.email || undefined,
      });

      if (result.success) {
        setMessage("Đăng ký thành công! Đang chuyển hướng...");
        setTimeout(() => {
          if (redirectTo) {
            navigate(redirectTo);
          } else {
            navigate("/profile");
          }
        }, 800);
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: "Có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link
              to="/login"
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại đăng nhập
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Đăng ký tài khoản</span>
          </div>

          {/* Registration Form */}
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Tạo tài khoản mới
              </CardTitle>
              <p className="text-gray-600">
                Hoàn tất thông tin để tạo tài khoản
              </p>
            </CardHeader>

            <CardContent className="p-8 pt-0">
              {/* Phone Display */}
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6">
                <div className="flex items-center justify-center space-x-3 flex-wrap">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-green-800 font-medium text-sm">
                      Số điện thoại
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="font-semibold text-green-800">
                      {formatPhoneNumber(formData.phone)}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nhập họ và tên đầy đủ"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={`pl-12 h-12 ${errors.name ? "border-red-500" : ""}`}
                      autoComplete="name"
                    />
                  </div>
                  {errors.name && (
                    <div className="flex items-center space-x-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                {/* Gender, Birth Date, Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gender Field (optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium">
                      Giới tính
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleInputChange("gender", value)
                      }
                    >
                      <SelectTrigger
                        className={`h-12 ${errors.gender ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Birth Date Field (optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-sm font-medium">
                      Ngày sinh
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) =>
                        handleInputChange("birthDate", e.target.value)
                      }
                      className={`h-12 ${errors.birthDate ? "border-red-500" : ""}`}
                      max={new Date().toISOString().split("T")[0]}
                    />
                    {errors.birthDate && (
                      <div className="flex items-center space-x-1 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.birthDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Field (optional) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`h-12 ${errors.email ? "border-red-500" : ""}`}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <div className="flex items-center space-x-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {errors.submit}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Success Message */}
                {message && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      {message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang tạo tài khoản...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UserPlus className="w-5 h-5" />
                      <span>Tạo tài khoản</span>
                    </div>
                  )}
                </Button>

                {/* Terms */}
                <div className="text-center text-xs text-gray-500 leading-relaxed">
                  Bằng việc đăng ký, bạn đã đọc và đồng ý với{" "}
                  <Link to="/terms" className="text-green-700 hover:underline">
                    Điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-green-700 hover:underline"
                  >
                    Chính sách bảo mật thông tin cá nhân
                  </Link>{" "}
                  của Mắt Kính Tâm Đức.
                </div>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-gray-600">
                    Đã có tài khoản?{" "}
                    <Link
                      to="/login"
                      className="text-green-700 hover:text-green-800 font-semibold"
                    >
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security Info */}
          <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-6 h-6 text-green-700" />
              <h3 className="font-semibold text-green-700">
                Thông tin được bảo mật
              </h3>
            </div>
            <p className="text-green-700 text-sm">
              Mọi thông tin cá nhân của bạn được mã hóa và bảo mật theo tiêu
              chuẩn quốc tế. Chúng tôi cam kết không chia sẻ thông tin với bên
              thứ ba.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Register;
