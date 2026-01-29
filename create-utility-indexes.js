#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const UTILITIES_DIR = path.join(__dirname, 'components', 'utilities');

// Directories that need index.ts files
const UTILITY_DIRS = ['analytics', 'charts', 'command', 'consent', 'dashboard'];

function createUtilityIndex(utilityName) {
  const utilityPath = path.join(UTILITIES_DIR, utilityName);

  if (!fs.existsSync(utilityPath)) {
    console.log(`  ✗ Directory does not exist: ${utilityName}`);
    return false;
  }

  // Get all .tsx files in the directory
  const files = fs.readdirSync(utilityPath).filter(file => {
    return file.endsWith('.tsx') && file !== 'index.ts';
  });

  // Create exports for each file
  const exports = files.map(file => {
    const baseName = file.replace('.tsx', '');
    return `export * from './${baseName}';`;
  }).join('\n');

  const indexContent = exports.length > 0
    ? exports + '\n'
    : '// Utility exports\nexport {};\n';

  const indexPath = path.join(utilityPath, 'index.ts');
  fs.writeFileSync(indexPath, indexContent, 'utf-8');

  console.log(`  ✓ Created ${utilityName}/index.ts (${files.length} exports)`);
  return true;
}

console.log('📂 Creating utility index files...\n');

let count = 0;
UTILITY_DIRS.forEach(dir => {
  if (createUtilityIndex(dir)) {
    count++;
  }
});

console.log(`\n✅ Created ${count} index files`);
