import { House } from '../hooks/useHouses';
import Button from './Button';
import Image from 'next/image';

interface HeroSectionProps {
  house: House;
}

export default function HeroSection({ house }: HeroSectionProps) {
  const bedroomCount = house.availableRooms.filter(room => room === 'bedroom').length;
  const bathroomCount = house.availableRooms.filter(room => room === 'bathroom').length;
  const livingSpace = house.comparison?.features?.["Living Space"]?.good || "N/A";
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
                <h1 className="text-8xl font-bold text-white mb-4 drop-shadow-lg">
                  {house.name}
                </h1>
               
                
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center bg-gray bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
                    <span className="block text-3xl font-bold text-white">{bedroomCount}</span>
                    <span className="block text-sm text-gray-200">Rooms</span>
                  </div>
                  <div className="text-center bg-gray bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
                    <span className="block text-3xl font-bold text-white">{bathroomCount}</span>
                    <span className="block text-sm text-gray-200">Bathrooms</span>
                  </div>
                  <div className="text-center bg-gray bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
                    <span className="block text-3xl font-bold text-white">{livingSpace}</span>
                    <span className="block text-sm text-gray-200">Living Space</span>
                  </div>
                </div>
                <div className=" mb-8">
                  <div className="text-center bg-gray bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
                    <span className="block text-1xl font-bold text-white">{description}</span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    href={`/houses/${house.id}/tour`}
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