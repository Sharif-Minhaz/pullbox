# Quick Start Guide

Get Pullbox running in 5 minutes.

## Step 1: Install Dependencies

```bash
npm install
```

This will:
- Install all Node.js packages
- Automatically download the yt-dlp binary for your platform

## Step 2: Verify yt-dlp Binary

Check if the binary was downloaded:

```bash
ls resources/bin/
```

You should see:
- **Windows**: `yt-dlp.exe`
- **macOS**: `yt-dlp-macos`
- **Linux**: `yt-dlp-linux`

If not found, run:

```bash
npm run download-ytdlp
```

### On macOS/Linux: Set Permissions

```bash
chmod +x resources/bin/yt-dlp-macos
# or
chmod +x resources/bin/yt-dlp-linux
```

## Step 3: Run the App

```bash
npm run dev-app
```

On macOS, use:

```bash
npm run dev-mac
```

## Step 4: Test the App

1. Paste a YouTube URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
2. Click "Fetch Formats"
3. Select a quality (1080p, 720p, or audio-only)
4. Choose an output folder
5. Click "Start Download"
6. Watch the progress bar!

---

## Troubleshooting

### "yt-dlp binary not found"

**Solution:**
```bash
npm run download-ytdlp
```

Then set permissions (macOS/Linux):
```bash
chmod +x resources/bin/yt-dlp-*
```

### "EACCES: permission denied"

**Solution (macOS/Linux):**
```bash
chmod +x resources/bin/yt-dlp-macos
```

### Downloads fail immediately

1. Check your internet connection
2. Verify the URL is valid
3. Try a different video
4. Check the console for error messages (View → Developer → Toggle Developer Tools)

---

## Building for Production

### Package the app:

```bash
npm run package
```

Output will be in `out/` folder.

### Create installer:

```bash
npm run make
```

---

## Supported Sites

- YouTube
- Facebook
- X.com (Twitter)
- Instagram
- TikTok
- Vimeo
- Reddit
- And thousands more!

---

## Need More Help?

- See [README.md](README.md) for full documentation
- See [SETUP.md](SETUP.md) for detailed setup guide
- See [IMPLEMENTATION.md](IMPLEMENTATION.md) for technical details

---

**Enjoy downloading! 🎉**
