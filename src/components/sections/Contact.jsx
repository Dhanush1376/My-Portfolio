import React, { useRef } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import SwipeToConnect from '../ui/SwipeToConnect';

export default function Contact({ variant = 'orange' }) {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();

  const handleOpenContact = () => {
    // Theme-dependent transition overlay: dark (#0A0A0D) or white/cream (#FBF9F5)
    const fakeBg = document.createElement('div');
    fakeBg.style.position = 'fixed';
    fakeBg.style.inset = '0';
    fakeBg.style.backgroundColor = isDark ? '#0A0A0D' : '#FBF9F5';
    fakeBg.style.zIndex = '9999';
    fakeBg.style.opacity = '0';
    fakeBg.style.pointerEvents = 'none';
    document.body.appendChild(fakeBg);

    // Fade to theme color (dark or white)
    gsap.to(fakeBg, {
      opacity: 1,
      duration: 0.45,
      ease: 'power2.inOut',
    });
    
    // Scale and fade out button, then navigate to /contact
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          navigate('/contact');
          setTimeout(() => {
            if (document.body.contains(fakeBg)) {
              document.body.removeChild(fakeBg);
            }
          }, 600);
        }
      });
    } else {
      setTimeout(() => {
        navigate('/contact');
        setTimeout(() => {
          if (document.body.contains(fakeBg)) {
            document.body.removeChild(fakeBg);
          }
        }, 600);
      }, 450);
    }
  };

  return (
    <section className="section contact-editorial-section" id="contact">
      {/* Visual Climax Header (Inspired by WhyCreatives) */}
      <div className="contact-climax-header">
        <div className="tilted-tag-wrapper">
          <span className="tilted-tag">START A PROJECT</span>
        </div>

        <h2 className="contact-huge-headline">
          WHAT ARE YOU<br />
          WAITING FOR<span className="title-accent">?</span>
        </h2>
      </div>

      {/* Infinite Outline Background Marquee & Center CTA */}
      <div className="contact-marquee-cta-wrapper">
        <div className="contact-outline-marquee" aria-hidden="true">
          <div className="marquee-content-track">
            <span>CONNECT • INNOVATE • BUILD • DEPLOY • CONNECT • INNOVATE • BUILD • DEPLOY •&nbsp;</span>
            <span>CONNECT • INNOVATE • BUILD • DEPLOY • CONNECT • INNOVATE • BUILD • DEPLOY •&nbsp;</span>
          </div>
          <div className="marquee-content-track-reverse">
            <span>CONNECT • INNOVATE • BUILD • DEPLOY • CONNECT • INNOVATE • BUILD • DEPLOY •&nbsp;</span>
            <span>CONNECT • INNOVATE • BUILD • DEPLOY • CONNECT • INNOVATE • BUILD • DEPLOY •&nbsp;</span>
          </div>
        </div>
        <div 
          className="contact-marquee-overlay-btn" 
          ref={buttonRef}
          style={{ zIndex: 100 }} 
        >
          <SwipeToConnect onConnect={handleOpenContact} variant={variant} />
        </div>
      </div>
    </section>
  );
}
