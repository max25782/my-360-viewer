import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Viewer } from '@photo-sphere-viewer/core';
import type { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';

interface PanoramaState {
  currentHouseId: string;
  currentSceneKey: string;
  isViewerReady: boolean;
  isLoading: boolean;
  currentPosition: {
    yaw: number;
    pitch: number;
    zoom?: number;
  };
  error: string | null;
}

const initialState: PanoramaState = {
  currentHouseId: '',
  currentSceneKey: '',
  isViewerReady: false,
  isLoading: false,
  currentPosition: {
    yaw: 0,
    pitch: 0,
    zoom: 0, // Начальный зум без приближения
  },
  error: null,
};

const panoramaSlice = createSlice({
  name: 'panorama',
  initialState,
  reducers: {
    setHouse: (state, action: PayloadAction<string>) => {
      state.currentHouseId = action.payload;
      state.currentSceneKey = '';
      state.isViewerReady = false;
      state.error = null;
    },
    
    setScene: (state, action: PayloadAction<string>) => {
      state.currentSceneKey = action.payload;
      state.isLoading = true;
      state.error = null;
    },
    
    setViewerReady: (state, action: PayloadAction<boolean>) => {
      state.isViewerReady = action.payload;
      state.isLoading = false;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Removed setViewer and setMarkersPlugin - these will be handled with refs
    
    updatePosition: (state, action: PayloadAction<{ yaw: number; pitch: number; zoom?: number }>) => {
      state.currentPosition = { ...state.currentPosition, ...action.payload };
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    resetViewer: (state) => {
      state.isViewerReady = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setHouse,
  setScene,
  setViewerReady,
  setLoading,
  updatePosition,
  setError,
  resetViewer,
} = panoramaSlice.actions;

export default panoramaSlice.reducer;
