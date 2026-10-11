/**
 * Colour-field page transition used by the mobile menu.
 *
 * A circle of `color` grows from (x, y) until it covers the screen, with `label` set in large type.
 * `onCovered` then runs (navigate / scroll) while nothing underneath is visible, and once the new
 * view has painted the colour wipes upward to reveal it. The overlay lives directly on <body>, so it
 * survives the route change unmounting the menu that started it.
 */
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';
const COVER_MS = 720;
const REVEAL_MS = 820;
const MORPH_MS = 950;

let running = false;
// True from the moment the new page mounts under the colour until the colour has landed on it.
// Pages read it to hold their own entrance (the hero panel is already in place) until `flood:landed`.
let arriving = false;

export const isFloodArriving = () => arriving;

// When the colour will finish landing. Arriving pages delay their own entrance by this much, so
// their headline animates onto the card the moment it is revealed.
let landAt = 0;
export const floodLandingDelay = () => (arriving ? Math.max(0, (landAt - performance.now()) / 1000) : 0);

const nextPaint = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function isPageTransitionRunning() {
  return running;
}

export async function playColorTransition({ color, label, x, y, onCovered, settleMs = 120 }) {
  if (running) return;
  running = true;

  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.style.background = color;

  const content = document.createElement('div');
  content.className = 'page-transition-content';

  const text = document.createElement('h2');
  text.className = 'page-transition-label';
  text.innerHTML = `${label}<span class="page-transition-dot">.</span>`;

  content.appendChild(text);
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  const radius = Math.ceil(Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)));

  try {
    await Promise.all([
      overlay.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: COVER_MS, easing: EASE, fill: 'forwards' }
      ).finished,
      content.animate(
        [
          { opacity: 0, transform: 'translateY(36px) scale(0.96)' },
          { opacity: 0, transform: 'translateY(36px) scale(0.96)', offset: 0.28 },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ],
        { duration: COVER_MS, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
      ).finished,
    ]);

    arriving = true;
    // ~2 frames for the new page to paint, the settle pause, then the morph
    landAt = performance.now() + 34 + settleMs + MORPH_MS;
    const fromPath = window.location.pathname;
    onCovered?.();

    // A new page starts at the top. Not for in-page jumps (e.g. Work -> #work on the home page)
    // or links to a #section, which scroll themselves.
    if (window.location.pathname !== fromPath && !window.location.hash) {
      window.scrollTo(0, 0);
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        window.lenis.scrollTo(0, { immediate: true });
      }
    }

    // Let the new page mount and paint underneath before lifting the colour
    await nextPaint();
    await delay(settleMs);

    // The colour lands on the new page's hero card (marked data-flood-target): it shrinks into that
    // card's exact box and corners, takes its exact colour, and is removed the instant it matches,
    // so the splash simply becomes the card. Pages without one get a wipe upward instead.
    const target = document.querySelector('[data-flood-target]');
    if (target) {
      const r = target.getBoundingClientRect();
      const cs = getComputedStyle(target);
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const box = [r.top, vw - r.right, vh - r.bottom, r.left].map((v) => `${Math.max(0, v)}px`).join(' ');
      const corners = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].join(' ');
      await Promise.all([
        overlay.animate(
          [
            { clipPath: 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)', backgroundColor: color },
            { clipPath: `inset(${box} round ${corners})`, backgroundColor: cs.backgroundColor },
          ],
          { duration: MORPH_MS, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', fill: 'forwards' }
        ).finished,
        content.animate(
          [
            { opacity: 1, transform: 'translateY(0) scale(1)' },
            { opacity: 0, transform: 'translateY(-28px) scale(0.92)' },
          ],
          { duration: MORPH_MS * 0.5, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }
        ).finished,
      ]);
    } else {
      await Promise.all([
        // A soft curtain: the colour lifts away with its bottom edge rounding as it rises
        overlay.animate(
          [
            { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)' },
            { clipPath: 'inset(0% 0% 38% 0% round 0px 0px 56px 56px)', offset: 0.45 },
            { clipPath: 'inset(0% 0% 100% 0% round 0px 0px 56px 56px)' },
          ],
          { duration: REVEAL_MS, easing: EASE, fill: 'forwards' }
        ).finished,
        content.animate(
          [
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(-48px)' },
          ],
          { duration: REVEAL_MS * 0.6, easing: EASE, fill: 'forwards' }
        ).finished,
      ]);
    }
  } finally {
    overlay.remove();
    running = false;
    if (arriving) {
      arriving = false;
      window.dispatchEvent(new Event('flood:landed'));
    }
  }
}

/**
 * Click handler helper: floods `color` from where the visitor tapped (or from `from`, or the
 * clicked element when activated by keyboard), shows `label`, then calls navigate(to) underneath.
 */
export function navigateWithColor(event, { to, color, label, navigate, from }) {
  event?.preventDefault?.();
  if (running) return;
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !color) {
    navigate(to);
    return;
  }
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  const pointer = event && (event.clientX || event.clientY);
  const origin = from || (!pointer && event?.currentTarget);
  if (origin?.getBoundingClientRect) {
    const r = origin.getBoundingClientRect();
    x = r.left + r.width / 2;
    y = r.top + r.height / 2;
  } else if (pointer) {
    x = event.clientX;
    y = event.clientY;
  }
  playColorTransition({ color, label, x, y, onCovered: () => navigate(to) });
}
