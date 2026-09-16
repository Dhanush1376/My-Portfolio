import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TRUST_ITEMS } from '../../data/trustItemsData';

export default function TrustStrip() {
  const stripRef = useRef(null);
  const trackRef = useRef(null);
  const group1Ref = useRef(null);

  useEffect(() => {
    const strip = stripRef.current;
    const track = trackRef.current;
    const group1 = group1Ref.current;
    if (!strip || !track || !group1) return;

    track.classList.add('is-js-animated');

    let groupWidth = group1.getBoundingClientRect().width;
    const updateWidth = () => {
      if (group1) {
        const w = group1.getBoundingClientRect().width;
        if (w > 20) groupWidth = w;
      }
    };

    window.addEventListener('resize', updateWidth);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateWidth);
    }

    let xPos = 0;
    const baseSpeed = 1.15;
    let speedMultiplier = 1;
    let targetVelocityBonus = 0;
    let velocityBonus = 0;
    let currentSkew = 0;
    let targetSkew = 0;
    let isHovered = false;

    // Drag & Swipe Interaction State
    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let dragVelocity = 0;
    let lastTime = 0;
    let hasDragged = false;

    const onMouseEnter = () => { isHovered = true; };
    const onMouseLeave = () => { isHovered = false; };
    strip.addEventListener('mouseenter', onMouseEnter);
    strip.addEventListener('mouseleave', onMouseLeave);

    const onPointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      isDragging = true;
      hasDragged = false;
      startX = e.clientX;
      lastX = e.clientX;
      lastTime = performance.now();
      dragVelocity = 0;
      strip.classList.add('is-dragging');
      try {
        strip.setPointerCapture(e.pointerId);
      } catch (err) {}
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const currentX = e.clientX;
      const dx = currentX - lastX;
      const dist = Math.abs(currentX - startX);

      if (dist > 5) {
        hasDragged = true;
      }

      const now = performance.now();
      const dt = Math.max(now - lastTime, 8);
      const instantVel = (dx / dt) * 16.67;
      dragVelocity = dragVelocity * 0.4 + instantVel * 0.6;
      lastTime = now;
      lastX = currentX;

      xPos += dx;
      targetSkew = gsap.utils.clamp(-6.5, 6.5, -dx * 0.35);

      if (groupWidth > 10) {
        while (xPos <= -groupWidth) xPos += groupWidth;
        while (xPos > 0) xPos -= groupWidth;
      }

      track.style.transform = `translate3d(${xPos.toFixed(2)}px, 0, 0) skewX(${targetSkew.toFixed(2)}deg)`;
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      strip.classList.remove('is-dragging');
      try {
        strip.releasePointerCapture(e.pointerId);
      } catch (err) {}

      if (Math.abs(dragVelocity) > 0.4) {
        targetVelocityBonus = -dragVelocity * 1.35;
      }
    };

    strip.addEventListener('pointerdown', onPointerDown);
    strip.addEventListener('pointermove', onPointerMove);
    strip.addEventListener('pointerup', onPointerUp);
    strip.addEventListener('pointercancel', onPointerUp);

    const onClick = (e) => {
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
        hasDragged = false;
      }
    };
    strip.addEventListener('click', onClick, true);

    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        targetVelocityBonus += e.deltaX * 0.15;
        targetSkew = gsap.utils.clamp(-6, 6, e.deltaX * -0.1);
      }
    };
    strip.addEventListener('wheel', onWheel, { passive: true });

    // GSAP Ticker for 60/120/144fps smooth animation
    const ticker = gsap.ticker.add((time, deltaTime) => {
      if (isDragging) return;

      const dt = Math.min(deltaTime / 16.667, 2.5);
      const targetMult = isHovered ? 0.15 : 1.0;
      speedMultiplier += (targetMult - speedMultiplier) * (0.09 * dt);

      velocityBonus += (targetVelocityBonus - velocityBonus) * (0.12 * dt);
      targetVelocityBonus *= Math.pow(0.92, dt);

      currentSkew += (targetSkew - currentSkew) * (0.14 * dt);
      targetSkew *= Math.pow(0.88, dt);

      const moveStep = ((baseSpeed * speedMultiplier) + velocityBonus) * dt;
      xPos -= moveStep;

      if (groupWidth > 10) {
        while (xPos <= -groupWidth) xPos += groupWidth;
        while (xPos > 0) xPos -= groupWidth;
      }

      track.style.transform = `translate3d(${xPos.toFixed(2)}px, 0, 0) skewX(${currentSkew.toFixed(2)}deg)`;
    });

    setTimeout(updateWidth, 350);

    return () => {
      window.removeEventListener('resize', updateWidth);
      strip.removeEventListener('mouseenter', onMouseEnter);
      strip.removeEventListener('mouseleave', onMouseLeave);
      strip.removeEventListener('pointerdown', onPointerDown);
      strip.removeEventListener('pointermove', onPointerMove);
      strip.removeEventListener('pointerup', onPointerUp);
      strip.removeEventListener('pointercancel', onPointerUp);
      strip.removeEventListener('click', onClick, true);
      strip.removeEventListener('wheel', onWheel);
      gsap.ticker.remove(ticker);
    };
  }, []);

  const renderGroup = (ref, isAriaHidden = false) => (
    <div className="trust-marquee-group" ref={ref} aria-hidden={isAriaHidden || undefined}>
      {TRUST_ITEMS.map((item, idx) => (
        <React.Fragment key={idx}>
          <div className="trust-item">
            <span className="trust-num">
              {item.num.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < item.num.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
            <div className="trust-info">
              <span className="trust-title">{item.title}</span>
              <span className="trust-sub">{item.sub}</span>
            </div>
          </div>
          <div className="trust-divider" />
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section className="trust-strip" id="trustStrip" ref={stripRef} aria-label="Key Proof and Capabilities">
      <div className="trust-marquee-viewport">
        <div className="trust-marquee-track" id="trustTrack" ref={trackRef}>
          {renderGroup(group1Ref, false)}
          {renderGroup(null, true)}
          {renderGroup(null, true)}
        </div>
      </div>
    </section>
  );
}
