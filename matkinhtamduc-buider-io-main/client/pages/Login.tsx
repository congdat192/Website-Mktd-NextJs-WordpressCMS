import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Phone,
  AlertCircle,
  CheckCircle2,
  Shield,
  Clock,
  Award,
  LogIn,
  MessageCircle,
} from "lucide-react";
import { sendOTP, validatePhoneNumber, formatPhoneNumber } from "@/lib/auth";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [demoOTP, setDemoOTP] = useState("");
  const [otpMethod, setOtpMethod] = useState<"sms" | "zalo" | null>(null);

  const handleInputChange = (field: string, value: string) => {
    // Format phone number as user types
    if (field === "phone") {
      // Remove all non-digits
      const digits = value.replace(/\D/g, "");
      // Limit to 10 digits
      const limitedDigits = digits.slice(0, 10);
      setFormData({ ...formData, [field]: limitedDigits });
    } else {
      setFormData({ ...formData, [field]: value });
    }

    if (error) setError("");
    if (message) setMessage("");
  };

  const handleSubmit = async (method: "sms" | "zalo") => {
    if (!formData.phone) {
      setError("Vui lòng nhập số điện thoại");
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      setError("Số điện thoại không hợp lệ");
      return;
    }

    setIsLoading(true);
    setOtpMethod(method);
    setError("");
    setMessage("");

    try {
      // Send OTP to phone number
      const result = await sendOTP(formData.phone);

      if (result.success) {
        const methodText = method === "sms" ? "SMS" : "Zalo";
        setMessage(`OTP đã được gửi qua ${methodText}!`);
        setDemoOTP(result.otp || "");

        // Redirect to OTP verification page after 2 seconds
        setTimeout(() => {
          navigate(
            `/verify-otp?phone=${encodeURIComponent(formData.phone)}&method=${method}`,
          );
        }, 2000);
      } else {
        setError("Không thể gửi OTP. Vui lòng thử lại.");
      }
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
      setOtpMethod(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Trang chủ
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Đăng nhập</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 items-start">
            {/* Login Form - Show first on mobile, left on desktop */}
            <div className="relative order-2 lg:order-1">
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <LogIn className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    Đăng nhập với số điện thoại
                  </CardTitle>
                  <p className="text-gray-600">
                    Nhập số điện thoại để nhận mã OTP
                  </p>
                </CardHeader>

                <CardContent className="p-8 pt-0">
                  {/* Demo OTP Display */}
                  {demoOTP && (
                    <Alert className="mb-6 border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700">
                        <strong>Demo Mode:</strong> Mã OTP của bạn là:{" "}
                        <strong>{demoOTP}</strong>
                      </AlertDescription>
                    </Alert>
                  )}

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
                          placeholder="Ví dụ:0912345678"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className={`pl-12 h-12 text-lg ${error ? "border-red-500" : ""}`}
                          autoComplete="tel"
                        />
                      </div>
                      {formData.phone && (
                        <div>
                          {formData.phone.length < 10 ? (
                            <p className="text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Vui lòng nhập đủ 10 số
                            </p>
                          ) : (
                            <p className="text-sm text-green-600 flex items-center">
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Số điện thoại hợp lệ:{" "}
                              {formatPhoneNumber(formData.phone)}
                            </p>
                          )}
                        </div>
                      )}
                      {error && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-700">
                            {error}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Success Message */}
                    {message && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                          {message}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Submit Buttons - Two Columns */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        onClick={() => handleSubmit("sms")}
                        className={`min-h-[48px] rounded-xl bg-green-700 text-white font-bold text-sm shadow-md transition-all duration-300 ${
                          formData.phone && formData.phone.length === 10
                            ? "hover:bg-green-800 hover:shadow-lg cursor-pointer"
                            : "opacity-40 cursor-not-allowed"
                        }`}
                        disabled={
                          isLoading ||
                          !formData.phone ||
                          formData.phone.length < 10
                        }
                      >
                        {isLoading && otpMethod === "sms" ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Đang gửi...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            <span>Nhận OTP SMS</span>
                          </div>
                        )}
                      </Button>

                      <Button
                        type="button"
                        onClick={() => handleSubmit("zalo")}
                        className={`min-h-[48px] rounded-xl text-white font-bold text-sm shadow-md transition-all duration-300 ${
                          formData.phone && formData.phone.length === 10
                            ? "hover:shadow-lg cursor-pointer"
                            : "opacity-40 cursor-not-allowed"
                        }`}
                        style={{
                          backgroundColor: "#0068FF",
                        }}
                        onMouseEnter={(e) =>
                          !isLoading &&
                          formData.phone &&
                          formData.phone.length === 10 &&
                          (e.currentTarget.style.backgroundColor = "#0052CC")
                        }
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#0068FF";
                        }}
                        disabled={
                          isLoading ||
                          !formData.phone ||
                          formData.phone.length < 10
                        }
                      >
                        {isLoading && otpMethod === "zalo" ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Đang gửi...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <img
                              src="https://cdn.builder.io/api/v1/image/assets%2F2779e00cee6f4ce2bba58e51a769e800%2F54035ce646c742c98d51f1cc5b16b654?format=webp&width=800"
                              alt="Zalo"
                              className="w-5 h-5 flex-shrink-0"
                            />
                            <span>Nhận OTP Zalo</span>
                          </div>
                        )}
                      </Button>
                    </div>

                    {/* Alternative Login Link */}
                    <div className="text-center">
                      <Link
                        to="/login-password"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Hoặc đăng nhập bằng mật khẩu
                      </Link>
                    </div>

                    {/* Help Text */}
                    <div className="text-center text-sm text-gray-500">
                      <p>
                        Bằng việc tiếp tục, bạn đã đọc và đồng ý với{" "}
                        <Link
                          to="/privacy-policy"
                          className="text-blue-600 hover:underline"
                        >
                          Chính sách bảo mật thông tin cá nhân
                        </Link>{" "}
                        của Mắt Kính Tâm Đức.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Content - Benefits */}
            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-green-700">
                  Đăng nhập nhanh!
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Để nhận ưu đãi giành cho riêng bạn & tra cứu thông tin
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-4 hidden lg:block">
                <div className="flex items-center space-x-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Đăng nhập không mật khẩu</h3>
                    <p className="text-gray-600 text-sm">
                      Bảo mật cao với OTP qua điện thoại
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ưu đãi độc quyền</h3>
                    <p className="text-gray-600 text-sm">
                      Nhận khuyến mãi và điểm thưởng thành viên
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Đặt lịch nhanh chóng</h3>
                    <p className="text-gray-600 text-sm">
                      Booking khám mắt chỉ với 1 click
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 hidden lg:block">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-green-800">
                    Bảo mật tuyệt đối
                  </h3>
                </div>
                <p className="text-green-700 text-sm">
                  Thông tin của bạn được mã hóa SSL 256-bit và xác thực OTP 2
                  lớp
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
