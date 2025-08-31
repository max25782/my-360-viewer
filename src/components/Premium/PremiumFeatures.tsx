'use client';

interface PremiumFeaturesProps {
  features: string[];
  houseName: string;
}

export default function PremiumFeatures({ features, houseName }: PremiumFeaturesProps) {
  if (!features || !Array.isArray(features) || features.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          {houseName} Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature: string, index: number) => (
            <div key={index} className="bg-slate-800 p-4 rounded-lg flex items-start">
              <div className="text-emerald-400 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-gray-200">{feature}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
