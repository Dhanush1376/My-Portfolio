import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Linkedin, Phone } from 'lucide-react';
import { SOCIAL_LINKS } from '../../data/socialLinks';

export default function Navbar({ theme, toggleTheme, transparent = false }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const navItems = [
    { label: 'Work', href: '#work', num: '01' },
    { label: 'Services', href: '/services', num: '02' },
    { label: 'About', href: '/about', num: '03' },
    { label: 'Contact', href: '/contact', num: '04' }
  ];

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
              const isActive = location.pathname === item.href || 
                (item.href === '/services' && (location.pathname === '/services' || location.pathname === '/what-we-do'));
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
              {theme === 'dark' ? (
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
              )}
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
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
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

      {/* Intentionally Art-Directed Full-Screen Mobile Drawer */}
      <div
        className={`mobile-drawer-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMenu}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          className="mobile-drawer-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="drawer-header">
            <span className="drawer-eyebrow">• NAVIGATION</span>
            <button
              className="drawer-close-btn"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <ul className="drawer-nav-list">
            {navItems.map((item) => (
              <li key={item.num} className="drawer-nav-item">
                <a
                  href={item.href}
                  className={`drawer-nav-link ${location.pathname === item.href ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  <span className="drawer-num">{item.num}</span>
                  <span className="drawer-label">{item.label}</span>
                  <span className="drawer-arrow">↗</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="drawer-footer">
            {/* Availability Status */}
            <div className="drawer-status">
              <span className="status-dot"></span>
              <span>Available for select projects &amp; contracts</span>
            </div>

            {/* Circular Social / Contact Pills */}
            <div className="drawer-social-row">
              <a
                href={SOCIAL_LINKS.email.mailtoUrl}
                className="drawer-social-pill"
                aria-label={`Email Dhanush (${SOCIAL_LINKS.email.address})`}
                title={`Email: ${SOCIAL_LINKS.email.address}`}
              >
                <Mail size={16} />
              </a>

              <a
                href={SOCIAL_LINKS.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="drawer-social-pill"
                aria-label="LinkedIn Profile"
                title="LinkedIn Profile"
              >
                <Linkedin size={16} />
              </a>

              <a
                href={SOCIAL_LINKS.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="drawer-social-pill"
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
                className="drawer-social-pill"
                aria-label="X (Twitter) Profile"
                title="X (Twitter) Profile"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </a>

              <a
                href={SOCIAL_LINKS.phone.telUrl}
                className="drawer-social-pill"
                aria-label={`Call Dhanush (${SOCIAL_LINKS.phone.number})`}
                title={`Call: ${SOCIAL_LINKS.phone.number}`}
              >
                <Phone size={16} />
              </a>
            </div>

            {/* Footer-style Bottom Signature Bar */}
            <div className="drawer-bottom-bar">
              <span className="drawer-brand-logo">
                DHANUSH<span className="brand-dot">.</span>
              </span>
              <span className="drawer-copyright">© 2026</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
