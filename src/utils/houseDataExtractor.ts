// Утилиты для извлечения данных о домах из JSON файлов

interface HouseSpecs {
  bedrooms: number;
  bathrooms: number;
  area: string;
}

// Функция для извлечения данных из Premium houses
export function extractPremiumHouseSpecs(houseData: any): HouseSpecs {
  let bedrooms = 1;
  let bathrooms = 1;
  let area = "N/A";

  if (houseData?.comparison?.features) {
    // Premium houses имеют массив строк с описанием
    const features = houseData.comparison.features;
    
    // Ищем информацию о спальнях
    const bedroomFeature = features.find((feature: string) => 
      feature.toLowerCase().includes('bedroom') && /\d+/.test(feature)
    );
    if (bedroomFeature) {
      const match = bedroomFeature.match(/(\d+)/);
      if (match) bedrooms = parseInt(match[1]);
    }

    // Ищем информацию о ванных комнатах
    const bathroomFeature = features.find((feature: string) => 
      feature.toLowerCase().includes('bathroom') && /\d+/.test(feature)
    );
    if (bathroomFeature) {
      const match = bathroomFeature.match(/(\d+(?:\.\d+)?)/);
      if (match) bathrooms = parseFloat(match[1]);
    }

    // Ищем информацию о площади
    const areaFeature = features.find((feature: string) => 
      feature.toLowerCase().includes('sf') || feature.toLowerCase().includes('square feet')
    );
    if (areaFeature) {
      const clean = areaFeature.replace(/,/g, '');
      const matches = clean.match(/\d{3,6}/g);
      if (matches) {
        const numbers = matches.map((m: string) => parseInt(m, 10));
        const maxNumber = Math.max(...numbers);
        area = `${maxNumber} sq ft`;
      }
    }
  }

  // Также проверяем описание дома
  if (houseData?.description) {
    const description = houseData.description;
    
    // Извлекаем из описания, если не нашли в features
    if (bedrooms === 1) {
      const bedroomMatch = description.match(/(\d+)-bedroom/i);
      if (bedroomMatch) bedrooms = parseInt(bedroomMatch[1]);
    }
    
    if (bathrooms === 1) {
      const bathroomMatch = description.match(/(\d+)-bath/i);
      if (bathroomMatch) bathrooms = parseInt(bathroomMatch[1]);
    }
    
    if (area === "N/A") {
      const clean = description.replace(/,/g, '');
      const matches = clean.match(/\d{3,6}/g);
      if (matches) {
        const numbers = matches.map((m: string) => parseInt(m, 10));
        const maxNumber = Math.max(...numbers);
        area = `${maxNumber} sq ft`;
      }
    }
  }

  return { bedrooms, bathrooms, area };
}

// Функция для извлечения данных из Neo houses
export function extractNeoHouseSpecs(houseData: any): HouseSpecs {
  let bedrooms = 1;
  let bathrooms = 1;
  let area = "N/A";

  if (houseData?.comparison?.features) {
    const features = houseData.comparison.features;
    
    // Neo houses имеют структуру с ключами good/better/best
    if (features.Bedrooms?.good) {
      const match = features.Bedrooms.good.match(/(\d+)/);
      if (match) bedrooms = parseInt(match[1]);
    }

    if (features.Bathrooms?.good) {
      const match = features.Bathrooms.good.match(/(\d+(?:\.\d+)?)/);
      if (match) bathrooms = parseFloat(match[1]);
    }

    if (features['Living Space']?.good) {
      const text = String(features['Living Space'].good).replace(/,/g, '');
      // Найти все числа от 3 до 6 цифр и взять наибольшее
      const matches = text.match(/\d{3,6}/g);
      if (matches) {
        const numbers = matches.map((m: string) => parseInt(m, 10));
        const maxNumber = Math.max(...numbers);
        area = `${maxNumber} sq ft`;
      }
    }

    // Если нет прямой площади, пробуем вычислить из габаритов (например: 36'x14')
    if (area === "N/A" && typeof features['Overall dimensions']?.good === 'string') {
      const dims = features['Overall dimensions'].good;
      const dm = dims.match(/(\d+(?:\.\d+)?)\s*(?:ft|')\s*x\s*(\d+(?:\.\d+)?)\s*(?:ft|')/i);
      if (dm) {
        const a = parseFloat(dm[1]);
        const b = parseFloat(dm[2]);
        const sqft = Math.round(a * b);
        if (!Number.isNaN(sqft) && sqft > 0) area = `${sqft} sq ft`;
      }
    }
  }

  // Фоллбеки из описания (на случай отсутствия данных в features)
  if (houseData?.description) {
    const description = houseData.description;
    
    if (bedrooms === 1) {
      const bedroomMatch = description.match(/(\d+)-bedroom/i);
      if (bedroomMatch) bedrooms = parseInt(bedroomMatch[1]);
    }
    
    if (bathrooms === 1) {
      const bathroomMatch = description.match(/(\d+(?:\.\d+)?)-bath/i);
      if (bathroomMatch) bathrooms = parseFloat(bathroomMatch[1]);
    }
    
    if (area === "N/A") {
      const clean = description.replace(/,/g, '');
      const matches = clean.match(/\d{3,6}/g);
      if (matches) {
        const numbers = matches.map((m: string) => parseInt(m, 10));
        const maxNumber = Math.max(...numbers);
        area = `${maxNumber} sq ft`;
      }
    }
  }

  return { bedrooms, bathrooms, area };
}

// Функция для извлечения данных из Skyline houses
export function extractSkylineHouseSpecs(houseData: any): HouseSpecs {
  let bedrooms = 1;
  let bathrooms = 1;
  let area = "N/A";

  if (houseData?.comparison?.features) {
    const features = houseData.comparison.features;
    
    // Skyline houses имеют структуру с ключами good/better/best
    if (features.Bedrooms?.good) {
      const match = features.Bedrooms.good.match(/(\d+)/);
      if (match) bedrooms = parseInt(match[1]);
    }

    if (features.Bathrooms?.good) {
      const match = features.Bathrooms.good.match(/(\d+(?:\.\d+)?)/);
      if (match) bathrooms = parseFloat(match[1]);
    }

    if (features['Living Space']?.good) {
      const text = String(features['Living Space'].good).replace(/,/g, '');
      // Найти все числа от 3 до 6 цифр и взять наибольшее
      const matches = text.match(/\d{3,6}/g);
      if (matches) {
        const numbers = matches.map((m: string) => parseInt(m, 10));
        const maxNumber = Math.max(...numbers);
        area = `${maxNumber} sq ft`;
      }
    }
  }

  // Извлекаем из описания, если не нашли в features
  if (houseData?.description) {
    const description = houseData.description;
    
    if (bedrooms === 1) {
      const bedroomMatch = description.match(/(\d+)\s+bedrooms?/i);
      if (bedroomMatch) bedrooms = parseInt(bedroomMatch[1]);
    }
    
    if (bathrooms === 1) {
      // Ищем "two and a half baths" или "2.5 baths"
      const halfBathMatch = description.match(/(two|three|four|five|\d+)\s+and\s+a\s+half\s+baths?/i);
      if (halfBathMatch) {
        const numberWord = halfBathMatch[1].toLowerCase();
        const wordToNumber: Record<string, number> = {
          'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5
        };
        const baseNumber = wordToNumber[numberWord] || parseInt(halfBathMatch[1]);
        bathrooms = baseNumber + 0.5;
      } else {
        const bathroomMatch = description.match(/(\d+(?:\.\d+)?)\s+baths?/i);
        if (bathroomMatch) {
          bathrooms = parseFloat(bathroomMatch[1]);
        }
      }
    }
    
    if (area === "N/A") {
      const clean = description.replace(/,/g, '');
      const matches = clean.match(/\d{3,6}/g);
      if (matches) {
        const numbers = matches.map((m: string) => parseInt(m, 10));
        const maxNumber = Math.max(...numbers);
        area = `${maxNumber} sq ft`;
      }
    }
  }

  // Подсчитываем из availableRooms как fallback
  if (houseData?.availableRooms && Array.isArray(houseData.availableRooms)) {
    if (bedrooms === 1) {
      const bedroomCount = houseData.availableRooms.filter((room: string) => 
        room.toLowerCase().includes('bedroom')
      ).length;
      if (bedroomCount > 0) bedrooms = bedroomCount;
    }
    
    if (bathrooms === 1) {
      const bathroomCount = houseData.availableRooms.filter((room: string) => 
        room.toLowerCase().includes('bathroom')
      ).length;
      if (bathroomCount > 0) bathrooms = bathroomCount;
    }
  }

  return { bedrooms, bathrooms, area };
}

// Универсальная функция для извлечения данных в зависимости от коллекции
export function extractHouseSpecs(houseData: any, collection: string): HouseSpecs {
  switch (collection.toLowerCase()) {
    case 'premium':
      return extractPremiumHouseSpecs(houseData);
    case 'neo':
      return extractNeoHouseSpecs(houseData);
    case 'skyline':
      return extractSkylineHouseSpecs(houseData);
    default:
      return { bedrooms: 1, bathrooms: 1, area: "N/A" };
  }
}
