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

interface ManifestPhoto {
  filename: string;
  path: string;
  type: string;
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

      const mappedPackages: DesignPackage[] = (designPackages || []).map((dp: number) => ({
        id: `dp${dp}`,
        name: `DP ${dp}`,
        dp
      }));

      const houseAssets: HouseAssets = {
        houseId,
        exteriorPackages: mappedPackages,
        interiorPackages: mappedPackages,
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
          // Если есть pk (от текстуры), используем его как вариант пакета
          const dpToUse = pk ? pk : packageData.dp;
          console.log(`🏠 Using dpToUse=${dpToUse} for exterior image (pk=${pk}, packageData.dp=${packageData.dp})`);
          const imagePath = await getAssetPath('exterior', houseId, { 
            dp: dpToUse, 
            format: isWebPSupported ? 'webp' : 'jpg' 
          });
          photos.push(imagePath);
          console.log(`Loading exterior image: dp${dpToUse} ${pk ? '(from texture pk)' : '(from package dp)'}`);
        } catch (e) {
          console.log(`Exterior photo not found for dp${pk ? pk : packageData.dp}`);
        }
      } else {
        // Загрузка фотографий интерьера из манифеста
        console.log(`Loading interior photos for ${houseId}, room: ${room}${pk ? `, specific pk: ${pk}` : ''}`);
        
        try {
          // Загружаем манифест
          const manifestResponse = await fetch('/skyline-interior-manifest.json');
          if (!manifestResponse.ok) {
            console.error('Не удалось загрузить манифест интерьеров Skyline');
            return;
          }
          
          const manifest = await manifestResponse.json();
          
          // Нормализуем ID дома (первая буква заглавная, остальные строчные)
          const normalizedHouseId = houseId.charAt(0).toUpperCase() + houseId.slice(1).toLowerCase();
          
          // Получаем данные дома из манифеста
          const houseData = manifest.houses[houseId] || manifest.houses[normalizedHouseId];
          
          if (!houseData) {
            console.error(`Дом ${houseId} не найден в манифесте`);
            return;
          }
          
          // Утилита: выбрать один путь с предпочтением WebP
          const pickPreferredByExt = (candidates: ManifestPhoto[]): ManifestPhoto | null => {
            if (!candidates || candidates.length === 0) return null;
            const webp = candidates.find((p) => p.path.toLowerCase().endsWith('.webp'));
            if (webp) return webp;
            const jpg = candidates.find((p) => /\.(jpe?g)$/i.test(p.path));
            return jpg || candidates[0] || null;
          };

          // Утилита: собрать пары (pkN и pkN.1) для каждого base pk; при pk — только для него
          const collectPkPairs = (list: ManifestPhoto[], basePk?: number): string[] => {
            const result: string[] = [];
            const photosOnly = (list || []).filter((p) => p.type === 'photo');

            const addPairForBase = (baseKey: string) => {
              // Helper to get filename without extension (preserve decimal part)
              const getNameNoExt = (filename: string) => {
                const lastDotIndex = filename.lastIndexOf('.');
                return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
              };

              // exact pkN (must match exactly, no decimals)
              const exactCandidates = photosOnly.filter((p) => {
                const nameNoExt = getNameNoExt(p.filename);
                const isExactMatch = nameNoExt === baseKey;
                const hasNoDecimal = !/\.\d+$/.test(nameNoExt);
                return isExactMatch && hasNoDecimal;
              });
              const exactPicked = pickPreferredByExt(exactCandidates);

              // decimal pkN.X — выбираем минимальный X, затем предпочитаем webp
              const decimalsAll = photosOnly.filter((p) => {
                const nameNoExt = getNameNoExt(p.filename);
                return /^pk\d+\.\d+$/.test(nameNoExt) && nameNoExt.startsWith(baseKey + '.');
              });
              decimalsAll.sort((a, b) => {
                const ax = parseFloat(getNameNoExt(a.filename).slice(2));
                const bx = parseFloat(getNameNoExt(b.filename).slice(2));
                return ax - bx;
              });
              let decimalPicked: ManifestPhoto | null = null;
              if (decimalsAll.length > 0) {
                const firstDecimalKey = getNameNoExt(decimalsAll[0].filename);
                const sameDecimal = decimalsAll.filter((p) => getNameNoExt(p.filename) === firstDecimalKey);
                decimalPicked = pickPreferredByExt(sameDecimal);
              }

              if (exactPicked) result.push(exactPicked.path);
              if (decimalPicked) result.push(decimalPicked.path);
            };

            if (typeof basePk === 'number') {
              addPairForBase(`pk${basePk}`);
              return result;
            }

            // Helper to get filename without extension (preserve decimal part)
            const getNameNoExt = (filename: string) => {
              const lastDotIndex = filename.lastIndexOf('.');
              return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
            };

            // Собираем все base pkN
            const baseKeys = new Set<string>();
            for (const p of photosOnly) {
              const nameNoExt = getNameNoExt(p.filename);
              const baseKey = nameNoExt.replace(/\.\d+$/, ''); // pkN
              if (/^pk\d+$/.test(baseKey)) baseKeys.add(baseKey);
            }
            const sortedBase = Array.from(baseKeys).sort((a, b) => {
              const na = parseInt(a.replace(/[^\d]/g, '')) || 0;
              const nb = parseInt(b.replace(/[^\d]/g, '')) || 0;
              return na - nb;
            });
            for (const baseKey of sortedBase) addPairForBase(baseKey);
            return result;
          };

          // Проверяем, есть ли комната в манифесте
          if (!houseData.rooms[room]) {
            console.log(`Комната ${room} не найдена в манифесте для дома ${houseId}, пробуем living`);
            
            // Если комната не найдена, пробуем использовать living
            if (houseData.rooms['living']) {
              const livingPhotos = houseData.rooms['living'].photos as ManifestPhoto[];
              const collected = collectPkPairs(livingPhotos, pk);
              collected.forEach((p) => photos.push(p));
              console.log(`Found ${collected.length} photos in living room (pk pairs, preferred format)`);
            }
          } else {
            // Комната найдена, получаем фотографии
            const roomPhotos = houseData.rooms[room].photos as ManifestPhoto[];
            const collected = collectPkPairs(roomPhotos, pk);
            collected.forEach((p) => photos.push(p));
            console.log(`Found ${collected.length} photos in ${room} (pk pairs, preferred format)`);
          }
        } catch (error) {
          console.error('Ошибка при загрузке фотографий из манифеста:', error);
        }
        
        console.log(`Loaded ${photos.length} interior photos for ${houseId}, room: ${room}`);
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
            selectedRoom: 'living', // Always use 'living' as default for interior
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
        // Проверяем, что payload не undefined
        if (!action.payload) return;
        
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
