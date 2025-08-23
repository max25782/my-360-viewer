import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true' || process.env.DEPLOY_TARGET === 'github-pages';
const isVercel = process.env.VERCEL === '1';
const repoName = 'my-360-viewer'; // Замените на имя вашего репозитория

// Debug info
console.log('🔧 Next.js Config Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('GITHUB_ACTIONS:', process.env.GITHUB_ACTIONS);
console.log('VERCEL:', process.env.VERCEL);
console.log('DEPLOY_TARGET:', process.env.DEPLOY_TARGET);
console.log('isProd:', isProd);
console.log('isGitHubPages:', isGitHubPages);
console.log('isVercel:', isVercel);

const nextConfig: NextConfig = {
  // Настройки для GitHub Pages (только для GitHub Pages)
  ...(isGitHubPages && !isVercel && {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    distDir: 'out',
  }),

  // Базовый путь только для GitHub Pages, никогда не для Vercel
  basePath: (isGitHubPages && !isVercel) ? `/${repoName}` : '',
  assetPrefix: (isGitHubPages && !isVercel) ? `/${repoName}/` : '',
  
  // Отключаем ESLint для продакшен сборки
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    unoptimized: isGitHubPages && !isVercel, // Отключаем оптимизацию только для GitHub Pages, не для Vercel
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
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/**',
      },
    ],
  },
  
  // Редиректы работают только в dev режиме и для Vercel (не для GitHub Pages)
  ...((isVercel || !isProd) && {
    async redirects() {
      return [
        { source: '/360', destination: '/view-360', permanent: false },
        { source: '/veiw-360', destination: '/view-360', permanent: true },
        
        // Case-insensitive redirects for house names
        { source: '/houses/apex', destination: '/houses/Apex', permanent: true },
        { source: '/houses/walnut', destination: '/houses/Walnut', permanent: true },
        { source: '/houses/APEX', destination: '/houses/Apex', permanent: true },
        { source: '/houses/WALNUT', destination: '/houses/Walnut', permanent: true },
        
        // Tour redirects
        { source: '/houses/apex/tour', destination: '/houses/Apex/tour', permanent: true },
        { source: '/houses/walnut/tour', destination: '/houses/Walnut/tour', permanent: true },
        { source: '/houses/apex/comparison', destination: '/houses/Apex/comparison', permanent: true },
        { source: '/houses/walnut/comparison', destination: '/houses/Walnut/comparison', permanent: true },
      ];
    },
  }),
};

export default nextConfig;
