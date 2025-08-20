/**
 * UNIVERSAL TOUR LINKS
 * 🎯 Navigation links for both test and production 360° tours
 */

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { hasTour360 } from '../utils/universalAssets';

interface UniversalTourLinksProps {
  houseId: string;
  houseName: string;
  variant?: 'hero' | 'preview' | 'button';
}

export default function UniversalTourLinks({ 
  houseId, 
  houseName, 
  variant = 'button' 
}: UniversalTourLinksProps) {
  const [has360Tour, setHas360Tour] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkTour() {
      try {
        const tourAvailable = await hasTour360(houseId);
        setHas360Tour(tourAvailable);
        setLoading(false);
      } catch (error) {
        console.error('Failed to check 360° tour availability:', error);
        setLoading(false);
      }
    }
    
    checkTour();
  }, [houseId]);

  if (loading) {
    return (
      <div>
        {variant === 'hero' && (
          <div className="h-12 bg-gray-300 rounded w-32"></div>
        )}
        {variant === 'preview' && (
          <div className="h-64 bg-gray-300 rounded"></div>
        )}
        {variant === 'button' && (
          <div className="h-10 bg-gray-300 rounded w-24"></div>
        )}
      </div>
    );
  }

  if (!has360Tour) {
    return (
      <div className="text-gray-500 text-sm">
        360° tour not available for {houseName}
      </div>
    );
  }

  // Hero Section Style
  if (variant === 'hero') {
    return (
      <div className="flex space-x-4">
        <Link 
          href={`/houses/${houseId}/tour`}
          className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded-lg hover:bg-opacity-30 transition-all font-medium"
        >
          🌐 Virtual Tour
        </Link>
        <Link 
          href={`/houses/${houseId}/comparison`}
          className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded-lg hover:bg-opacity-30 transition-all font-medium"
        >
          📊 Compare Packages
        </Link>
      </div>
    );
  }

  // Preview Section Style
  if (variant === 'preview') {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Main 360° Preview */}
        <div 
          className="aspect-video rounded-lg overflow-hidden shadow-2xl relative group cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center"
        >
          <Link href={`/houses/${houseId}/tour`} className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white border-opacity-30 shadow-2xl mb-4">
                <div 
                  className="w-0 h-0 border-l-white border-t-transparent border-b-transparent ml-2" 
                  style={{
                    borderLeftWidth: '20px',
                    borderTopWidth: '12px',
                    borderBottomWidth: '12px'
                  }}
                ></div>
              </div>
              <h3 className="text-2xl font-bold mb-2">360° Virtual Tour</h3>
              <p className="text-lg opacity-90">Explore {houseName} in immersive 360°</p>
            </div>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <div className="flex justify-center space-x-4">
          <Link 
            href={`/houses/${houseId}/tour`}
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium shadow-lg"
          >
            🌐 Virtual Tour
          </Link>
          <Link 
            href={`/houses/${houseId}/comparison`}
            className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all font-medium shadow-lg"
          >
            📊 Compare Packages
          </Link>
        </div>
      </div>
    );
  }

  // Button Style (default)
  return (
    <Link 
      href={`/houses/${houseId}/tour`}
      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all text-sm font-medium"
    >
      🌐 Virtual Tour
    </Link>
  );
}
