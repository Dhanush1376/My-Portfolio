import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { useLoopingVideo } from '../../hooks/useLoopingVideo';
import { PROJECTS_DATA, getProjectBySlug } from '../../data/projectsData';

export default function CaseStudyModal({ isOpen, projectId, onClose }) {
  const project = projectId ? (PROJECTS_DATA[projectId] || getProjectBySlug(projectId)) : null;

  // Preserve the last active project during exit transitions
  const [activeProject, setActiveProject] = useState(project);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  const videoRef = useRef(null);
  useLoopingVideo(videoRef, { src: isVisible ? activeProject?.video : null });

  // Touch gesture state for mobile bottom-sheet dismiss
  const sheetRef = useRef(null);
  const touchStartY = useRef(0);
  const touchDeltaY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    if (isOpen && project) {
      setActiveProject(project);
      setIsRendered(true);
      // Wait for next frame before triggering CSS transition
      const frame = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => cancelAnimationFrame(frame);
    } else if (!isOpen) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 380); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, project]);

  useEffect(() => {
    if (!isRendered) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isRendered, onClose]);

  // Touch pull-to-dismiss gesture on mobile
  const handleTouchStart = (e) => {
    const scrollContainer = sheetRef.current?.querySelector('.case-study-scroll-body');
    // Only allow drag-to-dismiss if scrolled to top
    if (scrollContainer && scrollContainer.scrollTop > 5) return;

    touchStartY.current = e.touches[0].clientY;
    touchDeltaY.current = 0;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const currentY = e.touches[0].clientY;
    const delta = currentY - touchStartY.current;

    // Only allow dragging down
    if (delta > 0 && sheetRef.current) {
      touchDeltaY.current = delta;
      sheetRef.current.style.transform = `translateY(${delta}px)`;
      sheetRef.current.style.transition = 'none';
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (sheetRef.current) {
      sheetRef.current.style.transition = '';
      if (touchDeltaY.current > 80) {
        sheetRef.current.style.transform = 'translateY(100%)';
        onClose();
      } else {
        sheetRef.current.style.transform = '';
      }
    }
    touchDeltaY.current = 0;
  };

  if (!isRendered || !activeProject) return null;

  return (
    <div
      className={`case-study-modal case-study-drawer-root ${isVisible ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${activeProject.title} Case Study Drawer`}
    >
      {/* Dimmed Blurred Backdrop */}
      <div
        className="case-study-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* App Drawer Sheet (Side drawer on desktop, bottom sheet on mobile) */}
      <div
        ref={sheetRef}
        className="case-study-sheet case-study-drawer-sheet"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile Pull-to-dismiss Handle Bar */}
        <div className="drawer-handle-bar" aria-hidden="true">
          <div className="drawer-handle" />
        </div>

        {/* Sticky App Drawer Header */}
        <header className="case-study-sticky-header">
          <div className="cs-header-meta">
            <span className="cs-num-badge">{activeProject.num || '01'} / CASE STUDY</span>
            <span className="cs-cat-badge">{activeProject.service}</span>
          </div>

          <div className="cs-header-actions">
            {activeProject.slug && (
              <a
                href={`/work/${activeProject.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cs-full-page-btn"
                title="Open standalone case study page in new tab"
              >
                <span>Full Page</span>
                <ArrowUpRight size={13} strokeWidth={2.2} aria-hidden="true" />
              </a>
            )}
            <button
              className="case-study-close-btn"
              onClick={onClose}
              aria-label="Close case study drawer"
              title="Close (Esc)"
            >
              <X size={18} strokeWidth={2.4} aria-hidden="true" />
              <span className="close-kbd-hint">ESC</span>
            </button>
          </div>
        </header>

        {/* Scrollable Drawer Content Body */}
        <div className="case-study-scroll-body case-study-content-body">
          {/* Main Title & Brand */}
          <div className="cs-header">
            <h2 className="cs-title">
              {activeProject.logo && (
                <span className={`cs-title-logo-wrap logo-wrap-${activeProject.id}`}>
                  <img
                    src={activeProject.logo}
                    alt={`${activeProject.title} logo`}
                    className={`cs-title-logo-img logo-img-${activeProject.id}`}
                    loading="lazy"
                  />
                </span>
              )}
              <span className="cs-title-text">{activeProject.title}</span>
            </h2>
            <p className="cs-subtitle">{activeProject.subtitle}</p>
          </div>

          {/* Quick Stats Grid */}
          {activeProject.stats && activeProject.stats.length > 0 && (
            <div className="cs-stats-grid">
              {activeProject.stats.map((st, i) => (
                <div key={i} className="cs-stat-card">
                  <span className="cs-stat-val">{st.val}</span>
                  <span className="cs-stat-lbl">{st.label}</span>
                </div>
              ))}
              <div className="cs-stat-card">
                <span className="cs-stat-val">{activeProject.year || '2026'}</span>
                <span className="cs-stat-lbl">Timeline</span>
              </div>
            </div>
          )}

          {/* Hero Video / Interface Walkthrough */}
          <div className="cs-hero-img-box">
            {activeProject.video ? (
              <video
                ref={videoRef}
                src={activeProject.video}
                poster={activeProject.img}
                loop
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                disableRemotePlayback
                className="cs-hero-video"
                aria-label={`${activeProject.title} website walkthrough`}
              />
            ) : (
              <img
                src={activeProject.img}
                alt={`${activeProject.title} Interface Preview`}
                className="cs-hero-img"
              />
            )}
          </div>

          {/* Overview */}
          <div className="cs-overview-section cs-section">
            <h3 className="cs-sec-title">Project Overview</h3>
            <p className="cs-sec-text">{activeProject.overview}</p>
            {activeProject.overviewHighlights?.length > 0 && (
              <ul className="cs-overview-highlights">
                {activeProject.overviewHighlights.map((hl, i) => (
                  <li key={i}>
                    <span className="cs-hl-check" aria-hidden="true">✓</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Problem & Solution Grid */}
          <div className="cs-two-col-grid">
            <div className="cs-col-box cs-problem-box">
              <span className="cs-col-tag">THE PROBLEM</span>
              <p>{activeProject.problem}</p>
            </div>
            <div className="cs-col-box cs-solution-box">
              <span className="cs-col-tag">THE SOLUTION</span>
              <p>{activeProject.solution}</p>
            </div>
          </div>

          {/* Key Capabilities */}
          <div className="cs-features-section cs-section">
            <h3 className="cs-sec-title">Key Capabilities & Features</h3>
            <ul className="cs-features-grid">
              {activeProject.features?.map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>
          </div>

          {/* Role & Responsibility */}
          <div className="cs-role-box">
            <span className="cs-col-tag">MY ROLE & RESPONSIBILITY</span>
            <p className="cs-role-desc">{activeProject.role}</p>
          </div>

          {/* Tech Stack */}
          <div className="cs-tech-section cs-section">
            <h3 className="cs-sec-title">Technologies Used</h3>
            <div className="cs-tech-chips">
              {activeProject.tech?.map((t, i) => (
                <span className="tech-pill" key={i}>{t}</span>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="cs-actions-row cs-actions-footer">
            <a
              href="#contact"
              onClick={onClose}
              className="btn-primary cs-btn-discuss"
            >
              Discuss Similar Project <span className="btn-arrow">→</span>
            </a>

            {activeProject.liveUrl && !activeProject.liveUrl.includes('github.com') && (
              <a
                href={activeProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary cs-btn-site"
              >
                Visit Live Site <ArrowUpRight size={14} strokeWidth={2.2} />
              </a>
            )}

            {activeProject.repoLink && (
              <a
                href={activeProject.repoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary cs-btn-repo"
              >
                GitHub <ArrowUpRight size={14} strokeWidth={2.2} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
