import { DEFAULT_VALUES } from '../constants/home';

/**
 * Navigate to next image
 */
export function getNextImageIndex(currentIndex: number, totalImages: number = DEFAULT_VALUES.IMAGE_COUNT): number {
  return (currentIndex + 1) % totalImages;
}

/**
 * Navigate to previous image
 */
export function getPreviousImageIndex(currentIndex: number, totalImages: number = DEFAULT_VALUES.IMAGE_COUNT): number {
  return (currentIndex - 1 + totalImages) % totalImages;
}

/**
 * Toggle item in array (for favorites, compare list)
 */
export function toggleItemInArray<T>(array: T[], item: T, maxItems?: number): T[] {
  if (array.includes(item)) {
    return array.filter(i => i !== item);
  } else if (maxItems && array.length >= maxItems) {
    return array; // Don't add if at max capacity
  } else {
    return [...array, item];
  }
}

/**
 * Check if can add to compare list
 */
export function canAddToCompare(compareList: string[], maxItems: number = DEFAULT_VALUES.MAX_COMPARE_ITEMS): boolean {
  return compareList.length < maxItems;
}

/**
 * Get collection data with dynamic favorites handling
 */
export function getCollectionDataWithFavorites(favoritesCount: number) {
  return {
    name: 'FAVORITES',
    code: 'SVD-1C',
    primaryColor: favoritesCount > 0 ? '#EAB308' : '#6B7280',
    gradient: favoritesCount > 0 
      ? 'linear-gradient(135deg, #ca8a04 0%, #eab308 100%)' 
      : 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
    activeGlow: favoritesCount > 0 ? 'rgba(234, 179, 8, 0.4)' : 'rgba(107, 114, 128, 0.4)'
  };
}
