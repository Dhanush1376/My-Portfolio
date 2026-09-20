import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NotchedCard from '../common/NotchedCard';
import KineticStage from '../common/KineticStage';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * NotchedProjectCard
 * Packages the signature notched stepped card with:
 * - Top-right tag pills (tags on desktop, Website pill on mobile)
 * - Bottom-left metadata & indicators (year + category)
 * - Kinetic typography stage with cycling phrases and live preview
 * - On laptop: full editorial specifications beside the card with watermark number
 * - Hover interactions and direct live link
 * - World-Class Scroll Choreography: Card entrance reveal, watermark parallax scrub, editorial text stagger
 */
export default function NotchedProjectCard({
  project,
  index,
  onOpenCaseStudy,
  className = '',
  style = {},
}) {
  const cardRef = useRef(null);
  const interactiveGroupRef = useRef(null);
  const watermarkRef = useRef(null);
  const besideRef = useRef(null);

  // Determine tone and bezel color
  const tone = project.stage?.tone || (index % 2 === 0 ? 'light' : 'dark');
  const bezelColor = '#000000';

  useEffect(() => {
    if (!cardRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cardEl = cardRef.current;
      const groupEl = interactiveGroupRef.current;
      const watermarkEl = watermarkRef.current;
      const besideEl = besideRef.current;

      // 1. Watermark Number Smooth Parallax Scrub
      if (watermarkEl) {
        gsap.fromTo(
          watermarkEl,
          { y: -45 },
          {
            y: 45,
            ease: 'none',
            scrollTrigger: {
              trigger: cardEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }

      // 2. Card Container Smooth Elevation Reveal
      if (groupEl) {
        gsap.fromTo(
          groupEl,
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
              start: 'top 86%',
              once: true,
            },
          }
        );
      }

      // 3. Editorial Beside Content Staggered Reveal
      if (besideEl) {
        const items = besideEl.querySelectorAll(
          '.project-beside-meta-row, .featured-project-headline, .featured-project-desc, .project-beside-stats-row, .featured-project-bottom-rail'
        );
        if (items.length > 0) {
          gsap.fromTo(
            items,
            {
              y: 26,
              opacity: 0.1,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
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
      }

      // 4. Subtle Card Media Depth Parallax inside clipped card
      const mediaLayer = cardEl.querySelector('.kinetic-preview-image-layer, .kinetic-stage-root');
      if (mediaLayer) {
        gsap.fromTo(
          mediaLayer,
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
    <article
      ref={cardRef}
      className={`featured-project-card-item ${className}`}
      style={style}
      id={`project-${project.id}`}
    >
      {/* Visual Card - Click opens live website directly */}
      <a
        ref={interactiveGroupRef}
        href={project.liveUrl || '#contact'}
        target={project.liveUrl ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="featured-project-interactive-group"
        aria-label={`Visit live website for ${project.title}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <NotchedCard
          bezelWidth={8}
          bezelColor={bezelColor}
          className="featured-project-notched-container"
          tags={
            <div className="project-tags-row">
              <div className="project-tags-desktop">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="project-tag-pill"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="project-tags-mobile">
                <span className="project-tag-pill project-tag-website">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  Website
                </span>
              </div>
            </div>
          }
          meta={
            <div className="project-meta-row">
              <span className="project-meta-year">{project.year || '2026'}</span>
              <span className="project-meta-sep">•</span>
              <span className="project-meta-cat">{project.client || project.category}</span>
            </div>
          }
          overlay={
            <div className="project-card-hover-drawer">
              <span className="project-drawer-label">view</span>
              <ArrowUpRight className="project-drawer-icon" size={18} strokeWidth={2.5} />
            </div>
          }
        >
          {/* Main Stage: Live Preview Showcase */}
          <KineticStage
            projectId={project.id}
            phrases={project.stage?.phrases || []}
            tone={tone}
            seed={index}
            activePreviewImg={project.img}
            activeVideo={project.video}
            showImagePreview={true}
          />
        </NotchedCard>
      </a>

      {/* Editorial Content Beside Card on Laptop */}
      <div ref={besideRef} className="featured-project-beside-content">
        <div ref={watermarkRef} className="featured-project-watermark-num" aria-hidden="true">
          {project.num || `0${index + 1}`}
        </div>
        <div className="project-beside-meta-row">
          <span className="project-beside-cat-pill">
            {project.year || '2026'} <span className="project-meta-dot" aria-hidden="true">•</span> {project.category || project.service || 'FLAGSHIP PLATFORM'}
          </span>
        </div>

        <h3 className="featured-project-headline">
          <a
            href={project.liveUrl || '#contact'}
            target={project.liveUrl ? '_blank' : '_self'}
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {project.title}
          </a>
        </h3>

        {(project.description || project.desc || project.subtitle) && (
          <p className="featured-project-desc">{project.description || project.desc || project.subtitle}</p>
        )}

        {/* Highlight Metrics */}
        {project.stats && project.stats.length > 0 && (
          <div className="project-beside-stats-row">
            {project.stats.map((st, i) => (
              <div className="project-stat-box" key={i}>
                <span className="project-stat-val">{st.val}</span>
                <span className="project-stat-lbl">{st.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tech Badges and Actions */}
        <div className="featured-project-bottom-rail">
          <div className="project-bottom-tech-list">
            {project.tech?.map((tech, i) => (
              <span key={i} className="project-mini-tech">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
