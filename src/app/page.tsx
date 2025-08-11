import Image from "next/image";
import Link from "next/link";
import { HOUSES } from "../data/houses";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Homes of the Future Today
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Explore our innovative home designs with interactive 360° tours. 
            Each home is created with attention to detail and modern technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#catalog" 
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-colors shadow-lg"
            >
              View Catalog
          </a>
          <a
              href="#virtual-tour" 
              className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              🎭 Virtual Tour
            </a>
          </div>
        </div>
      </section>

      {/* Take a Look Around Section - Like RG Pro Builders */}
      <section id="virtual-tour" className="py-20 bg-white bg-opacity-80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Take a look around!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Step inside and feel the inspiration! We invite you to explore our 
                immersive 360° virtual walkthrough experience, which will allow you to truly 
                feel what your next home could be like.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">6</div>
                  <div className="text-sm text-gray-500">House Models</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-gray-500">Design Collections</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-500">Finish Packages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">∞</div>
                  <div className="text-sm text-gray-500">Possibilities</div>
                </div>
              </div>

              <Link 
                href="/houses/walnut/tour"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                🎭 Start Virtual Tour
              </Link>
            </div>
            
            <div className="mt-12 lg:mt-0">
              <div className="relative">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🏠</div>
                      <div className="text-lg">360° Virtual Tour Preview</div>
                      <div className="text-sm opacity-75 mt-2">Click to Launch</div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Houses Catalog */}
      <section id="catalog" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our House Models</h2>
            <p className="text-lg text-gray-600">
              Choose a home that perfectly fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HOUSES.map((house) => (
              <div key={house.id} className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏠</div>
                      <span className="text-sm font-medium">{house.name} Model</span>
                    </div>
                  </div>
                  {/* Best Package Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Best Package Available
                  </div>
                  {/* Virtual Tour Badge */}
                  {house.tour360Available && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      🎭 360° Tour
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{house.name}</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        ${house.priceRange.good.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">starting price</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="font-bold text-blue-600">{house.sqft}</div>
                      <div className="text-xs text-gray-500">Sq. Ft.</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="font-bold text-blue-600">{house.bedrooms}</div>
                      <div className="text-xs text-gray-500">Bedrooms</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="font-bold text-blue-600">{house.bathrooms}</div>
                      <div className="text-xs text-gray-500">Bathrooms</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">{house.description}</p>

                  {/* Package Options */}
                  <div className="flex justify-between items-center mb-4 text-xs">
                    <div className="flex space-x-1">
                      <span className="bg-gray-100 px-2 py-1 rounded">Good: ${(house.priceRange.good/1000)}k</span>
                      <span className="bg-blue-100 px-2 py-1 rounded">Better: ${(house.priceRange.better/1000)}k</span>
                      <span className="bg-yellow-100 px-2 py-1 rounded">Best: ${(house.priceRange.best/1000)}k</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link 
                      href={`/houses/${house.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Details
                    </Link>
                    {house.tour360Available && (
                      <Link 
                        href={`/houses/${house.id}/tour`}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-sm font-medium"
                      >
                        🎭 Tour
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started Today Section - Like RG Pro Builders */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Get Started Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our team is ready to help you EVERY step of the way. Contact us today. 
            We'll start making your life easier from the very first call.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-lg">
              📞 GET A QUOTE
            </button>
            <Link 
              href="/houses/walnut/tour"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg"
            >
              🎭 VIRTUAL TOUR
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-blue-100">
            <div>
              <div className="text-2xl font-bold text-white">6</div>
              <div className="text-sm">Ready Models</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">15+</div>
              <div className="text-sm">Years of Experience</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm">Satisfied Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 bg-opacity-70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-600">We create not just houses, but places to live</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏗️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Construction</h3>
              <p className="text-gray-600 text-sm">We use only the best materials and proven technologies</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Design</h3>
              <p className="text-gray-600 text-sm">5 design collections for any taste and budget</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Construction</h3>
              <p className="text-gray-600 text-sm">Construction time from 3 to 6 months</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Finishes</h3>
              <p className="text-gray-600 text-sm">High-quality materials and modern technologies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
