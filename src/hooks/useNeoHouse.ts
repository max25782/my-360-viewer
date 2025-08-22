'use client';

import { useState, useEffect } from 'react';
import { getNeoHouseConfig, getNeoAssetPath } from '../utils/neoAssets';

export interface NeoHouse {
  id: string;
  name: string;
  description: string;
  maxDP: number;
  maxPK: number;
  availableRooms: string[];
  images: {
    hero: string;
    exampleDark?: string;
    exampleWhite?: string;
    whiteTexture: string;
    blackTexture: string;
  };
  tour360: {
    white: { rooms: string[] };
    black: { rooms: string[] };
  };
  comparison?: {
    features: Record<string, {
      good: string;
      better: string;
      best: string;
    }>;
  };
}

export function useNeoHouse(houseId: string) {
  const [house, setHouse] = useState<NeoHouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNeoHouse() {
      try {
        setLoading(true);
        setError(null);
        
        const houseConfig = await getNeoHouseConfig(houseId);
        
        if (!houseConfig) {
          setError(`Neo house "${houseId}" not found`);
          setHouse(null);
          return;
        }

        // Generate asset paths
        const heroPath = await getNeoAssetPath('hero', houseId, { 
          color: 'white', 
          format: 'jpg' 
        });

        const neoHouse: NeoHouse = {
          id: houseId,
          name: houseConfig.name,
          description: houseConfig.description,
          maxDP: houseConfig.maxDP,
          maxPK: houseConfig.maxPK,
          availableRooms: houseConfig.availableRooms,
          images: {
            hero: heroPath,
            whiteTexture: '/assets/neo/texrure/thumb-white.jpg',
            blackTexture: '/assets/neo/texrure/thumb-black.jpg'
          },
          tour360: houseConfig.tour360,
          comparison: houseConfig.comparison
        };

        setHouse(neoHouse);
      } catch (err) {
        console.error('Error loading Neo house:', err);
        setError(err instanceof Error ? err.message : 'Failed to load house');
        setHouse(null);
      } finally {
        setLoading(false);
      }
    }

    if (houseId) {
      loadNeoHouse();
    }
  }, [houseId]);

  return { house, loading, error };
}

export function useNeoHouses() {
  const [houses, setHouses] = useState<NeoHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNeoHouses() {
      try {
        setLoading(true);
        setError(null);
        
        // For now, we'll load the single Apex house
        // In the future, this will load all 15 Neo houses
        const apexHouse = await getNeoHouseConfig('Apex');
        
        if (apexHouse) {
          const heroPath = await getNeoAssetPath('hero', 'Apex', { 
            color: 'white', 
            format: 'jpg' 
          });

          const neoHouse: NeoHouse = {
            id: 'Apex',
            name: apexHouse.name,
            description: apexHouse.description,
            maxDP: apexHouse.maxDP,
            maxPK: apexHouse.maxPK,
            availableRooms: apexHouse.availableRooms,
            images: {
              hero: heroPath,
              whiteTexture: '/assets/neo/texrure/thumb-white.jpg',
              blackTexture: '/assets/neo/texrure/thumb-black.jpg'
            },
            tour360: apexHouse.tour360,
            comparison: apexHouse.comparison
          };

          setHouses([neoHouse]);
        } else {
          setHouses([]);
        }
      } catch (err) {
        console.error('Error loading Neo houses:', err);
        setError(err instanceof Error ? err.message : 'Failed to load houses');
        setHouses([]);
      } finally {
        setLoading(false);
      }
    }

    loadNeoHouses();
  }, []);

  return { houses, loading, error };
}
