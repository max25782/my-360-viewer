'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { publicUrl } from '../../utils/paths';
import { useHouseSpecs } from '../../hooks/useHouseSpecs';

interface SkylineHouseCardProps {
  house: {
    id: string;
    name: string;
    description: string;
    bedrooms?: number;
    bathrooms?: number;
    sqft?: number;
    hasTour360?: boolean;
  };
}

export function SkylineHouseCard({ house }: SkylineHouseCardProps) {
  const { specs, isLoading } = useHouseSpecs(house.id, 'skyline');

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02]">
      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={publicUrl(`/assets/skyline/${house.id}/hero.jpg`)}
          alt={house.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        
        {/* Collection Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-bold text-blue-100 bg-blue-600/80 backdrop-blur-sm rounded-full border border-blue-400/30">
            SKYLINE
          </span>
        </div>
      </div>

      {/* House Info */}
      <div className="p-6 text-white">
        <h3 className="text-xl font-bold mb-2">{house.name}</h3>
        <p className="text-gray-300 mb-4 text-sm line-clamp-2">{house.description}</p>
        
        {/* Stats */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex space-x-4">
            <span className="bg-white/20 px-2 py-1 rounded">
              {isLoading ? '...' : `${specs?.bedrooms || house.bedrooms || 1} BR`}
            </span>
            <span className="bg-white/20 px-2 py-1 rounded">
              {isLoading ? '...' : `${specs?.bathrooms || house.bathrooms || 1} BA`}
            </span>
            <span className="bg-white/20 px-2 py-1 rounded">
              {isLoading ? '...' : (specs?.area || `${house.sqft?.toLocaleString() || '1,200'} sq ft`)}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link 
            href={`/houses/${house.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            View Details
          </Link>
          {house.hasTour360 && (
            <Link 
              href={`/houses/${house.id}/tour`}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-all"
            >
              🎭 Tour
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
