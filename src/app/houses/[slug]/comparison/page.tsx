/**
 * HOUSE COMPARISON PAGE
 * Shows detailed comparison table for the house
 */
'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useHouse } from '../../../../hooks/useHouses';
import JsonGoodBetterBestComparison from '../../../../components/JsonGoodBetterBestComparison';

export default function ComparisonPage() {
  const params = useParams();
  const houseId = params?.slug as string;
  const { house, loading, error } = useHouse(houseId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">Loading Comparison...</div>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !house) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-700 text-white py-8">
        <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{house.name} - Package Comparison</h1>
              <p className="text-blue-100 mt-2">Compare different finish packages for your home</p>
            </div>
            <Link
              href={`/houses/${house.id}`}
              className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
            >
              ← Back to {house.name}
            </Link>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-900">
        <JsonGoodBetterBestComparison house={house} />
      </div>

     
      
    </div>
  );
}