export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Mắt Kính Tâm Đức</h3>
                        <p className="text-gray-400 mb-4">
                            Hệ thống mắt kính uy tín, chất lượng hàng đầu Việt Nam
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Liên kết nhanh</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                                    Trang chủ
                                </a>
                            </li>
                            <li>
                                <a href="/blog" className="text-gray-400 hover:text-white transition-colors">
                                    Tin tức
                                </a>
                            </li>
                            <li>
                                <a href="/pages/gioi-thieu" className="text-gray-400 hover:text-white transition-colors">
                                    Giới thiệu
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>Hotline: 1900 xxxx</li>
                            <li>Email: info@matkinhtamduc.com</li>
                            <li>Địa chỉ: TP. Hồ Chí Minh</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Mắt Kính Tâm Đức. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
