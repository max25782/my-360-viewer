import { House } from '../data/houses';

interface GetStartedTodayProps {
  house: House;
}

export default function GetStartedToday({ house }: GetStartedTodayProps) {
  return (
    <section className="py-20 bg-gray-800 text-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-800/95 to-gray-800/90"></div>
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gray-700 opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Get Started Today</h2>
            <p className="text-xl text-gray-300 mb-8">
              The RG ProBuilders team is ready to help you EVERY step of the way. Reach out to us today. 
              We&apos;ll start making your life easier from the very first phone call.
            </p>
            
            <div className="mb-8">
              <button className="bg-white text-gray-800 px-8 py-4 text-lg font-bold rounded hover:bg-gray-100 transition-colors shadow-lg">
                GET A QUOTE
              </button>
            </div>
          </div>
          
          <div className="mt-12 lg:mt-0">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-2xl">
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏠</div>
                  <div className="text-lg">{house.name} Model House</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
