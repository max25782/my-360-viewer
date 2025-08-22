/**
 * SSR-совместимый хук для предотвращения ошибок гидратации
 */

import { useState, useEffect } from 'react';

export function useSSRCompatible() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
