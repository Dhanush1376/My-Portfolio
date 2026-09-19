import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, X, CheckCircle2, Phone, Mail } from 'lucide-react';

import { WHY_SERVICES_DATA } from '../data/whyServicesData';
import { useTheme } from '../hooks/useTheme';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/common/CustomCursor';
import AlternativeDiscoveryHub from '../components/sections/AlternativeDiscoveryHub';
import Contact from '../components/sections/Contact';
import '../styles/services-page.css';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesPage() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [selectedService, setSelectedService] = useState(null);

  const containerRef = useRef(null);
  const portalRef = useRef(null);
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const heroLinesRef = useRef(null);
  const heroDescRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const socialDockRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);

  const totalServices = WHY_SERVICES_DATA.length;

  useEffect(() => {
    window.scrollTo(0, 0);

    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const match = WHY_SERVICES_DATA.find((s) => s.slug === hash);
      if (match) {
        setSelectedService(match);
      }
    }

    // Initialize Lenis smooth scroll for butter-fluid trackpad & mousewheel physics
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
      infinite: false
    });

    lenis.on('scroll', ScrollTrigger.update);
    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(500, 33);

    const ctx = gsap.context(() => {
      // 1. Entrance Animation Sequence (Exact Contact Page Motion)
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Theme portal atmosphere transition
      if (portalRef.current) {
        tl.fromTo(
          portalRef.current,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.inOut' }
        );
      }

      // Peach red hero panel descends with corner morph
      if (heroRef.current) {
        tl.fromTo(
          heroRef.current,
          {
            yPercent: -100,
            borderBottomLeftRadius: '60px',
            borderBottomRightRadius: '60px',
          },
          {
            yPercent: 0,
            borderBottomLeftRadius: '36px',
            borderBottomRightRadius: '36px',
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

      // Navbar drops down gracefully
      const navEl = containerRef.current?.querySelector('.navbar');
      if (navEl) {
        tl.fromTo(
          navEl,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform' },
          '-=0.85'
        );
      }

      // Badge enters with a sleek bounce-pop
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: 15, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' },
          '-=0.75'
        );
      }

      // Kinetic Headline Reveal with roll-up, rotation, skew & blur
      const lines = heroRef.current?.querySelectorAll('.hero-line-inner');
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

      // Refined description text wipes in smoothly
      if (heroDescRef.current) {
        tl.fromTo(
          heroDescRef.current,
          { opacity: 0, x: 20, filter: 'blur(4px)' },
          { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' },
          '-=0.55'
        );
      }

      // SCROLL indicator slides up with letter-spacing expand
      if (scrollIndicatorRef.current) {
        tl.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: 15, letterSpacing: '0.35em' },
          { opacity: 1, y: 0, letterSpacing: '0.2em', duration: 0.7, ease: 'power2.out' },
          '-=0.5'
        );
      }

      // Vertical contact buttons dock stagger-animates in from bottom right with spring pop
      const dockButtons = heroRef.current?.querySelectorAll('.hero-dock-btn');
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

      // 9. All service cards speedly slide up 1-by-1 from below after peach red hero panel arrives
      const stageWrappers = stageRef.current?.querySelectorAll('.card-stage-wrapper');
      if (stageWrappers && stageWrappers.length > 0) {
        gsap.set(stageWrappers, { y: 280, opacity: 0, scale: 0.96 });

        tl.to(
          stageWrappers,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            stagger: 0.07,
            ease: 'power4.out',
            clearProps: 'transform,opacity',
          },
          'heroPanelArrived+=0.06'
        );

        tl.eventCallback('onComplete', () => {
          ScrollTrigger.refresh();
        });
      }

      // 2. PINNED 3D DECK-STACKING SCROLL ENGINE
      const stageEl = stageRef.current;
      if (stageEl) {
        const updateDeckCards = (progress) => {
          const isMobile = window.innerWidth < 860;
          const activeIdx = Math.min(totalServices - 1, Math.max(0, Math.round(progress * (totalServices - 1))));

          for (let i = 0; i < totalServices; i++) {
            const cardEl = cardRefs.current[i];
            if (!cardEl) continue;

            const slot = i - progress * (totalServices - 1);
            let yTransform = '0px';
            let scale = 1;
            let isVisible = true;

            if (slot < 0) {
              // Card is exiting upward: 100% SOLID OPAQUE (strictly NO fading)
              const exitProgress = Math.min(1.3, Math.abs(slot));
              const exitSpeed = isMobile ? 165 : 145;
              const yPercent = -exitProgress * exitSpeed;
              scale = 1 - Math.min(1, exitProgress) * 0.05;
              yTransform = `${yPercent.toFixed(2)}%`;
              // Only hide when completely off-screen above the viewport
              isVisible = exitProgress < 1.05;
            } else if (slot === 0) {
              yTransform = '0px';
              scale = 1;
              isVisible = true;
            } else {
              // Cards waiting in deck behind: visibly tiered like a physical fanned deck!
              const depth = Math.min(3.2, slot);
              const stepPx = isMobile ? 20 : 26;
              const scaleStep = isMobile ? 0.012 : 0.018;
              scale = Math.max(0.92, 1 - depth * scaleStep);

              // Accurately compensate top-anchored scaling so each card tier reveals exactly stepPx of bottom surface
              const cardH = cardEl.offsetHeight || (isMobile ? 480 : 540);
              const yPx = (depth * stepPx) + cardH * (1 - scale);
              yTransform = `${yPx.toFixed(1)}px`;
              isVisible = depth <= 3.2;
            }

            cardEl.style.transform = `translate3d(0, ${yTransform}, 0) scale(${scale.toFixed(4)})`;
            cardEl.style.opacity = '1';
            cardEl.style.visibility = isVisible ? 'visible' : 'hidden';
            cardEl.style.pointerEvents = activeIdx === i ? 'auto' : 'none';
          }
        };

        // Initialize immediately at progress 0
        updateDeckCards(0);

        // Pin the stage for smooth, dramatic multi-page scrolling
        ScrollTrigger.create({
          trigger: stageEl,
          start: 'top top',
          end: `+=${totalServices * 80}%`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            updateDeckCards(self.progress);
          }
        });
      }
    }, containerRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);

    return () => {
      clearTimeout(refreshTimer);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      ctx.revert();
    };
  }, [totalServices]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedService]);

  const scrollToServices = () => {
    const el = stageRef.current;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`services-page-container ${isDark ? 'theme-dark' : 'theme-light'}`} ref={containerRef}>
      <CustomCursor />

      {/* Theme Portal Curtain */}
      <div 
        className={`services-theme-portal ${isDark ? 'portal-dark' : 'portal-light'}`} 
        ref={portalRef} 
      />

      <Navbar theme={theme} toggleTheme={toggleTheme} transparent />

      {/* 1. PEACH RED HERO HEADER (#FF5E57) — Exact Contact Page Architecture & Motion */}
      <div className="services-hero-panel" ref={heroRef}>
        {/* Architectural Hero Grid Lines */}
        <div className="hero-grid-overlay" aria-hidden="true">
          <div className="hero-grid-pattern" />
        </div>

        <div className="services-hero-content">
          <div className="services-hero-badge-wrap">
            <span className="services-hero-badge" ref={badgeRef}>PRODUCTION SERVICES</span>
          </div>

          <h1 className="services-hero-headline" ref={heroLinesRef}>
            <div className="hero-line-mask">
              <span className="hero-line-inner">High-impact systems</span>
            </div>
            <div className="hero-line-mask">
              <span className="hero-line-inner">built to scale.</span>
            </div>
            <div className="hero-line-mask">
              <span className="hero-line-inner">Pick what you need.</span>
            </div>
          </h1>

          <p className="services-hero-desc" ref={heroDescRef}>
            Scroll down to explore each specialization. Select the exact services your product requires, review deliverables, and let’s build something extraordinary together.
          </p>
        </div>

        {/* Scroll down trigger */}
        <div 
          className="services-scroll-indicator" 
          ref={scrollIndicatorRef}
          onClick={scrollToServices}
          role="button"
          tabIndex={0}
          aria-label="Scroll down to services"
        >
          <span className="scroll-text">SCROLL</span>
          <span className="scroll-line-track">
            <span className="scroll-line-runner" />
          </span>
        </div>

        {/* Vertical Contact Buttons at Bottom Right (Exact Contact Page Design) */}
        <aside className="hero-social-dock" ref={socialDockRef} aria-label="Direct contact links">
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

      {/* 2. THE 3D PINNED DECK-STACKING SCROLL STAGE */}
      <section ref={stageRef} className="services-deck-stage" id="services-deck-root">
        <div className="deck-stage-inner">
          {WHY_SERVICES_DATA.map((service, index) => (
            <div
              key={service.slug}
              className="card-stage-wrapper"
              style={{ zIndex: totalServices - index }}
            >
              <div
                ref={(el) => (cardRefs.current[index] = el)}
                className="service-stack-card"
                style={{
                  backgroundColor: service.color
                }}
              >
                {/* Card Top Header */}
                <div className="card-top-bar">
                  <span className="card-tag">
                    {service.num} / {service.display}
                  </span>
                  <span className="card-counter" aria-hidden="true">
                    {service.num} — 06
                  </span>
                </div>

                {/* Card Body Grid (50/50 2-Tone Studio Architecture on Desktop, Airy & Focused on Mobile) */}
                <div className="card-main-grid">
                  {/* Left Column: Title & Subtitle */}
                  <div className="card-col-info">
                    <h2 className="card-service-title">{service.title}</h2>
                    <p className="card-service-subtitle">{service.subtitle}</p>
                  </div>

                  {/* Right Column: Deliverables */}
                  <div className="card-col-deliverables">
                    <span className="section-micro-label">What you get</span>
                    <ul className="deliverables-list">
                      {service.deliverables.map((item, idx) => (
                        <li key={idx} className="deliverable-item">
                          <span className="deliv-num">{String(idx + 1).padStart(2, '0')}</span>
                          <span className="deliv-text">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Action Button */}
                  <div className="card-action-wrap">
                    <button
                      type="button"
                      className="card-cta-btn"
                      onClick={() => setSelectedService(service)}
                      aria-label={`View full details for ${service.title}`}
                    >
                      <span>View more details</span>
                      <span className="btn-circle-arrow">
                        <ArrowUpRight size={14} strokeWidth={2.5} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architectural Section Divider Line */}
      <div className="services-section-divider" aria-hidden="true" />

      {/* Alternative Discovery Hub (Projects Only) */}
      <AlternativeDiscoveryHub mode="projects-only" />

      {/* Editorial Contact Section with Background Marquee & Swipe Button */}
      <Contact variant="peach" />

      {/* 4. SERVICE DETAILS DRAWER / MODAL */}
      {selectedService && (
        <div className="service-modal-overlay" onClick={() => setSelectedService(null)}>
          <div 
            className="service-modal-container" 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selectedService.title}
          >
            {/* Modal Header */}
            <div 
              className="modal-header-banner" 
              style={{ backgroundColor: selectedService.color }}
            >
              <div className="modal-banner-top">
                <span className="modal-badge">{selectedService.num} / {selectedService.display}</span>
                <button 
                  className="modal-close-btn" 
                  onClick={() => setSelectedService(null)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
              <h2 className="modal-service-title">{selectedService.title}</h2>
              <p className="modal-service-subtitle">{selectedService.subtitle}</p>
            </div>

            {/* Modal Scrollable Body */}
            <div className="modal-body-content">
              {/* Detailed Description */}
              <div className="modal-section">
                <span className="modal-section-label">OVERVIEW</span>
                <p className="modal-desc-text">{selectedService.description}</p>
              </div>

              {/* What Changes & What You Get */}
              <div className="modal-two-col">
                <div className="modal-col">
                  <span className="modal-section-label">WHAT CHANGES</span>
                  <ul className="modal-bullet-list">
                    {selectedService.outcomes.map((out, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={16} className="modal-bullet-icon" />
                        <span>{out}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="modal-col">
                  <span className="modal-section-label">WHAT YOU GET</span>
                  <ul className="modal-numbered-list">
                    {selectedService.deliverables.map((deliv, idx) => (
                      <li key={idx}>
                        <span className="modal-item-num">{String(idx + 1).padStart(2, '0')}</span>
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Execution Process */}
              <div className="modal-section">
                <span className="modal-section-label">EXECUTION PROCESS</span>
                <div className="modal-process-grid">
                  {selectedService.process.map((step, idx) => (
                    <div key={idx} className="process-step-card">
                      <span className="process-step-num">0{idx + 1}</span>
                      <p className="process-step-text">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools & Stack */}
              <div className="modal-section">
                <span className="modal-section-label">CORE TOOLS &amp; TECHNOLOGIES</span>
                <div className="modal-tools-tags">
                  {selectedService.tools.map((t, idx) => (
                    <span key={idx} className="tool-chip">{t}</span>
                  ))}
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="modal-footer-cta">
                <Link 
                  to="/contact" 
                  className="modal-book-btn"
                  onClick={() => setSelectedService(null)}
                >
                  <span>Start a project with {selectedService.display}</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
