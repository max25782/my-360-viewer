'use client';

import { memo, useCallback, useState, useEffect, MouseEvent, TouchEvent } from 'react';
import Image from 'next/image';

interface ZoomableImageModalProps {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
}

// Компонент содержимого модального окна с функцией масштабирования
const ZoomableModalContent = memo(({ 
  src, 
  alt, 
  onClose 
}: { 
  src: string; 
  alt: string; 
  onClose: () => void 
}) => {
  // Состояние масштаба
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialTouch, setInitialTouch] = useState<null | { x: number, y: number }>(null);

  // Сбрасываем масштаб и позицию при изменении изображения
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  // Обработка увеличения/уменьшения масштаба
  const handleZoom = useCallback((zoomIn: boolean) => {
    setScale(prevScale => {
      const newScale = zoomIn 
        ? Math.min(prevScale + 0.5, 5) // Увеличение до 5x
        : Math.max(prevScale - 0.5, 1); // Уменьшение до 1x
      
      // Сбрасываем позицию при уменьшении до 1x
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      
      return newScale;
    });
  }, []);

  // Обработка нажатия мыши для перетаскивания
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [scale, position]);

  // Обработка движения мыши для перетаскивания
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, scale, dragStart]);

  // Обработка отпускания мыши для завершения перетаскивания
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Обработка начала касания для мобильных устройств
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setInitialTouch({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  }, [scale, position]);

  // Обработка движения касания для мобильных устройств
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && scale > 1 && initialTouch && e.touches.length === 1) {
      // Предотвращаем стандартное поведение только если масштаб > 1
      if (scale > 1) {
        e.preventDefault(); // Предотвращаем прокрутку при перетаскивании
      }
      setPosition({
        x: e.touches[0].clientX - initialTouch.x,
        y: e.touches[0].clientY - initialTouch.y
      });
    }
  }, [isDragging, scale, initialTouch]);

  // Обработка завершения касания для мобильных устройств
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setInitialTouch(null);
  }, []);

  // Обработка колеса мыши для масштабирования
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY < 0);
  }, [handleZoom]);

  return (
    <div 
      className="fixed inset-0  bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 overflow-hidden" 
      onClick={onClose}
    >
      <div 
        className="relative max-w-6xl max-h-[100vh]  overflow-auto  bg-opacity-50 rounded-lg" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center z-20"
        >
          ×
        </button>

        {/* Элементы управления масштабом */}
        <div className="absolute top-2 left-2 flex space-x-2 z-20">
          <button
            onClick={() => handleZoom(true)}
            className="text-white text-xl bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
          >
            +
          </button>
          <button
            onClick={() => handleZoom(false)}
            className="text-white text-xl bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
            disabled={scale === 1}
          >
            -
          </button>
          {scale > 1 && (
            <button
              onClick={() => {
                setScale(1);
                setPosition({ x: 0, y: 0 });
              }}
              className="text-white text-sm bg-black bg-opacity-50 rounded-full px-2 h-8 flex items-center justify-center"
            >
              Reset 
            </button>
          )}
        </div>

        {/* Индикатор масштаба */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded z-20">
          {Math.round(scale * 100)}%
        </div>

         {/* Контейнер изображения */}
        <div 
          className="overflow-auto relative w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          style={{ 
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            maxHeight: "calc(90vh - 10rem)",
            overflowY: "auto",
            overflowX: "hidden"
          }}
        >
          <div
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              transformOrigin: 'center',
              width: '100%',
              height: '100%'
            }}
          >
             <Image
              src={src}
              alt={alt}
              width={1200}
              height={800}
              className="max-w-full object-contain shadow-xl"
              priority
              unoptimized={scale > 1} // Используем неоптимизированное изображение для лучшего качества при увеличении
              style={{
                minWidth: scale > 1 ? '100%' : 'auto',
                minHeight: scale > 1 ? '100%' : 'auto',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

ZoomableModalContent.displayName = 'ZoomableModalContent';

// Основной компонент с локальным управлением состоянием
const ZoomableImageModal = memo(({ src, alt, className, width, height }: ZoomableImageModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`cursor-pointer ${className || ''}`}
        onClick={handleImageClick}
        loading="lazy"
      />
      
      {isModalOpen && (
        <ZoomableModalContent 
          src={src} 
          alt={alt} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
});

ZoomableImageModal.displayName = 'ZoomableImageModal';

export default ZoomableImageModal;
