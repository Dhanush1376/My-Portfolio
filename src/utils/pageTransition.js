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

let running = false;

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

  const text = document.createElement('span');
  text.className = 'page-transition-label';
  text.textContent = label;
  overlay.appendChild(text);
  document.body.appendChild(overlay);

  const radius = Math.ceil(Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)));

  try {
    await Promise.all([
      overlay.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: COVER_MS, easing: EASE, fill: 'forwards' }
      ).finished,
      text.animate(
        [
          { opacity: 0, transform: 'translateY(28px)' },
          { opacity: 0, transform: 'translateY(28px)', offset: 0.35 },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: COVER_MS, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
      ).finished,
    ]);

    onCovered?.();

    // Let the new page mount and paint underneath before lifting the colour
    await nextPaint();
    await delay(settleMs);

    await Promise.all([
      overlay.animate(
        { clipPath: ['inset(0 0 0 0)', 'inset(0 0 100% 0)'] },
        { duration: REVEAL_MS, easing: EASE, fill: 'forwards' }
      ).finished,
      text.animate(
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-48px)' },
        ],
        { duration: REVEAL_MS * 0.6, easing: EASE, fill: 'forwards' }
      ).finished,
    ]);
  } finally {
    overlay.remove();
    running = false;
  }
}
