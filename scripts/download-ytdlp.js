#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// =============== configuration ================
const GITHUB_API = 'https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest';
const BIN_DIR = path.join(__dirname, '..', 'resources', 'bin');

// =============== ensure bin directory exists ================
if (!fs.existsSync(BIN_DIR)) {
    fs.mkdirSync(BIN_DIR, { recursive: true });
}

// =============== determine which binaries to download based on platform ================
const platform = process.platform;
let binariesToDownload = [];

if (platform === 'win32') {
    binariesToDownload.push({
        assetName: 'yt-dlp.exe',
        outputName: 'yt-dlp.exe',
    });
} else if (platform === 'darwin') {
    binariesToDownload.push({
        assetName: 'yt-dlp_macos',
        outputName: 'yt-dlp-macos',
    });
} else {
    binariesToDownload.push({
        assetName: 'yt-dlp',
        outputName: 'yt-dlp-linux',
    });
}

console.log('Fetching latest yt-dlp release information...');

// =============== fetch latest release info from github api ================
https.get(GITHUB_API, {
    headers: {
        'User-Agent': 'pullbox-setup-script',
    },
}, (response) => {
    let data = '';

    response.on('data', (chunk) => {
        data += chunk;
    });

    response.on('end', () => {
        try {
            const release = JSON.parse(data);
            const assets = release.assets;

            console.log(`Latest version: ${release.tag_name}`);

            binariesToDownload.forEach((binary) => {
                const asset = assets.find(asset => asset.name === binary.assetName);

                if (!asset) {
                    console.error(`❌ Asset ${binary.assetName} not found in release`);
                    return;
                }

                const outputPath = path.join(BIN_DIR, binary.outputName);

                // =============== check if file already exists ================
                if (fs.existsSync(outputPath)) {
                    console.log(`⚠️  ${binary.outputName} already exists, skipping download`);
                    return;
                }

                console.log(`Downloading ${binary.assetName}...`);

                // =============== download the binary ================
                const file = fs.createWriteStream(outputPath);
                https.get(asset.browser_download_url, (downloadResponse) => {
                    const totalSize = parseInt(downloadResponse.headers[ 'content-length' ], 10);
                    let downloadedSize = 0;

                    downloadResponse.on('data', (chunk) => {
                        downloadedSize += chunk.length;
                        const progress = ((downloadedSize / totalSize) * 100).toFixed(2);
                        process.stdout.write(`\rProgress: ${progress}%`);
                    });

                    downloadResponse.pipe(file);

                    file.on('finish', () => {
                        file.close();
                        console.log(`\n✅ Downloaded ${binary.outputName}`);

                        // =============== set execute permissions on unix systems ================
                        if (platform !== 'win32') {
                            fs.chmodSync(outputPath, 0o755);
                            console.log(`✅ Set execute permissions for ${binary.outputName}`);
                        }
                    });
                }).on('error', (error) => {
                    fs.unlink(outputPath, () => { });
                    console.error(`\n❌ Error downloading ${binary.assetName}:`, error.message);
                });
            });

        } catch (error) {
            console.error('❌ Error parsing GitHub API response:', error.message);
        }
    });
}).on('error', (error) => {
    console.error('❌ Error fetching release information:', error.message);
});
