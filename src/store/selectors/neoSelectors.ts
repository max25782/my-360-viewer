import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Базовые селекторы
export const selectNeoState = (state: RootState) => state.neo;

export const selectCurrentHouseId = (state: RootState) => state.neo.currentHouseId;
export const selectCurrentRoom = (state: RootState) => state.neo.currentRoom;
export const selectSelectedColor = (state: RootState) => state.neo.selectedColor;
export const selectAvailableRooms = (state: RootState) => state.neo.availableRooms;
export const selectIsViewerReady = (state: RootState) => state.neo.isViewerReady;
export const selectIsLoading = (state: RootState) => state.neo.isLoading;
export const selectCurrentPosition = (state: RootState) => state.neo.currentPosition;
export const selectError = (state: RootState) => state.neo.error;
export const selectScenesCache = (state: RootState) => state.neo.scenesCache;

// Производные селекторы
export const selectCurrentSceneKey = createSelector(
  [selectCurrentHouseId, selectCurrentRoom, selectSelectedColor],
  (houseId, room, color) => {
    if (!houseId || !room) return '';
    return `${houseId}_${room}_${color}`;
  }
);

export const selectCachedScene = createSelector(
  [selectScenesCache, selectCurrentSceneKey],
  (cache, sceneKey) => {
    return sceneKey ? cache[sceneKey] : null;
  }
);

export const selectHasError = createSelector(
  [selectError],
  (error) => error !== null
);

export const selectCanNavigate = createSelector(
  [selectIsViewerReady, selectIsLoading, selectHasError],
  (isReady, isLoading, hasError) => isReady && !isLoading && !hasError
);

export const selectRoomsByColor = createSelector(
  [selectAvailableRooms, selectSelectedColor],
  (rooms, color) => {
    return rooms.filter(room => room.includes(`_${color}`));
  }
);

export const selectCurrentRoomDisplayName = createSelector(
  [selectCurrentRoom],
  (room) => {
    if (!room) return '';
    
    const baseName = room.replace(/_white$|_dark$/, '');
    
    switch (baseName) {
      case 'entry': return 'Entry';
      case 'living': return 'Living Room';
      case 'kitchen': return 'Kitchen';
      case 'hall': return 'Hallway';
      case 'bedroom': return 'Bedroom 1';
      case 'bedroom2': return 'Bedroom 2';
      case 'badroom': return 'Bedroom 1';
      case 'badroom2': return 'Bedroom 2';
      case 'bathroom': return 'Bathroom 1';
      case 'bathroom2': return 'Bathroom 2';
      case 'wik': return 'Walk-in Closet';
      default: return baseName;
    }
  }
);

export const selectIsInitialized = createSelector(
  [selectCurrentHouseId, selectSelectedColor, selectAvailableRooms],
  (houseId, color, rooms) => {
    return Boolean(houseId && color && rooms.length > 0);
  }
);
