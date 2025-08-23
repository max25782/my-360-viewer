'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SimpleImageModalProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onError?: () => void;
}

export default function SimpleImageModal({ 
  src, 
  alt, 
  className = '', 
  width = 400, 
  height = 300,
  onError 
}: SimpleImageModalProps) {
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setIsError(true);
    onError?.();
  };

  if (isError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center text-gray-500`}>
        Image Not Available
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={handleError}
      unoptimized // Отключаем оптимизацию изображений для отладки
    />
  );
}
