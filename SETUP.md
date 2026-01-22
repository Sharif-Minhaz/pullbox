# Pullbox - Setup Guide

A production-grade Electron desktop application that provides a GUI wrapper around yt-dlp for downloading media from thousands of websites.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- yt-dlp binaries (see below)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Download yt-dlp Binaries

You need to download the appropriate yt-dlp binary for your platform(s):

#### For Windows:
1. Visit: https://github.com/yt-dlp/yt-dlp/releases/latest
2. Download `yt-dlp.exe`
3. Place it in `resources/bin/yt-dlp.exe`

#### For macOS:
1. Visit: https://github.com/yt-dlp/yt-dlp/releases/latest
2. Download `yt-dlp_macos`
3. Rename to `yt-dlp-macos`
4. Place it in `resources/bin/yt-dlp-macos`
5. Make it executable: `chmod +x resources/bin/yt-dlp-macos`

#### For Linux:
1. Visit: https://github.com/yt-dlp/yt-dlp/releases/latest
2. Download `yt-dlp` (Linux binary)
3. Rename to `yt-dlp-linux`
4. Place it in `resources/bin/yt-dlp-linux`
5. Make it executable: `chmod +x resources/bin/yt-dlp-linux`

**Note:** The binaries are NOT included in version control due to their size.

## Development

### Run in Development Mode

```bash
npm run dev-app
```

This will:
- Start the Vite dev server on http://localhost:3000
- Launch Electron with hot-reload enabled

### Alternative (separate terminals):

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
npm start
```

## Building for Production

### Build the React App

```bash
npm run build
```

### Package the Electron App

For current platform:
```bash
npm run package
```

For Windows specifically:
```bash
npm run make-win
```

For all platforms:
```bash
npm run make
```

## Project Structure

```
pullbox/
├── main.cjs                 # Electron main process
├── preload.cjs             # Preload script (IPC bridge)
├── resources/
│   └── bin/                # yt-dlp binaries
│       ├── yt-dlp.exe      # Windows binary
│       ├── yt-dlp-macos    # macOS binary
│       ├── yt-dlp-linux    # Linux binary
│       └── README.md
├── src/
│   ├── App.jsx             # Main React component
│   ├── components/
│   │   ├── URLInput.jsx
│   │   ├── FormatSelector.jsx
│   │   ├── OutputPathSelector.jsx
│   │   ├── DownloadOptions.jsx
│   │   └── DownloadProgress.jsx
│   ├── electron.d.ts       # TypeScript declarations
│   └── main.jsx
└── dist/                   # Built files (generated)
```

## Architecture

### Main Process (`main.cjs`)
- Manages yt-dlp binary execution
- Handles IPC communication
- Spawns child processes
- Parses yt-dlp output
- OS-specific binary path resolution

### Preload Script (`preload.cjs`)
- Secure IPC bridge between main and renderer
- Exposes minimal API via `contextBridge`
- No direct Node.js access to renderer

### Renderer Process (`src/`)
- React UI components
- State management
- User interactions
- No filesystem or process access

## Features

### Core Functionality
- ✅ Paste media URL from supported sites
- ✅ Fetch available formats and qualities
- ✅ Display resolutions, formats, and codecs
- ✅ Audio-only download option
- ✅ Choose output folder
- ✅ Optional subtitles
- ✅ Optional metadata embedding
- ✅ Playlist download support
- ✅ Real-time download progress
- ✅ Download speed and ETA display
- ✅ Error handling

### Supported Sites
- YouTube
- Facebook
- X.com (Twitter)
- Instagram
- TikTok
- And thousands more (see yt-dlp documentation)

## Security

The app follows Electron security best practices:
- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: false` (required for preload)
- Minimal IPC API surface
- No direct filesystem access from renderer

## Troubleshooting

### yt-dlp binary not found
- Ensure the binary is in the correct location (`resources/bin/`)
- Check file permissions on macOS/Linux (`chmod +x`)
- Verify correct naming:
  - Windows: `yt-dlp.exe`
  - macOS: `yt-dlp-macos`
  - Linux: `yt-dlp-linux`

### Download fails
- Ensure you have internet connectivity
- Some sites may require specific yt-dlp version
- Check yt-dlp output in console for details
- Try updating yt-dlp to latest version

### Formats not loading
- Verify the URL is valid
- Check if the site is supported by yt-dlp
- Some sites may have geo-restrictions

## License

MIT
