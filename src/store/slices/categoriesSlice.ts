/**
 * CATEGORIES REDUX SLICE
 * Управляет состоянием категорий домов с кэшированием
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { CategoriesIndex } from '../../types/houses';
import { dataUrl, safeFetch } from '../../utils/paths';

interface CategoriesState {
  data: CategoriesIndex | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number;
  cacheTimeout: number; // 5 минут
}

const initialState: CategoriesState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: 0,
  cacheTimeout: 5 * 60 * 1000, // 5 минут
};

// Async Thunk для загрузки категорий
export const loadCategories = createAsyncThunk(
  'categories/loadCategories',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { categories: CategoriesState };
      const cached = state.categories.data;
      
      // Проверяем кэш
      if (cached && (Date.now() - state.categories.lastUpdated) < state.categories.cacheTimeout) {
        return cached;
      }

      const result = await safeFetch<CategoriesIndex>(dataUrl('index.json'));
      
      if (result.error) {
        return rejectWithValue(result.error);
      }
      
      if (!result.data) {
        return rejectWithValue('No data received');
      }

      return result.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to load categories:', error);
      return rejectWithValue(message);
    }
  }
);

// Slice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCache: (state) => {
      state.data = null;
      state.lastUpdated = 0;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Для offline/manual data setting если нужно
    setCategoriesData: (state, action: PayloadAction<CategoriesIndex>) => {
      state.data = action.payload;
      state.lastUpdated = Date.now();
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  clearCache,
  clearError,
  setCategoriesData
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
