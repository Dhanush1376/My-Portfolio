import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Linkedin, Phone, ArrowUpRight } from 'lucide-react';
import { SOCIAL_LINKS } from '../../data/socialLinks';
import { playColorTransition, isPageTransitionRunning } from '../../utils/pageTransition';

function ThemeIcon({ theme }) {
  return theme === 'dark' ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar({ theme, toggleTheme, transparent = false }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedHref, setSelectedHref] = useState(null);
  const drawerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // The drawer grows out of the menu button as a circle (and shrinks back into it on close)
  const toggleMenu = (e) => {
    const drawer = drawerRef.current;
    if (drawer && !isMobileMenuOpen) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      drawer.style.setProperty('--menu-x', `${x}px`);
      drawer.style.setProperty('--menu-y', `${y}px`);
      drawer.style.setProperty('--menu-r', `${Math.ceil(radius)}px`);
    }
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Body scroll locking and Escape key handling for accessible mobile drawer
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleNavClick = (e, targetId) => {
    closeMenu();
    if (targetId.startsWith('/')) {
      e.preventDefault();
      navigate(targetId);
      return;
    }
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/' + targetId);
      return;
    }
    e.preventDefault();
    if (window.navigateToSection) {
      window.navigateToSection(targetId);
    } else {
      const el = document.querySelector(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Menu links: the tapped row floods with its colour, the colour grows to cover the screen,
  // the page changes underneath, then the colour lifts away (see utils/pageTransition.js)
  const handleDrawerNav = (e, item) => {
    e.preventDefault();
    if (isPageTransitionRunning()) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      handleNavClick(e, item.href);
      return;
    }

    const originEl = e.currentTarget.querySelector('.drawer-line') || e.currentTarget;
    const rect = originEl.getBoundingClientRect();
    const isSamePage = item.href.startsWith('#') && location.pathname === '/';
    setSelectedHref(item.href);

    // A beat for the row fill to read before the colour takes over the screen
    setTimeout(() => {
      playColorTransition({
        color: item.swatch,
        label: item.label,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        settleMs: isSamePage ? 450 : 140,
        onCovered: () => {
          setSelectedHref(null);
          handleNavClick({ preventDefault() {} }, item.href);
        },
      });
    }, 260);
  };

  // Swatches are the exact hero-panel colours of each page, so the flood lands on them seamlessly
  const navItems = [
    { label: 'Work', href: '#work', num: '01', swatch: '#94CF4E' },
    { label: 'Services', href: '/services', num: '02', swatch: '#FF5E57' },
    { label: 'About', href: '/about', num: '03', swatch: '#FFA820' },
    { label: 'Contact', href: '/contact', num: '04', swatch: '#FF5E3A' }
  ];

  const isActiveItem = (item) =>
    location.pathname === item.href ||
    (item.href === '/services' && (location.pathname === '/services' || location.pathname === '/what-we-do'));

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${transparent && !isScrolled ? 'navbar--transparent' : ''}`} id="navbar">
        <div className="nav-container">
          {/* Left: Brand */}
          <a href="#hero" className="nav-brand" aria-label="Dhanush - Home" onClick={(e) => handleNavClick(e, '#hero')}>
            <span className="brand-slash">//</span>
            <span className="brand-name">DHANUSH<span className="brand-dot">.</span></span>
          </a>

          {/* Center: Desktop Nav Links */}
          <ul className="nav-links-desktop">
            {navItems.map((item) => {
              const isActive = isActiveItem(item);
              return (
                <li key={item.num}>
                  <a
                    href={item.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Right: Actions */}
          <div className="nav-actions">
            <button
              className="theme-toggle-btn"
              id="themeToggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <ThemeIcon theme={theme} />
            </button>

            <a
              href="/contact"
              className="nav-cta-pill"
              onClick={(e) => handleNavClick(e, '/contact')}
            >
              <span>Start a project</span>
              <span className="cta-arrow">↗</span>
            </a>

            {/* Mobile Hamburger toggle button */}
            <button
              className={`nav-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={toggleMenu}
              aria-label={isMobileMenuOpen ? 'Close Navigation' : 'Open Navigation'}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="menu-icon-bars">
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu: a full-screen sheet revealed as a circle from the menu button */}
      <div
        ref={drawerRef}
        className={`mobile-drawer-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mobile-drawer-content" data-lenis-prevent>
          {/* Mirrors the navbar so the brand and buttons stay where they were */}
          <div className="drawer-header">
            <a href="#hero" className="drawer-brand" aria-label="Dhanush - Home" onClick={(e) => handleNavClick(e, '#hero')}>
              <span className="brand-slash">//</span>
              <span className="brand-name">DHANUSH<span className="brand-dot">.</span></span>
            </a>
            <div className="drawer-header-actions">
              <button
                className="drawer-icon-btn"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <ThemeIcon theme={theme} />
              </button>
              <button className="drawer-icon-btn drawer-close-btn" onClick={closeMenu} aria-label="Close menu">
                <span className="drawer-close-icon" aria-hidden="true"><span></span><span></span></span>
              </button>
            </div>
          </div>

          <nav className="drawer-nav" aria-label="Mobile">
            <div className="drawer-caption drawer-stagger" style={{ '--i': 0 }}>
              <span>Menu</span>
              <span className="drawer-caption-rule" aria-hidden="true"></span>
              <span>({String(navItems.length).padStart(2, '0')})</span>
            </div>

            <ul className={`drawer-nav-list ${selectedHref ? 'has-selection' : ''}`}>
              {navItems.map((item, idx) => {
                const isActive = isActiveItem(item);
                return (
                  <li key={item.num} className="drawer-nav-item drawer-stagger" style={{ '--i': idx + 1 }}>
                    <a
                      href={item.href}
                      className={`drawer-nav-link ${isActive ? 'active' : ''} ${selectedHref === item.href ? 'is-selected' : ''}`}
                      style={{ '--swatch': item.swatch }}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={(e) => handleDrawerNav(e, item)}
                    >
                      <span className="drawer-line" aria-hidden="true" />
                      <span className="drawer-num">{item.num}</span>
                      <span className="drawer-label">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="drawer-footer">
            <div className="drawer-bottom-row drawer-stagger" style={{ '--i': navItems.length + 1 }}>
              <div className="drawer-social-row">
                <a
                  href={SOCIAL_LINKS.email.mailtoUrl}
                  className="drawer-social-pill drawer-social-pill-email"
                  aria-label={`Email Dhanush (${SOCIAL_LINKS.email.address})`}
                  title={`Email: ${SOCIAL_LINKS.email.address}`}
                >
                  <Mail size={16} />
                </a>

                <a
                  href={SOCIAL_LINKS.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="drawer-social-pill drawer-social-pill-linkedin"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={16} />
                </a>

                <a
                  href={SOCIAL_LINKS.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="drawer-social-pill drawer-social-pill-whatsapp"
                  aria-label="WhatsApp Chat"
                  title="Direct WhatsApp Chat"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                  </svg>
                </a>

                <a
                  href={SOCIAL_LINKS.x.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="drawer-social-pill drawer-social-pill-x"
                  aria-label="X (Twitter) Profile"
                  title="X (Twitter) Profile"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </a>

                <a
                  href={SOCIAL_LINKS.phone.telUrl}
                  className="drawer-social-pill drawer-social-pill-phone"
                  aria-label={`Call Dhanush (${SOCIAL_LINKS.phone.number})`}
                  title={`Call: ${SOCIAL_LINKS.phone.number}`}
                >
                  <Phone size={16} />
                </a>
              </div>
              <span className="drawer-copyright">© 2026</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
