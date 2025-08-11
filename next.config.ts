import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true' || process.env.DEPLOY_TARGET === 'github-pages';
const repoName = 'my-360-viewer'; // Замените на имя вашего репозитория

const nextConfig: NextConfig = {
  // Настройки для GitHub Pages (только для GitHub Pages)
  ...(isGitHubPages && {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    distDir: 'out',
  }),

  // Базовый путь только для GitHub Pages
  basePath: isGitHubPages ? `/${repoName}` : '',
  assetPrefix: isGitHubPages ? `/${repoName}/` : '',
  
  // Отключаем ESLint для продакшен сборки
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    unoptimized: isGitHubPages, // Отключаем оптимизацию только для GitHub Pages
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
  
  // Редиректы работают только в dev режиме и для Vercel
  ...(!isGitHubPages && {
    async redirects() {
      return [
        { source: '/360', destination: '/view-360', permanent: false },
        { source: '/veiw-360', destination: '/view-360', permanent: true },
      ];
    },
  }),
};

export default nextConfig;
