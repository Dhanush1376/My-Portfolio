import React, { useRef } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';

import { SERVICES_DATA, getServiceBySlug } from '../data/servicesData';
import { PROJECTS_DATA } from '../data/projectsData';
import { absoluteUrl, breadcrumbs, PERSON, SITE_URL } from '../data/site';
import { useTheme } from '../hooks/useTheme';
import { navigateWithColor } from '../utils/pageTransition';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/common/CustomCursor';
import SEO from '../components/common/SEO';
import NotchedCard from '../components/common/NotchedCard';
import { KineticTitle, SectionLabel, ClampText, useRevealOnScroll } from '../components/project/CaseStudyParts';
import { getToolBrandMeta, OVERVIEW_STATEMENTS } from '../components/service/serviceVisuals';
import '../styles/project-page.css';
import '../styles/service-page.css';

/**
 * Service page (/services/:slug), built from the same parts as the project case studies:
 * kinetic title, notched colour-field stage, tilted band, numbered sections, colour-flood "next".
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
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      {/* Keyed so reveals and animations start fresh for every service */}
      <ServiceView key={service.slug} service={service} isDark={isDark} />
      <Footer />
    </div>
  );
}

function ServiceView({ service, isDark }) {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  useRevealOnScroll(mainRef);

  const index = Math.max(0, SERVICES_DATA.findIndex((s) => s.slug === service.slug));
  const next = SERVICES_DATA[(index + 1) % SERVICES_DATA.length];
  const total = String(SERVICES_DATA.length).padStart(2, '0');
  const projects = Object.values(PROJECTS_DATA);
  const orbitTools = service.tools.slice(0, 8);

  const flood = (e, { to, color, label, from }) => navigateWithColor(e, { to, color, label, navigate, from });

  return (
    <main id="main-content" ref={mainRef} className="pcs-main">
      {/* ---------------- Hero ---------------- */}
      <header className="pcs-hero pcs-wrap">
        <div className="pcs-topline">
          <nav className="pcs-crumbs" aria-label="Breadcrumb">
            <Link to="/services" className="pcs-back">
              <ArrowLeft size={14} strokeWidth={2.4} /> All services
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{service.display}</span>
          </nav>
          <span className="pcs-index">
            Service <b>{service.num}</b> / {total}
          </span>
        </div>

        <h1 className="pcs-title" aria-label={service.title}>
          <KineticTitle text={service.title} />
        </h1>

        <div className="pcs-hero-grid">
          <div className="pcs-hero-copy pcs-rise" style={{ '--d': '0.45s' }}>
            <p className="pcs-lede">
              <span className="pcs-lede-bar" aria-hidden="true">|</span>
              {service.subtitle}
            </p>
            <div className="pcs-ctas">
              <Link to="/contact" className="pcs-pill">
                <span>Start a project</span>
                <span className="pcs-pill-badge"><ArrowUpRight size={17} strokeWidth={2.2} /></span>
              </Link>
              <a href="#svc-work" className="pcs-text-link">
                See selected work <ArrowUpRight size={16} strokeWidth={2.2} />
              </a>
            </div>
          </div>

          <dl className="pcs-specs pcs-rise" style={{ '--d': '0.55s' }}>
            <div><dt>Discipline</dt><dd>{service.display}</dd></div>
            <div><dt>Process</dt><dd>{service.process.length} phases</dd></div>
            <div><dt>Deliverables</dt><dd>{service.deliverables.length} core pieces</dd></div>
            <div><dt>Toolkit</dt><dd>{service.tools.length} technologies</dd></div>
          </dl>
        </div>
      </header>

      {/* ---------------- Notched colour-field stage: the toolkit orbits the discipline ---------------- */}
      <section className="pcs-media pcs-wrap pcs-rise" style={{ '--d': '0.65s' }} aria-label={`${service.title} toolkit`}>
        <NotchedCard
          bezelWidth={8}
          bezelColor="#000000"
          className="pcs-notched svc-notched"
          tags={
            <div className="pcs-media-tags">
              <span className="project-tag-pill">
                <span className="pcs-live-dot" aria-hidden="true" />
                Taking new projects
              </span>
            </div>
          }
          meta={
            <div className="project-meta-row">
              <span>Service {service.num}</span>
              <span className="project-meta-sep">•</span>
              <span>{service.display}</span>
            </div>
          }
        >
          <div className="svc-stage">
            <span className="svc-stage-num" aria-hidden="true">{service.num}</span>
            <p className="svc-stage-title">
              {/* Non-breaking hyphen so "E-Commerce" never splits across lines */}
              {service.display.replace(/-/g, '‑')}
              <span className="svc-stage-dot">.</span>
            </p>
            <ul className="svc-orbit" aria-label="Toolkit">
              {orbitTools.map((tool, i) => {
                const brand = getToolBrandMeta(tool, false);
                return (
                  <li key={tool} className="svc-chip" style={{ '--o': i, '--n': orbitTools.length }}>
                    <ToolIcon brand={brand} />
                    {tool}
                  </li>
                );
              })}
            </ul>
          </div>
        </NotchedCard>
      </section>

      {/* ---------------- Tilted colour band ---------------- */}
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
        <ClampText className="pcs-statement svc-statement" lines={5} data-reveal>
          {OVERVIEW_STATEMENTS[service.slug] || service.description}
        </ClampText>
        {service.outcomes?.length > 0 && (
          <ol className="svc-outcomes pcs-swipe">
            {service.outcomes.map((o, i) => (
              <li key={o} className={`svc-outcome svc-outcome--${i % 3}`} data-reveal style={{ '--d': `${i * 0.1}s` }}>
                <span className="svc-outcome-num">{String(i + 1).padStart(2, '0')}</span>
                <p>{o}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* ---------------- Deliverables bento ---------------- */}
      <section className="pcs-section pcs-wrap" aria-labelledby="svc-get">
        <SectionLabel num="02" id="svc-get" swipe>What you get</SectionLabel>
        <ol className="pcs-bento pcs-swipe">
          {service.deliverables.map((d, i) => (
            <li
              key={d}
              className={`pcs-bento-item ${i === 0 ? 'pcs-bento-item--lead' : ''}`}
              style={{ '--d': `${(i % 3) * 0.08}s` }}
              data-reveal
            >
              <span className="pcs-bento-num">{String(i + 1).padStart(2, '0')}</span>
              <p>{d}</p>
              <span className="svc-check" aria-hidden="true"><Check size={15} strokeWidth={3} /></span>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- Process timeline ---------------- */}
      <section className="pcs-section pcs-wrap" aria-labelledby="svc-process">
        <SectionLabel num="03" id="svc-process">How it runs</SectionLabel>
        <ol className="svc-process" data-reveal style={{ '--steps': service.process.length }}>
          {service.process.map((step, i) => (
            <li key={step} className="svc-step" style={{ '--s': i }}>
              <span className="svc-step-node">{String(i + 1).padStart(2, '0')}</span>
              <span className="svc-step-phase">Phase {i + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- Toolkit ---------------- */}
      <section className="pcs-section pcs-wrap" aria-labelledby="svc-tools">
        <SectionLabel num="04" id="svc-tools">Toolkit</SectionLabel>
        <div className="pcs-role-grid">
          <div data-reveal>
            <h2 className="pcs-role-title">Tools chosen for the work<span className="pcs-dot">.</span></h2>
            <p className="pcs-role-text">
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
        <SectionLabel num="05" id="svc-work-title" swipe>Selected work</SectionLabel>
        <ul className="svc-work pcs-swipe">
          {projects.map((p, i) => (
            <li key={p.slug} data-reveal style={{ '--d': `${i * 0.08}s` }}>
              <Link
                to={`/work/${p.slug}`}
                className="svc-work-card"
                style={{ '--wa': p.accent }}
                onClick={(e) => flood(e, { to: `/work/${p.slug}`, color: p.accent, label: p.title })}
              >
                <span className="svc-work-top">
                  {p.logo && <img src={p.logo} alt="" className="svc-work-logo" />}
                  <span className="svc-work-arrow" aria-hidden="true"><ArrowUpRight size={18} strokeWidth={2.2} /></span>
                </span>
                <span className="svc-work-title">{p.title}</span>
                <span className="svc-work-cat">{p.category}</span>
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
          <span className="pcs-next-label">Next service — {next.num}</span>
          <span className="pcs-next-title">
            {next.title}
            <span className="pcs-next-dot">.</span>
          </span>
          <span className="pcs-next-foot">
            <span className="pcs-next-cat">{next.subtitle}</span>
            <span className="pcs-next-badge" aria-hidden="true">
              <ArrowUpRight size={26} strokeWidth={2.2} />
            </span>
          </span>
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

