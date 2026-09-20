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

// The 6 core services aligned with WHY_SERVICES_DATA and Image 2 layout
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

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tag = sectionRef.current.querySelector('.expertise-tag');
      const titleLines = sectionRef.current.querySelectorAll('.title-line');
      const actionBtn = sectionRef.current.querySelector('.expertise-header-right');
      const rows = sectionRef.current.querySelectorAll('.expertise-row');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
      });

      if (tag) {
        tl.fromTo(
          tag,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'all' }
        );
      }

      if (titleLines && titleLines.length > 0) {
        tl.fromTo(
          titleLines,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power4.out', clearProps: 'all' },
          '-=0.4'
        );
      }

      if (actionBtn) {
        tl.fromTo(
          actionBtn,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'all' },
          '-=0.5'
        );
      }

      if (rows && rows.length > 0) {
        tl.fromTo(
          rows,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
          },
          '-=0.3'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section capabilities-editorial-section stack-section"
      id="capabilities"
      aria-label="Our Expertise & Services"
    >
      <div className="expertise-container">
        {/* Exact WhyCreatives 3-Column Editorial Header on Laptop */}
        <div className="expertise-header">
          {/* Column 1: Left Tag */}
          <div className="expertise-header-left">
            <span className="expertise-tag">
              <span className="expertise-tag-dot">•</span> OUR EXPERTISE
            </span>
          </div>

          {/* Column 2: Center Headline */}
          <div className="expertise-header-center">
            <h2 className="expertise-title">
              <span className="title-line">How we take your</span>
              <span className="title-line">business to the next level</span>
            </h2>
          </div>

          {/* Column 3: Right Subtitle + CTA Button */}
          <div className="expertise-header-right">
            <p className="expertise-header-desc">
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

        {/* Minimalist Editorial Services Rows with Icons & Row Arrow (WhyCreatives Style) */}
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
