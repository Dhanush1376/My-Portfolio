import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import SwipeToConnect from '../ui/SwipeToConnect';

gsap.registerPlugin(ScrollTrigger);

export default function Contact({ 
  variant = 'orange', 
  tag = 'START A PROJECT', 
  headline, 
  subtitle 
}) {
  const sectionRef = useRef(null);
  const buttonRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      const tagEl = headerRef.current.querySelector('.tilted-tag-wrapper');
      const lines = headerRef.current.querySelectorAll('.contact-line-inner');

      // 1. Tilted tape tag bounce-pop on scroll
      if (tagEl) {
        gsap.fromTo(
          tagEl,
          { opacity: 0, scale: 0.65, y: 24, rotate: 8 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotate: 0,
            duration: 0.65,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 55%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 2. Kinetic Headline Mask Reveal on scroll
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          {
            yPercent: 125,
            opacity: 0,
            rotate: 2.2,
            skewY: 1.2,
            filter: 'blur(6px)',
          },
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            skewY: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.08,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 55%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      } else {
        // Fallback for custom headlines without line-mask wrapper
        const headlineEl = headerRef.current.querySelector('.contact-huge-headline');
        if (headlineEl) {
          gsap.fromTo(
            headlineEl,
            { opacity: 0, y: 35, filter: 'blur(6px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.8,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: headerRef.current,
                start: 'top 55%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      }
    }, headerRef);

    return () => ctx.revert();
  }, [headline, tag]);

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
    <section ref={sectionRef} className="section contact-editorial-section stack-section" id="contact">
      {/* Visual Climax Header */}
      <div className="contact-climax-header" ref={headerRef}>
        <div className="tilted-tag-wrapper">
          <span className="tilted-tag">{tag}</span>
        </div>

        <h2 className="contact-huge-headline">
          {headline || (
            <>
              <div className="contact-line-mask">
                <span className="contact-line-inner">WHAT ARE YOU</span>
              </div>
              <div className="contact-line-mask">
                <span className="contact-line-inner">WAITING FOR<span className="title-accent">?</span></span>
              </div>
            </>
          )}
        </h2>

        {subtitle && (
          <p className="contact-editorial-subtext">
            {subtitle}
          </p>
        )}
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
