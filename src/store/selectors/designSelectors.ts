import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Base selectors
export const selectDesignState = (state: RootState) => state.design;

// Simple selectors
export const selectSelectedCollection = createSelector(
  [selectDesignState],
  (design) => design.selectedCollection
);

export const selectSelectedInterior = createSelector(
  [selectDesignState],
  (design) => design.selectedInterior
);

export const selectCurrentRoomIndex = createSelector(
  [selectDesignState],
  (design) => design.currentRoomIndex
);

export const selectCurrentImageIndex = createSelector(
  [selectDesignState],
  (design) => design.currentImageIndex
);

export const selectIsMounted = createSelector(
  [selectDesignState],
  (design) => design.isMounted
);

// Design Collection Data
export const selectCollectionBasePaths = createSelector(
  [selectDesignState],
  () => ({
    heritage: '/Walnut/walnut_color/Walnut-PK1-EXT-BEST-PK1-WALNUT-FRONT.jpg',
    haven: '/Walnut/walnut_color/Walnut-PK2-EXT-BEST-PK2-WALNUT-FRONT.jpg',
    serenity: '/Walnut/walnut_color/Walnut-PK3-EXT-BEST-PK3-WALNUT-FRONT.jpg',
    luxe: '/Walnut/walnut_color/Walnut-PK4-EXT-BEST-PK4-WALNUT-FRONT.jpg'
  })
);

export const selectCollectionThumbnails = createSelector(
  [selectDesignState],
  () => [
    { path: '/Walnut/walnut_color/design-package-thumb-1.jpg', collection: 'heritage' as const },
    { path: '/Walnut/walnut_color/design-package-thumb-2.jpg', collection: 'haven' as const },
    { path: '/Walnut/walnut_color/design-package-thumb-3.jpg', collection: 'serenity' as const },
    { path: '/Walnut/walnut_color/design-package-thumb-4.jpg', collection: 'luxe' as const }
  ]
);

export const selectCurrentCollectionImage = createSelector(
  [selectSelectedCollection, selectCollectionBasePaths],
  (collection, basePaths) => basePaths[collection]
);

// Interior Design Data
export const selectStyleToPackage = createSelector(
  [selectDesignState],
  () => ({
    modern: 'PK1',
    classic: 'PK2', 
    rustic: 'PK3',
    luxury: 'PK4'
  })
);

export const selectRoomTypes = createSelector(
  [selectDesignState],
  () => [
    { name: 'Living Room', folder: 'walnut_liv' },
    { name: 'Bathroom', folder: 'walnut_bathroom' },
    { name: 'Bedroom', folder: 'walnut_bedroom' },
    { name: 'Kitchen', folder: 'walnut_kitchen' }
  ]
);

export const selectStyleRoomImages = createSelector(
  [selectDesignState],
  () => ({
    modern: {
      'Living Room': [
        '/Walnut/walnut_color/walnut_liv/Walnut-PK1-LIV-1.jpg',
        '/Walnut/walnut_color/walnut_liv/Walnut-PK1-LIV-2.jpg'
      ],
      'Bathroom': [
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK1-BATHROOM-1.jpg',
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK1-BATHROOM-2.jpg'
      ],
      'Bedroom': [
        '/Walnut/walnut_color/walnut_bedroom/Walnut-PK1-BEDROOM.jpg'
      ],
      'Kitchen': [
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK1-KITCHEN-1.jpg',
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK1-KITCHEN-2.jpg'
      ]
    },
    classic: {
      'Living Room': [
        '/Walnut/walnut_color/walnut_liv/Walnut-PK2-LIV-PK-2.jpg',
        '/Walnut/walnut_color/walnut_liv/Walnut-PK2-LIV-2-PK-2.jpg'
      ],
      'Bathroom': [
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK2-BATHROOM-PK2.jpg',
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK2-BATHROOM-2-PK2.jpg'
      ],
      'Bedroom': [
        '/Walnut/walnut_color/walnut_bedroom/Walnut-PK2-BEDROOM-PK2.jpg'
      ],
      'Kitchen': [
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK2-KITCHEN-1-PK2.jpg',
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK2-KITCHEN-2-PK2.jpg'
      ]
    },
    rustic: {
      'Living Room': [
        '/Walnut/walnut_color/walnut_liv/Walnut-PK3-LIV-PK3.jpg',
        '/Walnut/walnut_color/walnut_liv/Walnut-PK3-LIV-2-PK3.jpg'
      ],
      'Bathroom': [
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK3-PK3-BATHROOM.jpg',
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK3-BATHROOM-2-PK3.jpg'
      ],
      'Bedroom': [
        '/Walnut/walnut_color/walnut_bedroom/Walnut-PK3-BEDROOM-PK3.jpg'
      ],
      'Kitchen': [
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK3-KITCHEN-1-PK3.jpg',
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK3-KITCHEN-2-PK3.jpg'
      ]
    },
    luxury: {
      'Living Room': [
        '/Walnut/walnut_color/walnut_liv/Walnut-PK4-LIV-PK4.jpg',
        '/Walnut/walnut_color/walnut_liv/Walnut-PK4-LIV-2-PK4.jpg'
      ],
      'Bathroom': [
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK4-BATHROOM-PK4.jpg',
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK4-BATHROOM-2-PK4.jpg'
      ],
      'Bedroom': [
        '/Walnut/walnut_color/walnut_bedroom/Walnut-PK4-BEDROOM-PK4.jpg'
      ],
      'Kitchen': [
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK4-KITCHEN-1-PK4.jpg',
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK4-KITCHEN-2-PK4.jpg'
      ]
    }
  })
);

export const selectInteriorThumbnails = createSelector(
  [selectDesignState],
  () => [
    { path: '/Walnut/walnut_color/interior-colors-1-768x384.jpg', interior: 'modern' as const },
    { path: '/Walnut/walnut_color/interior-colors-2-768x384.jpg', interior: 'classic' as const },
    { path: '/Walnut/walnut_color/interior-colors-3-768x384.jpg', interior: 'rustic' as const },
    { path: '/Walnut/walnut_color/interior-colors-4-768x384.jpg', interior: 'luxury' as const }
  ]
);

// Complex derived selectors
export const selectCurrentStyleRooms = createSelector(
  [selectSelectedInterior, selectStyleRoomImages, selectRoomTypes],
  (selectedInterior, styleRoomImages, roomTypes) => {
    const currentStyleImages = styleRoomImages[selectedInterior];
    return roomTypes.map(room => ({
      name: room.name,
      images: currentStyleImages[room.name as keyof typeof currentStyleImages]
    }));
  }
);

export const selectCurrentRoom = createSelector(
  [selectCurrentStyleRooms, selectCurrentRoomIndex],
  (rooms, roomIndex) => rooms[roomIndex] || null
);

export const selectCurrentRoomImages = createSelector(
  [selectCurrentRoom],
  (room) => room?.images || []
);

export const selectCurrentImage = createSelector(
  [selectCurrentRoomImages, selectCurrentImageIndex],
  (images, imageIndex) => images[imageIndex] || ''
);

export const selectCurrentPackage = createSelector(
  [selectSelectedInterior, selectStyleToPackage],
  (selectedInterior, styleToPackage) => styleToPackage[selectedInterior]
);

// Navigation selectors for optimization
export const selectCanNavigateNext = createSelector(
  [selectCurrentImageIndex, selectCurrentRoomImages, selectCurrentRoomIndex, selectCurrentStyleRooms],
  (imageIndex, roomImages, roomIndex, styleRooms) => {
    return imageIndex < roomImages.length - 1 || roomIndex < styleRooms.length - 1;
  }
);

export const selectCanNavigatePrev = createSelector(
  [selectCurrentImageIndex, selectCurrentRoomIndex],
  (imageIndex, roomIndex) => {
    return imageIndex > 0 || roomIndex > 0;
  }
);
