import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DesignState {
  // Design Collection State
  selectedCollection: 'heritage' | 'haven' | 'serenity' | 'luxe';
  
  // Interior Design State
  selectedInterior: 'modern' | 'classic' | 'rustic' | 'luxury';
  currentRoomIndex: number;
  currentImageIndex: number;
  
  // UI State for design selectors
  isMounted: boolean;
}

const initialState: DesignState = {
  selectedCollection: 'heritage',
  selectedInterior: 'modern',
  currentRoomIndex: 0,
  currentImageIndex: 0,
  isMounted: false,
};

const designSlice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    setCollection: (state, action: PayloadAction<DesignState['selectedCollection']>) => {
      state.selectedCollection = action.payload;
    },
    
    setInterior: (state, action: PayloadAction<DesignState['selectedInterior']>) => {
      state.selectedInterior = action.payload;
      // Reset image index when style changes
      state.currentImageIndex = 0;
    },
    
    setCurrentRoom: (state, action: PayloadAction<number>) => {
      state.currentRoomIndex = action.payload;
      // Reset image index when room changes
      state.currentImageIndex = 0;
    },
    
    setCurrentImage: (state, action: PayloadAction<number>) => {
      state.currentImageIndex = action.payload;
    },
    
    nextImage: (state) => {
      // Logic will be handled by component with selectors
      // This is just for state updates
    },
    
    prevImage: (state) => {
      // Logic will be handled by component with selectors
      // This is just for state updates
    },
    
    navigateImage: (state, action: PayloadAction<{ roomIndex: number; imageIndex: number }>) => {
      state.currentRoomIndex = action.payload.roomIndex;
      state.currentImageIndex = action.payload.imageIndex;
    },
    
    setMounted: (state, action: PayloadAction<boolean>) => {
      state.isMounted = action.payload;
    },
    
    resetDesign: (state) => {
      return { ...initialState, isMounted: state.isMounted };
    },
  },
});

export const {
  setCollection,
  setInterior,
  setCurrentRoom,
  setCurrentImage,
  nextImage,
  prevImage,
  navigateImage,
  setMounted,
  resetDesign,
} = designSlice.actions;

export default designSlice.reducer;
