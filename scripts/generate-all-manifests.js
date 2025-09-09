/**
 * Script for generating all manifests in one go
 * This ensures all manifests are generated correctly during build
 */

// Run all manifest generation scripts
require('./generate-assets-manifest.js');
require('./generate-skyline-manifest.js');
require('./generate-premium-comparison-manifest.js');
require('./generate-skyline-comparison-manifest.js');

console.log('✅ All manifests generated successfully');
