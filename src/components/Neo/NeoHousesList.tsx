'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface NeoHouse {
  id: string;
  name: string;
  description: string;
  maxDP: number;
  maxPK: number;
  availableRooms: string[];
  squareFeet?: number;
  tour360?: {
    white?: { rooms?: string[] };
    dark?: { rooms?: string[] };
  };
  comparison?: {
    features?: {
      [key: string]: {
        good: string;
        better: string;
        best: string;
      }
    }
  };
}

interface NeoHousesListProps {
  houses: NeoHouse[];
}

export default function NeoHousesList({ houses }: NeoHousesListProps) {
  const searchParams = useSearchParams();
  const [filteredHouses, setFilteredHouses] = useState<NeoHouse[]>(houses);
  
  // Фильтрация домов на основе searchParams
  useEffect(() => {
    let result = [...houses];
    
    // Фильтр по спальням
    const bedrooms = searchParams.get('bedrooms');
    if (bedrooms && bedrooms !== 'any') {
      const bedroomCount = parseInt(bedrooms);
      if (!isNaN(bedroomCount)) {
        result = result.filter(house => {
          // Проверяем данные из описания дома
          const description = house.description || '';
          const descriptionMatch = description.match(/(\d+)\s+bedrooms?/i);
          if (descriptionMatch && descriptionMatch[1]) {
            const count = parseInt(descriptionMatch[1]);
            if (!isNaN(count)) {
              return count === bedroomCount;
            }
          }
          
          // Проверяем данные из comparison.features
          if (house.comparison?.features) {
            // Ищем ключ "Bedrooms" независимо от регистра
            const bedroomsKey = Object.keys(house.comparison.features)
              .find(key => key.toLowerCase() === 'bedrooms');
            
            if (bedroomsKey) {
              const bedroomsData = house.comparison.features[bedroomsKey]?.good || '';
              // Извлекаем число из строки, например "2 Bedrooms" -> 2
              const match = bedroomsData.match(/(\d+)/);
              if (match && match[1]) {
                const count = parseInt(match[1]);
                if (!isNaN(count)) {
                  return count === bedroomCount;
                }
              }
            }
          }
          
          // Fallback: подсчет из availableRooms
          const houseBedroomCount = house.availableRooms.filter(room => 
            room.toLowerCase() === 'bedroom' || 
            room.toLowerCase() === 'bedroom2' || 
            room.toLowerCase().includes('bedroom')
          ).length;
          return houseBedroomCount === bedroomCount;
        });
      }
    }
    
    // Фильтр по ванным комнатам
    const bathrooms = searchParams.get('bathrooms');
    if (bathrooms && bathrooms !== 'any') {
      const bathroomCount = parseInt(bathrooms);
      if (!isNaN(bathroomCount)) {
        result = result.filter(house => {
          // Сначала проверяем данные из comparison.features
          if (house.comparison?.features) {
            // Ищем ключ "Bathrooms" независимо от регистра
            const bathroomsKey = Object.keys(house.comparison.features)
              .find(key => key.toLowerCase() === 'bathrooms');
            
            if (bathroomsKey) {
              const bathroomsData = house.comparison.features[bathroomsKey]?.good || '';
              // Извлекаем число из строки, например "2 Bathrooms" -> 2
              const match = bathroomsData.match(/(\d+)/);
              if (match && match[1]) {
                const count = parseInt(match[1]);
                if (!isNaN(count)) {
                  return count === bathroomCount;
                }
              }
            }
          }
          
          // Проверяем данные из описания дома
          const description = house.description || '';
          const descriptionMatch = description.match(/(\d+)\s+bathrooms?/i);
          if (descriptionMatch && descriptionMatch[1]) {
            const count = parseInt(descriptionMatch[1]);
            if (!isNaN(count)) {
              return count === bathroomCount;
            }
          }
          
          // Fallback: подсчет из availableRooms или tour360.dark.rooms
          const houseBathroomCount = house.tour360?.dark?.rooms?.filter(
            (room: string) => room === 'bathroom' || room === 'bathroom2' || room.toLowerCase().includes('bathroom')
          )?.length || house.availableRooms.filter(room => 
            room.toLowerCase() === 'bathroom' || 
            room.toLowerCase() === 'bathroom2' || 
            room.toLowerCase().includes('bathroom')
          ).length;
          return houseBathroomCount === bathroomCount;
        });
      }
    }
    
    // Фильтр по площади
    const sqftMin = searchParams.get('sqftMin');
    const sqftMax = searchParams.get('sqftMax');
    if (sqftMin || sqftMax) {
      const minSqft = sqftMin ? parseInt(sqftMin) : 0;
      const maxSqft = sqftMax ? parseInt(sqftMax) : 10000;
      
      if (!isNaN(minSqft) && !isNaN(maxSqft)) {
        result = result.filter(house => {
          // Проверяем данные из comparison.features для Living Space
          if (house.comparison?.features) {
            const livingSpaceKey = Object.keys(house.comparison.features)
              .find(key => key.toLowerCase().includes('living space') || key.toLowerCase().includes('square'));
            
            if (livingSpaceKey) {
              const livingSpaceData = house.comparison.features[livingSpaceKey]?.good || '';
              // Извлекаем число из строки, например "1008 SF" -> 1008
              const match = livingSpaceData.match(/(\d+)/);
              if (match && match[1]) {
                const sqft = parseInt(match[1]);
                if (!isNaN(sqft)) {
                  return sqft >= minSqft && sqft <= maxSqft;
                }
              }
            }
          }
          
          // Проверяем данные из описания дома
          const description = house.description || '';
          const sqftMatch = description.match(/(\d+(?:,\d+)?)\s*(?:square\s*feet|sq\.?\s*ft)/i);
          if (sqftMatch && sqftMatch[1]) {
            const sqft = parseInt(sqftMatch[1].replace(',', ''));
            if (!isNaN(sqft)) {
              return sqft >= minSqft && sqft <= maxSqft;
            }
          }
          
          // Fallback к свойству squareFeet
          if (house.squareFeet) {
            return house.squareFeet >= minSqft && house.squareFeet <= maxSqft;
          }
          
          return true; // Включаем дома без данных о площади
        });
      }
    }
    
    // Фильтр по особенностям (features)
    const features = searchParams.get('features');
    if (features) {
      const selectedFeatures = features.split(',');
      if (selectedFeatures.length > 0) {
        result = result.filter(house => {
          // Define predefined features mapping - which houses have which features
          const predefinedFeaturesMap: Record<string, string[]> = {
            "Loft": ["Apex", "Elementa", "Forma"],
            "Garage": ["Apex", "Arcos"],
            "Office": ["HorizonX", "Forma"],
            "Primary Suite": ["Apex", "Elementa"],
            "Kitchen Island": ["Apex", "Arcos", "Elementa", "Forma", "Halo"],
            "Extra Storage": ["Apex", "Elementa", "Forma"],
            "Covered Patio": ["Apex", "Arcos"],
            "Covered Porch": ["Elementa", "Halo"],
            "Bonus Room": ["Apex", "Forma"]
          };
          
          // Check predefined features first
          for (const feature of selectedFeatures) {
            if (predefinedFeaturesMap[feature]?.includes(house.id)) {
              return true;
            }
          }
          
          // Then check comparison features if available
          if (house.comparison?.features) {
            const houseFeatures = Object.keys(house.comparison.features);
            if (selectedFeatures.some(feature => houseFeatures.includes(feature))) {
              return true;
            }
          }
          
          return false;
        });
      }
    }
    
    setFilteredHouses(result);
  }, [houses, searchParams]);

  return (
    <>
      {filteredHouses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHouses.map((house) => (
            <Link 
              key={house.id}
              href={`/neo/${house.id.charAt(0).toUpperCase() + house.id.slice(1)}`}
              className="group bg-slate-400 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-64 bg-slate-700">
                {/* Placeholder for hero image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mx-auto mb-1 flex items-center justify-center">
                      <Image 
                         src={`/assets/neo/${house.id.startsWith('neo-') ? house.id.substring(4) : house.id}/hero.jpg`} 
  alt={house.name} 
  width={500} 
                          height={500} 
                        />
                    </div>
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
                  {house.squareFeet && (
                    <span className="bg-gray-100 px-2 py-1 rounded-md">{house.squareFeet} sq.ft</span>
                  )}
                  <span className="bg-gray-100 px-2 py-1 rounded-md">
                    {(() => {
                      // Проверяем данные из описания дома
                      const description = house.description || '';
                      const bedroomMatch = description.match(/(\d+)\s+bedrooms?/i);
                      if (bedroomMatch && bedroomMatch[1]) {
                        const count = parseInt(bedroomMatch[1]);
                        if (!isNaN(count)) {
                          return `${count} ${count === 1 ? 'Bedroom' : 'Bedrooms'}`;
                        }
                      }
                      
                      // Ищем ключ "Bedrooms" независимо от регистра
                      if (house.comparison?.features) {
                        const keys = Object.keys(house.comparison.features);
                        for (const key of keys) {
                          if (key.toLowerCase() === 'bedrooms') {
                            const value = house.comparison.features[key]?.good;
                            if (value) return value;
                          }
                        }
                      }
                      
                      // Fallback к подсчету из availableRooms
                      const bedroomCount = house.availableRooms?.filter((room: string) => 
                        room.toLowerCase() === 'bedroom' || 
                        room.toLowerCase() === 'bedroom2' || 
                        room.toLowerCase().includes('bedroom')
                      )?.length || 0;
                      return `${bedroomCount} ${bedroomCount === 1 ? 'Bedroom' : 'Bedrooms'}`;
                    })()}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded-md">
                    {(() => {
                      // Проверяем данные из описания дома
                      const description = house.description || '';
                      const bathroomMatch = description.match(/(\d+)\s+bathrooms?/i);
                      if (bathroomMatch && bathroomMatch[1]) {
                        const count = parseInt(bathroomMatch[1]);
                        if (!isNaN(count)) {
                          return `${count} ${count === 1 ? 'Bathroom' : 'Bathrooms'}`;
                        }
                      }
                      
                      // Ищем ключ "Bathrooms" независимо от регистра
                      if (house.comparison?.features) {
                        const keys = Object.keys(house.comparison.features);
                        for (const key of keys) {
                          if (key.toLowerCase() === 'bathrooms') {
                            const value = house.comparison.features[key]?.good;
                            if (value) return value;
                          }
                        }
                      }
                      
                      // Fallback к подсчету из availableRooms
                      const bathroomCount = house.availableRooms?.filter((room: string) => 
                        room.toLowerCase() === 'bathroom' || 
                        room.toLowerCase() === 'bathroom2' || 
                        room.toLowerCase().includes('bathroom')
                      )?.length || 0;
                      return `${bathroomCount} ${bathroomCount === 1 ? 'Bathroom' : 'Bathrooms'}`;
                    })()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No houses match your filters
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Try adjusting your filter criteria to see more options.
          </p>
        </div>
      )}
    </>
  );
}
