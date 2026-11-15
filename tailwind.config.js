/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#061412',
        deep: '#030B0A',
        mint: '#5EEAC4',
        teal: '#0E7C70',
        cream: '#F5EFE2',
        sage: '#B9CCC7',
        muted: '#8FA9A3',
        paper: '#F6F8F7',
        line: '#E2E8E6',
        text: '#15201E',
        sub: '#3D4B48',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Oswald', '"Arial Narrow"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
