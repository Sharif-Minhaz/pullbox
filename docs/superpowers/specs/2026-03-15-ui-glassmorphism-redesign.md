# UI Redesign — Soft Glassmorphism

**Date:** 2026-03-15
**Scope:** Styling-only upgrade. Zero functional changes.

---

## Design Direction

**Theme:** Soft Glassmorphism — frosted glass cards on a soft indigo/violet gradient background with translucent layers, gentle shadows, and a premium airy feel.

**Color Palette:**
- Background: `linear-gradient(135deg, #e0e7ff, #ede9fe, #f0f4ff, #e0e7ff)` with decorative radial orbs
- Primary accent: Indigo `#6366f1` → Violet `#8b5cf6` gradient
- Text primary: `#1e1b4b` (dark indigo-black)
- Text secondary: `#94a3b8` (slate)
- Labels/accents: `#6366f1` (indigo), `#a5b4fc` (light indigo)
- Success: `#22c55e` → `#16a34a` gradient
- Error: `#ef4444` → `#dc2626` gradient

**Card Treatment (all cards):**
- `background: rgba(255,255,255,0.65)`
- `backdrop-filter: blur(16px)`
- `border: 1px solid rgba(255,255,255,0.8)`
- `border-radius: 20px`
- `box-shadow: 0 8px 32px rgba(99,102,241,0.08)`

---

## Components to Update

### 1. App.jsx (root layout)
- Background: gradient with decorative orbs (absolute positioned radial gradients)
- Container: `max-w-6xl` stays, remove old `bg-linear-to-br from-gray-50 to-gray-100`
- Error display: red-tinted glass card style

### 2. URLInput.jsx
- Brand header: gradient icon (indigo→violet rounded square) + gradient text
- Input: glass inner field with indigo border focus
- Button: `linear-gradient(135deg, #6366f1, #8b5cf6)` with glow shadow
- Supported sites text: `#a5b4fc` color, centered
- Wrap in glass card

### 3. FormatSelector.jsx
- Media info header: `linear-gradient(135deg, #6366f1, #7c3aed)` (replaces blue)
- Thumbnail: rounded with shadow
- Format cards: glass with indigo selection ring + subtle tint on selected
- Section icons: indigo/violet colors
- Audio section: violet accent instead of green
- Wrap in glass card

### 4. OutputPathSelector.jsx
- Label: indigo uppercase with letter spacing
- Input: glass inner field
- Browse button: ghost style with indigo border and text
- Parent card in App.jsx applies glass treatment

### 5. DownloadOptions.jsx
- Section label: indigo uppercase
- Option rows: glass inner cards with custom styled checkboxes (indigo rounded squares)
- Checked state: indigo fill with checkmark
- Unchecked state: light violet border
- Wrap in glass card

### 6. DownloadProgress.jsx
- Status icon: gradient circle (indigo for downloading, green for complete, red for error)
- Progress bar: indigo→violet gradient with glow shadow, rounded track
- Stats: mini glass cards for speed/ETA
- Completed: green-tinted glass card border
- Error: red-tinted glass card border
- Wrap in glass card

### 7. PlaylistInfo.jsx
- Keep purple gradient header (shift to match indigo/violet palette)
- Inner sections: frosted white/translucent panels
- Checkbox: match new custom style

### 8. index.css
- Add `@import "tailwindcss"` (already exists)
- Add custom glass utility classes via `@theme` or `@layer`
- Add decorative background orb styles

---

## Constraints

- **No functional changes** — all state, IPC, event handlers, props remain identical
- **No new dependencies** — only Tailwind CSS utility classes + inline where needed
- **Tabler Icons only** — no new icon libraries
- **Keep component file structure** — same files, same exports, same props
- Only update className strings and minimal structural HTML for styling wrappers
