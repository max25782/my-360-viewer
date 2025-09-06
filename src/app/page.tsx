import Header from "../components/Header";
import Footer from "../components/Footer";
import CategoriesGrid from "../components/CategoriesGrid";
import CategoryPage from "./category/[categoryId]/page";
import PWAInitializer from "../components/PWAInitializer";


export default function Home() {
  return (
    <div className="min-h-screen bg-slate-800">
      {/* PWA Initializer */}
      <PWAInitializer />
      
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            ADU Collection
          </h1>
        
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Choose Your Collection</h2>
            <p className="text-lg text-gray-300">
              Each collection offers unique designs and features
            </p>
          </div>
          
          <CategoriesGrid/>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}