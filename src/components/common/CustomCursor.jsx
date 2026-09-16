import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * CustomCursor Component
 * Seamlessly blends:
 * 1. Precision 7px dot tracking mouse instantly.
 * 2. Butter-smooth trailing ring across standard site elements.
 * 3. Smooth magnetic expansion on interactive links/buttons.
 * 4. The signature WhyCreatives floating circular badge with diagonal arrow (↗)
 *    when hovering over project cards, with spring rotation & soft drop shadow.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const outlineRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const outline = outlineRef.current;
    const arrow = arrowRef.current;
    if (!dot || !outline) return;

    // Offload centering to GSAP to avoid CSS transform conflicts
    gsap.set([dot, outline], { xPercent: -50, yPercent: -50 });

    // Fast GSAP quickSetters for high-refresh 120fps/144fps tracking
    const setDotX = gsap.quickSetter(dot, 'x', 'px');
    const setDotY = gsap.quickSetter(dot, 'y', 'px');
    const setOutlineX = gsap.quickSetter(outline, 'x', 'px');
    const setOutlineY = gsap.quickSetter(outline, 'y', 'px');

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let outlinePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let isVisible = true;

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setDotX(mouse.x);
      setDotY(mouse.y);

      if (!isVisible) {
        isVisible = true;
        dot.classList.remove('cursor-hidden');
        outline.classList.remove('cursor-hidden');
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.classList.add('cursor-hidden');
      outline.classList.add('cursor-hidden');
    };

    const onMouseEnter = () => {
      isVisible = true;
      dot.classList.remove('cursor-hidden');
      outline.classList.remove('cursor-hidden');
    };

    const onMouseDown = () => {
      dot.classList.add('cursor-clicking');
      outline.classList.add('cursor-clicking');
    };

    const onMouseUp = () => {
      dot.classList.remove('cursor-clicking');
      outline.classList.remove('cursor-clicking');
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Smooth physics lerp ticker for outer circle badge
    const updateOutline = () => {
      const dt = 1.0 - Math.pow(1.0 - 0.22, gsap.ticker.deltaRatio());
      outlinePos.x += (mouse.x - outlinePos.x) * dt;
      outlinePos.y += (mouse.y - outlinePos.y) * dt;
      setOutlineX(outlinePos.x);
      setOutlineY(outlinePos.y);
    };
    
    gsap.ticker.add(updateOutline);

    // Intelligent element hover state detection
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      // 1. Project Card detection (triggers the solid circular arrow badge)
      const isProjectCard = target.closest(
        '.why-project-interactive-group, .notched-card-wrapper, .kinetic-stage-root, [data-cursor="project"]'
      );

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

      // 2. Standard Clickable Elements (triggers sleek ring expansion)
      const isClickable = target.closest(
        'a, button, [role="button"], input, select, textarea, .nav-item, .studio-pill-btn, .why-case-btn, .why-link-btn, .trust-item, .accordion-item-head, .creds-toggle-btn'
      );

      if (isClickable) {
        dot.classList.add('cursor-hover');
        outline.classList.add('cursor-hover');
      } else {
        dot.classList.remove('cursor-hover');
        outline.classList.remove('cursor-hover');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      gsap.ticker.remove(updateOutline);
    };
  }, []);

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
