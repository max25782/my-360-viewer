'use client';

import { useEffect, useMemo } from 'react';

// Redux imports
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCollection, setMounted } from '../store/slices/designSlice';
import {
  selectSelectedCollection,
  selectIsMounted,
  selectCollectionBasePaths,
  selectCollectionThumbnails,
  selectCurrentCollectionImage,
} from '../store/selectors/designSelectors';

interface DesignCollectionSelectorProps {
  houseName: string;
  houseId: string;
}

export default function DesignCollectionSelectorRedux({ houseName, houseId }: DesignCollectionSelectorProps) {
  const dispatch = useAppDispatch();
  
  // Redux selectors with automatic memoization
  const selectedCollection = useAppSelector(selectSelectedCollection);
  const isMounted = useAppSelector(selectIsMounted);
  const currentCollectionImage = useAppSelector(selectCurrentCollectionImage(houseId));
  const thumbnailData = useAppSelector(selectCollectionThumbnails(houseId));

  useEffect(() => {
    dispatch(setMounted(true));
  }, [dispatch]);

  // Memoized URL handler to avoid hydration mismatch
  const getImageUrl = useMemo(() => {
    return (path: string) => {
      if (isMounted && typeof window !== 'undefined') {
        return `${window.location.origin}${path}`;
      }
      return path;
    };
  }, [isMounted]);

  // Memoized handler to prevent unnecessary re-renders
  const handleCollectionChange = useMemo(() => {
    return (collection: typeof selectedCollection) => {
      dispatch(setCollection(collection));
    };
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <div 
          className="aspect-video relative"
          style={{
            backgroundImage: `url('${getImageUrl(currentCollectionImage)}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
        </div>
      </div>
      
      {/* Design Collection Thumbnails with Names */}
      <div className="flex justify-center space-x-6">
        {thumbnailData.map((thumb, index) => (
          <div key={`${thumb.collection}-${index}`} className="text-center">
            <button 
              onClick={() => handleCollectionChange(thumb.collection)}
              className={`w-16 h-12 rounded shadow-sm transition-all hover:scale-105 mb-2 block ${
                selectedCollection === thumb.collection 
                  ? 'border-4 border-blue-500' 
                  : 'border-2 border-white hover:border-gray-300'
              }`}
              style={{
                backgroundImage: `url('${getImageUrl(thumb.path)}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              title={`Select ${thumb.collection} collection`}
            />
            <div className={`text-xs transition-colors ${
              selectedCollection === thumb.collection 
                ? 'text-blue-600 font-bold' 
                : 'text-gray-600'
            }`}>
              {thumb.collection === 'heritage' && 'Heritage (DC1)'}
              {thumb.collection === 'haven' && 'Haven (DC2)'}
              {thumb.collection === 'serenity' && 'Serenity (DC3)'}
              {thumb.collection === 'luxe' && 'Luxe (DC4)'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
