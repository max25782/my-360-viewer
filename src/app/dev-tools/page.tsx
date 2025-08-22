'use client';

import { useAppDispatch } from '../../store/hooks';
import { clearCache as clearUniversalCache } from '../../store/slices/universalSlice';
import { clearCache as clearCategoriesCache } from '../../store/slices/categoriesSlice';
import { clearAssetCache } from '../../utils/universalAssets';

export default function DevToolsPage() {
  const dispatch = useAppDispatch();

  const handleClearCache = () => {
    // Очистка Redux кэша
    dispatch(clearUniversalCache());
    dispatch(clearCategoriesCache());
    
    // Очистка утилитного кэша
    clearAssetCache();
    
    // Очистка всех браузерных кэшей
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Очистка localStorage и sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    alert('All caches cleared! Reloading page...');
    
    // Принудительная перезагрузка с очисткой кэша
    window.location.reload();
  };

  // Показываем только в dev режиме
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dev Tools</h1>
          <p className="text-gray-600">Available only in development mode</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Development Tools</h1>
          <p className="text-lg text-gray-600">Tools for debugging and cache management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cache Management */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cache Management</h2>
            <p className="text-gray-600 mb-6">
              Clear all caches including Redux store and asset cache. Use this after making 
              changes to asset configuration.
            </p>
            <button
              onClick={handleClearCache}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🔄 Clear All Caches & Reload
            </button>
          </div>

          {/* Development Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a 
                href="/" 
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors"
              >
                🏠 Back to Home
              </a>
              <a 
                href="/data/house-assets.json" 
                target="_blank"
                className="block w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors"
              >
                📄 View Asset Config
              </a>
              <a 
                href="/data/index.json" 
                target="_blank"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors"
              >
                📊 View Categories Data
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Access this page at: <code className="bg-gray-100 px-2 py-1 rounded">/dev-tools</code>
          </p>
        </div>
      </div>
    </div>
  );
}
