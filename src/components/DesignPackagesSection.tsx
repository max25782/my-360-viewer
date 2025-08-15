import { House } from '../data/houses';
import DesignCollectionSelectorRedux from './DesignCollectionSelectorRedux';
import InteriorDesignSelectorRedux from './InteriorDesignSelectorRedux';
import GoodBetterBestComparison from './GoodBetterBestComparison';

interface DesignPackagesSectionProps {
  house: House;
}

export default function DesignPackagesSection({ house }: DesignPackagesSectionProps) {
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
          <DesignCollectionSelectorRedux houseName={house.name} houseId={house.id} />

          {/* Interior View */}
          <InteriorDesignSelectorRedux houseName={house.name} houseId={house.id} />
        </div>

        {/* Good/Better/Best Comparison Table */}
        <GoodBetterBestComparison house={house} />
      </div>
    </section>
  );
}
