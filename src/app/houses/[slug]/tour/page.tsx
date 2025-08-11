import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getHouse, HOUSES } from '../../../../data/houses';
import PanoramaViewer from '@/components/PanoramaViewer';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return HOUSES.map((house) => ({
    slug: house.id,
  }));
}

export default async function HouseTourPage({ params }: PageProps) {
  const resolvedParams = await params;
  const house = getHouse(resolvedParams.slug);
  
  if (!house) {
    notFound();
  }

  if (!house.tour360Available) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">360° Tour Unavailable</h1>
          <p className="text-gray-600 mb-6">Virtual tour for this house is not yet ready.</p>
          <Link 
            href={`/houses/${house.id}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to House Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Tour Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-black bg-opacity-50 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/houses/${house.id}`}
                className="text-white hover:text-gray-300 transition-colors"
              >
                ← Back to Details
              </Link>
              <div className="border-l border-gray-600 pl-4">
                <h1 className="text-lg font-semibold">{house.name} - Virtual Tour</h1>
                <p className="text-sm text-gray-300">{house.sqft} sq. ft. • {house.bedrooms} bedrooms • {house.bathrooms} bathrooms</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <Image 
                  src="/Website.png" 
                  alt="Seattle ADU Logo" 
                  width={100} 
                  height={32}
                  className="h-8 w-auto brightness-0 invert"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Tour Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-black bg-opacity-50 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-300">Rooms:</span>
                <span className="ml-2 text-white font-medium">Entry • Kitchen • Bedroom • Bathroom • Living Room</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                📱 VR Mode
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm">
                📞 Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 360° Viewer */}
      <div className="h-screen w-full">
        <PanoramaViewer houseId={house.id} />
      </div>

      {/* Tour Info Panel */}
      <div className="absolute top-20 right-4 w-80 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-6 z-40">
        <h3 className="text-lg font-bold text-gray-900 mb-3">{house.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{house.description}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center">
            <span className="block text-xl font-bold text-blue-600">{house.sqft}</span>
            <span className="text-xs text-gray-500">sq. ft.</span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-bold text-blue-600">{house.bedrooms}</span>
            <span className="text-xs text-gray-500">bedrooms</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-3">
            💡 <strong>Tip:</strong> Use mouse to look around, click on navigation points to move between rooms
          </p>
          
          <div className="space-y-2">
            <Link 
              href={`/houses/${house.id}`}
              className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              📋 Detailed Information
            </Link>
            <button className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors">
              📞 Get Quote
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden absolute top-16 left-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-4 z-40">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900">{house.name}</h3>
            <p className="text-sm text-gray-600">{house.sqft} sq. ft.</p>
          </div>
          <div className="flex space-x-2">
            <Link 
              href={`/houses/${house.id}`}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm"
            >
              Info
            </Link>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
              Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
