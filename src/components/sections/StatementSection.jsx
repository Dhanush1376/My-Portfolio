import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function StatementSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tagEl = sectionRef.current.querySelector('.tilted-tag-wrapper');
      const lines = sectionRef.current.querySelectorAll('.statement-line-inner');

      // 1. Tilted tape tag bounce-pop on scroll (triggers immediately on entry)
      if (tagEl) {
        gsap.fromTo(
          tagEl,
          { opacity: 0, scale: 0.65, y: 24, rotate: 8 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotate: -2.5,
            duration: 0.65,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 96%',
            },
          }
        );
      }

      // 2. Kinetic Headline Mask Reveal on scroll
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          {
            yPercent: 120,
            opacity: 0,
            filter: 'blur(6px)',
          },
          {
            yPercent: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.85,
            stagger: 0.1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 96%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="statement-section" id="statement" aria-label="Philosophy and Mindset">
      {/* Background Architectural Ambient Glow & Grid Lines */}
      <div className="statement-grid-overlay" aria-hidden="true">
        <div className="statement-grid-lines" />
        <div className="statement-ambient-glow" />
      </div>

      <div className="statement-divider-top" aria-hidden="true" />
 
      <div className="statement-container">
        {/* Section Header with Nostalgic Tilted Tape Badge */}
        <div className="statement-header-row">
          <div className="tilted-tag-wrapper">
            <span 
              className="tilted-tag"
              style={{
                background: 'var(--hero-orange-1, var(--accent))',
                color: 'var(--hero-stage-text, #FFFFFF)',
                transition: 'background 0.3s ease, color 0.3s ease'
              }}
            >
              02 // PHILOSOPHY &amp; MINDSET
            </span>
          </div>
        </div>

        {/* Clean, Elegant Hairline */}
        <div className="statement-hairline" aria-hidden="true" />

        {/* Hero Manifesto Block with Kinetic Line Mask Typography */}
        <div className="statement-hero-manifesto">
          <div className="statement-quote-box">
            <h2 className="statement-display-text">
              <span className="statement-line-inner">“I don’t just write code.</span>
              <span className="statement-line-inner">
                I architect <span className="statement-accent-tag accent-resilient">resilient systems</span>, integrate{' '}
                <span className="statement-accent-tag accent-ai">practical AI</span>,
              </span>
              <span className="statement-line-inner">
                and ship products that deliver <span className="statement-accent-tag accent-utility">real utility</span>.”
              </span>
            </h2>
          </div>

          {/* Action CTAs Row — Hero Section Matched Studio Style */}
          <div className="statement-actions-row">
            <Link 
              to="/about" 
              className="statement-btn-primary" 
              id="btn-statement-about"
              aria-label="View about story"
            >
              <span>About Me</span>
              <span className="statement-btn-arrow-badge" aria-hidden="true">
                <ArrowUpRight size={17} strokeWidth={2.2} />
              </span>
            </Link>

            <Link 
              to="/contact" 
              className="statement-link-secondary" 
              id="btn-statement-contact"
              aria-label="Start a project with Dhanush"
            >
              <span>Start a project</span>
              <span className="statement-link-arrow" aria-hidden="true">
                <ArrowUpRight size={17} strokeWidth={2.2} />
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="statement-divider-bottom" aria-hidden="true" />
    </section>
  );
}
