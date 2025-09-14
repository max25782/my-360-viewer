import React from 'react';
import { motion } from 'framer-motion';
import { Collection, ModelData } from '../../types/home';
import { COLLECTION_DATA, COLLECTIONS } from '../../constants/home';
import { getCollectionDataWithFavorites } from '../../utils/navigationHelpers';

interface CollectionSelectorProps {
  isDark: boolean;
  selectedCollection: Collection;
  models: ModelData[];
  favorites: string[];
  onCollectionSelect: (collection: Collection) => void;
}

export function CollectionSelector({ 
  isDark, 
  selectedCollection, 
  models, 
  favorites, 
  onCollectionSelect 
}: CollectionSelectorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Clean Container */}
        <div 
          className={`relative p-4 rounded-2xl backdrop-blur-xl border ${
            isDark ? 'bg-slate-900/60 border-slate-700/30' : 'bg-white/60 border-slate-200/30'
          }`}
          style={{
            background: isDark 
              ? `rgba(15, 23, 42, 0.7)`
              : `rgba(248, 250, 252, 0.7)`,
            boxShadow: isDark 
              ? `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
              : `0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)`
          }}
        >
          {/* Collection Tabs Grid */}
          <div className="flex gap-3">
            {COLLECTIONS.map((collection, index) => {
              const isActive = selectedCollection === collection;
              const modelCount = collection !== 'favorites' 
                ? models.filter(m => m.collection === collection).length
                : favorites.length;

              // Get collection data with dynamic favorites handling
              const data = collection === 'favorites' 
                ? getCollectionDataWithFavorites(favorites.length)
                : COLLECTION_DATA[collection];
              
              if (!data) {
                console.warn(`Collection data not found for: ${collection}`);
                return null;
              }

              return (
                <motion.button
                  key={collection}
                  onClick={() => onCollectionSelect(collection)}
                  className="relative group"
                  whileHover={{ 
                    scale: 1.02,
                    y: -2
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1
                  }}
                >
                  {/* Clean Collection Panel */}
                  <div
                    className={`
                      relative w-36 h-24 rounded-xl overflow-hidden transition-all duration-300
                      ${isActive ? 'shadow-xl' : 'shadow-md hover:shadow-lg'}
                    `}
                    style={{
                      background: isActive 
                        ? data.gradient
                        : isDark 
                          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.9) 100%)'
                          : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(226, 232, 240, 0.95) 100%)',
                      border: isActive 
                        ? `1px solid ${data.primaryColor}`
                        : isDark 
                          ? '1px solid rgba(71, 85, 105, 0.4)'
                          : '1px solid rgba(203, 213, 225, 0.4)',
                      boxShadow: isActive 
                        ? `0 0 25px ${data.activeGlow}, 0 8px 25px rgba(0, 0, 0, 0.3)`
                        : isDark 
                          ? '0 4px 15px rgba(0, 0, 0, 0.3)'
                          : '0 4px 15px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {/* Subtle Grid Background */}
                    <div 
                      className={`absolute inset-0 opacity-10 ${isActive ? 'opacity-20' : ''}`}
                      style={{
                        backgroundImage: `
                          linear-gradient(90deg, ${data.primaryColor}60 1px, transparent 1px),
                          linear-gradient(${data.primaryColor}60 1px, transparent 1px)
                        `,
                        backgroundSize: '16px 16px'
                      }}
                    />

                    {/* Content Layout */}
                    <div className="relative z-10 h-full flex flex-col justify-between p-3">
                      {/* Top Section - Code & Status */}
                      <div className="flex items-center justify-between">
                        <div 
                          className={`
                            px-2 py-1 rounded text-xs backdrop-blur-sm
                            ${isActive 
                              ? 'bg-white/25 text-white' 
                              : isDark 
                                ? 'bg-slate-800/60 text-slate-300' 
                                : 'bg-white/70 text-slate-600'
                            }
                          `}
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '10px'
                          }}
                        >
                          {data.code}
                        </div>
                        
                        {/* Simple Status Dot */}
                        <div
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            collection === 'favorites' && favorites.length > 0 ? 'animate-pulse' : ''
                          }`}
                          style={{
                            background: isActive ? data.primaryColor : '#6B7280',
                            boxShadow: isActive ? `0 0 8px ${data.activeGlow}` : 'none'
                          }}
                        />
                      </div>

                      {/* Center - Collection Name */}
                      <div className="text-center">
                        <div 
                          className={`
                            text-sm tracking-wide
                            ${isActive 
                              ? 'text-white' 
                              : isDark ? 'text-slate-200' : 'text-slate-800'
                            }
                          `}
                          style={{ 
                            fontFamily: 'monospace',
                            fontSize: '13px'
                          }}
                        >
                          {data.name}
                        </div>
                      </div>

                      {/* Bottom - Model Count */}
                      <div className="flex items-center justify-between">
                        <div 
                          className={`text-xs opacity-70 ${
                            isActive ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}
                          style={{ 
                            fontFamily: 'monospace',
                            fontSize: '9px'
                          }}
                        >
                          MODELS
                        </div>
                        <div 
                          className={`
                            px-2 py-0.5 rounded text-xs backdrop-blur-sm
                            ${isActive 
                              ? 'bg-white/25 text-white' 
                              : isDark 
                                ? 'bg-slate-700/60 text-slate-300' 
                                : 'bg-white/70 text-slate-700'
                            }
                          `}
                          style={{ 
                            fontFamily: 'monospace',
                            fontSize: '11px'
                          }}
                        >
                          {String(modelCount).padStart(2, '0')}
                        </div>
                      </div>
                    </div>

                    {/* Clean Hover Lines */}
                    <div className={`
                      absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      ${!isActive ? 'block' : 'hidden'}
                    `}>
                      <div className="absolute top-1 left-1 w-4 h-[1px] bg-gradient-to-r from-cyan-400 to-transparent" />
                      <div className="absolute top-1 left-1 w-[1px] h-4 bg-gradient-to-b from-cyan-400 to-transparent" />
                      <div className="absolute bottom-1 right-1 w-4 h-[1px] bg-gradient-to-l from-cyan-400 to-transparent" />
                      <div className="absolute bottom-1 right-1 w-[1px] h-4 bg-gradient-to-t from-cyan-400 to-transparent" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
