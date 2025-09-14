/**
 * Утилиты для работы с аутентификацией
 */

/**
 * Проверяет, аутентифицирован ли пользователь
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('authToken');
}

/**
 * Получает токен аутентификации
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

/**
 * Сохраняет токен аутентификации
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
}

/**
 * Удаляет токен аутентификации (выход из системы)
 */
export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
}

/**
 * Выход из системы с перенаправлением на страницу входа
 */
export function logout(): void {
  clearAuthToken();
  // Перенаправляем на страницу входа
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
