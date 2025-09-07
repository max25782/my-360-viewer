/**
 * Фиксированные данные для премиум домов
 * Используются для гарантированной консистентности между сервером и клиентом
 */

// Тип для данных дома
interface HouseData {
  bedrooms: number;
  bathrooms: number;
  livingSpace: string;
}

// Словарь с данными для всех премиум домов
// ВАЖНО: Эти данные должны быть одинаковыми на сервере и клиенте
export const PREMIUM_HOUSE_DATA: Record<string, HouseData> = {
  'aspen': {
    bedrooms: 4,
    bathrooms: 3,
    livingSpace: '2,362'
  },
  'canyon': {
    bedrooms: 4,
    bathrooms: 3,
    livingSpace: '2,622'
  },
  'everest': {
    bedrooms: 4,
    bathrooms: 3,
    livingSpace: '2,769'
  },
  'willow': {
    bedrooms: 3,
    bathrooms: 1,
    livingSpace: '2,993'
  },
  'redwood': {
    bedrooms: 3,
    bathrooms: 1,
    livingSpace: '2,993'
  }
};

/**
 * Получает данные для премиум дома по его ID
 */
export function getPremiumHouseData(houseId: string) {
  // Очищаем ID от префикса и приводим к нижнему регистру
  const cleanId = houseId.replace('premium-', '').toLowerCase();
  
  // Возвращаем данные из словаря или значения по умолчанию
  return PREMIUM_HOUSE_DATA[cleanId] || {
    bedrooms: 4,
    bathrooms: 3,
    livingSpace: '2,500'
  };
}

/**
 * Возвращает объект features для премиум дома
 */
export function getPremiumHouseFeatures(houseId: string) {
  const houseData = getPremiumHouseData(houseId);
  
  return {
    "bedrooms": {
      good: String(houseData.bedrooms),
      better: String(houseData.bedrooms),
      best: String(houseData.bedrooms)
    },
    "bathrooms": {
      good: String(houseData.bathrooms),
      better: String(houseData.bathrooms),
      best: String(houseData.bathrooms)
    },
    "livingSpace": {
      good: houseData.livingSpace,
      better: houseData.livingSpace,
      best: houseData.livingSpace
    }
  };
}
