import { useEffect } from 'react';

/**
 * Lightweight, zero-dependency SEO manager component.
 * Synchronously updates document title, canonical link, meta description,
 * Open Graph, Twitter cards, robots directive, and JSON-LD schema per route.
 */
export default function SEO({
  title,
  description,
  canonical,
  schema = null,
  image = 'https://dhanu.me/assets/logo.png',
  type = 'website',
  noindex = false,
}) {
  useEffect(() => {
    // 1. Document Title
    if (title) {
      document.title = title;
    }

    // Helper: update or insert a <meta> tag
    const setMetaTag = (attributeName, attributeValue, contentValue) => {
      if (!contentValue) return;
      let el = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attributeName, attributeValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentValue);
    };

    // Helper: update or insert a <link> tag
    const setLinkTag = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // 2. Meta Description
    if (description) {
      setMetaTag('name', 'description', description);
    }

    // 3. Canonical URL
    const canonicalUrl = canonical || 'https://dhanu.me/';
    setLinkTag('canonical', canonicalUrl);

    // 4. Robots Directives
    if (noindex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('name', 'robots', 'index, follow');
    }

    // 5. Open Graph Meta Tags
    setMetaTag('property', 'og:title', title || 'Dhanush');
    setMetaTag('property', 'og:description', description || '');
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:site_name', 'Dhanush');

    // 6. Twitter / X Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title || 'Dhanush');
    setMetaTag('name', 'twitter:description', description || '');
    setMetaTag('name', 'twitter:image', image);

    // 7. Structured Data (JSON-LD)
    let schemaScript = document.getElementById('seo-structured-data');
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'seo-structured-data';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [title, description, canonical, schema, image, type, noindex]);

  return null;
}
