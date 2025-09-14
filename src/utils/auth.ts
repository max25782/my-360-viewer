/**
 * Утилиты для работы с аутентификацией
 */

/**
 * Проверяет, аутентифицирован ли пользователь
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Проверяем и в localStorage, и в cookies
  const localToken = localStorage.getItem('authToken');
  const cookieToken = getCookieToken();
  
  return !!(localToken || cookieToken);
}

/**
 * Получает токен аутентификации из cookies
 */
function getCookieToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
  
  return authCookie ? authCookie.split('=')[1] : null;
}

/**
 * Получает токен аутентификации
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Сначала пробуем cookies, потом localStorage
  const cookieToken = getCookieToken();
  if (cookieToken) return cookieToken;
  
  return localStorage.getItem('authToken');
}

/**
 * Сохраняет токен аутентификации в cookies и localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  // Сохраняем в localStorage для обратной совместимости
  localStorage.setItem('authToken', token);
  
  // Сохраняем в cookies для API запросов
  const expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 дней
  
  document.cookie = `authToken=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
  
  console.log('🔐 Auth token saved to cookies and localStorage');
}

/**
 * Удаляет токен аутентификации (выход из системы)
 */
export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  
  // Удаляем из localStorage
  localStorage.removeItem('authToken');
  
  // Удаляем из cookies
  document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  console.log('🔐 Auth token cleared from cookies and localStorage');
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
