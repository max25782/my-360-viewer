/**
 * UNIVERSAL REDUX SELECTORS
 * Мемоизированные селекторы для оптимальной производительности с 30+ домами
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Base selectors
const selectUniversalState = (state: RootState) => state.universal;
const selectHouseAssets = (state: RootState) => state.universal.houseAssets;
const selectSelections = (state: RootState) => state.universal.selections;
const selectLoading = (state: RootState) => state.universal.loading;

// Параметризированные селекторы для конкретного дома
export const selectHouseAssetsById = (houseId: string) =>
  createSelector(
    [selectHouseAssets],
    (houseAssets) => houseAssets[houseId]
  );

export const selectHouseSelectionById = (houseId: string) =>
  createSelector(
    [selectSelections],
    (selections) => selections[houseId]
  );

export const selectIsHouseLoading = (houseId: string) =>
  createSelector(
    [selectLoading],
    (loading) => loading[houseId] || false
  );

export const selectIsImageLoading = (houseId: string) =>
  createSelector(
    [selectLoading],
    (loading) => loading[`${houseId}_image`] || false
  );

// Комплексные селекторы с мемоизацией
export const selectExteriorPackages = (houseId: string) =>
  createSelector(
    [selectHouseAssetsById(houseId)],
    (houseAssets) => houseAssets?.exteriorPackages || []
  );

export const selectInteriorPackages = (houseId: string) =>
  createSelector(
    [selectHouseAssetsById(houseId)],
    (houseAssets) => houseAssets?.interiorPackages || []
  );

export const selectAvailableRooms = (houseId: string) =>
  createSelector(
    [selectHouseAssetsById(houseId)],
    (houseAssets) => houseAssets?.availableRooms || []
  );

export const selectTour360Config = (houseId: string) =>
  createSelector(
    [selectHouseAssetsById(houseId)],
    (houseAssets) => houseAssets?.tour360Config
  );

export const selectHasTour360 = (houseId: string) =>
  createSelector(
    [selectHouseAssetsById(houseId)],
    (houseAssets) => houseAssets?.tour360Available || false
  );

// Селекторы для текущего выбора
export const selectSelectedExteriorPackage = (houseId: string) =>
  createSelector(
    [selectHouseSelectionById(houseId), selectExteriorPackages(houseId)],
    (selection, packages) => {
      if (!selection || !packages.length) return null;
      return packages[selection.selectedExteriorPackage] || packages[0];
    }
  );

export const selectSelectedInteriorPackage = (houseId: string) =>
  createSelector(
    [selectHouseSelectionById(houseId), selectInteriorPackages(houseId)],
    (selection, packages) => {
      if (!selection || !packages.length) return null;
      return packages[selection.selectedInteriorPackage] || packages[0];
    }
  );

export const selectSelectedRoom = (houseId: string) =>
  createSelector(
    [selectHouseSelectionById(houseId), selectAvailableRooms(houseId)],
    (selection, rooms) => {
      if (!selection || !rooms.length) return 'living';
      return selection.selectedRoom || rooms[0] || 'living';
    }
  );

// Селекторы для изображений
export const selectCurrentExteriorImage = (houseId: string) =>
  createSelector(
    [selectHouseSelectionById(houseId)],
    (selection) => selection?.currentExteriorImage || ''
  );

export const selectCurrentInteriorImage = (houseId: string) =>
  createSelector(
    [selectHouseSelectionById(houseId)],
    (selection) => selection?.currentInteriorImage || ''
  );

export const selectCurrentInteriorPhotos = (houseId: string) =>
  createSelector(
    [selectHouseSelectionById(houseId)],
    (selection) => selection?.currentInteriorPhotos || []
  );

export const selectCurrentPhotoIndex = (houseId: string) =>
  createSelector(
    [selectHouseSelectionById(houseId)],
    (selection) => selection?.currentPhotoIndex || 0
  );

// Комбинированные селекторы для UI
export const selectExteriorThumbnails = (houseId: string) =>
  createSelector(
    [selectExteriorPackages(houseId)],
    (packages) => 
      packages.map((pkg, index) => ({
        package: pkg,
        index,
        thumbnailPath: `/assets/texture/exterior/thumb${pkg.dp}.jpg`
      }))
  );

export const selectInteriorThumbnails = (houseId: string) =>
  createSelector(
    [selectInteriorPackages(houseId)],
    (packages) => 
      packages.map((pkg, index) => ({
        package: pkg,
        index,
        thumbnailPath: `/assets/texture/interior/colors${pkg.pk}.jpg`
      }))
  );

// Селектор для проверки готовности данных
export const selectIsHouseDataReady = (houseId: string) =>
  createSelector(
    [
      selectHouseAssetsById(houseId),
      selectHouseSelectionById(houseId),
      selectIsHouseLoading(houseId)
    ],
    (houseAssets, selection, loading) => {
      return !loading && 
             !!houseAssets && 
             !!selection && 
             houseAssets.exteriorPackages.length > 0;
    }
  );

// Селектор для кэш статистики (для отладки)
export const selectCacheStats = createSelector(
  [selectUniversalState],
  (universal) => {
    const houseCount = Object.keys(universal.houseAssets).length;
    const totalPackages = Object.values(universal.houseAssets).reduce(
      (total, house) => total + house.exteriorPackages.length + house.interiorPackages.length,
      0
    );
    const cacheAge = Date.now() - universal.lastGlobalUpdate;
    
    return {
      cachedHouses: houseCount,
      totalPackages,
      cacheAge: Math.floor(cacheAge / 1000), // seconds
      cacheTimeout: Math.floor(universal.cacheTimeout / 1000) // seconds
    };
  }
);

// Error selector
export const selectUniversalError = createSelector(
  [selectUniversalState],
  (universal) => universal.error
);
