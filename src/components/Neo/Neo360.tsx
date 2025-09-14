'use client'

import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Neo360PageProps {
    slug?: string;
    name?: string;
    description?: string;
}

export default function Neo360Page({ slug: propSlug, name, description }: Neo360PageProps = {}) {
    const params = useParams();
    
    // Очищаем все props от строк "undefined" и "null"
    const validPropSlug = propSlug && propSlug !== 'undefined' && propSlug !== 'null' ? propSlug : undefined;
    const validParamsSlug = params?.slug && params.slug !== 'undefined' && params.slug !== 'null' ? params.slug as string : undefined;
    const validName = name && name !== 'undefined' && name !== 'null' ? name : undefined;
    const validDescription = description && description !== 'undefined' && description !== 'null' ? description : undefined;
    
    let slug = validPropSlug || validParamsSlug;
    
    console.log(`🔍 Neo360Page: Component rendered!`);
    console.log(`🔍 Neo360Page: Received props - propSlug="${propSlug}" (type: ${typeof propSlug}), name="${name}", description="${description}"`);
    console.log(`🔍 Neo360Page: useParams result:`, params);
    console.log(`🔍 Neo360Page: Final slug="${slug}" (type: ${typeof slug})`);
    
    // Дополнительная диагностика
    if (propSlug === "undefined") {
        console.error(`❌ Neo360Page: propSlug is STRING "undefined"!`);
    }
    if (params?.slug === "undefined") {
        console.error(`❌ Neo360Page: params.slug is STRING "undefined"!`);
    }
    
    // Проверяем, что slug определен и не является строкой "undefined" или "null"
    if (!slug || slug === 'undefined' || slug === 'null') {
        // Вместо того чтобы использовать значение по умолчанию, 
        // возвращаем компонент с сообщением об ошибке
        return (
            <section className="py-16 bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Neo 360° Experience Error
                        </h2>
                        <p className="text-lg text-red-300 max-w-2xl mx-auto">
                            Unable to load Neo 360° experience. House identifier is missing.
                        </p>
                    </div>
                    
                    <div className="flex justify-center">
                        <a 
                            href="/neo"
                            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Neo Houses
                        </a>
                    </div>
                </div>
            </section>
        );
    }
    
    // Удаляем префикс neo- или Neo- если он есть
    if (slug && slug.toLowerCase().startsWith('neo-')) {
        slug = slug.substring(4);
    }
    
    // Дополнительная проверка после очистки префикса
    if (!slug || slug === 'undefined' || slug === 'null' || slug.trim() === '') {
        console.error(`❌ Neo360Page: Invalid slug after cleanup: "${slug}"`);
        return (
            <section className="py-16 bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Neo 360° Experience Error
                        </h2>
                        <p className="text-lg text-red-300 max-w-2xl mx-auto">
                            Unable to load Neo 360° experience. House identifier is invalid after processing.
                        </p>
                    </div>
                    
                    <div className="text-center">
                        <a 
                            href="/neo"
                            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Neo Houses
                        </a>
                    </div>
                </div>
            </section>
        );
    }
    
    console.log(`✅ Neo360Page: Using cleaned slug: "${slug}"`);
    
    const handleStartTour = () => {
        window.location.href = `/neo/${slug}/tour`;
    };
    
    return (
        <div className="w-full h-full relative">
            {/* Main Preview with Interactive Button */}
            <div className="relative w-full h-full">
                <div className="relative w-full h-full group cursor-pointer" onClick={handleStartTour}>
                        {/* Preview Image with optimized fallbacks for hero_black */}
                        <Image
                            src={slug && slug !== 'undefined' ? `/assets/neo/${slug}/360/hero_black.jpg` : '/assets/placeholder-360.jpg'}
                            alt="360° Tour Preview"
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            onError={(e) => {
                                console.log(`Trying fallback for Neo hero_black image: ${slug}`);
                                if (!slug || slug === 'undefined') {
                                    console.log(`Invalid slug for fallback: ${slug}`);
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.src = '/assets/placeholder-360.jpg';
                                    return;
                                }
                                // First fallback to hero_white
                                const target = e.currentTarget as HTMLImageElement;
                                target.src = `/assets/neo/${slug}/360/hero_white.jpg`;
                                target.onerror = () => {
                                    console.log(`Trying second fallback for Neo image: ${slug}`);
                                    // Second fallback to main hero image
                                    target.src = `/assets/neo/${slug}/hero.jpg`;
                                    target.onerror = () => {
                                        console.log(`Trying third fallback for Neo image: ${slug}`);
                                        // Third fallback to 360 hero images
                                        target.src = `/assets/neo/${slug}/360/hero_black.jpg`;
                                        target.onerror = () => {
                                            console.log(`Trying fourth fallback for Neo image: ${slug}`);
                                            // Fourth fallback to 360 hero white
                                            target.src = `/assets/neo/${slug}/360/hero_white.jpg`;
                                            target.onerror = () => {
                                                console.log(`All fallbacks failed for Neo image: ${slug}`);
                                                // Ultimate fallback to a generic placeholder
                                                target.src = '/assets/placeholder-360.jpg';
                                            };
                                        };
                                    };
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
                    </div>
                </div>
            </div>
    );
}