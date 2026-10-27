import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, Plus } from 'lucide-react';
import '../styles/about-page.css';
import { useTheme } from '../hooks/useTheme';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/common/CustomCursor';
import Contact from '../components/sections/Contact';
import AlternativeDiscoveryHub from '../components/sections/AlternativeDiscoveryHub';
import SEO from '../components/common/SEO';
import { SOCIAL_LINKS } from '../data/socialLinks';
import { PAGE_META, absoluteUrl } from '../data/site';
import { isFloodArriving, floodLandingDelay } from '../utils/pageTransition';
import { getBrandIcon } from '../data/brandIcons';

const aboutSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": "https://www.dhanu.me/about#webpage",
      "url": "https://www.dhanu.me/about",
      "name": "About Dhanush — Software Engineer & AI Systems Builder",
      "description": "Learn about Dhanush, a software engineer and AI systems builder specializing in full-stack web applications, vector RAG pipelines, and intelligent automation systems.",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.dhanu.me/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "About",
            "item": "https://www.dhanu.me/about"
          }
        ]
      },
      "mainEntity": {
        "@type": "Person",
        "@id": "https://www.dhanu.me/#person",
        "name": "Dhanush",
        "jobTitle": "Software Engineer & AI Systems Builder",
        "url": "https://www.dhanu.me/",
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
    }
  ]
};

const FAQ_ITEMS = [
  {
    num: '01',
    category: 'FOCUS & ROLES',
    question: 'What kind of roles and engineering challenges do you focus on?',
    answer: 'I specialize in Full-Stack Software Engineering and AI Systems—architecting scalable React/Next.js interfaces, high-throughput Node.js/Python APIs, and vector RAG pipelines. I am actively open to full-time engineering roles in ambitious teams as well as select high-impact contract builds.'
  },
  {
    num: '02',
    category: 'OPPORTUNITIES',
    question: 'Are you available for full-time engineering roles as well as contracts?',
    answer: 'Yes, absolutely. I am actively interviewing for full-time Software Engineer, Frontend Engineer, and AI/Full-Stack positions. I can integrate immediately into distributed or on-site engineering teams. For contract projects, I provide clear scoping, rapid sprints, and full production delivery.'
  },
  {
    num: '03',
    category: 'TECH STACK',
    question: 'What is your core tech stack and development philosophy?',
    answer: 'My primary stack spans TypeScript, React 19, Next.js, Node.js, Python, FastAPI, and databases like PostgreSQL, MongoDB, and ChromaDB. My philosophy emphasizes clean architecture, strict typing, responsive sub-second performance, and production CI/CD automation without unnecessary bloat.'
  },
  {
    num: '04',
    category: 'COLLABORATION',
    question: 'How do you collaborate within engineering teams and track progress?',
    answer: 'I thrive in modern Agile engineering environments with structured GitHub PRs, automated test checks, proactive code reviews, and asynchronous documentation on Slack or Notion. Whether contributing to an existing codebase or leading a new initiative, I prioritize clear communication and zero friction.'
  },
  {
    num: '05',
    category: 'AI & ARCHITECTURE',
    question: 'How do you approach AI integration and existing codebases?',
    answer: 'I design grounded, hallucination-resistant AI systems using semantic vector search, chunking heuristics, and tool-calling agents. When onboarding onto an existing codebase, I quickly map dependencies, profile performance bottlenecks, and introduce scalable features cleanly without technical debt.'
  },
  {
    num: '06',
    category: 'OWNERSHIP',
    question: 'What can hiring teams and project partners expect regarding delivery?',
    answer: 'High agency and end-to-end ownership. From initial problem discovery and system design to automated deployment and observability, I build durable software that is easily maintainable by any engineering team and ready for production scale.'
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
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const row1Skills = [
    'React 19',
    'TypeScript',
    'Next.js',
    'Node.js',
    'Python',
    'FastAPI',
    'Tailwind CSS',
    'Vite',
    'Framer Motion',
    'GSAP'
  ];

  const row2Skills = [
    'MongoDB',
    'PostgreSQL',
    'Docker',
    'LangChain',
    'Claude AI',
    'Hugging Face',
    'PyTorch',
    'OpenCV',
    'Vercel',
    'GitHub'
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Arriving through the menu's colour flood: the panel is already in place under the colour,
      // so skip its slide-down and start the rest of the entrance as the colour lands on the card
      const arriving = isFloodArriving();
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: floodLandingDelay() });

      // Theme portal atmosphere transition
      if (portalRef.current) {
        tl.fromTo(
          portalRef.current,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.inOut' }
        );
      }

      // The vibrant Solar Yellow hero panel descends with corner morph (exact Contact Page motion)
      if (panelRef.current && !arriving) {
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
      <SEO
        title={PAGE_META.about.title}
        description={PAGE_META.about.description}
        canonical={absoluteUrl(PAGE_META.about.path)}
        schema={aboutSchema}
      />
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Theme Portal Curtain */}
      <div className="about-theme-portal" ref={portalRef} />

      {/* Top Navigation Bar */}
      <Navbar theme={theme} toggleTheme={toggleTheme} transparent />

      {/* Radiant Solar Yellow Architectural Hero Drop Panel */}
      <div className="about-hero-panel" ref={panelRef} data-flood-target>
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
            href={SOCIAL_LINKS.phone.telUrl}
            className="hero-dock-btn"
            aria-label={`Call Directly (${SOCIAL_LINKS.phone.number})`}
            title={`Call: ${SOCIAL_LINKS.phone.number}`}
          >
            <Phone size={18} />
            <span className="hero-dock-tooltip">Call</span>
          </a>

          <a
            href={SOCIAL_LINKS.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-dock-btn"
            aria-label="WhatsApp Chat"
            title="Chat on WhatsApp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
              <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
            </svg>
            <span className="hero-dock-tooltip">WhatsApp</span>
          </a>

          <a
            href={SOCIAL_LINKS.email.mailtoUrl}
            className="hero-dock-btn"
            aria-label={`Email Directly (${SOCIAL_LINKS.email.address})`}
            title={`Email: ${SOCIAL_LINKS.email.address}`}
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
                {row1Skills.concat(row1Skills, row1Skills).map((name, idx) => {
                  const brand = getBrandIcon(name);
                  const color = brand?.hex || '#FFA820';
                  return (
                    <span
                      key={`r1-${idx}`}
                      className="tech-marquee-pill"
                      style={{ '--pill-color': color }}
                    >
                      <span className="tech-marquee-pill-icon" aria-hidden="true">
                        {brand?.path ? (
                          <svg viewBox="0 0 24 24" role="presentation">
                            <path d={brand.path} fill="currentColor" />
                          </svg>
                        ) : (
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                        )}
                      </span>
                      <span className="tech-marquee-pill-name">{name}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Row 2 - Sliding Right */}
            <div className="tech-marquee-row">
              <div className="tech-marquee-track track-right">
                {row2Skills.concat(row2Skills, row2Skills).map((name, idx) => {
                  const brand = getBrandIcon(name);
                  const color = brand?.hex || '#FFA820';
                  return (
                    <span
                      key={`r2-${idx}`}
                      className="tech-marquee-pill"
                      style={{ '--pill-color': color }}
                    >
                      <span className="tech-marquee-pill-icon" aria-hidden="true">
                        {brand?.path ? (
                          <svg viewBox="0 0 24 24" role="presentation">
                            <path d={brand.path} fill="currentColor" />
                          </svg>
                        ) : (
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                        )}
                      </span>
                      <span className="tech-marquee-pill-name">{name}</span>
                    </span>
                  );
                })}
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
