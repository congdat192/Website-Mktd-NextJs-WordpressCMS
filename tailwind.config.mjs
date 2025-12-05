/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            /* Typography */
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                heading: ['Poppins', 'system-ui', 'sans-serif'],
            },

            /* Colors - Matching CSS Custom Properties */
            colors: {
                primary: {
                    DEFAULT: '#228B22',
                    dark: '#1a6b1a',
                    light: '#3cb33c',
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#228B22',
                    600: '#1a6b1a',
                    700: '#166534',
                    800: '#14532d',
                    900: '#052e16',
                },
                accent: {
                    DEFAULT: '#CA8A04',
                    light: '#FDE047',
                    dark: '#A16207',
                },
                gray: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                },
            },

            /* Spacing - Extended */
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '30': '7.5rem',
            },

            /* Border Radius */
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
            },

            /* Box Shadow */
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.05)',
                'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            },

            /* Animation */
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },

            /* Typography Plugin Customization */
            typography: {
                DEFAULT: {
                    css: {
                        color: '#171717',
                        a: {
                            color: '#228B22',
                            '&:hover': {
                                color: '#1a6b1a',
                            },
                        },
                        h1: { fontFamily: 'Poppins, sans-serif' },
                        h2: { fontFamily: 'Poppins, sans-serif' },
                        h3: { fontFamily: 'Poppins, sans-serif' },
                        h4: { fontFamily: 'Poppins, sans-serif' },
                    },
                },
            },

            /* Backdrop Blur */
            backdropBlur: {
                'glass': '12px',
            },

            /* Screen Breakpoints (default, but explicit) */
            screens: {
                'xs': '475px',
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
