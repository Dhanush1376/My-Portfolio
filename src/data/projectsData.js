export const PROJECTS_DATA = {
  siriarts: {
    id: "siriarts",
    accent: "#F2A93B", // colour field for its case-study page
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
    description: "Full-scale modern e-commerce storefront with high-performance product browsing and instant order checkout.",
    subtitle: "Full-scale modern e-commerce storefront with high-performance product browsing and instant order checkout.",
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
    overview: "Production storefront engineered for instant event photo browsing and direct 1-click WhatsApp bookings.",
    overviewHighlights: [
      "Sub-second visual galleries for wedding stage decor and custom crafts",
      "Direct 1-click WhatsApp inquiry funnel with pre-filled event templates",
      "Cloudinary CDN image pipeline optimized for fast mobile discovery"
    ],
    problem: "The client was losing potential bookings through disorganized social media messages, manual photo sharing, and having no centralized catalog for pricing and custom craft inquiries.",
    solution: "Engineered a fast, lightweight digital storefront featuring high-res Cloudinary CDN photo delivery, categorized galleries, and a one-click WhatsApp inquiry funnel with pre-filled event specifications.",
    // Short before -> after pairs shown on the case study (problem/solution above stay as the full story)
    challenge: [
      { problem: "Bookings lost in messy DMs", solution: "One-tap WhatsApp booking, details pre-filled" },
      { problem: "Photos sent by hand, one by one", solution: "Fast, categorised galleries on a CDN" },
      { problem: "No catalogue or prices to share", solution: "One catalogue for decor, gifts and pricing" },
    ],
    features: [
      "Visual showcase for wedding stage decor, pooja setups, and birthday events",
      "Handcrafted custom gift catalog with item specifications and pricing guidance",
      "Instant 1-click WhatsApp inquiry routing with automatic message templates",
      "Cloudinary CDN image pipeline ensuring sub-second visual load times on mobile",
      "SEO-optimized and PWA-ready for local discovery and bookmarking"
    ],
    scope: ["Client discovery", "UI/UX design", "React + Vite build", "Media CDN", "Domain launch"], // short role summary for the case study
    role: "Full-Stack Developer — Handled client discovery, UI/UX design, frontend development in React/Vite, media CDN pipeline, and live custom domain deployment.",
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
    accent: "#94CF4E", // colour field for its case-study page
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
    overview: "Full-stack food commerce ecosystem connecting customers with authentic South Indian staples and real-time order tracking.",
    overviewHighlights: [
      "Automated Razorpay checkout with instant tax invoicing and Brevo email delivery",
      "Live kitchen preparation and dispatch status via real-time WebSockets",
      "High-throughput TypeScript API with Redis caching and rate-limited security"
    ],
    problem: "The kitchen faced operational bottlenecks managing orders across phone calls and chat apps, calculating manual delivery zones, generating compliant tax invoices, and preventing stock overselling during peak morning breakfast rushes.",
    solution: "Developed a secure, hardened monorepo architecture with a gold-morphic React 19 storefront, TypeScript/Express API, MongoDB Atlas database, Razorpay payment gateway integration, Brevo automated transactional emailing, and real-time Socket.io kitchen updates.",
    // Short before -> after pairs shown on the case study (problem/solution above stay as the full story)
    challenge: [
      { problem: "Orders scattered across calls and chats", solution: "One storefront with secure Razorpay checkout" },
      { problem: "Tax invoices written by hand", solution: "PDF invoices emailed automatically" },
      { problem: "Stock oversold in the breakfast rush", solution: "Live kitchen and stock updates in real time" },
    ],
    features: [
      "Dynamic product catalog with freshness indicators, dietary tags, and spice level filters",
      "Frictionless Razorpay payment gateway integration with instant transaction reconciliation",
      "Automated PDF tax invoicing with automated email dispatch via Brevo API",
      "Real-time kitchen order tracking and admin dispatch dashboard via WebSockets",
      "Strict rate-limiting, JWT security hardening, and Redis caching for sub-second responses"
    ],
    scope: ["Brand identity", "React storefront", "TypeScript API", "Payment webhooks", "Production deploy"], // short role summary for the case study
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
    accent: "#EF7AA0", // colour field for its case-study page
    slug: "cakepoprush", // case-study URL: /work/cakepoprush
    num: "03",
    tag: "03 / E-COMMERCE STOREFRONT",
    service: "Artisan Dessert Storefront & Experience",
    category: "Dessert Storefront & E-Commerce",
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
    overview: "Artisanal confectionery storefront featuring playful mascot interactions, customizable gifting, and frictionless checkout.",
    overviewHighlights: [
      "Modular dessert catalog for gourmet cake pops, cookies, and party favors",
      "Interactive SVG mascot animations delivering delightful customer micro-moments",
      "Lightweight slide-out cart drawer with instant quantity calculations"
    ],
    problem: "Custom dessert bakers struggle to showcase diverse confectionery flavors, seasonal party packages, and customized gifting sets with standard cookie-cutter templates that lack brand personality.",
    solution: "Created a boutique frontend application featuring modular dessert cards, interactive SVG mascot micro-interactions, responsive cart flyout, tokenized typography system, and seamless client-side state orchestration.",
    // Short before -> after pairs shown on the case study (problem/solution above stay as the full story)
    challenge: [
      { problem: "Cookie-cutter templates with no personality", solution: "A boutique storefront with its own mascot" },
      { problem: "Flavours and party packs hard to browse", solution: "Modular dessert cards, easy to explore" },
      { problem: "Clunky ordering for custom gift sets", solution: "A smooth cart flyout that keeps the order" },
    ],
    features: [
      "Interactive product showcases for gourmet cake pops, brownies, cookies, and party favors",
      "Interactive SVG mascot animations providing playful customer delight throughout the browsing journey",
      "Lightweight slide-out cart drawer with instant quantity calculations and dietary notes",
      "Fully typed TypeScript architecture with modular Vanilla CSS token design system",
      "Optimized Single Page Application bundle with sub-second page loads and zero layout shift"
    ],
    scope: ["Component system", "Illustrations", "Mascot motion", "Cart state", "Vercel launch"], // short role summary for the case study
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
    accent: "#9D8CFF", // colour field for its case-study page
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
    overview: "Production RAG engine performing hybrid semantic search to eliminate LLM hallucinations on complex technical documents.",
    overviewHighlights: [
      "Dense vector embedding pipeline with ChromaDB similarity indexing",
      "Strict source attribution and citation footnotes for grounded answers",
      "Sub-200ms hybrid search response latency with production reliability"
    ],
    problem: "Vanilla generative models hallucinate and fail on proprietary domain knowledge or corporate documentation without verifiable source attribution.",
    solution: "Engineered a low-latency retrieval pipeline combining ChromaDB vector stores, dense embedding indexing, metadata filtering, and strict source citation prompting.",
    // Short before -> after pairs shown on the case study (problem/solution above stay as the full story)
    challenge: [
      { problem: "AI that makes up answers", solution: "Answers grounded in your own documents" },
      { problem: "No idea where an answer came from", solution: "Every answer cites its source" },
      { problem: "Generic models miss domain knowledge", solution: "Vector search over the private knowledge base" },
    ],
    features: [
      "Multi-format document ingestion pipeline (PDFs, Markdown, Web)",
      "Semantic chunking with contextual overlap preservation",
      "ChromaDB dense vector indexing and cosine similarity retrieval",
      "Grounded generation with inline citation footnotes and confidence scoring"
    ],
    scope: ["Vector embeddings", "Semantic search", "Chunking", "Prompt engineering"], // short role summary for the case study
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
