'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { publicUrl } from '../../utils/paths';
import { HouseCard } from '../../types/houses';
import { SkylineHouseCard } from './SkylineHouseCard';

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
    
    // Filter by features
    const features = searchParams.get('features');
    if (features) {
      const selectedFeatures = features.split(',');
      if (selectedFeatures.length > 0) {
        filteredHouses = filteredHouses.filter(house => {
          // Define Skyline house features mapping
          const skylineFeaturesMap: Record<string, string[]> = {
            "loft": ["birch", "juniper"],
            "garage": ["cypress", "hemlock"],
            "office": ["laurel", "Oak"],
            "primary-suite": ["Walnut", "pine"],
            "kitchen-island": ["Walnut", "ponderosa", "sage"],
            "extra-storage": ["sapling", "spruce"],
            "covered-patio": ["Walnut", "tamarack"],
            "covered-porch": ["birch", "cypress"],
            "bonus-room": ["hemlock", "juniper"]
          };
          
          // Check if house has any of the selected features
          return selectedFeatures.some(feature => 
            skylineFeaturesMap[feature]?.includes(house.id)
          );
        });
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {houses.map((house) => (
          <SkylineHouseCard key={house.id} house={house} />
        ))}
      </div>
    </div>
  );
}
