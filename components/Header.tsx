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
                        >
        Tin tức
                        </Link >
        <Link
            href="/pages/gioi-thieu"
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
            Giới thiệu
        </Link>
                    </nav >

        {/* Mobile menu button */ }
        < button className = "md:hidden text-gray-700" >
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
                    </button >
                </div >
            </div >
        </header >
    );
}
