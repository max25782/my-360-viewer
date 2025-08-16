import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "../providers/ReduxProvider";
import WebPDetector from "../components/WebPDetector";

export const metadata: Metadata = {
  title: "RG Pro Builders - 360° Virtual Tours",
  description: "Explore our innovative home designs with interactive 360° tours",
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
        
        {/* Preload critical images for LCP optimization */}
        <link rel="preload" href="/data/house-assets.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/Website.png" as="image" />
        

      </head>
      <body className="antialiased font-sans">
        <WebPDetector />
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('Service Worker registered:', registration))
                .catch(error => console.log('Service Worker registration failed:', error));
            });
          }
        `}} />
      </body>
    </html>
  );
}
