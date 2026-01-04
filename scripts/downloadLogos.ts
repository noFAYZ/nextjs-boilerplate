#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

// Command line options
const args = process.argv.slice(2);
const FORCE_REDOWNLOAD = args.includes('--force') || args.includes('-f');
const PROVIDER = process.env.LOGO_PROVIDER || 'brandfetch'; // 'brandfetch' or 'logodev'

// API tokens and keys
const LOGO_DEV_TOKEN = process.env.LOGO_DEV_TOKEN || "pk_Ci8tpfGuSOiDBqqJrN3C9A";
const BRANDFETCH_API_KEY = process.env.BRANDFETCH_API_KEY || "1idV2ueDnn8ei2OYfCl";

// Helper function: random delay in milliseconds
function randomDelay(minMs = 500, maxMs = 1500) {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Function to download an image from URL with redirect support and browser-like headers
function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;

    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(filepath);

    // Browser-like headers
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                      'Chrome/118.0.5993.90 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/',
        'Connection': 'keep-alive',
      }
    };

    client.get(url, options, (response) => {
      // Handle redirects
      if ([301, 302, 303, 307, 308].includes(response.statusCode || 0)) {
        const redirectUrl = response.headers.location;
        if (!redirectUrl) {
          file.destroy();
          fs.unlink(filepath, () => {});
          reject(new Error(`Redirect received but no Location header`));
          return;
        }
        file.destroy();
        fs.unlink(filepath, () => {});
        console.log(`↳ Redirected to: ${redirectUrl}`);
        // Recursively follow redirect
        downloadImage(redirectUrl, filepath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        file.destroy();
        fs.unlink(filepath, () => {});
        reject(new Error(`HTTP error! status: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${path.basename(filepath)}`);
        resolve();
      });

      file.on('error', (error) => {
        fs.unlink(filepath, () => {});
        reject(error);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Function to load domains from JSON file
function loadDomains(): string[] {
  const domainsFiles = [
    path.join(process.cwd(), 'public', 'logo', 'domains.json'),
    path.join(process.cwd(), 'domains.json'),
  ];

  for (const filePath of domainsFiles) {
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        const domains = Array.isArray(data) ? data : data.domains || [];
        console.log(`📖 Loaded domains from ${path.relative(process.cwd(), filePath)}`);
        return domains;
      } catch (error) {
        console.error(`❌ Error reading domains file: ${filePath}`, error);
        process.exit(1);
      }
    }
  }

  console.error('❌ No domains.json file found!');
  process.exit(1);
}

// Function to normalize domain name for filename
function getDomainFilename(domain: string): string {
  const cleaned = domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
  const extension = PROVIDER === 'logodev' ? 'png' : 'webp';
  return `${cleaned}.${extension}`;
}

// Function to get logo URL based on provider
function getLogoUrl(domain: string): string {
  const cleaned = domain
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');

  if (PROVIDER === 'logodev') {
    let url = `https://img.logo.dev/${cleaned}?`;
    if (LOGO_DEV_TOKEN) url += `token=${LOGO_DEV_TOKEN}`;
    return url;
  }

  return `https://cdn.brandfetch.io/${cleaned}/logo?c=${BRANDFETCH_API_KEY}`;
}

async function main() {
  if (FORCE_REDOWNLOAD) {
    console.log(`🚀 Starting website logos download from ${PROVIDER === 'logodev' ? 'logo.dev' : 'Brandfetch'} (FORCE MODE)...\n`);
  } else {
    const primaryProvider = PROVIDER === 'logodev' ? 'logo.dev' : 'Brandfetch';
    console.log(`🚀 Starting website logos download from ${primaryProvider}...\n`);
  }

  const logosDir = path.join(process.cwd(), 'public', 'logo');

  const domains = loadDomains();
  console.log(`📊 Found ${domains.length} domains to download\n`);

  if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true });

  let successCount = 0;
  let failureCount = 0;

  for (const domain of domains) {
    const filename = getDomainFilename(domain);
    const filepath = path.join(logosDir, filename);
    const url = getLogoUrl(domain);

    if (!FORCE_REDOWNLOAD && fs.existsSync(filepath)) {
      console.log(`⏭️  Skipped: ${filename} (already exists)`);
      successCount++;
      continue;
    }

    console.log(`🔗 Fetching: ${url}`);

    try {
      await downloadImage(url, filepath);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to download ${filename}:`, (error as Error).message);
      failureCount++;
    }

    // Wait a random delay between 500ms and 1500ms
    await randomDelay(500, 1500);
  }

  console.log(`\n📊 Download Summary:`);
  console.log(`✅ Successful downloads: ${successCount}`);
  console.log(`❌ Failed downloads: ${failureCount}`);
  console.log(`\n🎉 Website logos download completed!`);
  console.log(`📁 Logos saved to: ${path.relative(process.cwd(), logosDir)}`);
}

main().catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
