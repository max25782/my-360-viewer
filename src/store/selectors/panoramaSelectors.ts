import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { getHouseTour, getScene } from '../../data/tour-scenes';

// Base selectors
export const selectPanoramaState = (state: RootState) => state.panorama;

// Memoized selectors for better performance
export const selectCurrentHouseId = createSelector(
  [selectPanoramaState],
  (panorama) => panorama.currentHouseId
);

export const selectCurrentSceneKey = createSelector(
  [selectPanoramaState],
  (panorama) => panorama.currentSceneKey
);

export const selectIsViewerReady = createSelector(
  [selectPanoramaState],
  (panorama) => panorama.isViewerReady
);

export const selectIsLoading = createSelector(
  [selectPanoramaState],
  (panorama) => panorama.isLoading
);

export const selectCurrentPosition = createSelector(
  [selectPanoramaState],
  (panorama) => panorama.currentPosition
);

// Removed selectViewer and selectMarkersPlugin - these are now handled with refs

export const selectError = createSelector(
  [selectPanoramaState],
  (panorama) => panorama.error
);

// Complex selectors with data dependencies
export const selectHouseScenes = createSelector(
  [selectCurrentHouseId],
  (houseId) => houseId ? getHouseTour(houseId) : []
);

export const selectCurrentScene = createSelector(
  [selectCurrentSceneKey, selectCurrentHouseId],
  (sceneKey, houseId) => {
    if (!sceneKey || !houseId) return null;
    return getScene(sceneKey, houseId);
  }
);

export const selectInitialScene = createSelector(
  [selectHouseScenes],
  (scenes) => scenes.length > 0 ? scenes[0] : null
);

export const selectActiveScene = createSelector(
  [selectCurrentScene, selectInitialScene],
  (currentScene, initialScene) => currentScene || initialScene
);

// Removed selectViewerNeedsReset - viewer state is now handled with refs
