import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getHouse, HOUSES } from '../../../data/houses';
import { DESIGN_COLLECTIONS, calculatePrice } from '../../../data/design-collections';
import DesignCollectionSelector from '../../../components/DesignCollectionSelector';
import InteriorDesignSelector from '../../../components/InteriorDesignSelector';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';


interface PageProps {
  params: {
    slug: string;
  };
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
      <div className="bg-slate-700 bg-opacity-90  ">
        <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 text-2xl hover:text-gray-700 font-bold">View all models</Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <span className="text-gray-900 font-bold text-2xl">{house.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-slate-700 bg-opacity-80 backdrop-blur-sm py-2">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="">
          
            
            <div className="relative w-full h-screen rounded-lg overflow-hidden shadow-xl"
                 style={{
                   backgroundImage: `url('/Walnut/walnut-hero.jpg')`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   backgroundRepeat: 'no-repeat'
                 }}>
              
              {/* Overlay Content */}
              <div className="absolute inset-0">
                <div className="absolute top-1/2 left-8 transform -translate-y-1/2 max-w-lg">
                  <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">{house.name}</h1>
                  <p className="text-xl text-gray mb-8 leading-relaxed drop-shadow-lg">{house.description}</p>
                  
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="text-center bg-gray bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
                      <span className="block text-3xl font-bold text-white">{house.sqft}</span>
                      <span className="block text-sm text-gray-200">Sq. Ft.</span>
                    </div>
                    <div className="text-center bg-gray bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
                      <span className="block text-3xl font-bold text-white">{house.bedrooms}</span>
                      <span className="block text-sm text-gray-200">Bedrooms</span>
                    </div>
                    <div className="text-center bg-gray bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
                      <span className="block text-3xl font-bold text-white">{house.bathrooms}</span>
                      <span className="block text-sm text-gray-200">Bathrooms</span>
                    </div>
                  </div>

                
 
                  <div className="flex space-x-4">
                    <Link 
                      href={`/houses/${house.id}/tour`}
                      className="bg-gray-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold flex items-center"
                    >
                      Virtual Tour
                    </Link>
                    <button className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold">
                       Get a Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertly Curated Design Packages - Exact RG Style */}
      <section className="py-16 bg-slate-700 bg-opacity-70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Expertly Curated Design Packages</h2>
            <p className="text-lg text-gray-600">
              Choose from one of our beautifully designed and carefully crafted design packages.
            </p>
          </div>

          {/* Design Collection Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Exterior View */}
            <DesignCollectionSelector houseName={house.name} />

            {/* Interior View */}
            <InteriorDesignSelector houseName={house.name} />
          </div>

          {/* Good/Better/Best Comparison Table - Exact RG Style */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-4">
              {/* Headers */}
               <div className="bg-stone-600 text-white text-center py-4 px-6">
                
              </div>
              <div className="bg-stone-600 text-white text-center py-4 px-6">
                <h3 className="text-xl font-bold">GOOD</h3>
              </div>
              <div className="bg-stone-700 text-white text-center py-4 px-6">
                <h3 className="text-xl font-bold">BETTER</h3>
              </div>
              <div className="bg-stone-800 text-white text-center py-4 px-6">
                <h3 className="text-xl font-bold">BEST</h3>
              </div>
            </div>
            
            {/* Images Row */}
            <div className="grid grid-cols-4 border-b">
               <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Front Elevation</div>
                  
                
              
              <div className="p-4 border-r">
                <div className="aspect-video rounded flex items-center justify-center">
                  <img src="/Walnut/walnut_color/walnut-good.jpg" alt="Good Package" className="w-full h-full object-contain rounded" />
                </div>
              </div>
              <div className="p-4">
                <div className="aspect-video  rounded flex items-center justify-center">
                  <img src="/Walnut/walnut_color/walnut-better.jpg" alt="Better Package" className="w-full h-full object-contain rounded" />
                </div>
              </div>
              <div className="p-4">
                <div className="aspect-video  rounded flex items-center justify-center">
                  <img src="/Walnut/walnut_color/walnut-best.jpg" alt="Best Package" className="w-full h-full object-contain rounded" />
                </div>
              </div>
            </div>

            {/* Specifications Table */}
            <div className="divide-y">
              {/* Floor Plan (1st Floor) */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Floor Plan (1st Floor)</div>
                <div className="p-4 text-center border-r">
                  <img src="/Walnut/walnut_scena/Walnut-good-1.jpg" alt="Good Floor Plan 1st Floor" className="w-full h-32 object-contain rounded" />
                </div>
                <div className="p-4 text-center border-r">
                  <img src="/Walnut/walnut_scena/Walnut-better-1.jpg" alt="Better Floor Plan 1st Floor" className="w-full h-32 object-contain rounded" />
                </div>
                <div className="p-4 text-center">
                  <img src="/Walnut/walnut_scena/Walnut-best-1.jpg" alt="Best Floor Plan 1st Floor" className="w-full h-32 object-contain rounded" />
                </div>
              </div>

              {/* Floor Plan (2nd Floor) */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Floor Plan (2nd Floor)</div>
                <div className="p-4 text-center border-r">
                  <img src="/Walnut/walnut_scena/Walnut-good-2.jpg" alt="Good Floor Plan 2nd Floor" className="w-full h-32 object-contain rounded" />
                </div>
                <div className="p-4 text-center border-r">
                  <img src="/Walnut/walnut_scena/Walnut-better-2.jpg" alt="Better Floor Plan 2nd Floor" className="w-full h-32 object-contain rounded" />
                </div>
                <div className="p-4 text-center">
                  <img src="/Walnut/walnut_scena/Walnut-best-2.jpg" alt="Best Floor Plan 2nd Floor" className="w-full h-32 object-contain rounded" />
                </div>
              </div>

              {/* Living Space */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Living Space</div>
                <div className="p-4 text-center border-r">{house.sqft} SF</div>
                <div className="p-4 text-center border-r">{house.sqft} SF</div>
                <div className="p-4 text-center">{house.sqft} SF</div>
              </div>
              
              {/* Outdoor Space */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Outdoor Space</div>
                <div className="p-4 text-center border-r text-red-500">✗</div>
                <div className="p-4 text-center border-r">210 SF</div>
                <div className="p-4 text-center">210 SF</div>
              </div>
              
              {/* Overall Dimensions */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Overall Dimensions</div>
                <div className="p-4 text-center border-r">{house.specifications.dimensions}</div>
                <div className="p-4 text-center border-r">{house.specifications.dimensions}</div>
                <div className="p-4 text-center">{house.specifications.dimensions}</div>
              </div>
              
              {/* Bedrooms */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Bedrooms</div>
                <div className="p-4 text-center border-r">{house.bedrooms} Bedrooms</div>
                <div className="p-4 text-center border-r">{house.bedrooms} Bedrooms</div>
                <div className="p-4 text-center">{house.bedrooms} Bedrooms</div>
              </div>
              
              {/* Bathrooms */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Bathrooms</div>
                <div className="p-4 text-center border-r">{house.bathrooms} Bathrooms</div>
                <div className="p-4 text-center border-r">{house.bathrooms} Bathrooms</div>
                <div className="p-4 text-center">{house.bathrooms} Bathrooms</div>
              </div>
              
              {/* Ceiling Height */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Ceiling Height</div>
                <div className="p-4 text-center border-r">8 Feet</div>
                <div className="p-4 text-center border-r">9 Feet</div>
                <div className="p-4 text-center">9 Feet</div>
              </div>
              
              {/* Kitchen */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Kitchen</div>
                <div className="p-4 text-center border-r">Kitchenette</div>
                <div className="p-4 text-center border-r">Full Kitchen with Upper Cabs</div>
                <div className="p-4 text-center">Full Kitchen with Upper Cabs</div>
              </div>

              {/* Kitchen Island */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Kitchen Island</div>
                <div className="p-4 text-center border-r text-red-500">✗</div>
                <div className="p-4 text-center border-r text-red-500">✗</div>
                <div className="p-4 text-center text-green-500">✓</div>
              </div>

              {/* Garbage Disposal */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Garbage Disposal</div>
                <div className="p-4 text-center border-r text-red-500">✗</div>
                <div className="p-4 text-center border-r text-red-500">✗</div>
                <div className="p-4 text-center text-green-500">✓</div>
              </div>

              {/* Vanity */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Vanity</div>
                <div className="p-4 text-center border-r">Pedestal Sink</div>
                <div className="p-4 text-center border-r">Built-in Vanity w/ Single Sink</div>
                <div className="p-4 text-center">Built-in Vanity w/ Single Sink</div>
              </div>

              {/* Shower */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Shower</div>
                <div className="p-4 text-center border-r">Tub/Shower Unit</div>
                <div className="p-4 text-center border-r">Shower Unit</div>
                <div className="p-4 text-center">Tile Shower</div>
              </div>

              {/* Bathroom Accessories */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Bathroom Accessories</div>
                <div className="p-4 text-center border-r text-red-500">✗</div>
                <div className="p-4 text-center border-r text-green-500">✓</div>
                <div className="p-4 text-center text-green-500">✓</div>
              </div>

              {/* Exterior Siding */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Exterior Siding</div>
                <div className="p-4 text-center border-r">Hardie Lap</div>
                <div className="p-4 text-center border-r">Hardie Lap and Board & Batten</div>
                <div className="p-4 text-center">Hardie Lap and Board & Batten</div>
              </div>

              {/* Flooring */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Flooring</div>
                <div className="p-4 text-center border-r">Builder Grade LVP or Laminate</div>
                <div className="p-4 text-center border-r">Upgraded LVP or Laminate</div>
                <div className="p-4 text-center">Designer Series LVP or Laminate and Tile</div>
              </div>

              {/* Feature Lighting */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Feature Lighting</div>
                <div className="p-4 text-center border-r">Downlighting, Interior and Exterior Fixtures</div>
                <div className="p-4 text-center border-r">Downlighting, Ceiling Fans, Interior and Exterior Fixtures</div>
                <div className="p-4 text-center">Premium Fixtures from Rejuvenation</div>
              </div>

              {/* Mini-Split HVAC */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Mini-Split HVAC</div>
                <div className="p-4 text-center border-r">Living Area</div>
                <div className="p-4 text-center border-r">Living Area and Primary Bedroom</div>
                <div className="p-4 text-center">Living Area and All Bedrooms</div>
              </div>

              {/* Tank Water Heater */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Tank Water Heater</div>
                <div className="p-4 text-center border-r text-green-500">✓</div>
                <div className="p-4 text-center border-r text-green-500">✓</div>
                <div className="p-4 text-center text-green-500">✓</div>
              </div>

              {/* Electric Fireplace */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Electric Fireplace</div>
                <div className="p-4 text-center border-r text-red-500">✗</div>
                <div className="p-4 text-center border-r text-red-500">✗</div>
                <div className="p-4 text-center text-green-500">✓</div>
              </div>

              {/* Available Design Collection */}
              <div className="grid grid-cols-4">
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">Available Design Collection</div>
                <div className="p-4 text-center border-r">Dark & Light</div>
                <div className="p-4 text-center border-r">Heritage, Haven and Sunset</div>
                <div className="p-4 text-center">Heritage, Haven, Serenity, Luxe & Sunset</div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Take a look around! - Exact RG Style */}
      <section className="py-20 bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">Take a look around!</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto">
            Step inside and take a moment to get inspired! We invite you to explore our immersive 360° 
            walk-through experience, which allows you to truly get a feel for what your next {house.name} could be like in person.
          </p>
          

  
     

          {/* 360° Tour Preview */}
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl relative group cursor-pointer"
                 style={{
                   backgroundImage: `url('/Walnut/3D/entry/thumbnail-qwc9E691mj83t8TKcLx5erIxLUnmEEt0.jpg')`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   backgroundRepeat: 'no-repeat'
                 }}>
              <Link href={`/houses/${house.id}/tour`}>
                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-bl bg-opacity-40"></div>
                
             
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                  <div className="w-32 h-32 bg-slate-700 bg-opacity-50 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white border-opacity-30 shadow-2xl">
                    <div className="w-0 h-0 border-l-12 border-l-white border-t-6 border-t-transparent border-b-6 border-b-transparent ml-2" style={{
                      borderLeftWidth: '20px',
                      borderTopWidth: '12px',
                      borderBottomWidth: '12px'
                    }}></div>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Preview Info */}
            <div className="mt-4 text-center">
              <p className="text-gray-300 text-sm">
                Preview: Entry room of {house.name} • Click to explore all rooms: Entry, Kitchen, Bedroom, Bathroom, Living Room
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-16 bg-white bg-opacity-80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Technical Specifications</h2>
          
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Parameters</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Dimensions:</dt>
                    <dd className="font-medium text-gray-900">{house.specifications.dimensions}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Ceiling Height:</dt>
                    <dd className="font-medium text-gray-900">{house.specifications.ceilingHeight}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Area:</dt>
                    <dd className="font-medium text-gray-900">{house.sqft} sq. ft.</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Finishes and Amenities</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Kitchen:</dt>
                    <dd className="font-medium text-gray-900">{house.specifications.kitchenType}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Bathroom:</dt>
                    <dd className="font-medium text-gray-900">{house.specifications.bathroomType}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">HVAC:</dt>
                    <dd className="font-medium text-gray-900">{house.specifications.hvac}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 bg-opacity-70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Model Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {house.features.map((feature, index) => (
              <div key={index} className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">✓</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 font-medium">{feature}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started Today - Exact RG Style */}
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
                We'll start making your life easier from the very first phone call.
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

      {/* Explore Our Legacy ADUs - Exact RG Style */}
      <section className="py-16 bg-white bg-opacity-80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Legacy ADUs</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HOUSES.filter(h => h.id !== house.id).slice(0, 5).map((otherHouse) => (
              <Link key={otherHouse.id} href={`/houses/${otherHouse.id}`} className="group">
                <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🏠</div>
                        <div className="text-sm font-medium">{otherHouse.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{otherHouse.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>{otherHouse.sqft} Sq. Ft.</div>
                      <div>{otherHouse.bedrooms} Bedrooms</div>
                      <div>{otherHouse.bathrooms} Bathrooms</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
