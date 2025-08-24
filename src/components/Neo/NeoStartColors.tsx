
import { NeoHouse } from '../../hooks/useNeoHouse';

interface NeoStartColorsProps {
  house: NeoHouse;
}

export default function NeonStartColors({ house }: NeoStartColorsProps) {
  return (
    <div className="max-w-7xl pb-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dual Color Experience
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {house.name} offers two distinct interior experiences. Choose your preferred aesthetic for the 360° tour.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-24  mx-auto">
            {/* White Scheme Preview */}
           
              <div className="relative  mx-auto rounded-lg overflow-hidden">
                <img 
                  src={house.images.exampleWhite}
                  alt="White Color Scheme"
                  className="w-40 h-40 object-contain"
                />
              
              </div>
            
             
           

            {/* Dark Scheme Preview */}
         
              <div className="relative  mb-6 rounded-lg overflow-hidden">
                <img 
                  src={house.images.exampleDark}
                  alt="Dark Color Scheme"
                  className="w-40 h-40 object-contain"
                />
               
              </div>
              
              
            
          </div>
    </div>
  );
}