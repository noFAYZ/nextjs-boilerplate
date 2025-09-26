#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// Function to download an image from URL
async function downloadImage(url: string, filepath: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Create directory if it doesn't exist
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Downloaded: ${path.basename(filepath)}`);
  } catch (error) {
    console.error(`❌ Failed to download ${url}:`, error);
    throw error;
  }
}

// Function to extract all icon URLs from chains.ts
function extractIconUrls(chainsContent: string): Array<{ url: string; filename: string }> {
  const iconUrlRegex = /url: "https:\/\/chain-icons\.s3\.amazonaws\.com\/([^"]+)"/g;
  const urls: Array<{ url: string; filename: string }> = [];
  let match;

  while ((match = iconUrlRegex.exec(chainsContent)) !== null) {
    const fullUrl = match[0].match(/"([^"]*)"/)?.[1];
    const filename = match[1];

    if (fullUrl && filename) {
      urls.push({ url: fullUrl, filename });
    }
  }

  return urls;
}

// Function to update chains.ts with local file paths
function updateChainsFile(chainsContent: string): string {
  return chainsContent.replace(
    /url: "https:\/\/chain-icons\.s3\.amazonaws\.com\/([^"]+)"/g,
    'url: "/blockchains/logos/$1"'
  );
}

async function main() {
  console.log('🚀 Starting blockchain logos download...\n');

  const chainsFilePath = path.join(process.cwd(), 'lib', 'constants', 'chains.ts');
  const logosDir = path.join(process.cwd(), 'public', 'blockchains', 'logos');

  // Read the chains.ts file
  if (!fs.existsSync(chainsFilePath)) {
    console.error('❌ chains.ts file not found at:', chainsFilePath);
    process.exit(1);
  }

  const chainsContent = fs.readFileSync(chainsFilePath, 'utf-8');
  console.log('📖 Read chains.ts file successfully');

  // Extract all icon URLs
  const iconUrls = extractIconUrls(chainsContent);
  console.log(`📊 Found ${iconUrls.length} blockchain logos to download\n`);

  if (iconUrls.length === 0) {
    console.log('⚠️  No icon URLs found in chains.ts');
    return;
  }

  // Create logos directory if it doesn't exist
  if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true });
    console.log('📁 Created logos directory');
  }

  // Download all images
  console.log('⬇️  Downloading logos...\n');
  let successCount = 0;
  let failureCount = 0;

  for (const { url, filename } of iconUrls) {
    const filepath = path.join(logosDir, filename);

    try {
      await downloadImage(url, filepath);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to download ${filename}:`, error);
      failureCount++;
    }
  }

  console.log(`\n📊 Download Summary:`);
  console.log(`✅ Successful downloads: ${successCount}`);
  console.log(`❌ Failed downloads: ${failureCount}`);

  if (successCount === 0) {
    console.log('⚠️  No images were downloaded successfully. Skipping file update.');
    return;
  }

  // Update chains.ts file with local paths
  console.log('\n🔄 Updating chains.ts with local file paths...');
  const updatedContent = updateChainsFile(chainsContent);

  // Create backup of original file
  const backupPath = chainsFilePath + '.backup';
  fs.writeFileSync(backupPath, chainsContent);
  console.log('💾 Created backup at:', backupPath);

  // Write updated content
  fs.writeFileSync(chainsFilePath, updatedContent);
  console.log('✅ Updated chains.ts with local file paths');

  console.log('\n🎉 Blockchain logos download and update completed!');
  console.log(`📁 Logos saved to: ${logosDir}`);
  console.log(`📝 chains.ts updated with local paths`);
  console.log(`💾 Original file backed up to: ${backupPath}`);
}

// Run the script
main().catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});