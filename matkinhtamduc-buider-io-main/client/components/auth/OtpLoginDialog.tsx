import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  RefreshCw,
  Shield,
  X,
  Gift,
  TrendingUp,
  Percent,
  Eye,
} from "lucide-react";
import {
  checkPhoneExists,
  sendOTP,
  verifyOTP,
  loginCustomer,
  formatPhoneNumber,
  validatePhoneNumber,
} from "@/lib/auth";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: (result: { isNew: boolean; phone: string }) => void;
  prompt?: string;
}

export default function OtpLoginDialog({
  open,
  onOpenChange,
  onSuccess,
  prompt,
}: Props) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [demoOTP, setDemoOTP] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep("phone");
    setPhone("");
    setOtp("");
    setError("");
    setMessage("");
    setDemoOTP("");
    setCountdown(60);
    setCanResend(false);
  }, [open]);

  useEffect(() => {
    let t: any;
    if (step === "otp" && !canResend && countdown > 0) {
      t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(t);
  }, [step, canResend, countdown]);

  const handleSendOTP = async (method: "sms" | "zalo") => {
    setError("");
    if (!validatePhoneNumber(phone)) {
      setError("Số điện thoại không hợp lệ");
      return;
    }
    setIsLoading(true);
    try {
      const exists = await checkPhoneExists(phone);
      if (!exists.exists) {
        // For demo, allow OTP for số mới và đăng nhập luôn sau verify
      }
      const result = await sendOTP(phone);
      if (result.success) {
        setStep("otp");
        setMessage(
          `OTP đã được gửi qua ${method === "sms" ? "SMS" : "Zalo"}. Vui lòng kiểm tra.`,
        );
        setDemoOTP(result.otp || "");
        setCountdown(60);
        setCanResend(false);
      } else {
        setError("Không thể gửi OTP. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    if (otp.length < 4) {
      setError("Vui lòng nhập mã OTP 4 số");
      return;
    }
    setIsLoading(true);
    try {
      const res = await verifyOTP(phone, otp);
      if (!res.success) {
        setError(res.message);
        return;
      }
      // Kiểm tra hiện trạng khách hàng
      const existsRes = await checkPhoneExists(phone);
      // Đăng nhập (auto tạo user nếu chưa có)
      const loginRes = await loginCustomer(phone);
      if (loginRes.success) {
        onOpenChange(false);
        onSuccess({ isNew: !existsRes.exists, phone });
      } else {
        setError(loginRes.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setIsLoading(true);
    try {
      const result = await sendOTP(phone);
      if (result.success) {
        setMessage("OTP mới đã được gửi!");
        setDemoOTP(result.otp || "");
        setCountdown(60);
        setCanResend(false);
      } else {
        setError("Không thể gửi lại OTP");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {step === "phone" ? (
          <div className="space-y-6">
            <VisuallyHidden>
              <DialogTitle>Đăng nhập TĐ Member</DialogTitle>
            </VisuallyHidden>
            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* TĐ Member Badge */}
            <div className="pt-4">
              <div className="inline-flex items-center gap-1 bg-green-700 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-sm">
                <span className="tracking-tight">TĐ</span>
                <span className="bg-white text-green-700 px-2 py-0.5 rounded font-extrabold">
                  Member
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                Rất nhiều đặc quyền và quyền lợi mua sắm dành cho bạn
              </h2>
              <p className="text-gray-600 text-base">
                Quyền lợi dành riêng cho bạn khi tham gia TĐ Member
              </p>
            </div>

            {/* Benefits Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center">
                  <Percent className="w-8 h-8 text-gray-700 mb-2" />
                  <p className="text-sm font-semibold text-gray-900">
                    Voucher ưu đãi
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center">
                  <Gift className="w-8 h-8 text-gray-700 mb-2" />
                  <p className="text-sm font-semibold text-gray-900">
                    Quà tặng độc quyền
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center">
                  <TrendingUp className="w-8 h-8 text-gray-700 mb-2" />
                  <p className="text-sm font-semibold text-gray-900">
                    Hoàn tiền Cash
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Login Section */}
            <div className="space-y-4 pt-2">
              <p className="text-sm text-gray-700 font-medium">
                <strong>Đăng nhập hoặc đăng ký (miễn phí)</strong>
              </p>

              {/* Helper Text */}
              <Label className="text-sm font-medium text-gray-700">
                <p>Hệ thống sẽ kiểm tra và tạo tài khoản nếu bạn chưa có</p>
              </Label>

              {/* Phone Number Input */}
              <div className="space-y-2">
                <Input
                  id="phone-input"
                  placeholder="VD: 0901234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 border-gray-300"
                />
              </div>

              {/* OTP Method Selection */}
              <div className="flex gap-3">
                <Button
                  onClick={() => handleSendOTP("sms")}
                  disabled={isLoading || !phone}
                  className="flex-1 h-12 rounded-2xl font-semibold transition-all bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.86l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                  </svg>
                  {isLoading ? "Đang gửi..." : "Nhận OTP SMS"}
                </Button>
                <Button
                  onClick={() => handleSendOTP("zalo")}
                  disabled={isLoading || !phone}
                  className="flex-1 h-12 rounded-2xl font-semibold transition-all bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                  {isLoading ? "Đang gửi..." : "Nhận OTP Zalo"}
                </Button>
              </div>

              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-center">
                Đăng nhập bằng OTP
              </DialogTitle>
              <DialogDescription className="text-center">
                {`Mã OTP đã gửi đến ${formatPhoneNumber(phone)}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {demoOTP && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-yellow-800 text-sm">
                  <strong>Mã OTP demo:</strong> {demoOTP}
                </div>
              )}
              {message && (
                <div className="bg-blue-50 border border-blue-200 rounded p-2 text-blue-700 text-sm flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> {message}
                </div>
              )}
              <Label htmlFor="otp">Mã OTP</Label>
              <Input
                id="otp"
                placeholder="Nhập 4 chữ số"
                value={otp}
                maxLength={4}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                className="text-center tracking-widest"
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button
                className="w-full"
                onClick={handleVerify}
                disabled={isLoading || otp.length !== 4}
              >
                {isLoading ? (
                  "Đang xác thực..."
                ) : (
                  <span className="inline-flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Xác thực
                  </span>
                )}
              </Button>
              <div className="text-center text-sm">
                {canResend ? (
                  <Button
                    variant="ghost"
                    onClick={handleResend}
                    disabled={isLoading}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Gửi lại OTP
                  </Button>
                ) : (
                  <span className="text-gray-500">
                    Gửi lại OTP sau {countdown}s
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
