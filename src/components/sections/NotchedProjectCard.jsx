import React, { useState } from 'react';
import NotchedCard from '../common/NotchedCard';
import KineticStage from '../common/KineticStage';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

/**
 * NotchedProjectCard
 * Packages WhyCreatives' signature notched stepped card with:
 * - Top-right tag pills
 * - Bottom-left metadata & indicators
 * - Kinetic typography stage with cycling phrases
 * - On laptop: full editorial specifications beside the card
 * - Hover interactions and case study modal trigger
 */
export default function NotchedProjectCard({
  project,
  index,
  onOpenCaseStudy,
  className = '',
  style = {},
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const cardRef = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Determine tone and bezel color
  const tone = project.stage?.tone || (index % 2 === 0 ? 'light' : 'dark');
  const bezelColor = '#000000';

  return (
    <article
      ref={cardRef}
      className={`why-project-card-item ${inView ? 'in-view' : ''} ${className}`}
      style={style}
      id={`project-${project.id}`}
    >
      {/* Visual Card - Click opens live website directly */}
      <a
        href={project.liveUrl || '#contact'}
        target={project.liveUrl ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="why-project-interactive-group"
        aria-label={`Visit live website for ${project.title}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <NotchedCard
          bezelWidth={8}
          bezelColor={bezelColor}
          className="why-project-notched-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          tags={
            <div className="why-tags-row">
              <div className="why-tags-desktop">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="why-tag-pill"
                    style={{
                      transform: isHovered ? 'translateY(2px) scale(1.03)' : 'translateY(0) scale(1)',
                      transition: `transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 40}ms`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="why-tags-mobile">
                <span className="why-tag-pill why-tag-website">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  Website
                </span>
              </div>
            </div>
          }
          meta={
            <div className="why-meta-row">
              <span className="why-meta-year">{project.year || '2026'}</span>
              <span className="why-meta-sep">•</span>
              <span className="why-meta-cat">{project.client || project.category}</span>
            </div>
          }
          overlay={
            <div className={`why-card-hover-drawer ${isHovered ? 'drawer-visible' : ''}`}>
              <span className="why-drawer-label">Visit Live Website</span>
              <ArrowUpRight className="why-drawer-icon" size={16} />
            </div>
          }
        >
          {/* Main Stage: Live Preview Showcase */}
          <KineticStage
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
      <div className="why-project-beside-content">
        <div className="why-project-watermark-num" aria-hidden="true">
          {project.num || `0${index + 1}`}
        </div>
        <div className="why-beside-meta-row">
          <span className="why-beside-cat-pill">
            {project.year || '2026'} • {project.category || project.service || 'FLAGSHIP PLATFORM'}
          </span>
        </div>

        <h3 className="why-project-headline">
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
          <p className="why-project-desc">{project.description || project.desc || project.subtitle}</p>
        )}

        {/* Highlight Metrics */}
        {project.stats && project.stats.length > 0 && (
          <div className="why-beside-stats-row">
            {project.stats.map((st, i) => (
              <div className="why-stat-box" key={i}>
                <span className="why-stat-val">{st.val}</span>
                <span className="why-stat-lbl">{st.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tech Badges and Actions */}
        <div className="why-project-bottom-rail">
          <div className="why-bottom-tech-list">
            {project.tech?.map((tech, i) => (
              <span key={i} className="why-mini-tech">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
