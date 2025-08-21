/**
 * Хелперы для работы с путями в статических данных
 */

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Создает публичный URL для статических ресурсов
 */
export function publicUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return BASE_PATH ? `${BASE_PATH}/${cleanPath}` : `/${cleanPath}`;
}

/**
 * Создает URL для загрузки данных
 */
export function dataUrl(path: string): string {
  return publicUrl(`data/${path}`);
}

/**
 * Безопасное получение данных (только в браузере)
 */
export async function safeFetch<T>(url: string): Promise<{ data?: T; error?: string }> {
  if (typeof window === 'undefined') {
    return { error: 'safeFetch can only be used in browser environment' };
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}` };
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
