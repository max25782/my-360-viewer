# My 360 Viewer - ADU House Showcase

Интерактивный веб-сайт для просмотра домов ADU (Accessory Dwelling Unit) с поддержкой 360° виртуальных туров, галереи дизайна интерьеров и сравнения различных пакетов домов.

## ✨ Функции

- 🏠 **Каталог домов** с детальной информацией
- 🎨 **Селектор дизайна интерьера** с различными стилями
- 📐 **Таблица сравнения пакетов** (Good/Better/Best)
- 🖼️ **Модальные окна** для увеличения изображений
- 📱 **Адаптивный дизайн** для всех устройств
- 🔄 **360° виртуальные туры** с Photo Sphere Viewer

## 🚀 Запуск в разработке

```bash
# Установка зависимостей
npm install

# Запуск сервера разработки
npm run dev

# Открыть http://localhost:3000
```

## 🌐 Деплой на GitHub Pages

### Автоматический деплой

1. **Пуш в main/master ветку** автоматически запускает деплой
2. **GitHub Actions** собирает и публикует сайт
3. **Сайт доступен** по адресу: `https://username.github.io/my-360-viewer/`

### Настройка GitHub Pages

1. **Перейдите в Settings** вашего репозитория
2. **Найдите раздел Pages**
3. **Выберите Source: GitHub Actions**
4. **Сохраните настройки**

### Ручной деплой

```bash
# Сборка проекта
npm run build

# Деплой (если установлен gh-pages)
npm run deploy
```

## 📁 Структура проекта

```
my-360-viewer/
├── public/                     # Статические файлы
│   ├── Walnut/                # Изображения домов
│   │   ├── 3D/               # 360° панорамы
│   │   └── walnut_color/     # Фотографии интерьеров
│   └── .nojekyll             # Отключение Jekyll
├── src/
│   ├── app/                   # Next.js App Router
│   ├── components/            # React компоненты
│   └── data/                  # Конфигурация данных
├── .github/workflows/         # GitHub Actions
└── next.config.ts            # Конфигурация Next.js
```

## 🔧 Технологии

- **Next.js 15** - React фреймворк
- **TypeScript** - Типизированный JavaScript  
- **Tailwind CSS** - CSS фреймворк
- **Photo Sphere Viewer** - 360° панорамы
- **GitHub Pages** - Хостинг

## 📦 Важные файлы конфигурации

### `next.config.ts`
```typescript
const nextConfig: NextConfig = {
  output: 'export',              // Статический экспорт
  trailingSlash: true,           // Добавление / в конце URL
  images: { unoptimized: true }, // Отключение оптимизации изображений
  basePath: '/my-360-viewer',    // Базовый путь для GitHub Pages
};
```

### `.github/workflows/deploy.yml`
- Автоматическая сборка при пуше
- Публикация на GitHub Pages
- Кеширование для быстрой сборки

## 🎯 Особенности реализации

### 360° Виртуальные туры
- **Photo Sphere Viewer** с CubemapAdapter
- **Навигация между комнатами** с маркерами
- **Поддержка мобильных устройств**

### Дизайн интерьера
- **4 стиля**: Modern, Classic, Rustic, Luxury
- **Карусель изображений** для каждой комнаты
- **Плавные переходы** между стилями

### Модальные окна
- **SimpleImageModal** для увеличения изображений
- **Клик вне области** для закрытия
- **Адаптивный размер** под разные экраны

## 🔗 Полезные ссылки

- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub Pages Guide](https://docs.github.com/pages)
- [Photo Sphere Viewer](https://photo-sphere-viewer.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📄 Лицензия

MIT License - свободное использование для личных и коммерческих проектов.