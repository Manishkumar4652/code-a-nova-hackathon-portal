/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm paper surfaces
        paper: { DEFAULT: '#F5F2EA', 2: '#ECE8DD', 3: '#E2DDCE' },
        surface: '#FFFDF8',
        line: { DEFAULT: '#D9D4C6', strong: '#BDB6A3' },
        // Ink text scale (all >= 4.5:1 on paper)
        ink: { DEFAULT: '#16181D', soft: '#3F444F', muted: '#5E6370' },
        // Deep navy used for hero panels + footer
        navy: { DEFAULT: '#0F1B2D', 2: '#17273E', 3: '#22364F' },
        // Brand accent — "nova" orange
        nova: {
          50: '#FFF1EA',
          100: '#FFDFD0',
          300: '#FF9E78',
          400: '#FF7A45',
          500: '#EC5A22',
          600: '#D4410F',
          700: '#B3340A',
        },
        ok: { DEFAULT: '#1F7A5C', soft: '#E3F2EC' },
        warn: { DEFAULT: '#8A4B00', soft: '#FCEFD6' },
        bad: { DEFAULT: '#B42318', soft: '#FDE8E6' },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(22,24,29,.04), 0 12px 28px -16px rgba(22,24,29,.22)',
        lift: '0 1px 0 rgba(22,24,29,.05), 0 20px 40px -18px rgba(22,24,29,.30)',
        nova: '0 10px 24px -10px rgba(212,65,15,.55)',
      },
      borderRadius: { xl2: '14px' },
      transitionTimingFunction: { out: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      keyframes: {
        rise: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: { rise: 'rise .6s cubic-bezier(0.16, 1, 0.3, 1) both' },
    },
  },
  plugins: [],
};
