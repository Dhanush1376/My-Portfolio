import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';

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
  const [layout, setLayout] = useState({
    w: 1400,
    h: 750,
    paddingLeft: 48,
    cardTop: 96,
    cardHeight: 600,
    cardWidth: 1300,
    W_left: 110,
  });

  const liquidFillRef = useRef(null);
  const stageContentRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  // Entrance Animation: Runs strictly ONCE on mount, never repeats on layout recalculations
  useEffect(() => {
    if (!liquidFillRef.current || !cardPath || layout.cardHeight <= 0) return;

    // If already animated once, ensure elements stay at full resting visibility and do not re-animate
    if (hasAnimatedRef.current) {
      gsap.set(liquidFillRef.current, { y: 0 });
      if (stageContentRef.current) {
        gsap.set(stageContentRef.current, { opacity: 1, y: 0 });
      }
      if (controlsRef.current) {
        const lines = controlsRef.current.querySelectorAll('.hero-anim-line');
        if (lines.length > 0) {
          gsap.set(lines, { yPercent: 0, opacity: 1, filter: 'none', clearProps: 'all' });
        }
      }
      return;
    }

    // Mark as animated immediately to lock it to a single execution
    hasAnimatedRef.current = true;

    // Set initial states for the single coordinated entrance
    gsap.set(liquidFillRef.current, { y: Math.min(layout.cardHeight, 160) });
    if (stageContentRef.current) {
      gsap.set(stageContentRef.current, { opacity: 0, y: 12 });
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Single smooth card reveal
    tl.to(liquidFillRef.current, {
      y: 0,
      duration: 0.75,
      ease: 'power3.out',
    });

    // 2. Stage content spec pill
    if (stageContentRef.current) {
      tl.to(stageContentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.55,
      }, '-=0.55');
    }

    // 3. Clean, unified headline reveal without multiple separate staggered steps
    if (controlsRef.current) {
      const lines = controlsRef.current.querySelectorAll('.hero-anim-line');
      if (lines.length > 0) {
        tl.fromTo(
          lines,
          {
            yPercent: 35,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          },
          '-=0.65'
        );
      }
    }
  }, [layout.cardHeight, cardPath]);

  useEffect(() => {
    const updateDimensions = () => {
      if (!heroRef.current) return;
      const w = heroRef.current.clientWidth || window.innerWidth;
      const h = heroRef.current.clientHeight || window.innerHeight;

      const isMobile = w < 768;
      const isTablet = w >= 768 && w < 1100;

      const paddingLeft = isMobile ? 12 : isTablet ? 24 : Math.max(36, Math.min(64, Math.round(w * 0.035)));
      const cardTop = isMobile ? 74 : Math.round(Math.max(84, Math.min(105, h * 0.11)));
      const bottomPadding = isMobile ? 16 : 28;
      const minCardH = isMobile ? 420 : 500;
      const cardHeight = Math.max(minCardH, Math.round(h - cardTop - bottomPadding));
      const cardWidth = Math.round(w - paddingLeft * 2);

      const W_left = isMobile ? 0 : Math.round(Math.max(80, Math.min(130, cardWidth * 0.09)));

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
        {cardPath && (
          <svg
            className="hero-orange-card-svg"
            viewBox={`0 0 ${cardWidth} ${cardHeight}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="heroOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--hero-orange-1, #FF5520)" />
                <stop offset="100%" stopColor="var(--hero-orange-2, #FF3800)" />
              </linearGradient>
              <filter id="heroOrangeGlow" x="-4%" y="-4%" width="108%" height="112%">
                <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="var(--hero-orange-glow, rgba(255, 85, 32, 0.35))" floodOpacity="0.35" />
              </filter>
              {/* Grid pattern for architectural lines */}
              <pattern id="heroGridPattern" width="48" height="48" patternUnits="userSpaceOnUse">
                <line x1="48" y1="0" x2="48" y2="48" className="hero-grid-line" />
                <line x1="0" y1="48" x2="48" y2="48" className="hero-grid-line" />
              </pattern>
              <clipPath id="heroCanvasClip">
                <path d={cardPath} />
              </clipPath>
            </defs>
            
            {/* Base shadow layer cast by the path shape */}
            <path
              d={cardPath}
              fill="none"
              filter="url(#heroOrangeGlow)"
            />
            
            {/* Masked Liquid Fill Area */}
            <g clipPath="url(#heroCanvasClip)">
              <g ref={liquidFillRef}>
                <rect
                  width={cardWidth}
                  height={cardHeight}
                  fill="url(#heroOrangeGrad)"
                />
                {/* Grid overlay */}
                <rect
                  width={cardWidth}
                  height={cardHeight}
                  fill="url(#heroGridPattern)"
                />
              </g>
            </g>
          </svg>
        )}

        {/* Stage Content */}
        <div className="hero-orange-stage-content" ref={stageContentRef}>
          <div className="orange-stage-pill">
            <span className="orange-pulse-dot" aria-hidden="true">•</span>
            <span>FULL STACK &amp; AI // DHANUSH</span>
          </div>
          <div className="orange-stage-headline">
            ENGINEERED FOR SCALE,<br />BUILT FOR UTILITY.
          </div>
        </div>
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
          <span ref={row1Ref} className="title-text-line hero-anim-line">One stop solution for</span>
          <span ref={row2Ref} className="title-text-line hero-anim-line">all engineering needs</span>
          <span ref={row3Ref} className="title-text-line hero-anim-line">and AI systems</span>
        </h1>

        <div ref={btnRowRef} className="hero-btn-row">
          <a
            href="#work"
            className="hero-pill-primary"
            onClick={handleWorkClick}
            id="heroWorkBtn"
          >
            <span>View our work</span>
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
