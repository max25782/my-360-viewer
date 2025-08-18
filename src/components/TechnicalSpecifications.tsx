import { House } from '../hooks/useHouses';

interface TechnicalSpecificationsProps {
  house: House;
}

export default function TechnicalSpecifications({ house }: TechnicalSpecificationsProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Specifications</h2>
          <p className="text-lg text-gray-600">Detailed specifications for {house.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">House Details</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-600">Model Name:</dt>
                <dd className="font-medium text-gray-900">{house.name}</dd>
              </div>
              {/* <div className="flex justify-between">
                <dt className="text-gray-600">Available Rooms:</dt>
                <dd className="font-medium text-gray-900">{house.availableRooms.length} rooms</dd>
              </div> */}
              <div className="flex justify-between">
                <dt className="text-gray-600">Room Types:</dt>
                <dd className="font-medium text-gray-900">{house.availableRooms.join(', ')}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Options</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-600">Design Packages:</dt>
                <dd className="font-medium text-gray-900">DP1 - DP{house.maxDP}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Package Options:</dt>
                <dd className="font-medium text-gray-900">PK1 - PK{house.maxPK}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">360° Tour:</dt>
                <dd className="font-medium text-gray-900">
                  {house.tour360 && house.tour360.rooms.length > 0 ? 'Available' : 'Not Available'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Available Rooms Grid */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Available Room Layouts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {house.availableRooms.map((room, index) => (
              <div key={`${room}-${index}`} className="bg-white p-4 rounded-lg shadow-md text-center">
                <div className="text-2xl mb-2">
                  {room === 'living' && '🛋️'}
                  {room === 'kitchen' && '🍳'}
                  {room === 'bedroom' && '🛏️'}
                  {room === 'bathroom' && '🚿'}
                  {room === 'entry' && '🚪'}
                  {room === 'dining' && '🍽️'}
                  {!['living', 'kitchen', 'bedroom', 'bathroom', 'entry', 'dining'].includes(room) && '🏠'}
                </div>
                <div className="font-medium text-gray-900 capitalize">
                  {room}
                  {/* Показываем номер, если это не первая комната данного типа */}
                  {house.availableRooms.indexOf(room) !== index && 
                   ` ${house.availableRooms.filter((r, i) => r === room && i <= index).length}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Design Package Information */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Design Package Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-blue-800">Heritage Package</h4>
                {/* <p className="text-sm text-blue-600 mt-2">DP1 / PK1</p> */}
              </div>
              <p className="text-sm text-gray-600">Essential finishes and features for comfortable living</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-green-800">Haven Package</h4>
                <p className="text-sm text-green-600 mt-2">DP2 / PK2</p>
              </div>
              <p className="text-sm text-gray-600">Enhanced comfort with upgraded finishes and appliances</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-purple-800">Luxe Package</h4>
                <p className="text-sm text-purple-600 mt-2">DP{house.maxDP} / PK{house.maxPK}</p>
              </div>
              <p className="text-sm text-gray-600">Premium experience with luxury finishes and amenities</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}