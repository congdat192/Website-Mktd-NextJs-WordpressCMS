import Link from 'next/link';
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Heart } from 'lucide-react';

const footerLinks = {
    products: [
        { name: 'Kính mắt nam', href: '/kinh-mat-nam' },
        { name: 'Kính mắt nữ', href: '/kinh-mat-nu' },
        { name: 'Kính râm', href: '/kinh-ram' },
        { name: 'Gọng kính', href: '/gong-kinh' },
    ],
    company: [
        { name: 'Về chúng tôi', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Liên hệ', href: '/contact' },
        { name: 'Chính sách bảo hành', href: '/warranty' },
    ],
    support: [
        { name: 'Hướng dẫn mua hàng', href: '/guide' },
        { name: 'Chính sách đổi trả', href: '/return-policy' },
        { name: 'Vận chuyển', href: '/shipping' },
        { name: 'FAQ', href: '/faq' },
    ],
};

const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com', icon: Facebook },
    { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
    { name: 'Youtube', href: 'https://youtube.com', icon: Youtube },
];

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer */}
            <div className="container-custom py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl font-heading">MK</span>
                            </div>
                            <span className="font-bold text-xl text-white font-heading">
                                Mắt Kính Tâm Đức
                            </span>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
                            Hệ thống mắt kính uy tín, chất lượng hàng đầu Việt Nam.
                            Cam kết sản phẩm chính hãng, bảo hành trọn đời.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <a href="tel:1900xxxx" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>Hotline: 1900 xxxx</span>
                            </a>
                            <a href="mailto:info@matkinhtamduc.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
                                <Mail className="w-4 h-4 text-primary" />
                                <span>info@matkinhtamduc.com</span>
                            </a>
                            <div className="flex items-start gap-3 text-gray-400">
                                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                                <span>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 mt-6">
                            {socialLinks.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center 
                           justify-center transition-colors duration-200"
                                    aria-label={item.name}
                                >
                                    <item.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Products Column */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 font-heading">Sản phẩm</h3>
                        <ul className="space-y-3">
                            {footerLinks.products.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white hover:pl-1 transition-all duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 font-heading">Công ty</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white hover:pl-1 transition-all duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 font-heading">Hỗ trợ</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white hover:pl-1 transition-all duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Mắt Kính Tâm Đức. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> in Vietnam
                    </p>
                </div>
            </div>
        </footer>
    );
}
