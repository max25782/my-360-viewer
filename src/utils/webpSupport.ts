/**
 * Определение поддержки WebP в браузере
 */

let webpSupported: boolean | null = null;

export async function checkWebPSupport(): Promise<boolean> {
  // Если уже проверили, возвращаем результат
  if (webpSupported !== null) {
    return webpSupported;
  }

  // Проверка через создание WebP изображения
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      webpSupported = webP.height === 2;
      resolve(webpSupported);
    };
    // 1x2 прозрачный WebP
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Получить URL изображения с fallback на JPG если WebP не поддерживается
 */
export async function getImageUrl(jpgUrl: string): Promise<string> {
  const isWebPSupported = await checkWebPSupport();
  
  if (isWebPSupported) {
    // Заменяем .jpg на .webp
    const webpUrl = jpgUrl.replace(/\.(jpg|jpeg)$/i, '.webp');
    
    // Проверяем существование WebP файла
    try {
      const response = await fetch(webpUrl, { method: 'HEAD' });
      if (response.ok) {
        return webpUrl;
      }
    } catch {
      // Если WebP не найден, используем JPG
    }
  }
  
  return jpgUrl;
}

/**
 * Получить tiles для 360° с поддержкой WebP
 */
export async function get360Tiles(
  jpgTiles: Record<string, string>
): Promise<Record<string, string>> {
  const isWebPSupported = await checkWebPSupport();
  
  if (!isWebPSupported) {
    return jpgTiles;
  }
  
  // Пробуем загрузить WebP версии
  const webpTiles: Record<string, string> = {};
  
  for (const [direction, jpgUrl] of Object.entries(jpgTiles)) {
    webpTiles[direction] = await getImageUrl(jpgUrl);
  }
  
  return webpTiles;
}
