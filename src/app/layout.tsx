import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "../providers/ReduxProvider";
import WebPDetector from "../components/WebPDetector";

export const metadata: Metadata = {
  title: "360 House Viewer - ADU Collection",
  description: "Explore our comprehensive collection of Accessory Dwelling Units with immersive 360° tours",
  manifest: "/manifest.json",
  themeColor: "#3730a3",
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
        <link rel="preload" href="/fonts/LeagueSpartan-Regular.ttf" as="font" type="font/truetype" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/LeagueSpartan-Bold.ttf" as="font" type="font/truetype" crossOrigin="anonymous" />
        
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="360 Houses" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        {/* Preload critical data for LCP optimization */}
        <link rel="preload" href="/data/index.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/Website.png" as="image" />
        

      </head>
      <body className="antialiased font-sans">
        <WebPDetector />
        <ReduxProvider>
          {children}
        </ReduxProvider>
        {/* Service Worker registration moved to useServiceWorker hook */}
      </body>
    </html>
  );
}
