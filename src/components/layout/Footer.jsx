import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Linkedin, Instagram, Phone, Mail, MapPin } from 'lucide-react';

const DEFAULT_QUESTIONS = [
  "Ready to build\nsomething great?",
  "Have an ambitious\nproject in mind?",
  "Looking to scale\nyour next big idea?",
  "Want to create\nsomething iconic?"
];

const TypewriterText = ({ questions = DEFAULT_QUESTIONS }) => {
  const [currentText, setCurrentText] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const fullText = questions[questionIndex];
    let timeout;

    if (!isDeleting) {
      if (currentText.length < fullText.length) {
        timeout = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length + 1));
        }, 55);
      } else {
        // Pause at full text to allow reading
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2500);
      }
    } else {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length - 1));
        }, 25);
      } else {
        // Pause briefly before switching to next question
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setQuestionIndex((prev) => (prev + 1) % questions.length);
        }, 350);
      }
    }

    return () => clearTimeout(timeout);
  }, [hasAnimated, currentText, isDeleting, questionIndex, questions]);

  return (
    <h2 className="footer-giant-question" ref={textRef} style={{ position: 'relative' }}>
      {/* Invisible clone forces constant 2-line height at all times to prevent layout shifts */}
      <span style={{ visibility: 'hidden', pointerEvents: 'none', display: 'block' }}>
        Looking to scale<br />your next big idea?
        <span className="typewriter-cursor"></span>
      </span>
      
      {/* Absolute overlay types out smoothly without altering document flow */}
      <span style={{ position: 'absolute', left: 0, top: 0, whiteSpace: 'pre-wrap' }}>
        {currentText.split('\n').map((line, idx, arr) => (
          <React.Fragment key={idx}>
            {line}
            {idx < arr.length - 1 && <br />}
          </React.Fragment>
        ))}
        <span className="typewriter-cursor"></span>
      </span>
    </h2>
  );
};

export default function Footer() {
  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, {
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-redesign-wrapper">
      {/* Left Column (Socials + Notch Extension) */}
      <div className="footer-left-column">
        <aside className="footer-social-bar">
          <a href="https://linkedin.com/in/dhanush1376" target="_blank" rel="noopener noreferrer" className="social-pill" aria-label="LinkedIn">
            <Linkedin size={18} />
          </a>
          <a href="https://wa.me/919154691315?text=Hi%20Dhanush!%20I'd%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer" className="social-pill" aria-label="WhatsApp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
              <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
            </svg>
          </a>
          <a href="#" className="social-pill" aria-label="X (Twitter)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
          </a>
          <a href="#" className="social-pill" aria-label="Instagram">
            <Instagram size={18} />
          </a>
        </aside>

        {/* Mobile top-right inverted corner notch SVG */}
        <svg className="footer-mobile-inverted-corner" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="notch-fill" d="M26 0 V26 H0 A26 26 0 0 1 26 0 Z" />
        </svg>

        {/* Lower left extension block that creates the notch effect */}
        <div className="footer-left-extension">
          <svg className="footer-inverted-corner" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="notch-fill" d="M40 40V0C40 22.0914 22.0914 40 0 40H40Z" fill="#111111" />
          </svg>
        </div>
      </div>

      {/* Main Curved Dark Container */}
      <div className="footer-main-block">
        {/* Top Right is now clean; scroll button moved to bottom right cutout */}

        <div className="footer-main-top">
          <div className="footer-brand-callout">
            <TypewriterText />
            <div className="footer-action-row">
              <a href="mailto:dhanush1376@gmail.com" className="footer-start-btn">
                Start a project <span className="arrow-icon">↗</span>
              </a>
              <p className="footer-tiny-desc">
                <strong>End-to-end development</strong>
                Tailored to your vision
              </p>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-link-col">
              <h4>EXPLORE</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/#work">Work</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-link-col contact-col">
              <h4>GET IN TOUCH</h4>
              <ul>
                <li>
                  <Phone size={14} /> 
                  <a href="tel:+919154691315">+91 91546 91315</a>
                </li>
                <li>
                  <MapPin size={14} /> 
                  <span>Punjab, India</span>
                </li>
                <li>
                  <Mail size={14} /> 
                  <a href="mailto:dhanush1376@gmail.com">dhanush1376@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-marquee-wrapper">
          <div className="footer-marquee-content">
            <div className="footer-giant-text">
              CRAFTING SINCE' 2024 <span className="marquee-star">✦</span> FULL-STACK ARCHITECTURE <span className="marquee-star">✦</span> AI SYSTEMS & INTERACTION <span className="marquee-star">✦</span> DESIGNED TO SCALE <span className="marquee-star">✦</span>
            </div>
            <div className="footer-giant-text" aria-hidden="true">
              CRAFTING SINCE' 2024 <span className="marquee-star">✦</span> FULL-STACK ARCHITECTURE <span className="marquee-star">✦</span> AI SYSTEMS & INTERACTION <span className="marquee-star">✦</span> DESIGNED TO SCALE <span className="marquee-star">✦</span>
            </div>
          </div>
        </div>

        <div className="footer-main-bottom">
          <div className="footer-bottom-left">
            <span className="footer-bottom-logo">DHANUSH<span className="brand-dot">.</span></span>
            <span className="footer-copyright">© Dhanush 2026 | Punjab, India</span>
          </div>
          <div className="footer-bottom-right">
            <span>Full-Stack Engineer</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </div>

      {/* Bottom Right Cutout for Scroll Back Up */}
      <div className="footer-bottom-scroll-cutout" onClick={scrollToTop}>
        Scroll to top <ArrowUp size={16} style={{ marginLeft: '8px' }} />
      </div>
    </footer>
  );
}
