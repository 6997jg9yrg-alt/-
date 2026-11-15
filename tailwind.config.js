/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      transitionDuration: { 900: '900ms', 1400: '1400ms' },
    },
  },
  plugins: [],
}
