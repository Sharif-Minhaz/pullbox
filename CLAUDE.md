# Pullbox — CLAUDE.md

> Production-grade Electron desktop app. GUI wrapper for yt-dlp media downloader.

---

## Commands

```bash
# development
npm run dev-app       # vite (port 3000) + electron concurrently (linux/windows)
npm run dev-mac       # same with cross-env for macOS
npm run dev           # vite only, no electron

# build & package
npm run build         # vite build → dist/
npm run make          # electron forge → platform distributable
npm run make-win      # cross-build for win32 x64

# utilities
npm run download-ytdlp  # manually re-download yt-dlp binary to resources/bin/
```

Package manager: **npm**. Never use yarn/pnpm/bun here.

---

## Architecture

Three-process model:

```
Renderer (React/Vite)
  → preload.cjs (contextBridge → window.electronAPI)
    → main.cjs (ipcMain handlers → child_process.spawn)
      → yt-dlp / ffmpeg binaries (resources/bin/)
```

**IPC channels:**
- `ytdlp:check-playlist` — detect playlist, return count + entries
- `ytdlp:fetch-formats` — dump JSON for formats/title/thumbnail
- `ytdlp:download` — spawn download, stream `ytdlp:progress` + `ytdlp:error` events
- `dialog:select-folder` — native folder picker

Binary resolution: dev uses `__dirname/resources/bin/`, prod uses `process.resourcesPath/resources/`.

---

## Project Structure

```
pullbox/
├── main.cjs              # electron main process + all ipcMain handlers
├── preload.cjs           # contextBridge → window.electronAPI
├── forge.config.cjs      # electron forge build config (ASAR, makers, fuses)
├── vite.config.js        # vite + react compiler + tailwind v4 plugin
├── scripts/
│   └── download-ytdlp.js # postinstall: fetches yt-dlp binaries from github
├── resources/bin/        # yt-dlp + ffmpeg binaries (gitignored, auto-downloaded)
├── src/
│   ├── App.jsx           # root component — holds ALL state
│   ├── main.jsx          # createRoot entry
│   ├── index.css         # single line: @import "tailwindcss"
│   ├── electron.d.ts     # TS declarations for window.electronAPI
│   ├── utils/index.js    # parseYtDlpError() — maps stderr to friendly messages
│   └── components/
│       ├── URLInput.jsx
│       ├── FormatSelector.jsx
│       ├── OutputPathSelector.jsx
│       ├── DownloadOptions.jsx
│       ├── DownloadProgress.jsx
│       └── PlaylistInfo.jsx
└── public/splash.html    # frameless splash screen shown before main window
```

---

## Tech Stack

| Layer | Tech |
|---|---|
| Desktop | Electron 40 |
| Packaging | Electron Forge 7 |
| Bundler | Vite 7 |
| UI | React 19 (StrictMode) |
| Styling | TailwindCSS v4 (CSS-first, no config file) |
| Icons | Tabler Icons React (`@tabler/icons-react`) |
| State | React `useState` / `useEffect` only — no Redux/Zustand |
| Compiler | `babel-plugin-react-compiler` (enabled in vite config) |
| Language | JSX for renderer, CJS for electron processes |

---

## Code Patterns & Conventions

### State management
- All app state lives in `src/App.jsx` — no global store
- `downloadStatus` enum: `'idle' | 'downloading' | 'completed' | 'error'`
- `urlKey` state increments to force-remount `URLInput` on reset
- Last download path persisted to `localStorage`

### IPC usage
- Renderer never uses Node APIs directly — only through `window.electronAPI`
- Progress/error listeners return cleanup functions (called in `useEffect` return)
- `preload.cjs` uses `contextBridge` — `nodeIntegration: false`, `contextIsolation: true`

### Error handling
- Raw yt-dlp stderr is always passed through `parseYtDlpError()` before displaying
- IPC handlers reject with `new Error(message)` — renderer catches and calls `parseYtDlpError`

### TailwindCSS v4
- No `tailwind.config.js` — v4 uses CSS-first config via `@import "tailwindcss"` in `index.css`
- Plugin is `@tailwindcss/vite` (not PostCSS)

### Binaries
- Platform naming: `yt-dlp-linux`, `yt-dlp-macos`, `yt-dlp.exe` / same pattern for ffmpeg
- `ensureExecutePermissions()` called before every spawn on non-Windows

---

## UI & Styling Rules

- Use **Tabler Icons** (`@tabler/icons-react`) for all icons — never heroicons, lucide, etc.
- When adding **shadcn/ui components**: ask the user to install via CLI, never copy component code manually
- TailwindCSS utility classes only — no custom CSS except in `index.css`
- Layout: `max-w-4xl mx-auto` cards with `bg-white rounded-lg shadow-md p-6`

---

## Code Style Rules

### Variable naming
- Never use vague/short names: `q`, `c`, `d`, `i`, `v`, etc.
- Always use full descriptive names: `query`, `component`, `data`, `index`, `value`

### Comments
- Format: `// =============== lowercase human comment ================`
- Only write comments for non-obvious intent — never narrate what code does
- No obvious comments like "import the module", "define the function", "return the result"

### File conventions
- Renderer files: `.jsx` (ESM)
- Electron process files: `.cjs` (CommonJS)
- `src/electron.d.ts` declares all `window.electronAPI` types — keep it updated when adding IPC channels

---

## Build & Packaging

- Forge config: `asar: true`, bundles `resources/` + `icons/` as `extraResource`
- Security fuses enabled: `RunAsNode: false`, `EnableCookieEncryption: true`, `OnlyLoadAppFromAsar: true`
- Makers: Squirrel (Windows), ZIP (macOS), DEB + RPM (Linux)
- Windows also has an NSIS config (legacy/electron-builder style) in `package.json` `build` section

---

## Gotchas

- `resources/bin/` is gitignored — always run `npm install` (triggers `postinstall` → `download-ytdlp.js`) on fresh clone
- Dev mode uses `ELECTRON_START_URL=http://localhost:3000` to load from Vite dev server; binary path logic branches on this env var
- Splash window (frameless, transparent) loads `dist/splash.html` — main window is hidden until `ready-to-show`
- `vite.config.js` aliases `@tabler/icons-react` to `.mjs` ESM index for tree-shaking — do not remove this alias
- `babel-plugin-react-compiler` is active — avoid manual memoization (`useMemo`/`useCallback`) unless React Compiler cannot optimize
