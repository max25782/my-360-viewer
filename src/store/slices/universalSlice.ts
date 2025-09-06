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
  tour360Config: {
    rooms: string[];
    availableFiles: Record<string, unknown>;
    markerPositions: Record<string, Record<string, { yaw: number; pitch: number }>>;
    legacy: boolean;
  } | null;
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
      const [designPackages, availableRooms, tour360Available] = await Promise.all([
        getAvailableDesignPackages(houseId),
        getAvailableRooms(houseId),
        hasTour360(houseId)
      ]);

      let tour360Config = null;
      if (tour360Available) {
        tour360Config = await getTour360Config(houseId);
      }

      const houseAssets: HouseAssets = {
        houseId,
        exteriorPackages: designPackages,
        interiorPackages: designPackages,
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

// Утилита для проверки поддержки WebP
const isWebPSupported = (() => {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  return canvas && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
})();

export const loadDesignImage = createAsyncThunk(
  'universal/loadDesignImage',
  async ({ 
    houseId, 
    type, 
    packageData, 
    room = 'living',
    pk
  }: { 
    houseId: string; 
    type: 'exterior' | 'interior'; 
    packageData: DesignPackage; 
    room?: string; 
    pk?: number;
  }) => {
    try {
      const photos: string[] = [];
      
      if (type === 'exterior') {
        try {
          const imagePath = await getAssetPath('exterior', houseId, { 
            dp: packageData.dp, 
            format: isWebPSupported ? 'webp' : 'jpg' 
          });
          photos.push(imagePath);
        } catch (e) {
          console.log(`Exterior photo not found for dp${packageData.dp}`);
        }
      } else {
        // Полностью динамическая загрузка всех доступных фотографий для интерьера
        const maxPkToCheck = 5; // Проверяем до 5 основных пакетов (pk1, pk2, pk3, pk4, pk5)
        const formats = isWebPSupported 
          ? ['webp', 'jpg'] 
          : ['jpg', 'webp'];
        
        // Если передан конкретный pk (от текстуры), используем его
        const specificPk = pk ? [pk] : Array.from({length: maxPkToCheck}, (_, i) => i + 1);
        
        console.log(`Dynamically scanning interior photos for ${houseId}, room: ${room}${pk ? `, specific pk: ${pk}` : ''}`);
        
        // Функция для проверки существования файла без логирования ошибок
        const checkFileExists = async (path: string): Promise<boolean> => {
          try {
            // Используем AbortController для предотвращения ошибок в консоли
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 500); // Таймаут 500мс
            
            const response = await fetch(path, { 
              method: 'HEAD',
              signal: controller.signal,
              // Подавляем логирование ошибок в консоли
              cache: 'no-cache'
            });
            
            clearTimeout(timeoutId);
            return response.ok;
          } catch {
            // Тихо игнорируем ошибки (включая AbortError)
            return false;
          }
        };
        
        // Оптимизированное сканирование пакетов
        // Сначала определим, какие пакеты (pk) существуют для этой комнаты
        const existingPkNumbers: number[] = [];
        
        // Проверяем только основные фото пакетов (pk1, pk2, pk3...) или конкретный pk
        for (const pkNum of specificPk) {
          let foundMainPhoto = false;
          
          // Проверяем оба формата
          for (const format of formats) {
            const mainPhotoPath = `/assets/skyline/${houseId}/interior/${room}/pk${pkNum}.${format}`;
            if (await checkFileExists(mainPhotoPath)) {
              console.log(`Found main photo: ${mainPhotoPath}`);
              photos.push(mainPhotoPath);
              existingPkNumbers.push(pkNum);
              foundMainPhoto = true;
              break; // Нашли основное фото, переходим к следующему пакету
            }
          }
          
          // Если не нашли основное фото для pk > 1 и не ищем конкретный pk, прекращаем поиск
          // (предполагаем, что пакеты идут по порядку: pk1, pk2, pk3...)
          if (!foundMainPhoto && pkNum > 1 && !pk) {
            // Если это не pk1 и фото не найдено, вероятно дальше тоже не будет
            break;
          }
        }
        
        console.log(`Found ${existingPkNumbers.length} package(s) for ${houseId}, room: ${room}: ${existingPkNumbers.join(', ')}`);
        
        // Теперь проверяем вариации только для найденных пакетов
        for (const pkNum of existingPkNumbers) {
          // Проверяем вариации (pk1.1, pk1.2, pk2.1...)
          // Для экономии запросов проверяем только первую вариацию для каждого пакета
          const hasVariations = await (async () => {
            for (const format of formats) {
              const firstVariantPath = `/assets/skyline/${houseId}/interior/${room}/pk${pkNum}.1.${format}`;
              if (await checkFileExists(firstVariantPath)) {
                console.log(`Found variant photo: ${firstVariantPath}`);
                photos.push(firstVariantPath);
                return true;
              }
            }
            return false;
          })();
          
          // Если нашли первую вариацию, проверяем остальные
          if (hasVariations) {
            // Проверяем вариации 2 и 3
            for (let variant = 2; variant <= 3; variant++) {
              for (const format of formats) {
                const variantPath = `/assets/skyline/${houseId}/interior/${room}/pk${pkNum}.${variant}.${format}`;
                if (await checkFileExists(variantPath)) {
                  console.log(`Found variant photo: ${variantPath}`);
                  photos.push(variantPath);
                  break;
                }
              }
            }
          }
        }
        
        // Если не нашли ни одного фото, используем запасной вариант из другой комнаты
        if (photos.length === 0) {
          console.log(`No photos found for ${houseId}, room: ${room}, trying fallback to living room`);
          
          // Пробуем найти фото в гостиной
          if (room !== 'living') {
            for (const format of formats) {
              const fallbackPath = `/assets/skyline/${houseId}/interior/living/pk1.${format}`;
              if (await checkFileExists(fallbackPath)) {
                console.log(`Using fallback photo from living room: ${fallbackPath}`);
                photos.push(fallbackPath);
                break;
              }
            }
          }
        }
        
        console.log(`Found ${photos.length} interior photos for ${houseId}, room: ${room}`);
      }

      return {
        houseId,
        type,
        room,
        packageIndex: type === 'exterior' ? (packageData.dp || 1) - 1 : (pk || packageData.pk || 1) - 1,
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
