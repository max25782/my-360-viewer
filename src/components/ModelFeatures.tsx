import { House } from '../hooks/useHouses';

interface ModelFeaturesProps {
  house: House;
}

export default function ModelFeatures({ house }: ModelFeaturesProps) {
  // Создаем список функций на основе доступных данных из JSON
  const features = [
    `${house.availableRooms.length} Available Room Layouts`,
    `${house.maxDP} Design Package Options`,
    `${house.maxPK} Interior Package Choices`,
    `Modern ${house.name} Architecture`,
    'Energy Efficient Design',
    'High-Quality Materials',
    'Professional Installation',
    'Customizable Interior Finishes'
  ];

  // Добавляем функции на основе доступных комнат
  house.availableRooms.forEach(room => {
    switch(room) {
      case 'kitchen':
        features.push('Full Kitchen Layout');
        break;
      case 'living':
        features.push('Spacious Living Area');
        break;
      case 'bedroom':
        features.push('Comfortable Bedroom Space');
        break;
      case 'bathroom':
        features.push('Modern Bathroom Facilities');
        break;
      case 'entry':
        features.push('Welcoming Entry Area');
        break;
      case 'dining':
        features.push('Dedicated Dining Space');
        break;
    }
  });

  // Добавляем функцию 360° тура если доступно
  if (house.tour360 && house.tour360.rooms.length > 0) {
    features.push(`360° Virtual Tour (${house.tour360.rooms.length} rooms)`);
  }

  return (
    <section className="py-16 bg-gray-50 bg-opacity-70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {house.name} Model Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
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

        {/* Additional Features Section */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Design Package Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <h4 className="font-bold text-blue-600 mb-2">Heritage Package</h4>
              <p className="text-sm text-gray-600">Essential features with quality finishes (DP1/PK1)</p>
            </div>
            <div className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <h4 className="font-bold text-green-600 mb-2">Haven Package</h4>
              <p className="text-sm text-gray-600">Enhanced comfort with upgraded amenities (DP2/PK2)</p>
            </div>
            <div className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <h4 className="font-bold text-purple-600 mb-2">Luxe Package</h4>
              <p className="text-sm text-gray-600">Premium experience with luxury finishes (DP{house.maxDP}/PK{house.maxPK})</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}