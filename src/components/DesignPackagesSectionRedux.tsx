/**
 * PRODUCTION DESIGN PACKAGES SECTION - REDUX VERSION
 * Сохраняет старый CSS, использует Redux для кэширования и оптимизации
 * Optimized for 30+ houses with caching and memoized selectors
 */

import { House } from '../hooks/useHouses';
import UniversalDesignSelectorRedux from './UniversalDesignSelectorRedux';
import ComparisonCallToAction from './ComparisonCallToAction';
import SkylineExteriorDesignPackages from './Skyline/SkylineExteriorDesignPackages';

interface DesignPackagesSectionReduxProps {
  house: House;
}

export default function DesignPackagesSectionRedux({ house }: DesignPackagesSectionReduxProps) {
  return (
    <section className="py-16 bg-slate-700 bg-opacity-70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Expertly Curated Design Packages
          </h2>
          <p className="text-lg text-gray-600">
            Choose from one of our beautifully designed and carefully crafted design packages.
          </p>
        </div>

        {/* Design Collection Showcase */}
        <div className="grid grid-cols-1 lg:grid-rows-2 gap-8 mb-16">
          {/* Exterior View - Using Skyline Component */}
          {house.category === 'skyline' ? (
            <SkylineExteriorDesignPackages house={house} />
          ) : (
            <UniversalDesignSelectorRedux 
              houseId={house.id}
              type="exterior"
            />
          )}

          {/* Interior View */}
          <UniversalDesignSelectorRedux 
            houseId={house.id}
            type="interior"
          />
        </div>

        {/* Package Comparison Call-to-Action */}
        <ComparisonCallToAction house={house} />
      </div>
    </section>
  );
}
