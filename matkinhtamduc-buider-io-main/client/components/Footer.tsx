import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Glasses,
} from "lucide-react";

const Footer = () => {
  const brandPrimary = "#1B5E20";

  const menuData = {
    quickLinks: [
      { label: "Kính cận", href: "/products" },
      { label: "Kính râm", href: "/products" },
      { label: "Tròng kính", href: "/products" },
      { label: "Khám mắt miễn phí", href: "/eye-exam" },
      { label: "Về chúng tôi", href: "/about" },
    ],
    support: [
      { label: "Liên hệ", href: "/contact" },
      { label: "Tin tức", href: "/blog" },
      { label: "Chính sách bảo hành", href: "#" },
      { label: "Chính sách đổi trả", href: "#" },
      { label: "Câu hỏi thường gặp", href: "#" },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: brandPrimary }}>
                <Glasses className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-xl">Mắt Kính Tâm Đức</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Chuyên gia chăm sóc mắt hàng đầu Việt Nam với hơn 15 năm kinh nghiệm. 
              Chúng tôi cam kết mang đến dịch vụ tốt nhất cho sức khỏe đôi mắt của bạn.
            </p>
            <div className="flex space-x-2 pt-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: brandPrimary }}></div>
              Liên kết nhanh
            </h3>
            <div className="space-y-3">
              {menuData.quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="block text-slate-300 hover:text-white text-sm transition-all hover:translate-x-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: brandPrimary }}></div>
              Hỗ trợ
            </h3>
            <div className="space-y-3">
              {menuData.support.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="block text-slate-300 hover:text-white text-sm transition-all hover:translate-x-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: brandPrimary }}></div>
              Liên hệ
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" style={{ color: brandPrimary }} />
                <div className="text-sm text-slate-300">
                  <p>123 Đường ABC, Quận 1</p>
                  <p>TP. Hồ Chí Minh</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: brandPrimary }} />
                <span className="text-sm text-slate-300">0123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: brandPrimary }} />
                <span className="text-sm text-slate-300">info@matkinhtamduc.vn</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 flex-shrink-0" style={{ color: brandPrimary }} />
                <span className="text-sm text-slate-300">Thứ 2 - CN: 8:00 - 21:00</span>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="font-semibold mb-3 text-sm">Đăng ký nhận tin</h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="Email của bạn"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500"
                />
                <Button className="shrink-0 shadow-lg" style={{ backgroundColor: brandPrimary }}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Accordion Layout */}
        <div className="md:hidden space-y-6 mb-8">
          {/* Company Info - Always visible on mobile */}
          <div className="space-y-4 pb-6 border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: brandPrimary }}>
                <Glasses className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-lg">Mắt Kính Tâm Đức</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Chuyên gia chăm sóc mắt hàng đầu Việt Nam với hơn 15 năm kinh nghiệm.
            </p>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Accordion Menus */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="quicklinks" className="border-slate-700">
              <AccordionTrigger className="text-white font-semibold hover:no-underline">
                Liên kết nhanh
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-1">
                  {menuData.quickLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.href}
                      className="block text-slate-300 hover:text-white text-sm"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="support" className="border-slate-700">
              <AccordionTrigger className="text-white font-semibold hover:no-underline">
                Hỗ trợ
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-1">
                  {menuData.support.map((link, index) => (
                    <Link
                      key={index}
                      to={link.href}
                      className="block text-slate-300 hover:text-white text-sm"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact" className="border-slate-700">
              <AccordionTrigger className="text-white font-semibold hover:no-underline">
                Liên hệ
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-1">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" style={{ color: brandPrimary }} />
                    <div className="text-sm text-slate-300">
                      <p>123 Đường ABC, Quận 1</p>
                      <p>TP. Hồ Chí Minh</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 flex-shrink-0" style={{ color: brandPrimary }} />
                    <span className="text-sm text-slate-300">0123 456 789</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 flex-shrink-0" style={{ color: brandPrimary }} />
                    <span className="text-sm text-slate-300">info@matkinhtamduc.vn</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 flex-shrink-0" style={{ color: brandPrimary }} />
                    <span className="text-sm text-slate-300">Thứ 2 - CN: 8:00 - 21:00</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Newsletter - Mobile */}
          <div className="pt-4">
            <h4 className="font-semibold mb-3">Đăng ký nhận tin</h4>
            <div className="flex space-x-2">
              <Input
                placeholder="Email của bạn"
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
              />
              <Button className="shrink-0" style={{ backgroundColor: brandPrimary }}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © 2024 Mắt Kính Tâm Đức. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition">
                Chính sách bảo mật
              </a>
              <span className="text-slate-600">|</span>
              <a href="#" className="text-slate-400 hover:text-white transition">
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
