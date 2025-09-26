# Scripts

This directory contains utility scripts for the MoneyMappr project.

## Blockchain Logos Downloader

### Overview
The `download-blockchain-logos.js` script downloads all blockchain logo images from AWS S3 and updates the chains.ts file to use local file paths instead of remote URLs.

### Usage

#### Run with npm script (recommended):
```bash
npm run download-logos
```

#### Run directly:
```bash
node scripts/download-blockchain-logos.js
```

### What it does:

1. **Reads `lib/constants/chains.ts`** - Extracts all blockchain icon URLs from the chains configuration
2. **Downloads images** - Downloads all logos from `https://chain-icons.s3.amazonaws.com/` to `public/blockchains/logos/`
3. **Updates chains.ts** - Replaces remote URLs with local paths (`/blockchains/logos/[filename]`)
4. **Creates backup** - Saves original chains.ts as `chains.ts.backup`
5. **Reports progress** - Shows download progress and final summary

### Output:
- **Downloaded images**: `public/blockchains/logos/` directory
- **Updated file**: `lib/constants/chains.ts` with local paths
- **Backup file**: `lib/constants/chains.ts.backup`

### Example output:
```
🚀 Starting blockchain logos download...

📖 Read chains.ts file successfully
📊 Found 42 blockchain logos to download

⬇️ Downloading logos...
✅ Downloaded: arbitrum.png
✅ Downloaded: bsc.png
✅ Downloaded: ethereum.png
...

📊 Download Summary:
✅ Successful downloads: 42
❌ Failed downloads: 0

🔄 Updating chains.ts with local file paths...
💾 Created backup at: chains.ts.backup
✅ Updated chains.ts with local file paths

🎉 Blockchain logos download and update completed!
```

### Benefits:
- **Faster loading**: Local images load faster than remote ones
- **Offline support**: App works without external image dependencies
- **Reduced external requests**: No need to fetch from AWS S3
- **Better caching**: Next.js can optimize local images
- **Reliability**: No external dependencies for critical UI assets

### File structure after running:
```
public/
└── blockchains/
    └── logos/
        ├── arbitrum.png
        ├── bsc.png
        ├── ethereum.png
        ├── polygon.png
        └── ... (42 total files)
```

### Reverting changes:
If needed, you can revert to the original file:
```bash
cp lib/constants/chains.ts.backup lib/constants/chains.ts
```