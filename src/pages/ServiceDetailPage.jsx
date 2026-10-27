import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowUpRight, Check } from 'lucide-react';

import { SERVICES_DATA, getServiceBySlug } from '../data/servicesData';
import { PROJECTS_DATA, getProjectBySlug } from '../data/projectsData';
import { absoluteUrl, breadcrumbs, PERSON, SITE_URL } from '../data/site';
import { useTheme } from '../hooks/useTheme';
import { navigateWithColor, isFloodArriving, floodLandingDelay } from '../utils/pageTransition';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/common/CustomCursor';
import SEO from '../components/common/SEO';
import { KineticTitle, SectionLabel, ClampText, useRevealOnScroll } from '../components/project/CaseStudyParts';
import { getToolBrandMeta, OVERVIEW_STATEMENTS } from '../components/service/serviceVisuals';
import '../styles/project-page.css';
import '../styles/service-page.css';

/**
 * Service page (/services/:slug): a hero card in the service's colour (the colour flood from the
 * Services list lands on it), then overview, deliverables, process, toolkit, related work, a CTA
 * and the next service. Shares its building blocks with the project case studies (.pcs-*).
 */
export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { theme, toggleTheme, isDark } = useTheme();
  const service = getServiceBySlug(slug);

  if (!service) return <Navigate to="/services" replace />;

  const url = absoluteUrl(`/services/${service.slug}`);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: service.title,
        description: service.description,
        url,
        provider: { '@id': `${SITE_URL}/#person` },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Deliverables',
          itemListElement: service.deliverables.map((item) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: item },
          })),
        },
      },
      PERSON,
      breadcrumbs([
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: service.title, path: `/services/${service.slug}` },
      ]),
    ],
  };

  return (
    <div className="portfolio-app pcs svc" style={{ '--pa': service.color }}>
      <SEO title={`${service.title} — Dhanush`} description={service.subtitle || service.description} canonical={url} schema={schema} />
      <CustomCursor />
      <Navbar theme={theme} toggleTheme={toggleTheme} transparent />
      {/* Keyed so reveals and animations start fresh for every service */}
      <ServiceView key={service.slug} service={service} isDark={isDark} />
      <Footer />
    </div>
  );
}

function ServiceView({ service, isDark }) {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  useRevealOnScroll(mainRef);

  // Arriving through a colour flood the card is already in place under the colour: no drop-in,
  // and the title waits until the colour has landed on it
  const [arriving] = useState(isFloodArriving);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    // Started from an effect so the clock begins after the previous page has been torn down
    const wait = arriving ? Math.max(0, floodLandingDelay() - 0.15) : 0.35;
    hero.style.setProperty('--svc-in', `${wait.toFixed(2)}s`);
    hero.classList.add('is-in');
  }, [arriving]);

  // Scroll listener that passes scroll offset/progress into CSS variables for fluid scroll animations
  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY || window.pageYOffset || 0;
        const heroHeight = heroRef.current ? heroRef.current.offsetHeight : 600;
        const progress = Math.min(1, Math.max(0, y / heroHeight));
        if (heroRef.current) {
          heroRef.current.style.setProperty('--svc-scroll-y', `${y}px`);
          heroRef.current.style.setProperty('--svc-scroll-p', progress.toFixed(3));
        }
        rafId = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const index = Math.max(0, SERVICES_DATA.findIndex((s) => s.slug === service.slug));
  const next = SERVICES_DATA[(index + 1) % SERVICES_DATA.length];
  const pad = (n) => String(n).padStart(2, '0');
  // This service's own case studies; every project if none are listed
  const related = (service.work || []).map(getProjectBySlug).filter(Boolean);
  const projects = related.length ? related : Object.values(PROJECTS_DATA);

  const flood = (e, { to, color, label, from }) => navigateWithColor(e, { to, color, label, navigate, from });

  return (
    <main id="main-content" ref={mainRef} className="svc-main">
      {/* ---------------- Hero: the service's colour card ---------------- */}
      <header ref={heroRef} className={`svc-hero ${arriving ? '' : 'svc-hero--drop'}`} data-flood-target>
        <span className="svc-hero-num" aria-hidden="true">{service.num}</span>

        <div className="svc-hero-inner pcs-wrap">
          <div className="svc-hero-top svc-in" style={{ '--d': '0s' }}>
            <Link to="/services" className="svc-back">
              <ArrowLeft size={15} strokeWidth={2.4} /> All services
            </Link>
          </div>

          {/* Kept short on purpose: the title, one action, three numbers. The pitch follows in Overview. */}
          <h1 className="svc-hero-title" aria-label={service.title}>
            <KineticTitle text={service.title} />
          </h1>

          <div className="svc-hero-foot">
            <div className="svc-hero-actions svc-in" style={{ '--d': '0.35s' }}>
              <Link to="/contact" className="pcs-pill svc-hero-pill">
                <span>Start a project</span>
                <span className="pcs-pill-badge"><ArrowUpRight size={17} strokeWidth={2.2} /></span>
              </Link>
              <a
                href="#svc-overview"
                className="svc-hero-down"
                aria-label="Scroll to the overview"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById('svc-overview');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <span className="svc-hero-down-pulse" aria-hidden="true" />
                <ArrowDown size={18} strokeWidth={2.4} />
              </a>
            </div>

            <dl className="svc-hero-facts svc-in" style={{ '--d': '0.5s' }}>
              <div><dt>Phases</dt><dd>{pad(service.process.length)}</dd></div>
              <div><dt>Deliverables</dt><dd>{pad(service.deliverables.length)}</dd></div>
              <div><dt>Tools</dt><dd>{pad(service.tools.length)}</dd></div>
            </dl>
          </div>
        </div>
      </header>

      {/* ---------------- Tilted toolkit band ---------------- */}
      <div className="pcs-band" aria-hidden="true">
        <div className="pcs-band-track">
          {[0, 1].map((copy) => (
            <span className="pcs-band-group" key={copy}>
              {[...service.tools, ...service.tools].map((w, i) => (
                <span className="pcs-band-item" key={`${copy}-${i}`}>
                  {w}
                  <i className="pcs-band-dot" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ---------------- Overview + outcomes ---------------- */}
      <section className="pcs-section pcs-wrap" aria-labelledby="svc-overview">
        <SectionLabel num="01" id="svc-overview">Overview</SectionLabel>
        <ClampText className="pcs-statement svc-statement" lines={6} data-reveal>
          {OVERVIEW_STATEMENTS[service.slug] || service.description}
        </ClampText>
        {service.outcomes?.length > 0 && (
          <ol className="svc-outcomes" aria-label="Outcomes">
            {service.outcomes.map((o, i) => (
              <li key={o} className={`svc-outcome svc-outcome--${i % 3}`} data-reveal style={{ '--d': `${i * 0.1}s` }}>
                <span className="svc-outcome-num">{pad(i + 1)}</span>
                <p>{o}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* ---------------- Deliverables ---------------- */}
      <section className="pcs-section pcs-wrap" aria-labelledby="svc-get">
        <SectionLabel num="02" id="svc-get">What you get</SectionLabel>
        <ol className="svc-deliver">
          {service.deliverables.map((d, i) => (
            <li key={d} className="svc-deliver-item" data-reveal style={{ '--d': `${(i % 2) * 0.08}s` }}>
              <span className="svc-deliver-num">{pad(i + 1)}</span>
              <p>{d}</p>
              <span className="svc-check" aria-hidden="true"><Check size={15} strokeWidth={3} /></span>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- Process timeline ---------------- */}
      <section className="pcs-section pcs-wrap" id="svc-process" aria-labelledby="svc-process-title">
        <SectionLabel num="03" id="svc-process-title">How it runs</SectionLabel>
        <ol className="svc-process" data-reveal style={{ '--steps': service.process.length }}>
          {service.process.map((step, i) => (
            <li key={step} className="svc-step" style={{ '--s': i }}>
              <span className="svc-step-node">{pad(i + 1)}</span>
              <span className="svc-step-phase">Phase {i + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- Toolkit ---------------- */}
      <section className="pcs-section pcs-wrap" aria-labelledby="svc-tools">
        <SectionLabel num="04" id="svc-tools">Toolkit</SectionLabel>
        <div className="svc-toolkit">
          <div data-reveal>
            <h2 className="svc-h2">Tools chosen for the work<span className="pcs-dot">.</span></h2>
            <p className="svc-text">
              Every project gets the stack that fits it, not the one that is fashionable. These are the tools I reach for most
              on {service.display.toLowerCase()} work.
            </p>
          </div>
          <ul className="svc-tools" data-reveal style={{ '--d': '0.1s' }}>
            {service.tools.map((tool) => {
              const brand = getToolBrandMeta(tool, isDark);
              return (
                <li key={tool} style={{ '--brand': brand.color, '--brand-bg': brand.bg }}>
                  <ToolIcon brand={brand} />
                  {tool}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------------- Selected work ---------------- */}
      <section className="pcs-section pcs-wrap" id="svc-work" aria-labelledby="svc-work-title">
        <SectionLabel num="05" id="svc-work-title">Selected work</SectionLabel>
        <ul className="svc-work">
          {projects.map((p, i) => (
            <li key={p.slug} data-reveal style={{ '--d': `${i * 0.07}s` }}>
              <Link
                to={`/work/${p.slug}`}
                className="svc-work-row"
                style={{ '--wa': p.accent }}
                onClick={(e) =>
                  flood(e, { to: `/work/${p.slug}`, color: p.accent, label: p.title, from: e.currentTarget.querySelector('.svc-work-arrow') })
                }
              >
                <span className="svc-work-idx">{pad(i + 1)}</span>
                {p.logo ? <img src={p.logo} alt="" className="svc-work-logo" /> : <span className="svc-work-logo" />}
                <span className="svc-work-text">
                  <span className="svc-work-title">{p.title}</span>
                  <span className="svc-work-cat">{p.category}</span>
                </span>
                <span className="svc-work-year">{p.year}</span>
                <span className="svc-work-arrow" aria-hidden="true"><ArrowUpRight size={18} strokeWidth={2.2} /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="pcs-section pcs-wrap">
        <div className="svc-cta" data-reveal>
          <div>
            <p className="svc-cta-kicker">Next step</p>
            <h2 className="svc-cta-title">
              Tell me what needs to <span className="svc-cta-mark">change</span>.
            </h2>
            <p className="svc-cta-text">
              I will review your requirements, recommend the right architecture and scope, and deliver high-impact results.
            </p>
          </div>
          <Link to="/contact" className="pcs-pill svc-cta-pill">
            <span>Start a conversation</span>
            <span className="pcs-pill-badge"><ArrowUpRight size={17} strokeWidth={2.2} /></span>
          </Link>
        </div>
      </section>

      {/* ---------------- Next service ---------------- */}
      <section className="pcs-wrap pcs-next-wrap" aria-label="Next service">
        <Link
          to={`/services/${next.slug}`}
          className="pcs-next"
          style={{ '--na': next.color }}
          onClick={(e) =>
            flood(e, {
              to: `/services/${next.slug}`,
              color: next.color,
              label: next.title,
              from: e.currentTarget.querySelector('.pcs-next-badge'),
            })
          }
          data-reveal
        >
          <div className="pcs-next-head">
            <span className="pcs-next-label">Next service — {next.num}</span>
          </div>

          <div className="pcs-next-body">
            <h2 className="pcs-next-title">
              {next.title}
              <span className="pcs-next-dot">.</span>
            </h2>
          </div>

          <div className="pcs-next-foot">
            <p className="pcs-next-cat">{next.subtitle}</p>
            <span className="pcs-next-badge" aria-hidden="true">
              <ArrowUpRight size={24} strokeWidth={2.4} />
            </span>
          </div>
        </Link>
      </section>
    </main>
  );
}

function ToolIcon({ brand }) {
  if (!brand?.icon) return <i className="svc-tool-dot" aria-hidden="true" />;
  return (
    <svg className="svc-tool-icon" viewBox="0 0 24 24" aria-hidden="true" style={{ color: brand.color }}>
      <path d={brand.icon} fill="currentColor" />
    </svg>
  );
}

