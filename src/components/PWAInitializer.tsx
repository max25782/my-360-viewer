'use client';

import { useServiceWorker } from '../hooks/useServiceWorker';

/**
 * Компонент для инициализации PWA функциональности
 * Должен быть добавлен на каждую страницу для регистрации Service Worker
 */
export default function PWAInitializer() {
  // Просто вызываем хук для регистрации Service Worker
  useServiceWorker();
  
  // Этот компонент ничего не рендерит
  return null;
}
