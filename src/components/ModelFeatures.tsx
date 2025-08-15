import { House } from '../data/houses';

interface ModelFeaturesProps {
  house: House;
}

export default function ModelFeatures({ house }: ModelFeaturesProps) {
  return (
    <section className="py-16 bg-gray-50 bg-opacity-70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Model Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {house.features.map((feature, index) => (
            <div key={index} className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">✓</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-gray-900 font-medium">{feature}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
