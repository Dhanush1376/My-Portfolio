import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Same beats and palette as the hero loop
const WORDS = [
  { text: 'Design', bg: '#9D8CFF' },
  { text: 'Build', bg: '#FF6058' },
  { text: 'Automate', bg: '#F2A93B' },
  { text: 'Launch', bg: '#5BB3E6' },
  { text: 'Grow', bg: '#94CF4E' },
];
const BRAND = 'Dhanush';
const SEEN_KEY = 'introSeen';

/**
 * Plays only on a visitor's very first visit (remembered in localStorage) on first load (index.html covers the page until this mounts).
 * Hero waits for the `intro:done` event before running its own entrance.
 */
export function shouldPlayIntro() {
  if (typeof window === 'undefined') return false;
  try {
    const isLocalhost = Boolean(
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.endsWith('.localhost')
    );
    if (new URLSearchParams(window.location.search).has('intro')) return true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (isLocalhost) return true;
    return !window.localStorage.getItem(SEEN_KEY);
  } catch (_) {
    return false;
  }
}

const Letters = ({ text, className }) =>
  text.split('').map((ch, i) => (
    <span key={i} className="intro-letter-mask">
      <span className={className}>{ch}</span>
    </span>
  ));

export default function IntroSequence() {
  const [active, setActive] = useState(() => {
    const play = shouldPlayIntro();
    // Set during render so Hero (rendered after this) already knows to hold its entrance
    window.__introPlaying = play;
    if (!play) document.documentElement.classList.remove('intro-pending');
    return play;
  });
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!active || !rootRef.current) return undefined;
    const root = rootRef.current;
    // Our own overlay is on screen now, so the pre-JS cover can go
    document.documentElement.classList.remove('intro-pending');
    document.documentElement.classList.add('intro-running');
    window.lenis?.stop?.();
    // Smooth scrolling may start up underneath (Home creates it on mount), so swallow scroll input
    const blockScroll = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    const blockOpts = { capture: true, passive: false };
    window.addEventListener('wheel', blockScroll, blockOpts);
    window.addEventListener('touchmove', blockScroll, blockOpts);

    let finished = false;
    // Set on cleanup (route change, or React StrictMode's dev double-mount) so a discarded run
    // can never start or end the intro
    let cancelled = false;
    const finish = () => {
      if (finished || cancelled) return;
      finished = true;
      try {
        const isLocal = Boolean(
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname.endsWith('.localhost')
        );
        if (!isLocal) {
          window.localStorage.setItem(SEEN_KEY, '1');
        }
      } catch (_) {}
      window.__introPlaying = false;
      document.documentElement.classList.remove('intro-running');
      window.removeEventListener('wheel', blockScroll, blockOpts);
      window.removeEventListener('touchmove', blockScroll, blockOpts);
      window.lenis?.start?.();
      window.dispatchEvent(new Event('intro:done'));
      setActive(false);
    };

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.intro-panel--word');
      const finalPanel = root.querySelector('.intro-panel--final');
      const dot = root.querySelector('.intro-dot');
      const brandDot = root.querySelector('.intro-brand-dot');
      const counter = root.querySelector('.intro-counter-value');
      const hud = root.querySelectorAll('.intro-hud > *');

      gsap.set([...panels, finalPanel], { yPercent: 100 });
      gsap.set(root.querySelectorAll('.intro-letter'), { yPercent: 115 });
      gsap.set(dot, { scale: 0 });
      gsap.set(brandDot, { scale: 0, y: -90 });
      gsap.set(hud, { opacity: 0, y: 10 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' }, onComplete: finish });

      // 1. The point
      tl.to(hud, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' }, 0)
        .to(dot, { scale: 1, duration: 0.55, ease: 'back.out(2.4)' }, 0.1)
        .to(dot, { scale: 0.82, duration: 0.14, ease: 'power2.inOut', yoyo: true, repeat: 1 }, 0.46);

      // 2. Colour fields slam up, one word each
      const STEP = 0.36;
      const start = 0.75;
      panels.forEach((panel, i) => {
        const at = start + i * STEP;
        tl.to(panel, { yPercent: 0, duration: 0.55, ease: 'expo.inOut' }, at)
          .to(panel.querySelectorAll('.intro-letter'), { yPercent: 0, duration: 0.5, stagger: 0.022 }, at + 0.2);
      });
      tl.to(dot, { scale: 0, duration: 0.3, ease: 'power3.in' }, start);

      // 3. The name, with the point dropping in as its full stop
      const brandAt = start + panels.length * STEP;
      // Slower than the words: the name gets its own moment
      tl.to(finalPanel, { yPercent: 0, duration: 0.9, ease: 'expo.inOut' }, brandAt)
        .to(finalPanel.querySelectorAll('.intro-letter'), { yPercent: 0, duration: 1.1, stagger: 0.08, ease: 'power4.out' }, brandAt + 0.35)
        .to(brandDot, { scale: 1, y: 0, duration: 0.8, ease: 'bounce.out' }, brandAt + 1.05);

      // Counter runs across the whole build-up
      const count = { v: 0 };
      tl.to(count, {
        v: 100,
        duration: brandAt + 1.5,
        ease: 'power1.inOut',
        onUpdate: () => { counter.textContent = String(Math.round(count.v)).padStart(3, '0'); },
      }, 0);

      // 4. The point floods the screen, then everything lifts to reveal the site
      const exitAt = brandAt + 2.3;
      const coverScale = () => {
        const r = brandDot.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const reach = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));
        return (reach * 2.1) / Math.max(r.width, 1);
      };
      tl.to(finalPanel.querySelectorAll('.intro-letter'), { yPercent: -115, duration: 0.7, stagger: 0.04, ease: 'expo.in' }, exitAt)
        .to(hud, { opacity: 0, duration: 0.3 }, exitAt)
        .to(brandDot, { scale: coverScale, duration: 0.7, ease: 'expo.in' }, exitAt + 0.1)
        .to(root, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: 'expo.inOut' }, exitAt + 0.75)
        .add(() => window.dispatchEvent(new Event('intro:reveal')), exitAt + 0.95);

      // Wait (briefly) for the display font so letters don't swap mid-animation
      const fontsReady = document.fonts?.ready ?? Promise.resolve();
      Promise.race([fontsReady, new Promise((r) => setTimeout(r, 700))]).then(() => {
        if (!cancelled) tl.play();
      });

      // Tap to hurry it along
      const hurry = () => tl.timeScale(3);
      root.addEventListener('pointerdown', hurry);
      return () => root.removeEventListener('pointerdown', hurry);
    }, root);

    // Never leave the visitor stuck behind the intro
    const failSafe = setTimeout(finish, 12000);

    return () => {
      cancelled = true;
      clearTimeout(failSafe);
      window.removeEventListener('wheel', blockScroll, blockOpts);
      window.removeEventListener('touchmove', blockScroll, blockOpts);
      ctx.revert();
    };
  }, [active]);

  if (!active) return null;

  return (
    <div ref={rootRef} className="intro-sequence" role="presentation" aria-hidden="true">
      <div className="intro-panel intro-panel--base">
        <span className="intro-dot" />
      </div>

      {WORDS.map((w) => (
        <div key={w.text} className="intro-panel intro-panel--word" style={{ background: w.bg }}>
          <p className="intro-word">
            <Letters text={w.text} className="intro-letter" />
            <span className="intro-letter-mask">
              <span className="intro-letter intro-word-stop">.</span>
            </span>
          </p>
        </div>
      ))}

      <div className="intro-panel intro-panel--final">
        <p className="intro-brand">
          <Letters text={BRAND} className="intro-letter" />
          <span className="intro-brand-dot" />
        </p>
      </div>

      <div className="intro-hud">
        <span className="intro-hud-tl">// DHANUSH.</span>
        <span className="intro-hud-tr">Portfolio — ©2026</span>
        <span className="intro-hud-bl">Every product starts with a point</span>
        <span className="intro-hud-br">
          <span className="intro-counter-value">000</span>
        </span>
      </div>
    </div>
  );
}
