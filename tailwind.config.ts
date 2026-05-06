import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1E3D',
          2: '#162E5C',
          3: '#1E3A6E',
        },
        sky: '#2E7DC4',
        gold: {
          DEFAULT: '#C89A1E',
          lt: '#E8B82A',
        },
        aesa: {
          navy:  '#0B1E3D',
          blue:  '#1A4B8C',
          sky:   '#2E7DC4',
          gold:  '#C89A1E',
        },
      },
      fontFamily: {
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        sans: ['Barlow', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
