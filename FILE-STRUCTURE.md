# Pullbox - File Structure

Complete file tree with descriptions.

```
pullbox/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies, scripts, metadata
│   ├── package-lock.json         # Dependency lock file
│   ├── vite.config.js            # Vite bundler configuration
│   ├── forge.config.cjs          # Electron Forge build config
│   ├── eslint.config.js          # ESLint linter rules
│   ├── index.html                # HTML template for React app
│   └── .gitignore                # Git ignore rules
│
├── 🔧 Electron Process Files
│   ├── main.cjs                  # Main process (yt-dlp integration)
│   └── preload.cjs               # Preload script (IPC bridge)
│
├── ⚛️ React Source Files (src/)
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # Main React component
│   ├── App.css                   # App styles
│   ├── index.css                 # Global styles (TailwindCSS)
│   ├── electron.d.ts             # TypeScript declarations
│   │
│   ├── components/               # React UI components
│   │   ├── URLInput.jsx          # Media URL input field
│   │   ├── FormatSelector.jsx    # Quality/format picker
│   │   ├── OutputPathSelector.jsx# Folder selection
│   │   ├── DownloadOptions.jsx   # Download options (subs, metadata)
│   │   └── DownloadProgress.jsx  # Progress bar & status
│   │
│   └── assets/                   # Static assets
│       └── react.svg             # React logo
│
├── 🎨 Icons (icons/)
│   ├── list.ico                  # Windows icon
│   ├── list.png                  # macOS/Linux icon
│   ├── sandra.png                # Additional icon
│   ├── tbd-logo.png              # Logo
│   └── vite.svg                  # Vite logo
│
├── 📦 Resources (resources/)
│   └── bin/                      # yt-dlp binaries
│       ├── README.md             # Binary download instructions
│       ├── yt-dlp.exe            # Windows binary (user downloads)
│       ├── yt-dlp-macos          # macOS binary (user downloads)
│       └── yt-dlp-linux          # Linux binary (user downloads)
│
├── 🤖 Scripts (scripts/)
│   └── download-ytdlp.js         # Auto-download yt-dlp binary
│
├── 🌐 Public Files (public/)
│   ├── splash.html               # Splash screen (optional)
│   └── vite.svg                  # Vite logo
│
├── 🏗️ Build Output (dist/)
│   ├── index.html                # Built HTML
│   ├── splash.html               # Built splash screen
│   ├── vite.svg                  # Vite logo
│   └── assets/                   # Bundled CSS/JS
│       ├── index-[hash].css      # Compiled styles
│       └── index-[hash].js       # Compiled React app
│
├── 📚 Documentation
│   ├── README.md                 # Main project documentation
│   ├── QUICKSTART.md             # 5-minute setup guide
│   ├── SETUP.md                  # Detailed setup guide
│   ├── IMPLEMENTATION.md         # Technical deep-dive
│   ├── YT-DLP-REFERENCE.md       # yt-dlp CLI flags reference
│   ├── PROJECT-SUMMARY.md        # Complete deliverables list
│   └── FILE-STRUCTURE.md         # This file
│
└── 🗂️ Other
    └── node_modules/             # Installed dependencies (npm install)
```

---

## File Descriptions

### Root Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | NPM package manifest, dependencies, scripts |
| `vite.config.js` | Vite dev server and build configuration |
| `forge.config.cjs` | Electron Forge packaging and makers config |
| `eslint.config.js` | Code linting rules |
| `index.html` | HTML template for the React app |
| `.gitignore` | Files to exclude from Git |

### Electron Process Files

| File | Purpose |
|------|---------|
| `main.cjs` | Electron main process - manages windows, yt-dlp, IPC |
| `preload.cjs` | Secure IPC bridge between main and renderer |

### React Source Files

| File | Purpose |
|------|---------|
| `src/main.jsx` | React entry point, renders App component |
| `src/App.jsx` | Main application component, state management |
| `src/App.css` | Application-specific styles |
| `src/index.css` | Global styles, TailwindCSS imports |
| `src/electron.d.ts` | TypeScript type definitions for Electron API |

### React Components

| Component | Purpose |
|-----------|---------|
| `URLInput.jsx` | Input field for media URL, fetch formats button |
| `FormatSelector.jsx` | Display available formats, quality selection |
| `OutputPathSelector.jsx` | Folder picker for download destination |
| `DownloadOptions.jsx` | Checkboxes for subtitles, metadata, playlist |
| `DownloadProgress.jsx` | Progress bar, speed, ETA, status display |

### Resources

| File | Purpose |
|------|---------|
| `resources/bin/yt-dlp.exe` | yt-dlp binary for Windows |
| `resources/bin/yt-dlp-macos` | yt-dlp binary for macOS |
| `resources/bin/yt-dlp-linux` | yt-dlp binary for Linux |

### Scripts

| File | Purpose |
|------|---------|
| `scripts/download-ytdlp.js` | Automatically downloads yt-dlp from GitHub |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Comprehensive project overview |
| `QUICKSTART.md` | Get started in 5 minutes |
| `SETUP.md` | Detailed installation and setup guide |
| `IMPLEMENTATION.md` | Technical architecture and code explanations |
| `YT-DLP-REFERENCE.md` | yt-dlp CLI flags and usage |
| `PROJECT-SUMMARY.md` | Complete deliverables checklist |
| `FILE-STRUCTURE.md` | This file |

---

## Key Directories

### `/src/`
All React source code. Edit files here during development.

### `/resources/bin/`
yt-dlp binaries. Must download manually or via `npm run download-ytdlp`.

### `/dist/`
Build output. Generated by `npm run build`. Not committed to Git.

### `/out/`
Electron packaged apps. Generated by `npm run package` or `npm run make`.

### `/node_modules/`
NPM dependencies. Generated by `npm install`. Not committed to Git.

---

## File Count Summary

| Type | Count |
|------|-------|
| Configuration files | 6 |
| Electron process files | 2 |
| React components | 5 |
| React core files | 5 |
| Documentation files | 7 |
| Scripts | 1 |
| Icons | 5 |
| **Total project files** | **31** |

---

## Git-Ignored Files/Folders

The following are **not** committed to version control:

- `node_modules/` - NPM dependencies
- `dist/` - Build output
- `out/` - Packaged apps
- `resources/bin/yt-dlp*` - yt-dlp binaries (too large)
- `.env` - Environment variables
- `.cursor/` - Cursor IDE metadata

---

## Files You'll Edit Most

During development, you'll primarily work with:

1. `src/App.jsx` - Main application logic
2. `src/components/*.jsx` - UI components
3. `main.cjs` - Electron/yt-dlp integration
4. `preload.cjs` - IPC API definitions
5. `src/index.css` - Styling

---

## Build Output

After running `npm run build`:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
└── ...
```

After running `npm run package`:
```
out/
└── pullbox-[platform]-[arch]/
    ├── Pullbox.app (macOS)
    ├── Pullbox.exe (Windows)
    └── pullbox (Linux)
```

---

**Navigate the codebase confidently! 🗺️**
