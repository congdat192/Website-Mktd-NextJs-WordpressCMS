import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                        Mắt Kính Tâm Đức
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            Trang chủ
                        </Link>
                        <Link
                            href="/products"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            Sản phẩm
                        </Link>
                        <Link
                            href="/blog"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            Tin tức
                        </Link>
                        <Link
                            href="/pages/gioi-thieu"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            Giới thiệu
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <button className="md:hidden text-gray-700">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
