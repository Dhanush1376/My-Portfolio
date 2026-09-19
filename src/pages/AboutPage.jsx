import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Terminal, Cpu, Layers, ArrowUpRight, Compass, Code2, Phone, Mail, Plus } from 'lucide-react';
import '../styles/about-page.css';
import { useTheme } from '../hooks/useTheme';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/common/CustomCursor';
import Contact from '../components/sections/Contact';
import AlternativeDiscoveryHub from '../components/sections/AlternativeDiscoveryHub';

const FAQ_ITEMS = [
  {
    num: '01',
    category: 'SERVICES',
    question: 'What kind of projects do you work on?',
    answer: 'I build custom full-stack web applications, modern responsive websites, mobile apps, and AI-powered tools. Whether you need a product built from scratch, a sleek redesign, or complex backend APIs, I handle everything from design to final deployment.'
  },
  {
    num: '02',
    category: 'PRICING',
    question: 'How much do you charge for a project?',
    answer: 'Pricing depends on the scope and features you need. I provide transparent, fixed-price quotes upfront with milestone-based payments, so you know the exact cost before work begins—with zero surprise fees.'
  },
  {
    num: '03',
    category: 'TIMELINE',
    question: 'How long does a typical project take?',
    answer: 'Most standard projects take between 1 to 3 weeks. For urgent MVPs, landing pages, or prototypes, I can often turn around a working build in just a few days. We establish clear delivery milestones right from day one.'
  },
  {
    num: '04',
    category: 'COMMUNICATION',
    question: 'How will we communicate and track progress?',
    answer: 'Direct 1-on-1 collaboration via WhatsApp, Slack, or email—no middlemen or delays. You also get private live preview links on every update so you can test features on your own devices in real time.'
  },
  {
    num: '05',
    category: 'AI & TECH',
    question: 'Can you integrate AI or work with my existing code?',
    answer: 'Yes, absolutely. I frequently connect custom AI assistants, automated workflows, smart search, and third-party APIs into existing websites or codebases smoothly, with zero downtime or disruption.'
  },
  {
    num: '06',
    category: 'SUPPORT',
    question: 'Do you offer support after the project is delivered?',
    answer: 'Yes! Every project includes dedicated post-launch support and bug fixes to ensure everything runs flawlessly. If you need ongoing maintenance, updates, or new features down the road, flexible retainers are also available.'
  }
];

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const overlayRef = useRef(null);
  const portalRef = useRef(null);
  const panelRef = useRef(null);
  const badgeRef = useRef(null);
  const descRef = useRef(null);
  const scrollRef = useRef(null);
  const bentoRef = useRef(null);

  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const row1Skills = [
    'Hugging Face',
    'NumPy',
    'Pandas',
    'Matplotlib',
    'OpenCV',
    'Machine Learning',
    'Deep Learning',
    'Neural Networks',
    'NLP',
    'Computer Vision',
    'Reinforcement Learning',
    'PyTorch',
    'LangChain',
    'ChromaDB'
  ];

  const row2Skills = [
    'LBPH',
    'Recommendation Systems',
    'Signal Analysis',
    'Data Pipelines',
    'Model Training',
    'API Integration',
    'Claude AI',
    'Backtesting',
    'Model Deployment',
    'FastAPI',
    'React.js',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Docker'
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Theme portal atmosphere transition
      if (portalRef.current) {
        tl.fromTo(
          portalRef.current,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.inOut' }
        );
      }

      // The vibrant Solar Yellow hero panel descends with corner morph (exact Contact Page motion)
      if (panelRef.current) {
        tl.fromTo(
          panelRef.current,
          {
            yPercent: -100,
            borderBottomLeftRadius: '60px',
            borderBottomRightRadius: '60px',
          },
          {
            yPercent: 0,
            borderBottomLeftRadius: '32px',
            borderBottomRightRadius: '32px',
            duration: 1.15,
            ease: 'power4.out',
            clearProps: 'yPercent',
          },
          '-=0.15'
        );
        tl.addLabel('heroPanelArrived');
      } else {
        tl.addLabel('heroPanelArrived');
      }

      // Navbar drops down gracefully
      const navEl = overlayRef.current?.querySelector('.navbar');
      if (navEl) {
        tl.fromTo(
          navEl,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform' },
          '-=0.85'
        );
      }

      // Badge enters with a sleek bounce-pop
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: 15, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' },
          '-=0.75'
        );
      }

      // Kinetic Headline Reveal with line masks and de-blur
      const lines = panelRef.current?.querySelectorAll('.about-line-inner');
      if (lines && lines.length > 0) {
        tl.fromTo(
          lines,
          {
            yPercent: 125,
            opacity: 0,
            rotate: 2.2,
            skewY: 1.2,
            filter: 'blur(5px)',
          },
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            skewY: 0,
            filter: 'blur(0px)',
            duration: 1.05,
            stagger: 0.12,
            ease: 'power4.out',
          },
          '-=0.65'
        );
      }

      // Descriptive statement text wipes in smoothly
      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, x: 20, filter: 'blur(4px)' },
          { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' },
          '-=0.55'
        );
      }

      // Scroll indicator slides up
      if (scrollRef.current) {
        tl.fromTo(
          scrollRef.current,
          { opacity: 0, y: 15, letterSpacing: '0.35em' },
          { opacity: 1, y: 0, letterSpacing: '0.2em', duration: 0.7, ease: 'power2.out' },
          '-=0.5'
        );
      }

      // Vertical contact buttons dock stagger-animates in from bottom right with spring pop
      const dockButtons = panelRef.current?.querySelectorAll('.hero-dock-btn');
      if (dockButtons && dockButtons.length > 0) {
        tl.fromTo(
          dockButtons,
          { opacity: 0, x: 25, scale: 0.5, rotate: 15 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            rotate: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: 'back.out(2.2)',
          },
          '-=0.55'
        );
      }

      // Studio Section entrance strictly after hero panel arrived
      const studioSection = overlayRef.current?.querySelector('.about-studio-section');
      if (studioSection) {
        gsap.set(studioSection, { opacity: 0, y: 35 });
        tl.to(
          studioSection,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
          },
          'heroPanelArrived+=0.12'
        );

        tl.eventCallback('onComplete', () => {
          ScrollTrigger.refresh();
        });
      }

      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', handleResize);

      // =========================================================================
      // SCROLL-TRIGGERED ANIMATIONS (FAQS & CONTENT SECTIONS)
      // =========================================================================
      if (bentoRef.current) {
        // Section Dividers self-draw on scroll
        const dividers = bentoRef.current.querySelectorAll('.about-section-divider');
        dividers.forEach((divider) => {
          gsap.fromTo(
            divider,
            { scaleX: 0, opacity: 0, transformOrigin: 'center center' },
            {
              scaleX: 1,
              opacity: 1,
              duration: 1.1,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: divider,
                start: 'top 92%',
              },
            }
          );
        });

        // =====================================================================
        // WORLD-CLASS TECH STACK SECTION SCROLL ANIMATION
        // =====================================================================
        const techHeader = bentoRef.current.querySelector('.tech-stack-header');
        const techTag = techHeader?.querySelector('.tilted-tag-wrapper');
        const techLines = techHeader?.querySelectorAll('.tech-line-inner');

        // 1. Tilted tape tag bounce-pop on scroll
        if (techTag) {
          gsap.fromTo(
            techTag,
            { opacity: 0, scale: 0.65, y: 24, rotate: 8 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              rotate: 0,
              duration: 0.65,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: techHeader,
                start: 'top 92%',
                once: true,
              },
            }
          );
        }

        // 2. Kinetic Headline Mask Reveal on scroll
        if (techLines && techLines.length > 0) {
          gsap.fromTo(
            techLines,
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
                trigger: techHeader,
                start: 'top 92%',
                once: true,
              },
            }
          );
        }

        // =====================================================================
        // WORLD-CLASS FAQ SECTION SCROLL ANIMATION
        // =====================================================================
        const faqHeader = bentoRef.current.querySelector('.faq-section-header');
        const faqTag = faqHeader?.querySelector('.tilted-tag-wrapper');
        const faqLines = faqHeader?.querySelectorAll('.faq-line-inner');
        const faqRows = bentoRef.current.querySelectorAll('.faq-editorial-row');

        // 1. Tilted tape tag bounce-pop on scroll
        if (faqTag) {
          gsap.fromTo(
            faqTag,
            { opacity: 0, scale: 0.65, y: 24, rotate: 8 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              rotate: 0,
              duration: 0.65,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: faqHeader,
                start: 'top 92%',
                once: true,
              },
            }
          );
        }

        // 2. Kinetic Headline Mask Reveal on scroll
        if (faqLines && faqLines.length > 0) {
          gsap.fromTo(
            faqLines,
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
                trigger: faqHeader,
                start: 'top 92%',
                once: true,
              },
            }
          );
        }

        // 3. Cascading Editorial FAQ Rows with Staggered Entrance
        if (faqRows && faqRows.length > 0) {
          gsap.fromTo(
            faqRows,
            {
              opacity: 0,
              y: 35,
              filter: 'blur(4px)',
            },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.8,
              stagger: 0.08,
              ease: 'power3.out',
              clearProps: 'opacity,filter,transform',
              scrollTrigger: {
                trigger: '.faq-editorial-list',
                start: 'top 85%',
                once: true,
              },
            }
          );
        }
      }
    }, overlayRef.current || undefined);

    return () => {
      ctx.revert();
    };
  }, []);

  const scrollToStory = () => {
    const el = document.querySelector('#aboutStory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  return (
    <div className={`about-page-wrapper ${isDark ? 'theme-dark' : 'theme-light'}`} ref={overlayRef}>
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Theme Portal Curtain */}
      <div className="about-theme-portal" ref={portalRef} />

      {/* Top Navigation Bar */}
      <Navbar theme={theme} toggleTheme={toggleTheme} transparent />

      {/* Radiant Solar Yellow Architectural Hero Drop Panel */}
      <div className="about-hero-panel" ref={panelRef}>
        {/* Subtle Architectural Grid Pattern */}
        <div className="hero-grid-overlay" aria-hidden="true">
          <div className="hero-grid-pattern" />
        </div>

        <div className="about-hero-content">
          <div className="about-hero-badge-wrap">
            <span className="about-hero-badge" ref={badgeRef}>
              ABOUT ME
            </span>
          </div>

          <h1 className="about-hero-headline">
            <div className="hero-line-mask">
              <span className="about-line-inner">Systems architect.</span>
            </div>
            <div className="hero-line-mask">
              <span className="about-line-inner">AI engineer.</span>
            </div>
            <div className="hero-line-mask">
              <span className="about-line-inner">Built for utility.</span>
            </div>
          </h1>

          <p className="about-hero-desc" ref={descRef}>
            Full-stack systems architect &amp; AI engineer crafting resilient software built for real utility.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div
          className="about-scroll-indicator"
          ref={scrollRef}
          onClick={scrollToStory}
          role="button"
          tabIndex={0}
          aria-label="Scroll down to story"
        >
          <span className="scroll-text">SCROLL</span>
          <span className="scroll-line-track">
            <span className="scroll-line-runner" />
          </span>
        </div>

        {/* Vertical Contact Buttons at Bottom Right (like Contact Page) */}
        <aside className="hero-social-dock" aria-label="Direct contact links">
          <a
            href="tel:+919154691315"
            className="hero-dock-btn"
            aria-label="Call Directly"
          >
            <Phone size={18} />
            <span className="hero-dock-tooltip">Call</span>
          </a>

          <a
            href="https://wa.me/919154691315?text=Hi%20Dhanush!%20I'd%20like%20to%20discuss%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="hero-dock-btn"
            aria-label="WhatsApp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
              <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
            </svg>
            <span className="hero-dock-tooltip">WhatsApp</span>
          </a>

          <a
            href="mailto:dhanush1376@gmail.com"
            className="hero-dock-btn"
            aria-label="Email Directly"
          >
            <Mail size={18} />
            <span className="hero-dock-tooltip">Email</span>
          </a>
        </aside>
      </div>

      {/* Studio Story & Interactive Bento Narrative Matrix */}
      <section className="about-studio-section" id="aboutStory" ref={bentoRef}>
        {/* Architectural Background Watermark on Left End */}
        <div className="about-bg-watermark" aria-hidden="true">
          <span>ABOUT</span>
        </div>

        {/* Unboxed Right-Aligned Manifesto Quote */}
        <div className="about-quote-header">
          <div className="about-quote-block">
            <h2 className="about-manifesto-quote">
              “I don’t build to compete. I architect systems that <span className="quote-accent">dominate</span>.”
            </h2>
            <div className="about-quote-author">
              <span className="quote-author-dash" aria-hidden="true">—</span>
              <span className="quote-author-name">Dhanush</span>
            </div>
          </div>
        </div>

        {/* Thin Section Divider Line */}
        <div className="about-section-divider" aria-hidden="true" />

        {/* Tech Stack Marquee Showcase (Clean, modern kinetic marquee matching reference image) */}
        <div className="about-tech-stack-container">
          <div className="tech-stack-header">
            <div className="tilted-tag-wrapper">
              <span className="tilted-tag">TECHNICAL ARSENAL</span>
            </div>
            <h2 className="tech-stack-huge-headline">
              <div className="tech-line-mask">
                <span className="tech-line-inner">TECH</span>
              </div>
              <div className="tech-line-mask">
                <span className="tech-line-inner">STACK<span className="title-accent">.</span></span>
              </div>
            </h2>
          </div>

          {/* Continuous Smooth Horizontal Marquee Rows */}
          <div className="tech-marquee-wrapper" aria-label="Interactive Tech Stack marquee">
            {/* Row 1 - Sliding Left */}
            <div className="tech-marquee-row">
              <div className="tech-marquee-track track-left">
                {row1Skills.concat(row1Skills, row1Skills).map((name, idx) => (
                  <span key={`r1-${idx}`} className="tech-marquee-pill">
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Row 2 - Sliding Right */}
            <div className="tech-marquee-row">
              <div className="tech-marquee-track track-right">
                {row2Skills.concat(row2Skills, row2Skills).map((name, idx) => (
                  <span key={`r2-${idx}`} className="tech-marquee-pill">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Thin Section Divider Line */}
        <div className="about-section-divider" aria-hidden="true" />

        {/* FAQs Section (Matching Tech Stack & Contact Climax Aesthetic) */}
        <div className="about-faq-section" id="faq">
          <div className="faq-section-header">
            <div className="tilted-tag-wrapper">
              <span className="tilted-tag">FREQUENTLY ASKED</span>
            </div>
            <h2 className="faq-huge-headline">
              <div className="faq-line-mask">
                <span className="faq-line-inner">COMMON</span>
              </div>
              <div className="faq-line-mask">
                <span className="faq-line-inner">QUESTIONS<span className="title-accent">.</span></span>
              </div>
            </h2>
          </div>

          {/* Architectural Editorial Accordion List */}
          <div className="faq-editorial-list" role="region" aria-label="Frequently Asked Questions">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={item.num}
                  className={`faq-editorial-row ${isOpen ? 'is-open' : ''}`}
                  onClick={() => toggleFaq(index)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleFaq(index);
                    }
                  }}
                >
                  <div className="faq-row-header">
                    <span className="faq-row-num">{item.num}</span>
                    <div className="faq-row-title-wrap">
                      <div className="faq-row-meta">
                        <span className="faq-row-category">{item.category}</span>
                      </div>
                      <h3 className="faq-row-question">{item.question}</h3>
                    </div>
                    <div className="faq-row-toggle" aria-hidden="true">
                      <span className="faq-toggle-icon">
                        <Plus size={20} strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>

                  <div className="faq-row-drawer">
                    <div className="faq-drawer-inner">
                      <div className="faq-answer-block">
                        <p className="faq-answer-simple-text">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alternative Discovery Hub ("STILL NOT SURE?") */}
        <AlternativeDiscoveryHub />
      </section>

      {/* Editorial Contact Section with Background Marquee & Swipe Button */}
      <Contact variant="yellow" />

      {/* Footer */}
      <Footer />
    </div>
  );
}
