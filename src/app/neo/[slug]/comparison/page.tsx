import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNeoHouseConfig } from '../../../../utils/neoAssets';
import JsonGoodBetterBestComparison from '../../../../components/JsonGoodBetterBestComparison';

interface NeoComparisonPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: NeoComparisonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const houseConfig = await getNeoHouseConfig(slug);
  
  if (!houseConfig) {
    return {
      title: 'Comparison Not Found - Neo ADU Series',
      description: 'The requested Neo house comparison could not be found.',
    };
  }

  return {
    title: `${houseConfig.name} Comparison - Neo ADU Series`,
    description: `Compare design packages and features for ${houseConfig.name} from our Neo ADU collection.`,
    keywords: `${houseConfig.name}, neo adu comparison, design packages, white vs dark interior`,
  };
}

export default async function NeoComparisonPage({ params }: NeoComparisonPageProps) {
  const { slug } = await params;
  const houseConfig = await getNeoHouseConfig(slug);
  
  if (!houseConfig) {
    notFound();
  }

  // Convert Neo house to legacy format for existing comparison component
  const legacyHouse = {
    id: slug,
    name: houseConfig.name,
    description: houseConfig.description,
    maxDP: houseConfig.maxDP,
    maxPK: houseConfig.maxPK,
    availableRooms: houseConfig.availableRooms,
    images: {
      hero: `/assets/neo/${slug}/hero.jpg`,
      gallery: []
    },
    comparison: houseConfig.comparison,
    tour360: {
      rooms: [
        ...(houseConfig.tour360.white?.rooms || []),
        ...(houseConfig.tour360.black?.rooms || [])
      ],
      availableFiles: {}
    },
    category: 'neo'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Use existing Skyline comparison component */}
      <JsonGoodBetterBestComparison house={legacyHouse} />
    </div>
  );
}
