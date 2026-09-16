import React, { useState } from 'react';
import { SERVICES_DATA } from '../../data/servicesData';

export default function Services() {
  const [activeRow, setActiveRow] = useState(null);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (window.navigateToSection) {
      window.navigateToSection(targetId);
    } else {
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="section capabilities-editorial-section" id="capabilities">
      <div className="capabilities-header">
        <div className="header-left">
          <span className="section-label">• CAPABILITIES &amp; SYSTEMS</span>
          <h2 className="section-title">
            WHAT I <span className="title-accent">BUILD.</span>
          </h2>
        </div>
        <p className="capabilities-header-desc">
          Engineering capabilities organized by technical scope rather than a generic badge list.
          Built for scale, clarity, and real-world business utility.
        </p>
      </div>

      {/* Editorial Interactive Capability Accordion / List */}
      <div className="capabilities-editorial-list">
        {SERVICES_DATA.map((service, index) => {
          const isExpanded = activeRow === service.id;
          return (
            <div
              key={service.id}
              className={`capability-row ${isExpanded ? 'expanded' : ''}`}
              onMouseEnter={() => setActiveRow(service.id)}
              onClick={() => setActiveRow(isExpanded ? null : service.id)}
            >
              <div className="cap-row-top">
                <div className="cap-num">{service.num}</div>
                <div className="cap-title-block">
                  <h3 className="cap-name">{service.name}</h3>
                  <p className="cap-summary">{service.summary}</p>
                </div>
                <div className="cap-indicator">
                  <span className="cap-plus">{isExpanded ? '—' : '+'}</span>
                </div>
              </div>

              {/* Expandable Technical Details */}
              <div className="cap-detail-drawer">
                <div className="cap-detail-grid">
                  <div className="cap-deliverables-col">
                    <span className="cap-detail-label">DELIVERABLES</span>
                    <p className="cap-deliverables-text">{service.deliverables}</p>
                  </div>
                  <div className="cap-tech-col">
                    <span className="cap-detail-label">CORE TECHNOLOGIES</span>
                    <div className="cap-tech-tags">
                      {service.tech.map((t, idx) => (
                        <span className="cap-tech-pill" key={idx}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="cap-proof-col">
                    <span className="cap-detail-label">{service.proofLabel}</span>
                    <a
                      href="#work"
                      className="cap-proof-link"
                      onClick={(e) => handleNavClick(e, '#work')}
                    >
                      {service.proofText}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
