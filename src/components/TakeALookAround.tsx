import { House } from '../data/houses';
import VirtualTourPreview from './VirtualTourPreview';

interface TakeALookAroundProps {
  house: House;
}

export default function TakeALookAround({ house }: TakeALookAroundProps) {
  return (
    <section className="py-20 bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-bold mb-6">Take a look around!</h2>
        <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto">
          Step inside and take a moment to get inspired! We invite you to explore our immersive 360° 
          walk-through experience, which allows you to truly get a feel for what your next {house.name} could be like in person.
        </p>
        
        {/* 360° Tour Preview */}
        <VirtualTourPreview 
          houseId={house.id}
          houseName={house.name}
        />
      </div>
    </section>
  );
}
