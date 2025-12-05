import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Shield,
  LogIn,
} from "lucide-react";
import { loginWithPassword, validatePhoneNumber, formatPhoneNumber } from "@/lib/auth";

const LoginPassword = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === "phone" && typeof value === "string") {
      // Format phone number as user types
      const digits = value.replace(/\D/g, '');
      const limitedDigits = digits.slice(0, 10);
      setFormData({ ...formData, [field]: limitedDigits });
    } else {
      setFormData({ ...formData, [field]: value });
    }
    
    if (error) setError("");
    if (message) setMessage("");
  };

  const validateForm = () => {
    if (!formData.phone) {
      setError("Vui lòng nhập số điện thoại");
      return false;
    }

    if (!validatePhoneNumber(formData.phone)) {
      setError("Số điện thoại không hợp lệ");
      return false;
    }

    if (!formData.password) {
      setError("Vui lòng nhập mật khẩu");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await loginWithPassword(formData.phone, formData.password);
      
      if (result.success) {
        setMessage("Đăng nhập thành công!");
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm mb-8">
            <Link
              to="/login"
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại đăng nhập OTP
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Đăng nhập bằng mật khẩu</span>
          </div>

          {/* Login Form */}
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Đăng nhập bằng mật khẩu
              </CardTitle>
              <p className="text-gray-600">
                Nhập số điện thoại và mật khẩu để đăng nhập
              </p>
            </CardHeader>

            <CardContent className="p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Phone Number Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="Nhập số điện thoại (VD: 0901234567)"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={`pl-12 h-12 text-lg ${error ? "border-red-500" : ""}`}
                      autoComplete="tel"
                    />
                  </div>
                  {formData.phone && validatePhoneNumber(formData.phone) && (
                    <p className="text-sm text-green-600 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Số điện thoại hợp lệ: {formatPhoneNumber(formData.phone)}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mật khẩu <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-12 pr-12 h-12 ${error ? "border-red-500" : ""}`}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange("rememberMe", !!checked)}
                    />
                    <Label htmlFor="remember" className="text-sm cursor-pointer">
                      Ghi nhớ đăng nhập
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

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
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold"
                  disabled={isLoading || !formData.phone || !formData.password}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang đăng nhập...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <LogIn className="w-5 h-5" />
                      <span>Đăng nhập</span>
                    </div>
                  )}
                </Button>

                {/* Alternative Login */}
                <div className="text-center space-y-3 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Chưa có tài khoản?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Đăng ký bằng OTP
                    </Link>
                  </p>
                  <p className="text-sm text-gray-500">
                    Hoặc{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      đăng nhập bằng OTP
                    </Link>
                  </p>
                </div>

                {/* Help Text */}
                <div className="text-center text-xs text-gray-500 leading-relaxed">
                  <p>
                    Bằng việc tiếp tục, bạn đã đọc và đồng ý với{" "}
                    <Link to="/privacy-policy" className="text-blue-600 hover:underline">
                      Chính sách bảo mật thông tin cá nhân
                    </Link>{" "}
                    của Mắt Kính Tâm Đức.
                  </p>
                </div>
              </form>

              {/* Demo Instructions */}
              <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Tài khoản Demo
                </h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Số điện thoại:</strong> 0901234567</p>
                  <p><strong>Mật khẩu:</strong> 123456</p>
                  <hr className="my-2 border-green-200" />
                  <p><strong>Số điện thoại:</strong> 0987654321</p>
                  <p><strong>Mật khẩu:</strong> abcdef</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LoginPassword;
