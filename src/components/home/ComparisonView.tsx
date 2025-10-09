'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ArrowLeft, GitCompare } from 'lucide-react';
import { roundToStep } from '../../utils/formatters';

interface ComparisonViewProps {
  isDark: boolean;
  compareList: string[];
  models: any[];
  onBack: () => void;
  onClearAll: () => void;
}

export function ComparisonView({ isDark, compareList, models, onBack, onClearAll }: ComparisonViewProps) {
  return (
    <motion.div
      key="comparison"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1"
    >
      <div className="mb-6">
        <Card className={`p-4 ${isDark ? 'bg-slate-800/50' : 'bg-white/50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Models
              </Button>
              <div>
                <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Comparing {compareList.length} Models</h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Side-by-side comparison of selected models</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClearAll} className="text-red-500 hover:text-red-600">
              Clear All
            </Button>
          </div>
        </Card>
      </div>

      <Card className={`p-8 ${isDark ? 'bg-slate-800/50' : 'bg-white/50'}`}>
        <div className={`text-center ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <GitCompare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Model Comparison</h3>
          <p className="mb-4">Comparing {compareList.length} selected models</p>
          <div
            className={`grid gap-4 ${
              compareList.length === 2
                ? 'grid-cols-2 justify-between'
                : compareList.length === 3
                ? 'grid-cols-1 md:grid-cols-3'
                : 'grid-cols-1'
            }`}
          >
            {compareList.slice(0, 3).map((modelId) => {
              const model = models.find((m) => m.id === modelId);
              if (!model) return null;
              
              // Извлекаем правильную площадь из Living Space в comparison.features
              let correctSqft = model.sqft;
              let sqftWasCorrected = false;
              if (model.comparison?.features?.['Living Space']) {
                const livingSpace = model.comparison.features['Living Space'];
                const lsText = livingSpace.best || livingSpace.better || livingSpace.good || '';
                const match = lsText.match(/(\d+)\s*SF/i);
                if (match) {
                  const extracted = parseInt(match[1], 10);
                  if (extracted !== model.sqft) {
                    correctSqft = extracted;
                    sqftWasCorrected = true;
                    console.log(`✅ ${model.name}: Исправлена площадь с ${model.sqft} на ${correctSqft} SF`);
                  }
                }
              }
              
              const displaySqft = correctSqft || model.sqft;
              
              // Округление цены ВВЕРХ до ближайших $10,000 (как на главной странице)
              const roundPriceCeil = (price: number): number => {
                return roundToStep(price, 10000, 'ceil');
              };
              
              // ВСЕГДА округляем цену вверх, независимо от источника
              let basePrice;
              if (sqftWasCorrected) {
                basePrice = displaySqft * 340;
              } else {
                basePrice = model.basePrice || (displaySqft * 340);
              }
              const displayPrice = roundPriceCeil(basePrice);
              
              return (
                <div
                  key={modelId}
                  className={`p-4 rounded-lg border ${isDark ? 'border-slate-600' : 'border-slate-300'}`}
                >
                  <img src={model.heroImage} alt={model.name} className="w-full h-32 object-cover rounded mb-2" />
                  <h4 className="font-semibold">{model.name}</h4>
                  <p className="text-sm opacity-70">
                    {displaySqft} sq ft • ${displayPrice.toLocaleString()}
                  </p>
                  <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                    {(() => {
                      const cmp = (model as any)?.comparison?.features;
                      const all: string[] = [];
                      if (Array.isArray(cmp)) {
                        all.push(...cmp);
                      } else if (cmp && typeof cmp === 'object') {
                        Object.entries(cmp).forEach(([key, value]: [string, any]) => {
                          if (value && typeof value === 'object') {
                            const text = (value as any).best || (value as any).better || (value as any).good || '';
                            if (typeof text === 'string' && text !== '✗' && text.trim() !== '') {
                              all.push(`${key}: ${text}`);
                            }
                          }
                        });
                      }
                      // Удаляем дубликаты
                      const uniqueFeatures = Array.from(new Set(all));
                      return uniqueFeatures.map((feature: string, idx: number) => (
                        <div
                          key={`${model.id}-${idx}-${feature}`}
                          className={`text-xs px-2 py-1 rounded border ${
                            isDark
                              ? 'border-slate-600/50 text-slate-300 bg-slate-700/30'
                              : 'border-slate-300/50 text-slate-700 bg-slate-100/30'
                          }`}
                        >
                          {feature.length > 60 ? `${feature.substring(0, 60)}...` : feature}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}


