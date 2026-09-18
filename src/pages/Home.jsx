import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useTheme } from '../hooks/useTheme';
import CustomCursor from '../components/common/CustomCursor';
import Preloader from '../components/common/Preloader';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

import Hero from '../components/sections/Hero';
import StatementSection from '../components/sections/StatementSection';
import TrustStrip from '../components/sections/TrustStrip';
import Projects from '../components/sections/Projects';
import Services from '../components/sections/Services';
import Contact from '../components/sections/Contact';
import CaseStudyModal from '../components/modals/CaseStudyModal';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);

  const openCaseStudy = (projectId) => {
    setActiveCaseStudy(projectId);
    setIsCaseStudyOpen(true);
  };

  const closeCaseStudy = () => {
    setIsCaseStudyOpen(false);
  };

  useEffect(() => {
    // Lenis Smooth Scroll Setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    window.lenis = lenis;

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    // Smooth frame recovery without violent jumps on lag
    gsap.ticker.lagSmoothing(500, 33);

    // 2. Section Stacking (Overlay Scroll)
    const stackSections = gsap.utils.toArray('.hero, .section');

    // Efficient, zero-reflow card-focus elevation via ScrollTrigger pre-calculated triggers
    stackSections.forEach((sec, i) => {
      if (i === 0) return; // Hero doesn't need card-focus
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 92%',
        end: 'bottom top',
        toggleClass: 'card-focus',
        invalidateOnRefresh: true,
      });
    });

    // 3. Stacking Cards Effect (Editorial pinning) - REMOVED due to severe scroll conflicts with Lenis

    // 4. Hero Content Fade Out on Scroll
    gsap.to('.hero-content', {
      opacity: 0,
      y: -80,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=380',
        scrub: true,
      }
    });

    // 5. Active Nav Link on Scroll
    const navSections = document.querySelectorAll('.hero, .section');
    const navLinks = document.querySelectorAll('.nav-link');
    navSections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 25%',
        end: 'bottom 25%',
        onToggle: (self) => {
          if (self.isActive) {
            const id = section.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        }
      });
    });

    // 6. Navigation with Pinned Sections Helper
    window.navigateToSection = (targetId) => {
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      const navbarHeight = 80;

      // Temporarily disable pins to measure and scroll accurately
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.pin) st.disable();
      });

      let targetPosition = 0;
      if (targetId !== '#hero') {
        const rect = targetElement.getBoundingClientRect();
        targetPosition = Math.max(0, window.scrollY + rect.top - navbarHeight);
      }

      if (window.lenis) {
        window.lenis.scrollTo(targetPosition, {
          duration: 1.5,
          easing: (t) => 1 - Math.pow(2, -10 * t),
          onComplete: () => {
            setTimeout(() => {
              ScrollTrigger.getAll().forEach((st) => {
                if (st.vars.pin) st.enable();
              });
              ScrollTrigger.refresh();
            }, 50);
          }
        });
      } else {
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        setTimeout(() => {
          ScrollTrigger.getAll().forEach((st) => {
            if (st.vars.pin) st.enable();
          });
          ScrollTrigger.refresh();
        }, 1000);
      }
    };

    // 7. Floating Crosshairs Animation
    gsap.utils.toArray('.crosshair').forEach((ch, i) => {
      gsap.to(ch, {
        y: `${(i % 2 === 0 ? -1 : 1) * (15 + i * 5)}`,
        x: `${(i % 2 === 0 ? 1 : -1) * (10 + i * 3)}`,
        duration: 3 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // 8. Section Header Watermark & Title Animations
    const headers = document.querySelectorAll('.section-header');
    headers.forEach((header) => {
      const watermark = header.querySelector('.section-watermark');
      const title = header.querySelector('.section-title');

      if (watermark) watermark.classList.add('animate-ready');
      if (title) title.classList.add('animate-ready');

      ScrollTrigger.create({
        trigger: header,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          if (watermark) {
            gsap.to(watermark, {
              clipPath: 'inset(0 0% 0 0%)',
              opacity: 0.19,
              scale: 1,
              duration: 1.5,
              ease: 'power4.out'
            });
          }
          if (title) title.classList.add('animate-in');
        }
      });
    });

    const handleResizeOrLoad = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResizeOrLoad);
    window.addEventListener('load', handleResizeOrLoad);

    ScrollTrigger.refresh();
    const hashTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      const hash = window.location.hash;
      if (hash) {
        if (window.navigateToSection) {
          window.navigateToSection(hash);
        } else {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 180);

    return () => {
      clearTimeout(hashTimer);
      window.lenis = null;
      window.navigateToSection = null;
      gsap.ticker.remove(updateLenis);
      window.removeEventListener('resize', handleResizeOrLoad);
      window.removeEventListener('load', handleResizeOrLoad);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="portfolio-app">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Preloader */}
      <Preloader onComplete={() => ScrollTrigger.refresh()} />

      {/* Navigation */}
      <Navbar theme={theme} toggleTheme={toggleTheme} transparent />

      {/* Main Content Sections */}
      <main id="main-content">
        <Hero />
        <StatementSection />
        <TrustStrip />
        <Projects onOpenCaseStudy={openCaseStudy} />
        <Services />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Case Study Drawer / Modal */}
      <CaseStudyModal
        isOpen={isCaseStudyOpen}
        projectId={activeCaseStudy}
        onClose={closeCaseStudy}
      />
    </div>
  );
}
