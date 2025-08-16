import { useState, useEffect } from 'react';

interface PreviewData {
  [path: string]: string; // path -> base64 data URI
}

let previewCache: PreviewData | null = null;

export function usePreviews() {
  const [previews, setPreviews] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Если уже есть в кэше, используем кэш
    if (previewCache) {
      setPreviews(previewCache);
      return;
    }

    // Загружаем preview данные
    const loadPreviews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/data/360-previews.json');
        if (!response.ok) {
          throw new Error(`Failed to load previews: ${response.status}`);
        }

        const data = await response.json();
        previewCache = data; // Кэшируем
        setPreviews(data);
        console.log('📸 Preview данные загружены');
      } catch (err) {
        console.error('Ошибка загрузки preview:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreviews();
  }, []);

  // Получить preview для конкретного изображения
  const getPreview = (imagePath: string): string | null => {
    if (!previews) return null;
    
    // Нормализуем путь
    const normalizedPath = imagePath.replace(/\\/g, '/').replace('/public/', '/');
    return previews[normalizedPath] || null;
  };

  // Получить preview для тайла
  const getTilePreview = (houseId: string, room: string, tile: string): string | null => {
    if (!previews) return null;
    
    // Проверяем разные варианты путей
    const paths = [
      `/assets/${houseId}/360/${room}/${tile}.jpg`,
      `/assets/${houseId}/360/${room}/${tile}.webp`,
    ];
    
    for (const path of paths) {
      const preview = previews[path];
      if (preview) return preview;
    }
    
    return null;
  };

  return {
    previews,
    getPreview,
    getTilePreview,
    isLoading,
    error
  };
}
