# Aktobe Dent — лендинг

Одностраничный сайт (навбар + полноэкранный hero с видео) для стоматологии Aktobe Dent.
Стек: React 18 + TypeScript + Vite + Tailwind CSS 3.

## Запуск

```bash
npm install
npm run dev      # режим разработки, http://localhost:5173
npm run build    # готовый сайт в папке dist/
```

## Как поменять тексты

Все надписи (название, меню, заголовок, кнопка, ссылка кнопки, видео) — в файле `src/content.ts`.

## Как выложить в интернет бесплатно

Папку `dist/` после `npm run build` можно перетащить на https://app.netlify.com/drop —
сайт сразу получит публичную ссылку.
