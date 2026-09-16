import React, { useState } from 'react';

export default function About() {
  const [isCredsOpen, setIsCredsOpen] = useState(false);

  return (
    <section className="section about-editorial-section" id="about">
      <div className="about-editorial-grid">
        {/* Left Column: Editorial Bio, Mindset & Verified Background */}
        <div className="about-content-col">
          <div className="about-header-group">
            <span className="section-label">• 05 / ABOUT ME</span>
            <h2 className="about-main-headline">
              BUILDER AT THE INTERSECTION OF <span className="title-accent">ENGINEERING RIGOR</span> &amp; PRODUCT INTENT.
            </h2>
          </div>

          <div className="about-body-text">
            <p className="about-lead">
              I am Dhanush, a Computer Science &amp; Engineering undergraduate and software engineer specializing in modern full-stack web products and production AI/ML systems.
            </p>
            <p className="about-secondary">
              Rather than treating development as isolated lines of code, I approach software from the user outcome backwards. Whether I'm configuring high-concurrency WebSocket channels, designing dense vector embeddings for RAG retrieval, or polishing micro-interactions in the browser, my goal is always to engineer fast, resilient, and intuitive products.
            </p>
          </div>

          {/* Key Attribute Badges */}
          <div className="about-attribute-pills">
            <div className="attr-pill">
              <span className="attr-dot"></span>
              <span>B.Tech CSE Undergrad</span>
            </div>
            <div className="attr-pill">
              <span className="attr-dot"></span>
              <span>Full-Stack &amp; AI Builder</span>
            </div>
            <div className="attr-pill active-pill">
              <span className="attr-dot active-dot"></span>
              <span>Available for Contract Builds</span>
            </div>
          </div>

          {/* Academic & Verified Credentials Collapsible Accordion */}
          <div className="about-credentials-box">
            <button
              type="button"
              className={`creds-toggle-bar ${isCredsOpen ? 'open' : ''}`}
              onClick={() => setIsCredsOpen(prev => !prev)}
              aria-expanded={isCredsOpen}
            >
              <span className="creds-label">Academic Foundations &amp; Verified Certifications</span>
              <span className="creds-chevron">{isCredsOpen ? '▲' : '▼'}</span>
            </button>

            {isCredsOpen && (
              <div className="creds-expanded-panel">
                <div className="cred-entry">
                  <span className="cred-tag">DEGREE</span>
                  <h4 className="cred-school">B.Tech in Computer Science &amp; Engineering</h4>
                  <p className="cred-institute">Lovely Professional University (2023 – 2027)</p>
                  <p className="cred-focus">Core Curriculum: Distributed Systems, Algorithms &amp; Data Structures, Database Architecture, Machine Learning, Computer Networks.</p>
                </div>

                <div className="cred-entry">
                  <span className="cred-tag">CREDENTIALS</span>
                  <ul className="cred-list">
                    <li>AI &amp; Machine Learning for Real-World Problem Solving — CPE</li>
                    <li>Generative AI &amp; LLM Systems Architecture</li>
                    <li>Full-Stack Software Engineering Specialization</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Signature Stepped Frame with Real Portrait */}
        <div className="about-portrait-col">
          <div className="portrait-stepped-frame">
            {/* Top Cutout Notch Tags */}
            <div className="portrait-notch-tags">
              <span className="notch-pill">Engineer</span>
              <span className="notch-pill">Builder</span>
            </div>

            <div className="portrait-img-viewport">
              <img
                src="/assets/portrait.jpg"
                alt="Dhanush - Full-Stack Developer & AI Systems Builder"
                className="portrait-img"
                loading="lazy"
              />
              <div className="portrait-glass-caption">
                <span className="caption-name">DHANUSH</span>
                <span className="caption-title">Full-Stack &amp; AI Developer</span>
              </div>
            </div>

            {/* Developer DNA Principles */}
            <div className="developer-dna-card">
              <div className="dna-header">
                <span className="dna-title">DEVELOPER PRINCIPLES</span>
                <span className="dna-badge">CORE DNA</span>
              </div>

              <div className="dna-items-list">
                <div className="dna-item">
                  <span className="dna-num">01</span>
                  <div>
                    <strong>Direct Communication</strong>
                    <p>No layers or agency noise. You work directly with the builder who writes the code.</p>
                  </div>
                </div>
                <div className="dna-item">
                  <span className="dna-num">02</span>
                  <div>
                    <strong>Clean Architecture</strong>
                    <p>Maintainable, strictly modular code designed to scale without technical debt.</p>
                  </div>
                </div>
                <div className="dna-item">
                  <span className="dna-num">03</span>
                  <div>
                    <strong>Full Lifecycle Ownership</strong>
                    <p>From initial Figma layout and schema modeling to cloud deployment and monitoring.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
