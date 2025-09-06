'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { PremiumHouse, getClientPremiumAssetPath } from '../../utils/clientPremiumAssets';

interface PremiumHousesListProps {
  houses: PremiumHouse[];
}

export default function PremiumHousesList({ houses: initialHouses }: PremiumHousesListProps) {
  const searchParams = useSearchParams();
  const [houses, setHouses] = useState<PremiumHouse[]>(initialHouses);
  
  // Фильтрация домов на основе searchParams
  useEffect(() => {
    let filteredHouses = [...initialHouses];
    
    // Фильтр по спальням
    const bedrooms = searchParams.get('bedrooms');
    if (bedrooms && bedrooms !== 'any') {
      filteredHouses = filteredHouses.filter(house => {
        // Проверяем прямые данные фильтров
        if (house.filters?.bedrooms) {
          return house.filters.bedrooms === bedrooms;
        }
        
        // Проверяем данные из comparison.features
        if (house.comparison?.features?.Bedrooms) {
          const bedroomFeature = house.comparison.features.Bedrooms.good;
          const match = bedroomFeature.match(/(\d+)/);
          if (match && match[1] === bedrooms) {
            return true;
          }
        }
        return false;
      });
    }
    
    // Фильтр по ванным комнатам
    const bathrooms = searchParams.get('bathrooms');
    if (bathrooms && bathrooms !== 'any') {
      filteredHouses = filteredHouses.filter(house => {
        // Проверяем прямые данные фильтров
        if (house.filters?.bathrooms) {
          return house.filters.bathrooms === bathrooms;
        }
        
        // Проверяем данные из comparison.features
        if (house.comparison?.features?.Bathrooms) {
          const bathroomFeature = house.comparison.features.Bathrooms.good;
          const match = bathroomFeature.match(/(\d+\.?\d*)/);
          if (match && match[1] === bathrooms) {
            return true;
          }
        }
        return false;
      });
    }
    
    // Фильтр по площади
    const sqftMin = searchParams.get('sqftMin');
    const sqftMax = searchParams.get('sqftMax');
    if (sqftMin || sqftMax) {
      const minSqft = sqftMin ? parseInt(sqftMin) : 0;
      const maxSqft = sqftMax ? parseInt(sqftMax) : Infinity;
      
      filteredHouses = filteredHouses.filter(house => {
        // Проверяем прямые данные фильтров
        if (house.filters?.sqft) {
          const sqft = parseInt(house.filters.sqft);
          return !isNaN(sqft) && sqft >= minSqft && sqft <= maxSqft;
        }
        
        // Проверяем данные из comparison.features
        if (house.comparison?.features?.['Living Space']) {
          const sqftFeature = house.comparison.features['Living Space'].good;
          const match = sqftFeature.match(/(\d+)/);
          if (match) {
            const sqft = parseInt(match[1]);
            return sqft >= minSqft && sqft <= maxSqft;
          }
        }
        return false;
      });
    }
    
    // Фильтр по стилю
    const style = searchParams.get('style');
    if (style && style !== 'any') {
      filteredHouses = filteredHouses.filter(house => {
        // Проверяем прямые данные фильтров
        if (house.filters?.style) {
          return house.filters.style === style;
        }
        return false;
      });
    }
    
    setHouses(filteredHouses);
  }, [initialHouses, searchParams]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {houses.length > 0 ? (
        houses.map((house) => {
          const heroPath = getClientPremiumAssetPath('hero', house.id, { format: 'jpg' });
          
          // Extract bedroom and bathroom counts
          let bedroomCount = "N/A";
          let bathroomCount = "N/A";
          let sqFt = "N/A";
          
          // Проверяем старый формат данных (объект с ключами)
          if (house.comparison?.features?.Bedrooms) {
            const match = house.comparison.features.Bedrooms.good.match(/(\d+)/);
            if (match) bedroomCount = match[1];
          }
          
          if (house.comparison?.features?.Bathrooms) {
            const match = house.comparison.features.Bathrooms.good.match(/(\d+\.?\d*)/);
            if (match) bathroomCount = match[1];
          }
          
          if (house.comparison?.features?.['Living Space']) {
            const match = house.comparison.features['Living Space'].good.match(/(\d+)/);
            if (match) sqFt = match[1];
          }
          
          // Проверяем новый формат данных (массив строк)
          if (Array.isArray(house.comparison?.features)) {
            // Ищем информацию о спальнях
            const bedroomFeature = house.comparison.features.find(
              feature => feature.includes('Bedroom') || feature.includes('Bedrooms')
            );
            if (bedroomFeature) {
              const match = bedroomFeature.match(/(\d+)\s*(Generously Sized)?\s*(Bedroom|Bedrooms)/i);
              if (match) bedroomCount = match[1];
            }
            
            // Ищем информацию о ванных комнатах
            const bathroomFeature = house.comparison.features.find(
              feature => feature.includes('Bathroom') || feature.includes('Bathrooms') || feature.includes(' Bath')
            );
            if (bathroomFeature) {
              const match = bathroomFeature.match(/(\d+\.?\d*)\s*(Full)?\s*(Bathroom|Bathrooms|Bath)/i);
              if (match) bathroomCount = match[1];
            }
            
            // Ищем информацию о площади
            const sqftFeature = house.comparison.features.find(
              feature => feature.includes('SF') || feature.includes('Square Feet') || feature.includes('Living Space')
            );
            if (sqftFeature) {
              const match = sqftFeature.match(/(\d+,?\d*)\s*SF/);
              if (match) sqFt = match[1].replace(',', '');
            }
          }
          
          return (
            <div key={house.id} className="bg-slate-700 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
              <Link href={`/premium/${house.id.toLowerCase()}`}>
                <div className="relative h-48">
                  <Image
                    src={heroPath}
                    alt={house.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white">{house.name}</h3>
                  <p className="text-gray-300 text-sm mt-1 line-clamp-2">{house.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-3 text-sm text-gray-200">
                      <span>{bedroomCount} BD</span>
                      <span>{bathroomCount} BA</span>
                      <span>{sqFt} SF</span>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium">View Details</span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })
      ) : (
        <div className="col-span-full text-center py-10">
          <h3 className="text-xl text-white mb-2">No houses match your filters</h3>
          <p className="text-gray-300">Try adjusting your filter criteria</p>
        </div>
      )}
    </div>
  );
}
