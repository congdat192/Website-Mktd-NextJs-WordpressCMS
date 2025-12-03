/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                heading: ['var(--font-poppins)', 'sans-serif'],
                sans: ['var(--font-opensans)', 'sans-serif'],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                luxury: {
                    primary: '#1C1917',
                    secondary: '#44403C',
                    cta: '#CA8A04',
                    gold: '#FFD700',
                    bg: '#FAFAF9',
                    text: '#0C0A09',
                    border: '#D6D3D1',
                },
                forest: {
                    primary: '#2E8B57',
                    secondary: '#87CEEB',
                    cta: '#FFD700',
                    bg: '#F0FFF4',
                    text: '#1A3320',
                    border: '#C6E6C6',
                },
            },
            backdropBlur: {
                'glass': '12px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
