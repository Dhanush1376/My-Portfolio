import React, { useState, useRef, useEffect } from 'react';
import { PROJECTS_DATA } from '../../data/projectsData';
import NotchedProjectCard from './NotchedProjectCard';

export default function Projects({ onOpenCaseStudy }) {
  const projectsList = Object.values(PROJECTS_DATA);
  const [inView, setInView] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section why-projects-section" id="work">

      {/* Background Matrix/Grid is handled via CSS */}
      <div className="why-projects-grid-overlay" aria-hidden="true">
        <div className="why-grid-pattern" />
        <div className="why-grid-v-line v-line-left" />
        <div className="why-grid-v-line v-line-center" />
        <div className="why-grid-v-line v-line-right" />
      </div>

      <div className="why-projects-container">
        <header ref={headerRef} className={`why-projects-master-header ${inView ? 'in-view' : ''}`} style={{ borderBottom: 'none', paddingBottom: '1rem', paddingTop: '2rem' }}>
          
          {/* Top Bar matching the Philosophy section */}
          <div className="statement-header-row" style={{ width: '100%', marginBottom: '2.5rem' }}>
            <span className="statement-eyebrow">
              <span className="eyebrow-bullet">•</span> 01 / SELECTED WORK
            </span>
            <span className="statement-stamp">EST. 2024</span>
          </div>

          <div className="why-header-content-left">
            <h2 className="why-projects-minimal-title" style={{ 
              fontFamily: 'var(--font-display, sans-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
              color: 'var(--text)'
            }}>
              SELECTED <span style={{ color: 'var(--accent, #FF5520)' }}>WORK.”</span>
            </h2>
          </div>
        </header>

        {/* Project Showcase Flow (Card + Text Beside on Laptop) */}
        <div className="why-projects-flow">
          {projectsList.map((project, index) => (
            <NotchedProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpenCaseStudy={onOpenCaseStudy}
              className="why-project-row-item"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
