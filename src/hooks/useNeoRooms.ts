import { useState, useEffect } from 'react';

interface UseNeoRoomsResult {
  availableRooms: string[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook для получения доступных комнат Neo дома
 */
export function useNeoRooms(houseId: string): UseNeoRoomsResult {
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!houseId) {
      setAvailableRooms([]);
      setIsLoading(false);
      return;
    }

    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Убираем префикс "neo-" если он есть
        const cleanHouseId = houseId.startsWith('neo-') ? houseId.substring(4) : houseId;

        // Используем существующий API endpoint с таймаутом
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`/api/neo/${cleanHouseId}/packages`, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.success && data.data && data.data.availableRooms) {
          // Сортируем комнаты: living первая, остальные по алфавиту
          const sortedRooms = [...data.data.availableRooms].sort((a, b) => {
            // Если одна из комнат - living, она идет первой
            if (a === 'living' && b !== 'living') return -1;
            if (b === 'living' && a !== 'living') return 1;
            // Если обе или ни одна не living, сортируем по алфавиту
            return a.localeCompare(b);
          });
          
          setAvailableRooms(sortedRooms);
          console.log(`🏠 Neo rooms loaded for ${cleanHouseId} (${houseId}):`, sortedRooms);
        } else {
          // Fallback к дефолтным комнатам
          const defaultRooms = ['living', 'kitchen', 'bedroom', 'bathroom'];
          setAvailableRooms(defaultRooms);
          console.warn(`Using default rooms for ${cleanHouseId} (${houseId}):`, defaultRooms);
        }
      } catch (err) {
        const cleanHouseId = houseId.startsWith('neo-') ? houseId.substring(4) : houseId;
        
        // Более детальная обработка ошибок
        let errorMessage = 'Unknown error';
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            errorMessage = 'Request timeout';
          } else if (err.message.includes('Failed to fetch')) {
            errorMessage = 'Network error - server may be down';
          } else {
            errorMessage = err.message;
          }
        }
        
        console.warn(`⚠️ Error fetching Neo rooms for ${cleanHouseId} (${houseId}):`, errorMessage);
        setError(errorMessage);
        
        // Fallback к дефолтным комнатам при ошибке
        const defaultRooms = ['living', 'kitchen', 'bedroom', 'bathroom'];
        setAvailableRooms(defaultRooms);
        console.log(`📦 Using fallback rooms for ${cleanHouseId}:`, defaultRooms);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [houseId]);

  return {
    availableRooms,
    isLoading,
    error
  };
}
