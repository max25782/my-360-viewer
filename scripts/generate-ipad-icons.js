/**
 * Generates iPad-specific icons from logo2.png for apple-touch-icon
 * Sizes: 76, 120, 152, 167, 180 (per Apple HIG and layout.tsx)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IPAD_ICON_SIZES = [76, 120, 152, 167, 180];
const ICONS_DIR = path.join(process.cwd(), 'public/icons');
const SOURCE_LOGO = path.join(process.cwd(), 'public', 'logo2.png');

if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

if (!fs.existsSync(SOURCE_LOGO)) {
  console.error('Source not found: public/logo2.png');
  process.exit(1);
}

async function generate() {
  console.log('Generating iPad icons from logo2.png...');
  for (const size of IPAD_ICON_SIZES) {
    const filename = `icon-ipad-${size}x${size}.png`;
    const filepath = path.join(ICONS_DIR, filename);
    await sharp(SOURCE_LOGO)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(filepath);
    console.log(`Created: ${filename}`);
  }
  console.log('iPad icons generated.');
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
