import React, { useEffect } from 'react';
import { PROJECTS_DATA } from '../../data/projectsData';

export default function CaseStudyModal({ isOpen, projectId, onClose }) {
  const project = projectId ? PROJECTS_DATA[projectId] : null;

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div className={`case-study-modal ${isOpen ? 'active' : ''}`} role="dialog" aria-modal="true">
      <div className="case-study-overlay" onClick={onClose} />
      <div className="case-study-sheet">
        <div className="drawer-handle-bar">
          <div className="drawer-handle" />
        </div>
        <button className="case-study-close-btn" onClick={onClose} aria-label="Close case study">
          &times;
        </button>

        <div className="case-study-content-body">
          <div className="cs-header">
            <div className="cs-badge-row">
              <span className="cs-num-badge">{project.num} / CASE STUDY</span>
              <span className="cs-cat-badge">{project.service}</span>
            </div>
            <h2 className="cs-title">{project.title}</h2>
            <p className="cs-subtitle">{project.subtitle}</p>
          </div>

          <div className="cs-hero-img-box">
            <img src={project.img} alt={`${project.title} Interface Preview`} className="cs-hero-img" />
          </div>

          <div className="cs-overview-section">
            <h3 className="cs-sec-title">Project Overview</h3>
            <p className="cs-sec-text">{project.overview}</p>
          </div>

          <div className="cs-two-col-grid">
            <div className="cs-col-box">
              <span className="cs-col-tag">THE PROBLEM</span>
              <p>{project.problem}</p>
            </div>
            <div className="cs-col-box">
              <span className="cs-col-tag">THE SOLUTION</span>
              <p>{project.solution}</p>
            </div>
          </div>

          <div className="cs-role-box">
            <span className="cs-col-tag">MY ROLE & RESPONSIBILITY</span>
            <p className="cs-role-desc">{project.role}</p>
          </div>

          <div className="cs-features-section">
            <h3 className="cs-sec-title">Key Capabilities & Features</h3>
            <ul className="cs-features-grid">
              {project.features.map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>
          </div>

          <div className="cs-tech-section">
            <h3 className="cs-sec-title">Technologies Used</h3>
            <div className="cs-tech-chips">
              {project.tech.map((t, i) => (
                <span className="tech-pill" key={i}>{t}</span>
              ))}
            </div>
          </div>

          <div className="cs-actions-footer">
            <a href="#contact" onClick={onClose} className="btn-primary">
              Discuss Similar Project <span className="btn-arrow">→</span>
            </a>
            {project.repoLink && (
              <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                View GitHub <span className="btn-arrow">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
