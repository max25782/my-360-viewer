import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NeoState {
  currentHouseId: string;
  currentRoom: string;
  selectedColor: 'white' | 'dark';
  availableRooms: string[];
  isViewerReady: boolean;
  isLoading: boolean;
  currentPosition: {
    yaw: number;
    pitch: number;
    zoom?: number;
  };
  error: string | null;
  scenesCache: Record<string, any>; // Кэш для загруженных сцен
}

const initialState: NeoState = {
  currentHouseId: '',
  currentRoom: '',
  selectedColor: 'white',
  availableRooms: [],
  isViewerReady: false,
  isLoading: false,
  currentPosition: {
    yaw: 180,
    pitch: 0,
    zoom: 0,
  },
  error: null,
  scenesCache: {},
};

const neoSlice = createSlice({
  name: 'neo',
  initialState,
  reducers: {
    setHouse: (state, action: PayloadAction<string>) => {
      state.currentHouseId = action.payload;
      state.currentRoom = '';
      state.availableRooms = [];
      state.isViewerReady = false;
      state.error = null;
      state.scenesCache = {}; // Очищаем кэш при смене дома
    },

    setSelectedColor: (state, action: PayloadAction<'white' | 'dark'>) => {
      state.selectedColor = action.payload;
      state.currentRoom = `entry_${action.payload}`; // Сбрасываем на entry при смене цвета
      state.isViewerReady = false;
      state.error = null;
    },

    setAvailableRooms: (state, action: PayloadAction<string[]>) => {
      state.availableRooms = action.payload;
      // Устанавливаем первую комнату как текущую, если она не установлена
      if (!state.currentRoom && action.payload.length > 0) {
        state.currentRoom = action.payload[0];
      }
    },

    setCurrentRoom: (state, action: PayloadAction<string>) => {
      state.currentRoom = action.payload;
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

    updatePosition: (state, action: PayloadAction<{ yaw: number; pitch: number; zoom?: number }>) => {
      state.currentPosition = {
        ...state.currentPosition,
        ...action.payload,
      };
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    cacheScene: (state, action: PayloadAction<{ key: string; scene: any }>) => {
      state.scenesCache[action.payload.key] = action.payload.scene;
    },

    clearCache: (state) => {
      state.scenesCache = {};
    },

    resetViewer: (state) => {
      state.isViewerReady = false;
      state.isLoading = false;
      state.error = null;
      state.currentPosition = {
        yaw: 180,
        pitch: 0,
        zoom: 0,
      };
    },
  },
});

export const {
  setHouse,
  setSelectedColor,
  setAvailableRooms,
  setCurrentRoom,
  setViewerReady,
  setLoading,
  updatePosition,
  setError,
  cacheScene,
  clearCache,
  resetViewer,
} = neoSlice.actions;

export default neoSlice.reducer;
