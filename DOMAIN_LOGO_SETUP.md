# Настройка логотипов по доменам

## Быстрый старт

Решение позволяет показывать разные логотипы в зависимости от домена без изменения кода между деплоями.

### Структура файлов

```
src/
  utils/
    getLogoByDomain.ts          # Основная утилита
  components/
    DomainLogo.tsx              # Переиспользуемый компонент Logo
public/
  logos/
    logo-seattle.svg            # Логотип для seattle-catalog.com
    logo-la.svg                 # Логотип для la-catalog.com
  Website.png                   # Логотип по умолчанию
```

## Настройка

### 1. Создайте папку для логотипов

```bash
mkdir -p public/logos
```

### 2. Добавьте логотипы

Поместите файлы логотипов в `public/logos/`:
- `logo-seattle.svg` для seattle-catalog.com
- `logo-la.svg` для la-catalog.com

### 3. Настройте маппинг доменов

Отредактируйте `src/utils/getLogoByDomain.ts`:

```typescript
const DOMAIN_LOGO_MAP: Record<string, string> = {
  'seattle-catalog.com': '/logos/logo-seattle.svg',
  'la-catalog.com': '/logos/logo-la.svg',
  // Добавьте новые домены здесь
};
```

## Использование

### Вариант 1: Готовый компонент (рекомендуется)

```tsx
'use client';

import { DomainLogo } from '../components/DomainLogo';

export function Header() {
  return (
    <DomainLogo 
      width={250} 
      height={150}
      className="h-30 w-auto"
      priority
    />
  );
}
```

### Вариант 2: Утилита напрямую

```tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getLogoByDomain, getLogoAltByDomain } from '../utils/getLogoByDomain';

export function CustomHeader() {
  const [logoPath, setLogoPath] = useState('/Website.png');
  const [logoAlt, setLogoAlt] = useState('Logo');

  useEffect(() => {
    setLogoPath(getLogoByDomain());
    setLogoAlt(getLogoAltByDomain());
  }, []);

  return <Image src={logoPath} alt={logoAlt} width={250} height={150} />;
}
```

### Вариант 3: Для обычного img тега

```tsx
'use client';

import { DomainLogoImg } from '../components/DomainLogo';

export function SimpleLogo() {
  return (
    <div className="w-16 h-16">
      <DomainLogoImg className="w-full h-full object-contain" />
    </div>
  );
}
```

### Вариант 4: Server Component

```tsx
import Image from 'next/image';
import { headers } from 'next/headers';
import { getLogoByHostname } from '../utils/getLogoByDomain';

export default async function ServerHeader() {
  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  
  const logoPath = getLogoByHostname(hostname);

  return <Image src={logoPath} alt="Logo" width={250} height={150} />;
}
```

## Особенности

✅ **SSR совместимость** - работает в Server Components  
✅ **PWA совместимость** - работает в офлайн режиме  
✅ **Поддержка поддоменов** - www.seattle-catalog.com → seattle-catalog.com  
✅ **Fallback** - автоматически использует `/Website.png` если домен не найден  
✅ **Централизованная конфигурация** - все настройки в одном месте  
✅ **Легко расширяется** - просто добавьте новый домен в маппинг

## Примеры в проекте

### Header.tsx (уже обновлен)
Использует компонент `DomainLogo` для автоматического выбора логотипа.

### Обновление других компонентов

Замените хардкод логотипов на использование утилиты:

**Было:**
```tsx
const seattleAduLogo = '/logo.png';
<img src={seattleAduLogo} alt="Logo" />
```

**Стало:**
```tsx
import { DomainLogoImg } from '../components/DomainLogo';
<DomainLogoImg className="w-8 h-8 object-contain" />
```

## Добавление нового домена

1. Добавьте логотип в `public/logos/logo-{domain}.svg`
2. Обновите `DOMAIN_LOGO_MAP` в `src/utils/getLogoByDomain.ts`:

```typescript
const DOMAIN_LOGO_MAP: Record<string, string> = {
  'seattle-catalog.com': '/logos/logo-seattle.svg',
  'la-catalog.com': '/logos/logo-la.svg',
  'portland-catalog.com': '/logos/logo-portland.svg', // Новый домен
};
```

3. (Опционально) Добавьте alt текст в функцию `getLogoAltByDomain()`

## Тестирование

### Локально

Используйте hosts файл для тестирования разных доменов:

```bash
# /etc/hosts (macOS/Linux) или C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1 seattle-catalog.com
127.0.0.1 la-catalog.com
```

Затем откройте `http://seattle-catalog.com:3000` или `http://la-catalog.com:3000`

### В продакшене

Просто подключите домены к одному и тому же деплою в Vercel. Логотип будет автоматически определяться по домену.

## Troubleshooting

**Логотип не меняется:**
- Проверьте, что домен точно совпадает с ключом в `DOMAIN_LOGO_MAP`
- Убедитесь, что файл логотипа существует в `public/logos/`
- Проверьте консоль браузера на ошибки загрузки изображений

**SSR не работает:**
- Используйте `getLogoByHostname()` в Server Components
- Или передайте hostname через headers в middleware (см. `middleware.example.ts`)

**PWA не работает:**
- Убедитесь, что логотипы добавлены в `public/` (они будут кэшироваться)
- Проверьте, что Service Worker правильно кэширует статические файлы
