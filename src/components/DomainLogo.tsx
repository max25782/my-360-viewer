'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getLogoByDomain, getLogoAltByDomain } from '../utils/getLogoByDomain';

interface DomainLogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
}

/**
 * Domain-aware Logo component
 * Automatically selects the correct logo based on the current domain
 * Works in SSR, client-side, and PWA
 */
export function DomainLogo({ 
  width = 250, 
  height = 150, 
  className = 'h-30 w-auto',
  priority = false,
  alt
}: DomainLogoProps) {
  const [logoPath, setLogoPath] = useState('/Website.png');
  const [logoAlt, setLogoAlt] = useState('Logo');

  useEffect(() => {
    setLogoPath(getLogoByDomain());
    setLogoAlt(alt || getLogoAltByDomain());
  }, [alt]);

  return (
    <Image 
      src={logoPath} 
      alt={logoAlt} 
      width={width} 
      height={height}
      className={className}
      priority={priority}
    />
  );
}

/**
 * Simple logo component using img tag (for non-Next.js Image cases)
 */
export function DomainLogoImg({ 
  className = 'w-full h-full object-contain',
  alt
}: { className?: string; alt?: string }) {
  const [logoPath, setLogoPath] = useState('/Website.png');
  const [logoAlt, setLogoAlt] = useState('Logo');

  useEffect(() => {
    setLogoPath(getLogoByDomain());
    setLogoAlt(alt || getLogoAltByDomain());
  }, [alt]);

  return (
    <img 
      src={logoPath} 
      alt={logoAlt} 
      className={className}
    />
  );
}
