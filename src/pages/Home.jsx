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

    // Configure ScrollTrigger to ignore mobile address bar resize events (stops vibrating/shaking)
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    });

    // Detect touch / mobile devices - NEVER hijack touch on phones (preserves 120Hz native momentum)
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768);

    let lenis = null;
    let updateLenis = null;

    if (!isTouch) {
      // Desktop-only Lenis Smooth Scroll Setup for silky mouse wheel scrolling
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 0,
        syncTouch: false,
        infinite: false,
      });

      lenis.on('scroll', ScrollTrigger.update);
      window.lenis = lenis;

      updateLenis = (time) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(500, 33);
    } else {
      window.lenis = null;
    }

    // (Hero video has no scroll animations per user request)

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

    // 5. Navigation with Smooth Scrolling
    window.navigateToSection = (targetId) => {
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      const navbarHeight = 80;
      let targetPosition = 0;
      if (targetId !== '#hero') {
        const rect = targetElement.getBoundingClientRect();
        targetPosition = Math.max(0, window.scrollY + rect.top - navbarHeight);
      }

      if (window.lenis && !isTouch) {
        window.lenis.scrollTo(targetPosition, {
          duration: 1.2,
          easing: (t) => 1 - Math.pow(2, -10 * t),
        });
      } else {
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    };

    // Only refresh on horizontal width changes (orientation flip), NEVER on height-only mobile address bar changes
    let lastWidth = window.innerWidth;
    const handleResizeOrLoad = (e) => {
      if (e && e.type === 'load') {
        ScrollTrigger.refresh();
        return;
      }
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener('resize', handleResizeOrLoad);
    window.addEventListener('load', handleResizeOrLoad);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

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
      if (updateLenis) gsap.ticker.remove(updateLenis);
      window.removeEventListener('resize', handleResizeOrLoad);
      window.removeEventListener('load', handleResizeOrLoad);
      if (lenis) lenis.destroy();
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
