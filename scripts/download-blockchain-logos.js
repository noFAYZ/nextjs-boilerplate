#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

// Command line options
const args = process.argv.slice(2);
const FORCE_REDOWNLOAD = args.includes('--force') || args.includes('-f');

// Function to download an image from URL with fallback support
function downloadImage(url, filepath, fallbackUrls = []) {
  return new Promise((resolve, reject) => {
    const tryDownload = (currentUrl, remainingFallbacks) => {
      const client = currentUrl.startsWith('https:') ? https : http;

      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const file = fs.createWriteStream(filepath);

      client.get(currentUrl, (response) => {
        if (response.statusCode === 403 && remainingFallbacks.length > 0) {
          console.log(`⚠️  403 error for ${path.basename(filepath)}, trying fallback URL...`);
          file.destroy();
          fs.unlink(filepath, () => {}); // Clean up partial file
          const nextUrl = remainingFallbacks[0];
          const nextFallbacks = remainingFallbacks.slice(1);
          tryDownload(nextUrl, nextFallbacks);
          return;
        }

        if (response.statusCode !== 200) {
          file.destroy();
          fs.unlink(filepath, () => {}); // Delete the file on error
          reject(new Error(`HTTP error! status: ${response.statusCode} for ${currentUrl}`));
          return;
        }

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });

        file.on('error', (error) => {
          fs.unlink(filepath, () => {}); // Delete the file on error
          reject(error);
        });
      }).on('error', (error) => {
        if (remainingFallbacks.length > 0) {
          console.log(`⚠️  Network error for ${path.basename(filepath)}, trying fallback URL...`);
          const nextUrl = remainingFallbacks[0];
          const nextFallbacks = remainingFallbacks.slice(1);
          tryDownload(nextUrl, nextFallbacks);
        } else {
          reject(error);
        }
      });
    };

    tryDownload(url, fallbackUrls);
  });
}

// Function to parse ZERION_CHAINS and extract icon URLs
function extractIconUrls(chainsContent) {
    const urls = [];
  
    try {
      // Extract the ZERION_CHAINS array from the file content
      const zerionChainsMatch = chainsContent.match(/export const ZERION_CHAINS: Chain\[\] = (\[[\s\S]*?\]);/);
  
      if (!zerionChainsMatch) {
        console.error('❌ Could not find ZERION_CHAINS export in file');
        return [];
      }
  
      // Use regex to find all icon URLs (both remote and local, with or without extension)
      const iconUrlRegex = /icon:\s*{\s*url:\s*"([^"]+)"\s*[,}]/g;
      let match;
  
      while ((match = iconUrlRegex.exec(chainsContent)) !== null) {
        let iconUrl = match[1];
        let filename;
  
        // Check if it's a remote AWS URL that needs to be downloaded
        if (
          iconUrl.startsWith('https://chain-icons.s3.amazonaws.com/') ||
          iconUrl.startsWith('https://chain-icons.s3.us-east-1.amazonaws.com/') ||
          iconUrl.startsWith('https://protocol-icons.s3.amazonaws.com/')
        ) {
          filename = iconUrl.split('/').pop();
          if (filename) {
            // If the filename doesn't have an extension, assume it's PNG
            if (!/\.(png|jpg|jpeg|svg|webp)$/i.test(filename)) {
              filename = `${filename}.png`;
            }
            urls.push({ url: iconUrl, filename });
          }
        }
        // Check if it's already a local path but we want to re-download
        else if (iconUrl.startsWith('/blockchains/logos/')) {
          filename = iconUrl.split('/').pop();
  
          // Skip files that look like chain IDs without extensions (likely don't exist)
          if (filename && /^\d+$/.test(filename)) {
            console.log(`⏭️  Skipping chain ID without extension: ${filename}`);
            continue;
          }
  
          // Try different remote URLs until one works (fallback strategy)
          const possibleUrls = [
            `https://chain-icons.s3.amazonaws.com/${filename}`,
            `https://chain-icons.s3.us-east-1.amazonaws.com/${filename}`,
            `https://protocol-icons.s3.amazonaws.com/${filename}`
          ];
          if (filename) {
            console.log(`🔄 Found local path, will re-download from remote: ${filename}`);
            urls.push({ url: possibleUrls[0], filename, fallbackUrls: possibleUrls.slice(1) });
          }
        }
      }
  
      // Remove duplicates based on filename
      const uniqueUrls = urls.reduce((acc, current) => {
        const existingItem = acc.find(item => item.filename === current.filename);
        if (!existingItem) {
          acc.push(current);
        }
        return acc;
      }, []);
  
      return uniqueUrls;
  
    } catch (error) {
      console.error('❌ Error parsing ZERION_CHAINS:', error);
      return [];
    }
  }

// Function to update chains.ts with local file paths
function updateChainsFile(chainsContent) {
    // Replace all AWS S3 URLs with local paths
    let updatedContent = chainsContent
      // Original AWS bucket
      .replace(
        /url: "https:\/\/chain-icons\.s3\.amazonaws\.com\/([^"]+)"/g,
        (match, filename) => {
          // If the filename doesn't have an extension, append .png
          if (!/\.(png|jpg|jpeg|svg|webp)$/i.test(filename)) {
            filename = `${filename}.png`;
          }
          return `url: "/blockchains/logos/${filename}"`;
        }
      )
      // US East 1 region bucket
      .replace(
        /url: "https:\/\/chain-icons\.s3\.us-east-1\.amazonaws\.com\/([^"]+)"/g,
        (match, filename) => {
          // If the filename doesn't have an extension, append .png
          if (!/\.(png|jpg|jpeg|svg|webp)$/i.test(filename)) {
            filename = `${filename}.png`;
          }
          return `url: "/blockchains/logos/${filename}"`;
        }
      )
      // Protocol icons bucket
      .replace(
        /url: "https:\/\/protocol-icons\.s3\.amazonaws\.com\/([^"]+)"/g,
        (match, filename) => {
          // If the filename doesn't have an extension, append .png
          if (!/\.(png|jpg|jpeg|svg|webp)$/i.test(filename)) {
            filename = `${filename}.png`;
          }
          return `url: "/blockchains/logos/${filename}"`;
        }
      );
  
    // Ensure existing local paths are consistent (in case there are variations)
    updatedContent = updatedContent.replace(
      /url: "\/blockchains\/logos\/([^"]+)"/g,
      (match, filename) => {
        // If the filename doesn't have an extension, append .png
        if (!/\.(png|jpg|jpeg|svg|webp)$/i.test(filename)) {
          filename = `${filename}.png`;
        }
        return `url: "/blockchains/logos/${filename}"`;
      }
    );
  
    return updatedContent;
  }

async function main() {
  if (FORCE_REDOWNLOAD) {
    console.log('🚀 Starting blockchain logos download from ZERION_CHAINS (FORCE MODE)...\n');
    console.log('⚠️  Force mode enabled: Will re-download all logos even if they exist locally\n');
  } else {
    console.log('🚀 Starting blockchain logos download from ZERION_CHAINS...\n');
  }

  const chainsFilePath = path.join(process.cwd(), 'lib', 'constants', 'chains.ts');
  const logosDir = path.join(process.cwd(), 'public', 'blockchains', 'logos');

  // Read the chains.ts file
  if (!fs.existsSync(chainsFilePath)) {
    console.error('❌ chains.ts file not found at:', chainsFilePath);
    process.exit(1);
  }

  const chainsContent = fs.readFileSync(chainsFilePath, 'utf-8');
  console.log('📖 Read chains.ts file successfully');

  // Verify ZERION_CHAINS exists
  if (!chainsContent.includes('ZERION_CHAINS')) {
    console.error('❌ ZERION_CHAINS not found in chains.ts');
    process.exit(1);
  }

  console.log('✅ Found ZERION_CHAINS object in file');

  // Extract all icon URLs from ZERION_CHAINS
  const iconUrls = extractIconUrls(chainsContent);
  console.log(`📊 Found ${iconUrls.length} blockchain logos in ZERION_CHAINS\n`);

  if (iconUrls.length === 0) {
    console.log('⚠️  No icon URLs found that need downloading');
    console.log('💡 This could mean:');
    console.log('   - All URLs are already converted to local paths');
    console.log('   - No remote AWS URLs were found in ZERION_CHAINS');
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

  // Print list of files that will be downloaded
  console.log('Files to download:');
  iconUrls.forEach(({ filename }, index) => {
    console.log(`${index + 1}. ${filename}`);
  });
  console.log('');

  for (const item of iconUrls) {
    const { url, filename, fallbackUrls = [] } = item;
    const filepath = path.join(logosDir, filename);

    // Skip if file exists and not in force mode
    if (!FORCE_REDOWNLOAD && fs.existsSync(filepath)) {
      console.log(`⏭️  Skipped: ${filename} (already exists)`);
      successCount++;
      continue;
    }

    try {
      await downloadImage(url, filepath, fallbackUrls);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to download ${filename}:`, error.message);
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
  console.log('💾 Created backup at:', path.basename(backupPath));

  // Write updated content
  fs.writeFileSync(chainsFilePath, updatedContent);
  console.log('✅ Updated chains.ts with local file paths');

  console.log('\n🎉 Blockchain logos download and update completed!');
  console.log(`📁 Logos saved to: ${path.relative(process.cwd(), logosDir)}`);
  console.log(`📝 chains.ts updated with local paths`);
  console.log(`💾 Original file backed up to: ${path.basename(backupPath)}`);

  // List downloaded files
  console.log('\n📋 Downloaded files:');
  const downloadedFiles = fs.readdirSync(logosDir);
  downloadedFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });
}

// Show help if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
📘 Blockchain Logos Downloader

Downloads blockchain logo images from AWS S3 and updates chains.ts with local paths.

Usage:
  node scripts/download-blockchain-logos.js [options]
  npm run download-logos [-- options]

Options:
  --help, -h     Show this help message
  --force, -f    Force re-download all logos even if they exist locally

Examples:
  node scripts/download-blockchain-logos.js
  node scripts/download-blockchain-logos.js --force
  npm run download-logos -- --force

What it does:
  1. Parses ZERION_CHAINS object from lib/constants/chains.ts
  2. Downloads all blockchain logos from AWS S3 to public/blockchains/logos/
  3. Updates icon URLs in chains.ts to use local paths
  4. Creates backup of original file

Output:
  📁 Downloaded images: public/blockchains/logos/
  📝 Updated file: lib/constants/chains.ts
  💾 Backup file: lib/constants/chains.ts.backup
  `);
  process.exit(0);
}

// Run the script
main().catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});