# Тестирование логотипов на localhost

## Способ 1: Использование URL параметра (Самый простой)

Запустите dev сервер и используйте параметр `testDomain` в URL:

```bash
npm run dev
```

Затем откройте в браузере:

- **Seattle**: `http://localhost:3000?testDomain=seattle-catalog.com`
- **Alpha ADU**: `http://localhost:3000?testDomain=alpha-adu.com`
- **LA**: `http://localhost:3000?testDomain=la-catalog.com`
- **Default**: `http://localhost:3000` (покажет `/Website.png`)

## Способ 2: Использование hosts файла (Более реалистично)

### macOS / Linux

1. Откройте hosts файл:
```bash
sudo nano /etc/hosts
```

2. Добавьте строки:
```
127.0.0.1 seattle-catalog.com
127.0.0.1 alpha-adu.com
127.0.0.1 la-catalog.com
```

3. Сохраните и перезапустите dev сервер:
```bash
npm run dev
```

4. Откройте в браузере:
- `http://seattle-catalog.com:3000`
- `http://alpha-adu.com:3000`
- `http://la-catalog.com:3000`

### Windows

1. Откройте Notepad от имени администратора
2. Откройте файл: `C:\Windows\System32\drivers\etc\hosts`
3. Добавьте строки:
```
127.0.0.1 seattle-catalog.com
127.0.0.1 alpha-adu.com
127.0.0.1 la-catalog.com
```
4. Сохраните файл
5. Перезапустите dev сервер и откройте домены в браузере

## Способ 3: Проверка через консоль браузера

1. Откройте `http://localhost:3000`
2. Откройте DevTools (F12)
3. В консоли выполните:

```javascript
// Проверить текущий логотип
import { getLogoByDomain } from './utils/getLogoByDomain';
console.log('Current logo:', getLogoByDomain());

// Или напрямую проверить функцию
// (если функция экспортирована глобально для тестирования)
```

## Способ 4: Временное переопределение для тестирования

Добавьте в консоль браузера:

```javascript
// Временно переопределить hostname для тестирования
const originalHostname = window.location.hostname;
Object.defineProperty(window.location, 'hostname', {
  get: () => 'seattle-catalog.com', // или 'alpha-adu.com'
  configurable: true
});

// Перезагрузите страницу или обновите компонент
window.location.reload();
```

## Проверка результата

После применения любого из способов:

1. **Откройте страницу** с Header компонентом
2. **Проверьте логотип** - должен отображаться правильный файл:
   - `seattle-catalog.com` → `/logo.png`
   - `alpha-adu.com` → `/logo2.jpeg`
   - `la-catalog.com` → `/logos/logo-la.svg` (если файл существует)
   - `localhost` → `/Website.png` (fallback)

3. **Проверьте в DevTools**:
   - Откройте Network tab
   - Найдите запрос к логотипу
   - Убедитесь, что загружается правильный файл

## Отладка

Если логотип не меняется:

1. **Проверьте консоль браузера** на ошибки
2. **Проверьте Network tab** - загружается ли правильный файл
3. **Проверьте hostname**:
```javascript
console.log('Current hostname:', window.location.hostname);
```

4. **Проверьте маппинг**:
```javascript
// В консоли браузера (если функция доступна)
console.log('Logo path:', getLogoByDomain());
```

## Быстрый тест

Самый быстрый способ - использовать URL параметр:

```bash
# Запустите сервер
npm run dev

# Откройте в браузере:
# http://localhost:3000?testDomain=seattle-catalog.com
# http://localhost:3000?testDomain=alpha-adu.com
```

Логотип должен автоматически измениться!
