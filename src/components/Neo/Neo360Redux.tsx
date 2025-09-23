'use client'

import { useParams } from 'next/navigation';
import NeoPanoramaViewerRedux from './NeoPanoramaViewerRedux';

export default function Neo360Redux() {
    const params = useParams();
    const slug = params.slug as string;
    
    // Проверяем, что slug определен и не является строкой "undefined" или "null"
    if (!slug || slug === 'undefined' || slug === 'null') {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-900">
                <div className="text-center max-w-md mx-auto p-6">
                    {/* <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div> */}
                    <h2 className="text-xl font-semibold mb-2 text-white">Error Loading Neo 360° Tour</h2>
                    <p className="text-gray-300 mb-4">House identifier is missing or invalid.</p>
                    <a 
                        href="/neo"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Neo Houses
                    </a>
                </div>
            </div>
        );
    }
    
    // Удаляем префикс neo- или Neo- если он есть
    let cleanSlug = slug;
    if (cleanSlug && cleanSlug.toLowerCase().startsWith('neo-')) {
        cleanSlug = cleanSlug.substring(4);
    }
    
    return (
        <div className="h-screen w-full">
            <NeoPanoramaViewerRedux 
                houseId={cleanSlug} 
                selectedColor="dark" 
            />
        </div>
    );
}
