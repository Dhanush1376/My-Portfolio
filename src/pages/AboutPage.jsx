import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Terminal, Cpu, Layers, ShieldCheck, ArrowUpRight, Compass, Code2, Phone, Mail } from 'lucide-react';
import '../styles/about-page.css';
import { useTheme } from '../hooks/useTheme';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/common/CustomCursor';
import Contact from '../components/sections/Contact';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const overlayRef = useRef(null);
  const portalRef = useRef(null);
  const panelRef = useRef(null);
  const badgeRef = useRef(null);
  const descRef = useRef(null);
  const scrollRef = useRef(null);
  const bentoRef = useRef(null);

  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  // Interactive Tech Arsenal tab state
  const [activeArsenalTab, setActiveArsenalTab] = useState('fullstack');

  const arsenalCategories = {
    fullstack: {
      name: 'Frontend & UI',
      desc: 'Sub-second reactive interfaces with fluid motion physics.',
      chips: [
        'React 18 / Vite',
        'TypeScript',
        'Vanilla CSS3',
        'GSAP / Motion',
        'State Engines',
        'Web Vitals'
      ]
    },
    ai: {
      name: 'AI & Systems',
      desc: 'Deterministic RAG pipelines & dense vector search.',
      chips: [
        'Python 3.11',
        'LangChain',
        'FastAPI',
        'ChromaDB',
        'Embeddings',
        'Semantic Search'
      ]
    },
    backend: {
      name: 'Backend & APIs',
      desc: 'Low-latency async microservices & databases.',
      chips: [
        'Node.js',
        'FastAPI',
        'PostgreSQL',
        'MongoDB',
        'WebSockets',
        'Auth & JWT'
      ]
    },
    infra: {
      name: 'Cloud & DevOps',
      desc: 'Containerization & production CDN pipelines.',
      chips: [
        'Docker',
        'Cloudinary CDN',
        'Vercel / Cloud Run',
        'GitHub Actions',
        'Linux / Bash',
        'CI/CD'
      ]
    }
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Theme portal atmosphere transition
      if (portalRef.current) {
        tl.fromTo(
          portalRef.current,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.inOut' }
        );
      }

      // 2. The vibrant Solar Yellow hero panel descends with corner morph
      if (panelRef.current) {
        tl.fromTo(
          panelRef.current,
          {
            yPercent: -100,
            borderBottomLeftRadius: '60px',
            borderBottomRightRadius: '60px',
          },
          {
            yPercent: 0,
            borderBottomLeftRadius: '32px',
            borderBottomRightRadius: '32px',
            duration: 1.15,
            ease: 'power4.out',
            clearProps: 'yPercent',
          },
          '-=0.15'
        );
        tl.addLabel('heroPanelArrived');
      } else {
        tl.addLabel('heroPanelArrived');
      }

      // 3. Navbar drops down gracefully
      const navEl = overlayRef.current?.querySelector('.navbar');
      if (navEl) {
        tl.fromTo(
          navEl,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform' },
          '-=0.85'
        );
      }

      // 4. Badge enters with a sleek bounce-pop
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: 15, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' },
          '-=0.75'
        );
      }

      // 5. Kinetic Headline Reveal with line masks and de-blur
      const lines = panelRef.current?.querySelectorAll('.about-line-inner');
      if (lines && lines.length > 0) {
        tl.fromTo(
          lines,
          {
            yPercent: 125,
            opacity: 0,
            rotate: 2.2,
            skewY: 1.2,
            filter: 'blur(5px)',
          },
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            skewY: 0,
            filter: 'blur(0px)',
            duration: 1.05,
            stagger: 0.12,
            ease: 'power4.out',
          },
          '-=0.65'
        );
      }

      // 6. Descriptive statement text wipes in smoothly
      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, x: 20, filter: 'blur(4px)' },
          { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' },
          '-=0.55'
        );
      }

      // 7. Scroll indicator slides up
      if (scrollRef.current) {
        tl.fromTo(
          scrollRef.current,
          { opacity: 0, y: 15, letterSpacing: '0.35em' },
          { opacity: 1, y: 0, letterSpacing: '0.2em', duration: 0.7, ease: 'power2.out' },
          '-=0.5'
        );
      }

      // 8. Vertical contact buttons dock stagger-animates in from bottom right with spring pop
      const dockButtons = panelRef.current?.querySelectorAll('.hero-dock-btn');
      if (dockButtons && dockButtons.length > 0) {
        tl.fromTo(
          dockButtons,
          { opacity: 0, x: 25, scale: 0.5, rotate: 15 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            rotate: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: 'back.out(2.2)',
          },
          '-=0.55'
        );
      }



      // 9. Bento Grid entrance animation strictly after hero landing
      const bentoSection = overlayRef.current?.querySelector('.about-studio-section');
      const bentoCards = overlayRef.current?.querySelectorAll('.bento-card');

      if (bentoSection) {
        gsap.set(bentoSection, { opacity: 0, y: 35 });
        tl.to(
          bentoSection,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            clearProps: 'all',
          },
          'heroPanelArrived+=0.12'
        );

        if (bentoCards && bentoCards.length > 0) {
          tl.fromTo(
            bentoCards,
            { opacity: 0, y: 40, scale: 0.98, filter: 'blur(4px)' },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.9,
              stagger: 0.1,
              ease: 'power4.out',
              clearProps: 'all',
            },
            'heroPanelArrived+=0.24'
          );
        }
      }
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  const scrollToStory = () => {
    const el = document.querySelector('#aboutStory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  return (
    <div className={`about-page-wrapper ${isDark ? 'theme-dark' : 'theme-light'}`} ref={overlayRef}>
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Theme Portal Curtain */}
      <div className="about-theme-portal" ref={portalRef} />

      {/* Top Navigation Bar */}
      <Navbar theme={theme} toggleTheme={toggleTheme} transparent />

      {/* Radiant Solar Yellow Architectural Hero Drop Panel */}
      <div className="about-hero-panel" ref={panelRef}>
        {/* Subtle Architectural Grid Pattern */}
        <div className="about-grid-overlay" aria-hidden="true">
          <div className="about-grid-pattern" />
        </div>

        <div className="about-hero-content">
          <div className="about-hero-badge-wrap">
            <span className="about-hero-badge" ref={badgeRef}>
              ABOUT ME
            </span>
          </div>

          <h1 className="about-hero-headline">
            <div className="about-line-mask">
              <span className="about-line-inner">Systems architect.</span>
            </div>
            <div className="about-line-mask">
              <span className="about-line-inner">AI engineer.</span>
            </div>
            <div className="about-line-mask">
              <span className="about-line-inner">Built for utility.</span>
            </div>
          </h1>

          <div className="about-hero-tags" ref={descRef}>
            <span>Full-Stack</span>
            <span className="tag-pipe">|</span>
            <span>AI Systems</span>
            <span className="tag-pipe">|</span>
            <span>Production Software</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="about-scroll-indicator"
          ref={scrollRef}
          onClick={scrollToStory}
          role="button"
          tabIndex={0}
          aria-label="Scroll down to story"
        >
          <span className="scroll-text">DISCOVER</span>
          <span className="scroll-line-track">
            <span className="scroll-line-runner" />
          </span>
        </div>

        {/* Vertical Contact Buttons at Bottom Right (like Contact Page) */}
        <aside className="hero-social-dock" aria-label="Direct contact links">
          <a
            href="tel:+919154691315"
            className="hero-dock-btn"
            aria-label="Call Directly"
          >
            <Phone size={18} />
            <span className="hero-dock-tooltip">Call</span>
          </a>

          <a
            href="https://wa.me/919154691315?text=Hi%20Dhanush!%20I'd%20like%20to%20discuss%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="hero-dock-btn"
            aria-label="WhatsApp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
              <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
            </svg>
            <span className="hero-dock-tooltip">WhatsApp</span>
          </a>

          <a
            href="mailto:dhanush1376@gmail.com"
            className="hero-dock-btn"
            aria-label="Email Directly"
          >
            <Mail size={18} />
            <span className="hero-dock-tooltip">Email</span>
          </a>
        </aside>
      </div>

      {/* Studio Story & Interactive Bento Narrative Matrix */}
      <section className="about-studio-section" id="aboutStory" ref={bentoRef}>
        {/* Ambient Marquee Watermark */}
        <div className="about-bg-marquee" aria-hidden="true">
          <div className="about-marquee-track">
            <span>ABOUT • STORY • ABOUT • STORY • ABOUT • STORY • ABOUT • STORY • </span>
            <span>ABOUT • STORY • ABOUT • STORY • ABOUT • STORY • ABOUT • STORY • </span>
          </div>
        </div>

        <div className="about-section-header">
          <div className="tilted-tag-wrapper">
            <span className="tilted-tag">01 / IDENTITY &amp; PHILOSOPHY</span>
          </div>
          <h2 className="about-header-title">
            ENGINEERED WITH<br />
            <span className="title-highlight">INTENTION.</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="about-bento-grid">
          {/* Bento Card 1: Core Philosophy */}
          <div className="bento-card bento-philosophy">
            <div>
              <div className="bento-card-top">
                <span className="bento-card-tag">01 // MANIFESTO</span>
                <div className="bento-card-icon">
                  <Sparkles size={18} />
                </div>
              </div>

              <h3 className="philosophy-title">
                “Code is an outcome. If it doesn’t create <span className="quote-accent">real utility</span>, it’s not finished.”
              </h3>
            </div>

            <div className="philosophy-pillars">
              <div className="pillar-col">
                <span className="pillar-num">01</span>
                <span className="pillar-name">Zero Bloat</span>
                <span className="pillar-desc">Lean bundles &amp; sub-second loads.</span>
              </div>
              <div className="pillar-col">
                <span className="pillar-num">02</span>
                <span className="pillar-name">Deterministic AI</span>
                <span className="pillar-desc">Grounded RAG over hallucinations.</span>
              </div>
              <div className="pillar-col">
                <span className="pillar-num">03</span>
                <span className="pillar-name">Product Mindset</span>
                <span className="pillar-desc">Real business utility &amp; uptime.</span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Live Telemetry Metrics */}
          <div className="bento-card bento-telemetry">
            <div>
              <div className="bento-card-top">
                <span className="bento-card-tag">02 // TELEMETRY</span>
                <div className="bento-card-icon">
                  <ShieldCheck size={18} />
                </div>
              </div>

              <h3 className="telemetry-header-title">Verified Benchmarks</h3>
              <p className="telemetry-subtitle">Production telemetry across deployed systems</p>

              <div className="telemetry-deck">
                <div className="telemetry-row">
                  <div className="telemetry-label-group">
                    <span className="telemetry-label">API Median Latency</span>
                    <span className="telemetry-sublabel">FastAPI &amp; Edge handlers</span>
                  </div>
                  <span className="telemetry-val">&lt; 18ms</span>
                </div>

                <div className="telemetry-row">
                  <div className="telemetry-label-group">
                    <span className="telemetry-label">Visual Load Time</span>
                    <span className="telemetry-sublabel">Cloudinary CDN pipeline</span>
                  </div>
                  <span className="telemetry-val">&lt; 1.2s</span>
                </div>

                <div className="telemetry-row">
                  <div className="telemetry-label-group">
                    <span className="telemetry-label">Test Suite Reliability</span>
                    <span className="telemetry-sublabel">Edge case coverage</span>
                  </div>
                  <span className="telemetry-val">99.2%</span>
                </div>

                <div className="telemetry-row">
                  <div className="telemetry-label-group">
                    <span className="telemetry-label">Hallucination Mitigation</span>
                    <span className="telemetry-sublabel">ChromaDB semantic search</span>
                  </div>
                  <span className="telemetry-val">&lt; 2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Interactive Technical Arsenal */}
          <div className="bento-card bento-arsenal">
            <div>
              <div className="bento-card-top">
                <span className="bento-card-tag">03 // TECHNICAL ARSENAL</span>
                <div className="bento-card-icon">
                  <Terminal size={18} />
                </div>
              </div>

              <div className="arsenal-header">
                <h3 className="arsenal-title">{arsenalCategories[activeArsenalTab].name}</h3>
                <p className="arsenal-desc">{arsenalCategories[activeArsenalTab].desc}</p>
              </div>

              {/* Category Switcher Tabs */}
              <div className="arsenal-tabs" role="tablist">
                <button
                  className={`arsenal-tab-btn ${activeArsenalTab === 'fullstack' ? 'active' : ''}`}
                  onClick={() => setActiveArsenalTab('fullstack')}
                  role="tab"
                  aria-selected={activeArsenalTab === 'fullstack'}
                >
                  Frontend &amp; UI
                </button>
                <button
                  className={`arsenal-tab-btn ${activeArsenalTab === 'ai' ? 'active' : ''}`}
                  onClick={() => setActiveArsenalTab('ai')}
                  role="tab"
                  aria-selected={activeArsenalTab === 'ai'}
                >
                  AI &amp; RAG Systems
                </button>
                <button
                  className={`arsenal-tab-btn ${activeArsenalTab === 'backend' ? 'active' : ''}`}
                  onClick={() => setActiveArsenalTab('backend')}
                  role="tab"
                  aria-selected={activeArsenalTab === 'backend'}
                >
                  Backend &amp; APIs
                </button>
                <button
                  className={`arsenal-tab-btn ${activeArsenalTab === 'infra' ? 'active' : ''}`}
                  onClick={() => setActiveArsenalTab('infra')}
                  role="tab"
                  aria-selected={activeArsenalTab === 'infra'}
                >
                  Cloud &amp; DevOps
                </button>
              </div>

              {/* Dynamic Tech Chips */}
              <div className="arsenal-chips-grid">
                {arsenalCategories[activeArsenalTab].chips.map((chip, idx) => (
                  <div key={idx} className="tech-chip">
                    <span className="tech-chip-dot" />
                    <span>{chip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bento Card 4: Trajectory & Milestones */}
          <div className="bento-card bento-trajectory">
            <div>
              <div className="bento-card-top">
                <span className="bento-card-tag">04 // TRAJECTORY</span>
                <div className="bento-card-icon">
                  <Compass size={18} />
                </div>
              </div>

              <h3 className="trajectory-title">Milestones &amp; Work</h3>

              <div className="milestones-timeline">
                <div className="milestone-item">
                  <span className="milestone-year">2026 // CURRENT</span>
                  <h4 className="milestone-heading">Production Storefront</h4>
                  <p className="milestone-desc">
                    Siri Arts &amp; Crafts: sub-second CDN storefront &amp; WhatsApp funnel.
                  </p>
                </div>

                <div className="milestone-item">
                  <span className="milestone-year">2025</span>
                  <h4 className="milestone-heading">RAG Intelligence</h4>
                  <p className="milestone-desc">
                    Tutorboard: ChromaDB semantic vector search &amp; zero-hallucination pipelines.
                  </p>
                </div>

                <div className="milestone-item">
                  <span className="milestone-year">2024</span>
                  <h4 className="milestone-heading">Core Systems Architecture</h4>
                  <p className="milestone-desc">
                    High-concurrency microservices &amp; reactive editorial interfaces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Contact Section with Background Marquee & Swipe Button */}
      <Contact variant="yellow" />

      {/* Footer */}
      <Footer />
    </div>
  );
}
