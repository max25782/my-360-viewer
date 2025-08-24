'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface NeoColorSelectorProps {
  onColorSelected: (color: 'white' | 'dark') => void;
  onCancel: () => void;
  houseName?: string;
}

export default function NeoColorSelector({ 
  onColorSelected, 
  onCancel,
  houseName = "Neo House"
}: NeoColorSelectorProps) {
  const [selectedPreview, setSelectedPreview] = useState<'white' | 'dark' | null>(null);

  const colorOptions = [
    {
      id: 'white' as const,
      name: 'White Scheme',
      description: 'Clean, bright, modern interiors with crisp white finishes',
      thumbnail: '/assets/neo/texrure/thumb-white.jpg',
      gradient: 'from-slate-50 to-white',
      textColor: 'text-gray-800',
      buttonStyle: 'bg-white border-gray-300 hover:border-gray-400 shadow-lg'
    },
    {
      id: 'dark' as const,
      name: 'Dark Scheme', 
      description: 'Sophisticated, elegant interiors with rich dark tones',
      thumbnail: '/assets/neo/texrure/thumb-black.jpg',
      gradient: 'from-gray-900 to-black',
      textColor: 'text-white',
      buttonStyle: 'bg-gray-900 border-gray-700 hover:border-gray-500 shadow-xl'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Color Scheme for 360° Tour
          </h2>
          <p className="text-gray-600">
            Select the interior color scheme you'd like to explore in <span className="font-semibold">{houseName}</span>
          </p>
        </div>

        {/* Color Options */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {colorOptions.map((option) => (
              <div
                key={option.id}
                className={`relative rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                  selectedPreview === option.id ? 'ring-4 ring-blue-500 shadow-xl' : 'shadow-lg hover:shadow-xl'
                }`}
                onMouseEnter={() => setSelectedPreview(option.id)}
                onMouseLeave={() => setSelectedPreview(null)}
                onClick={() => onColorSelected(option.id)}
              >
                {/* Background Gradient */}
                <div className={`bg-gradient-to-br ${option.gradient} p-6 h-80`}>
                  
                  {/* Thumbnail Image */}
                  <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={houseName && option.id === 'dark' 
                        ? `/assets/neo/${houseName}/360/hero-preview-dark.jpg`
                        : houseName && option.id === 'white'
                        ? `/assets/neo/${houseName}/360/hero-preview.jpg`
                        : option.thumbnail}
                      alt={option.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    
                    {/* Overlay on hover */}
                    {selectedPreview === option.id && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-full p-3">
                          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-4-4V9a3 3 0 016 0v1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option Info */}
                  <div className={option.textColor}>
                    <h3 className="text-xl font-bold mb-2">{option.name}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                      {option.description}
                    </p>
                  </div>

                  {/* Select Button */}
                  <button 
                    className={`absolute bottom-4 right-4 px-4 py-2 rounded-lg border-2 transition-all duration-200 font-semibold ${option.buttonStyle}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onColorSelected(option.id);
                    }}
                  >
                    Select {option.name}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Preview Info */}
          {selectedPreview && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                <span className="font-semibold">Preview:</span> You're viewing the{' '}
                <span className="font-semibold">
                  {colorOptions.find(opt => opt.id === selectedPreview)?.name}
                </span>{' '}
                option. Click to start your 360° tour with this color scheme.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <button 
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            onClick={onCancel}
          >
            ← Back to House
          </button>
          
          <div className="text-sm text-gray-500">
            You can switch between color schemes anytime during the tour
          </div>
        </div>
      </div>
    </div>
  );
}
