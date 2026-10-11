/**
 * Project screenshots, picked up automatically from src/assets/projects/<project-slug>/.
 *
 * File names decide where each image goes:
 *   store-01-home.png       Play Store / App Store image (already designed, shown as-is)
 *   mobile-01-home.webp     raw phone screen (shown inside a phone frame)
 *   desktop-01-landing.webp raw desktop screen (shown inside a browser window)
 * The number sets the order; the words after it become the caption ("home" -> "Home").
 */
const files = import.meta.glob('/src/assets/projects/*/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const NAME = /^(store|mobile|desktop)-(\d+)(?:-(.+))?\.(png|jpe?g|webp|avif)$/i;

const toCaption = (words) => {
  if (!words) return '';
  const text = words.replace(/[-_]+/g, ' ').trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const bySlug = {};
for (const [path, url] of Object.entries(files)) {
  const parts = path.split('/');
  const slug = parts[parts.length - 2];
  const match = NAME.exec(parts[parts.length - 1]);
  if (!match) continue;
  const [, kind, order, words] = match;
  (bySlug[slug] ||= []).push({ kind: kind.toLowerCase(), order: Number(order), caption: toCaption(words), src: url });
}

export function getProjectScreens(slug) {
  const list = (bySlug[slug] || []).sort((a, b) => a.order - b.order);
  return {
    // Store artwork first, then raw phone screens
    mobile: [...list.filter((s) => s.kind === 'store'), ...list.filter((s) => s.kind === 'mobile')],
    desktop: list.filter((s) => s.kind === 'desktop'),
  };
}
