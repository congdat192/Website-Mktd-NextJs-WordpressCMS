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
  ArrowLeft,
  Shield,
  Phone,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react";
import {
  verifyOTP,
  sendOTP,
  checkPhoneExists,
  loginCustomer,
  formatPhoneNumber,
} from "@/lib/auth";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phoneFromUrl = searchParams.get("phone") || "";

  const [formData, setFormData] = useState({
    phone: phoneFromUrl,
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [demoOTP, setDemoOTP] = useState("");

  // Redirect if no phone number
  useEffect(() => {
    if (!formData.phone) {
      navigate("/login");
    }
  }, [formData.phone, navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (error) setError("");
    if (message) setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.otp) {
      setError("Vui lòng nhập mã OTP");
      return;
    }

    if (formData.otp.length !== 4) {
      setError("Mã OTP phải có 4 chữ số");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      // Verify OTP
      const verifyResult = await verifyOTP(formData.phone, formData.otp);

      if (!verifyResult.success) {
        setError(verifyResult.message);
        return;
      }

      // Check if phone exists in database (for redirect decision)
      const phoneCheck = await checkPhoneExists(formData.phone);

      // Always log in or auto-create user for voucher mapping
      const loginResult = await loginCustomer(formData.phone);
      if (!loginResult.success) {
        setError("Có lỗi khi đăng nhập. Vui lòng thử lại.");
        return;
      }

      if (phoneCheck.exists) {
        setMessage("Đăng nhập thành công!");
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      } else {
        // New customer - redirect to registration to bổ sung thông tin
        setMessage("Xác thực thành công! Chuyển đến trang đăng ký...");
        setTimeout(() => {
          navigate(`/register?phone=${encodeURIComponent(formData.phone)}`);
        }, 1000);
      }
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError("");
    setMessage("");

    try {
      const result = await sendOTP(formData.phone);

      if (result.success) {
        setMessage("OTP mới đã được gửi!");
        setDemoOTP(result.otp || "");
        setCountdown(60);
        setCanResend(false);
        setFormData({ ...formData, otp: "" });
      } else {
        setError("Không thể gửi OTP. Vui lòng thử lại.");
      }
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsResending(false);
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
            <span className="text-gray-900 font-medium">Xác thực OTP</span>
          </div>

          {/* OTP Verification Form */}
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Xác thực số điện thoại
              </CardTitle>
              <p className="text-gray-600">
                Nhập mã OTP được gửi đến số điện thoại của bạn
              </p>
            </CardHeader>

            <CardContent className="p-8 pt-0">
              {/* Phone Display */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-lg">
                    {formatPhoneNumber(formData.phone)}
                  </span>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Mã OTP có hiệu lực trong 5 phút
                </p>
              </div>

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
                {/* OTP Input */}
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">
                    Mã OTP <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Nhập mã OTP 4 số"
                    value={formData.otp}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4);
                      handleInputChange("otp", value);
                    }}
                    className="h-14 text-center text-2xl font-bold tracking-widest"
                    maxLength={4}
                    autoComplete="one-time-code"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {error}
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
                  disabled={isLoading || !formData.otp}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang xác thực...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Xác thực OTP</span>
                    </div>
                  )}
                </Button>

                {/* Resend OTP */}
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">
                    Không nhận được mã OTP?
                  </p>

                  {canResend ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResendOTP}
                      disabled={isResending}
                      className="h-10"
                    >
                      {isResending ? (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Đang gửi...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4" />
                          <span>Gửi lại OTP</span>
                        </div>
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Gửi lại sau {countdown}s</span>
                    </div>
                  )}
                </div>

                {/* Change Phone Number */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <Link
                    to="/login"
                    className="text-green-700 hover:text-green-800 text-sm font-medium"
                  >
                    Thay đổi số điện thoại
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Không nhận được OTP?
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Kiểm tra hộp thư tin nhắn của bạn</li>
                <li>• Đảm bảo điện thoại có sóng mạnh</li>
                <li>
                  • Thử gửi lại OTP sau {countdown > 0 ? countdown : 60} giây
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VerifyOTP;
