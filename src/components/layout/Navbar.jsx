import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
    { label: 'Capabilities', href: '#capabilities', num: '02' },
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
            {navItems.map((item) => (
              <li key={item.num}>
                <a
                  href={item.href}
                  className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))}
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
            <div className="drawer-status">
              <span className="status-dot"></span>
              <span>Available for select projects & contracts</span>
            </div>
            <a href="mailto:dhanush1376@gmail.com" className="drawer-email">
              dhanush1376@gmail.com
            </a>
            <div className="drawer-socials">
              <a href="https://github.com/Dhanush1376" target="_blank" rel="noopener noreferrer">GitHub</a>
              <span className="dot-sep">•</span>
              <a href="https://www.linkedin.com/in/dhanush1376/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
