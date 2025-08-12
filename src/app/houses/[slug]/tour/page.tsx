import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getHouse, HOUSES } from '../../../../data/houses';
import PanoramaViewer from '@/components/PanoramaViewer';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
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
    <div className="min-h-screen bg-black relative">
      {/* Simple Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Link 
          href={`/houses/${house.id}`}
          className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm border border-white border-opacity-20 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back</span>
        </Link>
      </div>

      {/* 360° Viewer - Full Screen */}
      <div className="h-screen w-full">
        <PanoramaViewer houseId={house.id} />
      </div>
    </div>
  );
}
