import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#333333] text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Về Chúng Tôi</h3>
                        <p className="text-sm text-gray-300 mb-4">
                            Mắt Kính Tâm Đức - Hệ thống mắt kính uy tín với hơn 20 năm kinh nghiệm.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-[#228B22] transition" aria-label="Facebook">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-[#228B22] transition" aria-label="Instagram">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-[#228B22] transition" aria-label="Youtube">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Liên Kết</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="hover:text-[#228B22] transition">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="hover:text-[#228B22] transition">
                                    Sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-[#228B22] transition">
                                    Tin tức
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-[#228B22] transition">
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Hỗ Trợ</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/shipping" className="hover:text-[#228B22] transition">
                                    Chính sách vận chuyển
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="hover:text-[#228B22] transition">
                                    Đổi trả hàng
                                </Link>
                            </li>
                            <li>
                                <Link href="/warranty" className="hover:text-[#228B22] transition">
                                    Bảo hành
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-[#228B22] transition">
                                    Câu hỏi thường gặp
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Liên Hệ</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-5 h-5 flex-shrink-0" />
                                <a href="tel:0123456789" className="hover:text-[#228B22] transition">
                                    0123 456 789
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-5 h-5 flex-shrink-0" />
                                <a href="mailto:info@matkinhtamduc.com" className="hover:text-[#228B22] transition">
                                    info@matkinhtamduc.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; 2024 Mắt Kính Tâm Đức. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
