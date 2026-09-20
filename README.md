# Dhanush — Personal Developer & AI Systems Portfolio

A high-performance, editorial portfolio built with **React**, **Vite**, **GSAP**, and **Lenis**. Designed with an asymmetric aesthetic, kinetic text masking, smooth inertia scrolling, and fully modular data architecture.

---

## Features

- **Kinetic Typography & Staged Reveals**: Synchronized GSAP and ScrollTrigger animations with text-mask reveals, spring-physics badges, and dynamic view triggers.
- **Lenis Smooth Inertia**: Silky smooth scrolling experience synchronized with GSAP tickers across all pages.
- **Dedicated Service Architecture**:
  - `/services`: Interactive 3D stacked deck presentation with exposed tab navigation.
  - `/services/:slug`: Deep-dive 12-column editorial layouts with clear scope, expected outcomes, process breakdown, and interactive technology badges.
- **Dynamic Case Study System**: Modular project presentation featuring notched interactive cards, synchronized preview videos, tag filters, and modal deep-dives.
- **Multi-Step Contact Wizard**: Structured, validated client inquiry pipeline integrated with EmailJS.
- **Dual Theme Support**: Bespoke Light & Dark palettes utilizing CSS custom properties with balanced contrast and obsidian card styling.
- **Responsive & Accessible**: Fully optimized across mobile, tablet, and widescreen desktop breakpoints with fluid typography scales (`clamp`).
- **Instant Load**: Clean entry without blocking loaders, optimizing Time to Interactive (TTI) and First Contentful Paint (FCP).

---

## Tech Stack

### Core Framework & Tooling
- **React 18** — Component-driven declarative UI
- **Vite 5** — Next-generation frontend tooling and rapid HMR
- **React Router 7** — Client-side routing with dynamic parameters and scroll restoration

### Motion & Interactions
- **GSAP (GreenSock) & ScrollTrigger** — Timeline animations, scroll-bound kinetic reveals, and magnetic badge effects
- **Lenis** — Modern smooth scroll engine for fluid desktop and trackpad interactions
- **Framer Motion** — Complementary gesture and micro-interaction states

### Styling & UI
- **Vanilla CSS (Modern CSS3)** — High-performance custom properties (tokens), CSS Grid (12-column), Flexbox, and fluid typography
- **Lucide React** — Minimalist vector iconography
- **EmailJS** — Direct client-side message dispatching for contact inquiries

---

## Project Structure

```text
├── public/
│   ├── assets/            # Video demos, vector logos, and visual media
│   └── favicon.svg        # Site favicon
├── src/
│   ├── components/
│   │   ├── common/        # Shared UI (Navbar, CustomCursor, KineticStage, etc.)
│   │   ├── layout/        # Layout wrappers and Footer
│   │   └── sections/      # Modular page sections (Hero, NotchedProjectCard, etc.)
│   ├── data/              # Config-driven content files (projects, services, trust)
│   │   ├── projectsData.js    # Project registry and media references
│   │   ├── servicesData.js    # Service definitions, deliverables, and workflows
│   │   └── trustItemsData.js  # Ticker badges and trust indicators
│   ├── hooks/             # Custom React hooks (theme, device, scroll)
│   ├── pages/             # Route views
│   │   ├── Home.jsx             # Flagship landing page
│   │   ├── AboutPage.jsx        # Story, manifesto, and credentials
│   │   ├── ServicesPage.jsx     # Interactive service stack
│   │   ├── ServiceDetailPage.jsx# Dynamic service specification pages
│   │   └── ContactPage.jsx      # Multi-step inquiry workflow
│   ├── styles/            # Scoped stylesheets, design tokens, and media queries
│   ├── App.jsx            # Application root and route configuration
│   └── main.jsx           # Entry point and provider mount
├── index.html             # Document shell and font imports
└── package.json           # Dependencies and scripts
```

---

## Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **pnpm** / **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dhanush1376/My-Portfolio.git
   cd My-Portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## Available Scripts

- `npm run dev` — Starts Vite dev server with Hot Module Replacement (HMR).
- `npm run build` — Compiles production-optimized bundle into `dist/`.
- `npm run preview` — Locally previews the generated production build.

---

## Managing Content

All portfolio content is driven by clean, isolated configuration files in `src/data/`:

- **Projects**: Update or add projects in `src/data/projectsData.js` to automatically update cards, tags, and media without editing component code.
- **Services**: Define new capabilities, deliverables, and scopes in `src/data/servicesData.js`. Dynamic routes (`/services/:slug`) will automatically generate for any new entries.
- **Credentials & Badges**: Configure trust badges and tools in `src/data/trustItemsData.js`.

---

## License

This project is licensed under the [MIT License](LICENSE).
