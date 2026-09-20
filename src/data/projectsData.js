export const PROJECTS_DATA = {
  siriarts: {
    id: "siriarts",
    num: "01",
    tag: "01 / FREELANCE CLIENT",
    service: "Production Website & Visual Storefront",
    category: "Event Decor & Custom Crafts",
    year: "2026",
    client: "Siri Arts & Crafts",
    tags: ["Freelance Client", "Event Decor", "Custom Gifts"],
    title: "Siri Arts & Crafts",
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
  ragchatbot: {
    id: "ragchatbot",
    num: "02",
    tag: "02 / INTELLIGENT SYSTEM",
    service: "AI / Retrieval-Augmented Generation",
    category: "AI & Vector Search",
    year: "2025",
    client: "RAG Retrieval Engine",
    tags: ["AI / RAG", "ChromaDB", "FastAPI"],
    title: "Tutorboard",
    subtitle: "Context-aware conversational intelligence system using dense vector embeddings, ChromaDB indexing, and zero-hallucination grounding.",
    img: "/assets/tutorboard_demo.webp",
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
