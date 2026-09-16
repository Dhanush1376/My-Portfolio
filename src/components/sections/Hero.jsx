import React from 'react';

export default function Hero() {
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
    <section className="hero" id="hero">
      <div className="hero-inner">
        {/* Left Column: Asymmetric Editorial Typography & CTAs */}
        <div className="hero-main-col">
          <div className="hero-eyebrow-row">
            <span className="hero-eyebrow">
              <span className="eyebrow-dot"></span>
              DHANUSH // CREATIVE TECHNOLOGIST
            </span>
            <span className="hero-location">BENGALURU, INDIA</span>
          </div>

          <h1 className="hero-display-title">
            <span className="title-row">BUILDING</span>
            <span className="title-row">DIGITAL PRODUCTS</span>
            <span className="title-row accent-row">& INTELLIGENT SYSTEMS</span>
            <span className="title-row">THAT MATTER<span className="title-period">.</span></span>
          </h1>

          <p className="hero-lead-copy">
            Full-Stack Developer and AI/ML Builder turning complex systems, generative models,
            and ambitious product visions into production-grade software people actually use.
          </p>

          <div className="hero-cta-row">
            <a
              href="#work"
              className="studio-pill-btn studio-pill-primary"
              onClick={(e) => handleNavClick(e, '#work')}
              id="heroWorkBtn"
            >
              <span>View Selected Work</span>
              <span className="pill-arrow-circle">↗</span>
            </a>

            <a
              href="#contact"
              className="studio-pill-btn studio-pill-ghost"
              onClick={(e) => handleNavClick(e, '#contact')}
              id="heroContactBtn"
            >
              <span>Start a Project ↗</span>
            </a>
          </div>

          <div className="hero-meta-strip">
            <div className="meta-item">
              <span className="meta-label">FOCUS</span>
              <span className="meta-val">Full-Stack • AI / ML Systems</span>
            </div>
            <div className="meta-divider"></div>
            <div className="meta-item">
              <span className="meta-label">STATUS</span>
              <span className="meta-val status-active">
                <span className="status-ping"></span> Available for Projects
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Signature Stepped Notched Showcase Card */}
        <div className="hero-visual-col">
          <div className="hero-stepped-card">
            {/* Top-Right Notch containing Category Pills */}
            <div className="stepped-notch-rack">
              <span className="notch-pill">Architecture</span>
              <span className="notch-pill">AI / RAG</span>
              <span className="notch-pill">Full-Stack</span>
            </div>

            {/* Main Stepped Card Body */}
            <div className="stepped-card-surface">
              <div className="surface-header">
                <div className="window-dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="surface-title">dhanush-system-core.ts</div>
                <div className="surface-badge">v2.6 PRODUCTION</div>
              </div>

              {/* Code / Architecture Telemetry Preview */}
              <div className="surface-code-view">
                <pre className="code-block">
                  <code>
                    <span className="c-keyword">const</span> <span className="c-var">developer</span> = &#123;{'\n'}
                    {'  '}name: <span className="c-str">"Dhanush"</span>,{'\n'}
                    {'  '}role: <span className="c-str">"Full-Stack & AI Builder"</span>,{'\n'}
                    {'  '}stack: [<span className="c-str">"React"</span>, <span className="c-str">"Node"</span>, <span className="c-str">"FastAPI"</span>, <span className="c-str">"ChromaDB"</span>],{'\n'}
                    {'  '}mission: <span className="c-str">"Engineer scalable, real-world utility"</span>{'\n'}
                    &#125;;{'\n\n'}
                    <span className="c-comment">// System Status: Operational</span>{'\n'}
                    <span className="c-func">await</span> system.<span className="c-call">initializePipeline</span>(&#123;{'\n'}
                    {'  '}concurrency: <span className="c-num">Infinity</span>,{'\n'}
                    {'  '}precision: <span className="c-str">"Deterministic"</span>{'\n'}
                    &#125;);
                  </code>
                </pre>
              </div>

              {/* Live Telemetry Stats in Card Footer */}
              <div className="surface-telemetry">
                <div className="telemetry-card">
                  <span className="tel-val">99.2%</span>
                  <span className="tel-label">Test Coverage</span>
                </div>
                <div className="telemetry-card">
                  <span className="tel-val">&lt; 18ms</span>
                  <span className="tel-label">Avg API Latency</span>
                </div>
                <div className="telemetry-card">
                  <span className="tel-val">5+</span>
                  <span className="tel-label">Flagship Systems</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
