import {
  siReact,
  siReactquery,
  siVite,
  siNextdotjs,
  siCloudinary,
  siWhatsapp,
  siPwa,
  siNodedotjs,
  siTypescript,
  siMongodb,
  siRazorpay,
  siSocketdotio,
  siBrevo,
  siFramer,
  siCss,
  siLucide,
  siPython,
  siLangchain,
  siFastapi,
  siDocker,
  siFlutter,
  siPostgresql,
  siTailwindcss,
  siStripe,
  siRedis,
  siSupabase,
  siGraphql,
  siFigma,
  siZapier,
  siGsap,
  siClaude,
  siAnthropic,
  siVercel,
  siExpress,
  siLighthouse,
  siChartdotjs,
} from 'simple-icons';

/**
 * Official brand marks (Simple Icons, CC0) for the tools named across projects and services.
 * Names are matched loosely ("React 19", "Razorpay API", "Next.js / Vite" ...); order matters.
 */
const BRANDS = [
  [(n) => n.includes('reactquery'), siReactquery],
  [(n) => n.includes('react'), siReact],
  [(n) => n.includes('next') && n.includes('vite'), siVite],
  [(n) => n.includes('next'), siNextdotjs],
  [(n) => n.includes('vite'), siVite],
  [(n) => n.includes('cloudinary'), siCloudinary],
  [(n) => n.includes('whatsapp'), siWhatsapp],
  [(n) => n.includes('pwa'), siPwa],
  [(n) => n.includes('node'), siNodedotjs],
  [(n) => n.includes('typescript'), siTypescript],
  [(n) => n.includes('mongo'), siMongodb],
  [(n) => n.includes('razorpay'), siRazorpay],
  [(n) => n.includes('socket'), siSocketdotio],
  [(n) => n.includes('brevo'), siBrevo],
  [(n) => n.includes('framer'), siFramer],
  [(n) => n.includes('tailwind'), siTailwindcss],
  [(n) => n.includes('css'), siCss],
  [(n) => n.includes('lucide'), siLucide],
  [(n) => n.includes('langchain'), siLangchain],
  [(n) => n.includes('fastapi'), siFastapi],
  [(n) => n.includes('python'), siPython],
  [(n) => n.includes('docker'), siDocker],
  [(n) => n.includes('flutter'), siFlutter],
  [(n) => n.includes('postgre'), siPostgresql],
  [(n) => n.includes('stripe'), siStripe],
  [(n) => n.includes('redis'), siRedis],
  [(n) => n.includes('supabase'), siSupabase],
  [(n) => n.includes('graphql'), siGraphql],
  [(n) => n.includes('figma'), siFigma],
  [(n) => n.includes('zapier'), siZapier],
  [(n) => n.includes('gsap') || n.includes('scrolltrigger'), siGsap],
  [(n) => n.includes('claude'), siClaude],
  [(n) => n.includes('anthropic'), siAnthropic],
  [(n) => n.includes('vercel'), siVercel],
  [(n) => n.includes('express'), siExpress],
  [(n) => n.includes('lighthouse'), siLighthouse],
  [(n) => n.includes('chartjs'), siChartdotjs],
];

const normalize = (name) => String(name).toLowerCase().replace(/[^a-z0-9]/g, '');

/** { title, path (24x24 viewBox), hex } for a tool name, or null when there is no official mark. */
export function getBrandIcon(name) {
  const n = normalize(name);
  const hit = BRANDS.find(([test]) => test(n));
  if (!hit) return null;
  const [, icon] = hit;
  return { title: icon.title, path: icon.path, hex: `#${icon.hex}` };
}

const luminance = (hex) => {
  const v = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Ink or white, whichever reads better on a field of `hex`. */
export const inkOn = (hex) => (luminance(hex) > 0.36 ? '#0E0F12' : '#FFFFFF');

/** The brand colour, lifted to white on dark pages when the brand itself is near-black. */
export const brandTint = (hex, isDark) => (isDark && luminance(hex) < 0.04 ? '#F5F5F7' : hex);

export const withAlpha = (hex, alpha) => {
  const v = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
