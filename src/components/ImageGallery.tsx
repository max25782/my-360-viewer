import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Grid3X3,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: string[];
  modelName: string;
  currentIndex?: number;
  onImageChange?: (index: number) => void;
  className?: string;
}

export function ImageGallery({ 
  images, 
  modelName, 
  currentIndex = 0, 
  onImageChange,
  className = '' 
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handlePrevious = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1;
    setActiveIndex(newIndex);
    onImageChange?.(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0;
    setActiveIndex(newIndex);
    onImageChange?.(newIndex);
  };

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
    onImageChange?.(index);
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
  };

  const GalleryContent = ({ isModal = false }: { isModal?: boolean }) => (
    <div className={`relative ${isModal ? 'h-full' : 'aspect-video'} bg-slate-900 overflow-hidden`}>
      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img 
          src={images[activeIndex]}
          alt={`${modelName} - Image ${activeIndex + 1}`}
          className={`max-w-full max-h-full object-contain select-none transition-transform duration-300`}
          style={{ 
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            filter: 'brightness(1.05) contrast(1.05)',
          }}
          draggable={false}
        />
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <Button
          onClick={handlePrevious}
          variant="outline"
          size="sm"
          className="ml-4 bg-black/40 border-white/20 text-white hover:bg-black/60 rounded-full w-12 h-12 p-0 backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>
      
      <div className="absolute inset-y-0 right-0 flex items-center">
        <Button
          onClick={handleNext}
          variant="outline"
          size="sm"
          className="mr-4 bg-black/40 border-white/20 text-white hover:bg-black/60 rounded-full w-12 h-12 p-0 backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 left-4 flex gap-2">
        <Badge className="bg-black/40 text-white border-white/20 backdrop-blur-sm">
          <ImageIcon className="w-3 h-3 mr-1" />
          {activeIndex + 1} of {images.length}
        </Badge>
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
        {isModal && (
          <>
            <Button
              onClick={() => setShowThumbnails(!showThumbnails)}
              variant="outline"
              size="sm"
              className="bg-black/40 border-white/20 text-white hover:bg-black/60 rounded-full w-10 h-10 p-0 backdrop-blur-sm"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
              variant="outline"
              size="sm"
              className="bg-black/40 border-white/20 text-white hover:bg-black/60 rounded-full w-10 h-10 p-0 backdrop-blur-sm"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => setZoom(Math.min(3, zoom + 0.2))}
              variant="outline"
              size="sm"
              className="bg-black/40 border-white/20 text-white hover:bg-black/60 rounded-full w-10 h-10 p-0 backdrop-blur-sm"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => setRotation(rotation + 90)}
              variant="outline"
              size="sm"
              className="bg-black/40 border-white/20 text-white hover:bg-black/60 rounded-full w-10 h-10 p-0 backdrop-blur-sm"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => setIsFullscreen(false)}
              variant="outline"
              size="sm"
              className="bg-black/40 border-white/20 text-white hover:bg-black/60 rounded-full w-10 h-10 p-0 backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        )}
        
        {!isModal && (
          <Button
            onClick={() => setIsFullscreen(true)}
            variant="outline"
            size="sm"
            className="bg-black/40 border-white/20 text-white hover:bg-black/60 rounded-full w-10 h-10 p-0 backdrop-blur-sm"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-white font-semibold text-sm">{modelName}</p>
            <p className="text-slate-300 text-xs">High-resolution gallery</p>
          </div>
          
          {isModal && (
            <Button
              onClick={resetView}
              variant="outline"
              size="sm"
              className="bg-black/40 border-white/20 text-white hover:bg-black/60 rounded-md px-3 backdrop-blur-sm"
            >
              Reset View
            </Button>
          )}
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex 
                ? 'bg-cyan-400 scale-125' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Card 
        className={`overflow-hidden ${className}`}
        style={{
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(17, 25, 39, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          boxShadow: '0 0 40px -10px rgba(0, 229, 255, 0.2)'
        }}
      >
        <GalleryContent />
      </Card>

      {/* Thumbnails */}
      {images.length > 1 && (
        <motion.div 
          className="mt-4 flex gap-2 overflow-x-auto pb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {images.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                index === activeIndex 
                  ? 'ring-2 ring-cyan-400 scale-105' 
                  : 'hover:scale-102 opacity-70 hover:opacity-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === activeIndex && (
                <div className="absolute inset-0 bg-cyan-400/20 border-2 border-cyan-400 rounded-lg" />
              )}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 bg-black z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex-1">
              <GalleryContent isModal={true} />
            </div>
            
            {/* Fullscreen Thumbnails */}
            {showThumbnails && images.length > 1 && (
              <motion.div 
                className="p-4 bg-black/80 backdrop-blur-sm border-t border-white/10"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
              >
                <div className="flex gap-2 justify-center overflow-x-auto max-w-full">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`relative flex-shrink-0 w-16 h-12 rounded-md overflow-hidden transition-all duration-300 ${
                        index === activeIndex 
                          ? 'ring-2 ring-cyan-400 opacity-100' 
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}