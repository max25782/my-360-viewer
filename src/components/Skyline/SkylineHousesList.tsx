'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { publicUrl } from '../../utils/paths';
import { HouseCard } from '../../types/houses';

// Интерфейс для домов, получаемых с сервера
interface ServerSkylineHouse {
  id: string;
  name: string;
  description: string;
  availableRooms: string[];
  squareFeet?: number;
  bedrooms?: number;
  bathrooms?: number;
  comparison?: {
    features: Record<string, {
      good: string;
      better: string;
      best: string;
    }>;
  };
}

interface SkylineHousesListProps {
  houses: ServerSkylineHouse[];
}

export default function SkylineHousesList({ houses: allServerHouses }: SkylineHousesListProps) {
  const searchParams = useSearchParams();
  const [houses, setHouses] = useState<HouseCard[]>([]);
  
  // Конвертируем серверные дома в формат HouseCard
  const convertToHouseCard = useCallback((house: ServerSkylineHouse): HouseCard => {
    return {
      id: house.id,
      name: house.name,
      description: house.description,
      image: `/assets/skyline/${house.id}/hero.webp`,
      thumbnail: `/assets/skyline/${house.id}/hero.webp`,
      sqft: house.squareFeet,
      bedrooms: house.bedrooms || 1,
      bathrooms: house.bathrooms || 1,
      category: 'skyline',
      hasTour360: house.availableRooms && house.availableRooms.length > 0,
      hasDesignPackages: false
    };
  }, []);
  
  // Фильтрация домов на основе searchParams
  useEffect(() => {
    // Сначала конвертируем все дома в формат HouseCard
    const allHouses = allServerHouses.map(convertToHouseCard);
    
    let filteredHouses = [...allHouses];
    
    // Фильтр по спальням
    const bedrooms = searchParams.get('bedrooms');
    if (bedrooms && bedrooms !== 'any') {
      const bedroomCount = parseInt(bedrooms);
      if (!isNaN(bedroomCount)) {
        filteredHouses = filteredHouses.filter(house => (house.bedrooms ?? 0) === bedroomCount);
      }
    }
    
    // Фильтр по ванным комнатам
    const bathrooms = searchParams.get('bathrooms');
    if (bathrooms && bathrooms !== 'any') {
      const bathroomCount = parseFloat(bathrooms);
      if (!isNaN(bathroomCount)) {
        filteredHouses = filteredHouses.filter(house => (house.bathrooms ?? 0) === bathroomCount);
      }
    }
    
    // Фильтр по площади
    const sqftMin = searchParams.get('sqftMin');
    const sqftMax = searchParams.get('sqftMax');
    if (sqftMin || sqftMax) {
      const minSqft = sqftMin ? parseInt(sqftMin) : 0;
      const maxSqft = sqftMax ? parseInt(sqftMax) : Infinity;
      
      if (!isNaN(minSqft) && !isNaN(maxSqft)) {
        filteredHouses = filteredHouses.filter(house => 
          (house.sqft ?? 0) >= minSqft && (house.sqft ?? 0) <= maxSqft
        );
      }
    }
    
    setHouses(filteredHouses);
  }, [allServerHouses, searchParams, convertToHouseCard]);

  if (houses.length === 0) {
    return (
      <div className="text-center text-white py-12">
        <div className="text-6xl mb-4">🏗️</div>
        <div className="text-xl mb-4">No Houses Match Your Filters</div>
        <div className="text-gray-300">
          Try adjusting your filter criteria to see more houses.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">Skyline Collection</h2>
      <div className="grid grid-cols-1 bg-slate-800 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {houses.map((house) => (
          <div key={house.id} className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300 hover:transform hover:scale-105">
            {/* House Image */}
            <div className="aspect-video relative">
              <Image
                src={publicUrl(house.image || house.thumbnail || '/assets/placeholder.jpg')}
                alt={house.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {house.hasTour360 && (
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    🎭 360° Tour
                  </div>
                )}
                {house.hasDesignPackages && (
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Design Options
                  </div>
                )}
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
                    {house.bedrooms || 1} BR
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded">
                    {house.bathrooms || 1} BA
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded">
                    {house.sqft?.toLocaleString() || '1,200'} sq ft
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
        ))}
      </div>
    </div>
  );
}
