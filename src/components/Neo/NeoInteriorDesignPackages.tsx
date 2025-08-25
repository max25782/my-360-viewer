"use client";

import { useState } from 'react';
import { NeoHouse } from '../../hooks/useNeoHouse';

interface NeoInteriorDesignPackagesProps {
  house: NeoHouse;
}

export default function NeoInteriorDesignPackages({ house }: NeoInteriorDesignPackagesProps) {
  const [activeScheme, setActiveScheme] = useState<'light' | 'dark'>('light');
  const [packageType, setPackageType] = useState<'good' | 'better'>('good');
  const [selectedRoom, setSelectedRoom] = useState<string>('living');

  // Доступные комнаты для Neo домов
  const availableRooms = house.availableRooms || ['living', 'kitchen', 'bedroom', 'bathroom', 'wik'];

  // Преобразуем название комнаты для пути к файлу
  const getRoomPath = (room: string) => {
    return room.toLowerCase();
  };

  // Получаем номер пакета для пути к файлу (только 1 или 2 для интерьера)
  // pk1 - белая (white) схема, pk2 - тёмная (dark) схема
  const getPackageNumber = () => {
    return activeScheme === 'light' ? 1 : 2;
  };
  
  // Функция для отладки - выводит полный путь к файлу
  const getFullPath = () => {
    const path = `/assets/neo/${house.id}/interior/${getRoomPath(selectedRoom)}/pk${getPackageNumber()}.jpg`;
    console.log('Image path:', path);
    return path;
  };

  return (
    <section className="py-16 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold uppercase tracking-widest text-gray-900 mb-2">
            INTERIOR
          </h2>
          <p className="text-lg text-gray-600">
            Explore the Dark and Light interior packages of each level of our {house.name} ADU.
          </p>
        </div>

        {/* Main Image Display */}
        <div className="mb-8 relative">
          <div className="relative">
            <img 
              src={getFullPath()} 
              alt={`Interior - ${selectedRoom} - ${activeScheme === 'light' ? 'White' : 'Dark'}`} 
              className="w-full h-[500px] object-cover rounded-lg shadow-lg"
              onError={(e) => {
                // Если изображение не найдено, пробуем загрузить первый пакет для текущей комнаты
                e.currentTarget.src = `/assets/neo/${house.id}/interior/${getRoomPath(selectedRoom)}/pk1.jpg`;
                // Если и это не сработает, пробуем загрузить изображение для гостиной
                e.currentTarget.onerror = () => {
                  if (e.currentTarget) {
                    e.currentTarget.src = `/assets/neo/${house.id}/interior/living/pk1.jpg`;
                  }
                };
              }}
            />
            <div className="absolute bottom-8 left-8 bg-black bg-opacity-50 px-6 py-3 text-white text-xl font-semibold">
              {packageType.charAt(0).toUpperCase() + packageType.slice(1)} Package - {selectedRoom.charAt(0).toUpperCase() + selectedRoom.slice(1)} - {activeScheme === 'light' ? 'White' : 'Dark'}
            </div>
          </div>
        </div>

        {/* Room Selector */}
        <div className="flex justify-center flex-wrap space-x-2 mb-8">
          {availableRooms.map((room) => (
            <button 
              key={room}
              className={`px-4 py-2 m-1 rounded ${selectedRoom === room ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setSelectedRoom(room)}
            >
              {room.charAt(0).toUpperCase() + room.slice(1)}
            </button>
          ))}
        </div>

        {/* Color Scheme Selector */}
        <div className="flex justify-center space-x-4 mb-8">
          <div 
            className={`w-24 h-24 cursor-pointer ${activeScheme === 'light' ? 'border-4 border-blue-500' : 'border border-gray-300'}`}
            onClick={() => setActiveScheme('light')}
          >
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-800">Light</span>
            </div>
          </div>
          
          <div 
            className={`w-24 h-24 cursor-pointer ${activeScheme === 'dark' ? 'border-4 border-blue-500' : 'border border-gray-300'}`}
            onClick={() => setActiveScheme('dark')}
          >
            <div className="h-full w-full bg-gray-800 flex items-center justify-center">
              <span className="text-white">Dark</span>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
