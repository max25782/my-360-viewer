/**
 * Скрипт для конвертации JPG/JPEG изображений в формат WebP
 * Использует библиотеку Sharp для оптимизации изображений
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Корневая директория проекта
const ROOT_DIR = path.resolve(__dirname);
const ASSETS_DIR = path.join(ROOT_DIR, 'public', 'assets');

// Поддерживаемые форматы изображений для конвертации
const SUPPORTED_FORMATS = ['.jpg', '.jpeg'];

// Настройки качества WebP
const WEBP_OPTIONS = {
  quality: 80, // Качество от 1 до 100
  lossless: false,
  effort: 4, // Уровень сжатия от 0 до 6
};

// Счетчики для статистики
let totalFiles = 0;
let convertedFiles = 0;
let skippedFiles = 0;
let errorFiles = 0;

/**
 * Проверяет, является ли файл поддерживаемым изображением
 * @param {string} filename - Имя файла
 * @returns {boolean}
 */
function isSupportedImage(filename) {
  const ext = path.extname(filename).toLowerCase();
  return SUPPORTED_FORMATS.includes(ext);
}

/**
 * Конвертирует изображение в формат WebP
 * @param {string} sourcePath - Путь к исходному файлу
 * @returns {Promise<void>}
 */
async function convertToWebP(sourcePath) {
  try {
    const webpPath = sourcePath.replace(/\.(jpe?g)$/i, '.webp');
    
    // Проверяем, существует ли уже WebP версия
    if (fs.existsSync(webpPath)) {
      console.log(`Skipping (already exists): ${webpPath}`);
      skippedFiles++;
      return;
    }
    
    // Конвертируем изображение
    await sharp(sourcePath)
      .webp(WEBP_OPTIONS)
      .toFile(webpPath);
    
    console.log(`Converted: ${sourcePath} -> ${webpPath}`);
    convertedFiles++;
  } catch (error) {
    console.error(`Error converting ${sourcePath}:`, error.message);
    errorFiles++;
  }
}

/**
 * Рекурсивно обходит директорию и конвертирует изображения
 * @param {string} directory - Путь к директории
 * @param {string[]} [specificPaths] - Массив конкретных путей для конвертации
 * @returns {Promise<void>}
 */
async function processDirectory(directory, specificPaths = null) {
  // Если указаны конкретные пути, обрабатываем только их
  if (specificPaths && specificPaths.length > 0) {
    for (const filePath of specificPaths) {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        
        if (stats.isFile() && isSupportedImage(filePath)) {
          totalFiles++;
          await convertToWebP(filePath);
        } else if (stats.isDirectory()) {
          await processDirectory(filePath);
        }
      }
    }
    return;
  }
  
  // Иначе рекурсивно обходим директорию
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile() && isSupportedImage(entry.name)) {
      totalFiles++;
      await convertToWebP(fullPath);
    }
  }
}

/**
 * Основная функция
 */
async function main() {
  try {
    // Получаем аргументы командной строки
    const args = process.argv.slice(2);
    
    // Если указаны конкретные пути, конвертируем только их
    if (args.length > 0) {
      const specificPaths = args.map(arg => {
        // Если путь абсолютный, используем его как есть
        if (path.isAbsolute(arg)) {
          return arg;
        }
        // Иначе считаем путь относительно корня проекта
        return path.join(ROOT_DIR, arg);
      });
      
      console.log(`Starting WebP conversion for ${specificPaths.length} specific paths...`);
      await processDirectory(null, specificPaths);
    } else {
      // Иначе конвертируем все изображения в директории assets
      console.log('Starting WebP conversion for all images in assets directory...');
      await processDirectory(ASSETS_DIR);
    }
    
    // Выводим статистику
    console.log('\nConversion complete!');
    console.log(`Total files processed: ${totalFiles}`);
    console.log(`Converted to WebP: ${convertedFiles}`);
    console.log(`Skipped (already exists): ${skippedFiles}`);
    console.log(`Errors: ${errorFiles}`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Запускаем скрипт
main();
