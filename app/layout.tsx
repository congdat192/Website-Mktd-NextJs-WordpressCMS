import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/Toast';

// Load fonts
const inter = Inter({
    subsets: ['latin', 'vietnamese'],
    variable: '--font-inter',
    display: 'swap',
});

const poppins = Poppins({
    subsets: ['latin', 'latin-ext'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-poppins',
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: 'Mắt Kính Tâm Đức',
        template: '%s | Mắt Kính Tâm Đức',
    },
    description: 'Hệ thống mắt kính uy tín - Kính mắt thời trang, kính cận, kính râm chính hãng',
    keywords: ['mắt kính', 'kính mắt', 'kính cận', 'kính râm', 'Tâm Đức'],
    authors: [{ name: 'Mắt Kính Tâm Đức' }],
    openGraph: {
        type: 'website',
        locale: 'vi_VN',
        siteName: 'Mắt Kính Tâm Đức',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi" className={`${inter.variable} ${poppins.variable}`}>
            <body className="font-sans antialiased">
                <ToastProvider>
                    <Header />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <Footer />
                </ToastProvider>
            </body>
        </html>
    );
}
