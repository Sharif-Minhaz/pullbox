# Playlist Support Feature

Complete implementation of YouTube playlist support in Pullbox.

---

## ✅ What Was Added

### 1. Playlist Detection
- **New IPC Handler**: `ytdlp:check-playlist`
- **Uses**: `--flat-playlist --dump-single-json` flags
- **Detects**: Whether URL is a playlist or single video
- **Returns**: Playlist title, video count, and preview entries

### 2. Playlist Information Display
- **New Component**: `PlaylistInfo.jsx`
- **Shows**: 
  - Playlist title
  - Total video count
  - Preview of first 10 videos
  - Toggle to enable/disable playlist download
  - Visual warning when playlist download is disabled

### 3. Multi-Video Progress Tracking
- **Enhanced Progress Parsing**: Detects playlist position
- **Regex**: Matches "Downloading item X of Y"
- **UI Updates**: Shows current video number and total count
- **Progress Bar**: Visual indicator of playlist completion

### 4. TypeScript Declarations
- **Added Types**: `PlaylistInfo`, `PlaylistEntry`
- **Updated**: `DownloadProgress` with playlist fields
- **Added Method**: `checkPlaylist()` to API

---

## 🏗️ Architecture

### IPC Flow for Playlist Detection

```
User pastes playlist URL → Click "Fetch Formats"
    ↓
Renderer: checkPlaylist(url)
    ↓
Main: spawn yt-dlp --flat-playlist --dump-single-json
    ↓
Parse JSON: Extract playlist info
    ↓
Return: { isPlaylist: true, playlistCount: 20, entries: [...] }
    ↓
Renderer: Display PlaylistInfo component
    ↓
Renderer: Auto-enable "downloadPlaylist" option
    ↓
User: Toggle playlist download on/off
```

### Download Flow for Playlists

```
User clicks "Start Download" with downloadPlaylist=true
    ↓
Main: spawn yt-dlp WITHOUT --no-playlist flag
    ↓
yt-dlp downloads all videos in playlist
    ↓
stdout: "[download] Downloading item 1 of 20"
    ↓
Main: Parse playlist progress
    ↓
IPC Event: progress { playlistIndex: 1, playlistTotal: 20, ... }
    ↓
Renderer: Update progress bar
    ↓
DownloadProgress: Show "Downloading video 1 of 20"
    ↓
Repeat for each video...
```

---

## 📝 Code Changes

### 1. Main Process (`main.cjs`)

#### Added Playlist Check Handler

```javascript
ipcMain.handle('ytdlp:check-playlist', async (event, url) => {
    const args = ['--flat-playlist', '--dump-single-json', url];
    // ... spawn yt-dlp
    // ... parse JSON
    return {
        isPlaylist: info._type === 'playlist',
        playlistTitle: info.title,
        playlistCount: info.entries.length,
        entries: info.entries.slice(0, 10).map(...)
    };
});
```

#### Enhanced Progress Parsing

```javascript
const playlistItemMatch = output.match(/\[download\]\s+Downloading\s+(?:video|item)\s+(\d+)\s+of\s+(\d+)/);

const progress = {
    percentage: ...,
    speed: ...,
    eta: ...,
    filename: ...,
    playlistIndex: playlistItemMatch ? parseInt(playlistItemMatch[1]) : null,
    playlistTotal: playlistItemMatch ? parseInt(playlistItemMatch[2]) : null,
};
```

### 2. Preload Script (`preload.cjs`)

#### Added checkPlaylist Method

```javascript
contextBridge.exposeInMainWorld('electronAPI', {
    checkPlaylist: (url) => ipcRenderer.invoke('ytdlp:check-playlist', url),
    // ... other methods
});
```

### 3. React Components

#### New: `PlaylistInfo.jsx`

```jsx
export default function PlaylistInfo({ playlistInfo, onTogglePlaylist, downloadPlaylist }) {
    return (
        <div className="bg-gradient-to-r from-purple-600 to-purple-700">
            <h2>Playlist Detected</h2>
            <p>{playlistCount} videos</p>
            <checkbox onChange={onTogglePlaylist} />
            <ul>
                {entries.map(entry => <li>{entry.title}</li>)}
            </ul>
        </div>
    );
}
```

#### Updated: `DownloadProgress.jsx`

```jsx
{progress.playlistIndex && progress.playlistTotal && (
    <div className="bg-purple-50">
        <p>Downloading video {progress.playlistIndex} of {progress.playlistTotal}</p>
        <ProgressBar value={playlistIndex / playlistTotal * 100} />
    </div>
)}
```

#### Updated: `App.jsx`

```jsx
const [playlistInfo, setPlaylistInfo] = useState(null);

const handleFetchFormats = async (url) => {
    // Check if playlist
    const playlistCheck = await window.electronAPI.checkPlaylist(url);
    setPlaylistInfo(playlistCheck);
    
    // Auto-enable playlist download
    if (playlistCheck.isPlaylist) {
        setDownloadOptions(prev => ({ ...prev, downloadPlaylist: true }));
    }
    
    // Fetch formats for first video
    const info = await window.electronAPI.fetchFormats(url);
    setMediaInfo(info);
};
```

---

## 🎨 UI Components

### Playlist Info Card

```
┌──────────────────────────────────────────────────────┐
│  🎵 Playlist Detected                                │
│  My Awesome Playlist                                 │
│                                                      │
│  📹 25 videos    ☑ Download all videos              │
│                                                      │
│  Preview (first 10 videos):                          │
│  ┌────────────────────────────────────────────────┐ │
│  │ 1. Video Title One          (4:23)             │ │
│  │ 2. Video Title Two          (5:12)             │ │
│  │ 3. Video Title Three        (3:45)             │ │
│  │ ...                                            │ │
│  │ ... and 15 more videos                         │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ℹ️ Only the first video will be downloaded.        │
│     Enable "download all videos" above.              │
└──────────────────────────────────────────────────────┘
```

### Playlist Progress Display

```
┌──────────────────────────────────────────────────────┐
│  📥 Downloading...                                   │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Downloading video 3 of 25                      │ │
│  │ ████████░░░░░░░░░░░░░░░░░░░░                  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  File: Video Title Three.mp4                         │
│                                                      │
│  Progress                               67.3%        │
│  ████████████████████░░░░░░░░░░                    │
│                                                      │
│  Speed: 2.50 MB/s          Estimated: 00:45         │
└──────────────────────────────────────────────────────┘
```

---

## 🔧 yt-dlp Flags Used

### Playlist Detection

```bash
yt-dlp --flat-playlist --dump-single-json "PLAYLIST_URL"
```

**Flags:**
- `--flat-playlist`: Extract playlist info without downloading
- `--dump-single-json`: Output entire playlist as single JSON object

**Output:**
```json
{
  "_type": "playlist",
  "title": "My Playlist",
  "id": "PLxxx",
  "entries": [
    { "title": "Video 1", "id": "xxx", "duration": 263 },
    { "title": "Video 2", "id": "yyy", "duration": 312 }
  ]
}
```

### Download Single Video from Playlist

```bash
yt-dlp --no-playlist "PLAYLIST_URL"
```

**Flags:**
- `--no-playlist`: Download only the first video

### Download Entire Playlist

```bash
yt-dlp "PLAYLIST_URL"
```

**No `--no-playlist` flag = downloads all videos**

**Progress Output:**
```
[download] Downloading item 1 of 25
[download] Destination: Video 1.mp4
[download]   50.0% of 125.30MiB at 2.50MiB/s ETA 00:25
...
[download] Downloading item 2 of 25
[download] Destination: Video 2.mp4
```

---

## 🎯 Features

### Automatic Detection
- ✅ Automatically detects playlist URLs
- ✅ Shows playlist information immediately
- ✅ Auto-enables "download entire playlist" option
- ✅ User can disable to download only first video

### Visual Feedback
- ✅ Purple gradient card for playlist info
- ✅ Video count display
- ✅ Preview of first 10 videos with durations
- ✅ Toggle checkbox for playlist download
- ✅ Warning message when playlist download is disabled

### Progress Tracking
- ✅ Shows current video number (e.g., "3 of 25")
- ✅ Purple progress bar for playlist progress
- ✅ Blue progress bar for individual video progress
- ✅ Dual progress tracking (playlist + video)

### Smart Behavior
- ✅ If playlist URL with download disabled: downloads first video only
- ✅ If playlist URL with download enabled: downloads all videos
- ✅ If single video URL: no playlist info shown
- ✅ Format selection applies to all videos in playlist

---

## 🧪 Testing Checklist

- [ ] Paste YouTube playlist URL
- [ ] Verify playlist detection works
- [ ] Check playlist info displays correctly (title, count)
- [ ] Verify first 10 videos preview shows
- [ ] Test "Download all videos" toggle
- [ ] Download with playlist enabled
- [ ] Verify "Downloading video X of Y" shows
- [ ] Check playlist progress bar updates
- [ ] Verify individual video progress bar updates
- [ ] Test downloading with playlist disabled (first video only)
- [ ] Test single video URL (no playlist info shown)

---

## 🚀 Usage

### For Users

1. **Paste a playlist URL** (e.g., `https://youtube.com/playlist?list=...`)
2. **Click "Fetch Formats"**
3. **See playlist info**:
   - Title and video count
   - Preview of videos
4. **Toggle "Download all videos"**:
   - ✅ Enabled: Downloads entire playlist
   - ☐ Disabled: Downloads first video only
5. **Select quality** (applies to all videos)
6. **Choose output folder**
7. **Start download**
8. **Watch progress**:
   - See which video is downloading (3 of 25)
   - See individual video progress (67%)

---

## 📊 Statistics

### Code Added

| File | Lines Added | Purpose |
|------|-------------|---------|
| `main.cjs` | ~65 | Playlist check handler, progress parsing |
| `preload.cjs` | ~1 | checkPlaylist method |
| `PlaylistInfo.jsx` | ~95 | New component |
| `DownloadProgress.jsx` | ~15 | Playlist progress display |
| `App.jsx` | ~15 | Playlist state management |
| `electron.d.ts` | ~15 | TypeScript types |
| **Total** | **~206** | Lines of new code |

---

## 🔮 Future Enhancements

1. **Playlist Range Selection**: Download videos 5-10 from playlist
2. **Exclude Videos**: Deselect specific videos
3. **Playlist Metadata**: Show total playlist duration, uploader
4. **Resume Playlist**: Continue from interrupted download
5. **Playlist Ordering**: Download in reverse or shuffle
6. **Smart Playlist**: Skip already downloaded videos

---

## 🎓 How It Works

### Step-by-Step

1. **User pastes playlist URL**
2. **App calls `checkPlaylist(url)`**
3. **Main process spawns**: `yt-dlp --flat-playlist --dump-single-json URL`
4. **yt-dlp returns JSON** with playlist info
5. **Main process parses** and extracts:
   - Playlist title
   - Video count
   - First 10 video entries
6. **Returns to renderer** via IPC
7. **Renderer displays** PlaylistInfo component
8. **User enables playlist download**
9. **User starts download**
10. **Main process spawns** without `--no-playlist` flag
11. **yt-dlp downloads** all videos sequentially
12. **For each video**:
    - yt-dlp outputs: `[download] Downloading item X of Y`
    - Main process parses and extracts `playlistIndex` and `playlistTotal`
    - Sends to renderer via progress event
    - Renderer updates UI with playlist progress
13. **Download completes** when all videos done

---

## ✅ Success Criteria

✅ **Playlist Detection**: Automatically detects YouTube playlists  
✅ **Playlist Info**: Shows title, count, and video preview  
✅ **Toggle Control**: User can enable/disable playlist download  
✅ **Progress Tracking**: Shows current video number and total  
✅ **Visual Indicators**: Purple theme for playlist elements  
✅ **Smart Defaults**: Auto-enables playlist download for playlists  
✅ **Backward Compatible**: Single videos work as before  

---

**Playlist support is now fully implemented! 🎉**

Test with any YouTube playlist URL to see it in action.
