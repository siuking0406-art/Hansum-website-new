# HANSUM Website V3

Static HTML/CSS/JS website for GitHub Pages / Cloudflare Pages.

## Important
All website images are stored locally in `images/` so GitHub Pages does not depend on third-party image hotlinks.

### Files
- `index.html`
- `style.css`
- `script.js`
- `images/`

### GitHub Pages
Upload/replace these files in the `main` branch and keep Pages set to:
`Deploy from a branch` → `main` → `/ (root)`

### Cloudflare Pages
Connect the GitHub repository and use:
- Production branch: `main`
- Framework: None
- Build command: blank
- Output directory: `/`

## V4 changes
- No prices shown anywhere on the website.
- Original uploaded HANSUM photos are retained locally.
- Each location is clickable and opens Google Maps.
- Da Nang location links to the HANSUM Da Nang Google Maps listing.

## V5 changes
- Replaced the -86°C Coffee image with the latest uploaded HANSUM -86°C Coffee photo.
- Bowl showcase uses a clean product image without ordering UI text/buttons.
- No prices are displayed.
- Locations remain linked to Google Maps.

## V5 Gallery update
- Added 9 newly uploaded HANSUM photos to the local `images/` folder.
- Replaced the simple social image block with a full visual Gallery.
- Gallery photos are local assets and do not rely on external image hosting.

## V5 final update
- Cinematic split hero uses the new pink-smoke photo and the new shisha photo.
- Gallery is now a one-photo-at-a-time fading slideshow with arrows/dots.
- Added local -86°C coffee photo.
