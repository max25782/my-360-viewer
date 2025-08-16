/**
 * UNIVERSAL REDUX SLICE
 * Управляет состоянием универсальной системы для 30+ домов
 * Включает кэширование, optimistic updates и мемоизацию
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAssetPath, getAvailableDesignPackages, getAvailableRooms, hasTour360, getTour360Config } from '../../utils/universalAssets';

// Types
interface DesignPackage {
  id: string;
  name: string;
  dp?: number;
  pk?: number;
}

interface HouseAssets {
  houseId: string;
  exteriorPackages: DesignPackage[];
  interiorPackages: DesignPackage[];
  availableRooms: string[];
  tour360Available: boolean;
  tour360Config: any;
  lastUpdated: number;
}

interface DesignSelection {
  houseId: string;
  selectedExteriorPackage: number;
  selectedInteriorPackage: number;
  selectedRoom: string;
  currentExteriorImage: string;
  currentInteriorImage: string;
  currentInteriorPhotos: string[];
  currentPhotoIndex: number;
}

interface UniversalState {
  // Кэш данных домов
  houseAssets: Record<string, HouseAssets>;
  
  // Текущие выборы пользователя
  selections: Record<string, DesignSelection>;
  
  // UI состояние
  loading: Record<string, boolean>;
  error: string | null;
  
  // Метаданные
  lastGlobalUpdate: number;
  cacheTimeout: number; // 5 минут
}

const initialState: UniversalState = {
  houseAssets: {},
  selections: {},
  loading: {},
  error: null,
  lastGlobalUpdate: Date.now(),
  cacheTimeout: 5 * 60 * 1000, // 5 minutes - восстановлено после исправления поворота
};

// Async Thunks
export const loadHouseAssets = createAsyncThunk(
  'universal/loadHouseAssets',
  async (houseId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { universal: UniversalState };
      const cached = state.universal.houseAssets[houseId];
      
      // Проверяем кэш
      if (cached && (Date.now() - cached.lastUpdated) < state.universal.cacheTimeout) {
        return cached;
      }

      // Загружаем данные параллельно
      const [exteriorPackages, interiorPackages, availableRooms, tour360Available] = await Promise.all([
        getAvailableDesignPackages(houseId, 'exterior'),
        getAvailableDesignPackages(houseId, 'interior'),
        getAvailableRooms(houseId),
        hasTour360(houseId)
      ]);

      let tour360Config = null;
      if (tour360Available) {
        tour360Config = await getTour360Config(houseId);
      }

      const houseAssets: HouseAssets = {
        houseId,
        exteriorPackages,
        interiorPackages,
        availableRooms,
        tour360Available,
        tour360Config,
        lastUpdated: Date.now()
      };

      return houseAssets;
    } catch (error) {
      console.error(`Failed to load assets for ${houseId}:`, error);
      return rejectWithValue(`Failed to load assets for ${houseId}`);
    }
  }
);

export const loadDesignImage = createAsyncThunk(
  'universal/loadDesignImage',
  async ({ 
    houseId, 
    type, 
    packageData, 
    room = 'living' 
  }: { 
    houseId: string; 
    type: 'exterior' | 'interior'; 
    packageData: DesignPackage; 
    room?: string; 
  }) => {
    try {
      const photos: string[] = [];
      
      if (type === 'exterior') {
        const imagePath = await getAssetPath('exterior', houseId, { dp: packageData.dp });
        photos.push(imagePath);
      } else {
        // Загружаем основное фото из interior папки дома
        try {
          const mainPhoto = await getAssetPath('interior', houseId, { room, pk: packageData.pk });
          photos.push(mainPhoto);
        } catch (e) {
          console.log(`Main photo not found for pk${packageData.pk}`);
        }
        
        // Проверяем дополнительное фото асинхронно
        const additionalPhotoPath = `/assets/${houseId}/interior/${room}/pk${packageData.pk}.1.jpg`;
        
        // Создаем промис для проверки дополнительного фото
        const checkAdditionalPhoto = new Promise<string | null>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(additionalPhotoPath);
          img.onerror = () => resolve(null);
          img.src = additionalPhotoPath;
        });
        
        const additionalPhoto = await checkAdditionalPhoto;
        if (additionalPhoto) {
          photos.push(additionalPhoto);
        }
      }

      return {
        houseId,
        type,
        room,
        packageIndex: type === 'exterior' ? packageData.dp - 1 : packageData.pk - 1,
        photos,
        mainImage: photos[0] || ''
      };
    } catch (error) {
      console.error('Failed to load design image:', error);
      throw error;
    }
  }
);

// Slice
const universalSlice = createSlice({
  name: 'universal',
  initialState,
  reducers: {
    // Optimistic updates для быстрого UI
    setSelectedPackage: (state, action: PayloadAction<{
      houseId: string;
      type: 'exterior' | 'interior';
      packageIndex: number;
    }>) => {
      const { houseId, type, packageIndex } = action.payload;
      
      if (!state.selections[houseId]) {
        state.selections[houseId] = {
          houseId,
          selectedExteriorPackage: 0,
          selectedInteriorPackage: 0,
          selectedRoom: 'living',
          currentExteriorImage: '',
          currentInteriorImage: '',
          currentInteriorPhotos: [],
          currentPhotoIndex: 0
        };
      }
      
      if (type === 'exterior') {
        state.selections[houseId].selectedExteriorPackage = packageIndex;
      } else {
        state.selections[houseId].selectedInteriorPackage = packageIndex;
        state.selections[houseId].currentPhotoIndex = 0; // Reset photo index
      }
    },

    setSelectedRoom: (state, action: PayloadAction<{
      houseId: string;
      room: string;
    }>) => {
      const { houseId, room } = action.payload;
      
      if (state.selections[houseId]) {
        state.selections[houseId].selectedRoom = room;
        state.selections[houseId].currentPhotoIndex = 0; // Reset photo index
      }
    },

    setCurrentPhotoIndex: (state, action: PayloadAction<{
      houseId: string;
      photoIndex: number;
    }>) => {
      const { houseId, photoIndex } = action.payload;
      
      if (state.selections[houseId]) {
        state.selections[houseId].currentPhotoIndex = photoIndex;
      }
    },

    clearCache: (state) => {
      state.houseAssets = {};
      state.lastGlobalUpdate = Date.now();
    },

    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load House Assets
      .addCase(loadHouseAssets.pending, (state, action) => {
        state.loading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(loadHouseAssets.fulfilled, (state, action) => {
        const houseAssets = action.payload;
        state.houseAssets[houseAssets.houseId] = houseAssets;
        state.loading[houseAssets.houseId] = false;
        
        // Инициализируем выбор если его нет
        if (!state.selections[houseAssets.houseId]) {
          state.selections[houseAssets.houseId] = {
            houseId: houseAssets.houseId,
            selectedExteriorPackage: 0,
            selectedInteriorPackage: 0,
            selectedRoom: houseAssets.availableRooms[0] || 'living',
            currentExteriorImage: '',
            currentInteriorImage: '',
            currentInteriorPhotos: [],
            currentPhotoIndex: 0
          };
        }
      })
      .addCase(loadHouseAssets.rejected, (state, action) => {
        state.loading[action.meta.arg] = false;
        state.error = action.payload as string;
      })
      
      // Load Design Image
      .addCase(loadDesignImage.pending, (state, action) => {
        const { houseId } = action.meta.arg;
        state.loading[`${houseId}_image`] = true;
      })
      .addCase(loadDesignImage.fulfilled, (state, action) => {
        const { houseId, type, photos, mainImage } = action.payload;
        state.loading[`${houseId}_image`] = false;
        
        if (state.selections[houseId]) {
          if (type === 'exterior') {
            state.selections[houseId].currentExteriorImage = mainImage;
          } else {
            state.selections[houseId].currentInteriorImage = mainImage;
            state.selections[houseId].currentInteriorPhotos = photos;
            state.selections[houseId].currentPhotoIndex = 0;
          }
        }
      })
      .addCase(loadDesignImage.rejected, (state, action) => {
        const { houseId } = action.meta.arg;
        state.loading[`${houseId}_image`] = false;
        state.error = 'Failed to load design image';
      });
  }
});

export const {
  setSelectedPackage,
  setSelectedRoom,
  setCurrentPhotoIndex,
  clearCache,
  clearError
} = universalSlice.actions;

export default universalSlice.reducer;
