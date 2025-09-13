'use client';
import { useParams, notFound } from 'next/navigation';
import { useHouse } from '../../../hooks/useHouses';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import VirtualTourPreviewUniversal from '@/components/VirtualTourPreviewUniversal';

// Note: server-only exports like `revalidate`/`dynamic` are not allowed in Client Components

export default function SkylineHousePage() {
  const params = useParams();
  const houseId = params?.slug as string;
  const { house, loading, error } = useHouse(houseId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white">Loading house details...</h2>
        </div>
      </div>
    );
  }

  if (error || !house) {
    notFound();
  }

  // Derive counts from availableRooms since House may not have bedrooms/bathrooms fields
  const availableRooms = Array.isArray(house.availableRooms) ? house.availableRooms : [];
  const bedroomCount = availableRooms.filter((r: string) => r === 'bedroom').length;
  const bathroomCount = availableRooms.filter((r: string) => r === 'bathroom').length;

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Skyline Collection', href: '/category/skyline' },
            { label: house.name, href: `/skyline/${house.id}` }
          ]}
        />
        
        <h1 className="text-4xl font-bold text-white mb-6 mt-8">{house.name}</h1>
        
        {/* Hero Section */}
        <section className="mb-16">
          <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
            <img 
              src={`/assets/skyline/${house.id}/hero.jpg`} 
              alt={house.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/assets/placeholder-house.jpg';
              }}
            />
          </div>
        </section>
        
        {/* 360° Virtual Tour */}
        <section className="mb-16 bg-gray-800 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">360° Virtual Tour</h2>
          <VirtualTourPreviewUniversal 
            houseId={house.id}
            houseName={house.name}
          />
        </section>
        
        {/* House Details */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">House Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {bedroomCount} Bedrooms
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {bathroomCount} Bathrooms
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
              <p className="text-gray-300">
                {house.description || `Experience the beauty and functionality of the ${house.name} model from our Skyline Collection. This modern house offers spacious living areas and premium finishes.`}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
