import React, { useEffect, useRef, useState } from 'react';

/**
 * AppShowcaseStage
 * Animated stage for mobile-app project cards: a rotating carousel of phone frames that cycles
 * through the real app screens, with a feature chip that follows the centre phone.
 * Fills the card edge to edge (phones bleed off the bottom) so there is no dead space.
 * Pauses while off screen and holds still for prefers-reduced-motion.
 */
// Centre-to-centre distance (in phone widths) for positions 0, 1, 2 and 3+ away from the centre
const SPREAD = [0, 0.85, 1.5, 2.6];

export default function AppShowcaseStage({
  projectId = 'app',
  screens = [],
  labels = {},
  logo = null,
  brand = '',
  intervalMs = 2600,
}) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const rootRef = useRef(null);
  const n = screens.length;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver((entries) => setInView(entries[entries.length - 1].isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || n < 2) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => setActive((a) => (a + 1) % n), intervalMs);
    return () => clearInterval(id);
  }, [inView, n, intervalMs]);

  if (n === 0) return null;

  const half = Math.floor(n / 2);
  const current = screens[active];
  const label = labels[current.caption] || current.caption;

  return (
    <div ref={rootRef} className={`app-showcase-root app-showcase-${projectId}`}>
      <div className="app-showcase-glow" aria-hidden="true" />

      {(logo || brand) && (
        <div className="app-showcase-brand">
          {logo && <img src={logo} alt="" className="app-showcase-brand-logo" />}
          <span>{brand}</span>
          <span className="app-showcase-brand-sep">•</span>
          <span className="app-showcase-brand-sub">iOS &amp; Android</span>
        </div>
      )}

      <div className="app-showcase-track">
        {screens.map((s, i) => {
          // Signed distance from the active screen on a circular track (-half..half)
          let offset = (i - active + n) % n;
          if (offset > half) offset -= n;
          const abs = Math.abs(offset);
          return (
            <div
              key={s.src}
              className={`app-showcase-phone ${offset === 0 ? 'is-center' : ''}`}
              style={{
                '--o': offset,
                '--abs': Math.min(abs, 3),
                // Horizontal step per position: neighbours overlap, and anything beyond the outer pair
                // waits just off the card edge, so the track reads as an endless conveyor
                '--x': SPREAD[Math.min(abs, SPREAD.length - 1)] * Math.sign(offset),
                zIndex: 10 - abs,
                opacity: abs > 2 ? 0 : abs === 2 ? 0.55 : 1,
              }}
              aria-hidden={offset !== 0}
            >
              <div className="app-showcase-bob" style={{ animationDelay: `${i * -0.7}s` }}>
                <div className="app-showcase-device">
                  <div className="app-showcase-screen">
                    <div className="app-showcase-statusbar" aria-hidden="true">
                      <span className="app-showcase-time">9:41</span>
                      <span className="app-showcase-island" />
                      <span className="app-showcase-icons">
                        <svg viewBox="0 0 16 12" fill="currentColor">
                          <rect x="0" y="8" width="2.5" height="4" rx="0.5" />
                          <rect x="4" y="5" width="2.5" height="7" rx="0.5" />
                          <rect x="8" y="2.5" width="2.5" height="9.5" rx="0.5" />
                          <rect x="12" y="0" width="2.5" height="12" rx="0.5" />
                        </svg>
                        <svg viewBox="0 0 16 12" fill="currentColor">
                          <path fillRule="evenodd" clipRule="evenodd" d="M8 11.2a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4zm-3.6-3.8a5.1 5.1 0 017.2 0 .8.8 0 101.14-1.12 6.7 6.7 0 00-9.48 0 .8.8 0 101.14 1.12zm-2.6-2.6a8.8 8.8 0 0112.4 0 .8.8 0 101.14-1.12 10.4 10.4 0 00-14.68 0 .8.8 0 101.14 1.12z" />
                        </svg>
                        <span className="app-showcase-battery"><i /></span>
                      </span>
                    </div>
                    <img
                      src={s.src}
                      width={s.w}
                      height={s.h}
                      alt={offset === 0 ? `${brand} app: ${s.caption}` : ''}
                      loading="lazy"
                      draggable="false"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="app-showcase-corner-shade" aria-hidden="true" />

      <div className="app-showcase-chip" key={active}>
        <span className="app-showcase-chip-dot" />
        {label}
        <span className="app-showcase-chip-count" aria-hidden="true">
          {String(active + 1).padStart(2, '0')}/{String(n).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
