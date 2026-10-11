// Single source for site-wide SEO facts. Used by the pages at runtime and by
// scripts/prerender.mjs at build time, so keep this file free of JSX and asset imports.

// The address the site is actually served from (dhanu.me redirects here)
export const SITE_URL = 'https://www.dhanu.me';
export const SITE_NAME = 'Dhanush';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const absoluteUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export const PERSON = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Dhanush',
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/assets/logo.png`,
  jobTitle: 'Software Engineer & AI Systems Builder',
  description:
    'Full-stack software engineer and AI systems builder creating production websites, e-commerce storefronts, RAG applications and automation for businesses.',
  knowsAbout: [
    'Full-Stack Web Development',
    'React',
    'E-commerce Development',
    'AI Automation',
    'Retrieval-Augmented Generation (RAG)',
    'UI/UX Design',
  ],
  address: { '@type': 'PostalAddress', addressRegion: 'Punjab', addressCountry: 'IN' },
  sameAs: ['https://github.com/Dhanush1376', 'https://linkedin.com/in/dhanush1376', 'https://x.com/Dhanush1376'],
};

export const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  description: 'Portfolio of Dhanush — Software Engineer & AI Systems Builder',
  publisher: { '@id': `${SITE_URL}/#person` },
  inLanguage: 'en',
};

export const breadcrumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

// Static pages: title/description shared by the page components and the prerendered HTML
export const PAGE_META = {
  home: {
    path: '/',
    title: 'Dhanush — Software Engineer & AI Systems Builder | Web, E-commerce & AI Projects',
    description:
      'Portfolio of Dhanush, a full-stack software engineer and AI systems builder. Live client projects including Siri Arts & Crafts, Akula’s Kitchen, CakePopRush and Tutorboard — websites, e-commerce and AI apps.',
  },
  about: {
    path: '/about',
    title: 'About Dhanush — Software Engineer & AI Systems Builder',
    description:
      'Learn about Dhanush, a software engineer and AI systems builder specializing in full-stack web applications, vector RAG pipelines, and intelligent automation systems.',
  },
  contact: {
    path: '/contact',
    title: 'Contact Dhanush — Start a Software or AI Project',
    description:
      'Get in touch with Dhanush to discuss custom full-stack web applications, vector RAG pipelines, AI automation, or freelance engineering collaboration.',
  },
  services: {
    path: '/services',
    title: 'Software & AI Development Services — Dhanush',
    description:
      'Explore software engineering and AI development services by Dhanush, including web applications, vector RAG pipelines, e-commerce storefronts, and automated workflows.',
  },
};

// Home page graph: who you are, the site, and the projects (each linked to its case study)
export const homeSchema = (projects) => ({
  '@context': 'https://schema.org',
  '@graph': [
    WEBSITE,
    PERSON,
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/#work`,
      name: 'Selected work by Dhanush',
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/work/${p.slug}`),
        name: p.title,
      })),
    },
  ],
});

// Project case-study pages live at /work/<slug>
export const projectPath = (project) => `/work/${project.slug}`;

export const projectMeta = (project) => ({
  path: projectPath(project),
  title: `${project.title} — ${project.service} | Case Study by Dhanush`,
  description: `${project.title}: ${project.subtitle} Built by Dhanush with ${project.tech.slice(0, 4).join(', ')}.`,
  image: absoluteUrl(project.img),
});

export const projectSchema = (project) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CreativeWork',
      '@id': `${absoluteUrl(projectPath(project))}#work`,
      name: project.title,
      headline: `${project.title} — ${project.service}`,
      description: project.overview,
      url: absoluteUrl(projectPath(project)),
      image: absoluteUrl(project.img),
      dateCreated: project.year,
      genre: project.category,
      keywords: [...project.tags, ...project.tech].join(', '),
      creator: { '@id': `${SITE_URL}/#person` },
      author: { '@id': `${SITE_URL}/#person` },
      ...(project.liveUrl && !project.liveUrl.includes('github.com') ? { sameAs: project.liveUrl } : {}),
    },
    breadcrumbs([
      { name: 'Home', path: '/' },
      { name: 'Work', path: '/#work' },
      { name: project.title, path: projectPath(project) },
    ]),
    PERSON,
  ],
});
