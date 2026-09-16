import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X } from 'lucide-react';
import '../../styles/contact-page.css';

export default function ContactPageOverlay({ isOpen, onClose }) {
  const overlayRef = useRef(null);
  const bgRef = useRef(null);
  const panelRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    // Initial Setup
    gsap.set(bgRef.current, { opacity: 0 });
    gsap.set(panelRef.current, { yPercent: -100 });

    tlRef.current = gsap.timeline({ paused: true });

    tlRef.current
      .to(bgRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut',
      })
      .to(panelRef.current, {
        yPercent: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.2');

    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      tlRef.current.play();
    } else {
      tlRef.current.reverse();
    }
  }, [isOpen]);

  if (!isOpen && (!tlRef.current || tlRef.current.progress() === 0)) {
    return null; // Ensure we unmount after animation completes
  }

  return (
    <div className={`contact-page-overlay ${isOpen ? 'is-active' : ''}`} ref={overlayRef}>
      <div className="contact-overlay-bg" ref={bgRef} />
      
      <div className="contact-hero-panel" ref={panelRef}>
        
        <button className="contact-close-btn" onClick={onClose}>
          CLOSE <X size={18} />
        </button>

        <div className="contact-hero-top">
          <span className="contact-hero-badge">Services</span>
          <h1 className="contact-hero-headline">
            We're a creative studio with deep expertise
          </h1>
          <p className="contact-hero-desc">
            We bring craft and clear thinking to ambitious brands, and build work that earns attention.
          </p>
        </div>

        <div className="contact-hero-bottom">
          <span className="contact-scroll-indicator">
            SCROLL
          </span>
        </div>
      </div>
    </div>
  );
}
