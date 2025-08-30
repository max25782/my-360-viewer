'use client';

import Image from 'next/image';
import { House } from '../hooks/useHouses';
import Button from './Button';

interface HeroSectionProps {
  house: House;
}

export default function HeroSection({ house }: HeroSectionProps) {
  // Проверяем наличие house и его images
  if (!house || !house.images || !house.images.hero) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-white">🏠</span>
          </div>
          <p className="text-gray-600">Loading house image...</p>
        </div>
      </div>
    );
  }

  // Для Neo домов берем данные из comparison
  let bedroomCount = 0;
  let bathroomCount = 0;
  let livingSpace = "N/A";
  
  if (house.category === 'neo' && house.comparison?.features) {
    // Используем регистронезависимый поиск ключа "Bedrooms"
    const bedroomsKey = Object.keys(house.comparison.features)
      .find(key => key.toLowerCase() === 'bedrooms');
    
    if (bedroomsKey) {
      const bedroomsData = house.comparison.features[bedroomsKey]?.good || '';
      
      if (bedroomsData.includes('1 Bedroom')) {
        bedroomCount = 1;
      } else if (bedroomsData.includes('2 Bedrooms')) {
        bedroomCount = 2;
      } else if (bedroomsData.includes('3 Bedrooms')) {
        bedroomCount = 3;
      } else {
        // Если не распознали формат, просто используем текст как есть
        bedroomCount = 0;
        return bedroomsData;
      }
    } else {
      // Если не нашли ключ, используем стандартный метод
      bedroomCount = house.availableRooms?.filter(room => 
        room.toLowerCase() === 'bedroom' || 
        room.toLowerCase() === 'bedroom2' || 
        room.toLowerCase().includes('bedroom')
      ).length || 0;
    }
    
    // Используем регистронезависимый поиск ключа "Bathrooms"
    const bathroomsKey = Object.keys(house.comparison.features)
      .find(key => key.toLowerCase() === 'bathrooms');
    
    if (bathroomsKey) {
      const bathroomsData = house.comparison.features[bathroomsKey]?.good || '';
      
      if (bathroomsData.includes('1 Bathroom')) {
        bathroomCount = 1;
      } else if (bathroomsData.includes('2 Bathrooms')) {
        bathroomCount = 2;
      } else if (bathroomsData.includes('3 Bathrooms')) {
        bathroomCount = 3;
      } else {
        // Если не распознали формат, просто используем текст как есть
        bathroomCount = 0;
        return bathroomsData;
      }
    } else {
      // Если не нашли ключ, используем стандартный метод
      bathroomCount = house.availableRooms?.filter(room => 
        room.toLowerCase() === 'bathroom' || 
        room.toLowerCase() === 'bathroom2' || 
        room.toLowerCase().includes('bathroom')
      ).length || 0;
    }
    
    // Используем регистронезависимый поиск ключа "Living Space"
    const livingSpaceKey = Object.keys(house.comparison.features)
      .find(key => key.toLowerCase() === 'living space');
    
    livingSpace = livingSpaceKey ? house.comparison.features[livingSpaceKey]?.good || "N/A" : "N/A";
  } else {
    // Для не-Neo домов используем стандартный метод
    bedroomCount = house.availableRooms?.filter(room => room === 'bedroom' || room === 'bedroom2').length || 0;
    bathroomCount = house.availableRooms?.filter(room => room === 'bathroom' || room === 'bathroom2').length || 0;
    livingSpace = house.comparison?.features?.["Living Space"]?.good || "N/A";
  }
  const description = house.description || "";
  
  return (
    <section className="bg-slate-700 bg-opacity-80 backdrop-blur-sm py-2">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="">
          <div 
            className="relative w-full h-screen rounded-lg overflow-hidden shadow-xl"
          >
            <Image
              src={house.images.hero}
              alt={`${house.name} exterior`}
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              quality={70}
              className="object-cover"
                             onError={(e) => {
                 console.error(`Failed to load hero image for ${house.name}:`, house.images.hero);
                 // Fallback to a default image
                 const target = e.target as HTMLImageElement;
                 target.src = '/assets/skyline/Birch/hero.webp'; // Fallback image с правильным регистром
               }}
            />
            {/* Overlay Content */}
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-8 transform -translate-y-1/2 max-w-lg">
                <h1 className="text-8xl font-bold text-slate-900 mb-4 drop-shadow-lg">
                  {house.name}
                </h1>
               
                
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center bg-slate-400 bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
                    <span className="block text-3xl font-bold text-slate-900">{bedroomCount}</span>
                    <span className="block text-sm text-gray-200">Rooms</span>
                  </div>
                  <div className="text-center bg-slate-400 bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
                    <span className="block text-3xl font-bold text-slate-900">{bathroomCount}</span>
                    <span className="block text-sm text-gray-200">Bathrooms</span>
                  </div>
                  <div className="text-center bg-slate-400 bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
                    <span className="block text-3xl font-bold text-slate-900">{livingSpace}</span>
                    <span className="block text-sm text-gray-200">Living Space</span>
                  </div>
                </div>
                <div className=" mb-8">
                  <div className="text-center bg-gray bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
                    <span className="block text-1xl font-bold text-slate-900">{description}</span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    href={house.category === 'neo' ? `/neo/${house.id}/tour` : `/houses/${house.id}/tour`}
                    variant="secondary"
                    size="lg"
                  >
                    Virtual Tour
                  </Button>
                  <Button 
                    variant="slate"
                    size="lg"
                  >
                    Get a Quote
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}