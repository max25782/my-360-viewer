'use client'

import { useParams } from 'next/navigation';
import NeoPanoramaViewerRedux from './NeoPanoramaViewerRedux';

export default function Neo360Redux() {
    const params = useParams();
    const slug = params.slug as string;
    
    return (
        <div className="h-screen w-full">
            <NeoPanoramaViewerRedux 
                houseId={slug} 
                selectedColor="dark" 
            />
        </div>
    );
}
