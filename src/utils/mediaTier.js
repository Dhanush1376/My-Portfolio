/**
 * How much video this visitor's connection and device can comfortably handle, decided once per load.
 *
 *  'full' - fast connection and a capable device: the original encodes
 *  'lite' - 3G-ish connection, or a low-memory / few-core device: the `-lite.mp4` encodes
 *           (30fps, lower resolution, roughly half the size and much cheaper to decode)
 *  'none' - Data Saver, 2G, or "reduce data" turned on: no video at all, the poster images stay
 *
 * Browsers that expose none of these hints (Safari, Firefox) get 'full' on large screens and
 * 'lite' on phones, where the smaller encode looks the same anyway.
 */
function computeTier() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return 'full';

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const reduceData = window.matchMedia?.('(prefers-reduced-data: reduce)').matches;
  const type = conn?.effectiveType || '';

  if (conn?.saveData || reduceData || type === 'slow-2g' || type === '2g') return 'none';

  const memory = navigator.deviceMemory; // GB, Chromium only
  const cores = navigator.hardwareConcurrency;
  const slowNetwork = type === '3g' || (typeof conn?.downlink === 'number' && conn.downlink > 0 && conn.downlink < 1.5);
  const weakDevice = (memory && memory <= 4) || (cores && cores <= 4);
  const phone = window.matchMedia?.('(max-width: 767px)').matches;

  if (slowNetwork || weakDevice || phone) return 'lite';
  return 'full';
}

export const MEDIA_TIER = computeTier();

/** The video file to use for this visitor, or null to show only the poster. */
export function videoFor(src) {
  if (!src) return null;
  if (MEDIA_TIER === 'none') return null;
  if (MEDIA_TIER === 'lite') return src.replace(/\.mp4$/, '-lite.mp4');
  return src;
}
