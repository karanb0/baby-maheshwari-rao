/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      colors: {
        ocean: {
          light: '#67e8f9',
          mid: '#0ea5e9',
          dark: '#1e3a8a',
        },
        coral: {
          pink: '#f472b6',
          orange: '#fb923c',
        },
        sand: '#fef3c7',
        seaweed: '#22c55e',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'swim': 'swim 6s ease-in-out infinite',
        'bubble': 'bubble 8s linear infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        swim: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(20px) translateY(-10px)' },
          '50%': { transform: 'translateX(40px) translateY(0)' },
          '75%': { transform: 'translateX(20px) translateY(10px)' },
        },
        bubble: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.7' },
          '100%': { transform: 'translateY(-100vh) scale(1.5)', opacity: '0' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 255, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
