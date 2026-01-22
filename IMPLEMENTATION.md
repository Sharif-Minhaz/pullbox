# Pullbox - Implementation Details

## Overview

This document provides a technical deep-dive into the implementation of Pullbox, a production-grade Electron + Vite + React application that wraps yt-dlp.

---

## Architecture Decisions

### 1. Three-Process Separation

**Renderer Process (React UI)**
- **Why**: Provides familiar React development experience
- **Security**: No Node.js access prevents malicious code execution
- **Communication**: IPC only through preload bridge

**Preload Script (IPC Bridge)**
- **Why**: `contextBridge` provides secure, minimal API surface
- **Security**: Only exposes necessary functions (fetchFormats, download, etc.)
- **Pattern**: Each IPC method returns a Promise for async operations

**Main Process (Electron + yt-dlp)**
- **Why**: Only place with filesystem and child_process access
- **Responsibility**: Spawns yt-dlp, parses output, sends progress updates
- **OS Handling**: Resolves correct binary path for Windows/macOS/Linux

---

## yt-dlp Integration

### Binary Path Resolution

```javascript
function getYtDlpPath() {
    const platform = process.platform;
    let binaryName;

    // =============== platform-specific binary names ================
    if (platform === 'win32') binaryName = 'yt-dlp.exe';
    else if (platform === 'darwin') binaryName = 'yt-dlp-macos';
    else binaryName = 'yt-dlp-linux';

    // =============== dev mode: use local resources ================
    if (process.env.ELECTRON_START_URL) {
        return path.join(__dirname, 'resources', 'bin', binaryName);
    }

    // =============== prod mode: use process.resourcesPath ================
    const resourcesPath = process.resourcesPath || app.getAppPath();
    return path.join(resourcesPath, 'resources', 'bin', binaryName);
}
```

**Why this approach?**
- Works in both dev mode (Vite dev server) and packaged mode
- No hardcoded paths
- Respects Electron Forge's resource bundling

---

### Fetching Formats

**IPC Handler**: `ytdlp:fetch-formats`

```javascript
ipcMain.handle('ytdlp:fetch-formats', async (event, url) => {
    const args = ['--dump-json', '--no-playlist', url];
    const ytdlpProcess = spawn(ytdlpPath, args);
    
    // =============== collect stdout as JSON ================
    let stdout = '';
    ytdlpProcess.stdout.on('data', (data) => {
        stdout += data.toString();
    });
    
    ytdlpProcess.on('close', (code) => {
        const info = JSON.parse(stdout);
        // =============== extract resolutions, formats, etc. ================
    });
});
```

**Key flags:**
- `--dump-json`: Returns metadata as JSON
- `--no-playlist`: Only fetches single video (unless user enables playlist)

**Extracted data:**
- Title, thumbnail, duration
- Available formats (video + audio, audio-only)
- Resolutions (1080p, 720p, etc.)
- File extensions (mp4, webm, mkv)

---

### Downloading Media

**IPC Handler**: `ytdlp:download`

```javascript
ipcMain.handle('ytdlp:download', async (event, options) => {
    const args = ['--progress', '--newline'];
    
    // =============== format selection ================
    if (formatId) {
        args.push('-f', formatId);
    } else if (audioOnly) {
        args.push('-f', 'bestaudio', '-x', '--audio-format', 'mp3');
    } else {
        args.push('-f', 'bestvideo+bestaudio/best');
    }
    
    // =============== output template ================
    args.push('-o', path.join(outputPath, '%(title)s.%(ext)s'));
    
    // =============== optional features ================
    if (includeSubtitles) {
        args.push('--write-subs', '--write-auto-subs', '--sub-lang', 'en');
    }
    
    if (includeMetadata) {
        args.push('--embed-metadata', '--embed-thumbnail');
    }
    
    args.push(url);
    
    const ytdlpProcess = spawn(ytdlpPath, args);
});
```

**Key flags:**
- `--progress --newline`: Outputs parseable progress lines
- `-f FORMAT`: Specifies format ID or best quality
- `-x`: Extract audio only
- `--audio-format mp3`: Convert to MP3
- `-o TEMPLATE`: Output filename template
- `--write-subs`: Download subtitles
- `--embed-metadata`: Embed title, artist, etc.

---

### Progress Parsing

yt-dlp outputs progress in this format:
```
[download]   15.2% of 25.30MiB at 1.50MiB/s ETA 00:12
```

**Parser**:
```javascript
ytdlpProcess.stdout.on('data', (data) => {
    const output = data.toString();
    
    const downloadMatch = output.match(/\[download\]\s+(\d+\.?\d*)%/);
    const speedMatch = output.match(/at\s+([\d.]+\w+\/s)/);
    const etaMatch = output.match(/ETA\s+([\d:]+)/);
    
    const progress = {
        percentage: parseFloat(downloadMatch[1]),
        speed: speedMatch[1],
        eta: etaMatch[1],
    };
    
    // =============== send to renderer ================
    mainWindow.webContents.send('ytdlp:progress', progress);
});
```

**Why this works:**
- `--newline` flag ensures each progress update is on a new line
- Regex extracts percentage, speed, ETA
- Progress sent to renderer via IPC event

---

## React UI Components

### State Management

**Main App State** (`App.jsx`):
```javascript
const [currentUrl, setCurrentUrl] = useState('');
const [mediaInfo, setMediaInfo] = useState(null);
const [selectedFormat, setSelectedFormat] = useState(null);
const [outputPath, setOutputPath] = useState(null);
const [downloadOptions, setDownloadOptions] = useState({...});
const [downloadStatus, setDownloadStatus] = useState('idle');
const [downloadProgress, setDownloadProgress] = useState(null);
```

**Why useState?**
- Simple, functional React pattern
- No need for complex state management (Redux, Zustand)
- Props drilling is minimal (only 1-2 levels)

---

### Component Breakdown

#### URLInput.jsx
**Purpose**: Paste URL and trigger format fetching

**Key features:**
- Form submission handling
- Loading state during fetch
- Disabled state when loading

#### FormatSelector.jsx
**Purpose**: Display available formats and let user choose

**Key features:**
- Thumbnail preview
- Video formats grouped by resolution
- Audio-only option
- Filesize and codec display
- Selected format highlighting

#### OutputPathSelector.jsx
**Purpose**: Choose download destination

**Key features:**
- Folder picker via Electron dialog
- Display selected path
- Visual feedback (folder icon changes when selected)

#### DownloadOptions.jsx
**Purpose**: Configure optional features

**Key features:**
- Subtitles toggle
- Metadata embedding toggle
- Playlist download toggle
- Checkbox UI with icons and descriptions

#### DownloadProgress.jsx
**Purpose**: Real-time download status

**Key features:**
- Progress bar (0-100%)
- Speed and ETA display
- Filename display
- Error handling
- Completion state

---

## IPC Communication Flow

### 1. Fetch Formats

```
Renderer (URLInput)
  ↓ User clicks "Fetch Formats"
  ↓ window.electronAPI.fetchFormats(url)
Preload
  ↓ ipcRenderer.invoke('ytdlp:fetch-formats', url)
Main
  ↓ spawn yt-dlp --dump-json
  ↓ parse JSON output
  ↓ return { title, formats, resolutions, ... }
Preload
  ↓ return Promise
Renderer
  ↓ setMediaInfo(result)
  ↓ display FormatSelector
```

### 2. Download

```
Renderer (App)
  ↓ User clicks "Start Download"
  ↓ window.electronAPI.download(options)
Preload
  ↓ ipcRenderer.invoke('ytdlp:download', options)
Main
  ↓ spawn yt-dlp with options
  ↓ parse progress from stdout
  ↓ mainWindow.webContents.send('ytdlp:progress', progress)
Renderer (Progress Listener)
  ↓ window.electronAPI.onProgress(callback)
  ↓ setDownloadProgress(progress)
  ↓ update UI
```

---

## Security Best Practices

### 1. Context Isolation
```javascript
webPreferences: {
    contextIsolation: true,  // ✅ Prevents prototype pollution
    nodeIntegration: false,  // ✅ No direct Node.js in renderer
    sandbox: false,          // ⚠️ Required for preload
}
```

### 2. Minimal IPC API
```javascript
// =============== only expose what's necessary ================
contextBridge.exposeInMainWorld('electronAPI', {
    fetchFormats: (url) => ipcRenderer.invoke('ytdlp:fetch-formats', url),
    download: (options) => ipcRenderer.invoke('ytdlp:download', options),
    selectFolder: () => ipcRenderer.invoke('dialog:select-folder'),
    onProgress: (callback) => { /* ... */ },
    onError: (callback) => { /* ... */ },
});
```

**Why minimal?**
- Reduces attack surface
- No arbitrary IPC calls from renderer
- Each method is explicitly defined

### 3. No Remote Code Execution
- Renderer can't spawn processes
- Renderer can't access filesystem
- All dangerous operations happen in main process

---

## Build Configuration

### Electron Forge

**`forge.config.cjs`**:
```javascript
packagerConfig: {
    asar: true,
    extraResource: [
        "resources",  // =============== includes yt-dlp binaries ================
        "icons",
    ],
}
```

**Why `asar: true`?**
- Bundles app code into single archive
- Faster loading
- Prevents tampering

**Why `extraResource`?**
- yt-dlp binaries must be executable (can't be in asar)
- Accessible via `process.resourcesPath`

---

### Vite Configuration

**`vite.config.js`**:
```javascript
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        port: 3000,  // =============== electron loads http://localhost:3000 in dev ================
    },
    build: {
        outDir: "dist",
    },
});
```

**Why Vite?**
- Extremely fast HMR (Hot Module Replacement)
- ESM-first
- Modern bundler (vs Webpack)

---

## Dev vs Prod Differences

### Development Mode
- Vite dev server on `localhost:3000`
- Electron loads URL from `ELECTRON_START_URL` env var
- yt-dlp binary in `./resources/bin/`
- Hot reload enabled

### Production Mode
- Electron loads `file://dist/index.html`
- yt-dlp binary in `process.resourcesPath/resources/bin/`
- ASAR bundled
- No dev server

---

## Error Handling

### 1. Binary Not Found
```javascript
if (!fs.existsSync(ytdlpPath)) {
    reject(new Error(`yt-dlp binary not found at: ${ytdlpPath}`));
}
```

### 2. Download Failure
```javascript
ytdlpProcess.on('close', (code) => {
    if (code !== 0) {
        reject(new Error(`Download failed with code ${code}`));
    }
});
```

### 3. Network Errors
- yt-dlp stderr is captured and sent to renderer
- Displayed in error state of DownloadProgress component

---

## File Permissions

### Unix Systems (macOS/Linux)

```javascript
function ensureExecutePermissions(binaryPath) {
    if (process.platform !== 'win32') {
        fs.chmodSync(binaryPath, 0o755);
    }
}
```

**Why needed?**
- Downloaded binaries may not have execute permission
- `0o755` = owner can read/write/execute, others can read/execute

---

## Testing Checklist

- [ ] Dev mode: `npm run dev-app`
- [ ] Fetch formats from YouTube URL
- [ ] Select video format (1080p, 720p, etc.)
- [ ] Select audio-only
- [ ] Choose output folder
- [ ] Enable/disable subtitles
- [ ] Enable/disable metadata
- [ ] Start download and verify progress updates
- [ ] Verify download completes successfully
- [ ] Test error handling (invalid URL)
- [ ] Build and package: `npm run package`
- [ ] Test packaged app

---

## Performance Considerations

### 1. Large Playlists
- Default: `--no-playlist`
- User must explicitly enable playlist downloads
- Prevents accidental mass downloads

### 2. Progress Updates
- yt-dlp outputs progress every ~0.5s
- No throttling needed (Electron IPC is fast)

### 3. Memory Usage
- stdout buffered for JSON parsing
- Progress parsing uses regex (minimal overhead)

---

## Future Enhancements

1. **Download Queue** - Multiple downloads simultaneously
2. **History** - Track downloaded files
3. **Auto-update yt-dlp** - Check for new versions
4. **Custom output templates** - Let users customize filenames
5. **Format presets** - Save preferred quality/format
6. **Dark mode** - Theme switching
7. **Download scheduler** - Schedule downloads for later
8. **Proxy support** - For geo-restricted content

---

## Troubleshooting

### Issue: "yt-dlp binary not found"
**Solution**: Run `npm run download-ytdlp` or manually place binary in `resources/bin/`

### Issue: "Permission denied" on macOS/Linux
**Solution**: `chmod +x resources/bin/yt-dlp-macos`

### Issue: Progress not updating
**Solution**: Ensure `--progress --newline` flags are passed to yt-dlp

### Issue: Download fails silently
**Solution**: Check console for stderr output from yt-dlp

---

## Code Quality

- ✅ **Linter**: ESLint configured
- ✅ **Code style**: Consistent naming (camelCase for variables, PascalCase for components)
- ✅ **Comments**: All complex logic commented
- ✅ **Error handling**: Try-catch blocks, Promise rejection handling
- ✅ **TypeScript support**: `electron.d.ts` for IDE autocomplete

---

**This implementation follows Electron + React best practices and provides a solid foundation for a production-ready yt-dlp GUI wrapper.**
