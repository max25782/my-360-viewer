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
// Create a dynamic selector that accepts houseId
export const selectCollectionBasePaths = (houseId: string) =>
  createSelector(
    [selectDesignState],
    () => {
      if (houseId === 'walnut') {
        return {
          heritage: '/assets/Walnut/walnut_color/Walnut-PK1-EXT-BEST-PK1-WALNUT-FRONT.jpg',
          haven: '/assets/Walnut/walnut_color/Walnut-PK2-EXT-BEST-PK2-WALNUT-FRONT.jpg',
          serenity: '/assets/Walnut/walnut_color/Walnut-PK3-EXT-BEST-PK3-WALNUT-FRONT.jpg',
          luxe: '/assets/Walnut/walnut_color/Walnut-PK4-EXT-BEST-PK4-WALNUT-FRONT.jpg'
        };
      }
      
      // Standard structure for new houses - handle both jpg and jpeg extensions
      const getExteriorImagePath = (dpNumber: number) => {
        // Handle special cases where certain DPs don't exist
        if (houseId === 'laurel' && dpNumber === 4) {
          // Laurel doesn't have DP4, fallback to DP3
          return `/assets/laurel/exterior/Exterior-DP3.jpg`;
        }
        
        if (houseId === 'tamarack' && dpNumber === 4) {
          // Tamarack doesn't have DP4, fallback to DP3
          return `/assets/tamarack/exterior/Exterior-DP3.jpg`;
        }
        
        if (houseId === 'ponderosa' && dpNumber === 4) {
          // Ponderosa doesn't have DP4, fallback to DP3
          return `/assets/ponderosa/exterior/Exterior-DP3.jpg`;
        }
        
        // Define which houses use jpeg for specific DP numbers
        const houseExtensions: { [key: string]: { [key: number]: string } } = {
          // Add houses that have .jpeg for specific DPs
          // Most houses use .jpeg for DP4
          'birch': { 1: 'jpeg', 4: 'jpeg' },
          'cypress': { 4: 'jpeg' },
          'hemlock': { 4: 'jpeg', 1: 'jpeg', 2: 'jpeg', 3: 'jpeg' },
          // 'juniper': { 4: 'jpeg' }, // Juniper uses .jpg for all DPs
          // 'laurel': { 4: 'jpeg' }, // Laurel doesn't have DP4, fallback to DP3
          'oak': { 2: 'jpeg', 3: 'jpeg', 4: 'jpeg' }, // Note: houseId is 'oak' but directory is 'Oak'
          // 'pine': { 4: 'jpeg' }, // Pine uses .jpg for DP4, not .jpeg
          // 'ponderosa': { 4: 'jpeg' }, // Ponderosa doesn't have DP4, fallback to DP3
          'sage': { 1: 'jpeg', 2: 'jpeg', 3: 'jpeg', 4: 'jpeg' }, // All DPs are .jpeg for sage
          'sapling': { 1: 'jpeg' }, // DP1 is .jpeg, DP2,3,4 are .jpg
          'spruce': { 1: 'jpeg', 2: 'jpeg', 3: 'jpeg', 4: 'jpeg' }, // All DPs are .jpeg for spruce
          // 'tamarack': { 4: 'jpeg' }, // Tamarack doesn't have DP4, fallback to DP3
          // Add more specific mappings as needed
        };
        
        // Handle case-sensitive directory names (e.g., 'oak' -> 'Oak')
        const directoryName = houseId === 'oak' ? 'Oak' : houseId;
        
        // Try specific extension first, then fallback to trying both jpg and jpeg
        const specificExtension = houseExtensions[houseId]?.[dpNumber];
        if (specificExtension) {
          return `/assets/${directoryName}/exterior/Exterior-DP${dpNumber}.${specificExtension}`;
        }
        
        // For houses not in the mapping, create paths for both extensions
        // The browser/image component will handle which one actually exists
        // We'll default to jpg but this allows flexibility
        return `/assets/${directoryName}/exterior/Exterior-DP${dpNumber}.jpg`;
      };
      
      return {
        heritage: getExteriorImagePath(1),
        haven: getExteriorImagePath(2), 
        serenity: getExteriorImagePath(3),
        luxe: getExteriorImagePath(4)
      };
    }
  );

export const selectCollectionThumbnails = (houseId: string) =>
  createSelector(
    [selectDesignState],
    () => {
      // Use Walnut's design-package-thumb for ALL houses as universal design collection thumbnails
      // These represent the standard Heritage, Haven, Serenity, Luxe design packages
      return [
        { path: '/assets/Walnut/walnut_color/design-package-thumb-1.jpg', collection: 'heritage' as const },
        { path: '/assets/Walnut/walnut_color/design-package-thumb-2.jpg', collection: 'haven' as const },
        { path: '/assets/Walnut/walnut_color/design-package-thumb-3.jpg', collection: 'serenity' as const },
        { path: '/assets/Walnut/walnut_color/design-package-thumb-4.jpg', collection: 'luxe' as const }
      ];
    }
  );

export const selectCurrentCollectionImage = (houseId: string) =>
  createSelector(
    [selectSelectedCollection, selectCollectionBasePaths(houseId)],
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

export const selectStyleRoomImages = (houseId: string) =>
  createSelector(
    [selectDesignState],
    () => {
      if (houseId === 'walnut') {
        return {
          modern: {
            'Living Room': [
              '/assets/Walnut/walnut_color/walnut_liv/Walnut-PK1-LIV-1.jpg',
              '/assets/Walnut/walnut_color/walnut_liv/Walnut-PK1-LIV-2.jpg'
            ],
            'Bathroom': [
              '/assets/Walnut/walnut_color/walnut_bathroom/Walnut-PK1-BATHROOM-1.jpg',
              '/assets/Walnut/walnut_color/walnut_bathroom/Walnut-PK1-BATHROOM-2.jpg'
            ],
            'Bedroom': [
              '/assets/Walnut/walnut_color/walnut_bedroom/Walnut-PK1-BEDROOM.jpg'
            ],
            'Kitchen': [
              '/assets/Walnut/walnut_color/walnut_kitchen/Walnut-PK1-KITCHEN-1.jpg',
              '/assets/Walnut/walnut_color/walnut_kitchen/Walnut-PK1-KITCHEN-2.jpg'
            ]
          },
          classic: {
            'Living Room': [
              '/assets/Walnut/walnut_color/walnut_liv/Walnut-PK2-LIV-PK-2.jpg',
              '/assets/Walnut/walnut_color/walnut_liv/Walnut-PK2-LIV-2-PK-2.jpg'
            ],
            'Bathroom': [
              '/assets/Walnut/walnut_color/walnut_bathroom/Walnut-PK2-BATHROOM-PK2.jpg',
              '/assets/Walnut/walnut_color/walnut_bathroom/Walnut-PK2-BATHROOM-2-PK2.jpg'
            ],
            'Bedroom': [
              '/assets/Walnut/walnut_color/walnut_bedroom/Walnut-PK2-BEDROOM-PK2.jpg'
            ],
            'Kitchen': [
              '/assets/Walnut/walnut_color/walnut_kitchen/Walnut-PK2-KITCHEN-1-PK2.jpg',
              '/assets/Walnut/walnut_color/walnut_kitchen/Walnut-PK2-KITCHEN-2-PK2.jpg'
            ]
          },
          rustic: {
            'Living Room': [
              '/assets/Walnut/walnut_color/walnut_liv/Walnut-PK3-LIV-PK3.jpg',
              '/assets/Walnut/walnut_color/walnut_liv/Walnut-PK3-LIV-2-PK3.jpg'
            ],
            'Bathroom': [
              '/assets/Walnut/walnut_color/walnut_bathroom/Walnut-PK3-PK3-BATHROOM.jpg',
              '/assets/Walnut/walnut_color/walnut_bathroom/Walnut-PK3-BATHROOM-2-PK3.jpg'
            ],
            'Bedroom': [
              '/assets/Walnut/walnut_color/walnut_bedroom/Walnut-PK3-BEDROOM-PK3.jpg'
            ],
            'Kitchen': [
              '/assets/Walnut/walnut_color/walnut_kitchen/Walnut-PK3-KITCHEN-1-PK3.jpg',
              '/assets/Walnut/walnut_color/walnut_kitchen/Walnut-PK3-KITCHEN-2-PK3.jpg'
            ]
          },
          luxury: {
            'Living Room': [
              '/assets/Walnut/walnut_color/walnut_liv/Walnut-PK4-LIV-PK4.jpg',
              '/assets/Walnut/walnut_color/walnut_liv/Walnut-PK4-LIV-2-PK4.jpg'
            ],
            'Bathroom': [
              '/assets/Walnut/walnut_color/walnut_bathroom/Walnut-PK4-BATHROOM-PK4.jpg',
              '/assets/Walnut/walnut_color/walnut_bathroom/Walnut-PK4-BATHROOM-2-PK4.jpg'
            ],
            'Bedroom': [
              '/assets/Walnut/walnut_color/walnut_bedroom/Walnut-PK4-BEDROOM-PK4.jpg'
            ],
            'Kitchen': [
              '/assets/Walnut/walnut_color/walnut_kitchen/Walnut-PK4-KITCHEN-1-PK4.jpg',
              '/assets/Walnut/walnut_color/walnut_kitchen/Walnut-PK4-KITCHEN-2-PK4.jpg'
            ]
          }
        };
      }
      
      // Standard structure for new houses - handle different naming patterns per house
      const houseName = houseId.charAt(0).toUpperCase() + houseId.slice(1);
      
      // Define naming patterns for each house
      const getImagePath = (room: string, dpNumber: number) => {
        const roomName = room === 'LIV' ? 'Living' : 
                        room === 'BATHROOM' ? 'Bathroom' : 
                        room === 'BEDROOM' ? 'Bedroom' : 'Kitchen';
                        
        // House-specific patterns to match actual file names
        switch (houseId) {
          case 'birch':
            return `/assets/${houseId}/interior/${room}/${houseName}_Sapling-${roomName}-DP${dpNumber}.jpg`;
          case 'cypress':
            return `/assets/${houseId}/interior/${room}/${houseName}-INT-BEST-PK${dpNumber}-${room}.jpg`;
          case 'hemlock':
            return `/assets/${houseId}/interior/${room}/${houseName}-${roomName}-DP${dpNumber}.jpg`;
          case 'juniper':
            // Juniper has BEDROOM and KITCHEN with inconsistent naming
            // No BATHROOM or LIV interior photos exist
            if (room === 'BEDROOM') {
              if (dpNumber === 1) {
                return `/assets/${houseId}/interior/BEDROOM/PK1-BDRM-PLAT.jpg`;
              } else if (dpNumber === 2) {
                return `/assets/${houseId}/interior/BEDROOM/PK2-PLAT-BEDROOM.jpg`;
              } else {
                // PK3, PK4 fallback to PK3
                return `/assets/${houseId}/interior/BEDROOM/PK3-BDRM-PLAT.jpg`;
              }
            } else if (room === 'KITCHEN') {
              if (dpNumber === 1) {
                return `/assets/${houseId}/interior/KITCHEN/PK1-KIT-PLAT.jpg`;
              } else if (dpNumber === 2) {
                return `/assets/${houseId}/interior/KITCHEN/PK2-PLAT-KITCHEN.jpg`;
              } else if (dpNumber === 3) {
                return `/assets/${houseId}/interior/KITCHEN/PK3-KIT-PLAT-2.jpg`;
              } else {
                // PK4
                return `/assets/${houseId}/interior/KITCHEN/PK4-KIT-PLAT.jpg`;
              }
            } else {
              // BATHROOM, LIV fallback to bedroom
              if (dpNumber === 1) {
                return `/assets/${houseId}/interior/BEDROOM/PK1-BDRM-PLAT.jpg`;
              } else if (dpNumber === 2) {
                return `/assets/${houseId}/interior/BEDROOM/PK2-PLAT-BEDROOM.jpg`;
              } else {
                // PK3, PK4 fallback to PK3
                return `/assets/${houseId}/interior/BEDROOM/PK3-BDRM-PLAT.jpg`;
              }
            }
          case 'laurel':
            // Laurel has specific naming inconsistencies:
            // BEDROOM: PK1,PK2 have -1 suffix, PK3,PK4 don't
            // KITCHEN: PK4 is missing LAUREL in the name
            // LIV: PK4 doesn't exist, fallback to PK3
            if (room === 'BEDROOM' && (dpNumber === 1 || dpNumber === 2)) {
              return `/assets/${houseId}/interior/${room}/INT-BEST-PK${dpNumber}-${houseName.toUpperCase()}-${room}-1.jpg`;
            } else if (room === 'KITCHEN' && dpNumber === 4) {
              return `/assets/${houseId}/interior/${room}/INT-BEST-PK4-KITCHEN.jpg`;
            } else if (room === 'LIV' && dpNumber === 4) {
              // PK4 doesn't exist for LIV, fallback to PK3
              return `/assets/${houseId}/interior/${room}/INT-BEST-PK3-${houseName.toUpperCase()}-${room}.jpg`;
            } else {
              return `/assets/${houseId}/interior/${room}/INT-BEST-PK${dpNumber}-${houseName.toUpperCase()}-${room}.jpg`;
            }
          case 'Oak':
            return `/assets/${houseId}/interior/${room}/${houseName}-${roomName}-DP${dpNumber}.jpg`;
          case 'pine':
            // Pine has specific naming for LIV room:
            // LIV: uses "LIVING-AREA" instead of "LIV", PK4 missing
            // Other rooms: standard naming
            if (room === 'LIV') {
              if (dpNumber === 4) {
                // PK4 doesn't exist for LIV, fallback to PK3
                return `/assets/${houseId}/interior/${room}/${houseName}-PK3-LIVING-AREA.jpg`;
              } else {
                return `/assets/${houseId}/interior/${room}/${houseName}-PK${dpNumber}-LIVING-AREA.jpg`;
              }
            } else {
              return `/assets/${houseId}/interior/${room}/${houseName}-PK${dpNumber}-${room}.jpg`;
            }
          case 'ponderosa':
            // Ponderosa has specific naming patterns:
            // BATHROOM, BEDROOM: have "BEST" in the name
            // LIV: uses "BEST-LIVING-AREA" instead of "LIV", PK4 missing
            // KITCHEN: standard naming
            if (room === 'BATHROOM' || room === 'BEDROOM') {
              return `/assets/${houseId}/interior/${room}/${houseName}-PK${dpNumber}-BEST-${room}.jpg`;
            } else if (room === 'LIV') {
              if (dpNumber === 4) {
                // PK4 doesn't exist for LIV, fallback to PK3
                return `/assets/${houseId}/interior/${room}/${houseName}-PK3-BEST-LIVING-AREA.jpg`;
              } else {
                return `/assets/${houseId}/interior/${room}/${houseName}-PK${dpNumber}-BEST-LIVING-AREA.jpg`;
              }
            } else {
              // KITCHEN uses standard naming
              return `/assets/${houseId}/interior/${room}/${houseName}-PK${dpNumber}-${room}.jpg`;
            }
          case 'sage':
            return `/assets/${houseId}/interior/${room}/Spruce_Sage-${roomName}-DP${dpNumber}.jpg`;
          case 'sapling':
            return `/assets/${houseId}/interior/${room}/${houseName}_Sapling-${roomName}-DP${dpNumber}.jpg`;
          case 'spruce':
            return `/assets/${houseId}/interior/${room}/Spruce_Sage-${roomName}-DP${dpNumber}.jpg`;
          case 'tamarack':
            // Tamarack has specific naming for LIV room:
            // PK1,PK2: LIVING-AREA, PK3: LIVING-ROOM, PK4: doesn't exist
            if (room === 'LIV') {
              if (dpNumber === 1 || dpNumber === 2) {
                return `/assets/${houseId}/interior/${room}/INT-BEST-PK${dpNumber}-${houseName.toUpperCase()}-LIVING-AREA.jpg`;
              } else if (dpNumber === 3) {
                return `/assets/${houseId}/interior/${room}/INT-BEST-PK3-${houseName.toUpperCase()}-LIVING-ROOM.jpg`;
              } else if (dpNumber === 4) {
                // PK4 doesn't exist, fallback to PK3
                return `/assets/${houseId}/interior/${room}/INT-BEST-PK3-${houseName.toUpperCase()}-LIVING-ROOM.jpg`;
              }
            }
            return `/assets/${houseId}/interior/${room}/INT-BEST-PK${dpNumber}-${houseName.toUpperCase()}-${room}.jpg`;
          default:
            // Generic pattern for other houses
            return `/assets/${houseId}/interior/${room}/${houseName}-${roomName}-DP${dpNumber}.jpg`;
        }
      };

      return {
        modern: {
          'Living Room': [getImagePath('LIV', 1)],
          'Bathroom': [getImagePath('BATHROOM', 1)],
          'Bedroom': [getImagePath('BEDROOM', 1)],
          'Kitchen': [getImagePath('KITCHEN', 1)]
        },
        classic: {
          'Living Room': [getImagePath('LIV', 2)],
          'Bathroom': [getImagePath('BATHROOM', 2)],
          'Bedroom': [getImagePath('BEDROOM', 2)],
          'Kitchen': [getImagePath('KITCHEN', 2)]
        },
        rustic: {
          'Living Room': [getImagePath('LIV', 3)],
          'Bathroom': [getImagePath('BATHROOM', 3)],
          'Bedroom': [getImagePath('BEDROOM', 3)],
          'Kitchen': [getImagePath('KITCHEN', 3)]
        },
        luxury: {
          'Living Room': [getImagePath('LIV', 4)],
          'Bathroom': [getImagePath('BATHROOM', 4)],
          'Bedroom': [getImagePath('BEDROOM', 4)],
          'Kitchen': [getImagePath('KITCHEN', 4)]
        }
      };
    }
  );

export const selectInteriorThumbnails = (houseId: string) =>
  createSelector(
    [selectDesignState],
    () => {
      // Use Walnut's interior-colors for ALL houses as universal color palette thumbnails
      // These represent the standard Modern, Classic, Rustic, Luxury color schemes
      return [
        { path: '/assets/Walnut/walnut_color/interior-colors-1-768x384.jpg', interior: 'modern' as const },
        { path: '/assets/Walnut/walnut_color/interior-colors-2-768x384.jpg', interior: 'classic' as const },
        { path: '/assets/Walnut/walnut_color/interior-colors-3-768x384.jpg', interior: 'rustic' as const },
        { path: '/assets/Walnut/walnut_color/interior-colors-4-768x384.jpg', interior: 'luxury' as const }
      ];
    }
  );

// Complex derived selectors
export const selectCurrentStyleRooms = (houseId: string) =>
  createSelector(
    [selectSelectedInterior, selectStyleRoomImages(houseId), selectRoomTypes],
    (selectedInterior, styleRoomImages, roomTypes) => {
    const currentStyleImages = styleRoomImages[selectedInterior];
    return roomTypes.map(room => ({
      name: room.name,
      images: currentStyleImages[room.name as keyof typeof currentStyleImages]
    }));
  }
);

export const selectCurrentRoom = (houseId: string) =>
  createSelector(
    [selectCurrentStyleRooms(houseId), selectCurrentRoomIndex],
    (rooms, roomIndex) => rooms[roomIndex] || null
  );

export const selectCurrentRoomImages = (houseId: string) =>
  createSelector(
    [selectCurrentRoom(houseId)],
    (room) => room?.images || []
  );

export const selectCurrentImage = (houseId: string) =>
  createSelector(
    [selectCurrentRoomImages(houseId), selectCurrentImageIndex],
    (images, imageIndex) => images[imageIndex] || ''
  );

export const selectCurrentPackage = createSelector(
  [selectSelectedInterior, selectStyleToPackage],
  (selectedInterior, styleToPackage) => styleToPackage[selectedInterior]
);

// Navigation selectors for optimization
export const selectCanNavigateNext = (houseId: string) =>
  createSelector(
    [selectCurrentImageIndex, selectCurrentRoomImages(houseId), selectCurrentRoomIndex, selectCurrentStyleRooms(houseId)],
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
