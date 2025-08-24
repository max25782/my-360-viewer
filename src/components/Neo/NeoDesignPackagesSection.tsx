'use client';

import React from 'react';
import { NeoHouse } from '../../hooks/useNeoHouse';

interface NeoDesignPackagesSectionProps {
  house: NeoHouse;
}

export default function NeoDesignPackagesSection({ house }: NeoDesignPackagesSectionProps) {
  const designPackages = [
    {
      id: 'black',
      name: 'Black',
    
      whitePreview: '/assets/neo/texrure/thumb-white.jpg',
      blackPreview: '/assets/neo/texrure/thumb-black.jpg',
      features: ['Standard finishes', 'Basic lighting', 'Essential fixtures']
    },
    {
      id: 'white',
      name: 'White',
      whitePreview: '/assets/neo/texrure/thumb-white.jpg',
      blackPreview: '/assets/neo/texrure/thumb-black.jpg',
      features: ['Premium finishes', 'Enhanced lighting', 'Designer fixtures']
    }

  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Neo Design Packages
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Each design package is carefully coordinated for both white and dark color schemes, 
            ensuring perfect harmony in your chosen aesthetic.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {designPackages.map((pkg, index) => (
            <div 
              key={pkg.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Dual Color Preview */}
              <div className="relative h-48">
                <div className="absolute inset-0 flex">
                  {/* White Scheme Half */}
                  <div className="w-1/2 relative">
                    <img 
                      src={pkg.whitePreview}
                      alt={`${pkg.name} White Scheme`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded-full shadow-sm"></div>
                    </div>
                  </div>
                  
                  {/* Dark Scheme Half */}
                  <div className="w-1/2 relative">
                    <img 
                      src={pkg.blackPreview}
                      alt={`${pkg.name} Dark Scheme`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="w-4 h-4 bg-gray-900 border-2 border-gray-600 rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>

                {/* Package Badge */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Package {index + 1}
                  </div>
                </div>
              </div>

              {/* Package Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {pkg.name}
                </h3>
              

                {/* Features */}
                <ul className="space-y-1 mb-4">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="text-xs text-gray-500 flex items-center">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Coming Soon Badge */}
                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Dual Color Coordination
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every Neo design package is meticulously planned to work seamlessly with both white and dark color schemes. 
              Materials, finishes, and fixtures are selected to create cohesive experiences regardless of your color preference.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
