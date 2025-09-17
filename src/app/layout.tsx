import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "../providers/ReduxProvider";
import WebPDetector from "../components/WebPDetector";
import PWAStatus from "../components/PWAStatus";
import { Toaster } from "../components/Toaster";
import DndProvider from "../providers/DndProvider";

export const metadata: Metadata = {
  title: "360 House Viewer - ADU Collection",
  description: "Explore our comprehensive collection of Accessory Dwelling Units with immersive 360° tours",
  manifest: "/manifest.json",
  // themeColor перенесен в viewport
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "360 Houses"
  },
  openGraph: {
    title: "360 House Viewer - ADU Collection",
    description: "Explore our comprehensive collection of Accessory Dwelling Units with immersive 360° tours",
    type: "website",
    siteName: "360 House Viewer"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3730a3"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/LeagueSpartan-Regular.ttf" as="font" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/LeagueSpartan-Bold.ttf" as="font" crossOrigin="anonymous" />
        
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="360 Houses" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="360 Houses" />
        <meta name="msapplication-TileColor" content="#3730a3" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* iOS/iPadOS icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-167x167.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icons/icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icons/icon-76x76.png" />
        
        {/* Preload critical data for LCP optimization */}
        <link rel="preload" href="/data/index.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/Website.png" as="image" />

      </head>
      <body className="antialiased font-sans">
        <WebPDetector />
        <DndProvider>
          <ReduxProvider>
            <PWAStatus />
            {children}
            <Toaster />
          </ReduxProvider>
        </DndProvider>
        {/* Service Worker registration moved to useServiceWorker hook */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
              window.clearAppCache = function() {
                try {
                  if (window.localStorage) {
                    const keys = Object.keys(window.localStorage);
                    keys.forEach(key => {
                      if (key.startsWith('persist:') || key.startsWith('redux:')) {
                        window.localStorage.removeItem(key);
                      }
                    });
                  }
                  if (window.sessionStorage) {
                    window.sessionStorage.clear();
                  }
                  console.log('✅ Cache cleared! Reloading...');
                  window.location.reload();
                } catch (error) {
                  console.error('❌ Error clearing cache:', error);
                }
              };
              console.log('🛠️ Dev Tools: Use clearAppCache() to clear caches');
            }
          `
        }} />
      </body>
    </html>
  );
}
