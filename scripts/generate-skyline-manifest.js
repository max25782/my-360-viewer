/**
 * Скрипт для генерации манифеста ассетов Skyline домов
 * Сканирует директорию /public/assets/skyline и создает JSON-манифест
 * с информацией о доступных домах, комнатах и интерьерных фотографиях
 */

const fs = require('fs');
const path = require('path');

// Корневая директория проекта
const ROOT_DIR = path.resolve(__dirname, '..');
const SKYLINE_ASSETS_DIR = path.join(ROOT_DIR, 'public', 'assets', 'skyline');
const OUTPUT_FILE = path.join(ROOT_DIR, 'public', 'skyline-interior-manifest.json');

// Поддерживаемые форматы изображений
const IMAGE_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Проверяет, является ли файл изображением
 * @param {string} filename - Имя файла
 * @returns {boolean}
 */
function isImage(filename) {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_FORMATS.includes(ext);
}

/**
 * Сканирует директорию с интерьерами Skyline домов
 * @returns {Object} - Структура манифеста интерьеров
 */
function scanSkylineInteriors() {
  const manifest = {
    houses: {},
    generatedAt: new Date().toISOString()
  };

  // Получаем список домов (поддиректорий в skyline)
  const houses = fs.readdirSync(SKYLINE_ASSETS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Найдено ${houses.length} Skyline домов`);

  // Для каждого дома сканируем интерьеры
  houses.forEach(house => {
    const interiorDir = path.join(SKYLINE_ASSETS_DIR, house, 'interior');
    
    // Проверяем, существует ли директория interior
    if (!fs.existsSync(interiorDir)) {
      console.log(`Дом ${house} не имеет директории interior, пропускаем`);
      return;
    }

    // Получаем список комнат (поддиректорий в interior)
    const rooms = fs.readdirSync(interiorDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    manifest.houses[house] = { rooms: {} };
    
    console.log(`Дом ${house}: найдено ${rooms.length} комнат`);

    // Для каждой комнаты сканируем фотографии
    rooms.forEach(room => {
      const roomDir = path.join(interiorDir, room);
      
      // Проверяем, существует ли директория комнаты
      if (!fs.existsSync(roomDir)) {
        console.log(`Комната ${room} не существует, пропускаем`);
        return;
      }
      
      try {
        const photos = fs.readdirSync(roomDir)
          .filter(file => isImage(file))
          .map(file => {
            const filePath = `/assets/skyline/${house}/interior/${room}/${file}`;
            return {
              filename: file,
              path: filePath,
              type: path.basename(file, path.extname(file)).startsWith('pk') ? 'photo' : 'other',
              pk: parseInt(path.basename(file, path.extname(file)).split('.')[0].replace('pk', '')) || 0
            };
          });

        manifest.houses[house].rooms[room] = {
          photos: photos
        };
        
        console.log(`  Комната ${room}: найдено ${photos.length} фотографий`);
      } catch (error) {
        console.error(`Ошибка при сканировании комнаты ${room} в доме ${house}:`, error);
      }
    });
  });

  return manifest;
}

/**
 * Основная функция
 */
function main() {
  console.log('Начинаем генерацию манифеста Skyline интерьеров...');
  
  try {
    // Генерируем манифест интерьеров
    const interiorManifest = scanSkylineInteriors();
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(interiorManifest, null, 2));
    console.log(`Манифест интерьеров успешно сгенерирован и сохранен в ${OUTPUT_FILE}`);
    console.log(`Всего домов с интерьерами: ${Object.keys(interiorManifest.houses).length}`);
  } catch (error) {
    console.error('Ошибка при генерации манифеста:', error);
    process.exit(1);
  }
}

// Запускаем скрипт
main();
