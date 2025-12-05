import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  ArrowLeft,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  KeyRound,
  Send,
  Phone,
  MessageCircle,
} from "lucide-react";

type Step = "email" | "verification" | "reset" | "success";

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationMethod, setVerificationMethod] = useState<"email" | "sms">(
    "email",
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateEmail = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVerificationCode = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.verificationCode) {
      newErrors.verificationCode = "Vui lòng nhập mã xác thực";
    } else if (formData.verificationCode.length !== 6) {
      newErrors.verificationCode = "Mã xác thực phải có 6 chữ số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNewPassword = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendVerification = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentStep("verification");
      setCountdown(60);
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setErrors({ email: "Có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validateVerificationCode()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Simulate verification
      if (formData.verificationCode === "123456") {
        setCurrentStep("reset");
      } else {
        setErrors({ verificationCode: "Mã xác thực không chính xác" });
      }
    } catch (error) {
      setErrors({ verificationCode: "Có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validateNewPassword()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentStep("success");
    } catch (error) {
      setErrors({ newPassword: "Có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Resend failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case "email":
        return (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Quên mật khẩu?</h2>
              <p className="text-gray-600">
                Nhập email để nhận hướng dẫn đặt lại mật khẩu
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Địa chỉ email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-12 h-12 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center space-x-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleSendVerification}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang gửi...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Gửi mã xác thực</span>
                  </div>
                )}
              </Button>
            </div>
          </>
        );

      case "verification":
        return (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Xác thực email</h2>
              <p className="text-gray-600">
                Chúng tôi đã gửi mã xác thực 6 chữ số đến email
              </p>
              <p className="font-semibold text-blue-600 mt-1">
                {formData.email}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="verificationCode">
                  Mã xác thực <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="verificationCode"
                  placeholder="Nhập mã 6 chữ số"
                  value={formData.verificationCode}
                  onChange={(e) =>
                    handleInputChange("verificationCode", e.target.value)
                  }
                  className={`h-12 text-center text-2xl tracking-widest ${
                    errors.verificationCode ? "border-red-500" : ""
                  }`}
                  maxLength={6}
                />
                {errors.verificationCode && (
                  <div className="flex items-center space-x-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.verificationCode}</span>
                  </div>
                )}
              </div>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-gray-600 flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Gửi lại mã sau {countdown}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Gửi lại mã xác thực
                  </button>
                )}
              </div>

              <Button
                onClick={handleVerifyCode}
                disabled={isLoading || formData.verificationCode.length !== 6}
                className="w-full h-12"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xác thực...</span>
                  </div>
                ) : (
                  "Xác thực"
                )}
              </Button>
            </div>
          </>
        );

      case "reset":
        return (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Đặt mật khẩu mới</h2>
              <p className="text-gray-600">
                Tạo mật khẩu mới mạnh để bảo vệ tài khoản
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">
                  Mật khẩu mới <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
                    }
                    className={`pl-12 pr-12 h-12 ${
                      errors.newPassword ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <div className="flex items-center space-x-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.newPassword}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`pl-12 pr-12 h-12 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center space-x-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Yêu cầu mật khẩu:
                </h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        formData.newPassword.length >= 8
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span>Ít nhất 8 ký tự</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        /[A-Z]/.test(formData.newPassword)
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span>Ít nhất 1 chữ cái viết hoa</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        /[0-9]/.test(formData.newPassword)
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span>Ít nhất 1 chữ số</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        /[^A-Za-z0-9]/.test(formData.newPassword)
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span>Ít nhất 1 ký tự đặc biệt</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang cập nhật...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <span>Đặt mật khẩu mới</span>
                  </div>
                )}
              </Button>
            </div>
          </>
        );

      case "success":
        return (
          <>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-green-800">
                Đặt mật khẩu thành công!
              </h2>
              <p className="text-gray-600 mb-8">
                Mật khẩu của bạn đã được cập nhật thành công. Bạn có thể đăng
                nhập bằng mật khẩu mới.
              </p>

              <div className="space-y-4">
                <Button size="lg" className="w-full" asChild>
                  <Link to="/login">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Đăng nhập ngay
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link to="/">Về trang chủ</Link>
                </Button>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm mb-8">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Trang chủ
            </Link>
            <span className="text-gray-300">/</span>
            <Link to="/login" className="text-gray-500 hover:text-gray-700">
              Đăng nhập
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Quên mật khẩu</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Khôi phục tài khoản
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Đừng lo lắng! Việc quên mật khẩu là điều thường xảy ra. Chúng
                  tôi sẽ giúp bạn lấy lại quyền truy cập một cách an toàn.
                </p>
              </div>

              {/* Security Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Bảo mật cao</h3>
                    <p className="text-gray-600 text-sm">
                      Mã xác thực được mã hóa và có thời hạn
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Xác thực qua email</h3>
                    <p className="text-gray-600 text-sm">
                      Nhận mã xác thực trực tiếp trong hộp thư
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Nhanh chóng</h3>
                    <p className="text-gray-600 text-sm">
                      Khôi phục tài khoản chỉ trong vài phút
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Support */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6">
                <h3 className="font-semibold text-orange-800 mb-3">
                  Cần hỗ trợ thêm?
                </h3>
                <p className="text-orange-700 text-sm mb-4">
                  Nếu bạn không thể truy cập email hoặc gặp khó khăn, hãy liên
                  hệ với chúng tôi
                </p>
                <div className="flex space-x-3">
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Gọi hotline
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat hỗ trợ
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Content - Form */}
            <div className="relative">
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                <CardContent className="p-8">{getStepContent()}</CardContent>
              </Card>

              {/* Step Indicator */}
              {currentStep !== "success" && (
                <div className="flex items-center justify-center space-x-2 mt-6">
                  {["email", "verification", "reset"].map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep === step ||
                          (currentStep === "verification" &&
                            step === "email") ||
                          (currentStep === "reset" &&
                            (step === "email" || step === "verification"))
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < 2 && <div className="w-8 h-0.5 bg-gray-300" />}
                    </div>
                  ))}
                </div>
              )}

              {/* Back to Login */}
              {currentStep !== "success" && (
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Đã nhớ mật khẩu?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
