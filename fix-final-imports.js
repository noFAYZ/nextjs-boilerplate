#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Final pass to fix any remaining old imports
 */

const FINAL_MAPPINGS = [
  { old: "'@/lib/config/env'", new: "'@/lib/core/config'" },
  { old: '"@/lib/config/env"', new: '"@/lib/core/config"' },
  { old: "'@/lib/api/account-groups'", new: "'@/lib/core/api/account-groups'" },
  { old: '"@/lib/api/account-groups"', new: '"@/lib/core/api/account-groups"' },
  { old: "'@/lib/api/account-groups-settings'", new: "'@/lib/core/api/account-groups'" },
  { old: '"@/lib/api/account-groups-settings"', new: '"@/lib/core/api/account-groups"' },
  // Core imports - these should map to lib/core
  { old: "'@/lib/query-client'", new: "'@/lib/core/query'" },
  { old: '"@/lib/query-client"', new: '"@/lib/core/query"' },
  { old: "'@/lib/query-dependencies'", new: "'@/lib/core/query'" },
  { old: '"@/lib/query-dependencies"', new: '"@/lib/core/query"' },
  { old: "'@/lib/query-helpers'", new: "'@/lib/core/query'" },
  { old: '"@/lib/query-helpers"', new: '"@/lib/core/query"' },
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    FINAL_MAPPINGS.forEach(({ old, new: newPath }) => {
      content = content.replace(new RegExp(old, 'g'), newPath);
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    }
  } catch (error) {
    // Ignore read errors
  }
  return false;
}

function walkAndFix(dir) {
  let count = 0;
  let visited = new Set();

  function traverse(currentDir) {
    try {
      const files = fs.readdirSync(currentDir);

      files.forEach(file => {
        const fullPath = path.join(currentDir, file);
        const normalized = fullPath.replace(/\\/g, '/');

        if (visited.has(normalized)) return;
        visited.add(normalized);

        try {
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory() && !normalized.includes('node_modules') && !normalized.includes('.next')) {
            traverse(fullPath);
          } else if ((file.endsWith('.ts') || file.endsWith('.tsx'))) {
            if (fixFile(fullPath)) {
              count++;
            }
          }
        } catch (error) {
          // Ignore stat errors
        }
      });
    } catch (error) {
      // Ignore read errors
    }
  }

  traverse(dir);
  return count;
}

console.log('🔄 Final pass: Fixing remaining old imports...\n');
const updated = walkAndFix('.');
console.log(`\n✅ Fixed ${updated} more files`);
