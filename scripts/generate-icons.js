/**
 * Скрипт для генерации PNG иконок из SVG для PWA
 * Создает простые заглушки-иконки разных размеров
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const ICONS_DIR = path.join(process.cwd(), 'public/icons');

// Убеждаемся что папка существует
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

console.log('🎨 Генерируем PWA иконки из public/logo.png ...');

const SOURCE_LOGO = path.join(process.cwd(), 'public', 'logo.png');
if (!fs.existsSync(SOURCE_LOGO)) {
  console.warn('⚠️ Не найден public/logo.png. Создаю заглушки.');
}

async function generate() {
  for (const size of ICON_SIZES) {
    const filename = `icon-${size}x${size}.png`;
    const filepath = path.join(ICONS_DIR, filename);
    try {
      if (fs.existsSync(SOURCE_LOGO)) {
        await sharp(SOURCE_LOGO)
          .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toFile(filepath);
      } else {
        // Фоллбек: прозрачная заглушка
        const minimalPNG = Buffer.from([
          0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A,
          0x00,0x00,0x00,0x0D,0x49,0x48,0x44,0x52,
          0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01,
          0x08,0x06,0x00,0x00,0x00,0x1F,0x15,0xC4,0x89,
          0x00,0x00,0x00,0x0A,0x49,0x44,0x41,0x54,
          0x78,0x9C,0x62,0x00,0x00,0x00,0x02,0x00,0x01,0xE2,0x21,0xBC,0x33,
          0x00,0x00,0x00,0x00,0x49,0x45,0x4E,0x44,0xAE,0x42,0x60,0x82
        ]);
        fs.writeFileSync(filepath, minimalPNG);
      }
      console.log(`✅ Создана иконка: ${filename} (${size}x${size})`);
    } catch (e) {
      console.error('❌ Ошибка генерации иконки', filename, e);
    }
  }

  // Shortcuts
  for (const filename of ['shortcut-skyline.png', 'shortcut-tour.png']) {
    const filepath = path.join(ICONS_DIR, filename);
    try {
      if (fs.existsSync(SOURCE_LOGO)) {
        await sharp(SOURCE_LOGO)
          .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toFile(filepath);
      } else {
        const minimalPNG = Buffer.from([
          0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A,
          0x00,0x00,0x00,0x0D,0x49,0x48,0x44,0x52,
          0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01,
          0x08,0x06,0x00,0x00,0x00,0x1F,0x15,0xC4,0x89,
          0x00,0x00,0x00,0x0A,0x49,0x44,0x41,0x54,
          0x78,0x9C,0x62,0x00,0x00,0x00,0x02,0x00,0x01,0xE2,0x21,0xBC,0x33,
          0x00,0x00,0x00,0x00,0x49,0x45,0x4E,0x44,0xAE,0x42,0x60,0x82
        ]);
        fs.writeFileSync(filepath, minimalPNG);
      }
      console.log(`✅ Создана иконка shortcut: ${filename}`);
    } catch (e) {
      console.error('❌ Ошибка генерации shortcut', filename, e);
    }
  }

  console.log('🎉 Все PWA иконки созданы!');
}

generate();

// Создаем дополнительные иконки для shortcuts
const shortcutIcons = ['shortcut-skyline.png', 'shortcut-tour.png'];
shortcutIcons.forEach(filename => {
  const filepath = path.join(ICONS_DIR, filename);
  
  // Используем ту же заглушку
  const minimalPNG = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01,
    0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00,
    0x1F, 0x15, 0xC4, 0x89,
    0x00, 0x00, 0x00, 0x0A,
    0x49, 0x44, 0x41, 0x54,
    0x78, 0x9C, 0x62, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
    0xE2, 0x21, 0xBC, 0x33,
    0x00, 0x00, 0x00, 0x00,
    0x49, 0x45, 0x4E, 0x44,
    0xAE, 0x42, 0x60, 0x82
  ]);
  
  fs.writeFileSync(filepath, minimalPNG);
  console.log(`✅ Создана иконка shortcut: ${filename}`);
});

console.log('🎉 Все PWA иконки созданы!');
