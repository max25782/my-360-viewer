// Room type icons for navigation
export const ROOM_ICONS = {
  entry: '🚪', // door icon for entry
  kitchen: '🍳', // cooking icon for kitchen
  bedroom: '🛏️', // bed icon for bedroom
  bathroom: '🚿', // shower icon for bathroom
  guest: '🛋️', // sofa icon for living room/guest room
  living: '📺', // TV icon for living room
  office: '💻', // laptop icon for office
  main: '🏠', // house icon for main room
  bedroom1: '🛏️' // bed icon for bedroom1
};

// Function to get room type from scene key
export const getRoomType = (sceneKey) => {
  if (sceneKey.includes('entry')) return 'entry';
  if (sceneKey.includes('kitchen')) return 'kitchen';
  if (sceneKey.includes('bedroom')) return 'bedroom';
  if (sceneKey.includes('bathroom')) return 'bathroom';
  if (sceneKey.includes('guest')) return 'guest';
  if (sceneKey.includes('living')) return 'living';
  if (sceneKey.includes('office')) return 'office';
  if (sceneKey.includes('main')) return 'main';
  if (sceneKey.includes('bedroom1')) return 'bedroom1';
  return 'main'; // default fallback
};

// Get icon for a room
export const getRoomIcon = (sceneKey) => {
  const roomType = getRoomType(sceneKey);
  return ROOM_ICONS[roomType] || ROOM_ICONS.main;
};

// Function to generate tour scenes for houses with standard structure
const generateStandardHouseTour = (houseId, houseName, rooms) => {
  return rooms.map(room => ({
    key: `${houseId}_${room.name}`,
    title: `${houseName} - ${room.displayName}`,
    panorama: {
      front:  `/assets/${houseId}/3D/${room.name}/${room.tileId}_f.jpg`,
      back:   `/assets/${houseId}/3D/${room.name}/${room.tileId}_b.jpg`,
      left:   `/assets/${houseId}/3D/${room.name}/${room.tileId}_l.jpg`,
      right:  `/assets/${houseId}/3D/${room.name}/${room.tileId}_r.jpg`,
      top:    `/assets/${houseId}/3D/${room.name}/${room.tileId}_u.jpg`,
      bottom: `/assets/${houseId}/3D/${room.name}/${room.tileId}_d.jpg`
    },
    thumbnail: `/assets/${houseId}/3D/${room.name}/${room.thumbnailId}.jpg`,
    yaw: room.yaw || 180,
    pitch: room.pitch || 0,
    connections: room.connections || []
  }));
};

// Tour scenes organized by house for scalability
export const HOUSE_TOURS = {
  walnut: [
    {
      key: 'walnut_entry',
      title: 'Walnut - Entry',
      panorama: {
        front:  '/assets/Walnut/3D/entry/tile-6dVVbXRCmpoOHxg1TKM03JbQHh4fFcOM_f.jpg',
        back:   '/assets/Walnut/3D/entry/tile-6dVVbXRCmpoOHxg1TKM03JbQHh4fFcOM_b.jpg',
        left:   '/assets/Walnut/3D/entry/tile-6dVVbXRCmpoOHxg1TKM03JbQHh4fFcOM_l.jpg',
        right:  '/assets/Walnut/3D/entry/tile-6dVVbXRCmpoOHxg1TKM03JbQHh4fFcOM_r.jpg',
        top:    '/assets/Walnut/3D/entry/tile-6dVVbXRCmpoOHxg1TKM03JbQHh4fFcOM_u.jpg',
        bottom: '/assets/Walnut/3D/entry/tile-6dVVbXRCmpoOHxg1TKM03JbQHh4fFcOM_d.jpg'
      },
      thumbnail: '/assets/Walnut/3D/entry/thumbnail-qwc9E691mj83t8TKcLx5erIxLUnmEEt0.jpg',
      yaw: 180,
      pitch: 0,
      zoom: 50,
      links: [
        { to: 'walnut_kitchen', yaw: 170, pitch: 0 },
        { to: 'walnut_bedroom', yaw: 140, pitch: 0 },
        { to: 'walnut_guest', yaw: 180, pitch: 0 }
      ]
    },
    {
      key: 'walnut_kitchen',
      title: 'Walnut - Kitchen',
      panorama: {
        front:  '/assets/Walnut/3D/kitchen/tile-4ad1SWI2jvYdZW8fEOY48go5qHjVbTxv_f.jpg',
        back:   '/assets/Walnut/3D/kitchen/tile-4ad1SWI2jvYdZW8fEOY48go5qHjVbTxv_b.jpg',
        left:   '/assets/Walnut/3D/kitchen/tile-4ad1SWI2jvYdZW8fEOY48go5qHjVbTxv_l.jpg',
        right:  '/assets/Walnut/3D/kitchen/tile-4ad1SWI2jvYdZW8fEOY48go5qHjVbTxv_r.jpg',
        top:    '/assets/Walnut/3D/kitchen/tile-4ad1SWI2jvYdZW8fEOY48go5qHjVbTxv_u.jpg',
        bottom: '/assets/Walnut/3D/kitchen/tile-4ad1SWI2jvYdZW8fEOY48go5qHjVbTxv_d.jpg'
      },
      thumbnail: '/assets/Walnut/3D/guest/thumbnail-4ad1SWI2jvYdZW8fEOY48go5qHjVbTxv.jpg',
      yaw: 180,
      pitch: 0,
      zoom: 50,
      links: [
        { to: 'walnut_entry', yaw: 340, pitch: 0 },
        { to: 'walnut_guest', yaw: 300, pitch: 90 }
      ]
    },
    {
      key: 'walnut_bedroom',
      title: 'Walnut - Bedroom',
      panorama: {
        front:  '/assets/Walnut/3D/bedroom/tile-o8SXj0LmsF6PhRITmClCImTbnliyiuuw_f.jpg',
        back:   '/assets/Walnut/3D/bedroom/tile-o8SXj0LmsF6PhRITmClCImTbnliyiuuw_b.jpg',
        left:   '/assets/Walnut/3D/bedroom/tile-o8SXj0LmsF6PhRITmClCImTbnliyiuuw_l.jpg',
        right:  '/assets/Walnut/3D/bedroom/tile-o8SXj0LmsF6PhRITmClCImTbnliyiuuw_r.jpg',
        top:    '/assets/Walnut/3D/bedroom/tile-o8SXj0LmsF6PhRITmClCImTbnliyiuuw_u.jpg',
        bottom: '/assets/Walnut/3D/bedroom/tile-o8SXj0LmsF6PhRITmClCImTbnliyiuuw_d.jpg'
      },
      thumbnail: '/assets/Walnut/3D/bedroom/thumbnail-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx.jpg',
      yaw: 180,
      pitch: 0,
      zoom: 50,
      links: [
        { to: 'walnut_bathroom', yaw: 130, pitch: 0 },
        { to: 'walnut_entry', yaw: 65, pitch: 0 },
        
      ]
    },
    {
      key: 'walnut_bathroom',
      title: 'Walnut - Bathroom',
      panorama: {
        front:  '/assets/Walnut/3D/bathroom/tile-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx_f.jpg',
        back:   '/assets/Walnut/3D/bathroom/tile-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx_b.jpg',
        left:   '/assets/Walnut/3D/bathroom/tile-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx_l.jpg',
        right:  '/assets/Walnut/3D/bathroom/tile-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx_r.jpg',
        top:    '/assets/Walnut/3D/bathroom/tile-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx_u.jpg',  // 
        bottom: '/assets/Walnut/3D/bathroom/tile-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx_d.jpg'   // 
      },
      thumbnail: '/assets/Walnut/3D/bedroom/thumbnail-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx.jpg',
      yaw: 0,
      pitch: 0,
      zoom: 50,
      links: [
        { to: 'walnut_bedroom', yaw: 270, pitch: 0 }
      ]
    },
    {
      key: 'walnut_guest',
      title: 'Walnut - Living Room',
      panorama: {
        front:  '/assets/Walnut/3D/guest/tile-qwc9E691mj83t8TKcLx5erIxLUnmEEt0_f.jpg',
        back:   '/assets/Walnut/3D/guest/tile-qwc9E691mj83t8TKcLx5erIxLUnmEEt0_b.jpg',
        left:   '/assets/Walnut/3D/guest/tile-qwc9E691mj83t8TKcLx5erIxLUnmEEt0_l.jpg',
        right:  '/assets/Walnut/3D/guest/tile-qwc9E691mj83t8TKcLx5erIxLUnmEEt0_r.jpg',
        top:    '/assets/Walnut/3D/guest/tile-qwc9E691mj83t8TKcLx5erIxLUnmEEt0_u.jpg',  // 
        bottom: '/assets/Walnut/3D/guest/tile-qwc9E691mj83t8TKcLx5erIxLUnmEEt0_d.jpg'   // 
      },
      thumbnail: '/assets/Walnut/3D/guest/thumbnail-o8SXj0LmsF6PhRITmClCImTbnliyiuuw.jpg',
      yaw: 180,
      pitch: 0,
      zoom: 50,
      links: [
        { to: 'walnut_entry', yaw: 165, pitch: 0 },
        { to: 'walnut_bedroom', yaw: 230, pitch: 0 },
         { to: 'walnut_kitchen', yaw: 300, pitch: 0 }
      ]
    }
  ],
  
  laurel: [
    {
      key: 'laurel_living',
      title: 'Laurel - Living Room',
      panorama: {
        front:  '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_f.jpg',
        back:   '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_b.jpg',
        left:   '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_l.jpg',
        right:  '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_r.jpg',
        top:    '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_u.jpg',
        bottom: '/panoramas/d.jpg'
      },
      thumbnail: '/panoramas/thumbnail-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s.jpg',
      yaw: 0,
      pitch: 0,
      zoom: 50,
      links: []
    }
  ],

  tamarack: [
    {
      key: 'tamarack_main',
      title: 'Tamarack - Main Room',
      panorama: {
        front:  '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_f.jpg',
        back:   '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_b.jpg',
        left:   '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_l.jpg',
        right:  '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_r.jpg',
        top:    '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_u.jpg',
        bottom: '/panoramas/d.jpg'
      },
      thumbnail: '/panoramas/thumbnail-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s.jpg',
      yaw: 0,
      pitch: 0,
      zoom: 50,
      links: []
    }
  ],

  ponderosa: [
    {
      key: 'ponderosa_bedroom1',
      title: 'Ponderosa - Bedroom 1',
      panorama: {
        front:  '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_f.jpg',
        back:   '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_b.jpg',
        left:   '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_l.jpg',
        right:  '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_r.jpg',
        top:    '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_u.jpg',
        bottom: '/panoramas/d.jpg'
      },
      thumbnail: '/panoramas/thumbnail-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s.jpg',
      yaw: 0,
      pitch: 0,
      zoom: 50,
      links: []
    }
  ],

  pine: [
    {
      key: 'pine_office',
      title: 'Pine - Office',
      panorama: {
        front:  '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_f.jpg',
        back:   '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_b.jpg',
        left:   '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_l.jpg',
        right:  '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_r.jpg',
        top:    '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_u.jpg',
        bottom: '/panoramas/d.jpg'
      },
      thumbnail: '/panoramas/thumbnail-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s.jpg',
      yaw: 0,
      pitch: 0,
      zoom: 50,
      links: []
    }
  ],

  cypress: [
    {
      key: 'cypress_bedroom',
      title: 'Cypress - Bedroom',
      panorama: {
        front:  '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_f.jpg',
        back:   '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_b.jpg',
        left:   '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_l.jpg',
        right:  '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_r.jpg',
        top:    '/panoramas/tile-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s_u.jpg',
        bottom: '/panoramas/d.jpg'
      },
      thumbnail: '/panoramas/thumbnail-bUECClKH8FqfwnvXS2BuJl2VGO7DM95s.jpg',
      yaw: 0,
      pitch: 0,
      zoom: 50,
      links: []
    }
  ],

  // Generate tours for new houses using standard structure
  birch: generateStandardHouseTour('birch', 'Birch', [
    {
      name: 'bathroom',
      displayName: 'Bathroom',
      tileId: 'tile-2OKruEH0Poai2Tb0kXbzv4OmmBlnL5g0',
      thumbnailId: 'thumbnail-2OKruEH0Poai2Tb0kXbzv4OmmBlnL5g0'
    },
    {
      name: 'bedroom',
      displayName: 'Bedroom',
      tileId: 'tile-vnCiCkC54s2MiPrgoytuP6nvr0y3mOLI',
      thumbnailId: 'thumbnail-vnCiCkC54s2MiPrgoytuP6nvr0y3mOLI'
    },
    {
      name: 'great room',
      displayName: 'Great Room',
      tileId: 'tile-3HkIjs4H2kOfqsyuT05fB54hmxpzNcxA',
      thumbnailId: 'thumbnail-3HkIjs4H2kOfqsyuT05fB54hmxpzNcxA'
    },
    {
      name: 'hallaway',
      displayName: 'Hallway',
      tileId: 'tile-AFm1rqHKhwjobyvGbEzYiQtmDiJ6zFBq',
      thumbnailId: 'thumbnail-AFm1rqHKhwjobyvGbEzYiQtmDiJ6zFBq'
    },
    {
      name: 'kitchen',
      displayName: 'Kitchen',
      tileId: 'tile-BooykEwqpre5F005WcB9jn66ZXBGmGbV',
      thumbnailId: 'thumbnail-BooykEwqpre5F005WcB9jn66ZXBGmGbV'
    }
  ]),

  cypress: generateStandardHouseTour('cypress', 'Cypress', [
    {
      name: 'bathroom',
      displayName: 'Bathroom',
      tileId: 'tile-vph6tVSOmA6PQmO2KQnnTGaTe2oMVeLO',
      thumbnailId: 'thumbnail-vph6tVSOmA6PQmO2KQnnTGaTe2oMVeLO'
    },
    {
      name: 'bedroom',
      displayName: 'Bedroom',
      tileId: 'tile-2oemcGI6aaB9gH39gavweyuvMePiUOaV',
      thumbnailId: 'thumbnail-2oemcGI6aaB9gH39gavweyuvMePiUOaV'
    },
    {
      name: 'kitchen',
      displayName: 'Kitchen',
      tileId: 'tile-gYQSaJPFa6fxZlRiwMMFKeqimqNy1l7O',
      thumbnailId: 'thumbnail-gYQSaJPFa6fxZlRiwMMFKeqimqNy1l7O'
    },
    {
      name: 'living',
      displayName: 'Living Room',
      tileId: 'tile-Wh3JUVE6C2sjGIEd9k41EoHHtX1eaJ31',
      thumbnailId: 'thumbnail-Wh3JUVE6C2sjGIEd9k41EoHHtX1eaJ31'
    }
  ]),

  hemlock: generateStandardHouseTour('hemlock', 'Hemlock', [
    {
      name: 'bathroom',
      displayName: 'Bathroom',
      tileId: 'tile-PAaQkfHYaPcC0Ch0x8pyl3d2fRoZ4rgN',
      thumbnailId: 'thumbnail-PAaQkfHYaPcC0Ch0x8pyl3d2fRoZ4rgN'
    },
    {
      name: 'bedroom',
      displayName: 'Bedroom',
      tileId: 'tile-FfzpCCYf0xAbcl4S7rcGVAls7QZdaZAA',
      thumbnailId: 'thumbnail-FfzpCCYf0xAbcl4S7rcGVAls7QZdaZAA'
    },
    {
      name: 'kitchen',
      displayName: 'Kitchen',
      tileId: 'tile-mU6tjJTRZGF2PtDgg2nKy2Sqp1HXCNKg',
      thumbnailId: 'thumbnail-mU6tjJTRZGF2PtDgg2nKy2Sqp1HXCNKg'
    }
  ]),

  juniper: generateStandardHouseTour('juniper', 'Juniper', [
    {
      name: 'bathroom',
      displayName: 'Bathroom',
      tileId: 'tile-Hp19Z3Ng8pURxsOwd8xtvNMnOak9u81Y',
      thumbnailId: 'thumbnail-Hp19Z3Ng8pURxsOwd8xtvNMnOak9u81Y'
    },
    {
      name: 'bedroom',
      displayName: 'Bedroom',
      tileId: 'tile-51bVTHD6yDO7M3JfuW7g96hFq9al5TL1',
      thumbnailId: 'thumbnail-51bVTHD6yDO7M3JfuW7g96hFq9al5TL1'
    },
    {
      name: 'great room',
      displayName: 'Great Room',
      tileId: 'tile-IpI4ODRi64LGNieQvKJ0QiPKDHsvalOC',
      thumbnailId: 'thumbnail-IpI4ODRi64LGNieQvKJ0QiPKDHsvalOC'
    }
  ]),

  laurel: generateStandardHouseTour('laurel', 'Laurel', [
    {
      name: 'bathroom',
      displayName: 'Bathroom',
      tileId: 'tile-JKk3zTZTXrYqyfuqTWrBYOLSRl92Mnf7',
      thumbnailId: 'thumbnail-JKk3zTZTXrYqyfuqTWrBYOLSRl92Mnf7'
    },
    {
      name: 'bathroom2',
      displayName: 'Bathroom 2',
      tileId: 'tile-RBzuWs6QwIXWRubpSKJRb7dAoPyNolAc',
      thumbnailId: 'thumbnail-RBzuWs6QwIXWRubpSKJRb7dAoPyNolAc'
    },
    {
      name: 'bedroom',
      displayName: 'Bedroom',
      tileId: 'tile-pE19XXkAAekbeAP11Pd86DLJOQgDRkOv',
      thumbnailId: 'thumbnail-pE19XXkAAekbeAP11Pd86DLJOQgDRkOv'
    },
    {
      name: 'bedroom2',
      displayName: 'Bedroom 2',
      tileId: 'tile-80vcXwiIlGJM9WsIxpMaD2UNnk3mT2V5',
      thumbnailId: 'thumbnail-80vcXwiIlGJM9WsIxpMaD2UNnk3mT2V5'
    },
    {
      name: 'kitchen',
      displayName: 'Kitchen',
      tileId: 'tile-j5HgjyQDHcYv8tfnXAPfdRYmqj4soSEg',
      thumbnailId: 'thumbnail-j5HgjyQDHcYv8tfnXAPfdRYmqj4soSEg'
    },
    {
      name: 'living',
      displayName: 'Living Room',
      tileId: 'tile-P5LjNnjR6GKLnfViTPnxYxpAypCMjZks',
      thumbnailId: 'thumbnail-P5LjNnjR6GKLnfViTPnxYxpAypCMjZks'
    }
  ]),

  Oak: generateStandardHouseTour('Oak', 'Oak', [
    {
      name: 'bathroom',
      displayName: 'Bathroom',
      tileId: 'tile-qzTNuDEIStGpFDynMdNAok7X8VLSX4be',
      thumbnailId: 'thumbnail-qzTNuDEIStGpFDynMdNAok7X8VLSX4be'
    },
    {
      name: 'bedroom',
      displayName: 'Bedroom',
      tileId: 'tile-rWE18EXCIYh7TAfgYs0KEdH5F19uSmcV',
      thumbnailId: 'thumbnail-rWE18EXCIYh7TAfgYs0KEdH5F19uSmcV'
    },
    {
      name: 'entry',
      displayName: 'Entry',
      tileId: 'tile-B2KUd6t217JGJ2cdPNMPpqgc5OBSTF5G',
      thumbnailId: 'thumbnail-B2KUd6t217JGJ2cdPNMPpqgc5OBSTF5G'
    },
    {
      name: 'full view to entry',
      displayName: 'Full View to Entry',
      tileId: 'tile-Dw6JL1B3D4hTogpGir02hLTrCl40b8Mz',
      thumbnailId: 'thumbnail-Dw6JL1B3D4hTogpGir02hLTrCl40b8Mz'
    },
    {
      name: 'kitchen',
      displayName: 'Kitchen',
      tileId: 'tile-Xiz3oAMUsPtR7P6BtItHXYs4SnbLobjM',
      thumbnailId: 'thumbnail-Xiz3oAMUsPtR7P6BtItHXYs4SnbLobjM'
    },
    {
      name: 'living',
      displayName: 'Living Room',
      tileId: 'tile-ZZREvoG32HLyC1hxfQvfHceE0dUYV2T2',
      thumbnailId: 'thumbnail-ZZREvoG32HLyC1hxfQvfHceE0dUYV2T2'
    }
  ])
};

// Legacy SCENES export for backward compatibility
export const SCENES = HOUSE_TOURS.walnut;

// Helper functions
export const getHouseTour = (houseId) => HOUSE_TOURS[houseId] || HOUSE_TOURS.walnut;
export const getScene = (sceneKey, houseId = 'walnut') => {
  const tour = getHouseTour(houseId);
  return tour.find(scene => scene.key === sceneKey);
};
export const getAllHouseIds = () => Object.keys(HOUSE_TOURS);