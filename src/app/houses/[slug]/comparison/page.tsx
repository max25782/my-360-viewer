/**
 * COMPARISON PAGE: Dedicated page for GoodBetterBest comparison
 * Shows detailed comparison table for the house
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { HOUSES } from '../../../../data/houses';
import JsonGoodBetterBestComparison from '../../../../components/JsonGoodBetterBestComparison';

interface ComparisonPageProps {
  params: {
    slug: string;
  };
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const house = HOUSES.find(h => h.id === params.slug);

  if (!house) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 to-slate-900">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href={`/houses/${house.id}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-2"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to {house.name}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                {house.name} Package Comparison
              </h1>
              <p className="text-gray-600 mt-1">
                Compare our Good, Better, and Best packages for {house.name}
              </p>
            </div>
            
            {/* Price Summary */}
            <div className="hidden md:flex space-x-4">
              <div className="text-center">
                <div className="text-sm text-gray-500">Good</div>
                <div className="text-lg font-bold text-stone-600">
                  ${house.priceRange.good.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Better</div>
                <div className="text-lg font-bold text-stone-700">
                  ${house.priceRange.better.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Best</div>
                <div className="text-lg font-bold text-stone-800">
                  ${house.priceRange.best.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Comparison */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-900">Package Comparison Guide</h3>
                <p className="text-blue-700 mt-1">
                  Each package includes everything from the previous tier plus additional features and upgrades. 
                  Compare the details below to find the perfect fit for your needs and budget.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* JSON-Driven Comparison Table */}
        <JsonGoodBetterBestComparison house={house} />

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-6">
            Contact us to discuss your {house.name} package options and get a personalized quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/houses/${house.id}`}
              className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View House Details
            </Link>
            <Link
              href={`/houses/${house.id}/tour`}
              className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition-colors"
            >
              Take 360° Tour
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
