'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SimpleImageModalProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function SimpleImageModal({ 
  src, 
  alt, 
  className = '',
  width = 300,
  height = 200
}: SimpleImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Clickable Image */}
      <div 
        className="cursor-pointer hover:opacity-90 transition-opacity"
        onClick={openModal}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`rounded ${className}`}
          unoptimized
        />
      </div>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-200 bg-opacity-10 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-2xl font-bold hover:text-gray-300 z-10"
            >
              ×
            </button>
            
            {/* Large Image */}
            <Image
              src={src}
              alt={alt}
              width={1000}
              height={700}
              className="max-w-full max-h-full object-contain rounded"
              priority
              unoptimized
            />
            
            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 rounded-b">
              <p className="text-center text-sm">{alt}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
