/**
 * Пример использования getLogoByHostname в middleware
 * 
 * Этот файл показывает, как можно использовать утилиту в middleware
 * для передачи информации о логотипе через headers в Server Components
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLogoByHostname } from './utils/getLogoByDomain';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const logoPath = getLogoByHostname(hostname);
  
  // Создаем response
  const response = NextResponse.next();
  
  // Передаем путь к логотипу через header для использования в Server Components
  response.headers.set('x-logo-path', logoPath);
  
  // Также можно передать домен для других целей
  response.headers.set('x-domain', hostname);
  
  return response;
}

// Расширяем matcher для применения ко всем страницам (опционально)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

/**
 * Использование в Server Component:
 * 
 * import { headers } from 'next/headers';
 * 
 * export default async function Page() {
 *   const headersList = await headers();
 *   const logoPath = headersList.get('x-logo-path') || '/Website.png';
 *   
 *   return (
 *     <Image src={logoPath} alt="Logo" width={250} height={150} />
 *   );
 * }
 */
