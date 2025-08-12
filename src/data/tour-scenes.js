// Tour scenes organized by house for scalability
export const HOUSE_TOURS = {
  walnut: [
    {
      key: 'walnut_entry',
      title: 'Walnut - Entry',
      panorama: {
        front:  '/Walnut/3D/entry/tile-6dVVbXRCmpoOHxg1TKM03JbQHh4fFcOM_f.jpg',
        back:   '/Walnut/3D/entry/tile-6dVVbXRCmpoOHxg1TKM03JbQHh4fFcOM_b.jpg',
        left:   '/Walnut/3D/entry/tile-6dVVbXRCmpoOHxg1TKM03JbQHh4fFcOM_l.jpg',
        right:  '/Walnut/3D/entry/tile-6dVVbXRCmpoOHxg1TKM03JbQHh4fFcOM_r.jpg',
        top:    '/Walnut/3D/entry/tile-6dVVbXRCmpoOHxg1TKM03JbQHh4fFcOM_u.jpg',
        bottom: '/Walnut/3D/entry/tile-6dVVbXRCmpoOHxg1TKM03JbQHh4fFcOM_d.jpg'
      },
      thumbnail: '/Walnut/3D/entry/thumbnail-qwc9E691mj83t8TKcLx5erIxLUnmEEt0.jpg',
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
        front:  '/Walnut/3D/kitchen/tile-4ad1SWI2jvYdZW8fEOY48go5qHjVbTxv_f.jpg',
        back:   '/Walnut/3D/kitchen/tile-4ad1SWI2jvYdZW8fEOY48go5qHjVbTxv_b.jpg',
        left:   '/Walnut/3D/kitchen/tile-4ad1SWI2jvYdZW8fEOY48go5qHjVbTxv_l.jpg',
        right:  '/Walnut/3D/kitchen/tile-4ad1SWI2jvYdZW8fEOY48go5qHjVbTxv_r.jpg',
        top:    '/Walnut/3D/kitchen/tile-4ad1SWI2jvYdZW8fEOY48go5qHjVbTxv_u.jpg',
        bottom: '/Walnut/3D/kitchen/tile-4ad1SWI2jvYdZW8fEOY48go5qHjVbTxv_d.jpg'
      },
      thumbnail: '/Walnut/3D/guest/thumbnail-4ad1SWI2jvYdZW8fEOY48go5qHjVbTxv.jpg',
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
        front:  '/Walnut/3D/bedroom/tile-o8SXj0LmsF6PhRITmClCImTbnliyiuuw_f.jpg',
        back:   '/Walnut/3D/bedroom/tile-o8SXj0LmsF6PhRITmClCImTbnliyiuuw_b.jpg',
        left:   '/Walnut/3D/bedroom/tile-o8SXj0LmsF6PhRITmClCImTbnliyiuuw_l.jpg',
        right:  '/Walnut/3D/bedroom/tile-o8SXj0LmsF6PhRITmClCImTbnliyiuuw_r.jpg',
        top:    '/Walnut/3D/bedroom/tile-o8SXj0LmsF6PhRITmClCImTbnliyiuuw_u.jpg',
        bottom: '/Walnut/3D/bedroom/tile-o8SXj0LmsF6PhRITmClCImTbnliyiuuw_d.jpg'
      },
      thumbnail: '/Walnut/3D/bedroom/thumbnail-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx.jpg',
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
        front:  '/Walnut/3D/bathroom/tile-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx_f.jpg',
        back:   '/Walnut/3D/bathroom/tile-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx_b.jpg',
        left:   '/Walnut/3D/bathroom/tile-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx_l.jpg',
        right:  '/Walnut/3D/bathroom/tile-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx_r.jpg',
        top:    '/Walnut/3D/bathroom/tile-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx_u.jpg',  // 
        bottom: '/Walnut/3D/bathroom/tile-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx_d.jpg'   // 
      },
      thumbnail: '/Walnut/3D/bedroom/thumbnail-1IRmen05MEL5jxwq01bnLCP6V0FuCTQx.jpg',
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
        front:  '/Walnut/3D/guest/tile-qwc9E691mj83t8TKcLx5erIxLUnmEEt0_f.jpg',
        back:   '/Walnut/3D/guest/tile-qwc9E691mj83t8TKcLx5erIxLUnmEEt0_b.jpg',
        left:   '/Walnut/3D/guest/tile-qwc9E691mj83t8TKcLx5erIxLUnmEEt0_l.jpg',
        right:  '/Walnut/3D/guest/tile-qwc9E691mj83t8TKcLx5erIxLUnmEEt0_r.jpg',
        top:    '/Walnut/3D/guest/tile-qwc9E691mj83t8TKcLx5erIxLUnmEEt0_u.jpg',  // 
        bottom: '/Walnut/3D/guest/tile-qwc9E691mj83t8TKcLx5erIxLUnmEEt0_d.jpg'   // 
      },
      thumbnail: '/Walnut/3D/guest/thumbnail-o8SXj0LmsF6PhRITmClCImTbnliyiuuw.jpg',
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
  ]
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