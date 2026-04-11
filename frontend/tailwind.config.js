/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 50: '#f6f5f0', 100: '#e8e6db', 200: '#d3cfb8', 300: '#b9b38e', 400: '#a39a6c', 500: '#8f8457', 600: '#7a6e49', 700: '#61563c', 800: '#524836', 900: '#473f31', 950: '#1a1710' },
        ember: { 400: '#f6a623', 500: '#e8951a', 600: '#cc7a0e' },
        void: { 800: '#12111a', 900: '#0a0a0f', 950: '#060609' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        glow: { '0%': { boxShadow: '0 0 5px rgba(246,166,35,0.1)' }, '100%': { boxShadow: '0 0 20px rgba(246,166,35,0.15)' } },
      },
    },
  },
  plugins: [],
};