#!/usr/bin/env node

const fs = require('fs');

const files = [
  'app/(protected)/accounts/integrations/page.tsx',
  'app/(protected)/accounts/wallet/[wallet]/page.tsx',
  'app/dashboard/page.tsx',
  'app/layout.tsx',
  'components/marketing/subscription-management/landing-hero.tsx'
];

const cwd = 'F:\\moneymappr\\frontend';

console.log('🔧 Fixing remaining quote issues...\n');

let fixed = 0;

files.forEach(file => {
  const fullPath = `${cwd}\\${file}`;

  if (!fs.existsSync(fullPath)) {
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const original = content;

    // Find all lines with from '@..."; pattern
    // Split into lines, check each line, fix if needed
    const lines = content.split('\n');
    const fixedLines = lines.map(line => {
      // Check for: from '@...";
      if (line.includes("from '") && line.includes('";')) {
        // This is a bad line - has single quote start and double quote end
        // Replace the ending "; with '
        return line.replace(/";$/, "'");
      }
      return line;
    });

    const fixedContent = fixedLines.join('\n');

    if (fixedContent !== original) {
      fs.writeFileSync(fullPath, fixedContent, 'utf8');
      console.log(`  ✓ ${file}`);
      fixed++;
    }
  } catch (err) {
    console.log(`  ✗ ${file}: ${err.message}`);
  }
});

console.log(`\n✅ Fixed ${fixed} files`);
