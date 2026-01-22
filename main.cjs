const { app, BrowserWindow, ipcMain, dialog } = require('electron/main');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;

// =============== get yt-dlp binary path based on platform and environment ================
function getYtDlpPath() {
    const platform = process.platform;
    let binaryName;

    if (platform === 'win32') {
        binaryName = 'yt-dlp.exe';
    } else if (platform === 'darwin') {
        binaryName = 'yt-dlp-macos';
    } else {
        binaryName = 'yt-dlp-linux';
    }

    // =============== in development mode, use local resources folder ================
    if (process.env.ELECTRON_START_URL) {
        return path.join(__dirname, 'resources', 'bin', binaryName);
    }

    // =============== in production, use app.getAppPath() which points to resources ================
    const resourcesPath = process.resourcesPath || app.getAppPath();
    return path.join(resourcesPath, 'resources', 'bin', binaryName);
}

// =============== ensure yt-dlp binary has execute permissions on unix systems ================
function ensureExecutePermissions(binaryPath) {
    if (process.platform !== 'win32') {
        try {
            fs.chmodSync(binaryPath, 0o755);
            console.log('Execute permissions set for yt-dlp binary');
        } catch (error) {
            console.error('Failed to set execute permissions:', error);
        }
    }
}

// =============== check if url is a playlist ================
ipcMain.handle('ytdlp:check-playlist', async (event, url) => {
    return new Promise((resolve, reject) => {
        const ytdlpPath = getYtDlpPath();

        if (!fs.existsSync(ytdlpPath)) {
            reject(new Error(`yt-dlp binary not found at: ${ytdlpPath}`));
            return;
        }

        ensureExecutePermissions(ytdlpPath);

        const args = [
            "--js-runtimes",
            "node",
            '--flat-playlist',
            '--dump-single-json',
            url
        ];

        const ytdlpProcess = spawn(ytdlpPath, args);

        let stdout = '';
        let stderr = '';

        ytdlpProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        ytdlpProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        ytdlpProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`yt-dlp failed: ${stderr}`));
                return;
            }

            try {
                const info = JSON.parse(stdout);

                resolve({
                    isPlaylist: info._type === 'playlist',
                    playlistTitle: info.title || 'Unknown Playlist',
                    playlistCount: info.entries ? info.entries.length : 0,
                    playlistId: info.id || null,
                    entries: info.entries ? info.entries.slice(0, 10).map(entry => ({
                        title: entry.title || 'Unknown',
                        id: entry.id || '',
                        duration: entry.duration || 0,
                    })) : [],
                });
            } catch (error) {
                // =============== not a playlist, just a single video ================
                resolve({
                    isPlaylist: false,
                    playlistCount: 0,
                });
            }
        });

        ytdlpProcess.on('error', (error) => {
            reject(new Error(`Failed to check playlist: ${error.message}`));
        });
    });
});

// =============== fetch available formats for a given url ================
ipcMain.handle('ytdlp:fetch-formats', async (event, url) => {
    return new Promise((resolve, reject) => {
        const ytdlpPath = getYtDlpPath();

        // =============== check if binary exists ================
        if (!fs.existsSync(ytdlpPath)) {
            reject(new Error(`yt-dlp binary not found at: ${ytdlpPath}`));
            return;
        }

        ensureExecutePermissions(ytdlpPath);

        const args = [
            "--js-runtimes",
            "node",
            '--dump-json',
            '--no-playlist',
            url
        ];

        const ytdlpProcess = spawn(ytdlpPath, args);

        let stdout = '';
        let stderr = '';

        ytdlpProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        ytdlpProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        ytdlpProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`yt-dlp failed: ${stderr}`));
                return;
            }

            try {
                const info = JSON.parse(stdout);

                // =============== extract available formats ================
                const formats = info.formats || [];
                const videoFormats = formats.filter(format =>
                    format.vcodec && format.vcodec !== 'none'
                );
                const audioFormats = formats.filter(format =>
                    format.acodec && format.acodec !== 'none' &&
                    (!format.vcodec || format.vcodec === 'none')
                );

                // =============== get unique resolutions ================
                const resolutions = [ ...new Set(
                    videoFormats
                        .map(format => format.height)
                        .filter(height => height)
                        .sort((a, b) => b - a)
                ) ];

                // =============== get available containers/extensions ================
                const extensions = [ ...new Set(
                    formats
                        .map(format => format.ext)
                        .filter(ext => ext)
                ) ];

                resolve({
                    title: info.title || 'Unknown',
                    thumbnail: info.thumbnail || null,
                    duration: info.duration || 0,
                    formats: formats.map(format => ({
                        formatId: format.format_id,
                        ext: format.ext,
                        resolution: format.resolution || 'audio only',
                        filesize: format.filesize || format.filesize_approx || 0,
                        vcodec: format.vcodec,
                        acodec: format.acodec,
                        fps: format.fps,
                        height: format.height,
                        width: format.width,
                    })),
                    resolutions,
                    extensions,
                    hasAudio: audioFormats.length > 0,
                    hasVideo: videoFormats.length > 0,
                });
            } catch (error) {
                reject(new Error(`Failed to parse yt-dlp output: ${error.message}`));
            }
        });

        ytdlpProcess.on('error', (error) => {
            reject(new Error(`Failed to spawn yt-dlp: ${error.message}`));
        });
    });
});

// =============== download media with specified options ================
ipcMain.handle('ytdlp:download', async (event, options) => {
    return new Promise((resolve, reject) => {
        const ytdlpPath = getYtDlpPath();

        if (!fs.existsSync(ytdlpPath)) {
            reject(new Error(`yt-dlp binary not found at: ${ytdlpPath}`));
            return;
        }

        ensureExecutePermissions(ytdlpPath);

        const {
            url,
            outputPath,
            formatId,
            audioOnly,
            includeSubtitles,
            includeMetadata,
            downloadPlaylist,
            outputTemplate,
        } = options;

        const args = [ "--js-runtimes",
            "node", '--progress', '--newline' ];

        // =============== format selection ================
        if (formatId) {
            args.push('-f', formatId);
        } else if (audioOnly) {
            args.push('-f', 'bestaudio');
            args.push('-x'); // =============== extract audio ================
            args.push('--audio-format', 'mp3');
        } else {
            args.push('-f', 'bestvideo+bestaudio/best');
        }

        // =============== output path ================
        if (outputPath) {
            const template = outputTemplate || '%(title)s.%(ext)s';
            args.push('-o', path.join(outputPath, template));
        }

        // =============== subtitles ================
        if (includeSubtitles) {
            args.push('--write-subs');
            args.push('--write-auto-subs');
            args.push('--sub-lang', 'en');
        }

        // =============== metadata ================
        if (includeMetadata) {
            args.push('--embed-metadata');
            args.push('--embed-thumbnail');
        }

        // =============== playlist handling ================
        if (!downloadPlaylist) {
            args.push('--no-playlist');
        }

        args.push(url);

        const ytdlpProcess = spawn(ytdlpPath, args);

        let lastProgress = null;

        ytdlpProcess.stdout.on('data', (data) => {
            const output = data.toString();

            // =============== parse progress information ================
            const downloadMatch = output.match(/\[download\]\s+(\d+\.?\d*)%/);
            const speedMatch = output.match(/at\s+([\d.]+\w+\/s)/);
            const etaMatch = output.match(/ETA\s+([\d:]+)/);
            const filenameMatch = output.match(/\[download\]\s+Destination:\s+(.+)/);

            // =============== parse playlist progress [download] Downloading item 3 of 10 ================
            const playlistItemMatch = output.match(/\[download\]\s+Downloading\s+(?:video|item)\s+(\d+)\s+of\s+(\d+)/);

            if (downloadMatch || speedMatch || etaMatch || filenameMatch || playlistItemMatch) {
                const progress = {
                    percentage: downloadMatch ? parseFloat(downloadMatch[ 1 ]) : lastProgress?.percentage || 0,
                    speed: speedMatch ? speedMatch[ 1 ] : lastProgress?.speed || 'N/A',
                    eta: etaMatch ? etaMatch[ 1 ] : lastProgress?.eta || 'N/A',
                    filename: filenameMatch ? filenameMatch[ 1 ] : lastProgress?.filename || '',
                    playlistIndex: playlistItemMatch ? parseInt(playlistItemMatch[ 1 ]) : lastProgress?.playlistIndex || null,
                    playlistTotal: playlistItemMatch ? parseInt(playlistItemMatch[ 2 ]) : lastProgress?.playlistTotal || null,
                };

                lastProgress = progress;

                // =============== send progress update to renderer ================
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('ytdlp:progress', progress);
                }
            }

            // =============== check for completion ================
            if (output.includes('[download] 100%') || output.includes('has already been downloaded')) {
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('ytdlp:progress', {
                        percentage: 100,
                        speed: '0KB/s',
                        eta: '00:00',
                        filename: lastProgress?.filename || '',
                        playlistIndex: lastProgress?.playlistIndex || null,
                        playlistTotal: lastProgress?.playlistTotal || null,
                    });
                }
            }
        });

        ytdlpProcess.stderr.on('data', (data) => {
            const message = data.toString();
            console.error('yt-dlp error:', message);

            // =============== send error to renderer ================
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('ytdlp:error', message);
            }
        });

        ytdlpProcess.on('close', (code) => {
            if (code === 0) {
                resolve({ success: true, message: 'Download completed successfully' });
            } else {
                reject(new Error(`Download failed with code ${code}`));
            }
        });

        ytdlpProcess.on('error', (error) => {
            reject(new Error(`Failed to spawn yt-dlp: ${error.message}`));
        });
    });
});

// =============== open folder picker dialog ================
ipcMain.handle('dialog:select-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: [ 'openDirectory', 'createDirectory' ]
    });

    if (result.canceled) {
        return null;
    }

    return result.filePaths[ 0 ];
});

app.whenReady().then(() => {
    // =============== create splash screen ================
    const splash = new BrowserWindow({
        width: 810,
        height: 610,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        icon: path.join(__dirname, 'icons', 'list'),
    });

    // =============== load splash screen html ================
    const splashPath = path.join(__dirname, 'dist', 'splash.html');
    if (fs.existsSync(splashPath)) {
        splash.loadFile(splashPath);
    }

    // =============== create main window but keep it hidden initially ================
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        icon: path.join(__dirname, 'icons', 'list'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs'),
            devTools: true,
            sandbox: false,
        },
        autoHideMenuBar: true,
    });

    // =============== load main app after splash screen ================
    const startURL = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'dist', 'index.html')}`;

    if (startURL.startsWith('http')) {
        mainWindow.loadURL(startURL);
    } else {
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    }

    // =============== once the main window is ready, close the splash screen and show the main window ================
    mainWindow.once('ready-to-show', () => {
        if (splash && !splash.isDestroyed()) {
            splash.destroy();
        }
        mainWindow.maximize();
        mainWindow.show();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
