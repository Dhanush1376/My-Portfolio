import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TICKER_ROW_1, TICKER_ROW_2 } from '../../data/trustItemsData';

function FourPointStar({ className = "" }) {
  return (
    <svg 
      className={`ticker-star ${className}`} 
      width="36" 
      height="36" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      aria-hidden="true"
    >
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  );
}

export default function TrustStrip() {
  const stripRef = useRef(null);
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);
  const group1Ref = useRef(null);
  const group2Ref = useRef(null);

  useEffect(() => {
    const track1 = track1Ref.current;
    const track2 = track2Ref.current;
    const group1 = group1Ref.current;
    const group2 = group2Ref.current;
    const strip = stripRef.current;

    if (!track1 || !track2 || !group1 || !group2 || !strip) return;

    track1.classList.add('is-js-animated');
    track2.classList.add('is-js-animated');

    let groupWidth1 = group1.getBoundingClientRect().width;
    let groupWidth2 = group2.getBoundingClientRect().width;

    const updateWidths = () => {
      if (group1) {
        const w1 = group1.getBoundingClientRect().width;
        if (w1 > 50) groupWidth1 = w1;
      }
      if (group2) {
        const w2 = group2.getBoundingClientRect().width;
        if (w2 > 50) groupWidth2 = w2;
      }
    };

    window.addEventListener('resize', updateWidths);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateWidths);
    }

    // Motion State
    let xPos1 = 0;
    let xPos2 = 0;
    const baseSpeed = 1.35;
    let scrollVelocityBonus = 0;
    let targetVelocityBonus = 0;
    let currentSkew = 0;
    let targetSkew = 0;
    let isHovered = false;

    // Hover slowdown
    const onMouseEnter = () => { isHovered = true; };
    const onMouseLeave = () => { isHovered = false; };
    strip.addEventListener('mouseenter', onMouseEnter);
    strip.addEventListener('mouseleave', onMouseLeave);

    // Dynamic Scroll Speed Tracker
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY;
      const dy = currentScrollY - lastScrollY;
      const dt = Math.max(now - lastScrollTime, 8);
      
      // Calculate velocity (pixels per frame at 60fps)
      const instantVelocity = (dy / dt) * 16.67;
      
      // Dynamic responsiveness: scrolling speeds up or reverses the ticker based on direction & speed
      targetVelocityBonus = gsap.utils.clamp(-15, 20, instantVelocity * 0.45);
      targetSkew = gsap.utils.clamp(-4.5, 4.5, instantVelocity * -0.08);

      lastScrollY = currentScrollY;
      lastScrollTime = now;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // GSAP 60/120fps Render Loop
    const ticker = gsap.ticker.add((time, deltaTime) => {
      const dt = Math.min(deltaTime / 16.667, 2.5);
      
      // Speed multiplier when hovered
      const hoverMult = isHovered ? 0.35 : 1.0;

      // Smooth decay of scroll acceleration (spring back to base speed)
      scrollVelocityBonus += (targetVelocityBonus - scrollVelocityBonus) * (0.12 * dt);
      targetVelocityBonus *= Math.pow(0.91, dt);

      // Smooth decay of dynamic tilt/skew
      currentSkew += (targetSkew - currentSkew) * (0.14 * dt);
      targetSkew *= Math.pow(0.88, dt);

      // Total movement step
      const step = ((baseSpeed * hoverMult) + scrollVelocityBonus) * dt;

      // Track 1 moves Left
      xPos1 -= step;
      if (groupWidth1 > 20) {
        while (xPos1 <= -groupWidth1) xPos1 += groupWidth1;
        while (xPos1 > 0) xPos1 -= groupWidth1;
      }

      // Track 2 moves Right (counter-motion)
      xPos2 += step;
      if (groupWidth2 > 20) {
        while (xPos2 >= 0) xPos2 -= groupWidth2;
        while (xPos2 < -groupWidth2) xPos2 += groupWidth2;
      }

      track1.style.transform = `translate3d(${xPos1.toFixed(2)}px, 0, 0) skewX(${currentSkew.toFixed(2)}deg)`;
      track2.style.transform = `translate3d(${xPos2.toFixed(2)}px, 0, 0) skewX(${(-currentSkew).toFixed(2)}deg)`;
    });

    setTimeout(updateWidths, 350);

    return () => {
      window.removeEventListener('resize', updateWidths);
      window.removeEventListener('scroll', onScroll);
      strip.removeEventListener('mouseenter', onMouseEnter);
      strip.removeEventListener('mouseleave', onMouseLeave);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <section className="trust-strip stack-section" id="trustStrip" ref={stripRef} aria-label="Core Competencies & Engineering Rigor">
      <div className="trust-ticker-container">
        {/* Track 1: Moving Left with Accent Stars */}
        <div className="trust-ticker-viewport">
          <div className="trust-ticker-track" ref={track1Ref}>
            <div className="trust-ticker-group" ref={group1Ref}>
              {TICKER_ROW_1.map((text, idx) => (
                <span key={`r1-a-${idx}`} className="trust-ticker-item">
                  <span className="ticker-phrase-text">{text}</span>
                  <FourPointStar className="star-accent" />
                </span>
              ))}
            </div>
            <div className="trust-ticker-group" aria-hidden="true">
              {TICKER_ROW_1.map((text, idx) => (
                <span key={`r1-b-${idx}`} className="trust-ticker-item">
                  <span className="ticker-phrase-text">{text}</span>
                  <FourPointStar className="star-accent" />
                </span>
              ))}
            </div>
            <div className="trust-ticker-group" aria-hidden="true">
              {TICKER_ROW_1.map((text, idx) => (
                <span key={`r1-c-${idx}`} className="trust-ticker-item">
                  <span className="ticker-phrase-text">{text}</span>
                  <FourPointStar className="star-accent" />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Track 2: Moving Right with Electric Blue Stars */}
        <div className="trust-ticker-viewport">
          <div className="trust-ticker-track" ref={track2Ref}>
            <div className="trust-ticker-group" ref={group2Ref}>
              {TICKER_ROW_2.map((text, idx) => (
                <span key={`r2-a-${idx}`} className="trust-ticker-item">
                  <span className="ticker-phrase-text">{text}</span>
                  <FourPointStar className="star-blue" />
                </span>
              ))}
            </div>
            <div className="trust-ticker-group" aria-hidden="true">
              {TICKER_ROW_2.map((text, idx) => (
                <span key={`r2-b-${idx}`} className="trust-ticker-item">
                  <span className="ticker-phrase-text">{text}</span>
                  <FourPointStar className="star-blue" />
                </span>
              ))}
            </div>
            <div className="trust-ticker-group" aria-hidden="true">
              {TICKER_ROW_2.map((text, idx) => (
                <span key={`r2-c-${idx}`} className="trust-ticker-item">
                  <span className="ticker-phrase-text">{text}</span>
                  <FourPointStar className="star-blue" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
