'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Menu,
    Phone,
    Clock,
    Search,
    ShoppingCart,
    ChevronDown,
    Glasses,
    Sun,
    Circle,
    Star,
    X,
    MapPin,
    User,
    Heart,
    Tag,
    Shield,
    Sparkles,
    Target,
    Square,
    Gift,
    Zap,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showMegaMenu, setShowMegaMenu] = useState<string | null>(null);
    const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
    const { cartItems } = useCart();

    const cartCount = (cartItems || []).reduce((sum, item) => sum + item.quantity, 0);

    // Navigation items
    const navItems = [
        { name: 'Trang chủ', href: '/' },
        { name: 'Gọng kính', href: '/gong-kinh', hasMega: true, megaId: 'frames' },
        { name: 'Tròng kính', href: '/trong-kinh-chinh-hang', hasMega: true, megaId: 'lenses' },
        { name: 'Kính mát', href: '/kinh-mat', hasMega: true, megaId: 'sunglasses' },
        { name: 'Tin tức', href: '/blog' },
        { name: 'Liên hệ', href: '/contact' },
    ];

    // Mobile menu items with subcategories
    const mobileMenuItems = [
        {
            id: 'frames',
            title: 'Gọng Kính',
            icon: <Glasses className="h-5 w-5" />,
            href: '/gong-kinh',
            subcategories: [
                { title: 'Gọng nhựa', href: '/gong-kinh?type=nhua' },
                { title: 'Gọng kim loại', href: '/gong-kinh?type=kim-loai' },
                { title: 'Gọng titan', href: '/gong-kinh?type=titan' },
                { title: 'Gọng không viền', href: '/gong-kinh?type=rimless' },
            ],
        },
        {
            id: 'lenses',
            title: 'Tròng Kính',
            icon: <Circle className="h-5 w-5" />,
            href: '/trong-kinh-chinh-hang',
            subcategories: [
                { title: 'Tròng đơn tròng', href: '/trong-kinh-chinh-hang?type=don-trong' },
                { title: 'Tròng đa tròng', href: '/trong-kinh-chinh-hang?type=da-trong' },
                { title: 'Tròng đổi màu', href: '/trong-kinh-chinh-hang?type=doi-mau' },
                { title: 'Tròng chống ánh sáng xanh', href: '/trong-kinh-chinh-hang?type=blue-light' },
            ],
        },
        {
            id: 'sunglasses',
            title: 'Kính Mát',
            icon: <Sun className="h-5 w-5" />,
            href: '/kinh-mat',
            subcategories: [
                { title: 'Kính phân cực', href: '/kinh-mat?type=polarized' },
                { title: 'Kính thể thao', href: '/kinh-mat?type=sport' },
                { title: 'Kính thời trang', href: '/kinh-mat?type=fashion' },
            ],
        },
        { id: 'blog', title: 'Tin tức', icon: <Star className="h-5 w-5" />, href: '/blog' },
        { id: 'contact', title: 'Liên hệ', icon: <MapPin className="h-5 w-5" />, href: '/contact' },
    ];

    // Mega Menu Content
    const MegaMenuContent = ({ type }: { type: string }) => {
        if (type === 'frames') {
            return (
                <div className="grid grid-cols-4 gap-6">
                    {/* Frame Types */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Glasses className="h-4 w-4 text-primary" />
                            Loại gọng
                        </h3>
                        <div className="space-y-2">
                            <Link href="/gong-kinh?type=full-rim" className="block text-sm text-gray-600 hover:text-primary py-1">Gọng đầy</Link>
                            <Link href="/gong-kinh?type=semi-rim" className="block text-sm text-gray-600 hover:text-primary py-1">Nửa gọng</Link>
                            <Link href="/gong-kinh?type=rimless" className="block text-sm text-gray-600 hover:text-primary py-1">Không gọng</Link>
                            <Link href="/gong-kinh?type=children" className="block text-sm text-gray-600 hover:text-primary py-1">Gọng trẻ em</Link>
                        </div>
                    </div>

                    {/* Materials */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Circle className="h-4 w-4 text-primary" />
                            Chất liệu
                        </h3>
                        <div className="space-y-2">
                            <Link href="/gong-kinh?material=acetate" className="block text-sm text-gray-600 hover:text-primary py-1">Acetate</Link>
                            <Link href="/gong-kinh?material=titan" className="block text-sm text-gray-600 hover:text-primary py-1">Titan</Link>
                            <Link href="/gong-kinh?material=metal" className="block text-sm text-gray-600 hover:text-primary py-1">Kim loại</Link>
                            <Link href="/gong-kinh?material=tr90" className="block text-sm text-gray-600 hover:text-primary py-1">TR90</Link>
                        </div>
                    </div>

                    {/* Brands */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Star className="h-4 w-4 text-primary" />
                            Thương hiệu
                        </h3>
                        <div className="space-y-2">
                            <Link href="/gong-kinh?brand=rayban" className="block text-sm text-gray-600 hover:text-primary py-1">Ray-Ban</Link>
                            <Link href="/gong-kinh?brand=oakley" className="block text-sm text-gray-600 hover:text-primary py-1">Oakley</Link>
                            <Link href="/gong-kinh?brand=gucci" className="block text-sm text-gray-600 hover:text-primary py-1">Gucci</Link>
                            <Link href="/gong-kinh?brand=tomford" className="block text-sm text-gray-600 hover:text-primary py-1">Tom Ford</Link>
                        </div>
                    </div>

                    {/* Promo */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" />
                            Khuyến mãi
                        </h3>
                        <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg border border-primary/20">
                            <div className="text-sm font-medium text-primary mb-1">Giảm giá 30%</div>
                            <div className="text-xs text-gray-700 mb-3">Gọng kính thời trang</div>
                            <Link href="/gong-kinh?sale=true" className="block w-full text-center bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
                                Xem ngay
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        if (type === 'lenses') {
            return (
                <div className="grid grid-cols-4 gap-6">
                    {/* Lens Types */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Circle className="h-4 w-4 text-primary" />
                            Loại tròng
                        </h3>
                        <div className="space-y-2">
                            <Link href="/trong-kinh-chinh-hang?type=progressive" className="block text-sm text-gray-600 hover:text-primary py-1">Đa tròng</Link>
                            <Link href="/trong-kinh-chinh-hang?type=single-vision" className="block text-sm text-gray-600 hover:text-primary py-1">Đơn tròng</Link>
                            <Link href="/trong-kinh-chinh-hang?type=photochromic" className="block text-sm text-gray-600 hover:text-primary py-1">Đổi màu</Link>
                            <Link href="/trong-kinh-chinh-hang?type=office" className="block text-sm text-gray-600 hover:text-primary py-1">Văn phòng</Link>
                        </div>
                    </div>

                    {/* Refractive Index */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            Chiết suất
                        </h3>
                        <div className="space-y-2">
                            <Link href="/trong-kinh-chinh-hang?index=1.5" className="block text-sm text-gray-600 hover:text-primary py-1">1.5 (Cơ bản)</Link>
                            <Link href="/trong-kinh-chinh-hang?index=1.56" className="block text-sm text-gray-600 hover:text-primary py-1">1.56 (Trung bình)</Link>
                            <Link href="/trong-kinh-chinh-hang?index=1.67" className="block text-sm text-gray-600 hover:text-primary py-1">1.67 (Siêu mỏng)</Link>
                            <Link href="/trong-kinh-chinh-hang?index=1.74" className="block text-sm text-gray-600 hover:text-primary py-1">1.74 (Ultra mỏng)</Link>
                        </div>
                    </div>

                    {/* Coatings */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            Lớp phủ
                        </h3>
                        <div className="space-y-2">
                            <Link href="/trong-kinh-chinh-hang?coating=anti-reflective" className="block text-sm text-gray-600 hover:text-primary py-1">Chống phản quang</Link>
                            <Link href="/trong-kinh-chinh-hang?coating=blue-control" className="block text-sm text-gray-600 hover:text-primary py-1">Chống ánh sáng xanh</Link>
                            <Link href="/trong-kinh-chinh-hang?coating=scratch-resistant" className="block text-sm text-gray-600 hover:text-primary py-1">Chống trầy</Link>
                            <Link href="/trong-kinh-chinh-hang?coating=uv-protection" className="block text-sm text-gray-600 hover:text-primary py-1">Kháng UV</Link>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Công nghệ mới
                        </h3>
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                            <div className="text-sm font-medium text-blue-700 mb-1">Blue Light Filter</div>
                            <div className="text-xs text-gray-700 mb-3">Bảo vệ mắt khỏi ánh sáng xanh</div>
                            <Link href="/trong-kinh-chinh-hang?feature=blue-light" className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                                Tìm hiểu
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        if (type === 'sunglasses') {
            return (
                <div className="grid grid-cols-4 gap-6">
                    {/* Lens Types */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Sun className="h-4 w-4 text-primary" />
                            Loại tròng
                        </h3>
                        <div className="space-y-2">
                            <Link href="/kinh-mat?lens=polarized" className="block text-sm text-gray-600 hover:text-primary py-1">Phân cực</Link>
                            <Link href="/kinh-mat?lens=gradient" className="block text-sm text-gray-600 hover:text-primary py-1">Gradient</Link>
                            <Link href="/kinh-mat?lens=mirror" className="block text-sm text-gray-600 hover:text-primary py-1">Mirror</Link>
                            <Link href="/kinh-mat?lens=prizm" className="block text-sm text-gray-600 hover:text-primary py-1">Prizm</Link>
                        </div>
                    </div>

                    {/* Frame Shapes */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Square className="h-4 w-4 text-primary" />
                            Hình dạng
                        </h3>
                        <div className="space-y-2">
                            <Link href="/kinh-mat?shape=aviator" className="block text-sm text-gray-600 hover:text-primary py-1">Phi công</Link>
                            <Link href="/kinh-mat?shape=wayfarer" className="block text-sm text-gray-600 hover:text-primary py-1">Wayfarer</Link>
                            <Link href="/kinh-mat?shape=round" className="block text-sm text-gray-600 hover:text-primary py-1">Tròn</Link>
                            <Link href="/kinh-mat?shape=cat-eye" className="block text-sm text-gray-600 hover:text-primary py-1">Mắt mèo</Link>
                        </div>
                    </div>

                    {/* Activities */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Tag className="h-4 w-4 text-primary" />
                            Hoạt động
                        </h3>
                        <div className="space-y-2">
                            <Link href="/kinh-mat?activity=driving" className="block text-sm text-gray-600 hover:text-primary py-1">Lái xe</Link>
                            <Link href="/kinh-mat?activity=sport" className="block text-sm text-gray-600 hover:text-primary py-1">Thể thao</Link>
                            <Link href="/kinh-mat?activity=fashion" className="block text-sm text-gray-600 hover:text-primary py-1">Thời trang</Link>
                            <Link href="/kinh-mat?activity=beach" className="block text-sm text-gray-600 hover:text-primary py-1">Du lịch biển</Link>
                        </div>
                    </div>

                    {/* Summer Collection */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Gift className="h-4 w-4 text-primary" />
                            Bộ sưu tập hè
                        </h3>
                        <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-100 rounded-lg border border-orange-200">
                            <div className="text-sm font-medium text-orange-700 mb-1">Giảm 50%</div>
                            <div className="text-xs text-gray-700 mb-3">Kính râm thời trang</div>
                            <Link href="/kinh-mat?sale=true" className="block w-full text-center bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition">
                                Mua ngay
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b shadow-sm">
            <div className="container mx-auto px-4">
                {/* Top bar - Desktop only */}
                <div className="hidden lg:flex items-center justify-between py-2 text-sm text-gray-600 border-b">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>Hotline: <strong className="text-primary">0901 234 567</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Thứ 2 - CN: 8:00 - 21:00</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/wishlist" className="flex items-center gap-1 hover:text-primary transition">
                            <Heart className="h-4 w-4" />
                            Yêu thích
                        </Link>
                        <Link href="/store-locator" className="flex items-center gap-1 hover:text-primary transition">
                            <MapPin className="h-4 w-4" />
                            Tìm cửa hàng
                        </Link>
                    </div>
                </div>

                {/* Main navigation */}
                <div className="flex items-center justify-between py-3 lg:py-4">
                    {/* Left: Menu button (mobile) + Logo */}
                    <div className="flex items-center gap-3">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">MK</span>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="font-bold text-lg text-gray-900">Mắt Kính Tâm Đức</h1>
                                <p className="text-xs text-gray-500">Giá trị & Trải nghiệm</p>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative"
                                onMouseEnter={() => item.hasMega && setShowMegaMenu(item.megaId || null)}
                                onMouseLeave={() => setShowMegaMenu(null)}
                            >
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary rounded-lg hover:bg-gray-50 transition"
                                >
                                    {item.name}
                                    {item.hasMega && <ChevronDown className="h-4 w-4" />}
                                </Link>

                                {/* Mega Menu */}
                                {item.hasMega && showMegaMenu === item.megaId && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-4xl bg-white border-t shadow-xl rounded-b-xl">
                                        <div className="p-6">
                                            <MegaMenuContent type={item.megaId!} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <Search className="h-5 w-5 text-gray-600" />
                        </button>

                        {/* User */}
                        <Link href="/profile" className="hidden sm:flex p-2 hover:bg-gray-100 rounded-lg transition">
                            <User className="h-5 w-5 text-gray-600" />
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                            <ShoppingCart className="h-5 w-5 text-gray-600" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="absolute left-0 top-0 h-full w-[85vw] max-w-[400px] bg-white shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold">MK</span>
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">Mắt Kính Tâm Đức</h2>
                                    <p className="text-xs text-gray-500">Giá trị & Trải nghiệm</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Auth Section */}
                        <div className="p-4 bg-green-50 border-b">
                            <p className="text-sm text-center text-gray-700 mb-3">
                                Đăng nhập để nhận ưu đãi thành viên
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="py-2.5 bg-primary text-white text-center rounded-lg font-medium hover:bg-primary/90 transition"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="py-2.5 border-2 border-primary text-primary text-center rounded-lg font-medium hover:bg-primary/5 transition"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <nav className="flex-1 overflow-y-auto p-4">
                            {mobileMenuItems.map((item) => (
                                <div key={item.id} className="border-b border-gray-100 last:border-0">
                                    {item.subcategories ? (
                                        <>
                                            <button
                                                onClick={() => setExpandedMobileItem(
                                                    expandedMobileItem === item.id ? null : item.id
                                                )}
                                                className="w-full flex items-center justify-between py-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="text-primary">{item.icon}</div>
                                                    <span className="font-medium">{item.title}</span>
                                                </div>
                                                <ChevronDown
                                                    className={`h-4 w-4 text-gray-400 transition-transform ${expandedMobileItem === item.id ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </button>
                                            {expandedMobileItem === item.id && (
                                                <div className="pl-10 pb-3 space-y-2">
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="block text-sm text-primary font-medium py-1"
                                                    >
                                                        Xem tất cả {item.title}
                                                    </Link>
                                                    {item.subcategories.map((sub) => (
                                                        <Link
                                                            key={sub.title}
                                                            href={sub.href}
                                                            onClick={() => setIsMenuOpen(false)}
                                                            className="block text-sm text-gray-600 hover:text-primary py-1"
                                                        >
                                                            {sub.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 py-3"
                                        >
                                            <div className="text-primary">{item.icon}</div>
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Footer */}
                        <div className="p-4 border-t bg-gray-50">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>Hotline: <strong>0901 234 567</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
