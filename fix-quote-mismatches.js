#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all quote mismatches...\n');

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file.startsWith('.')) return;

    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath, callback);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        callback(fullPath);
      }
    } catch (err) {
      // ignore
    }
  });
}

let filesFixed = 0;
let linesFixed = 0;

walkDir(path.join(__dirname, 'app'), processFile);
walkDir(path.join(__dirname, 'components'), processFile);

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Fix: 'path" → 'path'
    content = content.replace(/from '([^']+)"/g, "from '$1'");

    // Fix: "path' → "path"
    content = content.replace(/from "([^"]+)'/g, 'from "$1"');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      const count = (original.match(/from '[^']*"|from "[^"]*'/g) || []).length;
      if (count > 0) {
        linesFixed += count;
        filesFixed++;
        console.log(`  ✓ ${path.relative(__dirname, filePath)}`);
      }
    }
  } catch (err) {
    // ignore
  }
}

console.log(`\n✅ Fixed ${filesFixed} files (${linesFixed} mismatched imports)`);
