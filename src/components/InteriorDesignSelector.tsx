'use client';

import { useState, useEffect } from 'react';



interface InteriorDesignSelectorProps {
  houseName: string;
}

export default function InteriorDesignSelector({ houseName }: InteriorDesignSelectorProps) {
  const [selectedInterior, setSelectedInterior] = useState('modern');
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0); // Track room
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track image within room
  const [mounted, setMounted] = useState(false);

  // Reset image index when room changes, but keep room when style changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentRoomIndex, selectedInterior]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mapping styles to packages: Modern=PK1, Classic=PK2, Rustic=PK3, Luxury=PK4
  const styleToPackage = {
    modern: 'PK1',
    classic: 'PK2', 
    rustic: 'PK3',
    luxury: 'PK4'
  };

  // Room definitions (same order for all styles)
  const roomTypes = [
    { name: 'Living Room', folder: 'walnut_liv' },
    { name: 'Bathroom', folder: 'walnut_bathroom' },
    { name: 'Bedroom', folder: 'walnut_bedroom' },
    { name: 'Kitchen', folder: 'walnut_kitchen' }
  ];

  // All room images for each style/package combination (multiple photos per room)
  const styleRoomImages = {
    modern: {
      'Living Room': [
        '/Walnut/walnut_color/walnut_liv/Walnut-PK1-LIV-1.jpg',
        '/Walnut/walnut_color/walnut_liv/Walnut-PK1-LIV-2.jpg'
      ],
      'Bathroom': [
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK1-BATHROOM-1.jpg',
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK1-BATHROOM-2.jpg'
      ],
      'Bedroom': [
        '/Walnut/walnut_color/walnut_bedroom/Walnut-PK1-BEDROOM.jpg'
      ],
      'Kitchen': [
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK1-KITCHEN-1.jpg',
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK1-KITCHEN-2.jpg'
      ]
    },
    classic: {
      'Living Room': [
        '/Walnut/walnut_color/walnut_liv/Walnut-PK2-LIV-PK-2.jpg',
        '/Walnut/walnut_color/walnut_liv/Walnut-PK2-LIV-2-PK-2.jpg'
      ],
      'Bathroom': [
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK2-BATHROOM-PK2.jpg',
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK2-BATHROOM-2-PK2.jpg'
      ],
      'Bedroom': [
        '/Walnut/walnut_color/walnut_bedroom/Walnut-PK2-BEDROOM-PK2.jpg'
      ],
      'Kitchen': [
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK2-KITCHEN-1-PK2.jpg',
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK2-KITCHEN-2-PK2.jpg'
      ]
    },
    rustic: {
      'Living Room': [
        '/Walnut/walnut_color/walnut_liv/Walnut-PK3-LIV-PK3.jpg',
        '/Walnut/walnut_color/walnut_liv/Walnut-PK3-LIV-2-PK3.jpg'
      ],
      'Bathroom': [
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK3-PK3-BATHROOM.jpg',
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK3-BATHROOM-2-PK3.jpg'
      ],
      'Bedroom': [
        '/Walnut/walnut_color/walnut_bedroom/Walnut-PK3-BEDROOM-PK3.jpg'
      ],
      'Kitchen': [
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK3-KITCHEN-1-PK3.jpg',
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK3-KITCHEN-2-PK3.jpg'
      ]
    },
    luxury: {
      'Living Room': [
        '/Walnut/walnut_color/walnut_liv/Walnut-PK4-LIV-PK4.jpg',
        '/Walnut/walnut_color/walnut_liv/Walnut-PK4-LIV-2-PK4.jpg'
      ],
      'Bathroom': [
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK4-BATHROOM-PK4.jpg',
        '/Walnut/walnut_color/walnut_bathroom/Walnut-PK4-BATHROOM-2-PK4.jpg'
      ],
      'Bedroom': [
        '/Walnut/walnut_color/walnut_bedroom/Walnut-PK4-BEDROOM-PK4.jpg'
      ],
      'Kitchen': [
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK4-KITCHEN-1-PK4.jpg',
        '/Walnut/walnut_color/walnut_kitchen/Walnut-PK4-KITCHEN-2-PK4.jpg'
      ]
    }
  };

  // Generate room array for current style
  const getCurrentStyleRooms = () => {
    const currentStyleImages = styleRoomImages[selectedInterior as keyof typeof styleRoomImages];
    return roomTypes.map(room => ({
      name: room.name,
      images: currentStyleImages[room.name as keyof typeof currentStyleImages]
    }));
  };

  const interiorThumbnails = [
    { path: '/Walnut/walnut_color/interior-colors-1-768x384.jpg', interior: 'modern' },
    { path: '/Walnut/walnut_color/interior-colors-2-768x384.jpg', interior: 'classic' },
    { path: '/Walnut/walnut_color/interior-colors-3-768x384.jpg', interior: 'rustic' },
    { path: '/Walnut/walnut_color/interior-colors-4-768x384.jpg', interior: 'luxury' }
  ];

  // Use absolute URLs only after mounting to avoid hydration mismatch
  const getImageUrl = (path: string) => {
    if (mounted && typeof window !== 'undefined') {
      return `${window.location.origin}${path}`;
    }
    return path;
  };

  // Get current rooms for the selected style
  const currentStyleRooms = getCurrentStyleRooms();
  const currentRoom = currentStyleRooms[currentRoomIndex];
  const currentRoomImages = currentRoom.images;
  const currentImage = currentRoomImages[currentImageIndex];
  const currentPackage = styleToPackage[selectedInterior as keyof typeof styleToPackage];

  // Navigation functions
  const nextImage = () => {
    if (currentImageIndex < currentRoomImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      // Go to next room, first image
      setCurrentRoomIndex((prev) => (prev + 1) % currentStyleRooms.length);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    } else {
      // Go to previous room, last image
      const prevRoomIndex = (currentRoomIndex - 1 + currentStyleRooms.length) % currentStyleRooms.length;
      const prevRoom = currentStyleRooms[prevRoomIndex];
      setCurrentRoomIndex(prevRoomIndex);
      setCurrentImageIndex(prevRoom.images.length - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Room Carousel */}
      <div className="rounded-lg overflow-hidden shadow-lg relative">
        <div 
          className="aspect-video relative"
          style={{
            backgroundImage: `url('${getImageUrl(currentImage)}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
       

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
          >
            ←
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
          >
            →
          </button>

          {/* Image Indicator Dots for Current Room */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {currentRoomImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-opacity ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Interior Design Thumbnails with Names */}
      <div className="flex justify-center space-x-6">
        {interiorThumbnails.map((thumb, index) => (
          <div key={index} className="text-center">
            <button 
              onClick={() => setSelectedInterior(thumb.interior)}
              className={`w-16 h-12 rounded shadow-sm transition-all hover:scale-105 mb-2 block ${
                selectedInterior === thumb.interior 
                  ? 'border-4 border-green-500' 
                  : 'border-2 border-white hover:border-gray-300'
              }`}
              style={{
                backgroundImage: `url('${getImageUrl(thumb.path)}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              title={`Select ${thumb.interior} interior`}
            ></button>
            <div className={`text-xs transition-colors ${
              selectedInterior === thumb.interior 
                ? 'text-white font-bold drop-shadow-lg' 
                : 'text-white text-opacity-80 drop-shadow'
            }`}>
              {thumb.interior === 'modern' && 'Modern (ID1)'}
              {thumb.interior === 'classic' && 'Classic (ID2)'}
              {thumb.interior === 'rustic' && 'Rustic (ID3)'}
              {thumb.interior === 'luxury' && 'Luxury (ID4)'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
