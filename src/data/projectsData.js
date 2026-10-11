export const PROJECTS_DATA = {
  siriarts: {
    id: "siriarts",
    slug: "siri-arts-and-crafts", // case-study URL: /work/siri-arts-and-crafts
    num: "01",
    tag: "01 / FREELANCE CLIENT",
    service: "Production Website & Visual Storefront",
    category: "Event Decor & Custom Crafts",
    year: "2026",
    client: "Siri Arts & Crafts",
    tags: ["Freelance Client", "Event Decor", "Custom Gifts"],
    title: "Siri Arts & Crafts",
    logo: "/assets/siriarts_circle_logo.png",
    description: "Production client storefront featuring high-speed event visual galleries and direct 1-click WhatsApp customer bookings.",
    subtitle: "A production client website featuring high-speed event visual galleries and direct 1-click WhatsApp customer bookings.",
    img: "/assets/siriarts_poster.jpg",
    video: "/assets/siri_arts_demo.mp4",
    liveUrl: "https://siriartsandcrafts.com/",
    stage: {
      tone: "light",
      phrases: [
        { words: ["Event", "decor"], color: "#EA580C" },
        { words: ["Handmade", "gifts"], color: "#DB2777" },
        { words: ["Live", "client"], color: "#16A34A" },
        { words: ["Custom", "crafts"], color: "#2563EB" }
      ]
    },
    overview: "Designed and developed for Siri Arts & Crafts, a real-world business providing wedding stage decor, traditional pooja setups, floral arrangements, and personalized handmade gifts. Built to give customers an effortless photo-browsing experience while providing the owner with direct, qualified WhatsApp bookings.",
    problem: "The client was losing potential bookings through disorganized social media messages, manual photo sharing, and having no centralized catalog for pricing and custom craft inquiries.",
    solution: "Engineered a fast, lightweight digital storefront featuring high-res Cloudinary CDN photo delivery, categorized galleries, and a one-click WhatsApp inquiry funnel with pre-filled event specifications.",
    features: [
      "Visual showcase for wedding stage decor, pooja setups, and birthday events",
      "Handcrafted custom gift catalog with item specifications and pricing guidance",
      "Instant 1-click WhatsApp inquiry routing with automatic message templates",
      "Cloudinary CDN image pipeline ensuring sub-second visual load times on mobile",
      "SEO-optimized and PWA-ready for local discovery and bookmarking"
    ],
    role: "Full-Stack Freelance Developer — Handled client discovery, UI/UX design, frontend development in React/Vite, media CDN pipeline, and live custom domain deployment.",
    tech: ["React", "Vite", "Cloudinary CDN", "WhatsApp API", "PWA & SEO", "Responsive UX"],
    stats: [
      { label: "Load Time", val: "< 1.2s" },
      { label: "Deployment", val: "Production Live" }
    ],
    demoLink: "https://siriartsandcrafts.com/",
    repoLink: "https://siriartsandcrafts.com/"
  },
  akulas_kitchen: {
    id: "akulas_kitchen",
    slug: "akulas-kitchen", // case-study URL: /work/akulas-kitchen
    num: "02",
    tag: "02 / PRODUCTION CLIENT",
    service: "Food E-Commerce & Cloud Kitchen Portal",
    category: "Culinary E-Commerce & Cloud Kitchen",
    year: "2026",
    client: "Akula's Kitchen",
    tags: ["Production Client", "Food E-Commerce", "Full-Stack"],
    title: "Akula's Kitchen",
    logo: "/assets/akulas_kitchen_logo.png",
    description: "Enterprise-grade digital culinary platform and gourmet storefront with dynamic catalog management, automated invoicing, and live order tracking.",
    subtitle: "Full-stack gourmet food storefront and cloud kitchen portal with dynamic inventory, automated billing, and secure payment processing.",
    img: "/assets/akulas_kitchen_demo.jpg",
    video: "/assets/akulas_kitchen_video.mp4",
    liveUrl: "https://akulas.kitchen",
    stage: {
      tone: "light",
      phrases: [
        { words: ["Authentic", "flavors"], color: "#D97706" },
        { words: ["Cloud", "kitchen"], color: "#15803D" },
        { words: ["Instant", "orders"], color: "#DC2626" },
        { words: ["Live", "tracking"], color: "#2563EB" }
      ]
    },
    overview: "Architected and engineered for Akula's Kitchen, an authentic South Indian culinary brand and cloud kitchen serving stone-ground batters, organic condiments, traditional pickles, and Andhra snacks. Features an end-to-end e-commerce ecosystem connecting customers with zero-hassle online ordering, automated invoicing, and live preparation tracking.",
    problem: "The kitchen faced operational bottlenecks managing orders across phone calls and chat apps, calculating manual delivery zones, generating compliant tax invoices, and preventing stock overselling during peak morning breakfast rushes.",
    solution: "Developed a secure, hardened monorepo architecture with a gold-morphic React 19 storefront, TypeScript/Express API, MongoDB Atlas database, Razorpay payment gateway integration, Brevo automated transactional emailing, and real-time Socket.io kitchen updates.",
    features: [
      "Dynamic product catalog with freshness indicators, dietary tags, and spice level filters",
      "Frictionless Razorpay payment gateway integration with instant transaction reconciliation",
      "Automated PDF tax invoicing with automated email dispatch via Brevo API",
      "Real-time kitchen order tracking and admin dispatch dashboard via WebSockets",
      "Strict rate-limiting, JWT security hardening, and Redis caching for sub-second responses"
    ],
    role: "Lead Full-Stack Developer — Designed brand identity, engineered the React storefront with tokenized CSS, built the Express/TypeScript backend API, integrated payment webhooks, and deployed on production domains.",
    tech: ["React 19", "Node.js", "TypeScript", "MongoDB", "Razorpay API", "Socket.io", "Brevo API", "Cloudinary"],
    stats: [
      { label: "Architecture", val: "Full-Stack" },
      { label: "Deployment", val: "Production Live" }
    ],
    demoLink: "https://akulas.kitchen",
    repoLink: "https://github.com/Dhanush1376/Akula-s-Kitchen"
  },
  cakepoprush: {
    id: "cakepoprush",
    slug: "cakepoprush", // case-study URL: /work/cakepoprush
    num: "03",
    tag: "03 / E-COMMERCE STOREFRONT",
    service: "Artisan Dessert Storefront & Experience",
    category: "Gourmet Bakery & E-Commerce",
    year: "2026",
    client: "Cake Pop Rush",
    tags: ["E-Commerce", "React 19", "TypeScript"],
    title: "CakePopRush",
    logo: "/assets/cakepoprush_logo.png",
    description: "Vibrant artisanal dessert web application featuring interactive SVG mascot animations, token-based design system, and custom gift curation.",
    subtitle: "Artisan confectionery storefront engineered with React 19, TypeScript, and micro-interactions for handcrafted sweet treat orders.",
    img: "/assets/cakepoprush_demo.jpg",
    video: "/assets/cakepoprush_video.mp4",
    liveUrl: "https://cakepoprush.vercel.app",
    stage: {
      tone: "light",
      phrases: [
        { words: ["Artisan", "desserts"], color: "#DB2777" },
        { words: ["Cake", "pops"], color: "#F59E0B" },
        { words: ["Custom", "gifting"], color: "#8B5CF6" },
        { words: ["Instant", "checkout"], color: "#06B6D4" }
      ]
    },
    overview: "Designed and built for CakePopRush, an artisan confectionery and bespoke dessert brand crafting handcrafted cake pops, gourmet cookies, chocolate brownies, and customized event favors. Delivers a delightful, playful digital storefront with high aesthetic appeal and smooth purchasing flows.",
    problem: "Custom dessert bakers struggle to showcase diverse confectionery flavors, seasonal party packages, and customized gifting sets with standard cookie-cutter templates that lack brand personality.",
    solution: "Created a boutique frontend application featuring modular dessert cards, interactive SVG mascot micro-interactions, responsive cart flyout, tokenized typography system, and seamless client-side state orchestration.",
    features: [
      "Interactive product showcases for gourmet cake pops, brownies, cookies, and party favors",
      "Interactive SVG mascot animations providing playful customer delight throughout the browsing journey",
      "Lightweight slide-out cart drawer with instant quantity calculations and dietary notes",
      "Fully typed TypeScript architecture with modular Vanilla CSS token design system",
      "Optimized Single Page Application bundle with sub-second page loads and zero layout shift"
    ],
    role: "Frontend UI/UX Engineer — Built responsive component system, designed custom illustrations & mascot interactions, implemented cart state store, and deployed to Vercel.",
    tech: ["React 19", "TypeScript", "Vite", "Framer Motion", "Vanilla CSS Tokens", "Lucide Icons"],
    stats: [
      { label: "Performance", val: "99/100" },
      { label: "Deployment", val: "Vercel SPA" }
    ],
    demoLink: "https://cakepoprush.vercel.app",
    repoLink: "https://github.com/Dhanush1376/CakePopRush"
  },
  ragchatbot: {
    id: "ragchatbot",
    slug: "tutorboard", // case-study URL: /work/tutorboard
    num: "04",
    tag: "04 / INTELLIGENT SYSTEM",
    service: "AI / Retrieval-Augmented Generation",
    category: "AI & Vector Search",
    year: "2025",
    client: "RAG Retrieval Engine",
    tags: ["AI / RAG", "ChromaDB", "FastAPI"],
    title: "Tutorboard",
    logo: "/assets/tutorboard_circle_white_logo.png",
    description: "AI-powered learning platform transforming questions into interactive visual explanations and animated concept breakdowns.",
    subtitle: "AI-powered learning platform transforming questions into interactive visual explanations and animated concept breakdowns.",
    img: "/assets/tutorboard_demo.webp",
    video: "/assets/tutorboard_video.mp4",
    liveUrl: "https://github.com/Dhanush1376",
    stage: {
      tone: "dark",
      phrases: [
        { words: ["Context", "aware"], color: "#67E8F9" },
        { words: ["Vector", "search"], color: "#BEF264" },
        { words: ["Zero", "hallucination"], color: "#F9A8D4" },
        { words: ["Grounded", "answers"], color: "#FFFFFF" }
      ]
    },
    overview: "A production-grade Retrieval-Augmented Generation (RAG) platform that ingests unstructured technical documents, extracts contextual chunks, computes dense vector embeddings, and performs hybrid semantic search to eliminate LLM hallucinations.",
    problem: "Vanilla generative models hallucinate and fail on proprietary domain knowledge or corporate documentation without verifiable source attribution.",
    solution: "Engineered a low-latency retrieval pipeline combining ChromaDB vector stores, dense embedding indexing, metadata filtering, and strict source citation prompting.",
    features: [
      "Multi-format document ingestion pipeline (PDFs, Markdown, Web)",
      "Semantic chunking with contextual overlap preservation",
      "ChromaDB dense vector indexing and cosine similarity retrieval",
      "Grounded generation with inline citation footnotes and confidence scoring"
    ],
    role: "AI Systems Engineer — Implemented vector embedding pipelines, semantic similarity search, chunking heuristics, and prompt engineering with LangChain and FastAPI.",
    tech: ["Python", "LangChain", "ChromaDB", "FastAPI", "OpenAI API", "Docker"],
    stats: [
      { label: "Retrieval Precision", val: "94.8%" },
      { label: "Hallucination Rate", val: "< 2%" }
    ],
    demoLink: "#contact",
    repoLink: "https://github.com/Dhanush1376"
  }
};

export function getProjectBySlug(slug) {
  return Object.values(PROJECTS_DATA).find((p) => p.slug === slug) || null;
}
