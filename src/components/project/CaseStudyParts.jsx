import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Shared building blocks for the long-form pages (project case studies and service pages).
// Styles live in src/styles/project-page.css.

export const PALETTE = ['#9D8CFF', '#FF6058', '#F2A93B', '#5BB3E6', '#94CF4E', '#EF7AA0'];

/** Adds .is-revealed to every [data-reveal] inside rootRef as it scrolls into view. */
export function useRevealOnScroll(rootRef, deps = []) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const targets = root.querySelectorAll('[data-reveal]');
    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Section eyebrow. `swipe` adds a phone-only hint for rows that become swipeable on small screens. */
export function SectionLabel({ num, id, children }) {
  return (
    <p className="pcs-label" id={id} data-reveal>
      <span className="pcs-label-num">{num}</span>
      <span className="pcs-label-rule" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

const PHONE = '(max-width: 640px)';

/**
 * Long copy that collapses to `lines` lines with a "Read more" toggle on phones only.
 * The full text always stays in the DOM (for search engines and screen readers).
 */
export function ClampText({ as: Tag = 'p', className = '', lines = 5, style, children, ...rest }) {
  const ref = useRef(null);
  const [clampable, setClampable] = useState(false);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return undefined;
    const mq = window.matchMedia(PHONE);
    const measure = () => {
      if (!mq.matches) {
        setClampable(false);
        return;
      }
      const lh = parseFloat(getComputedStyle(el).lineHeight) || 24;
      // scrollHeight is the full text height even while clamped
      setClampable(el.scrollHeight > lh * lines + 6);
    };
    measure();
    mq.addEventListener?.('change', measure);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => {
      mq.removeEventListener?.('change', measure);
      window.removeEventListener('resize', measure);
    };
  }, [lines]);

  const clamped = clampable && !open;
  return (
    <>
      <Tag ref={ref} className={`${className} ${clamped ? 'pcs-clamped' : ''}`} style={{ ...style, '--lines': lines }} {...rest}>
        {children}
      </Tag>
      {clampable && (
        <button type="button" className={`pcs-more ${open ? 'is-open' : ''}`} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? 'Show less' : 'Read more'}
          <ChevronDown size={16} strokeWidth={2.4} aria-hidden="true" />
        </button>
      )}
    </>
  );
}

/** Letters roll up out of their own masks; words never break mid-word; ends on the brand full stop. */
export function KineticTitle({ text }) {
  let n = 0;
  const words = text.split(' ');
  return (
    <span className="pcs-title-text" aria-hidden="true">
      {words.map((word, wi) => (
        <span className="pcs-title-word" key={wi}>
          {word.split('').map((ch) => {
            const i = n++;
            return (
              <span className="pcs-char-mask" key={i}>
                <span className="pcs-char" style={{ '--i': i }}>{ch}</span>
              </span>
            );
          })}
          {/* The brand full stop rides on the last word so it never wraps alone */}
          {wi === words.length - 1 && (
            <span className="pcs-char-mask">
              <span className="pcs-char pcs-dot" style={{ '--i': n + 2 }}>.</span>
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

/** Minimal hairline between sections; draws itself in when it scrolls into view. */
export function SectionRule() {
  return (
    <div className="pcs-wrap pcs-rule-wrap" aria-hidden="true">
      <span className="pcs-rule" data-reveal />
    </div>
  );
}
