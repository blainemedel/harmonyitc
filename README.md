# Harmony IT Consultancy (`harmonyitc.dev`)

Company website and client showcase for **Harmony IT Consultancy**, built with **Vue 3**, **Vite**, **Vue Router 4**, and a **Vercel Function** inquiry endpoint, deployed to **Vercel** via GitHub integration.

## Routes

| Path | View | Description |
| :--- | :--- | :--- |
| `/` | `HomeView` | Hero with Pitch Focus Switcher + `HarmonyMotionStage` kinetic showcase, 4 Core Pillars, Comparison Matrix, and unified closing CTA |
| `/about` | `AboutView` | Founding Team showcase (Paulo, Gene, Bry), 4-step working process, and unified bottom CTA |
| `/projects` | `ProjectsView` | Platform-filtered SwitchFiber portfolio (`Web Portals`, `Admin Console`, `Mobile App`), deep-link support (`?case=<id>`), and Case Study modal with screenshot zoom + prefilled Contact CTA |
| `/contact` | `ContactView` | Unified 2-column Contact Hub with validated Inquiry Form (`/api/contact`), graceful email fallback, and Direct Info sidebar |

## Minimal Text Toggle

All copy, links, founder profiles, project case studies, and display flags live in [`src/data/siteContent.js`](src/data/siteContent.js).

- Set `DISPLAY_CONFIG.showExtendedCopy` to `false` (default) to keep the minimal layout with verbose descriptions, subleads, and long founder bios hidden.
- Set `DISPLAY_CONFIG.showExtendedCopy` to `true` to display full explanatory paragraphs across all views.
- `DISPLAY_CONFIG.showHeaderCta` and `DISPLAY_CONFIG.showHomeMetrics` toggle the header CTA button and home impact strip.

## Project Structure

```text
harmonyitc/
├── api/
│   └── contact.js              # Vercel Node Function (Resend email delivery + Custom Metrics)
├── index.html                  # Vite SPA entry point (SEO, Open Graph, favicons, Plus Jakarta Sans)
├── package.json                # Vue 3, Vue Router 4, @vercel/functions, Vite scripts
├── vite.config.js              # Vite configuration (@ alias -> src/)
├── vercel.json                 # Legacy .html -> clean route 301 redirects, SPA rewrite (excluding /api/), headers
├── public/                     # Static root files (favicons, OG logo, robots.txt, sitemap.xml)
├── src/
│   ├── main.js                 # App mount + modular CSS imports
│   ├── App.vue                 # Root shell (scroll progress bar, backdrop, header, route transition, footer, BackToTop, toast)
│   ├── router/index.js         # History routes + per-route canonical/meta updates
│   ├── data/
│   │   ├── siteContent.js      # Single source of truth for text, team, projects, and toggles
│   │   └── mediaAssets.js      # Vite-bundled image imports
│   ├── utils/
│   │   ├── briefBuilder.js     # Brief formatting, fallback mailto builder, and platform filtering
│   │   └── contactInquiry.js   # Form validation, HTML escaping, Resend payload builder, query parsing
│   ├── composables/            # Clipboard toast, scroll lock, scroll-reveal/parallax, 3D tilt
│   ├── components/             # AmbientBackdrop, SiteHeader, SiteFooter, HarmonyMotionStage, PillarArtwork, UnifiedCtaStrip, CaseStudyModal, BackToTop
│   ├── views/                  # HomeView, AboutView, ProjectsView, ContactView, NotFoundView
│   └── styles/                 # Modular CSS (tokens, base, components, pages, motion)
└── tests/siteLogic.test.js     # Node built-in unit tests for content config, inquiry validation, and filters
```

## Development

Requires **Node.js 20+** and **npm**.

```bash
# Install dependencies
npm install

# Start local Vite dev server
npm run dev

# Run unit tests
npm test

# Build production bundle to dist/
npm run build

# Preview production build locally
npm run preview
```

## Vercel Deployment (`https://harmonyitc.dev`)

- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables (for `/api/contact` email delivery via Resend):**
  - `RESEND_API_KEY` — Resend API key
  - `CONTACT_FROM_EMAIL` — Verified sender address on Resend (e.g. `HarmonyITC Website <noreply@harmonyitc.dev>`)
  - `CONTACT_TO_EMAIL` *(optional)* — Recipient address (defaults to `inquiries@harmonyitc.com`)
- If `RESEND_API_KEY` or `CONTACT_FROM_EMAIL` are not configured yet, the Contact form falls back cleanly to 1-click **Open Prefilled Email** and **Copy Brief**.
- `api/contact.js` emits low-cardinality Vercel Custom Metrics: `contact.submissions` and `contact.resend_duration_ms`.

## Contact

- **Website:** [https://harmonyitc.dev](https://harmonyitc.dev)
- **Email:** `inquiries@harmonyitc.com`
