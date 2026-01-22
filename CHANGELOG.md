# Changelog

All notable changes to Pullbox will be documented in this file.

---

## [1.1.0] - 2026-01-22

### 🎉 Added - Playlist Support

#### New Features
- **Playlist Detection**: Automatically detects YouTube playlist URLs
- **Playlist Information Display**: Shows playlist title, video count, and preview
- **Multi-Video Progress Tracking**: Displays current video number (e.g., "3 of 25")
- **Playlist Toggle**: User can choose to download entire playlist or just first video
- **Smart Defaults**: Auto-enables playlist download when playlist URL is detected

#### New Components
- `PlaylistInfo.jsx` - Displays playlist information with purple gradient theme
  - Shows playlist title and video count
  - Previews first 10 videos with titles and durations
  - Toggle checkbox for enabling/disabling playlist download
  - Visual warning when playlist download is disabled

#### IPC Enhancements
- **New Handler**: `ytdlp:check-playlist` - Detects and extracts playlist information
- **Enhanced Progress**: Now includes `playlistIndex` and `playlistTotal` fields
- **New Preload Method**: `checkPlaylist(url)` exposed to renderer

#### UI Improvements
- Purple-themed playlist information card
- Dual progress bars (playlist progress + video progress)
- "Downloading video X of Y" indicator during playlist downloads
- Preview list showing first 10 videos from playlist

#### yt-dlp Integration
- Uses `--flat-playlist --dump-single-json` for playlist detection
- Parses `[download] Downloading item X of Y` from stdout
- Respects `--no-playlist` flag when playlist download is disabled
- Downloads entire playlist when flag is omitted

#### TypeScript Declarations
- Added `PlaylistInfo` interface
- Added `PlaylistEntry` interface
- Updated `DownloadProgress` with playlist fields
- Added `checkPlaylist` method to `ElectronAPI`

---

## [1.0.0] - 2026-01-22

### 🎉 Initial Release

#### Core Features
- **Media URL Input**: Paste URLs from YouTube, Facebook, X.com, Instagram, TikTok, etc.
- **Format Fetching**: Retrieve available qualities and formats via yt-dlp
- **Quality Selection**: Choose from available resolutions (1080p, 720p, 480p, etc.)
- **Audio-Only Downloads**: Extract audio in MP3 format
- **Output Folder Selection**: Choose download destination via folder picker
- **Download Options**:
  - Include subtitles
  - Embed metadata (title, artist, thumbnail)
  - Download playlist (toggle)
- **Real-time Progress**: Live progress bar with percentage, speed, and ETA
- **Error Handling**: User-friendly error messages

#### Architecture
- **Electron Main Process**: yt-dlp integration, binary execution, IPC handlers
- **Preload Script**: Secure IPC bridge with contextBridge
- **React Renderer**: Modern UI with no Node.js access
- **Three-Process Model**: Main, Preload, Renderer separation

#### UI Components
- `URLInput.jsx` - Media URL input field
- `FormatSelector.jsx` - Quality and format picker
- `OutputPathSelector.jsx` - Folder selection
- `DownloadOptions.jsx` - Download option toggles
- `DownloadProgress.jsx` - Progress display

#### Security
- Context isolation enabled
- Node integration disabled
- Minimal IPC API surface
- Secure contextBridge implementation

#### Tech Stack
- Electron 40.0.0
- React 19.2.0
- Vite 7.2.4
- TailwindCSS 4.1.18
- Tabler Icons React
- yt-dlp (external binary)

#### Build & Package
- Electron Forge 7.11.1
- ASAR packaging
- Resource bundling for yt-dlp binaries
- Cross-platform support (Windows, macOS, Linux)

#### Developer Experience
- Auto-download script for yt-dlp binaries
- TypeScript declarations for IDE support
- ESLint configuration
- Hot module replacement (HMR) in dev mode

#### Documentation (2000+ lines)
- `README.md` - Main documentation
- `QUICKSTART.md` - 5-minute setup guide
- `SETUP.md` - Detailed installation guide
- `IMPLEMENTATION.md` - Technical deep-dive
- `YT-DLP-REFERENCE.md` - CLI flags reference
- `FILE-STRUCTURE.md` - Project navigation
- `PROJECT-SUMMARY.md` - Deliverables checklist
- `DOCS-INDEX.md` - Documentation index
- `COMPLETION-REPORT.md` - Final project report
- `UI-FLOW.md` - User interface flow diagrams

---

## Version History Summary

| Version | Date | Major Changes |
|---------|------|---------------|
| 1.1.0 | 2026-01-22 | Added YouTube playlist support |
| 1.0.0 | 2026-01-22 | Initial release |

---

## Upgrade Guide

### From 1.0.0 to 1.1.0

No breaking changes. Simply pull the latest code and restart the app.

**New Features Available:**
- Paste playlist URLs to see playlist information
- Toggle playlist download on/off
- Track progress across multiple videos

**No Action Required:**
- Existing functionality remains unchanged
- Single video downloads work exactly as before

---

## Supported Platforms

- Windows 10/11 (x64)
- macOS 10.13+ (Intel and Apple Silicon)
- Linux (x64, most distributions)

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| electron | ^40.0.0 | Desktop framework |
| react | ^19.2.0 | UI framework |
| vite | ^7.2.4 | Build tool |
| tailwindcss | ^4.1.18 | Styling |
| @tabler/icons-react | Latest | Icons |
| yt-dlp | External | Media downloader |

---

## Known Issues

None at this time.

---

## Roadmap

### Planned Features
- [ ] Download queue (multiple simultaneous downloads)
- [ ] Download history
- [ ] Auto-update yt-dlp binary
- [ ] Custom output filename templates
- [ ] Quality presets
- [ ] Dark mode
- [ ] Download scheduler
- [ ] Proxy support

---

**For detailed information, see [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) and [PLAYLIST-FEATURE.md](PLAYLIST-FEATURE.md)**
