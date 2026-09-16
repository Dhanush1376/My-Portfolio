import React from 'react';

export default function StatementSection() {
  return (
    <section className="statement-section" id="statement">
      <div className="statement-divider-top"></div>
      
      <div className="statement-container">
        <div className="statement-header-row">
          <span className="statement-eyebrow">
            <span className="eyebrow-bullet">•</span> 02 / PHILOSOPHY & MINDSET
          </span>
          <span className="statement-stamp">EST. 2024</span>
        </div>

        <div className="statement-quote-box">
          <h2 className="statement-display-text">
            “I DON'T JUST WRITE CODE.<br />
            I ARCHITECT <span className="statement-highlight">RESILIENT SYSTEMS</span>,<br />
            INTEGRATE <span className="statement-highlight">PRACTICAL AI</span>,<br />
            AND SHIP PRODUCTS THAT DELIVER <span className="statement-accent">REAL UTILITY</span>.”
          </h2>
        </div>

        <div className="statement-footer-row">
          <div className="statement-principles">
            <div className="principle-item">
              <span className="p-num">01</span>
              <span className="p-title">Zero Bloat</span>
              <p className="p-desc">Every dependency and layer must prove its necessity. Fast load times and lean bundles always.</p>
            </div>
            <div className="principle-item">
              <span className="p-num">02</span>
              <span className="p-title">Deterministic Engineering</span>
              <p className="p-desc">Solid error handling, strictly-typed schemas, and verified edge conditions before launch.</p>
            </div>
            <div className="principle-item">
              <span className="p-num">03</span>
              <span className="p-title">Product Mindset</span>
              <p className="p-desc">Code is a means to an outcome. If it doesn't solve the core user pain, it's not finished.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="statement-divider-bottom"></div>
    </section>
  );
}
