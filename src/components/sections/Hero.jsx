import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import { useLoopingVideo } from '../../hooks/useLoopingVideo';
import { pathMaskStyle } from '../../utils/pathMask';

const De = (e) => Math.round(e * 100) / 100;
const St = (e, t, n, r) => `A ${De(e)} ${De(e)} 0 0 ${t} ${De(n)} ${De(r)}`;

function generateStudioCanvasPath(cardWidth, cardHeight, lines, r, s, W_left = 0) {
  if (!cardWidth || !cardHeight || !lines || !lines.length) return '';

  const o = lines[lines.length - 1].bottom;
  const u = [];

  if (W_left > 12) {
    // DESKTOP: Signature left pillar before text with rounded outer corners
    const safeR = Math.max(8, Math.min(r, Math.floor(W_left / 2)));
    u.push(`M 0 ${safeR}`);
    u.push(St(safeR, 1, safeR, 0));
    u.push(`H ${De(W_left - safeR)}`);
    u.push(St(safeR, 1, W_left, safeR));
    u.push(`V ${De(o - safeR)}`);
    u.push(St(safeR, 0, W_left + safeR, o));
  } else {
    // MOBILE: Top of Line 1 -> top-right -> bottom-right -> bottom-left -> up to shelf
    u.push(`M ${De(lines[0].right + r)} 0`);
    u.push(`H ${De(cardWidth - r)}`);
    u.push(St(r, 1, cardWidth, r));
    u.push(`V ${De(cardHeight - r)}`);
    u.push(St(r, 1, cardWidth - r, cardHeight));
    u.push(`H ${De(r)}`);
    u.push(St(r, 1, 0, cardHeight - r));
    u.push(`V ${De(o + r)}`);
    u.push(St(r, 1, r, o));
  }

  // Stepped notch along right side of lines (bottom to top)
  for (let d = lines.length - 1; d >= 0; d--) {
    const f = lines[d].right;
    const p = d === 0 ? 0 : lines[d - 1].bottom;
    if (d === lines.length - 1) {
      const g = Math.min(s, (lines[d].bottom - p) / 2);
      u.push(`H ${De(f - g)}`);
      u.push(St(g, 0, f, lines[d].bottom - g));
    }
    if (d === 0) {
      if (W_left > 12) {
        // Desktop: connect to top edge of right card, perimeter, and close
        u.push(`V ${De(r)}`);
        u.push(St(r, 1, lines[0].right + r, 0));
        u.push(`H ${De(cardWidth - r)}`);
        u.push(St(r, 1, cardWidth, r));
        u.push(`V ${De(cardHeight - r)}`);
        u.push(St(r, 1, cardWidth - r, cardHeight));
        u.push(`H ${De(r)}`);
        u.push(St(r, 1, 0, cardHeight - r));
        u.push(`V ${De(r)}`);
      } else {
        u.push(`V ${De(r)}`);
        u.push(St(r, 1, lines[0].right + r, 0));
      }
      break;
    }
    const x = lines[d - 1].right;
    const y = p - (d - 2 >= 0 ? lines[d - 2].bottom : 0);
    const b = lines[d].bottom - p;
    const m = Math.max(3, Math.min(s, Math.abs(x - f) / 2, y / 2, b / 2));
    if (x > f) {
      u.push(`V ${De(p + m)}`);
      u.push(St(m, 1, f + m, p));
      u.push(`H ${De(x - m)}`);
      u.push(St(m, 0, x, p - m));
    } else {
      u.push(`V ${De(p + m)}`);
      u.push(St(m, 0, f - m, p));
      u.push(`H ${De(x + m)}`);
      u.push(St(m, 1, x, p - m));
    }
  }

  u.push("Z");
  return u.join(" ");
}

// Card geometry for a hero of size w × h (shared by the first render and live measurement)
function getCardBox(w, h) {
  const safeW = Math.max(320, typeof w === 'number' && !isNaN(w) ? w : 320);
  const safeH = Math.max(420, typeof h === 'number' && !isNaN(h) ? h : 420);
  const isMobile = safeW < 768;
  const isTablet = safeW >= 768 && safeW < 1100;
  const paddingLeft = isMobile ? 12 : isTablet ? 24 : Math.max(36, Math.min(64, Math.round(safeW * 0.035)));
  const cardTop = isMobile ? 74 : Math.round(Math.max(84, Math.min(105, safeH * 0.11)));
  const bottomPadding = isMobile ? 16 : 28;
  const minCardH = isMobile ? 420 : 500;
  const cardHeight = Math.max(minCardH, Math.round(safeH - cardTop - bottomPadding));
  const cardWidth = Math.max(280, Math.round(safeW - paddingLeft * 2));
  const W_left = isMobile ? 0 : Math.round(Math.max(80, Math.min(130, cardWidth * 0.09)));
  return { paddingLeft, cardTop, cardHeight, cardWidth, W_left };
}

// Loops rendered from /hero-video, each composed for its card shape. Anchoring keeps the
// focal content (bottom-right on desktop, bottom on mobile) clear of the stepped headline notch.
const HERO_MEDIA = {
  landscape: { video: '/assets/hero/hero-desktop.mp4', poster: '/assets/hero/hero-desktop-poster.webp', position: '100% 100%' },
  portrait: { video: '/assets/hero/hero-mobile.mp4', poster: '/assets/hero/hero-mobile-poster.webp', position: '50% 100%' },
};

export default function Hero() {
  const heroRef = useRef(null);
  const wrapperRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const row3Ref = useRef(null);
  const btnRowRef = useRef(null);
  const controlsRef = useRef(null);
  const navigate = useNavigate();

  const [cardPath, setCardPath] = useState('');
  const [layout, setLayout] = useState(() => {
    const isClient = typeof window !== 'undefined';
    const w = isClient ? window.innerWidth : 1400;
    const h = isClient ? window.innerHeight : 750;
    return { w, h, ...getCardBox(w, h) };
  });
  // Reduced motion: keep the static poster (the loop's first frame) and skip the video entirely
  const [prefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  const isMobile = layout.w < 768;
  // Pick by the card's actual shape, so portrait tablets get the portrait composition too
  const heroMedia = layout.cardWidth / layout.cardHeight < 1 ? HERO_MEDIA.portrait : HERO_MEDIA.landscape;
  const currentVideoSrc = heroMedia.video;
  const currentPosterSrc = heroMedia.poster;

  const liquidFillRef = useRef(null);
  const stageContentRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const entranceTlRef = useRef(null);
  const videoRef = useRef(null);

  // Seamless loop with no tap needed; pauses while the hero is scrolled away to free the decoder
  // for the project videos. A new source (portrait <-> landscape) shows its poster until it plays.
  const isVideoPlaying = useLoopingVideo(videoRef, {
    src: currentVideoSrc,
    enabled: !prefersReducedMotion,
    inViewOnly: true,
    threshold: 0.01,
  });

  // Keep the entrance targets hidden from the very first paint (the entrance can only start once the
  // notch has been measured), so nothing flashes in place before animating in
  useLayoutEffect(() => {
    if (hasAnimatedRef.current) return undefined;
    const root = document.documentElement;
    root.classList.add('hero-entrance-pending');
    const failSafe = setTimeout(() => root.classList.remove('hero-entrance-pending'), 6000);
    return () => {
      clearTimeout(failSafe);
      root.classList.remove('hero-entrance-pending');
    };
  }, []);

  // Entrance Animation: Runs strictly ONCE on mount, never repeats on layout recalculations
  useEffect(() => {
    if (!liquidFillRef.current || !cardPath || layout.cardHeight <= 0) return;

    // If already animated once, ensure elements stay at full resting visibility and do not re-animate
    if (hasAnimatedRef.current) {
      // Re-measures (fonts loading, resize) can land while the entrance is waiting for the intro or
      // still playing; leave it alone until it has finished
      if (entranceTlRef.current && entranceTlRef.current.progress() < 1) return;
      gsap.set(liquidFillRef.current, { y: 0 });
      if (stageContentRef.current) {
        gsap.set(stageContentRef.current, { opacity: 1, y: 0 });
      }
      if (controlsRef.current) {
        const lines = controlsRef.current.querySelectorAll('.hero-line-inner');
        if (lines.length > 0) {
          gsap.set(lines, { clearProps: 'all' });
        }
      }
      return;
    }

    // Mark as animated immediately to lock it to a single execution
    hasAnimatedRef.current = true;

    // While the opening intro covers the page, hold the entrance until the intro starts lifting
    const holdForIntro = Boolean(window.__introPlaying);
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, paused: holdForIntro });
    entranceTlRef.current = tl;

    // Only inner/child elements move: the rows and button row themselves are measured to build
    // the card notch, so their boxes must never shift.
    const card = wrapperRef.current;
    const media = liquidFillRef.current;
    const lineInners = controlsRef.current ? controlsRef.current.querySelectorAll('.hero-line-inner') : [];
    const buttons = btnRowRef.current ? btnRowRef.current.children : [];
    // Navbar lives in its own component; pick up whatever of it is visible at this size
    const navItems = [
      ...document.querySelectorAll('#navbar .nav-brand, #navbar .nav-links-desktop li, #navbar .nav-actions > *'),
    ].filter((el) => el.offsetParent !== null);

    // Start states first (a tween that begins later in the timeline would otherwise leave its target
    // visible until the playhead reaches it), then drop the first-paint CSS cover
    if (navItems.length) gsap.set(navItems, { y: -22, opacity: 0, transition: 'none' });
    if (card) gsap.set(card, { y: 70, opacity: 0 });
    if (media) gsap.set(media, { scale: 1.12 });
    if (lineInners.length) gsap.set(lineInners, { yPercent: 130, rotate: 2.5 });
    if (buttons.length) gsap.set(buttons, { y: 24, opacity: 0 });
    if (stageContentRef.current) gsap.set(stageContentRef.current, { opacity: 0, y: 12 });
    document.documentElement.classList.remove('hero-entrance-pending');

    // 1. Navbar drops in
    if (navItems.length) {
      tl.to(
        navItems,
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, clearProps: 'transform,opacity,transition' },
        0
      );
    }

    // 2. The dark card rises into place while its video settles from a gentle zoom
    if (card) {
      tl.to(
        card,
        { y: 0, opacity: 1, duration: 1.25, clearProps: 'transform,opacity' },
        0.05
      );
    }
    if (media) {
      tl.to(media, { scale: 1, duration: 1.6, ease: 'expo.out', clearProps: 'transform' }, 0.05);
    }

    // 3. Headline lines roll up out of their own masks, one after another
    if (lineInners.length) {
      tl.to(
        lineInners,
        { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.11, clearProps: 'transform' },
        0.25
      );
    }

    // 4. Buttons follow
    if (buttons.length) {
      tl.to(
        buttons,
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' },
        0.6
      );
    }

    if (stageContentRef.current) {
      tl.to(stageContentRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.7);
    }

    if (holdForIntro) {
      const start = () => tl.play();
      window.addEventListener('intro:reveal', start, { once: true });
      window.addEventListener('intro:done', start, { once: true });
    }
  }, [layout.cardHeight, cardPath]);

  useEffect(() => {
    const updateDimensions = () => {
      if (!heroRef.current) return;
      const clientW = heroRef.current.clientWidth;
      const clientH = heroRef.current.clientHeight;
      const w = clientW > 100 ? clientW : (typeof window !== 'undefined' ? window.innerWidth : 1400);
      const h = clientH > 100 ? clientH : (typeof window !== 'undefined' ? window.innerHeight : 750);

      const isMobile = w < 768;
      const { paddingLeft, cardTop, cardHeight, cardWidth, W_left } = getCardBox(w, h);

      setLayout({
        w,
        h,
        paddingLeft,
        cardTop,
        cardHeight,
        cardWidth,
        W_left,
      });

      if (wrapperRef.current && row1Ref.current && row2Ref.current && row3Ref.current && btnRowRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        const y = {
          left: heroRect.left + paddingLeft,
          top: heroRect.top + cardTop
        };
        const wMeasure = (el) => {
          const B = el.getBoundingClientRect();
          return {
            right: Math.round(B.right - y.left),
            bottom: Math.round(B.bottom - y.top),
          };
        };

        const rawLines = [
          wMeasure(row1Ref.current),
          wMeasure(row2Ref.current),
          wMeasure(row3Ref.current),
          wMeasure(btnRowRef.current),
        ];

        const k = [...rawLines];
        for (let _ = k.length - 2; _ >= 0; _--) {
          k[_] = { ...k[_], right: Math.max(k[_].right, k[_ + 1].right) };
        }

        const g = Math.max(isMobile ? 14 : 18, Math.min(isMobile ? 18 : 32, Math.round(cardWidth * 0.026)));
        const M = cardWidth - g - 4;
        const j = [];

        for (const line of k) {
          const B = Math.min(line.right, M);
          const L = Math.min(line.bottom, cardHeight - g - 4);
          const prev = j[j.length - 1];
          if (prev && Math.abs(B - prev.right) < g * 1.3) {
            prev.right = Math.max(prev.right, B);
            prev.bottom = Math.max(prev.bottom, L);
            continue;
          }
          if (prev && L <= prev.bottom + 8) {
            prev.right = Math.max(prev.right, B);
            prev.bottom = Math.max(prev.bottom, L);
            continue;
          }
          j.push({ right: B, bottom: L });
        }

        if (!j.length) return;

        const path = generateStudioCanvasPath(cardWidth, cardHeight, j, g, g, W_left);
        setCardPath(path);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const ro = new ResizeObserver(updateDimensions);
    if (heroRef.current) ro.observe(heroRef.current);
    if (row1Ref.current) ro.observe(row1Ref.current);
    if (row2Ref.current) ro.observe(row2Ref.current);
    if (row3Ref.current) ro.observe(row3Ref.current);
    if (btnRowRef.current) ro.observe(btnRowRef.current);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        updateDimensions();
      });
    }

    const t1 = setTimeout(updateDimensions, 60);
    const t2 = setTimeout(updateDimensions, 250);
    const t3 = setTimeout(updateDimensions, 600);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleWorkClick = (e) => {
    e.preventDefault();
    if (window.navigateToSection) {
      window.navigateToSection('#work');
    } else {
      const target = document.querySelector('#work');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    navigate('/contact');
  };

  const { paddingLeft, cardTop, cardHeight, cardWidth, W_left } = layout;

  return (
    <section className="hero-section stack-section" id="hero" ref={heroRef}>
      {/* Orange Container Canvas: Dynamic stepped studio layout */}
      <div
        ref={wrapperRef}
        className="hero-orange-wrapper"
        style={{
          left: `${paddingLeft}px`,
          right: `${paddingLeft}px`,
          top: `${cardTop}px`,
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
        }}
      >
        {cardWidth > 0 && cardHeight > 0 && (
          <svg
            className="hero-orange-card-svg"
            viewBox={`0 0 ${cardWidth} ${cardHeight}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <filter id="heroOrangeGlow" x="-4%" y="-4%" width="108%" height="112%">
                <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="var(--hero-orange-glow, rgba(0, 0, 0, 0.25))" floodOpacity="0.35" />
              </filter>
              <clipPath id="heroCanvasClip">
                {cardPath ? <path d={cardPath} /> : null}
              </clipPath>
            </defs>
            
            {/* Base shadow layer cast by the path shape */}
            {cardPath && (
              <path
                d={cardPath}
                fill="none"
                filter="url(#heroOrangeGlow)"
              />
            )}

            {/* Base fallback fill in SVG */}
            <g clipPath={cardPath ? 'url(#heroCanvasClip)' : undefined}>
              <rect
                width={cardWidth}
                height={cardHeight}
                rx={cardPath ? 0 : (isMobile ? 18 : 28)}
                fill="var(--hero-canvas-bg, #0E0F12)"
              />
            </g>
          </svg>
        )}

        {/* Stepped Media Canvas Container - Clipped precisely to cardPath across all devices */}
        <div
          className="hero-canvas-media-layer"
          style={{
            // Masked rather than clip-pathed so Safari keeps repainting the video (see pathMask.js)
            ...pathMaskStyle(cardPath, cardWidth, cardHeight),
            borderRadius: cardPath ? undefined : (isMobile ? '18px' : '28px'),
          }}
          aria-hidden="true"
        >
          <div
            ref={liquidFillRef}
            className="hero-media-inner"
          >
            {/* Instant visual poster: sits on top of video until playing, completely masking any native play button */}
            <img
              src={currentPosterSrc}
              alt="Hero interactive background preview"
              className={`hero-canvas-poster ${isVideoPlaying ? 'poster-faded' : ''}`}
              style={{ objectPosition: heroMedia.position }}
              aria-hidden="true"
            />
            {!prefersReducedMotion && (
              <video
                ref={videoRef}
                src={currentVideoSrc}
                style={{ objectPosition: heroMedia.position }}
                loop
                muted
                playsInline
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
                tabIndex={-1}
                preload="auto"
                className={`hero-canvas-video ${isVideoPlaying ? 'video-playing' : ''}`}
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        {/* Stage Content */}
      </div>

      {/* Foreground Editorial Text Block */}
      <div
        ref={controlsRef}
        className="hero-controls-block hero-stepped-controls"
        style={{
          left: `${paddingLeft + (layout.w < 768 ? 0 : W_left + 16)}px`,
          top: `${cardTop + (layout.w < 768 ? 6 : 14)}px`,
        }}
      >
        <h1 className="hero-studio-title hero-title-large">
          <span ref={row1Ref} className="title-text-line hero-anim-line"><span className="hero-line-inner">One Stop Solution for</span></span>
          <span ref={row2Ref} className="title-text-line hero-anim-line"><span className="hero-line-inner">all creative needs</span></span>
          <span ref={row3Ref} className="title-text-line hero-anim-line"><span className="hero-line-inner">and goals</span></span>
        </h1>

        <div ref={btnRowRef} className="hero-btn-row">
          <a
            href="#work"
            className="hero-pill-primary"
            onClick={handleWorkClick}
            id="heroWorkBtn"
          >
            <span>View my work</span>
            <span className="btn-arrow-badge">
              <ArrowUpRight size={17} strokeWidth={2.2} />
            </span>
          </a>

          <a
            href="/contact"
            className="hero-link-secondary"
            onClick={handleContactClick}
            id="heroContactBtn"
          >
            <span>Start a project</span>
            <span className="link-arrow">
              <ArrowUpRight size={17} strokeWidth={2.2} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
