import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Копия сайта на GitHub Pages не должна попадать в поиск (главный адрес — aktobedent.kz).
// В workflow для GitHub Pages сборка идёт с NOINDEX=1.
const noindexCopy = (): Plugin => ({
  name: 'noindex-copy',
  transformIndexHtml(html) {
    if (process.env.NOINDEX !== '1') return html
    return html.replace('<head>', '<head>\n    <meta name="robots" content="noindex, nofollow" />')
  },
})

export default defineConfig({
  plugins: [react(), noindexCopy()],
  base: './',
})
