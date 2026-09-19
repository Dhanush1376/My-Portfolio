import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import NotchedCard from '../common/NotchedCard';
import KineticStage from '../common/KineticStage';

gsap.registerPlugin(ScrollTrigger);

export const WORK_STAGE_PHRASES = [
  { words: ['Proof of', 'work'], color: '#6D5AE6' },
  { words: ['Real client', 'projects'], color: '#8B5CF6' },
  { words: ['Live web', 'apps'], color: '#3B82F6' },
  { words: ['Built to', 'deliver'], color: '#14B8A6' }
];

export const SERVICES_STAGE_PHRASES = [
  { words: ['AI &', 'RAG'], color: '#E04420' },
  { words: ['Web &', 'apps'], color: '#6D5AE6' },
  { words: ['E-Com', 'stores'], color: '#D97706' },
  { words: ['Smart', 'automation'], color: '#2563EB' },
  { words: ['Landing', 'pages'], color: '#DB2777' },
  { words: ['Live', 'dashboards'], color: '#059669' }
];

/**
 * HubDiscoveryCard
 * Mirrors WhyCreatives' NotchedProjectCard:
 * - 3D tilt perspective entrance with projectImageReveal
 * - Responsive tag hover elevation
 * - Tactile micro-press feedback
 * - Fluid smooth navigation
 */
export function HubDiscoveryCard({
  tags,
  meta,
  drawerLabel,
  phrases,
  headline,
  cardIndex = 0,
  onCardClick,
  ariaLabel,
}) {
  const [inView, setInView] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`why-service-card-group ${inView ? 'in-view' : ''}`}
      style={{
        transitionDelay: `${cardIndex * 0.14}s`,
      }}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCardClick();
        }
      }}
    >
      <div className="why-hub-card-inner">
        <NotchedCard
          bezelWidth={7}
          bezelColor="#111111"
          className="why-service-notched-wrapper"
          surfaceClassName="why-service-surface-light"
          tags={
            <div className="why-tags-row">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="why-tag-pill why-tag-pill-dark"
                >
                  {tag}
                </span>
              ))}
            </div>
          }
          meta={
            <div className="why-meta-row">
              <span className="why-meta-year">2026</span>
              <span className="why-meta-sep">•</span>
              <span className="why-meta-cat">{meta}</span>
            </div>
          }
          overlay={
            <div className="why-card-hover-drawer">
              <span>{drawerLabel}</span>
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </div>
          }
        >
          <KineticStage
            tone="light"
            intervalMs={2200}
            seed={cardIndex}
            phrases={phrases}
          />
        </NotchedCard>
      </div>

      <div className="why-service-below-info">
        <h4 className="why-service-headline">
          {headline}
        </h4>
      </div>
    </div>
  );
}

/**
 * AlternativeDiscoveryHub ("STILL NOT SURE?")
 * Features:
 * - "EXPLORE MORE" orange badge
 * - "STILL NOT SURE?" editorial title
 * - Adaptable modes: 'all' (both cards) or 'projects-only' (single card for Services page)
 * - Card 1: Proof of Work -> links to /#work
 * - Card 2: Specialized Services -> links to /services (only in 'all' mode)
 */
export default function AlternativeDiscoveryHub({
  className = '',
  mode = 'all', // 'all' | 'projects-only'
  title = null,
  subtitle = null,
  badge = 'Explore More',
  showHeading = true,
}) {
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const isSingle = mode === 'projects-only';

  const defaultSubtitle = isSingle
    ? 'Check real client projects and verified live applications.'
    : 'Check live client projects or explore our specialized engineering services.';

  const effectiveSubtitle = subtitle || defaultSubtitle;

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const tagEl = rootRef.current.querySelector('.tilted-tag-wrapper');
      const lines = rootRef.current.querySelectorAll('.title-line-inner');
      const descEl = rootRef.current.querySelector('.alt-hub-desc');

      // 1. Tilted tape tag bounce-pop on scroll (Matches COMMON QUESTIONS & PROJECTS motion)
      if (tagEl) {
        gsap.fromTo(
          tagEl,
          { opacity: 0, scale: 0.65, y: 24, rotate: 8 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotate: 0,
            duration: 0.65,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top 90%',
              once: true,
            },
          }
        );
      }

      // 2. Kinetic Headline Mask Reveal on scroll (Matches COMMON QUESTIONS & PROJECTS motion)
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          {
            yPercent: 125,
            opacity: 0,
            rotate: 2.2,
            skewY: 1.2,
            filter: 'blur(6px)',
          },
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            skewY: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.08,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top 90%',
              once: true,
            },
          }
        );
      }

      // 3. Subtitle description smooth fade & de-blur reveal
      if (descEl) {
        gsap.fromTo(
          descEl,
          { opacity: 0, y: 18, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top 90%',
              once: true,
            },
          }
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleWorkClick = () => {
    setTimeout(() => {
      navigate('/#work');
      if (typeof window !== 'undefined') {
        const el = document.querySelector('#work');
        if (window.navigateToSection) {
          window.navigateToSection('#work');
        } else if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 70);
  };

  const handleServicesClick = () => {
    setTimeout(() => {
      navigate('/services');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 70);
  };

  const renderHeading = () => (
    <div className="alt-hub-center">
      <div className="tilted-tag-wrapper">
        <span className="alt-hub-badge tilted-tag">{badge}</span>
      </div>
      <h3 className="alt-hub-title">
        {title ? (
          typeof title === 'string' ? (
            <div className="title-line-mask">
              <span className="title-line-inner">{title}</span>
            </div>
          ) : (
            title
          )
        ) : (
          <>
            <div className="title-line-mask">
              <span className="title-line-inner">STILL</span>
            </div>
            <div className="title-line-mask">
              <span className="title-line-inner">NOT</span>
            </div>
            <div className="title-line-mask">
              <span className="title-line-inner">
                SURE<span className="title-accent">?</span>
              </span>
            </div>
          </>
        )}
      </h3>
      <p className="alt-hub-desc">{effectiveSubtitle}</p>
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={`studio-alt-hub ${isSingle ? 'single-card-hub' : ''} ${!showHeading ? 'no-heading' : ''} ${className}`}
    >
      <div className="why-services-notched-grid">
        {/* In single-card mode: Editorial Heading is placed first (on left of desktop grid) */}
        {isSingle && showHeading && renderHeading()}

        {/* Card 1: Selected Works -> Smooth transition to /#work */}
        <HubDiscoveryCard
          cardIndex={0}
          tags={['Proof of Work', 'Live Apps']}
          meta="PROOF OF WORK"
          drawerLabel="projects"
          phrases={WORK_STAGE_PHRASES}
          headline="Check real proof of work & live projects"
          ariaLabel="Selected works - View projects and case studies on home page"
          onCardClick={handleWorkClick}
        />

        {/* In standard dual-card mode: Editorial Heading sits centered between cards */}
        {!isSingle && (
          <>
            {renderHeading()}

            {/* Card 2: Specialized Services -> Smooth transition to /services */}
            <HubDiscoveryCard
              cardIndex={1}
              tags={['Services', 'Capabilities']}
              meta="SPECIALIZED SERVICES"
              drawerLabel="services"
              phrases={SERVICES_STAGE_PHRASES}
              headline="Explore all 6 specialized engineering services & capabilities"
              ariaLabel="Explore all specialized engineering services and capabilities"
              onCardClick={handleServicesClick}
            />
          </>
        )}
      </div>
    </div>
  );
}
