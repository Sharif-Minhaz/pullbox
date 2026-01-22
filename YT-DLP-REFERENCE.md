# yt-dlp CLI Reference for Pullbox

This document explains the yt-dlp command-line flags used in Pullbox and their purpose.

## Core Flags Used

### Format Selection

| Flag | Purpose | Example |
|------|---------|---------|
| `-f FORMAT` | Select specific format by ID | `-f 137` |
| `-f bestvideo+bestaudio` | Best video + audio combined | Default for video downloads |
| `-f bestaudio` | Best audio quality | Used for audio-only |
| `-x` | Extract audio only | Combined with `--audio-format` |
| `--audio-format mp3` | Convert audio to MP3 | Audio downloads |

### Output Options

| Flag | Purpose | Example |
|------|---------|---------|
| `-o TEMPLATE` | Output filename template | `-o "%(title)s.%(ext)s"` |
| `--progress` | Show progress bar | Always enabled |
| `--newline` | Print progress on new line | For parsing |

### Metadata & Extras

| Flag | Purpose | Example |
|------|---------|---------|
| `--embed-metadata` | Embed title, artist, etc. | Optional |
| `--embed-thumbnail` | Embed thumbnail image | Optional |
| `--write-subs` | Download subtitles | Optional |
| `--write-auto-subs` | Download auto-generated subs | Optional |
| `--sub-lang LANG` | Subtitle language | `--sub-lang en` |

### Playlist Handling

| Flag | Purpose | Example |
|------|---------|---------|
| `--no-playlist` | Download single video only | Default |
| (omit flag) | Download entire playlist | When enabled by user |

### Information Extraction

| Flag | Purpose | Example |
|------|---------|---------|
| `--dump-json` | Output metadata as JSON | For fetching formats |

---

## Output Template Variables

Used in `-o` flag:

| Variable | Description | Example |
|----------|-------------|---------|
| `%(title)s` | Video title | "Example Video" |
| `%(ext)s` | File extension | "mp4" |
| `%(id)s` | Video ID | "dQw4w9WgXcQ" |
| `%(uploader)s` | Channel/uploader name | "Example Channel" |
| `%(upload_date)s` | Upload date (YYYYMMDD) | "20240101" |
| `%(duration)s` | Duration in seconds | "300" |
| `%(resolution)s` | Resolution | "1920x1080" |

**Default template used**: `%(title)s.%(ext)s`

---

## Format Selection Examples

### Video Downloads

```bash
# Best quality (video + audio)
yt-dlp -f "bestvideo+bestaudio/best" URL

# Specific format ID
yt-dlp -f 137+140 URL

# Best MP4 (video + audio)
yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]" URL

# 1080p or lower
yt-dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" URL
```

### Audio Downloads

```bash
# Best audio as MP3
yt-dlp -f bestaudio -x --audio-format mp3 URL

# Best audio (no conversion)
yt-dlp -f bestaudio URL
```

---

## Progress Output Format

When using `--progress --newline`, yt-dlp outputs:

```
[download] Destination: Video Title.mp4
[download]   0.0% of 25.30MiB at 1.50MiB/s ETA 00:17
[download]  15.2% of 25.30MiB at 1.50MiB/s ETA 00:12
[download]  50.0% of 25.30MiB at 1.80MiB/s ETA 00:07
[download] 100% of 25.30MiB in 00:14
```

**Parsed fields**:
- **Percentage**: `15.2%`
- **Speed**: `1.50MiB/s`
- **ETA**: `00:12`
- **Filename**: `Video Title.mp4`

---

## JSON Output Format

When using `--dump-json`, yt-dlp returns:

```json
{
  "id": "dQw4w9WgXcQ",
  "title": "Example Video",
  "thumbnail": "https://...",
  "duration": 300,
  "formats": [
    {
      "format_id": "137",
      "ext": "mp4",
      "resolution": "1920x1080",
      "height": 1080,
      "width": 1920,
      "fps": 30,
      "vcodec": "avc1.640028",
      "acodec": "none",
      "filesize": 26542080
    },
    {
      "format_id": "140",
      "ext": "m4a",
      "resolution": "audio only",
      "acodec": "mp4a.40.2",
      "vcodec": "none",
      "filesize": 4718592
    }
  ]
}
```

---

## Error Codes

| Exit Code | Meaning |
|-----------|---------|
| 0 | Success |
| 1 | Generic error |
| 2 | Network error |
| 101 | Video not available |

---

## Common Use Cases in Pullbox

### 1. Fetch Formats
```bash
yt-dlp --dump-json --no-playlist "https://youtube.com/watch?v=..."
```

### 2. Download 1080p Video
```bash
yt-dlp -f 137+140 -o "/path/to/downloads/%(title)s.%(ext)s" "URL"
```

### 3. Download Audio as MP3
```bash
yt-dlp -f bestaudio -x --audio-format mp3 -o "/path/%(title)s.%(ext)s" "URL"
```

### 4. Download with Subtitles & Metadata
```bash
yt-dlp -f "bestvideo+bestaudio" \
  --embed-metadata \
  --embed-thumbnail \
  --write-subs \
  --write-auto-subs \
  --sub-lang en \
  -o "/path/%(title)s.%(ext)s" \
  "URL"
```

### 5. Download Playlist
```bash
yt-dlp -f "bestvideo+bestaudio" \
  -o "/path/%(title)s.%(ext)s" \
  "PLAYLIST_URL"
```

---

## Additional Resources

- **Official yt-dlp documentation**: https://github.com/yt-dlp/yt-dlp#readme
- **Supported sites**: https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md
- **Format selection**: https://github.com/yt-dlp/yt-dlp#format-selection

---

**Note**: Pullbox automatically constructs these commands based on your UI selections. You don't need to manually type these commands.
