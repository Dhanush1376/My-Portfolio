import React from 'react';
import { PROCESS_DATA } from '../../data/processData';

export default function Process() {
  return (
    <section className="section process-section" id="process">
      <div className="stars-bg" />
      
      <div className="process-header">
        <div className="section-label">03 / Process</div>
        <div className="section-watermark">METHODOLOGY</div>
        <h2 className="section-title">HOW I <span className="text-outline">BUILD</span></h2>
      </div>

      <p className="section-lead-text">
        A transparent, disciplined development workflow built to eliminate guesswork, mitigate technical risks, and deliver polished software on schedule.
      </p>

      {/* Asymmetric Phased Roadmap */}
      <div className="process-roadmap">
        {PROCESS_DATA.map((step, idx) => (
          <div className="process-step" key={step.num}>
            <div className="step-num-col">
              <span className="step-num">{step.num}</span>
              <div className={`step-connector ${idx === PROCESS_DATA.length - 1 ? 'last-connector' : ''}`} />
            </div>
            <div className={`step-card ${step.highlight ? 'highlight-step' : ''}`}>
              <div className="step-badge">{step.phase}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
              <div className="step-deliverable">
                <span className="deliv-label">OUTPUT:</span> {step.deliverable}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
