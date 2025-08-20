'use client';

import { memo, useCallback } from 'react';
import Image from 'next/image';

// Redux imports
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { openImageModal, closeImageModal } from '../store/slices/uiSlice';

interface OptimizedSimpleImageModalProps {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
}

// Memoized modal content component
const ModalContent = memo(({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
    <div className="relative max-w-4xl max-h-4xl p-4" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
      >
        ×
      </button>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        className="max-w-full max-h-full object-contain"
        priority
      />
    </div>
  </div>
));

ModalContent.displayName = 'ModalContent';

// Main component with memoization
const OptimizedSimpleImageModal = memo(({ src, alt, className, width, height }: OptimizedSimpleImageModalProps) => {
  const dispatch = useAppDispatch();
  const { isImageModalOpen, modalImageSrc, modalImageAlt } = useAppSelector(state => state.ui);

  const handleImageClick = useCallback(() => {
    dispatch(openImageModal({ src, alt }));
  }, [dispatch, src, alt]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeImageModal());
  }, [dispatch]);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`cursor-pointer ${className}`}
        onClick={handleImageClick}
        loading="lazy"
      />
      
      {isImageModalOpen && modalImageSrc === src && (
        <ModalContent 
          src={modalImageSrc} 
          alt={modalImageAlt} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
});

OptimizedSimpleImageModal.displayName = 'OptimizedSimpleImageModal';

export default OptimizedSimpleImageModal;
