import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  // Modal states
  isImageModalOpen: boolean;
  modalImageSrc: string;
  modalImageAlt: string;
  
  // Loading states
  isPageLoading: boolean;
  loadingText: string;
  
  // Navigation states
  breadcrumbs: Array<{ label: string; href?: string }>;
  
  // Performance tracking
  renderCount: number;
  lastRenderTime: number;
}

const initialState: UiState = {
  isImageModalOpen: false,
  modalImageSrc: '',
  modalImageAlt: '',
  isPageLoading: false,
  loadingText: '',
  breadcrumbs: [],
  renderCount: 0,
  lastRenderTime: Date.now(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openImageModal: (state, action: PayloadAction<{ src: string; alt: string }>) => {
      state.isImageModalOpen = true;
      state.modalImageSrc = action.payload.src;
      state.modalImageAlt = action.payload.alt;
    },
    
    closeImageModal: (state) => {
      state.isImageModalOpen = false;
      state.modalImageSrc = '';
      state.modalImageAlt = '';
    },
    
    setPageLoading: (state, action: PayloadAction<{ loading: boolean; text?: string }>) => {
      state.isPageLoading = action.payload.loading;
      state.loadingText = action.payload.text || '';
    },
    
    setBreadcrumbs: (state, action: PayloadAction<Array<{ label: string; href?: string }>>) => {
      state.breadcrumbs = action.payload;
    },
    
    incrementRenderCount: (state) => {
      state.renderCount += 1;
      state.lastRenderTime = Date.now();
    },
    
    resetUi: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  openImageModal,
  closeImageModal,
  setPageLoading,
  setBreadcrumbs,
  incrementRenderCount,
  resetUi,
} = uiSlice.actions;

export default uiSlice.reducer;
