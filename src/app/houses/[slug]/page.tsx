'use client';

import { useParams, notFound } from 'next/navigation';
import { useHouse, useHouses } from '../../../hooks/useHouses';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumb from '../../../components/Breadcrumb';
import HeroSection from '../../../components/HeroSection';
import DesignPackagesSectionRedux from '../../../components/DesignPackagesSectionRedux';
import TakeALookAroundUniversal from '../../../components/TakeALookAroundUniversal';



export default function HousePage() {
  const params = useParams();
  const houseId = params?.slug as string;
  
  console.log(`🏠 HousePage: Rendering page for house: ${houseId}`);
  
  const { house, loading, error } = useHouse(houseId);
  const { houses } = useHouses();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">Loading House...</div>
          <div className="rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !house) {
    notFound();
  }

  return (
    <div className="min-h-screen">
   
      {/* Header */}
      <Header variant="transparent" />

      {/* Breadcrumbs */}
      <Breadcrumb 
        items={[
          { label: 'Skyline Collection', href: '/skyline' },
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
      {/* <ExploreModels currentHouse={house} allHouses={houses} /> */}

      {/* Footer */}
      <Footer />
    </div>
  );
}