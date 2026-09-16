import React from 'react';

export default function ProjectCard({ project, onOpenCaseStudy, isFeatured = false }) {
  return (
    <article
      className={`project-editorial-card ${isFeatured ? 'featured-card' : 'supporting-card'}`}
      id={`project-${project.id}`}
      data-index={project.num}
      data-project-id={project.id}
    >
      <div className="project-card-meta-top">
        <span className="project-num-tag">{project.tag}</span>
        <span className="project-service-badge">{project.service}</span>
      </div>

      <div className="project-card-header-group">
        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-subtitle">{project.subtitle}</p>
      </div>

      <div className="project-visual-wrapper">
        <div className="browser-chrome">
          <div className="browser-dot close-dot" />
          <div className="browser-dot min-dot" />
          <div className="browser-dot max-dot" />
          <div className="browser-address">{project.liveUrl}</div>
        </div>
        <div className="project-img-container">
          <img
            src={project.img}
            alt={`${project.title} Preview`}
            className="project-showcase-img"
            loading="lazy"
          />
          <div className="project-img-overlay">
            <button
              type="button"
              className="overlay-case-btn open-case-study-btn"
              onClick={() => onOpenCaseStudy(project.id)}
            >
              Explore Case Study →
            </button>
          </div>
        </div>
      </div>

      <div className="project-card-details">
        <div className="project-problem-solution-grid">
          <div className="ps-col">
            <span className="ps-label">THE PROBLEM</span>
            <p className="ps-text">{project.problem}</p>
          </div>
          <div className="ps-col">
            <span className="ps-label">THE SOLUTION</span>
            <p className="ps-text">{project.solution}</p>
          </div>
        </div>

        {project.features && project.features.length > 0 && (
          <div className="project-key-features">
            <span className="features-label">KEY CAPABILITIES DELIVERED:</span>
            <ul className="features-list">
              {project.features.map((feat, idx) => (
                <li key={idx}>{feat}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="project-card-footer">
          <div className="project-tech-pills">
            {project.tech.map((t, idx) => (
              <span className="tech-pill" key={idx}>{t}</span>
            ))}
          </div>
          <div className="project-actions">
            <button
              type="button"
              className="btn-primary open-case-study-btn"
              onClick={() => onOpenCaseStudy(project.id)}
            >
              View Case Study <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
