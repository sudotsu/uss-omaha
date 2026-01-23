import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1D39',
          dark: '#06101F',
        },
        slate: {
          deep: '#111827',
        },
        offwhite: '#F5F7FA',
        brass: {
          DEFAULT: '#C9A227',
          light: '#E4C56A',
        },
        neutral: {
          light: '#CBD5E1',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
