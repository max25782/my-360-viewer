/**
 * COMPARISON CTA: Call-to-action section for package comparison
 * Replaces the inline comparison table with a link to dedicated comparison page
 */

import Link from 'next/link';
import { House } from '../data/houses';

interface ComparisonCallToActionProps {
  house: House;
}

export default function ComparisonCallToAction({ house }: ComparisonCallToActionProps) {
  return (
    <div className="bg-slate-600 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
      {/* Header with Package Prices */}
      <div className="grid grid-cols-4">
        <div className="bg-slate-800 text-white text-center py-4 px-6">
          <h3 className="text-lg font-bold">Package Options</h3>
        </div>
        <div className="bg-slate-800 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">GOOD</h3>
          <p className="text-sm opacity-90">${house.priceRange.good.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">BETTER</h3>
          <p className="text-sm opacity-90">${house.priceRange.better.toLocaleString()}</p>
        </div>
        <div className="bg-slate-950 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">BEST</h3>
          <p className="text-sm opacity-90">${house.priceRange.best.toLocaleString()}</p>
        </div>
      </div>

      {/* Call to Action Content */}
      <div className="p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Compare Package Features
          </h2>
          <p className="text-gray-900 mb-6 text-lg">
            See detailed specifications, included features, and upgrades for each {house.name} package. 
            Compare side-by-side to find the perfect fit for your needs and budget.
          </p>
          
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-400 p-4 rounded-lg">
              <div className="text-stone-600 font-semibold mb-2">Essential Features</div>
              <div className="text-sm text-gray-600">
                Basic finishes, standard appliances, essential functionality
              </div>
            </div>
            <div className="bg-slate-400 p-4 rounded-lg">
              <div className="text-stone-700 font-semibold mb-2">Enhanced Comfort</div>
              <div className="text-sm text-gray-600">
                Upgraded finishes, better appliances, additional features
              </div>
            </div>
            <div className="bg-slate-400 p-4 rounded-lg">
              <div className="text-stone-800 font-semibold mb-2">Premium Experience</div>
              <div className="text-sm text-gray-600">
                Luxury finishes, premium appliances, all upgrades included
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href={`/houses/${house.id}/comparison`}
            className="inline-flex items-center bg-gradient-to-r from-slate-600 to-slate-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-slate-900 hover:to-slate-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-h-[60px] min-w-[280px] justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
            Compare All Packages
          </Link>

          <p className="text-sm text-gray-500 mt-4">
            View detailed feature comparison • Pricing breakdown • Upgrade options
          </p>
        </div>
      </div>
    </div>
  );
}
