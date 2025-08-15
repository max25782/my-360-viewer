import Link from 'next/link';
import { House } from '../data/houses';

interface ExploreModelsProps {
  currentHouse: House;
  allHouses: House[];
}

export default function ExploreModels({ currentHouse, allHouses }: ExploreModelsProps) {
  const otherHouses = allHouses.filter(h => h.id !== currentHouse.id).slice(0, 5);

  return (
    <section className="py-16 bg-white bg-opacity-80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Legacy ADUs</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherHouses.map((house) => (
            <Link key={house.id} href={`/houses/${house.id}`} className="group">
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏠</div>
                      <div className="text-sm font-medium">{house.name}</div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{house.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>{house.sqft} Sq. Ft.</div>
                    <div>{house.bedrooms} Bedrooms</div>
                    <div>{house.bathrooms} Bathrooms</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
