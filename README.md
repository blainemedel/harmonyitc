# Harmony IT Consultancy (`harmonyitc.dev`)

Company website and client showcase for **Harmony IT Consultancy**, built with **Vue 3**, **Vite**, and **Vue Router 4** and deployed to **Vercel** via GitHub integration.

## Routes

| Path | View | Description |
| :--- | :--- | :--- |
| `/` | `HomeView` | Hero with interactive Pitch Focus Switcher, Harmony Ecosystem Hub, 4 Core Pillars, Comparison Matrix, and WebGL 3D Kinetic Cylinder |
| `/about` | `AboutView` | Philosophy & quote split card, Founding Team showcase (Paulo, Gene, Bry), and 4-step working process |
| `/projects` | `ProjectsView` | Filterable SwitchFiber portfolio (`Admin Console`, `Public & Subscriber Portal`, `Field Technician Terminal`) and accessible Case Study modal |
| `/contact` | `ContactView` | Interactive Quick Project Brief builder (clipboard copy + `mailto:` brief), direct email copy, and availability cards |

## Minimal Text Toggle

All copy, links, founder profiles, project case studies, and display flags live in `src/data/siteContent.js`.

- Set `DISPLAY_CONFIG.showExtendedCopy` to `false` (default) to keep the minimal layout with verbose descriptions and subleads hidden.
- Set `DISPLAY_CONFIG.showExtendedCopy` to `true` to display full explanatory paragraphs across all views.
- `DISPLAY_CONFIG.showHeaderCta` and `DISPLAY_CONFIG.showHomeMetrics` toggle the header CTA button and home impact strip.

## Project Structure

```text
harmonyitc/
├── index.html                  # Vite SPA entry point (SEO, Open Graph, favicons, fonts)
├── package.json                # Vue 3 + Vite scripts & dependencies
├── vite.config.js              # Vite configuration (@ alias -> src/)
├── vercel.json                 # Legacy .html -> clean route 301 redirects, SPA rewrite, headers
├── public/                     # Static root files (favicons, OG logo, robots.txt, sitemap.xml)
├── src/
│   ├── main.js                 # App mount + modular CSS imports
│   ├── App.vue                 # Root shell (scroll progress bar, backdrop, header, footer, toast)
│   ├── router/index.js         # History routes + per-route canonical/meta updates
│   ├── data/
│   │   ├── siteContent.js      # Single source of truth for text, team, projects, and toggles
│   │   └── mediaAssets.js      # Vite-bundled image imports
│   ├── utils/briefBuilder.js   # Pure brief formatting and project filtering utilities
│   ├── composables/            # Clipboard toast, scroll lock, scroll-reveal/parallax, 3D tilt
│   ├── components/             # AmbientBackdrop, SiteHeader, SiteFooter, HarmonyEcosystemHub, PillarArtwork, KineticCylinder, CaseStudyModal
│   ├── views/                  # HomeView, AboutView, ProjectsView, ContactView, NotFoundView
│   └── styles/                 # Modular CSS (tokens, base, components, pages, motion)
└── tests/siteLogic.test.js     # Node built-in unit tests for content config and brief/filter logic
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
- `vercel.json` redirects legacy `/about.html`, `/projects.html`, `/contact.html`, and `/index.html` URLs with HTTP `301` to their clean Vue Router paths and handles SPA history rewrites while keeping `/assets/*` and static files intact.

## Contact

- **Website:** [https://harmonyitc.dev](https://harmonyitc.dev)
- **Email:** `inquiries@harmonyitc.com`
