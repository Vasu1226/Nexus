/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#60A5FA', // Blue 400
                    DEFAULT: '#3B82F6', // Blue 500
                    dark: '#2563EB', // Blue 600
                },
                secondary: {
                    light: '#A78BFA', // Purple 400
                    DEFAULT: '#8B5CF6', // Purple 500
                    dark: '#7C3AED', // Purple 600
                },
                dark: {
                    bg: '#0F172A', // Slate 900
                    card: '#1E293B', // Slate 800
                    border: '#334155', // Slate 700
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-hero': 'linear-gradient(to right bottom, rgba(15, 23, 42, 0.8), rgba(30, 27, 75, 0.9))',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'blob': 'blob 7s infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                }
            }
        },
    },
    plugins: [],
}
