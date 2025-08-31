'use client';

import { useEffect, useState } from 'react';

interface FastLCPPlaceholderProps {
  className?: string;
}

export default function FastLCPPlaceholder({ className = '' }: FastLCPPlaceholderProps) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Hide placeholder after content is loaded
    const timer = setTimeout(() => {
      setVisible(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!visible) return null;
  
  return (
    <div 
      className={`absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center ${className}`}
      style={{ zIndex: 5 }}
    >
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
