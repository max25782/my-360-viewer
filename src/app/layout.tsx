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
        
        
        {/* iOS/iPadOS icons (avoid broken 144x144) */}
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-167x167.png" />
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
              window.clearAppCache = async function() {
                try {
                  // Local/session storage
                  try { window.localStorage && window.localStorage.clear(); } catch {}
                  try { window.sessionStorage && window.sessionStorage.clear(); } catch {}

                  // Cookies
                  try {
                    document.cookie.split(';').forEach(c => {
                      const name = c.split('=')[0]?.trim();
                      if (name) document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
                    });
                  } catch {}

                  // Caches API
                  try {
                    if ('caches' in window) {
                      const names = await caches.keys();
                      await Promise.all(names.map(n => caches.delete(n)));
                    }
                  } catch {}

                  // Service Workers
                  try {
                    if ('serviceWorker' in navigator) {
                      const regs = await navigator.serviceWorker.getRegistrations();
                      await Promise.all(regs.map(r => r.unregister()));
                    }
                  } catch {}

                  // IndexedDB (best-effort)
                  try {
                    if (window.indexedDB && 'databases' in indexedDB) {
                      const dbs = await indexedDB.databases();
                      await Promise.all((dbs || []).map(db => db?.name ? new Promise(res => {
                        const req = indexedDB.deleteDatabase(db.name);
                        req.onsuccess = req.onerror = req.onblocked = () => res();
                      }) : Promise.resolve()));
                    } else if (window.indexedDB) {
                      ['localforage', 'persist:root', 'redux', 'workbox-precache'].forEach(name => {
                        try { indexedDB.deleteDatabase(name); } catch {}
                      });
                    }
                  } catch {}

                  console.log('✅ App caches cleared. Redirecting to /login ...');
                  window.location.href = '/login';
                } catch (error) {
                  console.error('❌ Error clearing cache:', error);
                  window.location.href = '/login';
                }
              };
              console.log('🛠️ Dev Tools: run clearAppCache() in Console to reset and go to /login');
            }
          `
        }} />
      </body>
    </html>
  );
}
