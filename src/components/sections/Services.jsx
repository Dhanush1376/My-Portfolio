import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Globe,
  Sparkles,
  ShoppingBag,
  Workflow,
  Layout,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// The 6 core services aligned with SERVICES_DATA
const EXPERTISE_SERVICES = [
  {
    id: 'web-development',
    name: 'Web & App Development',
    desc: 'Fast, responsive web apps & reactive interfaces.',
    icon: Globe,
    slug: 'web-development',
  },
  {
    id: 'ai-rag-applications',
    name: 'AI & RAG Applications',
    desc: 'Autonomous AI agents & custom RAG pipelines.',
    icon: Sparkles,
    slug: 'ai-rag-applications',
  },
  {
    id: 'ecommerce-development',
    name: 'E-Commerce Development',
    desc: 'High-speed storefronts with 1-click checkouts.',
    icon: ShoppingBag,
    slug: 'ecommerce-development',
  },
  {
    id: 'ai-automation-integrations',
    name: 'AI Automation & Integrations',
    desc: 'Autonomous workflows & custom API connections.',
    icon: Workflow,
    slug: 'ai-automation-integrations',
  },
  {
    id: 'landing-pages',
    name: 'Landing Pages',
    desc: 'High-converting editorial pages built for speed.',
    icon: Layout,
    slug: 'landing-pages',
  },
  {
    id: 'business-dashboards',
    name: 'Business Dashboards',
    desc: 'Real-time metrics, analytics & live data portals.',
    icon: TrendingUp,
    slug: 'business-dashboards',
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      const tagEl = headerRef.current?.querySelector('.tilted-tag-wrapper');
      const lines = headerRef.current?.querySelectorAll('.title-line-inner');
      const barEl = headerRef.current?.querySelector('.services-header-bar');
      const rows = sectionRef.current?.querySelectorAll('.expertise-row');

      // 1. Tilted tape tag bounce-pop on scroll
      if (tagEl) {
        gsap.fromTo(
          tagEl,
          { opacity: 0.1, scale: 0.85, y: 18 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.65,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 88%',
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
            yPercent: 60,
            opacity: 0.1,
            filter: 'blur(3px)',
          },
          {
            yPercent: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.08,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

      // 3. Header Action Bar (Description + Button)
      if (barEl) {
        gsap.fromTo(
          barEl,
          { opacity: 0.1, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      // 4. Individual Progressive Row Reveals as user scrolls down
      if (rows && rows.length > 0) {
        rows.forEach((row, i) => {
          const iconBox = row.querySelector('.expertise-icon-box');
          const rowName = row.querySelector('.expertise-row-name');
          const rowDesc = row.querySelector('.expertise-row-desc');

          // Row elevation and opacity
          gsap.fromTo(
            row,
            {
              y: 32,
              opacity: 0.15,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 92%',
                once: true,
              },
            }
          );

          // Icon box micro spring pop for mobile & touch views
          if (iconBox && window.innerWidth <= 768) {
            gsap.fromTo(
              iconBox,
              { scale: 0.7, rotate: -8, opacity: 0.2 },
              {
                scale: 1,
                rotate: 0,
                opacity: 1,
                duration: 0.55,
                ease: 'back.out(1.8)',
                scrollTrigger: {
                  trigger: row,
                  start: 'top 92%',
                  once: true,
                },
              }
            );
          }
        });
      }
    }, sectionRef);

    // Refresh ScrollTrigger to calculate accurate layout
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section capabilities-editorial-section stack-section"
      id="capabilities"
      aria-label="My Expertise & Services"
    >
      <div className="expertise-container">
        {/* Visual Climax Header (Exact 1:1 Match to Selected Work & Contact Climax Style) */}
        <div className="services-climax-header" ref={headerRef}>
          <div className="tilted-tag-wrapper">
            <span className="tilted-tag">EXPERTISE</span>
          </div>

          <h2 className="services-huge-headline">
            <div className="title-line-mask">
              <span className="title-line-inner">MY</span>
            </div>
            <div className="title-line-mask">
              <span className="title-line-inner">SERVICES<span className="title-accent">.</span></span>
            </div>
          </h2>

          <div className="services-header-bar">
            <p className="services-header-desc">
              Professional engineering &amp; AI services to elevate your brand and grow your business.
            </p>
            <Link to="/services" className="see-all-services-btn" aria-label="See all services">
              <span>See all services</span>
              <span className="see-all-arrow-badge" aria-hidden="true">
                <ArrowUpRight size={17} strokeWidth={2.2} />
              </span>
            </Link>
          </div>
        </div>

        {/* Minimalist Editorial Services Rows with Icons & Row Arrow */}
        <div className="expertise-list">
          {EXPERTISE_SERVICES.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                to={`/services/${service.slug}`}
                key={service.id}
                className="expertise-row"
                aria-label={`${service.name} — ${service.desc}`}
              >
                <div className="expertise-row-left">
                  {/* Rounded Icon Tile (Visible on mobile, expands on hover on laptop) */}
                  <div className="expertise-icon-box" aria-hidden="true">
                    <Icon size={26} strokeWidth={2.2} />
                  </div>

                  <div className="expertise-text-col">
                    {/* Big Editorial Headline */}
                    <h3 className="expertise-row-name">{service.name}</h3>
                    {/* Editorial Description / Subtitle for mobile view */}
                    <p className="expertise-row-desc">{service.desc}</p>
                  </div>
                </div>

                {/* Right Interactive Arrow Circle (Reveals on hover) */}
                <div className="expertise-row-arrow" aria-hidden="true">
                  <ArrowUpRight size={22} strokeWidth={2.4} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
