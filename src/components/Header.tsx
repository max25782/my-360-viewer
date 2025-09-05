'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface HeaderProps {
  variant?: 'default' | 'transparent';
  className?: string;
}

export default function Header({ variant = 'default', className = '' }: HeaderProps) {
  const baseClasses = variant === 'transparent' 
    ? 'bg-slate-400 bg-opacity-90 backdrop-blur-sm shadow-sm'
    : 'bg-slate-500 bg-opacity-90 backdrop-blur-sm shadow-sm';
  
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);

  return (
    <header className={`${baseClasses} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/Website.png" 
                alt="Seattle ADU Logo" 
                width={250} 
                height={150}
                className="h-30 w-auto"
                priority
              />
            </Link>
          </div>
          <nav className="hidden md:flex text-2xl space-x-8">
            {/* ADU Catalog с выпадающим меню */}
            <div className="relative">
              <button 
                className="text-gray-900 hover:text-gray-900 font-bold flex items-center"
                onClick={() => setShowCatalogDropdown(!showCatalogDropdown)}
                onMouseEnter={() => setShowCatalogDropdown(true)}
                onMouseLeave={() => setShowCatalogDropdown(false)}
              >
                ADU Catalog
                <svg 
                  className="ml-1 w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </button>
              
              {/* Выпадающее меню */}
              {showCatalogDropdown && (
                <div 
                  className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                  onMouseEnter={() => setShowCatalogDropdown(true)}
                  onMouseLeave={() => setShowCatalogDropdown(false)}
                >
                  <Link 
                    href="/" 
                    className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowCatalogDropdown(false)}
                  >
                    All Collections
                  </Link>
                  <Link 
                    href="/category/skyline" 
                    className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowCatalogDropdown(false)}
                  >
                    Skyline Collection
                  </Link>
                  <Link 
                    href="/neo" 
                    className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowCatalogDropdown(false)}
                  >
                    Neo ADU Series
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="/premium" className="text-gray-900 hover:text-gray-900 font-bold">Premium</Link>
            <a href="#about" className="text-gray-900 hover:text-gray-900 font-bold">About</a>
            <a href="#contact" className="text-gray-900 hover:text-gray-900 font-bold">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
