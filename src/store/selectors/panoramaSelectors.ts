import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

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
// Note: Tour data selectors removed - now handled by universalSelectors with JSON
// PanoramaViewerRedux uses local state with getTour360Config() instead

// Removed selectViewerNeedsReset - viewer state is now handled with refs
