import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail } from 'lucide-react';
import '../styles/contact-page.css';
import { useTheme } from '../hooks/useTheme';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ContactForm from '../components/sections/ContactForm';
import CustomCursor from '../components/common/CustomCursor';

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const overlayRef = useRef(null);
  const portalRef = useRef(null);
  const panelRef = useRef(null);
  const badgeRef = useRef(null);
  const descRef = useRef(null);
  const scrollRef = useRef(null);
  const socialDockRef = useRef(null);
  const { theme, toggleTheme, isDark } = useTheme();

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

      // 2. The vibrant orange hero panel descends
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
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
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

      // 5. Kinetic Headline Reveal
      const lines = panelRef.current?.querySelectorAll('.hero-line-inner');
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

      // 6. Reduced description text wipes in smoothly
      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, x: 20, filter: 'blur(4px)' },
          { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' },
          '-=0.55'
        );
      }

      // 7. SCROLL indicator slides up
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

      // 9. Form Section entrance animation (Strictly after the orange hero panel arrives)
      const formSection = overlayRef.current?.querySelector('.studio-contact-section');
      const marquee = overlayRef.current?.querySelector('.studio-bg-marquee');
      const formCard = overlayRef.current?.querySelector('.studio-form-card');
      const infoCol = overlayRef.current?.querySelector('.studio-info-col');

      if (formSection) {
        // Keep the form section completely hidden while the orange hero panel is descending
        gsap.set(formSection, { opacity: 0, y: 35 });

        // Reveal the form section smoothly after the orange panel has finished landing
        tl.to(
          formSection,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            clearProps: 'all',
          },
          'heroPanelArrived+=0.12'
        );

        // Animate marquee text drifting in without overriding watermark opacity
        if (marquee) {
          tl.fromTo(
            marquee,
            { y: 30 },
            { y: 0, duration: 0.85, ease: 'power3.out', clearProps: 'transform' },
            'heroPanelArrived+=0.18'
          );
        }

        // Animate the left info column on desktop
        if (infoCol) {
          tl.fromTo(
            infoCol,
            { opacity: 0, y: 45, filter: 'blur(6px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power4.out', clearProps: 'all' },
            'heroPanelArrived+=0.22'
          );
        }

        // Form card rises smoothly with a sleek Apple-like lift
        if (formCard) {
          tl.fromTo(
            formCard,
            { 
              opacity: 0, 
              y: 65, 
              scale: 0.96,
              filter: 'blur(6px)',
              transformOrigin: '50% 0%'
            },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              filter: 'blur(0px)',
              duration: 1.0, 
              ease: 'power4.out',
              clearProps: 'all'
            },
            'heroPanelArrived+=0.26'
          );

          // Card contents stagger in (step navigation, kicker, chips/fields, button)
          const cardChildren = formCard.querySelectorAll('.mobile-step-header, .pane-kicker, .services-pills-wrap, .mobile-step-nav, .form-fields-stack, .studio-desktop-footer');
          if (cardChildren && cardChildren.length > 0) {
            tl.fromTo(
              cardChildren,
              { opacity: 0, y: 16 },
              { 
                opacity: 1, 
                y: 0, 
                duration: 0.65, 
                stagger: 0.08, 
                ease: 'power3.out',
                clearProps: 'transform'
              },
              'heroPanelArrived+=0.4'
            );
          }
        }
      }
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={`contact-page-wrapper ${isDark ? 'theme-dark' : 'theme-light'}`} ref={overlayRef}>
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Theme Portal Curtain */}
      <div 
        className={`contact-theme-portal ${isDark ? 'portal-dark' : 'portal-light'}`} 
        ref={portalRef} 
      />

      <Navbar theme={theme} toggleTheme={toggleTheme} transparent />

      <div className="contact-hero-panel" ref={panelRef}>
        {/* Architectural Hero Grid Lines */}
        <div className="hero-grid-overlay" aria-hidden="true">
          <div className="hero-grid-pattern" />
        </div>

        <div className="contact-hero-content">
          <div className="contact-hero-badge-wrap">
            <span className="contact-hero-badge" ref={badgeRef}>Get In Touch</span>
          </div>

          <h1 className="contact-hero-headline">
            <div className="hero-line-mask">
              <span className="hero-line-inner">Have an idea or</span>
            </div>
            <div className="hero-line-mask">
              <span className="hero-line-inner">a project in mind?</span>
            </div>
            <div className="hero-line-mask">
              <span className="hero-line-inner">Let’s build together</span>
            </div>
          </h1>

          <p className="contact-hero-desc" ref={descRef}>
            Launching a product or exploring an idea — my inbox is always open.
          </p>
        </div>

        {/* Scroll down trigger */}
        <div 
          className="contact-scroll-indicator" 
          ref={scrollRef}
          onClick={() => {
            const formEl = document.querySelector('#contact-form');
            if (formEl) {
              formEl.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Scroll down to contact form"
        >
          <span className="scroll-text">SCROLL</span>
          <span className="scroll-line-track">
            <span className="scroll-line-runner"></span>
          </span>
        </div>

        {/* Vertical Contact Buttons at Bottom Right */}
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

      <ContactForm />

      <Footer />
    </div>
  );
}
