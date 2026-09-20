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
 * Interactive Dual-Notched Card:
 * - GSAP ScrollTrigger smooth elevation & scale reveal
 * - Tag pills staggered spring pop
 * - Internal kinetic stage camera depth parallax scrub
 * - Tactile micro-press feedback and fluid navigation
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
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const belowInfoRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cardEl = cardRef.current;
      const innerEl = innerRef.current;
      const belowInfoEl = belowInfoRef.current;
      const tagPills = cardEl.querySelectorAll('.project-tag-pill');
      const metaRow = cardEl.querySelector('.project-meta-row');

      // 1. Card Smooth Elevation and Scale Reveal
      if (cardEl) {
        gsap.fromTo(
          cardEl,
          {
            y: 48,
            opacity: 0.15,
            scale: 0.965,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardEl,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

      // 2. Tag pills bounce pop
      if (tagPills && tagPills.length > 0) {
        gsap.fromTo(
          tagPills,
          { scale: 0.75, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: cardEl,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      // 3. Meta and below headline stagger
      if (belowInfoEl) {
        const infoElements = [metaRow, belowInfoEl].filter(Boolean);
        gsap.fromTo(
          infoElements,
          { y: 20, opacity: 0.1 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardEl,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      // 4. Kinetic Stage internal camera parallax scrub
      const stageRoot = cardEl.querySelector('.kinetic-stage-root');
      if (stageRoot) {
        gsap.fromTo(
          stageRoot,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: cardEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="discovery-card-group"
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
      <div ref={innerRef} className="discovery-card-inner">
        <NotchedCard
          bezelWidth={7}
          bezelColor="#111111"
          className="discovery-notched-wrapper"
          surfaceClassName="discovery-surface-light"
          tags={
            <div className="project-tags-row">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="project-tag-pill project-tag-pill-dark"
                >
                  {tag}
                </span>
              ))}
            </div>
          }
          meta={
            <div className="project-meta-row">
              <span className="project-meta-year">2026</span>
              <span className="project-meta-sep">•</span>
              <span className="project-meta-cat">{meta}</span>
            </div>
          }
          overlay={
            <div className="project-card-hover-drawer">
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

      <div ref={belowInfoRef} className="discovery-below-info">
        <h4 className="discovery-headline">
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
  const headingRef = useRef(null);
  const navigate = useNavigate();
  const isSingle = mode === 'projects-only';

  const defaultSubtitle = isSingle
    ? 'Check real client projects and verified live applications.'
    : 'Check live client projects or explore our specialized engineering services.';

  const effectiveSubtitle = subtitle || defaultSubtitle;

  useEffect(() => {
    if (!rootRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const headingEl = headingRef.current || rootRef.current;
      const tagEl = headingEl.querySelector('.tilted-tag-wrapper');
      const lines = headingEl.querySelectorAll('.title-line-inner');
      const descEl = headingEl.querySelector('.alt-hub-desc');

      // 1. Tilted tape tag bounce-pop on scroll
      if (tagEl) {
        gsap.fromTo(
          tagEl,
          { opacity: 0.1, scale: 0.8, y: 18, rotate: 6 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotate: 0,
            duration: 0.65,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: headingEl,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

      // 2. Kinetic Headline Mask Reveal on scroll
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          {
            yPercent: 60,
            opacity: 0.1,
            filter: 'blur(3px)',
          },
          {
            yPercent: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.08,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headingEl,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

      // 3. Subtitle description smooth fade reveal
      if (descEl) {
        gsap.fromTo(
          descEl,
          { opacity: 0.1, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingEl,
              start: 'top 88%',
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
    <div ref={headingRef} className="alt-hub-center">
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
      <div className="discovery-notched-grid">
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
