'use client'

import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function Neo360Page() {
    const params = useParams();
    const slug = params.slug as string;
    
    const handleStartTour = () => {
        window.location.href = `/neo/${slug}/tour`;
    };
    
    return (
        <section className="py-16 bg-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Immersive 360° Experience
                    </h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Step inside and explore every corner of your future home with our interactive virtual tour.
                    </p>
                </div>

                {/* Main Preview with Interactive Button */}
                <div className="relative max-w-4xl mx-auto">
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl group cursor-pointer" onClick={handleStartTour}>
                        {/* Preview Image */}
                        <Image
                            src={`/assets/neo/${slug}/360/hero-preview.jpg`}
                            alt="360° Tour Preview"
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            onError={(e) => {
                                // Fallback to example image
                                e.currentTarget.src = `/assets/neo/${slug}/example/light.jpg`;
                                e.currentTarget.onerror = () => {
                                    // Final fallback to texture
                                    if (e.currentTarget) {
                                        e.currentTarget.src = '/assets/neo/texrure/thumb-white.jpg';
                                    }
                                };
                            }}
                        />
                        
                        {/* Dark Overlay */}
                        {/* <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300" /> */}
                        
                        {/* Central Large Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white bg-opacity-95 group-hover:bg-opacity-100 rounded-full p-8 shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                                {/* Large Play Icon */}
                                <div className="text-slate-800 group-hover:text-blue-600 transition-colors relative flex items-center justify-center">
                                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                    
                                </div>
                            </div>
                        </div>
                        
                      
                        
                      
                        
                        {/* Animated Border Effect */}
                        <div className="absolute inset-0 border-4 border-transparent group-hover:border-blue-400 rounded-xl transition-all duration-300" />
                    </div>
                    
                    {/* Call to Action Button */}
                    <div className="text-center mt-8">
                        <button 
                            onClick={handleStartTour}
                            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                        >
                            <span className="mr-3 text-xl">🚀</span>
                            Launch Virtual Tour
                            <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                        
                        <p className="text-gray-400 text-sm mt-4">
                            🏠 Experience the immersive interior design of your future home
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}