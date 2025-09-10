'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Проверяем, есть ли токен аутентификации
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Если есть токен, перенаправляем на главную страницу
      router.push('/');
    } else {
      // Если нет токена, перенаправляем на страницу входа
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting...</p>
      </div>
    </div>
  );
}
