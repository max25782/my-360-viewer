/**
 * Утилита для получения списка доступных комнат для Premium домов на стороне клиента
 */

// Стандартный список комнат для проверки
export const commonPremiumRooms = [
  'living', 'kitchen', 'bedroom', 'bathroom', 'dining',
  'entry', 'office', 'bathroom2', 'bedroom2', 'bedroom3',
  'great room', 'shower area', 'third flor hallway',
  'living2', 'kitchen2', 'hallway'
];

// Карта соответствия ID домов и их комнат (для оптимизации)
const premiumHouseRooms: Record<string, string[]> = {
  'Aspen': ['living', 'kitchen', 'bedroom', 'bathroom', 'dining'],
  'Canyon': ['entry', 'living', 'dining', 'kitchen', 'bedroom', 'bathroom'],
  'Redwood': ['living', 'kitchen', 'bedroom', 'bathroom', 'dining'],
  'Everest': ['living', 'kitchen', 'bedroom', 'bathroom', 'dining','great room','entry'],
  'Willow': [ 'living', 'dining', 'kitchen', 'bedroom', 'bathroom']
};

/**
 * Получает список доступных комнат для конкретного дома
 * @param houseId ID дома
 * @returns Массив доступных комнат или пустой массив, если информация не найдена
 */
export function getPremiumRoomsForHouse(houseId: string): string[] {
  if (!houseId) return [];
  
  // Нормализуем ID дома для поиска без учета регистра
  const normalizedId = houseId.toLowerCase();
  
  // Ищем точное совпадение
  if (premiumHouseRooms[houseId]) {
    return premiumHouseRooms[houseId];
  }
  
  // Ищем без учета регистра
  const matchedKey = Object.keys(premiumHouseRooms).find(
    key => key.toLowerCase() === normalizedId
  );
  
  if (matchedKey) {
    return premiumHouseRooms[matchedKey];
  }
  
  // Если не нашли, возвращаем стандартный список для проверки
  return commonPremiumRooms;
}
