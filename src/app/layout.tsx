import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "../providers/ReduxProvider";

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
      </head>
      <body className="antialiased font-sans">
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
