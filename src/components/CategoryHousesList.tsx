'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { HouseCategory } from '../types/houses';
import { useHousesByCategory } from '../hooks/useHousesByCategory';
import { publicUrl } from '../utils/paths';

interface CategoryHousesListProps {
  category: HouseCategory;
  title?: string;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function CategoryHousesList({ category, title, searchParams = {} }: CategoryHousesListProps) {
  const { houses: allHouses, loading, error } = useHousesByCategory(category);
  
  // Фильтрация домов на основе searchParams
  const houses = React.useMemo(() => {
    if (!allHouses || allHouses.length === 0 || !searchParams) return allHouses;
    
    let filteredHouses = [...allHouses];
    
    // Фильтр по спальням
    const bedrooms = searchParams.bedrooms as string;
    if (bedrooms && bedrooms !== 'any') {
      const bedroomCount = parseInt(bedrooms);
      if (!isNaN(bedroomCount)) {
        filteredHouses = filteredHouses.filter(house => (house.bedrooms ?? 0) === bedroomCount);
      }
    }
    
    // Фильтр по ванным комнатам
    const bathrooms = searchParams.bathrooms as string;
    if (bathrooms && bathrooms !== 'any') {
      const bathroomCount = parseFloat(bathrooms);
      if (!isNaN(bathroomCount)) {
        filteredHouses = filteredHouses.filter(house => (house.bathrooms ?? 0) === bathroomCount);
      }
    }
    
    // Фильтр по площади
    const sqftMin = searchParams.sqftMin as string;
    const sqftMax = searchParams.sqftMax as string;
    if (sqftMin || sqftMax) {
      const minSqft = sqftMin ? parseInt(sqftMin) : 0;
      const maxSqft = sqftMax ? parseInt(sqftMax) : Infinity;
      
      if (!isNaN(minSqft) && !isNaN(maxSqft)) {
        filteredHouses = filteredHouses.filter(house => 
          (house.sqft ?? 0) >= minSqft && (house.sqft ?? 0) <= maxSqft
        );
      }
    }
    
    // Фильтр по особенностям (features)
    const features = searchParams.features as string;
    if (features) {
      const selectedFeatures = features.split(',');
      if (selectedFeatures.length > 0) {
        filteredHouses = filteredHouses.filter(house => {
          // Простая проверка наличия особенностей
          // В реальном приложении здесь будет более сложная логика
          return selectedFeatures.some(feature => 
            house.description?.toLowerCase().includes(feature.toLowerCase())
          );
        });
      }
    }
    
    return filteredHouses;
  }, [allHouses, searchParams]);

  // Добавляем отладочную информацию
  console.log(`CategoryHousesList: category=${category}, houses.length=${houses?.length || 0}, loading=${loading}, error=${error}`);
  console.log('SearchParams:', searchParams);
  console.log('Filtered Houses:', houses);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="bg-white/10 rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-300"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-300 rounded flex-1"></div>
                <div className="h-8 bg-gray-300 rounded flex-1"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-white py-12">
        <div className="text-xl mb-4">Error loading houses</div>
        <div className="text-gray-300">{error}</div>
      </div>
    );
  }

  if (houses.length === 0) {
    const categoryNames = {
      skyline: 'Skyline Collection',
      neo: 'Neo ADU Series', 
      modern: 'Premium Collection',
      A: 'Skyline Collection',
      B: 'Neo ADU Series',
      C: 'Premium Collection'
    };
    
    const categoryName = title || categoryNames[category] || `Category ${category}`;
    
    return (
      <div className="text-center text-white py-12">
        <div className="text-6xl mb-4">🏗️</div>
        <div className="text-xl mb-4">Houses Coming Soon</div>
        <div className="text-gray-300">
          We're preparing amazing houses for the {categoryName}.
          <br />
          Check back soon for new additions!
        </div>
      </div>
    );
  }

  // Добавляем заголовок категории, если он передан
  const displayTitle = title || `${category.charAt(0).toUpperCase() + category.slice(1)} Houses`;

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">{displayTitle}</h2>
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
