/**
 * Universal 360° tour utilities for standardized house structure
 * Replaces hardcoded tour scenes with dynamic generation
 */

import { assetPaths } from './assetPaths';

export interface TourScene {
  id: string;
  name: string;
  panorama: string | {
    type: 'cubemap';
    urls: {
      left: string;
      front: string;
      right: string;
      back: string;
      up: string;
      down: string;
    };
  };
  thumbnail: string;
  preview?: string;
  position?: { yaw: number; pitch: number };
  markers?: Array<{
    id: string;
    position: { yaw: number; pitch: number };
    image?: string;
    tooltip?: string;
    content?: string;
    linkScene?: string;
  }>;
}

// Standard room configuration for all houses
const STANDARD_ROOMS = [
  { id: 'living', name: 'Living Room', defaultYaw: 0, defaultPitch: 0 },
  { id: 'kitchen', name: 'Kitchen', defaultYaw: 90, defaultPitch: 0 },
  { id: 'bedroom', name: 'Master Bedroom', defaultYaw: 180, defaultPitch: 0 },
  { id: 'bathroom', name: 'Bathroom', defaultYaw: 270, defaultPitch: 0 },
  { id: 'entry', name: 'Entry', defaultYaw: 0, defaultPitch: 0 },
  { id: 'guest', name: 'Guest Room', defaultYaw: 45, defaultPitch: 0 }
];

/**
 * Generate 360° tour for any house using standardized structure
 */
export const generateHouseTour = (houseId: string): TourScene[] => {
  const scenes: TourScene[] = [];
  
  // Check which rooms are available for this house
  // You can customize this per house if needed
  const availableRooms = getAvailableRooms(houseId);
  
  availableRooms.forEach((room, index) => {
    const scene: TourScene = {
      id: room.id,
      name: room.name,
      panorama: {
        type: 'cubemap',
        urls: {
          left: assetPaths.tour360(houseId, room.id).tiles.left,
          front: assetPaths.tour360(houseId, room.id).tiles.front,
          right: assetPaths.tour360(houseId, room.id).tiles.right,
          back: assetPaths.tour360(houseId, room.id).tiles.back,
          up: assetPaths.tour360(houseId, room.id).tiles.up,
          down: assetPaths.tour360(houseId, room.id).tiles.down
        }
      },
      thumbnail: assetPaths.tour360(houseId, room.id).thumbnail,
      preview: assetPaths.tour360(houseId, room.id).preview,
      position: {
        yaw: room.defaultYaw,
        pitch: room.defaultPitch
      },
      markers: generateRoomMarkers(houseId, room.id, availableRooms)
    };
    
    scenes.push(scene);
  });
  
  return scenes;
};

/**
 * Get available rooms for a specific house
 * Can be customized per house if some rooms are missing
 */
const getAvailableRooms = (houseId: string) => {
  // House-specific room availability
  const houseRoomConfig: { [key: string]: string[] } = {
    walnut: ['bathroom', 'bedroom', 'entry', 'guest', 'kitchen'], // Based on your current Walnut structure
    laurel: ['living', 'kitchen', 'bedroom', 'bathroom'],
    tamarack: ['living', 'kitchen', 'bedroom'], // Smaller house
    // Add more houses as needed
  };
  
  const availableRoomIds = houseRoomConfig[houseId] || ['living', 'kitchen', 'bedroom', 'bathroom'];
  
  return STANDARD_ROOMS.filter(room => availableRoomIds.includes(room.id));
};

/**
 * Generate navigation markers between rooms
 */
const generateRoomMarkers = (houseId: string, currentRoomId: string, allRooms: typeof STANDARD_ROOMS) => {
  const markers = [];
  
  // Add navigation markers to other rooms
  allRooms.forEach(room => {
    if (room.id !== currentRoomId) {
      markers.push({
        id: `go-to-${room.id}`,
        position: { yaw: room.defaultYaw + 45, pitch: -10 },
        image: '/assets/icons/navigation-marker.png', // You can add navigation icons
        tooltip: `Go to ${room.name}`,
        content: `<p>Click to visit the ${room.name}</p>`,
        linkScene: room.id
      });
    }
  });
  
  // Add info markers for current room
  markers.push({
    id: 'room-info',
    position: { yaw: 0, pitch: 20 },
    tooltip: `${allRooms.find(r => r.id === currentRoomId)?.name} Information`,
    content: `<div class="p-4">
      <h3 class="font-bold mb-2">${allRooms.find(r => r.id === currentRoomId)?.name}</h3>
      <p>Explore this beautifully designed space in your ${houseId} home.</p>
    </div>`
  });
  
  return markers;
};

/**
 * Get tour preview data for a house
 */
export const getHouseTourPreview = (houseId: string) => {
  const availableRooms = getAvailableRooms(houseId);
  const firstRoom = availableRooms[0];
  
  if (!firstRoom) {
    return {
      thumbnail: '/assets/fallback-360-thumbnail.jpg',
      preview: '/assets/fallback-360-hero.jpg',
      roomCount: 0
    };
  }
  
  return {
    thumbnail: assetPaths.tour360(houseId, firstRoom.id).thumbnail,
    preview: assetPaths.tour360(houseId, firstRoom.id).preview,
    roomCount: availableRooms.length,
    rooms: availableRooms.map(room => room.name)
  };
};

/**
 * Legacy compatibility: Get tour in old format for gradual migration
 */
export const getHouseTourLegacy = (houseId: string) => {
  const scenes = generateHouseTour(houseId);
  
  // Convert to old format for compatibility
  return {
    scenes: scenes.map(scene => ({
      id: scene.id,
      name: scene.name,
      panorama: scene.panorama,
      thumbnail: scene.thumbnail,
      position: scene.position,
      markers: scene.markers
    }))
  };
};
