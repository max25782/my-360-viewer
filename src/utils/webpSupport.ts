/**
 * WebP support detection utility
 * Проверяет поддержку WebP формата в браузере
 */

let webpSupportCache: boolean | null = null;

/**
 * Проверяет поддержку WebP формата
 */
export async function checkWebPSupport(): Promise<boolean> {
  // Возвращаем кешированный результат если доступен
  if (webpSupportCache !== null) {
    return webpSupportCache;
  }

  // SSR защита
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    // Создаем тестовое WebP изображение (1x1 пиксель)
    const webpData = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        // Если изображение загрузилось и имеет правильные размеры, WebP поддерживается
        const supported = img.width === 2 && img.height === 2;
        webpSupportCache = supported;
        resolve(supported);
      };
      
      img.onerror = () => {
        // Если произошла ошибка, WebP не поддерживается
        webpSupportCache = false;
        resolve(false);
      };
      
      img.src = webpData;
    });
  } catch (error) {
    console.error('Error checking WebP support:', error);
    webpSupportCache = false;
    return false;
  }
}

/**
 * Получает оптимальный формат изображения (WebP или JPEG)
 */
export async function getOptimalImageFormat(): Promise<'webp' | 'jpg'> {
  const supportsWebP = await checkWebPSupport();
  return supportsWebP ? 'webp' : 'jpg';
}

/**
 * Конвертирует URL изображения в оптимальный формат
 */
export async function getOptimalImageUrl(baseUrl: string): Promise<string> {
  const format = await getOptimalImageFormat();
  
  // Заменяем расширение на оптимальное
  if (format === 'webp' && !baseUrl.includes('.webp')) {
    return baseUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  
  return baseUrl;
}

/**
 * Синхронная версия для случаев, когда результат уже кеширован
 */
export function isWebPSupportedSync(): boolean | null {
  return webpSupportCache;
}