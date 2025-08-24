/**
 * NEO COMPARISON CTA: Call-to-action section for Neo package comparison
 * Links to dedicated Neo comparison page
 */

import Link from 'next/link';


interface NeoComparisonCallToActionProps {
  houseSlug: string;
  houseName: string;
}

export default function NeoComparisonCallToAction({ houseSlug, houseName }: NeoComparisonCallToActionProps) {
  return (
    <div className="bg-slate-600 max-w-7xl mx-auto  bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
     
      {/* Header with Package Options */}
      <div className="grid grid-cols-4">
        <div className="bg-slate-700 text-white text-center py-4 px-6">
          <h3 className="text-lg font-bold">Package Options</h3>
        </div>
        <div className="bg-slate-800 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">HERITAGE</h3>
        </div>
        <div className="bg-slate-900 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">HAVEN</h3>
        </div>
        <div className="bg-slate-950 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">LUXE</h3>
        </div>
      </div>

      {/* Call to Action Content */}
      <div className="p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Compare Package Features
          </h2>
          <p className="text-gray-900 mb-6 text-lg">
            See detailed specifications, included features, and upgrades for each {houseName} package. 
            Compare side-by-side to find the perfect fit for your needs and budget.
            <br />
            <span className="font-semibold text-purple-600">Neo dual color schemes available in all packages</span>
          </p>
          
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-400 p-4 rounded-lg">
              <div className="text-stone-600 font-semibold mb-2">Heritage Package</div>
              <div className="text-sm text-gray-600">
                Essential finishes with Neo white/dark options
              </div>
            </div>
            <div className="bg-slate-400 p-4 rounded-lg">
              <div className="text-stone-700 font-semibold mb-2">Haven Package</div>
              <div className="text-sm text-gray-600">
                Enhanced comfort with premium dual-color finishes
              </div>
            </div>
            <div className="bg-slate-400 p-4 rounded-lg">
              <div className="text-stone-800 font-semibold mb-2">Luxe Package</div>
              <div className="text-sm text-gray-600">
                Premium experience with top-tier dual-color options
              </div>
            </div>
          </div>

          {/* CTA Button - Neo specific URL */}
          <Link
            href={`/neo/${houseSlug}/comparison`}
            className="inline-flex items-center bg-gradient-to-r from-slate-700 to-indigo-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-h-[60px] min-w-[280px] justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
            Compare Neo Packages
          </Link>

          <p className="text-sm text-gray-500 mt-4">
            View Neo dual-color comparison • White & Dark schemes • Upgrade options
          </p>
        </div>
      </div>
    </div>
  );
}
