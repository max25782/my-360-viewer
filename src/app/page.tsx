'use client';

import Link from "next/link";
import { useHouses } from "../hooks/useHouses";
import Header from "../components/Header";
import Footer from "../components/Footer";


export default function Home() {
  const { houses, loading, error } = useHouses();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">Loading Houses...</div>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-4">Error loading houses</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-700 to-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Homes of the Future Today
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Explore our innovative home designs with interactive 360° tours. 
            Each home is created with attention to detail and modern technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#catalog" 
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-colors shadow-lg"
            >
              View Catalog
          </a>
          <a
              href="#virtual-tour" 
              className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              🎭 Virtual Tour
            </a>
          </div>
        </div>
      </section>

  

      {/* Houses Catalog */}
      <section id="catalog" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our House Models</h2>
            <p className="text-lg text-gray-600">
              Choose a home that perfectly fits your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {houses.map((house) => (
              <div key={house.id} className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div 
                  className="relative h-64"
                  style={{
                    backgroundImage: `url('${house.images.hero}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Virtual Tour Badge */}
                  {house.tour360 && house.tour360.rooms.length > 0 && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      🎭 360° Tour
                    </div>
                  )}
                  
                  {/* Rooms Count Badge */}
                  {/* <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {house.availableRooms.length} Rooms
                  </div> */}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{house.name}</h3>
                    <div className="text-right">
                     
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm">{house.description}</p>

                  {/* Available Rooms */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">Available Rooms:</div>
                    <div className="flex flex-wrap gap-1">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {house.availableRooms.filter(room => room === 'bedroom').length} Bedrooms
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {house.availableRooms.filter(room => room === 'bathroom').length} Bathrooms
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {house.availableRooms.filter(room => room === 'living').length} Living
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {house.availableRooms.filter(room => room === 'kitchen').length} Kitchen
                      </span>                      
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link 
                      href={`/houses/${house.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Details
                    </Link>
                    {house.tour360 && house.tour360.rooms.length > 0 && (
                      <Link 
                        href={`/houses/${house.id}/tour`}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-sm font-medium"
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
      </section>

      

      {/* Footer */}
      <Footer />
    </div>
  );
}