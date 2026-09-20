import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * CustomCursor Component
 * Strictly enabled on LAPTOP / DESKTOP devices with a mouse/trackpad.
 * Completely disabled on mobile and touch devices, which use normal default cursor.
 */
export default function CustomCursor() {
  const [isLaptop, setIsLaptop] = useState(false);
  const dotRef = useRef(null);
  const outlineRef = useRef(null);
  const arrowRef = useRef(null);

  // 1. Detect if current device is laptop/desktop with a fine mouse/trackpad pointer
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1025px) and (pointer: fine)');
    
    const updateDeviceMatch = () => {
      setIsLaptop(mediaQuery.matches);
    };

    updateDeviceMatch();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateDeviceMatch);
    } else {
      mediaQuery.addListener(updateDeviceMatch);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateDeviceMatch);
      } else {
        mediaQuery.removeListener(updateDeviceMatch);
      }
    };
  }, []);

  // 2. Setup mouse cursor tracking on laptop only
  useEffect(() => {
    if (!isLaptop) return;

    const dot = dotRef.current;
    const outline = outlineRef.current;
    if (!dot || !outline) return;

    // Center elements with GSAP
    gsap.set([dot, outline], { xPercent: -50, yPercent: -50 });

    const setDotX = gsap.quickSetter(dot, 'x', 'px');
    const setDotY = gsap.quickSetter(dot, 'y', 'px');
    const setOutlineX = gsap.quickSetter(outline, 'x', 'px');
    const setOutlineY = gsap.quickSetter(outline, 'y', 'px');

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let outlinePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let isVisible = true;

    const showCursor = () => {
      if (!isVisible) {
        isVisible = true;
        dot.classList.remove('cursor-hidden');
        outline.classList.remove('cursor-hidden');
      }
    };

    const checkHoverTarget = (target) => {
      if (!target) return;

      // 1. Project Card detection (circular arrow badge)
      const isProjectCard =
        target.closest('.featured-project-card-item .featured-project-interactive-group, [data-cursor="project"]') &&
        !target.closest('.studio-alt-hub, .discovery-card-group');

      if (isProjectCard) {
        dot.classList.add('cursor-project');
        outline.classList.add('cursor-project');
        dot.classList.remove('cursor-hover');
        outline.classList.remove('cursor-hover');
        return;
      } else {
        dot.classList.remove('cursor-project');
        outline.classList.remove('cursor-project');
      }

      // 2. Editorial Expertise Row detection (keep cursor sleek & standard without 50px orange ring)
      const isExpertiseRow = target.closest('.expertise-row');
      if (isExpertiseRow) {
        dot.classList.remove('cursor-hover', 'cursor-project');
        outline.classList.remove('cursor-hover', 'cursor-project');
        return;
      }

      // 3. Standard Clickable Elements
      const isClickable = target.closest(
        'a, button, [role="button"], input, select, textarea, .nav-item, .studio-pill-btn, .project-case-btn, .project-link-btn, .trust-item, .accordion-item-head, .creds-toggle-btn, .service-pill-chip, .step-nav-tab, .hero-dock-btn'
      );

      if (isClickable) {
        dot.classList.add('cursor-hover');
        outline.classList.add('cursor-hover');
      } else {
        dot.classList.remove('cursor-hover');
        outline.classList.remove('cursor-hover');
      }
    };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setDotX(mouse.x);
      setDotY(mouse.y);
      showCursor();
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.classList.add('cursor-hidden');
      outline.classList.add('cursor-hidden');
    };

    const onMouseEnter = () => {
      showCursor();
    };

    const onMouseDown = () => {
      dot.classList.add('cursor-clicking');
      outline.classList.add('cursor-clicking');
    };

    const onMouseUp = () => {
      dot.classList.remove('cursor-clicking');
      outline.classList.remove('cursor-clicking');
    };

    const handleMouseOver = (e) => {
      checkHoverTarget(e.target);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    // Smooth physics lerp ticker for outer circle badge
    const updateOutline = () => {
      const dt = 1.0 - Math.pow(1.0 - 0.22, gsap.ticker.deltaRatio());
      outlinePos.x += (mouse.x - outlinePos.x) * dt;
      outlinePos.y += (mouse.y - outlinePos.y) * dt;
      setOutlineX(outlinePos.x);
      setOutlineY(outlinePos.y);
    };

    gsap.ticker.add(updateOutline);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      gsap.ticker.remove(updateOutline);
    };
  }, [isLaptop]);

  // On mobile or non-laptop screens, render nothing so browser default cursor is active
  if (!isLaptop) {
    return null;
  }

  return (
    <>
      <div className="cursor-dot" ref={dotRef} id="cursorDot" aria-hidden="true" />
      <div className="cursor-outline" ref={outlineRef} id="cursorOutline" aria-hidden="true">
        <div className="cursor-arrow-icon" ref={arrowRef}>
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>
      </div>
    </>
  );
}
