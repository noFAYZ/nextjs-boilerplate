#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, 'components');
const MODULES_DIR = path.join(COMPONENTS_DIR, 'modules');

// Directories to move into modules/
const TO_MODULES = {
  'ai': 'ai',
  'assets': 'assets',
  'integrations': 'integrations',
  'organization': 'organization',
  'user': 'user',
};

// Directories to move into marketing/
const TO_MARKETING = {
  'coming-soon': 'coming-soon',
};

// Directories to move into utilities/
const TO_UTILITIES = {
  'analytics': 'analytics',
  'charts': 'charts',
  'command': 'command',
  'consent': 'consent',
  'dashboard': 'dashboard',
};

// Consolidate into home/
const TO_HOME = {
  // just keep it as is
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyDir(src, dst) {
  ensureDir(dst);
  const files = fs.readdirSync(src);

  files.forEach(file => {
    const srcPath = path.join(src, file);
    const dstPath = path.join(dst, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  });
}

function createModuleIndex(dir, moduleName) {
  const componentsDir = path.join(dir, 'components');
  if (!fs.existsSync(componentsDir)) return;

  const files = fs.readdirSync(componentsDir);
  const exports = [];

  files.forEach(file => {
    if (file.endsWith('.tsx') && file !== 'index.tsx') {
      exports.push(`export * from './${file.replace('.tsx', '')}'`);
    }
  });

  const indexContent = exports.length > 0 ? exports.join('\n') + '\n' : '// Components\nexport {};\n';
  fs.writeFileSync(path.join(componentsDir, 'index.ts'), indexContent);

  // Create module-level index
  const moduleIndex = `export * from './components';\n`;
  fs.writeFileSync(path.join(dir, 'index.ts'), moduleIndex);
}

console.log('📂 Organizing utility directories...\n');

// Move to modules/
console.log('📦 Moving feature directories to modules/');
Object.entries(TO_MODULES).forEach(([oldDir, moduleName]) => {
  const srcPath = path.join(COMPONENTS_DIR, oldDir);
  const dstPath = path.join(MODULES_DIR, moduleName, 'components');

  if (fs.existsSync(srcPath)) {
    copyDir(srcPath, dstPath);
    createModuleIndex(path.join(MODULES_DIR, moduleName), moduleName);
    console.log(`  ✓ ${oldDir}/ → modules/${moduleName}/components/`);
  }
});

// Move to marketing/
console.log('\n📄 Moving to marketing/');
Object.entries(TO_MARKETING).forEach(([oldDir, newDir]) => {
  const srcPath = path.join(COMPONENTS_DIR, oldDir);
  const dstPath = path.join(COMPONENTS_DIR, 'marketing', newDir);

  if (fs.existsSync(srcPath)) {
    copyDir(srcPath, dstPath);
    console.log(`  ✓ ${oldDir}/ → marketing/${newDir}/`);
  }
});

// Move to utilities/
console.log('\n🔧 Creating utilities/ directory');
Object.entries(TO_UTILITIES).forEach(([oldDir, newDir]) => {
  const srcPath = path.join(COMPONENTS_DIR, oldDir);
  const dstPath = path.join(COMPONENTS_DIR, 'utilities', newDir);

  if (fs.existsSync(srcPath)) {
    copyDir(srcPath, dstPath);
    console.log(`  ✓ ${oldDir}/ → utilities/${newDir}/`);
  }
});

console.log('\n✅ Organization complete!');
console.log('\nFinal structure:');
console.log('components/');
console.log('├── modules/');
console.log('│   ├── accounts/');
console.log('│   ├── ai/');
console.log('│   ├── assets/');
console.log('│   ├── auth/');
console.log('│   ├── banking/');
console.log('│   ├── budgets/');
console.log('│   ├── crypto/');
console.log('│   ├── goals/');
console.log('│   ├── integrations/');
console.log('│   ├── networth/');
console.log('│   ├── onboarding/');
console.log('│   ├── organization/');
console.log('│   ├── settings/');
console.log('│   ├── subscriptions/');
console.log('│   ├── transactions/');
console.log('│   ├── user/');
console.log('│   └── shared/');
console.log('├── layout/');
console.log('├── marketing/');
console.log('├── utilities/');
console.log('├── shared/');
console.log('├── ui/');
console.log('├── icons/');
console.log('├── providers/');
console.log('└── home/');
