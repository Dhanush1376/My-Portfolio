import React from 'react';
import { Link } from 'react-router-dom';

export default function StatementSection() {
  return (
    <section className="statement-section" id="statement" aria-label="Philosophy and Mindset">
      <div className="statement-divider-top" aria-hidden="true"></div>
      
      <div className="statement-container">
        <div className="statement-main-layout">
          {/* Left Column: Eyebrow label & Established year */}
          <div className="statement-left-col">
            <span className="statement-eyebrow">
              <span className="eyebrow-bullet" aria-hidden="true">•</span> 02 / PHILOSOPHY &amp; MINDSET
            </span>
            <span className="statement-stamp">EST. 2024</span>
          </div>

          {/* Right Column: Statement, Pill CTAs, and Principles Grid */}
          <div className="statement-right-col">
            <div className="statement-quote-box">
              <h2 className="statement-display-text">
                “I DON'T JUST WRITE CODE.<br />
                I ARCHITECT <span className="statement-highlight">RESILIENT SYSTEMS</span>,<br />
                INTEGRATE <span className="statement-highlight">PRACTICAL AI</span>,<br />
                AND SHIP PRODUCTS THAT DELIVER <span className="statement-accent">REAL UTILITY</span>.”
              </h2>
            </div>

            {/* Actions Row with Two Pill Buttons matching Studio Layout */}
            <div className="statement-actions-row">
              <Link 
                to="/about" 
                className="statement-btn-primary" 
                id="btn-statement-about"
                aria-label="View Dhanush's full about story and philosophy"
              >
                <span>About Dhanush</span>
                <span className="statement-btn-circle-icon" aria-hidden="true">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>

              <Link 
                to="/contact" 
                className="statement-btn-secondary" 
                id="btn-statement-contact"
                aria-label="Start a project with Dhanush"
              >
                <span>Start a project</span>
                <span className="statement-btn-arrow-icon" aria-hidden="true">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>
            </div>

            {/* 3 Core Principles Grid */}
            <div className="statement-principles">
              <div className="principle-item">
                <div className="principle-header">
                  <span className="p-num">01</span>
                </div>
                <h3 className="p-title">Zero Bloat</h3>
                <p className="p-desc">
                  Every dependency and layer must prove its necessity. Fast load times and lean bundles always.
                </p>
              </div>

              <div className="principle-item">
                <div className="principle-header">
                  <span className="p-num">02</span>
                </div>
                <h3 className="p-title">Deterministic Engineering</h3>
                <p className="p-desc">
                  Solid error handling, strictly-typed schemas, and verified edge conditions before launch.
                </p>
              </div>

              <div className="principle-item">
                <div className="principle-header">
                  <span className="p-num">03</span>
                </div>
                <h3 className="p-title">Product Mindset</h3>
                <p className="p-desc">
                  Code is a means to an outcome. If it doesn't solve the core user pain, it's not finished.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="statement-divider-bottom" aria-hidden="true"></div>
    </section>
  );
}
