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
  width = 600, 
  height = 400,
  onError 
}: SimpleImageModalProps) {
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setIsError(true);
    onError?.();
  };

  const openModal = () => {
    setIsModalOpen(true);
    // Не блокируем прокрутку страницы, чтобы модальное окно могло прокручиваться
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center text-gray-500`}>
        Image Not Available
      </div>
    );
  }

  return (
    <>
      {/* Миниатюра изображения, которая открывает модальное окно */}
      <div 
        onClick={openModal} 
        className="cursor-pointer transition-transform  hover:scale-105"
      >
        <Image
          src={src}
          alt={alt}
          className={className}
          width={width}
          height={height}
          onError={handleError}
          unoptimized // Отключаем оптимизацию изображений для отладки
        />
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center  bg-opacity-20 backdrop-blur-sm overflow-y-auto p-4"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-4xl my-10 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике на изображение
          >
            <button 
              className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 shadow-md"
              onClick={closeModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="overflow-y-auto max-h-[80vh] bg-white">
              <Image
                src={src}
                alt={alt}
                className="w-full h-auto object-contain"
                width={1200}
                height={800}
                unoptimized
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
