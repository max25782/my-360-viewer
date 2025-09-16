'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { publicUrl } from '../../utils/paths';
import { useHouseSpecs } from '../../hooks/useHouseSpecs';

interface NeoHouseCardProps {
  house: {
    id: string;
    name: string;
    description: string;
    squareFeet?: number;
    bedrooms?: number;
    bathrooms?: number;
    availableRooms?: string[];
    comparison?: any;
  };
}

export function NeoHouseCard({ house }: NeoHouseCardProps) {
  const { specs, isLoading } = useHouseSpecs(house.id, 'neo');

  return (
    <Link
      href={`/neo/${house.id}`}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 to-slate-900/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02] block"
    >
      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={publicUrl(`/assets/neo/${house.id}/hero.jpg`)}
          alt={house.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        
        {/* Collection Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-bold text-purple-100 bg-purple-600/80 backdrop-blur-sm rounded-full border border-purple-400/30">
            NEO
          </span>
        </div>

        {/* Floating Action */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {house.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {house.description}
        </p>
        
        <div className="flex flex-wrap justify-left gap-2 items-center text-sm text-gray-500">
          {/* Square Feet */}
          <span className="bg-gray-100 px-2 py-1 rounded-md">
            {isLoading ? '...' : (specs?.area || `${house.squareFeet || 'N/A'} sq.ft`)}
          </span>
          
          {/* Bedrooms */}
          <span className="bg-gray-100 px-2 py-1 rounded-md">
            {isLoading ? '...' : `${specs?.bedrooms || house.bedrooms || 1} ${(specs?.bedrooms || house.bedrooms || 1) === 1 ? 'Bedroom' : 'Bedrooms'}`}
          </span>
          
          {/* Bathrooms */}
          <span className="bg-gray-100 px-2 py-1 rounded-md">
            {isLoading ? '...' : `${specs?.bathrooms || house.bathrooms || 1} ${(specs?.bathrooms || house.bathrooms || 1) === 1 ? 'Bathroom' : 'Bathrooms'}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
