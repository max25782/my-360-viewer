/**
 * Generates Seattle and LA domain icons for multi-domain PWA branding.
 * Seattle: logo2.png -> sea-180.png, sea-192.png, sea-512.png
 * LA: logo.png -> la-180.png, la-192.png, la-512.png
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ICONS_DIR = path.join(process.cwd(), 'public/icons');
const SIZES = [180, 192, 512];

const SOURCES = {
  sea: path.join(process.cwd(), 'public', 'logo2.png'),
  la: path.join(process.cwd(), 'public', 'logo.png'),
};

if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

async function generate() {
  for (const [prefix, sourcePath] of Object.entries(SOURCES)) {
    if (!fs.existsSync(sourcePath)) {
      console.warn(`Skip ${prefix}: source not found: ${sourcePath}`);
      continue;
    }
    for (const size of SIZES) {
      const filename = `${prefix}-${size}.png`;
      const filepath = path.join(ICONS_DIR, filename);
      await sharp(sourcePath)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(filepath);
      console.log(`Created: ${filename}`);
    }
  }
  console.log('Domain icons generated.');
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
