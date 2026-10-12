import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, X, Smartphone, Monitor } from 'lucide-react';

const PLACEHOLDER_COUNT = { mobile: 7, desktop: 4 };
const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reads a screenshot's own shape into --ar so its frame is sized to it (phones are never cropped),
// and fades it in once it has loaded
const fitShot = (img) => {
  if (!img?.naturalWidth) return;
  img.parentElement.style.setProperty('--ar', (img.naturalWidth / img.naturalHeight).toFixed(4));
  img.classList.add('is-loaded');
};

/**
 * App-store style screenshot gallery for a case study.
 * Mobile: store artwork as-is + raw screens in a phone frame. Desktop: screens in a browser window.
 * Empty tabs show animated wireframe placeholders (with the file name to use, on localhost only).
 *
 * Motion: frames sweep in like a fast scroll and brake into place when the gallery enters; on tab
 * change the current row races off and the new one sweeps in from the other side. Frames also
 * swing in 3D with scroll velocity, tilt toward the cursor, and placeholders run "live" UI loops.
 */
export default function ScreenGallery({ project, screens, label, title }) {
  const tabs = useMemo(
    () => [
      { id: 'mobile', label: 'Mobile', icon: Smartphone, items: screens.mobile },
      { id: 'desktop', label: 'Desktop', icon: Monitor, items: screens.desktop },
    ],
    [screens]
  );
  const [active, setActive] = useState(() => (screens.mobile.length || !screens.desktop.length ? 'mobile' : 'desktop'));
  const [lightbox, setLightbox] = useState(null);
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const counterRef = useRef(null);
  const entered = useRef(false);
  const landOnRender = useRef(0);
  const landRun = useRef(0);
  const warmed = useRef(new Set());
  // Each tab's row height, and the height on screen when a switch swaps rows (see the layout effect)
  const tabHeights = useRef({});
  const heightFrom = useRef(0);
  const switching = useRef(false);
  const [edges, setEdges] = useState({ start: true, end: false });

  const tab = tabs.find((t) => t.id === active);
  // Live site: real screenshots only (placeholders just when a tab has none). On localhost, empty
  // slots are added after the real ones so it is clear where the next screenshots go.
  const placeholderFrom = (start, count) =>
    Array.from({ length: Math.max(0, count) }, (_, i) => ({ placeholder: true, order: start + i }));
  const lastOrder = tab.items.reduce((m, it) => Math.max(m, it.order), 0);
  const items = !tab.items.length
    ? placeholderFrom(1, PLACEHOLDER_COUNT[active])
    : tab.items;
  const realItems = tab.items;

  /* ------------------------------------------------------------------ */
  /* Landing: the row sweeps in like a fast scroll and brakes into place  */
  /* ------------------------------------------------------------------ */
  // dir 1 = forward (frames arrive from the right), -1 = backward (from the left). Only transforms
  // and opacity move, and only on the frames that come to rest on screen.
  const land = useCallback((dir, entrance = false) => {
    const track = trackRef.current;
    if (!track) return;
    const els = [...track.querySelectorAll('.sg-item')];
    if (!els.length) return;
    gsap.killTweensOf(els);
    if (reduceMotion()) {
      gsap.set(els, { clearProps: 'transform,opacity' });
      return;
    }
    const vw = window.innerWidth;
    const onScreen = els.filter((el) => el.getBoundingClientRect().left < vw);
    gsap.set(els.filter((el) => !onScreen.includes(el)), { clearProps: 'transform,opacity' });

    // Leading frame first: the left one when arriving from the right, the right one otherwise.
    // Leaning into the direction of travel, like motion blur, and straightening as it brakes.
    const lead = dir > 0 ? onScreen : [...onScreen].reverse();
    gsap.set(lead, { x: dir * vw * (entrance ? 1 : 0.9), skewX: dir * 10, opacity: 0 });

    // Start once the screenshots that will be on screen are decoded (waiting no more than a
    // moment), so frames never arrive empty. Lazy images held off screen are loaded right away.
    const run = ++landRun.current;
    const imgs = onScreen.map((el) => el.querySelector('img')).filter(Boolean);
    imgs.forEach((img) => { img.loading = 'eager'; });
    Promise.race([
      Promise.all(imgs.map((img) => img.decode().catch(() => {}))),
      new Promise((resolve) => setTimeout(resolve, 450)),
    ]).then(() => {
      if (run !== landRun.current) return;
      gsap.to(lead, {
        x: 0,
        skewX: 0,
        opacity: 1,
        duration: entrance ? 1.3 : 1,
        ease: 'expo.out',
        stagger: entrance ? 0.08 : 0.06,
        clearProps: 'transform,opacity',
      });
    });
  }, []);

  // Fetch a tab's first screenshots as soon as the visitor reaches for it (hover / press / focus)
  const warm = (id) => {
    const t = tabs.find((x) => x.id === id);
    t?.items.slice(0, id === 'desktop' ? 3 : 6).forEach(({ src }) => {
      if (!src || warmed.current.has(src)) return;
      warmed.current.add(src);
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });
  };

  // First entrance when the gallery scrolls into view; also pause the "live" loops when off screen
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      root.classList.add('has-entered', 'is-live');
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        root.classList.toggle('is-live', entry.isIntersecting);
        if (entry.isIntersecting && !entered.current) {
          entered.current = true;
          root.classList.add('has-entered');
          land(1, true);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(root);
    return () => io.disconnect();
  }, [land]);

  // Tab change: the current row races off like a fast scroll (forward to Desktop, backward to
  // Mobile), then the new row sweeps in from the other side and brakes onto its first frame
  const switchTab = (id) => {
    if (id === active || switching.current) return;
    landRun.current++;
    const dir =tabs.findIndex((t) => t.id === id) > tabs.findIndex((t) => t.id === active) ? 1 : -1;
    const els = trackRef.current ? [...trackRef.current.querySelectorAll('.sg-item')] : [];
    const vw = window.innerWidth;
    const onScreen = els.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.right > 0 && r.left < vw;
    });
    if (reduceMotion() || !entered.current || !onScreen.length) {
      setActive(id);
      return;
    }
    switching.current = true;
    gsap.killTweensOf(els);
    gsap.set(els.filter((el) => !onScreen.includes(el)), { opacity: 0 });
    // A taller row (phones after desktop frames) gets its room while the old row leaves, so it is
    // never clipped and the content below glides instead of jumping
    const track = trackRef.current;
    const nextH = tabHeights.current[id];
    if (nextH && nextH > track.offsetHeight) gsap.to(track, { height: nextH, duration: 0.5, ease: 'power2.inOut' });
    // One distance for the whole row (just past the far edge), so it moves as one, like a scroll
    const rects = onScreen.map((el) => el.getBoundingClientRect());
    const distance = dir > 0 ? Math.max(...rects.map((r) => r.right)) + 40 : vw - Math.min(...rects.map((r) => r.left)) + 40;
    gsap.to(onScreen, {
      x: -dir * distance,
      skewX: dir * 10,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => {
        heightFrom.current = track.offsetHeight;
        landOnRender.current = dir;
        switching.current = false;
        setActive(id);
      },
    });
  };

  // Slide the tab pill under the active tab
  useLayoutEffect(() => {
    const root = rootRef.current;
    const thumb = root?.querySelector('.sg-tabs-thumb');
    const btn = root?.querySelector('.sg-tab.is-active');
    if (!thumb || !btn) return;
    thumb.style.width = `${btn.offsetWidth}px`;
    thumb.style.transform = `translateX(${btn.offsetLeft}px)`;
  }, [active]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (track) {
      track.scrollLeft = 0;
      // Record this row's natural height; after a switch, ease from the old height to it
      gsap.killTweensOf(track);
      track.style.height = '';
      const natural = track.offsetHeight;
      tabHeights.current[active] = natural;
      const from = heightFrom.current;
      heightFrom.current = 0;
      if (from && Math.abs(from - natural) > 2 && !reduceMotion()) {
        gsap.fromTo(track, { height: from }, { height: natural, duration: 0.8, ease: 'power3.inOut', clearProps: 'height' });
      }
    }
    if (landOnRender.current) {
      const dir = landOnRender.current;
      landOnRender.current = 0;
      land(dir);
    }
  }, [active, land]);

  /* ------------------------------------------------------------------ */
  /* Scroll: edges, progress, counter, and a velocity "swing"            */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    let last = track.scrollLeft;
    let swing = 0;
    let target = 0;
    let raf = null;
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768);
    const motion = !reduceMotion() && !isTouch;

    const paint = () => {
      const max = Math.max(1, track.scrollWidth - track.clientWidth);
      const p = Math.min(1, Math.max(0, track.scrollLeft / max));
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${Math.max(0.06, p)})`;
      const first = track.querySelector('.sg-item');
      if (first && counterRef.current) {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
        const count = track.querySelectorAll('.sg-item').length;
        const idx = Math.min(count, Math.round(track.scrollLeft / (first.offsetWidth + gap)) + 1);
        counterRef.current.textContent = String(idx).padStart(2, '0');
      }
      setEdges((prev) => {
        const next = { start: track.scrollLeft < 8, end: track.scrollLeft > max - 8 };
        return prev.start === next.start && prev.end === next.end ? prev : next;
      });
    };

    // Frames swing gently in 3D against the direction of travel on desktop trackpad/mouse
    const loop = () => {
      target *= 0.88;
      swing += (target - swing) * 0.15;
      track.style.setProperty('--sg-swing', `${swing.toFixed(2)}deg`);
      if (Math.abs(swing) > 0.04 || Math.abs(target) > 0.04) {
        raf = requestAnimationFrame(loop);
      } else {
        track.style.setProperty('--sg-swing', '0deg');
        raf = null;
      }
    };

    const onScroll = () => {
      const delta = track.scrollLeft - last;
      last = track.scrollLeft;
      paint();
      if (motion) {
        target = Math.max(-8, Math.min(8, target + delta * -0.12));
        if (!raf) raf = requestAnimationFrame(loop);
      }
    };

    paint();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', paint);
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', paint);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active]);

  const step = (dir) => {
    const el = trackRef.current;
    const first = el?.querySelector('.sg-item');
    if (!el || !first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 20;
    el.scrollBy({ left: dir * (first.getBoundingClientRect().width + gap), behavior: 'smooth' });
  };

  /* ------------------------------------------------------------------ */
  /* Mouse drag to scroll (touch already swipes natively)                */
  /* ------------------------------------------------------------------ */
  const drag = useRef(null);
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      trackRef.current.classList.add('is-dragging');
      trackRef.current.setPointerCapture?.(e.pointerId);
    }
    if (d.moved) trackRef.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    if (d?.moved) {
      trackRef.current.classList.remove('is-dragging');
      // Swallow the click that ends a drag so it doesn't open the viewer
      const swallow = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
      trackRef.current.addEventListener('click', swallow, { capture: true, once: true });
      setTimeout(() => trackRef.current?.removeEventListener('click', swallow, { capture: true }), 0);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Cursor tilt + glare (fine pointers only)                            */
  /* ------------------------------------------------------------------ */
  const onTiltMove = (e) => {
    if (e.pointerType !== 'mouse' || drag.current?.moved || reduceMotion()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${((0.5 - py) * 9).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((px - 0.5) * 12).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
  };
  const onTiltLeave = (e) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const hostname = (() => {
    try { return new URL(project.liveUrl).hostname.replace(/^www\./, ''); } catch (_) { return `${project.slug}.app`; }
  })();

  return (
    <div ref={rootRef} className="sg" style={{ '--pa': project.accent }}>
      <div className="sg-toolbar pcs-wrap">
        <div className="sg-heading-group">
          {label}
          {title}
        </div>
        <div className="sg-controls-group">
          <div className="sg-tabs" role="tablist" aria-label="Screenshot type">
            <span className={`sg-tabs-thumb sg-tabs-thumb--${active}`} aria-hidden="true" />
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active === t.id}
                  className={`sg-tab ${active === t.id ? 'is-active' : ''}`}
                  onClick={() => switchTab(t.id)}
                  onPointerEnter={() => warm(t.id)}
                  onPointerDown={() => warm(t.id)}
                  onFocus={() => warm(t.id)}
                  aria-label={t.label}
                  title={t.label}
                >
                  <Icon size={16} strokeWidth={2.4} className="sg-tab-icon" aria-hidden="true" />
                  <span className="sg-tab-label">{t.label}</span>
                </button>
              );
            })}
          </div>
          <div className="sg-nav">
            <button type="button" className="sg-nav-btn" onClick={() => step(-1)} disabled={edges.start} aria-label="Previous screenshots">
              <ArrowLeft size={18} strokeWidth={2.2} />
            </button>
            <button type="button" className="sg-nav-btn" onClick={() => step(1)} disabled={edges.end} aria-label="Next screenshots">
              <ArrowRight size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className={`sg-track sg-track--${active}`}
        role="tabpanel"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        {items.map((item, i) => {
          const num = String(item.order ?? i + 1).padStart(2, '0');
          const caption = item.placeholder ? `Screen ${num}` : item.caption || `Screen ${num}`;
          const open = item.placeholder ? undefined : () => setLightbox(realItems.indexOf(item));
          const media = item.placeholder ? (
            <Placeholder project={project} kind={active} num={num} variant={i} />
          ) : (
            <img
              ref={fitShot}
              src={item.src}
              alt={`${project.title} — ${caption}`}
              loading="lazy"
              decoding="async"
              draggable="false"
              onLoad={(e) => fitShot(e.currentTarget)}
            />
          );
          const kindClass = item.kind === 'store' ? 'store' : active;

          return (
            <figure key={item.src || `ph-${active}-${i}`} className={`sg-item sg-item--${kindClass}`} style={{ '--i': i }}>
              <div className="sg-tilt" onPointerMove={onTiltMove} onPointerLeave={onTiltLeave}>
                <button type="button" className="sg-frame-btn" onClick={open} disabled={!open} aria-label={open ? `View ${caption} full screen` : undefined}>
                  {active === 'desktop' ? (
                    <div className="sg-browser">
                      <div className="sg-browser-bar" aria-hidden="true">
                        <span className="sg-dots"><i /><i /><i /></span>
                        <span className="sg-url">{hostname}</span>
                      </div>
                      <div className="sg-browser-screen">{media}</div>
                      <span className="sg-glare" aria-hidden="true" />
                    </div>
                  ) : item.kind === 'store' ? (
                    <div className="sg-store">
                      {media}
                      <span className="sg-glare" aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="sg-phone">
                      <div className="sg-phone-topbar" aria-hidden="true">
                        <span className="sg-phone-time">9:41</span>
                        <span className="sg-island"><i /></span>
                        <div className="sg-phone-icons">
                          <svg className="sg-icon-signal" viewBox="0 0 16 12" fill="currentColor">
                            <rect x="0" y="8" width="2.5" height="4" rx="0.5" />
                            <rect x="4" y="5" width="2.5" height="7" rx="0.5" />
                            <rect x="8" y="2.5" width="2.5" height="9.5" rx="0.5" />
                            <rect x="12" y="0" width="2.5" height="12" rx="0.5" />
                          </svg>
                          <svg className="sg-icon-wifi" viewBox="0 0 16 12" fill="currentColor">
                            <path d="M8 9.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zm-3.5-3a5 5 0 017 0 .75.75 0 001.06-1.06 6.5 6.5 0 00-9.12 0 .75.75 0 101.06 1.06zm-2.5-3a8.5 8.5 0 0112 0 .75.75 0 001.06-1.06 10 10 0 00-14.12 0 .75.75 0 101.06 1.06z" />
                          </svg>
                          <div className="sg-icon-battery">
                            <span className="sg-battery-fill" />
                          </div>
                        </div>
                      </div>
                      <div className="sg-phone-screen">{media}</div>
                      <span className="sg-phone-home" aria-hidden="true"><i /></span>
                      <span className="sg-glare" aria-hidden="true" />
                    </div>
                  )}
                </button>
              </div>
              <figcaption className="sg-caption">
                <span className="sg-caption-num">{num}</span>
                {caption}
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="sg-foot pcs-wrap" aria-hidden="true">
        <span className="sg-progress"><span ref={progressRef} className="sg-progress-fill" /></span>
        <span className="sg-counter">
          <span ref={counterRef}>01</span> / {String(items.length).padStart(2, '0')}
        </span>
      </div>

      {lightbox !== null && realItems[lightbox] && (
        <Lightbox items={realItems} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} title={project.title} />
      )}
    </div>
  );
}

/* ====================================================================== */
/* Placeholders: wireframe "screens" that behave like a live interface    */
/* ====================================================================== */
const MOBILE_LAYOUTS = ['home', 'grid', 'detail', 'list', 'form'];
const DESKTOP_LAYOUTS = ['landing', 'dashboard', 'catalog'];

function Placeholder({ project, kind, num, variant }) {
  const prefix = kind === 'desktop' ? 'desktop' : 'mobile';
  const layouts = kind === 'desktop' ? DESKTOP_LAYOUTS : MOBILE_LAYOUTS;
  const layout = layouts[variant % layouts.length];
  const logo = project.logo ? <img src={project.logo} alt="" className="sg-ph-logo" /> : <i className="sg-ph-logo" />;

  return (
    <div className={`sg-ph sg-ph--${kind} sg-ph--${layout}`} aria-hidden="true">
      <div className="sg-ph-ui">{renderLayout(layout, logo)}</div>
    </div>
  );
}

const Repeat = ({ times, children }) => Array.from({ length: times }, (_, i) => children(i));

function renderLayout(layout, logo) {
  switch (layout) {
    case 'grid':
      return (
        <>
          <span className="sg-ph-bar" />
          <span className="sg-ph-pills"><i /><i /><i /></span>
          <div className="sg-ph-scroll-window">
            <div className="sg-ph-scroll">
              {[0, 1].map((copy) => (
                <div className="sg-ph-grid" key={copy}>
                  <Repeat times={6}>{(i) => <span className="sg-ph-card" key={i}><i /><b /></span>}</Repeat>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    case 'detail':
      return (
        <>
          <span className="sg-ph-media">{logo}</span>
          <span className="sg-ph-row" />
          <span className="sg-ph-row sg-ph-row--short" />
          <span className="sg-ph-chips"><i /><i /><i /></span>
          <span className="sg-ph-cta"><span className="sg-ph-tap" /></span>
        </>
      );
    case 'list':
      return (
        <>
          <span className="sg-ph-search" />
          <div className="sg-ph-scroll-window">
            <div className="sg-ph-scroll sg-ph-scroll--slow">
              {[0, 1].map((copy) => (
                <div className="sg-ph-list" key={copy}>
                  <Repeat times={6}>{(i) => <span className="sg-ph-li" key={i}><i /><b /><em /></span>}</Repeat>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    case 'form':
      return (
        <>
          <span className="sg-ph-row sg-ph-row--title" />
          <span className="sg-ph-field sg-ph-field--typing"><i className="sg-ph-caret" /></span>
          <span className="sg-ph-field" />
          <span className="sg-ph-field sg-ph-field--half" />
          <span className="sg-ph-toggle"><i /></span>
          <span className="sg-ph-cta"><span className="sg-ph-tap" /></span>
        </>
      );
    case 'landing':
      return (
        <>
          <span className="sg-ph-nav"><i />{logo}<b /><b /><b /><em /></span>
          <div className="sg-ph-split">
            <span className="sg-ph-copy"><i /><i /><i /><b /></span>
            <span className="sg-ph-media">{logo}</span>
          </div>
          <span className="sg-ph-tiles"><i /><i /><i /></span>
        </>
      );
    case 'dashboard':
      return (
        <div className="sg-ph-dash">
          <span className="sg-ph-side"><i /><i /><i /><i /><i /></span>
          <div className="sg-ph-dash-main">
            <span className="sg-ph-stats"><i /><i /><i /></span>
            <span className="sg-ph-chart">
              <Repeat times={9}>{(i) => <i key={i} style={{ '--b': i }} />}</Repeat>
            </span>
          </div>
        </div>
      );
    case 'catalog':
      return (
        <>
          <span className="sg-ph-nav"><i />{logo}<b /><b /><b /><em /></span>
          <span className="sg-ph-pills"><i /><i /><i /><i /></span>
          <div className="sg-ph-scroll-window">
            <div className="sg-ph-scroll sg-ph-scroll--slow">
              {[0, 1].map((copy) => (
                <div className="sg-ph-grid sg-ph-grid--wide" key={copy}>
                  <Repeat times={8}>{(i) => <span className="sg-ph-card" key={i}><i /><b /></span>}</Repeat>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    case 'home':
    default:
      return (
        <>
          <span className="sg-ph-bar" />
          <span className="sg-ph-hero">{logo}</span>
          <span className="sg-ph-row" />
          <span className="sg-ph-row sg-ph-row--short" />
          <span className="sg-ph-tiles"><i /><i /><i /></span>
        </>
      );
  }
}

/* ====================================================================== */
/* Full-screen viewer                                                      */
/* ====================================================================== */
function Lightbox({ items, index, onIndex, onClose, title }) {
  const item = items[index];
  const nextItem = items[(index + 1) % items.length];
  const prevItem = items[(index - 1 + items.length) % items.length];

  const isAnimatingRef = useRef(false);
  const [isInstant, setIsInstant] = useState(false);

  const go = useCallback((dir) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsSwiping(false);
    setIsInstant(false);

    // Animate stage left or right by the viewport width
    const targetOffset = dir > 0 ? -window.innerWidth : window.innerWidth;
    setDragOffset(targetOffset);

    setTimeout(() => {
      // Instantly reset offset without animation as index changes
      setIsInstant(true);
      onIndex((index + dir + items.length) % items.length);
      setDragOffset(0);
      requestAnimationFrame(() => {
        setIsInstant(false);
        isAnimatingRef.current = false;
      });
    }, 300);
  }, [index, items.length, onIndex]);

  // Touch and pointer swipe gesture state
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const activePointerId = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  // Reset dragOffset smoothly when active index updates
  useEffect(() => {
    setDragOffset(0);
    setIsSwiping(false);
  }, [index]);

  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    activePointerId.current = e.pointerId;
    touchStart.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    setIsSwiping(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isSwiping || activePointerId.current !== e.pointerId) return;
    const dx = e.clientX - touchStart.current.x;
    const dy = e.clientY - touchStart.current.y;

    if (Math.abs(dx) > Math.abs(dy) || Math.abs(dx) > 8) {
      setDragOffset(dx);
    }
  };

  const onPointerUp = (e) => {
    if (!isSwiping || activePointerId.current !== e.pointerId) return;
    activePointerId.current = null;
    setIsSwiping(false);

    const dx = e.clientX - touchStart.current.x;
    const dt = Date.now() - touchStart.current.time;
    const velocity = Math.abs(dx) / (dt || 1);

    if (dx < -60 || (dx < -30 && velocity > 0.35)) {
      go(1);
    } else if (dx > 60 || (dx > 30 && velocity > 0.35)) {
      go(-1);
    } else {
      setDragOffset(0);
    }
  };

  const onPointerCancel = () => {
    activePointerId.current = null;
    setIsSwiping(false);
    setDragOffset(0);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="sg-lightbox" role="dialog" aria-modal="true" aria-label={`${title} screenshots`} onClick={onClose}>
      <button type="button" className="sg-lightbox-close" onClick={onClose} aria-label="Close viewer">
        <X size={22} strokeWidth={2.4} />
      </button>

      <div
        className="sg-lightbox-stage"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <div
          className="sg-lightbox-slider"
          style={{
            transform: `translate3d(${dragOffset}px, 0, 0)`,
            transition: (isSwiping || isInstant) ? 'none' : 'transform 0.28s ease-out',
            cursor: isSwiping ? 'grabbing' : 'grab',
          }}
        >
          {/* Previous item sliding from left if swiping right */}
          {items.length > 1 && (
            <div className="sg-lightbox-slide sg-lightbox-slide--prev" aria-hidden="true">
              <figure className="sg-lightbox-figure">
                <div className="sg-lightbox-media-wrap">
                  <img src={prevItem.src} alt="" draggable="false" />
                </div>
                <figcaption className="sg-lightbox-caption">
                  <span className="sg-lightbox-counter">{String(((index - 1 + items.length) % items.length) + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
                  <span className="sg-lightbox-text">{prevItem.caption || `${title} Interface Screen`}</span>
                </figcaption>
              </figure>
            </div>
          )}

          {/* Active current item */}
          <div className="sg-lightbox-slide sg-lightbox-slide--current">
            <figure className="sg-lightbox-figure">
              <div className="sg-lightbox-media-wrap">
                <img key={item.src} src={item.src} alt={`${title} — ${item.caption || 'screenshot'}`} draggable="false" />
              </div>
              <figcaption className="sg-lightbox-caption">
                <span className="sg-lightbox-counter">{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
                <span className="sg-lightbox-text">{item.caption || `${title} Interface Screen`}</span>
              </figcaption>
            </figure>
          </div>

          {/* Next item sliding from right if swiping left */}
          {items.length > 1 && (
            <div className="sg-lightbox-slide sg-lightbox-slide--next" aria-hidden="true">
              <figure className="sg-lightbox-figure">
                <div className="sg-lightbox-media-wrap">
                  <img src={nextItem.src} alt="" draggable="false" />
                </div>
                <figcaption className="sg-lightbox-caption">
                  <span className="sg-lightbox-counter">{String(((index + 1) % items.length) + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
                  <span className="sg-lightbox-text">{nextItem.caption || `${title} Interface Screen`}</span>
                </figcaption>
              </figure>
            </div>
          )}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button type="button" className="sg-lightbox-nav sg-lightbox-nav--prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous screenshot">
            <ArrowLeft size={22} strokeWidth={2.4} />
          </button>
          <button type="button" className="sg-lightbox-nav sg-lightbox-nav--next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next screenshot">
            <ArrowRight size={22} strokeWidth={2.4} />
          </button>
        </>
      )}
    </div>,
    document.body
  );
}
