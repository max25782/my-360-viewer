/*
 * Generate missing .webp files for a given directory (e.g., public/assets/premium)
 * Usage: node scripts/generate-webp-dir.js public/assets/premium
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = process.cwd();
const INPUT = process.argv[2];

if (!INPUT) {
  console.error('Usage: node scripts/generate-webp-dir.js <directory>');
  process.exit(1);
}

const TARGET_DIR = path.isAbsolute(INPUT) ? INPUT : path.join(ROOT, INPUT);

function walkDirectory(startDir) {
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

async function ensureWebpFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') return { converted: false, skipped: true };
  const base = filePath.slice(0, -ext.length);
  const webpPath = `${base}.webp`;
  try {
    if (fs.existsSync(webpPath)) return { converted: false, skipped: true };
    const input = fs.readFileSync(filePath);
    const isPng = ext === '.png';
    const webpOptions = isPng ? { quality: 90, effort: 4, nearLossless: true } : { quality: 82, effort: 4 };
    const output = await sharp(input).webp(webpOptions).toBuffer();
    fs.writeFileSync(webpPath, output);
    return { converted: true, skipped: false };
  } catch (e) {
    return { converted: false, skipped: false, error: e };
  }
}

async function main() {
  const t0 = Date.now();
  if (!fs.existsSync(TARGET_DIR)) {
    console.error(`Directory not found: ${TARGET_DIR}`);
    process.exit(1);
  }
  console.log(`Scanning: ${TARGET_DIR}`);
  const files = walkDirectory(TARGET_DIR);
  console.log(`Found ${files.length} files. Converting missing WEBP...`);
  let converted = 0, skipped = 0, failed = 0;
  const concurrency = 8;
  let index = 0;
  async function worker() {
    while (index < files.length) {
      const i = index++;
      const res = await ensureWebpFor(files[i]);
      if (res.error) { failed++; }
      else if (res.converted) { converted++; if (converted % 50 === 0) console.log(`Converted ${converted}...`); }
      else if (res.skipped) { skipped++; }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`Done in ${dt}s. Converted: ${converted}, skipped: ${skipped}, failed: ${failed}`);
}

main().catch((e) => { console.error(e); process.exit(1); });


