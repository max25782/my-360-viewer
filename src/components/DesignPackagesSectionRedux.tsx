/**
 * PRODUCTION DESIGN PACKAGES SECTION - REDUX VERSION
 * Сохраняет старый CSS, использует Redux для кэширования и оптимизации
 * Optimized for 30+ houses with caching and memoized selectors
 */

import { House } from '../data/houses';
import UniversalDesignSelectorRedux from './UniversalDesignSelectorRedux';
import NewGoodBetterBestComparison from './NewGoodBetterBestComparison';

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Exterior View */}
          <UniversalDesignSelectorRedux 
            houseId={house.id}
            houseName={house.name}
            type="exterior"
          />

          {/* Interior View */}
          <UniversalDesignSelectorRedux 
            houseId={house.id}
            houseName={house.name}
            type="interior"
          />
        </div>

        {/* Good/Better/Best Comparison Table */}
        <NewGoodBetterBestComparison house={house} />
      </div>
    </section>
  );
}
