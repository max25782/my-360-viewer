'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import CategorySpecific360Viewer from '../CategorySpecific360Viewer';

interface Virtual360OverlayProps {
  isOpen: boolean;
  model: any | null;
  onClose: () => void;
}

export function Virtual360Overlay({ isOpen, model, onClose }: Virtual360OverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && model && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black"
        >
          <div className="relative w-full h-full">
            <CategorySpecific360Viewer
              category={(model.collection || 'skyline').toLowerCase() === 'premier' ? 'premium' : (model.collection || 'skyline')}
              slug={model.id || ''}
              name={model.name || ''}
              fullView={true}
            />

            <Button
              onClick={onClose}
              variant="outline"
              className="absolute top-4 right-4 z-50 text-white border-white bg-black/50 hover:bg-black/70"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


