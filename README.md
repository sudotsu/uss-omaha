# USS Omaha SSN-692 Memorial

A modern, responsive memorial presentation honoring the service and legacy of USS Omaha (SSN-692).

## Tech Stack

- **Next.js 16.0.2** (App Router)
- **React 19.0.0**
- **TypeScript 5.9.4**
- **Tailwind CSS 4.1.0**
- **Node.js 24 LTS**

## Getting Started

### Preparation
- Node.js 24+ (see `.nvmrc`)
- npm

### Admin Tools (Local)
- **Image Renamer**: `http://localhost:3000/admin/renamer` (Rename extracted images)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the web experience.

View print layout at [http://localhost:3000/print](http://localhost:3000/print).

**Note on Missing Assets:** The app uses a graceful fallback system for missing images. If an image file doesn't exist, a placeholder will be shown automatically. This ensures `npm run dev` never crashes due to missing assets during development.

### Build

```bash
npm run build
npm start
```

### Generate PDF

```bash
npm run export:pdf
```

**Output:** `dist/USS_Omaha_Memorial.pdf`

**Note:** The export script automatically detects your package manager, builds the application, starts the server, generates the PDF, and stops the server. No manual server management required.

## Image Management

### Adding Images

1. Place original images in `public/images/_raw/`
2. Run the normalization script:

```bash
npm run normalize:images
```

3. Optimized images appear in `public/images/` with the same filenames

### How Image Normalization Works

- **Input:** Original images in `public/images/_raw/`
- **Output:** Optimized images in `public/images/`
- **Formats:** Processes `.jpg`, `.jpeg`, `.png`
- **Max Dimension:** 2400px (maintains aspect ratio)
- **JPEG Quality:** 82 (progressive)
- **PNG:** Compressed at level 9
- **Skip Logic:** If output is newer than input, skips processing
- **Preserves:** Original filenames (so `content.yml` paths don't change)

### Image Workflow

```
1. Drop originals → public/images/_raw/hero-sub.jpg
2. Run normalize  → npm run normalize:images
3. Use in site    → public/images/hero-sub.jpg (optimized)
4. Reference      → content.yml uses /images/hero-sub.jpg
```

SVG logos in `public/images/logos/` are used as-is (no processing needed).

### Missing Images During Development

The project includes a robust fallback system (`ImageWithFallback` component) that:
- Automatically displays a dignified placeholder (`/images/placeholder.svg`) if an image fails to load
- Prevents Next.js Image optimization errors from crashing dev server
- Maintains layout integrity with missing assets
- Shows "Image Pending" in navy/brass theme

This means you can run `npm run dev` even if image assets haven't been placed yet.

## Content Management

All editable content is in **`content.yml`**. This is the single source of truth for all text, dates, costs, contacts, section order, and image references.

### Updating Content

1. Open `content.yml`
2. Modify text/data as needed
3. Save file
4. Restart dev server or rebuild

### Swapping Images

1. Place new image in `public/images/_raw/`
2. Run `npm run normalize:images`
3. Image path in `content.yml` stays the same

### Content Modes

Switch between memorial and donor modes:

```yaml
metadata:
  mode: "memorial" # or "donor"
```

## Donation Forms

The pledge form is located at `public/forms/Pledge_Form_Blank_Final.pdf`.

Users can download it from the Call to Action section on both web and print versions.

## Design System

### Colors

- **Navy**: `#0B1D39`
- **Deep Slate**: `#111827`
- **Off-white**: `#F5F7FA`
- **Brass**: `#C9A227`
- **Brass Light**: `#E4C56A`
- **Neutral Light**: `#CBD5E1`

### Typography

- **Body Font**: Inter (via next/font)
- **Heading Font**: Merriweather (via next/font)

### Utility Classes

- `.section-navy` - Navy background with light text
- `.section-slate` - Deep slate background with light text
- `.section-light` - Off-white background with dark text
- `.text-onDark` - Text color for dark backgrounds
- `.text-onLight` - Text color for light backgrounds
- `.content-container` - Max-width container with responsive padding
- `.section-spacing` - Standard vertical section padding
- `.section-spacing-tight` - Reduced vertical section padding

## Project Structure

```
uss-omaha-memorial/
├── src/
│   ├── app/              # Next.js pages
│   │   ├── layout.tsx    # Root layout with fonts
│   │   ├── page.tsx      # Web landing page
│   │   ├── print/        # Print-optimized route
│   │   └── globals.css   # Global styles + print CSS
│   ├── components/
│   │   ├── sections/     # Page sections
│   │   └── ui/           # Reusable UI components
│   ├── lib/              # Utilities
│   │   └── content.ts    # YAML loader
│   └── types/            # TypeScript types
│       └── content.ts    # Content schema types
├── scripts/
│   ├── export-pdf.ts     # Automated PDF export
│   └── normalize-images.ts # Image optimization
├── public/
│   ├── images/
│   │   ├── _raw/         # Original images (place here)
│   │   ├── *.jpg         # Optimized outputs
│   │   ├── placeholder.svg # Fallback for missing images
│   │   └── logos/        # SVG logos (no processing)
│   └── forms/
│       └── Pledge_Form_Blank_Final.pdf
├── content.yml           # Single source of truth
├── package.json          # Pinned dependencies
├── .nvmrc                # Node version (24)
└── README.md
```

## Donation Information

The memorial accepts tax-deductible donations through:

**Primary:**
- United States Submarine Veterans Charitable Foundation (USSVCF)
- 501(c)(3) EIN 95-4830806
- [usscvf.org/donate](https://www.usscvf.org/donate.html)

**Alternate:**
- Omaha Parks Foundation
- 501(c)(3) EIN 27-3185565

Download the pledge form at `/forms/Pledge_Form_Blank_Final.pdf`.

## Contact

**USS Omaha Action Committee**
- Mark Thompson, USSVI Marlin Base CDR
- Website: [marlinbase.org](http://www.marlinbase.org)

**Volunteer Opportunities**
- Joe Higgins: (402) 515-5563
- Email: LeviCarterNeighborhood@gmail.com

---

**Honoring Service. Preserving Legacy.**