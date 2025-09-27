'use client';

import React from 'react';
import { SkylineConfigurator } from '../SkylineConfigurator';
import { NeoConfigurator } from '../NeoConfigurator';
import { PremierHouseConfigurator } from '../PremierHouseConfigurator';

interface CollectionConfiguratorsProps {
  isDark: boolean;
  selectedCollection: string;
  onSkylineConfigChange?: (config: any) => void;
  onNeoConfigChange?: (config: any) => void;
  onPremierConfigChange?: (config: any) => void;
}

export function CollectionConfigurators({
  isDark,
  selectedCollection,
  onSkylineConfigChange,
  onNeoConfigChange,
  onPremierConfigChange
}: CollectionConfiguratorsProps) {
  if (selectedCollection === 'skyline' && onSkylineConfigChange) {
    return (
      <div className="mb-8">
        <SkylineConfigurator isDark={isDark} onConfigurationChange={onSkylineConfigChange} />
      </div>
    );
  }
  if (selectedCollection === 'neo' && onNeoConfigChange) {
    return (
      <div className="mb-8">
        <NeoConfigurator isDark={isDark} onConfigurationChange={onNeoConfigChange} />
      </div>
    );
  }
  if (selectedCollection === 'premium' && onPremierConfigChange) {
    return (
      <div className="mb-8">
        <PremierHouseConfigurator isDark={isDark} onConfigurationChange={onPremierConfigChange} />
      </div>
    );
  }
  return null;
}


