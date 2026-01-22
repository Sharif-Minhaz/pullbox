# Pullbox

A production-grade **Electron desktop application** that provides a modern GUI wrapper around **yt-dlp** for downloading media from thousands of websites.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Electron](https://img.shields.io/badge/Electron-40.0.0-47848F?logo=electron)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)

## 🎯 Features

- ✅ **Modern UI** - Built with React, TailwindCSS, and Tabler Icons
- ✅ **Multi-site Support** - Download from YouTube, Facebook, X.com, Instagram, TikTok, and thousands more
- ✅ **Quality Selection** - Choose from available resolutions and formats
- ✅ **Audio Extraction** - Download audio-only in MP3 format
- ✅ **Real-time Progress** - Live download progress with speed and ETA
- ✅ **Subtitle Support** - Optional subtitle downloading
- ✅ **Metadata Embedding** - Embed title, artist, and thumbnail
- ✅ **Playlist Downloads** - Download entire playlists
- ✅ **Secure Architecture** - Follows Electron security best practices
- ✅ **Cross-platform** - Windows, macOS, and Linux support

## 🏗️ Architecture

### Three-Process Model

```
┌─────────────────────────────────────────────────────────┐
│                    RENDERER PROCESS                      │
│  ┌────────────────────────────────────────────────┐    │
│  │         React UI (src/)                         │    │
│  │  - URLInput                                     │    │
│  │  - FormatSelector                               │    │
│  │  - DownloadProgress                             │    │
│  │  - No Node.js access                            │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                         ↕ IPC (contextBridge)
┌─────────────────────────────────────────────────────────┐
│                    PRELOAD SCRIPT                        │
│  ┌────────────────────────────────────────────────┐    │
│  │  Secure IPC Bridge (preload.cjs)               │    │
│  │  - fetchFormats()                               │    │
│  │  - download()                                   │    │
│  │  - selectFolder()                               │    │
│  │  - onProgress()                                 │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                         ↕ IPC (ipcMain)
┌─────────────────────────────────────────────────────────┐
│                     MAIN PROCESS                         │
│  ┌────────────────────────────────────────────────┐    │
│  │  yt-dlp Integration (main.cjs)                 │    │
│  │  - Binary path resolution (dev/prod)            │    │
│  │  - child_process.spawn()                        │    │
│  │  - stdout/stderr parsing                        │    │
│  │  - Progress extraction                          │    │
│  │  - File permissions (chmod)                     │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                         ↓
                 ┌───────────────┐
                 │   yt-dlp      │
                 │   Binary      │
                 └───────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pullbox
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   This will automatically download the yt-dlp binary for your platform via the `postinstall` script.

3. **Run in development mode**
   ```bash
   npm run dev-app
   ```

   Or on macOS:
   ```bash
   npm run dev-mac
   ```

## 📦 Building

### Build the app
```bash
npm run build
```

### Package for current platform
```bash
npm run package
```

### Create distributables
```bash
npm run make
```

### Windows-specific build
```bash
npm run make-win
```

## 🛠️ Development

### Project Structure

```
pullbox/
├── main.cjs                      # Electron main process
├── preload.cjs                   # IPC bridge (contextBridge)
├── forge.config.cjs              # Electron Forge configuration
├── vite.config.js                # Vite bundler config
├── package.json                  # Dependencies & scripts
├── resources/
│   └── bin/                      # yt-dlp binaries (per OS)
│       ├── yt-dlp.exe            # Windows
│       ├── yt-dlp-macos          # macOS
│       └── yt-dlp-linux          # Linux
├── scripts/
│   └── download-ytdlp.js         # Auto-download yt-dlp binary
├── src/
│   ├── App.jsx                   # Main React component
│   ├── main.jsx                  # React entry point
│   ├── electron.d.ts             # TypeScript declarations
│   └── components/
│       ├── URLInput.jsx          # URL input field
│       ├── FormatSelector.jsx    # Quality/format picker
│       ├── OutputPathSelector.jsx# Folder selection
│       ├── DownloadOptions.jsx   # Checkboxes (subs, metadata)
│       └── DownloadProgress.jsx  # Progress bar & status
└── dist/                         # Built files (generated)
```

### Key Files

#### `main.cjs` - Main Process
- Resolves yt-dlp binary path (dev vs prod)
- Spawns yt-dlp via `child_process.spawn()`
- Parses stdout for progress (`--progress --newline`)
- Handles IPC from renderer
- Manages file permissions (chmod on macOS/Linux)

#### `preload.cjs` - Security Bridge
- Exposes minimal API via `contextBridge.exposeInMainWorld()`
- No direct Node.js access to renderer
- `contextIsolation: true`

#### `src/App.jsx` - Main UI
- React functional components with hooks
- State management for URL, formats, progress
- IPC calls to main process
- Real-time progress updates via listeners

### Running Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server only |
| `npm run dev-app` | Start Vite + Electron (Linux/Windows) |
| `npm run dev-mac` | Start Vite + Electron (macOS) |
| `npm run build` | Build React app to `dist/` |
| `npm run package` | Package Electron app |
| `npm run make` | Create platform distributables |
| `npm run download-ytdlp` | Manually download yt-dlp binary |

## 🔐 Security

This app follows **Electron security best practices**:

- ✅ `contextIsolation: true` - Renderer has no direct Node.js access
- ✅ `nodeIntegration: false` - Prevents unsafe Node.js in renderer
- ✅ Preload script with `contextBridge` - Minimal IPC API surface
- ✅ No remote code execution
- ✅ Renderer can't spawn processes or access filesystem directly

## 📖 Usage

1. **Paste a URL** from any supported site (YouTube, Facebook, etc.)
2. **Click "Fetch Formats"** to retrieve available qualities
3. **Select quality** (video resolution or audio-only)
4. **Choose output folder** via the folder picker
5. **Configure options**:
   - Include subtitles
   - Embed metadata (title, thumbnail)
   - Download entire playlist
6. **Click "Start Download"** and watch real-time progress
7. **Files saved** to your selected folder

## 🌐 Supported Sites

Supports **thousands of sites** via yt-dlp, including:
- YouTube
- Facebook
- X.com (Twitter)
- Instagram
- TikTok
- Vimeo
- Dailymotion
- Reddit
- And many more...

See [yt-dlp supported sites](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md) for the full list.

## 🐛 Troubleshooting

### yt-dlp binary not found

**Solution:**
```bash
npm run download-ytdlp
```

Or manually download from [yt-dlp releases](https://github.com/yt-dlp/yt-dlp/releases/latest) and place in `resources/bin/`:
- Windows: `yt-dlp.exe`
- macOS: `yt-dlp-macos`
- Linux: `yt-dlp-linux`

On macOS/Linux, make executable:
```bash
chmod +x resources/bin/yt-dlp-macos
chmod +x resources/bin/yt-dlp-linux
```

### Download fails

- Check internet connection
- Verify URL is from a supported site
- Update yt-dlp to latest version
- Check console for detailed error messages

### Formats not loading

- Ensure URL is valid
- Some sites have geo-restrictions
- Try a different video/URL

## 🛣️ Tech Stack

- **Electron** 40.0.0 - Desktop app framework
- **Electron Forge** 7.11.1 - Build tooling
- **Vite** 7.2.4 - Fast bundler
- **React** 19.2.0 - UI framework
- **TailwindCSS** 4.1.18 - Styling
- **Tabler Icons React** - Icon set
- **yt-dlp** - Media downloader (external binary)

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Powerful media downloader
- [Electron](https://www.electronjs.org/) - Cross-platform desktop apps
- [React](https://react.dev/) - UI framework
- [Vite](https://vite.dev/) - Next-generation frontend tooling
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [Tabler Icons](https://tabler.io/icons) - Open-source icon set

---

**Made with ❤️ using Electron + React + yt-dlp**
