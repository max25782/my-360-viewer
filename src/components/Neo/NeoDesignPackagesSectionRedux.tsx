/**
 * NEO DESIGN PACKAGES SECTION - REDUX VERSION
 * Специализированный компонент для Neo домов с двумя подсекциями
 */

import { NeoHouse } from '../../hooks/useNeoHouse';
import UniversalDesignSelectorRedux from '../UniversalDesignSelectorRedux';

import NeoComparisonCallToAction from './NeoComparisonCallToAction';

interface NeoDesignPackagesSectionReduxProps {
  house: NeoHouse;
}

export default function NeoDesignPackagesSectionRedux({ house }: NeoDesignPackagesSectionReduxProps) {
  return (
    <section className="py-16 bg-slate-700 bg-opacity-70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Neo ADU Series: Design Packages
          </h2>
          <p className="text-lg text-gray-600">
            Explore our meticulously crafted design packages for the Neo ADU Series.
          </p>
        </div>

        {/* Design Collection Showcase */}
        <div className="grid grid-rows-1 lg:grid-rows-2 gap-8 mb-16">
          {/* Heritage Package */}
          <div className="bg-white shadow-lg rounded-lg p-6">
           
        
          </div>

          {/* Luxe Package */}
          <div className="bg-white shadow-lg rounded-lg p-6">
      
          
          </div>
        </div>

        {/* Package Comparison Call-to-Action */}
        <NeoComparisonCallToAction houseSlug={house.id} houseName={house.name} />
      </div>
    </section>
  );
}
