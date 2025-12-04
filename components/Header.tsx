'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CartDrawer } from '@/components/cart';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { itemCount } = useCart();

    return (
        <>
            <header className="sticky top-0 z-40 bg-white border-b border-[#E5E5E5]">
                {/* Top Bar */}
                <div className="bg-[#228B22] text-white py-2 text-sm">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <p className="hidden md:block">Miễn phí vận chuyển cho đơn hàng trên 500.000₫</p>
                        <p className="md:hidden">Free ship đơn &gt; 500K</p>
                        <div className="flex gap-4 text-sm">
                            <Link href="/about" className="hover:underline">Về chúng tôi</Link>
                            <Link href="/contact" className="hover:underline">Liên hệ</Link>
                        </div>
                    </div>
                </div>

                {/* Main Header */}
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-10 h-10 bg-[#228B22] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">MK</span>
                            </div>
                            <span className="font-bold text-lg md:text-xl text-[#333333] hidden sm:block">
                                Mắt Kính Tâm Đức
                            </span>
                        </Link>

                        {/* Navigation - Desktop */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/products" className="text-[#333333] hover:text-[#228B22] transition font-medium">
                                Sản phẩm
                            </Link>
                            <Link href="/blog" className="text-[#333333] hover:text-[#228B22] transition font-medium">
                                Blog
                            </Link>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            {/* Cart Button */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 hover:bg-[#F5F5F5] rounded-lg transition"
                                aria-label="Giỏ hàng"
                            >
                                <ShoppingCart className="w-6 h-6 text-[#333333]" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#228B22] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {itemCount > 99 ? '99+' : itemCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 hover:bg-[#F5F5F5] rounded-lg transition"
                                aria-label="Menu"
                            >
                                {isMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <nav className="md:hidden mt-4 pt-4 border-t border-[#E5E5E5] space-y-3">
                            <Link
                                href="/products"
                                className="block py-2 text-[#333333] hover:text-[#228B22] transition font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sản phẩm
                            </Link>
                            <Link
                                href="/blog"
                                className="block py-2 text-[#333333] hover:text-[#228B22] transition font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Blog
                            </Link>
                            <Link
                                href="/about"
                                className="block py-2 text-[#333333] hover:text-[#228B22] transition font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Về chúng tôi
                            </Link>
                            <Link
                                href="/contact"
                                className="block py-2 text-[#333333] hover:text-[#228B22] transition font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Liên hệ
                            </Link>
                        </nav>
                    )}
                </div>
            </header>

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
