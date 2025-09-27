'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

interface UseDeepLinkOptions<TModel = any> {
  models: TModel[];
  onSelectModel: (model: TModel) => void;
  onSetMainTab?: (tab: string) => void;
  onSetModelTab?: (tab: string) => void;
}

export function useDeepLink<TModel = any>({ models, onSelectModel, onSetMainTab, onSetModelTab }: UseDeepLinkOptions<TModel>) {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const modelId = searchParams.get('model');
    const tabParam = searchParams.get('tab');
    if (modelId && models && models.length > 0) {
      const model = (models as any[]).find((m) => m.id === modelId);
      if (model) {
        onSelectModel(model as any);
        onSetMainTab?.('model-details');
        if (tabParam) {
          try {
            onSetModelTab?.(tabParam);
          } catch {}
        }
      }
    }
  }, [searchParams, models, onSelectModel, onSetMainTab, onSetModelTab]);
}


