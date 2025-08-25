import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Функция для обработки редиректов
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  
  // Логирование для отладки
  console.log(`🔄 Middleware processing: ${pathname}`);
  
  // Проверяем на бесконечные редиректы для Walnut
  if (pathname === '/houses/Walnut' || pathname === '/houses/walnut') {
    console.log(`⚠️ Detected Walnut URL, checking for redirect loop...`);
    
    // Проверяем, был ли уже редирект
    const redirectCount = request.cookies.get('redirect_count')?.value || '0';
    const count = parseInt(redirectCount, 10);
    
    // Если было слишком много редиректов, прерываем цикл
    if (count > 2) {
      console.log(`🛑 Detected redirect loop for Walnut, stopping redirects`);
      
      // Сбрасываем счетчик редиректов
      const response = NextResponse.next();
      response.cookies.set('redirect_count', '0');
      return response;
    }
    
    // Увеличиваем счетчик редиректов
    const response = NextResponse.next();
    response.cookies.set('redirect_count', (count + 1).toString());
    return response;
  }
  
  // Для других URL сбрасываем счетчик редиректов
  if (request.cookies.has('redirect_count')) {
    const response = NextResponse.next();
    response.cookies.set('redirect_count', '0');
    return response;
  }
  
  return NextResponse.next();
}

// Указываем, для каких путей применять middleware
export const config = {
  matcher: ['/houses/:path*'],
};
