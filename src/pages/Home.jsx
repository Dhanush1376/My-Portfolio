import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useTheme } from '../hooks/useTheme';
import CustomCursor from '../components/common/CustomCursor';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

import Hero from '../components/sections/Hero';
import StatementSection from '../components/sections/StatementSection';
import Projects from '../components/sections/Projects';
import Services from '../components/sections/Services';
import Contact from '../components/sections/Contact';
import CaseStudyModal from '../components/modals/CaseStudyModal';
import SEO from '../components/common/SEO';

gsap.registerPlugin(ScrollTrigger);

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://dhanu.me/#website",
      "url": "https://dhanu.me/",
      "name": "Dhanush",
      "description": "Personal portfolio of Dhanush — Software Engineer & AI Systems Builder"
    },
    {
      "@type": "Person",
      "@id": "https://dhanu.me/#person",
      "name": "Dhanush",
      "url": "https://dhanu.me/",
      "jobTitle": "Software Engineer & AI Systems Builder",
      "sameAs": [
        "https://github.com/Dhanush1376",
        "https://linkedin.com/in/dhanush1376",
        "https://x.com/Dhanush1376"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Punjab",
        "addressCountry": "IN"
      }
    }
  ]
};

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
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }

    // Lenis Smooth Scroll Setup - Silky smooth wheel scrolling with 100% native mobile inertia
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      syncTouch: false,
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

    // Hardware-Accelerated Hero Transition (Subtle visual depth as statement overlays hero)
    const heroCanvas = document.querySelector('#hero .hero-orange-wrapper');
    const stmtSec = document.querySelector('#statement');
    if (heroCanvas && stmtSec) {
      gsap.to(heroCanvas, {
        opacity: 0.88,
        ease: 'none',
        scrollTrigger: {
          trigger: stmtSec,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        },
      });
    }

    // Physical Layer Stacking & Card Overlap Calculation
    // For tall sections (#work, #capabilities, #contact), dynamically calculate top
    // as Math.min(0, vh - sectionHeight) so the user can scroll naturally through
    // all content, and as each section reaches its end, it holds seamlessly in place
    // while the subsequent card sheet slides up and overlays it with physical shadow and grab handle!
    const updateStickyOffsets = () => {
      const vh = window.innerHeight;
      ['#work', '#capabilities', '#contact'].forEach((selector) => {
        const sec = document.querySelector(`#main-content > ${selector}`);
        if (sec) {
          const h = sec.offsetHeight;
          const targetTop = Math.min(0, vh - h);
          sec.style.setProperty('top', `${targetTop}px`, 'important');
        }
      });
    };

    updateStickyOffsets();

    let mainRo = null;
    const mainContentEl = document.querySelector('#main-content');
    if (mainContentEl && typeof ResizeObserver !== 'undefined') {
      mainRo = new ResizeObserver(() => {
        updateStickyOffsets();
      });
      mainRo.observe(mainContentEl);
    }

    // 4. Active Nav Link on Scroll
    const navSections = document.querySelectorAll('.hero-section, .section, .stack-section');
    const navLinks = document.querySelectorAll('.nav-link');
    navSections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 35%',
        end: 'bottom 35%',
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

    // 6. Navigation with Smooth Scrolling
    window.navigateToSection = (targetId) => {
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      const navbarHeight = 80;
      let targetPosition = 0;
      if (targetId !== '#hero') {
        const rect = targetElement.getBoundingClientRect();
        targetPosition = Math.max(0, window.scrollY + rect.top - navbarHeight);
      }

      if (window.lenis) {
        window.lenis.scrollTo(targetPosition, {
          duration: 1.2,
          easing: (t) => 1 - Math.pow(2, -10 * t),
        });
      } else {
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
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
      updateStickyOffsets();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResizeOrLoad);
    window.addEventListener('load', handleResizeOrLoad);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        updateStickyOffsets();
        ScrollTrigger.refresh();
      });
    }

    ScrollTrigger.refresh();
    const hashTimer = setTimeout(() => {
      updateStickyOffsets();
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
      if (mainRo) mainRo.disconnect();
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
      <SEO
        title="Dhanush — Software Engineer & AI Systems Builder"
        description="Software Engineer & AI Systems Builder building modern web applications and intelligent systems."
        canonical="https://dhanu.me/"
        schema={homeSchema}
      />
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navbar theme={theme} toggleTheme={toggleTheme} transparent />

      {/* Main Content Sections */}
      <main id="main-content">
        <Hero />
        <StatementSection />
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
