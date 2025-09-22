/*
 * Generate missing .webp files under public/assets/skyline for any .jpg/.png
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = process.cwd();
const SKYLINE_DIR = path.join(ROOT, 'public', 'assets', 'skyline');

/**
 * Recursively walk a directory and collect files
 */
function walkDirectory(startDir) {
  /** @type {string[]} */
  const results = [];
  const stack = [startDir];

  while (stack.length) {
    const current = stack.pop();
    if (!current) continue;
    let entries = [];
    try { entries = fs.readdirSync(current, { withFileTypes: true }); } catch { continue; }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else results.push(full);
    }
  }
  return results;
}

/**
 * Convert a single file to webp if missing
 */
async function ensureWebpFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') return { converted: false, skipped: true };

  const base = filePath.slice(0, -ext.length);
  const webpPath = `${base}.webp`;
  try {
    if (fs.existsSync(webpPath)) return { converted: false, skipped: true };
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const input = fs.readFileSync(filePath);
    // Use lossy webp for jpg, near-lossless for png
    const pipeline = sharp(input);
    const isPng = ext === '.png';
    const webpOptions = isPng
      ? { quality: 90, effort: 4, nearLossless: true }
      : { quality: 82, effort: 4 };
    const output = await pipeline.webp(webpOptions).toBuffer();
    fs.writeFileSync(webpPath, output);
    return { converted: true, skipped: false };
  } catch (e) {
    return { converted: false, skipped: false, error: e };
  }
}

async function main() {
  const t0 = Date.now();
  if (!fs.existsSync(SKYLINE_DIR)) {
    console.error(`Directory not found: ${SKYLINE_DIR}`);
    process.exit(1);
  }

  console.log(`Scanning: ${SKYLINE_DIR}`);
  const files = walkDirectory(SKYLINE_DIR);
  console.log(`Found ${files.length} files. Converting missing WEBP...`);

  let converted = 0;
  let skipped = 0;
  let failed = 0;

  // Simple concurrency control
  const concurrency = 8;
  let index = 0;
  async function worker() {
    while (index < files.length) {
      const i = index++;
      const file = files[i];
      const res = await ensureWebpFor(file);
      if (res.error) {
        failed++;
        console.warn(`Failed: ${path.relative(SKYLINE_DIR, file)} -> ${res.error.message}`);
      } else if (res.converted) {
        converted++;
        if (converted % 50 === 0) console.log(`Converted ${converted}...`);
      } else if (res.skipped) {
        skipped++;
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`Done in ${dt}s. Converted: ${converted}, skipped: ${skipped}, failed: ${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


