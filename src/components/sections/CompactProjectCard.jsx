import React from 'react';

export default function CompactProjectCard({ project, onOpenCaseStudy }) {
  return (
    <article
      className="compact-card"
      id={`project-${project.id}`}
      data-index={project.num}
      data-project-id={project.id}
    >
      <div className="compact-visual">
        <img
          src={project.img}
          alt={`${project.title} Preview`}
          className="compact-img"
          loading="lazy"
        />
      </div>
      <div className="compact-content">
        <div className="compact-meta">
          <span className="compact-num">{project.num}</span>
          <span className="compact-cat">{project.service}</span>
        </div>
        <h4 className="compact-title">{project.title}</h4>
        <p className="compact-desc">{project.subtitle}</p>
        <div className="compact-tech">
          {project.tech.map((t, idx) => (
            <span key={idx}>{t}</span>
          ))}
        </div>
        <button
          type="button"
          className="compact-link open-case-study-btn"
          onClick={() => onOpenCaseStudy(project.id)}
        >
          View Technical Brief →
        </button>
      </div>
    </article>
  );
}
