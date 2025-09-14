import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Play, Maximize2, RotateCcw, X } from 'lucide-react';
import { motion } from 'framer-motion';
import CategorySpecific360Viewer from './CategorySpecific360Viewer';
import Neo360Page from './Neo/Neo360';
import Premium360Tour from './Premium/Premium360Tour';
import { getNeoHeroPath } from '../utils/neoAssets';

// Интерфейс для старого формата (обратная совместимость)
interface ModelData {
  id?: string;
  name?: string;
  collection?: string;
  heroImage?: string;
  view360Url?: string;
  [key: string]: any;
}

// Поддержка обоих интерфейсов
interface Virtual360ViewerProps {
  // Новый интерфейс
  imageUrl?: string;
  modelName?: string;
  view360Url?: string;
  category?: 'premium' | 'neo' | 'skyline' | string;
  slug?: string;
  description?: string;
  fullView?: boolean;
  
  // Старый интерфейс
  model?: ModelData;
  onClose?: () => void;
  isDark?: boolean;
}

export function Virtual360Viewer(props: Virtual360ViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Извлекаем параметры из обоих интерфейсов
  const model = props.model || {};
  const isDark = props.isDark || false;
  const onClose = props.onClose || (() => {});
  
  // Новый интерфейс имеет приоритет над старым
  const modelName = props.modelName || model.name || '';
  const view360Url = props.view360Url || model.view360Url || '';
  
  // Нормализуем категорию (поддержка строк вроде "Premier", "Premium Collection")
  function normalizeCategory(raw?: string): string | undefined {
    if (!raw) return undefined;
    const s = String(raw).toLowerCase();
    if (s.includes('neo')) return 'neo';
    if (s.includes('prem')) return 'premium';
    if (s.includes('skyline')) return 'skyline';
    if (s === 'neo' || s === 'premium' || s === 'skyline') return s;
    return undefined;
  }

  // Определяем категорию на основе props либо коллекции модели
  const category = normalizeCategory(props.category) || normalizeCategory(model.collection) || 'skyline';
  const slug = props.slug || model.id || '';
  const description = props.description || '';
  const fullView = props.fullView || false;
  
  // Дополнительная проверка на undefined
  if (slug === 'undefined' || slug === undefined || slug === null) {
    console.error(`❌ Virtual360Viewer: Invalid slug detected: "${slug}"`);
    console.error(`❌ Virtual360Viewer: Props analysis:`, {
      'props.slug': props.slug,
      'model.id': model.id,
      'model': model
    });
  }
  
  // Формируем правильные пути к изображениям
  // Приоритет: 1) явно указанный imageUrl, 2) специальные пути для Neo (hero_black), 3) путь к 360/hero, 4) heroImage модели
  const get360HeroPath = () => {
    if (props.imageUrl) return props.imageUrl;
    if (category && slug) {
      // Для Neo коллекции используем утилиту для получения hero_black.jpg
      if (category === 'neo') {
        return getNeoHeroPath(slug, 'black');
      }
      // Для других коллекций используем стандартный путь
      return `/assets/${category}/${slug}/360/hero.jpg`;
    }
    return model.heroImage || '';
  };
  
  const imageUrl = get360HeroPath();
  
  // Обработчик для имитации загрузки 360 просмотра (для обратной совместимости)
  const handle360View = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (view360Url) {
        window.location.href = view360Url;
      } else {
        alert('360° view will be available soon!');
      }
    }, 1000);
  };
  
  // Для Neo: всегда используем готовый Neo360Page (preview) без тур-вьюера
  if (category === 'neo') {
    const isValidSlug = slug && slug !== 'undefined' && slug !== 'null';
    console.log(`🔍 Virtual360Viewer(neo): slug="${slug}" valid=${!!isValidSlug}`);
    if (isValidSlug) {
      return (
        <Neo360Page 
          slug={slug}
          name={modelName}
          description={description}
        />
      );
    }
    // если slug невалиден — оставляем прежнюю обратную совместимость ниже
  }

  // Для Premium: используем готовый Premium360Tour (preview)
  if (category === 'premium') {
    const isValidSlug = slug && slug !== 'undefined' && slug !== 'null';
    console.log(`🔍 Virtual360Viewer(premium): slug="${slug}" valid=${!!isValidSlug}`);
    if (isValidSlug) {
      return (
        <Premium360Tour 
          houseName={modelName || slug}
          houseSlug={slug}
          description={description}
        />
      );
    }
  }

  // Если указаны category и slug (для других категорий), используем роутер компонентов
  if (category && slug) {
    console.log(`🔍 Virtual360Viewer: Using CategorySpecific360Viewer with category="${category}", slug="${slug}", name="${modelName}"`);
    return (
      <CategorySpecific360Viewer 
        category={category}
        slug={slug}
        name={modelName}
        description={description}
        fullView={fullView}
      />
    );
  }
  
  // Логируем случаи, когда category или slug отсутствуют
  console.log(`⚠️ Virtual360Viewer: Fallback to standard component. category="${category}", slug="${slug}", modelName="${modelName}"`);
  console.log(`⚠️ Virtual360Viewer: Props received:`, { 
    imageUrl: props.imageUrl, 
    modelName: props.modelName, 
    category: props.category, 
    slug: props.slug,
    model: props.model 
  });
  
  // Иначе используем стандартный компонент (для обратной совместимости)
  return (
    <Card className={`overflow-hidden ${isDark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/90 border-gray-200'} backdrop-blur-xl`}>
      {/* Кнопка закрытия (для старого интерфейса) */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
      
      <div className="relative aspect-video">
        <img 
          src={imageUrl}
          alt={modelName}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                size="lg"
                onClick={handle360View}
                disabled={isLoading}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-white border-cyan-400/50 backdrop-blur-md"
              >
                {isLoading ? (
                  <RotateCcw className="w-6 h-6 animate-spin" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
                <span className="ml-2">360° View</span>
              </Button>
            </motion.div>
          </div>
          
          <div className="absolute top-4 right-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(view360Url || '#', '_blank')}
              className="bg-black/30 hover:bg-black/50 text-white border-white/20 backdrop-blur-md"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className={`${isDark ? 'text-white' : 'text-gray-800'} font-medium mb-2`}>Virtual Tour</h3>
        <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'} text-sm`}>
          Experience {modelName} in immersive 360° view
        </p>
      </div>
    </Card>
  );
}
