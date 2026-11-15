# Aktobe Dent — сайт стоматологии

Сайт: https://6997jg9yrg-alt.github.io/-/
Второй формат (история при прокрутке): https://6997jg9yrg-alt.github.io/-/story.html — код в `src/story/`
React 18 + TypeScript + Vite + Tailwind CSS 3 + three.js.

## Как поменять тексты, фото, цены, отзывы

Всё в одном файле: `src/content.ts`. Заглушки в [КВАДРАТНЫХ СКОБКАХ] нужно заменить на реальные данные клиники.
Фото врачей и владельца — в папку `public/photos/`, а в `content.ts` указать имя файла (например `photo: 'aliya.jpg'`).

После изменений в ветке `main` сайт обновится сам за 1–2 минуты.

## Запуск на компьютере

```bash
npm install
npm run dev
```
