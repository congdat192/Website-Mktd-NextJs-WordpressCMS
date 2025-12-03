import type { Metadata } from "next";
import { Poppins, Open_Sans } from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const poppins = Poppins({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-poppins',
    display: 'swap',
});

const openSans = Open_Sans({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-opensans',
    display: 'swap',
});

export const metadata: Metadata = {
    title: "Mắt Kính Tâm Đức - Hệ thống mắt kính uy tín",
    description: "Hệ thống mắt kính chất lượng cao, đa dạng sản phẩm, phục vụ tận tâm",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
            <body className={`${poppins.variable} ${openSans.variable} min-h-screen flex flex-col bg-[#FAFAF9] font-sans`}>
                <Header />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
