'use client';

import React from 'react';

interface BackgroundProps {
  isDark: boolean;
}

export function Background({ isDark }: BackgroundProps) {
  return (
    <div
      className="fixed inset-0 transition-all duration-1000"
      style={{
        background: isDark
          ? `
            radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.12) 0%, transparent 50%),
            linear-gradient(135deg, #020617 0%, #0f172a 25%, #1e293b 50%, #334155 75%, #475569 100%)
          `
          : `
            radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.06) 0%, transparent 50%),
            linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)
          `
      }}
    />
  );
}


