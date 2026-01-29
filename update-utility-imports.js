#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const IMPORT_MAPPINGS = [
  // ai/ → modules/ai/components
  { from: /from\s+['"]@\/components\/ai\//g, to: "from '@/components/modules/ai/components/" },
  { from: /from\s+['"]@\/components\/ai['"]/g, to: "from '@/components/modules/ai'" },

  // assets/ → modules/assets/components
  { from: /from\s+['"]@\/components\/assets\//g, to: "from '@/components/modules/assets/components/" },
  { from: /from\s+['"]@\/components\/assets['"]/g, to: "from '@/components/modules/assets'" },

  // integrations/ → modules/integrations/components
  { from: /from\s+['"]@\/components\/integrations\//g, to: "from '@/components/modules/integrations/components/" },
  { from: /from\s+['"]@\/components\/integrations['"]/g, to: "from '@/components/modules/integrations'" },

  // organization/ → modules/organization/components
  { from: /from\s+['"]@\/components\/organization\//g, to: "from '@/components/modules/organization/components/" },
  { from: /from\s+['"]@\/components\/organization['"]/g, to: "from '@/components/modules/organization'" },

  // user/ → modules/user/components
  { from: /from\s+['"]@\/components\/user\//g, to: "from '@/components/modules/user/components/" },
  { from: /from\s+['"]@\/components\/user['"]/g, to: "from '@/components/modules/user'" },

  // analytics/ → utilities/analytics
  { from: /from\s+['"]@\/components\/analytics\//g, to: "from '@/components/utilities/analytics/" },
  { from: /from\s+['"]@\/components\/analytics['"]/g, to: "from '@/components/utilities/analytics'" },

  // charts/ → utilities/charts
  { from: /from\s+['"]@\/components\/charts\//g, to: "from '@/components/utilities/charts/" },
  { from: /from\s+['"]@\/components\/charts['"]/g, to: "from '@/components/utilities/charts'" },

  // command/ → utilities/command
  { from: /from\s+['"]@\/components\/command\//g, to: "from '@/components/utilities/command/" },
  { from: /from\s+['"]@\/components\/command['"]/g, to: "from '@/components/utilities/command'" },

  // consent/ → utilities/consent
  { from: /from\s+['"]@\/components\/consent\//g, to: "from '@/components/utilities/consent/" },
  { from: /from\s+['"]@\/components\/consent['"]/g, to: "from '@/components/utilities/consent'" },

  // dashboard/ → utilities/dashboard
  { from: /from\s+['"]@\/components\/dashboard\//g, to: "from '@/components/utilities/dashboard/" },
  { from: /from\s+['"]@\/components\/dashboard['"]/g, to: "from '@/components/utilities/dashboard'" },

  // coming-soon/ → marketing/coming-soon
  { from: /from\s+['"]@\/components\/coming-soon\//g, to: "from '@/components/marketing/coming-soon/" },
  { from: /from\s+['"]@\/components\/coming-soon['"]/g, to: "from '@/components/marketing/coming-soon'" },
];

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    IMPORT_MAPPINGS.forEach(({ from, to }) => {
      content = content.replace(from, to);
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    }
  } catch (err) {
    // ignore
  }
  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        count += walkDir(fullPath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        if (updateFile(fullPath)) {
          count++;
        }
      }
    } catch (err) {
      // ignore
    }
  });

  return count;
}

console.log('🔄 Updating imports for utilities...\n');

const count = walkDir(path.join(__dirname));
console.log(`✅ Updated ${count} files`);
