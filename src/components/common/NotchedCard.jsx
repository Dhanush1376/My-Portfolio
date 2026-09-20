import React, { useRef, useState, useCallback, useLayoutEffect, useEffect } from 'react';

/**
 * Mathematical SVG Path calculation for the dual-notched card.
 * Generates continuous smooth fillets (convex and concave arcs) connecting
 * the top-right tag notch and the bottom-left meta notch.
 */
const dt = (val) => Math.round(val * 100) / 100;
const arc = (r, sweep, x, y) => `A ${dt(r)} ${dt(r)} 0 0 ${sweep} ${dt(x)} ${dt(y)}`;

export function generateNotchedPath(width, height, tags, meta, cornerRadius, filletRadius) {
  const s = cornerRadius;
  const i = filletRadius;
  const e = width;
  const t = height;
  const n = tags; // { w, h } - top right notch
  const r = meta; // { w, h } - bottom left notch

  return [
    `M ${dt(s)} 0`,
    `H ${dt(e - n.w - i)}`,
    arc(i, 1, e - n.w, i),
    `V ${dt(n.h - i)}`,
    arc(i, 0, e - n.w + i, n.h),
    `H ${dt(e - i)}`,
    arc(i, 1, e, n.h + i),
    `V ${dt(t - s)}`,
    arc(s, 1, e - s, t),
    `H ${dt(r.w + i)}`,
    arc(i, 1, r.w, t - i),
    `V ${dt(t - r.h + i)}`,
    arc(i, 0, r.w - i, t - r.h),
    `H ${dt(i)}`,
    arc(i, 1, 0, t - r.h - i),
    `V ${dt(s)}`,
    arc(s, 1, s, 0),
    'Z',
  ].join(' ');
}

/**
 * NotchedCard Component
 * Implements stepped/cutout geometry with dynamic SVG fillets
 */
export default function NotchedCard({
  tags,
  meta,
  children,
  overlay,
  className = '',
  radiusClassName = 'notched-card-radius',
  surfaceClassName = 'notched-card-surface',
  tagsClassName = 'notched-tags-container',
  tagsPaddedClassName = 'notched-tags-padded',
  metaClassName = 'notched-meta-container',
  metaPaddedClassName = 'notched-meta-padded',
  shadowClassName = 'notched-card-shadow',
  bezelWidth = 8,
  bezelColor = '#141414',
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onClick,
  frameRef,
}) {
  const internalRef = useRef(null);
  const container = frameRef || internalRef;
  const tagsRef = useRef(null);
  const metaRef = useRef(null);

  const [clipPath, setClipPath] = useState(null);
  const [dimensions, setDimensions] = useState(null);

  const updatePath = useCallback(() => {
    const el = container.current;
    const tagsEl = tagsRef.current;
    const metaEl = metaRef.current;
    if (!el || !tagsEl || !metaEl) return;

    const L = Math.round(el.clientWidth);
    const H = Math.round(el.clientHeight);

    // If container has unrendered/collapsed dimensions, avoid computing or destroying path
    if (L < 40 || H < 40) return;

    const W = { w: Math.round(tagsEl.offsetWidth), h: Math.round(tagsEl.offsetHeight) };
    const I = { w: Math.round(metaEl.offsetWidth), h: Math.round(metaEl.offsetHeight) };

    // Outer corner radius (20px on mobile, 28px on desktop)
    const P = L < 768 ? 20 : 28;

    // Subpixel debounce: only update dimensions state if size changed by at least 2px
    setDimensions((prev) => {
      if (prev && Math.abs(prev.w - L) < 2 && Math.abs(prev.h - H) < 2) {
        return prev;
      }
      return { w: L, h: H };
    });

    // Safety clamp dimensions so notches NEVER exceed available card space
    // and never collapse to a rectangle during subpixel scroll changes
    const maxNotchW = Math.max(20, L - P - 24);
    const maxNotchH = Math.max(20, Math.floor((H - 24) / 2));

    const safeW = {
      w: Math.max(10, Math.min(W.w, maxNotchW)),
      h: Math.max(10, Math.min(W.h, maxNotchH)),
    };
    const safeI = {
      w: Math.max(10, Math.min(I.w, maxNotchW)),
      h: Math.max(10, Math.min(I.h, maxNotchH)),
    };

    // Fillet radius dynamically constrained by available space on all boundaries
    const maxFilletByW = Math.min(L - safeW.w - P, L - safeI.w - P);
    const maxFilletByH = Math.min(
      Math.floor((H - safeW.h - safeI.h) / 2),
      H - safeW.h - P,
      H - safeI.h - P
    );
    const safeA = Math.max(
      4,
      Math.min(
        P,
        20,
        Math.floor(safeW.w / 2),
        Math.floor(safeW.h / 2),
        Math.floor(safeI.w / 2),
        Math.floor(safeI.h / 2),
        maxFilletByW - 2,
        maxFilletByH - 2
      )
    );

    const pathString = generateNotchedPath(L, H, safeW, safeI, P, safeA);
    setClipPath((prev) => (prev === pathString ? prev : pathString));
  }, [container]);

  useLayoutEffect(() => {
    updatePath();
    const el = container.current;
    if (!el) return;

    let rafId = null;
    let lastW = 0;
    let lastH = 0;

    // Observe only the main container to avoid feedback loop from tags padding changes.
    // Also ignore subpixel changes (< 2px) to prevent re-render loops while scrolling.
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;

      if (Math.abs(width - lastW) < 2 && Math.abs(height - lastH) < 2) {
        return;
      }
      lastW = width;
      lastH = height;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        updatePath();
      });
    });

    ro.observe(el);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [updatePath, container]);

  useEffect(() => {
    if (typeof document === 'undefined' || !('fonts' in document)) return;
    let active = true;
    document.fonts.ready.then(() => {
      if (active) updatePath();
    });
    return () => {
      active = false;
    };
  }, [updatePath]);

  return (
    <div
      ref={container}
      className={`notched-card-wrapper ${radiusClassName} ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* Top-Right Tags Container */}
      <div
        ref={tagsRef}
        className={`notched-tags-anchor ${tagsClassName} ${
          clipPath ? tagsPaddedClassName : 'notched-tags-fallback'
        }`}
      >
        {tags}
      </div>

      {/* Bottom-Left Meta Container */}
      <div
        ref={metaRef}
        className={`notched-meta-anchor ${metaClassName} ${
          clipPath ? metaPaddedClassName : 'notched-meta-fallback'
        }`}
      >
        {meta}
      </div>

      {/* Shadow layer */}
      <div aria-hidden="true" className={`notched-shadow-layer ${shadowClassName}`}>
        <div
          className={`notched-shadow-shape ${radiusClassName} ${surfaceClassName}`}
          style={{
            clipPath: clipPath ? `path("${clipPath}")` : undefined,
            WebkitClipPath: clipPath ? `path("${clipPath}")` : undefined,
          }}
        />
      </div>

      {/* Clipped Content Container */}
      <div className="notched-clipped-container">
        <div
          className={`notched-clipped-surface ${radiusClassName} ${surfaceClassName}`}
          style={{
            clipPath: clipPath ? `path("${clipPath}")` : undefined,
            WebkitClipPath: clipPath ? `path("${clipPath}")` : undefined,
            boxShadow:
              bezelWidth && !clipPath ? `inset 0 0 0 ${bezelWidth}px ${bezelColor}` : undefined,
          }}
        >
          {children}

          {/* Precision SVG Outline Bezel */}
          {bezelWidth > 0 && clipPath && dimensions && (
            <svg
              aria-hidden="true"
              className="notched-bezel-svg"
              width={dimensions.w}
              height={dimensions.h}
              viewBox={`0 0 ${dimensions.w} ${dimensions.h}`}
            >
              <path
                d={clipPath}
                fill="none"
                stroke={bezelColor}
                strokeWidth={bezelWidth * 2}
              />
            </svg>
          )}
        </div>
      </div>

      {overlay}
    </div>
  );
}
