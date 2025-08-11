import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'my-360-viewer'; // Замените на имя вашего репозитория

const nextConfig: NextConfig = {
  // Настройки для GitHub Pages (только в продакшене)
  ...(isProd && {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    distDir: 'out',
  }),
  
  // Базовый путь для GitHub Pages (если репозиторий не username.github.io)
  basePath: isProd ? `/${'360-viewer'}` : '',
  assetPrefix: isProd ? `/${'360-viewer'}/` : '',
  
  // Отключаем ESLint для продакшен сборки
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    unoptimized: isProd, // Отключаем оптимизацию только в продакшене
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
  },
  
  // Редиректы работают только в dev режиме
  ...(!isProd && {
    async redirects() {
      return [
        { source: '/360', destination: '/view-360', permanent: false },
        { source: '/veiw-360', destination: '/view-360', permanent: true },
      ];
    },
  }),
};

export default nextConfig;
