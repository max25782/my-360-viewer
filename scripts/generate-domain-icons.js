/**
 * Generates Seattle and Alpha domain icons for multi-domain PWA branding.
 * Seattle (seattle-catalog.com): logo.png -> sea-*.png (house)
 * Alpha (alpha-adu.com): logo2.png -> la-*.png (Alpha Dream lion)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ICONS_DIR = path.join(process.cwd(), 'public/icons');
const SIZES = [180, 192, 512];

const SOURCES = {
  sea: path.join(process.cwd(), 'public', 'logo.png'),
  la: path.join(process.cwd(), 'public', 'logo2.png'),
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
