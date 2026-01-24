# Domain-based Logo Configuration

## Обзор

Утилита для динамического выбора логотипа в зависимости от домена. Работает в SSR, клиентских компонентах и PWA.

## Структура файлов

```
src/
  utils/
    getLogoByDomain.ts          # Основная утилита
  components/
    DomainLogo.tsx              # Переиспользуемый компонент
public/
  logos/
    logo-seattle.svg            # Логотип для seattle-catalog.com
    logo-la.svg                 # Логотип для la-catalog.com
  Website.png                   # Логотип по умолчанию
```

## Использование

### 1. В клиентских компонентах (Client Components)

#### Вариант A: Использование готового компонента DomainLogo

```tsx
'use client';

import { DomainLogo } from '../components/DomainLogo';
import Link from 'next/link';

export function Header() {
  return (
    <header>
      <Link href="/">
        <DomainLogo 
          width={250} 
          height={150}
          className="h-30 w-auto"
          priority
        />
      </Link>
    </header>
  );
}
```

#### Вариант B: Использование утилиты напрямую

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

  return (
    <Image 
      src={logoPath} 
      alt={logoAlt} 
      width={250} 
      height={150}
    />
  );
}
```

#### Вариант C: Для обычного img тега

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

### 2. В Server Components

```tsx
import Image from 'next/image';
import { headers } from 'next/headers';
import { getLogoByHostname } from '../utils/getLogoByDomain';

export async function ServerHeader() {
  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  
  const logoPath = getLogoByHostname(hostname);
  const logoAlt = hostname.includes('seattle') ? 'Seattle ADU Logo' : 'LA ADU Logo';

  return (
    <header>
      <Image 
        src={logoPath} 
        alt={logoAlt} 
        width={250} 
        height={150}
      />
    </header>
  );
}
```

### 3. В Middleware (для передачи в headers)

```tsx
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLogoByHostname } from './utils/getLogoByDomain';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const logoPath = getLogoByHostname(hostname);
  
  // Можно передать через header для использования в Server Components
  const response = NextResponse.next();
  response.headers.set('x-logo-path', logoPath);
  
  return response;
}
```

### 4. В API Routes

```tsx
// src/app/api/logo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getLogoByHostname } from '../../../utils/getLogoByDomain';

export async function GET(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const logoPath = getLogoByHostname(hostname);
  
  return NextResponse.json({ logoPath });
}
```

## Добавление новых доменов

Отредактируйте `src/utils/getLogoByDomain.ts`:

```typescript
const DOMAIN_LOGO_MAP: Record<string, string> = {
  'seattle-catalog.com': '/logos/logo-seattle.svg',
  'la-catalog.com': '/logos/logo-la.svg',
  'portland-catalog.com': '/logos/logo-portland.svg', // Новый домен
};
```

## Особенности

- ✅ Работает в SSR (Server Components)
- ✅ Работает в клиентских компонентах
- ✅ Работает в PWA
- ✅ Поддержка поддоменов (www.seattle-catalog.com → seattle-catalog.com)
- ✅ Fallback на дефолтный логотип
- ✅ Централизованная конфигурация
- ✅ Легко расширяется

## Примеры использования в проекте

### Header.tsx (обновлен)
```tsx
import { DomainLogo } from './DomainLogo';
// Используется в компоненте Header
```

### ModelViewer.tsx (можно обновить)
```tsx
import { DomainLogoImg } from './DomainLogo';

// Заменить:
// const seattleAduLogo = '/logo.png';
// <img src={seattleAduLogo} />

// На:
<DomainLogoImg className="w-8 h-8 object-contain filter brightness-110" />
```

### login/page.tsx (можно обновить)
```tsx
import { DomainLogo } from '../components/DomainLogo';

// Заменить Image с /Website.png на:
<DomainLogo width={64} height={64} priority />
```
