'use client';

import { useEffect } from 'react';

export default function WebPDetector() {
  useEffect(() => {
    // WebP support detection after hydration
    const webP = new Image();
    webP.onload = webP.onerror = function () {
      if (webP.height === 2) {
        document.documentElement.classList.add('webp-supported');
      } else {
        document.documentElement.classList.add('webp-not-supported');
      }
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }, []);

  return null; // This component doesn't render anything
}
