import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'Inter', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      colors: {
        gold: {
          50:  '#FDF8EC',
          100: '#FAF0D4',
          200: '#F5D675',
          300: '#F0C040',
          400: '#E5A820',
          500: '#C9A84C',
          600: '#B8941E',
          700: '#8B6914',
          800: '#5C430B',
          900: '#2E2205',
        },
        silver: {
          50:  '#F8F8F8',
          100: '#F0F0F0',
          200: '#E0E0E0',
          300: '#C8C8C8',
          400: '#A8A9AD',
          500: '#8C8D91',
          600: '#6E6F73',
          700: '#515256',
          800: '#353639',
          900: '#1A1B1D',
        },
        dark: {
          50:  '#3A3A3A',
          100: '#2A2A2A',
          200: '#1E1E1E',
          300: '#1A1A1A',
          400: '#161616',
          500: '#111111',
          600: '#0D0D0D',
          700: '#0A0A0A',
          800: '#080808',
          900: '#050505',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #F5D675 50%, #C9A84C 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #C9A84C 0%, #F5D675 25%, #C9A84C 50%, #8B6914 75%, #C9A84C 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0A0A0A 0%, #111111 100%)',
        'card-gradient': 'linear-gradient(135deg, #1A1A1A 0%, #141414 100%)',
        'hero-radial': 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(201,168,76,0.3)',
        'gold-lg': '0 0 40px rgba(201,168,76,0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201,168,76,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(201,168,76,0.6)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        'fade-up': 'fade-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
