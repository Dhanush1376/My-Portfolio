import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowUpRight, 
  Film, 
  Globe, 
  Smartphone, 
  Sparkles, 
  Workflow, 
  ShoppingBag, 
  Layout, 
  TrendingUp, 
  PenTool, 
  Server 
} from 'lucide-react';

const SERVICES_MARQUEE = [
  { label: 'Short-Form Reels', icon: Film, to: '/services' },
  { label: 'Web Development', icon: Globe, to: '/services' },
  { label: 'App Development', icon: Smartphone, to: '/services' },
  { label: 'AI & RAG Applications', icon: Sparkles, to: '/services' },
  { label: 'AI Automation & Integrations', icon: Workflow, to: '/services' },
  { label: 'E-Commerce Development', icon: ShoppingBag, to: '/services' },
  { label: 'Landing Pages', icon: Layout, to: '/services' },
  { label: 'Business Dashboards', icon: TrendingUp, to: '/services' },
  { label: 'Brand Identity & UI/UX', icon: PenTool, to: '/services' },
  { label: 'Cloud Architecture & APIs', icon: Server, to: '/services' },
];

gsap.registerPlugin(ScrollTrigger);

export default function StatementSection() {
  const sectionRef = useRef(null);
  const marqueeRef = useRef(null);
  const trackRef = useRef(null);
  const groupRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tagEl = sectionRef.current.querySelector('.statement-studio-label, .statement-label-wrapper');
      const lines = sectionRef.current.querySelectorAll('.statement-line-inner');

      // 1. Studio bullet label reveal on scroll
      if (tagEl) {
        gsap.fromTo(
          tagEl,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 92%',
              once: true,
            },
          }
        );
      }

      // 2. Kinetic Headline Mask Reveal on scroll
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          {
            yPercent: 120,
            opacity: 0,
            filter: 'blur(6px)',
          },
          {
            yPercent: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.85,
            stagger: 0.1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 96%',
            },
          }
        );
      }
    }, sectionRef);

    // 3. User-Scroll Driven Slow Marquee Animation Physics
    const track = trackRef.current;
    const group = groupRef.current;
    const marqueeEl = marqueeRef.current;

    let tickerFn = null;
    let cleanupScroll = null;

    if (track && group && marqueeEl) {
      let groupWidth = group.getBoundingClientRect().width;
      const updateWidth = () => {
        if (group) {
          const w = group.getBoundingClientRect().width;
          if (w > 50) groupWidth = w;
        }
      };

      window.addEventListener('resize', updateWidth);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updateWidth);
      }

      let xPos = 0;
      const baseSpeed = 0.52; // Very slow, calm, elegant base glide
      let scrollVelocityBonus = 0;
      let targetVelocityBonus = 0;
      let isHovered = false;

      const onMouseEnter = () => { isHovered = true; };
      const onMouseLeave = () => { isHovered = false; };
      marqueeEl.addEventListener('mouseenter', onMouseEnter);
      marqueeEl.addEventListener('mouseleave', onMouseLeave);

      let lastScrollY = window.scrollY;
      let lastScrollTime = performance.now();

      const onScroll = () => {
        const now = performance.now();
        const currentScrollY = window.scrollY;
        const dy = currentScrollY - lastScrollY;
        const dt = Math.max(now - lastScrollTime, 8);

        let instantVelocity = (dy / dt) * 16.67;
        if (window.lenis && typeof window.lenis.velocity === 'number') {
          instantVelocity = window.lenis.velocity;
        }

        // Dynamic scroll impulse: fast/slow scrolling smoothly accelerates the marquee
        targetVelocityBonus = gsap.utils.clamp(-20, 26, instantVelocity * 0.45);

        lastScrollY = currentScrollY;
        lastScrollTime = now;
      };

      window.addEventListener('scroll', onScroll, { passive: true });

      tickerFn = (time, deltaTime) => {
        const dt = Math.min(deltaTime / 16.667, 2.5);
        const hoverMult = isHovered ? 0.2 : 1.0;

        // Smooth spring decay of scroll velocity bonus back to baseline
        scrollVelocityBonus += (targetVelocityBonus - scrollVelocityBonus) * (0.12 * dt);
        targetVelocityBonus *= Math.pow(0.89, dt);

        // Step: slow base glide + user scroll momentum
        const step = ((baseSpeed * hoverMult) + scrollVelocityBonus) * dt;

        xPos -= step;
        if (groupWidth > 20) {
          while (xPos <= -groupWidth) xPos += groupWidth;
          while (xPos > 0) xPos -= groupWidth;
        }

        track.style.transform = `translate3d(${xPos.toFixed(2)}px, 0, 0)`;
      };

      gsap.ticker.add(tickerFn);
      const timer = setTimeout(updateWidth, 350);

      cleanupScroll = () => {
        clearTimeout(timer);
        if (tickerFn) gsap.ticker.remove(tickerFn);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', updateWidth);
        marqueeEl.removeEventListener('mouseenter', onMouseEnter);
        marqueeEl.removeEventListener('mouseleave', onMouseLeave);
      };
    }

    return () => {
      ctx.revert();
      if (cleanupScroll) cleanupScroll();
    };
  }, []);

  return (
    <section ref={sectionRef} className="statement-section stack-section" id="statement" aria-label="Philosophy and Mindset">
      {/* Background Architectural Ambient Glow & Grid Lines */}
      <div className="statement-grid-overlay" aria-hidden="true">
        <div className="statement-grid-lines" />
        <div className="statement-ambient-glow" />
      </div>

      <div className="statement-divider-top" aria-hidden="true" />
 
      <div className="statement-container">
        {/* Section Header with Studio Minimalist Bullet Label (matching WhyCreatives reference) */}
        <div className="statement-header-row">
          <div className="statement-label-wrapper">
            <span className="statement-studio-label">
              <span className="statement-label-dot" aria-hidden="true">•</span>
              PHILOSOPHY &amp; MINDSET
            </span>
          </div>
        </div>

        {/* Clean, Elegant Hairline */}
        <div className="statement-hairline" aria-hidden="true" />

        {/* Hero Manifesto Block with Kinetic Line Mask Typography */}
        <div className="statement-hero-manifesto">
          <div className="statement-quote-box">
            <h2 className="statement-display-text">
              <span className="statement-line-inner">“I don’t just write code.</span>
              <span className="statement-line-inner">
                I architect <span className="statement-accent-tag accent-resilient">resilient systems</span>, integrate{' '}
                <span className="statement-accent-tag accent-ai">practical AI</span>,
              </span>
              <span className="statement-line-inner">
                and ship products that deliver <span className="statement-accent-tag accent-utility">real utility</span>.”
              </span>
            </h2>
          </div>

          {/* Action CTAs Row — Hero Section Matched Studio Style */}
          <div className="statement-actions-row">
            <Link 
              to="/about" 
              className="statement-btn-primary" 
              id="btn-statement-about"
              aria-label="View about story"
            >
              <span>About Me</span>
              <span className="statement-btn-arrow-badge" aria-hidden="true">
                <ArrowUpRight size={17} strokeWidth={2.2} />
              </span>
            </Link>

            <Link 
              to="/contact" 
              className="statement-link-secondary" 
              id="btn-statement-contact"
              aria-label="Start a project with Dhanush"
            >
              <span>Start a project</span>
              <span className="statement-link-arrow" aria-hidden="true">
                <ArrowUpRight size={17} strokeWidth={2.2} />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Services Scrolling Marquee — WhyCreatives Reference Style */}
      <div 
        ref={marqueeRef}
        className="statement-services-marquee" 
        aria-label="Services ticker"
      >
        <div ref={trackRef} className="statement-marquee-track">
          {/* Track Group 1 */}
          <div ref={groupRef} className="statement-marquee-group">
            {[...SERVICES_MARQUEE, ...SERVICES_MARQUEE].map((service, idx) => {
              const Icon = service.icon;
              return (
                <Link
                  key={`svc-1-${idx}`}
                  to={service.to}
                  className="statement-marquee-item"
                  aria-label={`Explore service: ${service.label}`}
                >
                  <span className="statement-marquee-icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <span className="statement-marquee-text">{service.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Track Group 2 (Duplicate for Seamless Infinite Loop) */}
          <div className="statement-marquee-group" aria-hidden="true">
            {[...SERVICES_MARQUEE, ...SERVICES_MARQUEE].map((service, idx) => {
              const Icon = service.icon;
              return (
                <Link
                  key={`svc-2-${idx}`}
                  to={service.to}
                  className="statement-marquee-item"
                  tabIndex={-1}
                >
                  <span className="statement-marquee-icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <span className="statement-marquee-text">{service.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="statement-divider-bottom" aria-hidden="true" />
    </section>
  );
}
