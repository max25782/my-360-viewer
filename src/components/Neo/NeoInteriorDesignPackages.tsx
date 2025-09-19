"use client";

import { useState, useEffect } from 'react';
import { NeoHouse } from '../../hooks/useNeoHouse';
import { useNeoRooms } from '../../hooks/useNeoRooms';

interface NeoInteriorDesignPackagesProps {
  house: NeoHouse;
}

export default function NeoInteriorDesignPackages({ house }: NeoInteriorDesignPackagesProps) {
  const [activeScheme, setActiveScheme] = useState<'light' | 'dark'>('light');
  const [packageType, setPackageType] = useState<'good' | 'better'>('good');
  const [selectedRoom, setSelectedRoom] = useState<string>('living');

  // Динамически получаем доступные комнаты для Neo дома
  const { availableRooms, isLoading: roomsLoading, error: roomsError } = useNeoRooms(house.id);

  // Обновляем выбранную комнату когда загружаются комнаты
  useEffect(() => {
    if (availableRooms.length > 0 && !availableRooms.includes(selectedRoom)) {
      // Если текущая выбранная комната недоступна, выбираем первую доступную
      setSelectedRoom(availableRooms[0]);
    }
  }, [availableRooms, selectedRoom]);

  // Преобразуем название комнаты для пути к файлу
  const getRoomPath = (room: string) => {
    return room.toLowerCase();
  };

  // Получаем номер пакета для пути к файлу (только 1 или 2 для интерьера)
  // pk1 - белая (white) схема, pk2 - тёмная (dark) схема
  const getPackageNumber = () => {
    return activeScheme === 'light' ? 1 : 2;
  };
  
  // Получаем правильное имя папки дома (с заглавной буквы и без префикса neo-)
  const getHouseDirectory = () => {
    // Удаляем префикс neo- если он есть
    const cleanId = house.id.startsWith('neo-') ? house.id.substring(4) : house.id;
    // Первая буква заглавная
    return cleanId.charAt(0).toUpperCase() + cleanId.slice(1);
  };
  
  // Функция для отладки - выводит полный путь к файлу
  const getFullPath = () => {
    const path = `/assets/neo/${getHouseDirectory()}/interior/${getRoomPath(selectedRoom)}/pk${getPackageNumber()}.jpg`;
    console.log('Image path:', path);
    return path;
  };

  return (
    <div className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Image Display */}
        <div className="mb-8 relative">
          <div className=" relative overflow-hidden bg-radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.12) 0%, transparent 50%),
                linear-gradient(135deg, #020617 0%, #0f172a 25%, #1e293b 50%, #334155 75%, #475569 100%) min-h-[calc(100dvh-64px)] max-w-full mx-auto ml-10">
            <img 
              src={getFullPath()} 
              alt={`Interior - ${selectedRoom} - ${activeScheme === 'light' ? 'White' : 'Dark'}`} 
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
              onError={(e) => {
                // Если изображение не найдено, пробуем загрузить первый пакет для текущей комнаты
                e.currentTarget.src = `/assets/neo/${getHouseDirectory()}/interior/${getRoomPath(selectedRoom)}/pk1.jpg`;
                // Если и это не сработает, пробуем загрузить изображение для гостиной
                e.currentTarget.onerror = () => {
                  if (e.currentTarget) {
                    e.currentTarget.src = `/assets/neo/${getHouseDirectory()}/interior/living/pk1.jpg`;
                  }
                };
              }}
            />
            {/* Room Selector */}
        <div className="absolute bottom-25 left-8 flex justify-center items-center flex-wrap space-x-2 ">
          {roomsLoading ? (
            <div className="px-4 py-2 m-1 rounded bg-slate-600 text-white">
              Loading rooms...
            </div>
          ) : roomsError ? (
            <div className="px-4 py-2 m-1 rounded bg-red-600 text-white">
              Error loading rooms
            </div>
          ) : availableRooms.length > 0 ? (
            availableRooms.map((room) => (
              <button 
                key={room}
                className={`px-4 py-2 m-1 rounded ${selectedRoom === room ? 'bg-slate-700 text-white' : 'bg-slate-400 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setSelectedRoom(room)}
              >
                {room.charAt(0).toUpperCase() + room.slice(1)}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 m-1 rounded bg-slate-600 text-white">
              No rooms available
            </div>
          )}
            <div className="absolute bottom-15 left-8 bg-slate-700 bg-opacity-50 px-6 py-3 text-white text-xl font-semibold">
              {packageType.charAt(0).toUpperCase() + packageType.slice(1)} Package - {selectedRoom.charAt(0).toUpperCase() + selectedRoom.slice(1)} - {activeScheme === 'light' ? 'White' : 'Dark'}
            </div>
        </div>
          </div>
        </div>

      

        {/* Color Scheme Selector */}
        <div className="absolute bottom-100 left-1 flex-row justify-center space-y-4 mb-8">
          <div 
            className={`w-[5rem] h-[5rem] cursor-pointer ${activeScheme === 'light' ? 'border-4 border-slate-800 shadow-lg transform scale-105 rounded-lg' : 'border-2 border-gray-300 hover:border-gray-400 hover:shadow-md rounded-lg'}`}
            onClick={() => setActiveScheme('light')}
          >
            <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-800">Light</span>
            </div>
          </div>
          
          <div 
            className={`w-[5rem] h-[5rem] cursor-pointer ${activeScheme === 'dark' ? 'border-4 border-slate-800 shadow-lg transform scale-105 rounded-lg' : 'border-2 border-gray-300 hover:border-gray-400 hover:shadow-md rounded-lg'}`}
            onClick={() => setActiveScheme('dark')}
          >
            <div className="h-full w-full bg-slate-700 rounded-lg flex items-center justify-center">
              <span className="text-white">Dark</span>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
