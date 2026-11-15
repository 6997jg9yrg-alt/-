/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // фирменные цвета Aktobe Dent: чёрный + жёлтый (как логотип и бейджики)
        ink: '#0B0B0C',
        deep: '#000000',
        mint: '#F5D43B', // фирменный жёлтый (акцент на тёмном)
        teal: '#6E5B00', // тёмно-жёлтый для текста на светлом фоне (контраст ≥ 4.5)
        cream: '#F7F4EC',
        sage: '#BEBCB4',
        muted: '#8F8D85',
        paper: '#F6F5F1',
        line: '#E7E5DF',
        text: '#151515',
        sub: '#46443E',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Oswald', '"Arial Narrow"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
