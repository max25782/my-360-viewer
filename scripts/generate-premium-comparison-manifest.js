/**
 * Script for generating premium comparison images manifest
 */

const fs = require('fs');
const path = require('path');

// Path to assets directory
const ASSETS_DIR = path.join(__dirname, '../public/assets/premium');
// Path to save manifest
const MANIFEST_PATH = path.join(__dirname, '../public/premium-comparison-manifest.json');

// Function to scan directories
function scanDirectories() {
  console.log('🔍 Scanning premium house directories for comparison images...');
  
  const manifest = {
    houses: {},
    generatedAt: new Date().toISOString()
  };

  // Check if directory exists
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`❌ Directory ${ASSETS_DIR} not found!`);
    return manifest;
  }

  // Get list of houses (subdirectories)
  const houses = fs.readdirSync(ASSETS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`📂 Found ${houses.length} premium houses`);

  // Process each house
  houses.forEach(house => {
    const comparisonDir = path.join(ASSETS_DIR, house, 'comparison');
    
    // Check if comparison directory exists
    if (!fs.existsSync(comparisonDir)) {
      console.log(`⚠️ House ${house} has no comparison directory`);
      return;
    }

    // Get list of files in comparison directory
    const files = fs.readdirSync(comparisonDir, { withFileTypes: true })
      .filter(file => file.isFile())
      .map(file => ({
        filename: file.name,
        path: `/assets/premium/${house}/comparison/${file.name}`,
        type: path.extname(file.name).substring(1) // File extension without dot
      }));

    if (files.length > 0) {
      // Add house information to manifest
      manifest.houses[house] = {
        comparison: {
          plans: files
        }
      };
      console.log(`✅ House ${house}: found ${files.length} comparison images`);
    } else {
      console.log(`⚠️ House ${house} has no comparison images`);
    }
  });

  return manifest;
}

// Main function
function main() {
  console.log('🚀 Starting generation of premium comparison images manifest...');
  
  const manifest = scanDirectories();
  
  // Save manifest to file
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  
  console.log(`✅ Manifest saved to ${MANIFEST_PATH}`);
  console.log(`📊 Statistics: processed ${Object.keys(manifest.houses).length} houses`);
}

// Run the script
main();