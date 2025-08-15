import { configureStore } from '@reduxjs/toolkit';
import panoramaReducer from './slices/panoramaSlice';
import uiReducer from './slices/uiSlice';
import universalReducer from './slices/universalSlice';

export const store = configureStore({
  reducer: {
    panorama: panoramaReducer,
    ui: uiReducer,
    universal: universalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем PhotoSphere Viewer instance и другие не-сериализуемые объекты
        ignoredActions: [
          'panorama/setViewer', 
          'panorama/setMarkersPlugin',
          'panorama/updatePosition'
        ],
        ignoredPaths: [
          'panorama.viewer', 
          'panorama.markersPlugin'
        ],
        // Игнорируем проверку в action.payload для этих типов
        ignoredActionPaths: [
          'payload.viewer',
          'payload.markersPlugin', 
          'payload'
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
