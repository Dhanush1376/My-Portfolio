import React from 'react';
import { TECH_GROUPS } from '../../data/techStackData';

export default function TechMatrix() {
  const renderIcon = (type) => {
    switch (type) {
      case 'layout':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        );
      case 'server':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        );
      case 'cpu':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        );
      case 'database':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        );
      case 'cloud':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="m4.93 4.93 4.24 4.24" />
            <path d="m14.83 9.17 4.24-4.24" />
            <path d="m14.83 14.83 4.24 4.24" />
            <path d="m9.17 14.83-4.24 4.24" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        );
    }
  };

  return (
    <section className="section tech-section" id="tech">
      <div className="stars-bg" />
      
      <div className="section-header">
        <div className="section-label">05 / Stack</div>
        <div className="section-watermark">TECHNOLOGY</div>
        <h2 className="section-title">TECHNOLOGIES I <span className="text-outline">WORK WITH</span></h2>
      </div>

      <p className="section-lead-text">
        A curated modern technology stack chosen for reliability, developer velocity, and real-world production performance.
      </p>

      {/* Structured Capability Matrix */}
      <div className="tech-matrix-grid">
        {TECH_GROUPS.map((group, idx) => (
          <div className="tech-group-card" key={idx}>
            <div className="tech-group-header">
              <div className="tech-icon-box">{renderIcon(group.icon)}</div>
              <div>
                <h3 className="tech-group-title">{group.title}</h3>
                <span className="tech-group-sub">{group.sub}</span>
              </div>
            </div>
            <div className="tech-item-chips">
              {group.chips.map((chip, cIdx) => (
                <span className="tech-chip" key={cIdx}>{chip}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
