// Post-build SEO step (runs after `vite build`).
//
// The app is a single-page React app, so without this every URL would ship the home page's
// <title>, description, canonical and share tags until JavaScript runs. Crawlers that don't run JS
// and link previews (WhatsApp, LinkedIn, X, Slack) would see every page as the home page.
// This writes dist/<route>.html for each page with that page's own head tags and structured data
// (served at /<route> thanks to "cleanUrls" in vercel.json), and generates dist/sitemap.xml.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE_URL,
  DEFAULT_OG_IMAGE,
  PAGE_META,
  absoluteUrl,
  homeSchema,
  projectMeta,
  projectSchema,
  breadcrumbs,
  PERSON,
  WEBSITE,
} from '../src/data/site.js';
import { PROJECTS_DATA } from '../src/data/projectsData.js';
import { SERVICES_DATA } from '../src/data/servicesData.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const projects = Object.values(PROJECTS_DATA);
const today = new Date().toISOString().slice(0, 10);

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const graph = (...nodes) => ({ '@context': 'https://schema.org', '@graph': nodes });

const routes = [
  { ...PAGE_META.home, schema: homeSchema(projects), priority: '1.0', changefreq: 'weekly' },
  {
    ...PAGE_META.services,
    schema: graph(WEBSITE, PERSON, breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])),
    priority: '0.9',
    changefreq: 'monthly',
  },
  ...SERVICES_DATA.map((s) => ({
    path: `/services/${s.slug}`,
    title: `${s.title} — Dhanush`,
    description: s.subtitle || s.description,
    schema: graph(
      {
        '@type': 'Service',
        name: s.title,
        description: s.description,
        url: absoluteUrl(`/services/${s.slug}`),
        provider: { '@id': `${SITE_URL}/#person` },
      },
      PERSON,
      breadcrumbs([
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: s.title, path: `/services/${s.slug}` },
      ])
    ),
    priority: '0.8',
    changefreq: 'monthly',
  })),
  ...projects.map((p) => ({
    ...projectMeta(p),
    type: 'article',
    schema: projectSchema(p),
    priority: '0.9',
    changefreq: 'monthly',
    images: [absoluteUrl(p.img)],
  })),
  {
    ...PAGE_META.about,
    schema: graph(PERSON, breadcrumbs([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])),
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    ...PAGE_META.contact,
    schema: graph(PERSON, breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])),
    priority: '0.7',
    changefreq: 'yearly',
  },
];

function renderHead(html, r) {
  const url = absoluteUrl(r.path);
  const image = r.image || DEFAULT_OG_IMAGE;
  const set = (pattern, tag) => {
    if (!pattern.test(html)) throw new Error(`prerender: tag not found for ${pattern} (${r.path})`);
    html = html.replace(pattern, tag);
  };
  set(/<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`);
  set(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(r.description)}" />`);
  set(/<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${url}" />`);
  set(/<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${esc(r.title)}" />`);
  set(/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${esc(r.description)}" />`);
  set(/<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${url}" />`);
  set(/<meta\s+property="og:image"[\s\S]*?\/>/, `<meta property="og:image" content="${image}" />`);
  set(/<meta\s+property="og:type"[\s\S]*?\/>/, `<meta property="og:type" content="${r.type || 'website'}" />`);
  set(/<meta\s+name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${esc(r.title)}" />`);
  set(/<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${esc(r.description)}" />`);
  set(/<meta\s+name="twitter:image"[\s\S]*?\/>/, `<meta name="twitter:image" content="${image}" />`);
  // Same id the runtime SEO component updates, so the page never ends up with two copies
  set(
    /<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="seo-structured-data">${JSON.stringify(r.schema).replace(/</g, '\\u003c')}</script>`
  );
  return html;
}

for (const r of routes) {
  const file = r.path === '/' ? join(dist, 'index.html') : join(dist, `${r.path.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, renderHead(template, r));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routes
  .map(
    (r) => `  <url>
    <loc>${absoluteUrl(r.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>${(r.images || []).map((img) => `\n    <image:image><image:loc>${img}</image:loc></image:image>`).join('')}
  </url>`
  )
  .join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);

console.log(`prerender: wrote ${routes.length} pages + sitemap.xml for ${SITE_URL}`);
