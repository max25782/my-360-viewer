/**
 * Скрипт для генерации манифеста ассетов премиум домов
 * Сканирует директорию /public/assets/premium и создает JSON-манифесты
 * с информацией о доступных домах, комнатах, фотографиях и 360-панорамах
 */

const fs = require('fs');
const path = require('path');

// Корневая директория проекта
const ROOT_DIR = path.resolve(__dirname, '..');
const PREMIUM_ASSETS_DIR = path.join(ROOT_DIR, 'public', 'assets', 'premium');
const INTERIOR_OUTPUT_FILE = path.join(ROOT_DIR, 'public', 'premium-interior-manifest.json');
const PANORAMA_OUTPUT_FILE = path.join(ROOT_DIR, 'public', 'premium-360-manifest.json');

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
 * Сканирует директорию с премиум интерьерами
 * @returns {Object} - Структура манифеста интерьеров
 */
function scanPremiumInteriors() {
  const manifest = {
    houses: {},
    generatedAt: new Date().toISOString()
  };

  // Получаем список домов (поддиректорий в premium)
  const houses = fs.readdirSync(PREMIUM_ASSETS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Найдено ${houses.length} премиум домов`);

  // Для каждого дома сканируем интерьеры
  houses.forEach(house => {
    const interiorDir = path.join(PREMIUM_ASSETS_DIR, house, 'interior');
    
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
      const photos = fs.readdirSync(roomDir)
        .filter(file => isImage(file))
        .map(file => {
          const filePath = `/assets/premium/${house}/interior/${room}/${file}`;
          return {
            filename: file,
            path: filePath,
            type: path.basename(file, path.extname(file)).startsWith('pk') ? 'photo' : 'other'
          };
        });

      manifest.houses[house].rooms[room] = {
        photos: photos
      };
      
      console.log(`  Комната ${room}: найдено ${photos.length} фотографий`);
    });
  });

  return manifest;
}

/**
 * Сканирует директорию с 360-панорамами
 * @returns {Object} - Структура манифеста 360-панорам
 */
function scanPremium360Panoramas() {
  const manifest = {
    houses: {},
    generatedAt: new Date().toISOString()
  };

  // Получаем список домов (поддиректорий в premium)
  const houses = fs.readdirSync(PREMIUM_ASSETS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`\nСканирование 360-панорам для ${houses.length} премиум домов`);

  // Для каждого дома сканируем 360-панорамы
  houses.forEach(house => {
    const panoramaDir = path.join(PREMIUM_ASSETS_DIR, house, '360');
    
    // Проверяем, существует ли директория 360
    if (!fs.existsSync(panoramaDir)) {
      console.log(`Дом ${house} не имеет директории 360, пропускаем`);
      return;
    }

    manifest.houses[house] = { 
      panoramas: {},
      heroImage: null
    };

    // Проверяем наличие hero-изображения
    const heroJpgPath = path.join(panoramaDir, 'hero.jpg');
    const heroPngPath = path.join(panoramaDir, 'hero.png');
    
    if (fs.existsSync(heroJpgPath)) {
      manifest.houses[house].heroImage = `/assets/premium/${house}/360/hero.jpg`;
    } else if (fs.existsSync(heroPngPath)) {
      manifest.houses[house].heroImage = `/assets/premium/${house}/360/hero.png`;
    }
    
    // Получаем список комнат (поддиректорий в 360)
    const rooms = fs.readdirSync(panoramaDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    console.log(`Дом ${house}: найдено ${rooms.length} панорам`);

    // Для каждой комнаты сканируем файлы панорамы
    rooms.forEach(room => {
      const roomDir = path.join(panoramaDir, room);
      
      // Пропускаем, если это не директория
      if (!fs.statSync(roomDir).isDirectory()) return;
      
      const panoramaFiles = fs.readdirSync(roomDir)
        .filter(file => isImage(file))
        .map(file => {
          const filePath = `/assets/premium/${house}/360/${room}/${file}`;
          return {
            filename: file,
            path: filePath,
            // Определяем тип файла панорамы (f, b, l, r, u, d, thumbnail)
            type: path.basename(file, path.extname(file))
          };
        });

      // Проверяем, есть ли thumbnail
      const hasThumbnail = panoramaFiles.some(file => file.filename === 'thumbnail.jpg');
      
      manifest.houses[house].panoramas[room] = {
        files: panoramaFiles,
        hasThumbnail: hasThumbnail,
        thumbnailPath: hasThumbnail ? `/assets/premium/${house}/360/${room}/thumbnail.jpg` : null
      };
      
      console.log(`  Панорама ${room}: найдено ${panoramaFiles.length} файлов`);
    });
  });

  return manifest;
}

/**
 * Основная функция
 */
function main() {
  console.log('Начинаем генерацию манифеста премиум интерьеров...');
  
  try {
    // Генерируем манифест интерьеров
    const interiorManifest = scanPremiumInteriors();
    fs.writeFileSync(INTERIOR_OUTPUT_FILE, JSON.stringify(interiorManifest, null, 2));
    console.log(`Манифест интерьеров успешно сгенерирован и сохранен в ${INTERIOR_OUTPUT_FILE}`);
    console.log(`Всего домов с интерьерами: ${Object.keys(interiorManifest.houses).length}`);
    
    // Генерируем манифест 360-панорам
    const panoramaManifest = scanPremium360Panoramas();
    fs.writeFileSync(PANORAMA_OUTPUT_FILE, JSON.stringify(panoramaManifest, null, 2));
    console.log(`Манифест 360-панорам успешно сгенерирован и сохранен в ${PANORAMA_OUTPUT_FILE}`);
    console.log(`Всего домов с 360-панорамами: ${Object.keys(panoramaManifest.houses).length}`);
  } catch (error) {
    console.error('Ошибка при генерации манифеста:', error);
    process.exit(1);
  }
}

// Запускаем скрипт
main();
