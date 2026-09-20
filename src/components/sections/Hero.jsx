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
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [layout, setLayout] = useState(() => {
    const isClient = typeof window !== 'undefined';
    const w = isClient ? window.innerWidth : 1400;
    const h = isClient ? window.innerHeight : 750;
    const isMobile = w < 768;
    return {
      w,
      h,
      paddingLeft: isMobile ? 12 : 48,
      cardTop: isMobile ? 74 : 96,
      cardHeight: 600,
      cardWidth: isMobile ? w - 24 : 1300,
      W_left: isMobile ? 0 : 110,
    };
  });

  const isMobile = layout.w < 768;
  const currentVideoSrc = isMobile ? '/assets/mobile-hero.MP4' : '/assets/laptop-hero.MP4';
  const currentPosterSrc = isMobile ? '/assets/mobile-hero-poster.webp' : '/assets/laptop-hero-poster.webp';

  const liquidFillRef = useRef(null);
  const stageContentRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const videoRef = useRef(null);

  const setVideoElement = (el) => {
    videoRef.current = el;
    if (el) {
      el.defaultMuted = true;
      el.muted = true;
      el.playsInline = true;
      el.setAttribute('muted', '');
      el.setAttribute('playsinline', '');
      el.setAttribute('webkit-playsinline', '');
      el.setAttribute('x5-playsinline', '');
      el.setAttribute('autoplay', '');
    }
  };

  // Autoplay management: Guarantees instantaneous, uninterrupted looping playback without user touch
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isSubscribed = true;

    // Strict muted & playsinline attribute + property enforcement for cross-browser autoplay
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');
    video.setAttribute('autoplay', '');

    const startPlayback = () => {
      if (!video || !isSubscribed) return;
      video.muted = true;
      video.defaultMuted = true;

      // Avoid redundant play calls if already active
      if (!video.paused) {
        setIsVideoPlaying(true);
        try {
          video.playbackRate = 0.8;
        } catch (_) {}
        return;
      }

      const p = video.play();
      if (p !== undefined) {
        p.then(() => {
          if (isSubscribed) {
            setIsVideoPlaying(true);
            try {
              video.playbackRate = 0.8;
            } catch (_) {}
          }
        }).catch(() => {
          if (!isSubscribed) return;
          // Silent retry with re-asserted muted status for strict browser policies
          video.muted = true;
          video.defaultMuted = true;
          video.play().then(() => {
            if (isSubscribed) {
              setIsVideoPlaying(true);
              try {
                video.playbackRate = 0.8;
              } catch (_) {}
            }
          }).catch(() => {});
        });
      }
    };

    // Execute immediately on mount
    startPlayback();

    const handleReady = () => {
      startPlayback();
    };

    const handlePlaying = () => {
      if (isSubscribed) {
        setIsVideoPlaying(true);
        try {
          video.playbackRate = 0.8;
        } catch (_) {}
      }
    };

    // Seamless infinite looping safeguard
    const handleEnded = () => {
      if (video) {
        video.currentTime = 0;
        startPlayback();
      }
    };

    video.addEventListener('loadedmetadata', handleReady);
    video.addEventListener('loadeddata', handleReady);
    video.addEventListener('canplay', handleReady);
    video.addEventListener('canplaythrough', handleReady);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('timeupdate', handlePlaying);
    video.addEventListener('ended', handleEnded);

    // If device switched tabs or resumed from sleep
    const onVisibilityChange = () => {
      if (!document.hidden && video && video.paused) {
        startPlayback();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Discrete listener fallback in case ultra-aggressive OS battery savers pause background media
    const interactionEvents = ['touchstart', 'pointerdown', 'click', 'keydown', 'scroll'];
    const onInteraction = () => {
      if (video && video.paused) {
        startPlayback();
      }
    };
    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, onInteraction, { once: true, passive: true });
    });

    return () => {
      isSubscribed = false;
      video.removeEventListener('loadedmetadata', handleReady);
      video.removeEventListener('loadeddata', handleReady);
      video.removeEventListener('canplay', handleReady);
      video.removeEventListener('canplaythrough', handleReady);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('timeupdate', handlePlaying);
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, onInteraction);
      });
    };
  }, [currentVideoSrc]);

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

    // Set video container to resting position without motion
    gsap.set(liquidFillRef.current, { y: 0 });
    if (stageContentRef.current) {
      gsap.set(stageContentRef.current, { opacity: 0, y: 12 });
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

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

        {/* Stepped Media Canvas Container - Clipped precisely to cardPath across all devices */}
        <div
          className="hero-canvas-media-layer"
          style={{
            clipPath: cardPath ? `path("${cardPath}")` : undefined,
            WebkitClipPath: cardPath ? `path("${cardPath}")` : undefined,
            borderRadius: cardPath ? undefined : (isMobile ? '18px' : '28px'),
          }}
          aria-hidden="true"
        >
          <div
            ref={liquidFillRef}
            className="hero-media-inner"
          >
            {/* Instant visual poster: prevents any blank flashes or native play icons */}
            <img
              src={currentPosterSrc}
              alt="Hero interactive background preview"
              className={`hero-canvas-poster ${isVideoPlaying ? 'poster-faded' : ''}`}
              aria-hidden="true"
            />
            <video
              ref={setVideoElement}
              key={currentVideoSrc}
              src={currentVideoSrc}
              poster={currentPosterSrc}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              tabIndex={-1}
              webkit-playsinline="true"
              x5-playsinline="true"
              preload="auto"
              className={`hero-canvas-video ${isVideoPlaying ? 'video-playing' : ''}`}
              onPlaying={() => setIsVideoPlaying(true)}
              onTimeUpdate={() => {
                if (!isVideoPlaying) setIsVideoPlaying(true);
              }}
              aria-hidden="true"
            >
              <source src={currentVideoSrc} type="video/mp4" />
            </video>
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
