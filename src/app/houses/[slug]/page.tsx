import { notFound } from 'next/navigation';
import { getHouse, HOUSES } from '../../../data/houses';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumb from '../../../components/Breadcrumb';
import HeroSection from '../../../components/HeroSection';
import DesignPackagesSectionRedux from '../../../components/DesignPackagesSectionRedux';
import TakeALookAroundUniversal from '../../../components/TakeALookAroundUniversal';
import TechnicalSpecifications from '../../../components/TechnicalSpecifications';
import ModelFeatures from '../../../components/ModelFeatures';
import GetStartedToday from '../../../components/GetStartedToday';
import ExploreModels from '../../../components/ExploreModels';
import UniversalTourLinks from '../../../components/UniversalTourLinks';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return HOUSES.map((house) => ({
    slug: house.id,
  }));
}

export default async function HousePage({ params }: PageProps) {
  const resolvedParams = await params;
  const house = getHouse(resolvedParams.slug);
  
  if (!house) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header variant="transparent" />

      {/* Breadcrumbs */}
      <Breadcrumb 
        items={[
          { label: 'Seattle models', href: '/' },
          { label: house.name }
        ]} 
      />

      {/* Hero Section */}
      <HeroSection house={house} />

      {/* Design Packages Section */}
      <DesignPackagesSectionRedux house={house} />

      {/* Take a Look Around Section */}
      <TakeALookAroundUniversal house={house} />

    

      {/* Technical Specifications */}
      {/* <TechnicalSpecifications house={house} /> */}

      {/* Model Features */}
      {/* <ModelFeatures house={house} /> */}

      {/* Get Started Today CTA */}
      {/* <GetStartedToday house={house} /> */}

      {/* Explore Other Models */}
      {/* <ExploreModels currentHouse={house} allHouses={HOUSES} /> */}

      {/* Footer */}
      <Footer />
    </div>
  );
}
