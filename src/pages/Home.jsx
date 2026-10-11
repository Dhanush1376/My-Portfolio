import React, { useState, useEffect } from 'react';
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
import { PAGE_META, absoluteUrl, homeSchema as buildHomeSchema } from '../data/site';
import { PROJECTS_DATA } from '../data/projectsData';

gsap.registerPlugin(ScrollTrigger);

const homeSchema = buildHomeSchema(Object.values(PROJECTS_DATA));

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

    // Stacked section overlap: each section scrolls until its last line is on screen,
    // then holds (CSS sticky) while the next one slides over it and it recedes underneath.
    // The hero keeps its own sticky setup with no effects; the last section has nothing above it.
    const mainEl = document.querySelector('#main-content');
    const stackLayers = mainEl
      ? [...mainEl.children].filter((el) => el.classList.contains('stack-section')).slice(1, -1)
      : [];

    const syncStackHeights = () => {
      stackLayers.forEach((el) => el.style.setProperty('--stack-h', `${el.offsetHeight}px`));
    };
    syncStackHeights();
    stackLayers.forEach((el) => el.classList.add('stack-layer'));

    const stackRo = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncStackHeights) : null;
    stackLayers.forEach((el) => stackRo && stackRo.observe(el));

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stackCtx = gsap.context(() => {
      stackLayers.forEach((layer) => {
        const next = layer.nextElementSibling;
        if (!next) return;
        // The veil lives on the incoming section and dims everything above it evenly
        const veil = next.querySelector(':scope > .stack-veil');

        // Progress = share of the screen the next section covers, so a short final
        // section that never reaches the top only dims what it actually hides.
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: next,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        if (veil) tl.to(veil, { opacity: 1 }, 0);
        // Desktop only: the held section drifts up slowly (parallax) instead of sitting frozen.
        // A drift keeps it full-bleed, so unlike scaling it never exposes card edges.
        // Phones stay on cheap opacity-only compositing.
        if (!isTouch && !prefersReducedMotion) {
          gsap.set(layer, { willChange: 'transform' });
          tl.fromTo(layer, { y: 0 }, { y: () => -0.15 * window.innerHeight, force3D: true }, 0);
        }
      });
    });

    // 4. Active Nav Link on Scroll
    const navSections = document.querySelectorAll('.hero-section, .section, .stack-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navCtx = gsap.context(() => {
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
    });

    // 5. Navigation with Smooth Scrolling
    window.navigateToSection = (targetId) => {
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      const navbarHeight = 80;
      let targetPosition = 0;
      if (targetId !== '#hero') {
        let top = window.scrollY + targetElement.getBoundingClientRect().top;
        // A held (sticky) section reports where it is pinned, not its place in the page flow
        if (mainEl && targetElement.parentElement === mainEl) {
          top = window.scrollY + mainEl.getBoundingClientRect().top;
          for (let el = mainEl.firstElementChild; el && el !== targetElement; el = el.nextElementSibling) {
            top += el.offsetHeight;
          }
        }
        targetPosition = Math.max(0, top - navbarHeight);
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
      stackCtx.revert();
      if (stackRo) stackRo.disconnect();
      stackLayers.forEach((el) => {
        el.classList.remove('stack-layer');
        el.style.removeProperty('--stack-h');
      });
      window.lenis = null;
      window.navigateToSection = null;
      if (updateLenis) gsap.ticker.remove(updateLenis);
      window.removeEventListener('resize', handleResizeOrLoad);
      window.removeEventListener('load', handleResizeOrLoad);
      if (lenis) lenis.destroy();
      // Only tear down Home's own triggers; each section reverts its own reveal animations.
      // Killing every trigger here left unrevealed sections frozen faded after a re-run.
      navCtx.revert();
    };
  }, []);

  return (
    <div className="portfolio-app home-page">
      <SEO
        title={PAGE_META.home.title}
        description={PAGE_META.home.description}
        canonical={absoluteUrl(PAGE_META.home.path)}
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
