import { House } from '../data/houses';

interface TechnicalSpecificationsProps {
  house: House;
}

export default function TechnicalSpecifications({ house }: TechnicalSpecificationsProps) {
  return (
    <section className="py-16 bg-white bg-opacity-80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Technical Specifications
        </h2>
        
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Parameters</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Dimensions:</dt>
                  <dd className="font-medium text-gray-900">{house.specifications.dimensions}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Ceiling Height:</dt>
                  <dd className="font-medium text-gray-900">{house.specifications.ceilingHeight}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Area:</dt>
                  <dd className="font-medium text-gray-900">{house.sqft} sq. ft.</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Finishes and Amenities</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Kitchen:</dt>
                  <dd className="font-medium text-gray-900">{house.specifications.kitchenType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Bathroom:</dt>
                  <dd className="font-medium text-gray-900">{house.specifications.bathroomType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">HVAC:</dt>
                  <dd className="font-medium text-gray-900">{house.specifications.hvac}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
