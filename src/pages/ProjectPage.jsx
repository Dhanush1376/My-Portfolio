import React, { useMemo, useRef } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, ArrowRight, Github, Check, X, ChevronDown } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLoopingVideo } from '../hooks/useLoopingVideo';
import { PROJECTS_DATA, getProjectBySlug } from '../data/projectsData';
import { getProjectScreens } from '../data/projectScreens';
import { projectMeta, projectSchema, projectPath, absoluteUrl } from '../data/site';
import { navigateWithColor } from '../utils/pageTransition';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/common/CustomCursor';
import SEO from '../components/common/SEO';
import ScreenGallery from '../components/project/ScreenGallery';
import BrandStack from '../components/project/BrandStack';
import { PALETTE, KineticTitle, SectionLabel, ClampText, SectionRule, useRevealOnScroll } from '../components/project/CaseStudyParts';
import '../styles/project-page.css';

/**
 * Case-study page for one project (/work/:slug): its own indexable URL, title and structured data,
 * dressed in the site's language (notched card, colour fields, kinetic type, mono captions).
 */
export default function ProjectPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const { theme, toggleTheme } = useTheme();

  if (!project) return <Navigate to="/404" replace />;

  const meta = projectMeta(project);

  return (
    <div className="portfolio-app pcs" style={{ '--pa': project.accent }}>
      <SEO
        title={meta.title}
        description={meta.description}
        canonical={absoluteUrl(meta.path)}
        image={meta.image}
        type="article"
        schema={projectSchema(project)}
      />
      <CustomCursor />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      {/* Keyed so every piece of state (gallery tab, reveals, video) starts fresh per project */}
      <CaseStudy key={project.slug} project={project} />
      <Footer />
    </div>
  );
}

function CaseStudy({ project }) {
  const navigate = useNavigate();
  const mainRef = useRef(null);

  const all = Object.values(PROJECTS_DATA);
  const index = all.findIndex((p) => p.slug === project.slug);
  const next = all[(index + 1) % all.length];
  const screens = useMemo(() => getProjectScreens(project.slug), [project.slug]);
  // Hero devices: the walkthrough plays in the laptop; the phone shows the first raw phone screen
  const heroVideoRef = useRef(null);
  const isHeroVideoPlaying = useLoopingVideo(heroVideoRef, {
    src: project.video,
    inViewOnly: true,
    threshold: 0.01,
  });
  const heroDesktop = screens.desktop[0]?.src;
  const heroMobileShot = screens.mobile.find((sc) => sc.kind === 'mobile') || screens.mobile[0];
  const heroMobile = heroMobileShot?.src;

  const phoneTone = useMemo(() => {
    if (!project.accent) return 'dark';
    const hex = project.accent.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 140 ? 'dark' : 'light';
  }, [project.accent]);

  const [roleTitle, roleText] = project.role.includes(' — ') ? project.role.split(' — ') : ['Developer', project.role];
  const isGithub = project.liveUrl?.includes('github.com');
  const phrases = (project.stage?.phrases || []).map((p) => p.words.join(' '));
  const bandWords = phrases.length ? phrases : project.tags;

  useRevealOnScroll(mainRef);

  // Next project: its colour floods the screen, then the page changes underneath
  const goNext = (e) =>
    navigateWithColor(e, {
      to: projectPath(next),
      color: next.accent,
      label: next.title,
      navigate,
      from: e.currentTarget.querySelector('.pcs-next-badge'),
    });

  return (
    <main id="main-content" ref={mainRef} className="pcs-main">
      {/* ---------------- Hero ---------------- */}
      <header className="pcs-hero pcs-wrap">
        <div className="pcs-topline">
          <nav className="pcs-crumbs" aria-label="Breadcrumb">
            <Link to="/#work" className="pcs-back">
              <ArrowLeft size={14} strokeWidth={2.4} /> All work
            </Link>
            <span className="pcs-crumb-sep" aria-hidden="true">/</span>
            <span className="pcs-crumb-current" aria-current="page">{project.title}</span>
          </nav>
          <span className="pcs-index">
            Case study <b>{project.num}</b> / {String(all.length).padStart(2, '0')}
          </span>
        </div>

        {/* Product showcase: the pitch on the left, the product itself on the right */}
        <div className="pcs-show">
          <div className="pcs-show-copy">
            <div className="pcs-intro-meta pcs-rise" style={{ '--d': '0.05s' }}>
              {project.logo && (
                <div className="pcs-intro-logo-wrap">
                  <img src={project.logo} alt="" className="pcs-intro-logo" width="34" height="34" />
                </div>
              )}
              <span className="pcs-intro-badge">{project.category}</span>
              <span className="pcs-intro-dot" aria-hidden="true">•</span>
              <span className="pcs-intro-year">{project.year}</span>
            </div>

            {/* Title row: includes logo before title and compact Visit button beside it on mobile */}
            <div className="pcs-title-row">
              <div className="pcs-title-wrap">
                {project.logo && (
                  <div className="pcs-mobile-hero-logo" aria-hidden="true">
                    <img src={project.logo} alt={`${project.title} logo`} />
                  </div>
                )}
                <h1 className="pcs-title pcs-show-title" aria-label={project.title}>
                  <KineticTitle text={project.title} />
                </h1>
              </div>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener"
                  className="pcs-mobile-visit-btn"
                  aria-label={isGithub ? 'View GitHub' : 'Visit live website'}
                >
                  <span>Visit</span>
                  {isGithub ? <Github size={13} strokeWidth={2.4} /> : <ArrowUpRight size={14} strokeWidth={2.4} />}
                </a>
              )}
            </div>

            <p className="pcs-show-lede pcs-rise" style={{ '--d': '0.45s' }}>{project.subtitle}</p>

            {project.liveUrl && (
              <div className="pcs-show-actions pcs-rise" style={{ '--d': '0.55s' }}>
                <a href={project.liveUrl} target="_blank" rel="noopener" className="pcs-pill">
                  <span>{isGithub ? 'View on GitHub' : 'Visit live website'}</span>
                  <span className="pcs-pill-badge">
                    {isGithub ? <Github size={16} strokeWidth={2.2} /> : <ArrowUpRight size={17} strokeWidth={2.2} />}
                  </span>
                </a>
              </div>
            )}
          </div>

          <div className="pcs-show-stage" aria-hidden="true">
            <span className="pcs-show-glow" />
            <div className="pcs-laptop">
              <div className="pcs-laptop-lid">
                <span className="pcs-laptop-cam" />
                <div className="pcs-laptop-screen">
                  {project.video ? (
                    <>
                      <img
                        src={heroDesktop || project.img}
                        alt=""
                        className={`pcs-laptop-poster ${isHeroVideoPlaying ? 'poster-faded' : ''}`}
                      />
                      <video
                        ref={heroVideoRef}
                        src={project.video}
                        poster={heroDesktop || project.img}
                        loop
                        muted
                        playsInline
                        preload="auto"
                        disablePictureInPicture
                        disableRemotePlayback
                        className={`pcs-laptop-video ${isHeroVideoPlaying ? 'video-playing' : ''}`}
                      />
                    </>
                  ) : (
                    <img src={heroDesktop || project.img} alt="" />
                  )}
                </div>
              </div>
              <div className="pcs-laptop-base"><span /></div>
            </div>
            <div className="pcs-phone" data-tone={phoneTone}>
              <div className="pcs-phone-body">
                <div className="pcs-phone-speaker" aria-hidden="true" />
                <div className="pcs-phone-screen">
                  {/* Authentic Apple iOS Status Bar */}
                  <div className="pcs-phone-topbar" aria-hidden="true">
                    <span className="pcs-phone-time">9:41</span>
                    <span className="pcs-phone-island">
                      <i className="pcs-phone-camera" />
                    </span>
                    <div className="pcs-phone-icons">
                      <svg className="pcs-phone-signal" viewBox="0 0 16 12" fill="currentColor">
                        <rect x="0" y="8" width="2.5" height="4" rx="0.5" />
                        <rect x="4" y="5" width="2.5" height="7" rx="0.5" />
                        <rect x="8" y="2.5" width="2.5" height="9.5" rx="0.5" />
                        <rect x="12" y="0" width="2.5" height="12" rx="0.5" />
                      </svg>
                      <svg className="pcs-phone-wifi" viewBox="0 0 16 12" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8 11.2a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4zm-3.6-3.8a5.1 5.1 0 017.2 0 .8.8 0 101.14-1.12 6.7 6.7 0 00-9.48 0 .8.8 0 101.14 1.12zm-2.6-2.6a8.8 8.8 0 0112.4 0 .8.8 0 101.14-1.12 10.4 10.4 0 00-14.68 0 .8.8 0 101.14 1.12z" />
                      </svg>
                      <div className="pcs-phone-battery">
                        <span className="pcs-phone-battery-fill" />
                      </div>
                    </div>
                  </div>

                  {heroMobile ? (
                    <img
                      src={heroMobile}
                      alt=""
                      // its exact shape before it loads, so the phone never resizes
                      style={heroMobileShot.w ? { aspectRatio: `${heroMobileShot.w} / ${heroMobileShot.h}` } : undefined}
                    />
                  ) : (
                    <div className="pcs-phone-splash">
                      <span className="pcs-ph-bar" />
                      <div className="pcs-ph-media">
                        {project.logo ? (
                          <img src={project.logo} alt="" className="pcs-ph-logo" />
                        ) : (
                          <i className="pcs-ph-logo" />
                        )}
                      </div>
                      <span className="pcs-ph-row" />
                      <span className="pcs-ph-row pcs-ph-row--short" />
                      <div className="pcs-ph-chips">
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                  )}

                  {/* Apple iOS Home Indicator */}
                  <span className="pcs-phone-home-indicator" aria-hidden="true" />
                  {/* Ambient Glass Glare */}
                  <span className="pcs-phone-glare" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <SectionRule />

      {/* ---------------- Screens Gallery (Cards) ---------------- */}
      <section className="pcs-section pcs-screens" aria-labelledby="pcs-screens">
        <ScreenGallery
          project={project}
          screens={screens}
          label={
            <div className="sg-climax-tag-wrap" id="pcs-screens">
              <span className="sg-climax-tag">SCREENS</span>
            </div>
          }
          title={
            <h2 className="pcs-h2 sg-climax-title" data-reveal>
              <span className="title-line-mask">
                <span className="title-line-inner">Interface<span className="pcs-dot">.</span></span>
              </span>
            </h2>
          }
        />
      </section>

      {/* ---------------- Tilted colour band ---------------- */}
      <div className="pcs-band" aria-hidden="true">
        <div className="pcs-band-track">
          {[0, 1].map((copy) => (
            <span className="pcs-band-group" key={copy}>
              {[...bandWords, ...bandWords].map((w, i) => (
                <span className="pcs-band-item" key={`${copy}-${i}`}>
                  {w}
                  <i className="pcs-band-dot" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ---------------- Challenge: before -> after, readable at a glance ---------------- */}
      <section className="pcs-section pcs-wrap" aria-labelledby="pcs-challenge">
        <div className="pcs-climax-header" id="pcs-challenge" data-reveal>
          <div className="pcs-climax-tag-wrap">
            <span className="pcs-climax-tag">CHALLENGE</span>
          </div>
          <h2 className="pcs-h2 pcs-climax-title">
            <span className="title-line-mask">
              <span className="title-line-inner">From problem to solved<span className="pcs-dot">.</span></span>
            </span>
          </h2>
        </div>

        <div className="pcs-ba" data-reveal>
          <div className="pcs-ba-head" aria-hidden="true">
            <span className="pcs-ba-head-before">Before</span>
            <span />
            <span className="pcs-ba-head-after">After</span>
          </div>
          <ol className="pcs-ba-list">
            {(project.challenge?.length ? project.challenge : [{ problem: project.problem, solution: project.solution }]).map((pair, i) => (
              <li key={pair.problem} className="pcs-ba-row" style={{ '--r': i }}>
                <div className="pcs-ba-card pcs-ba-before">
                  <span className="pcs-ba-ico" aria-hidden="true"><X size={14} strokeWidth={3} /></span>
                  <span className="pcs-ba-tag">Before</span>
                  <p><span className="pcs-ba-strike">{pair.problem}</span></p>
                </div>
                <span className="pcs-ba-arrow" aria-hidden="true">
                  <i />
                  <ArrowRight size={18} strokeWidth={2.4} />
                </span>
                <div className="pcs-ba-card pcs-ba-after">
                  <span className="pcs-ba-ico" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
                  <span className="pcs-ba-tag">After</span>
                  <p>{pair.solution}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* The full write-up stays on the page, folded away with rich animated toggle */}
        <details className="pcs-ba-story" data-reveal>
          <summary>
            <span className="pcs-ba-summary-text">Read the full story</span>
            <span className="pcs-ba-summary-chevron" aria-hidden="true">
              <ChevronDown size={15} strokeWidth={2.4} />
            </span>
          </summary>
          <div className="pcs-ba-story-body">
            <div className="pcs-ba-story-card pcs-ba-story-problem">
              <div className="pcs-ba-story-head">
                <span className="pcs-ba-story-dot problem-dot" aria-hidden="true" />
                <h4>The problem</h4>
              </div>
              <p>{project.problem}</p>
            </div>
            <div className="pcs-ba-story-bridge" aria-hidden="true">
              <span className="pcs-ba-story-arrow">
                <ArrowRight size={18} strokeWidth={2.4} />
              </span>
            </div>
            <div className="pcs-ba-story-card pcs-ba-story-solution">
              <div className="pcs-ba-story-head">
                <span className="pcs-ba-story-dot solution-dot" aria-hidden="true" />
                <h4>The solution</h4>
              </div>
              <p>{project.solution}</p>
            </div>
          </div>
        </details>
      </section>

      <SectionRule />

      {/* ---------------- Features bento ---------------- */}
      <section className="pcs-section pcs-wrap" aria-labelledby="pcs-built">
        <SectionLabel num="03" id="pcs-built">What was built</SectionLabel>
        {/* Bento on desktop; a numbered list on phones (see .pcs-bento--list) */}
        <ol className="pcs-bento pcs-bento--list">
          {project.features.map((f, i) => (
            <li
              key={f}
              className={`pcs-bento-item ${i === 0 ? 'pcs-bento-item--lead' : ''}`}
              style={{ '--chip': PALETTE[(i + 2) % PALETTE.length], '--d': `${(i % 3) * 0.08}s` }}
              data-reveal
            >
              <span className="pcs-bento-num">{String(i + 1).padStart(2, '0')}</span>
              <p>{f}</p>
              <i className="pcs-bento-chip" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </section>

      <SectionRule />

      {/* ---------------- Role + stack ---------------- */}
      <section className="pcs-section pcs-wrap" aria-labelledby="pcs-role">
        <div className="pcs-role-grid">
          <div className="pcs-role" data-reveal>
            <div className="pcs-climax-header" id="pcs-role">
              <div className="pcs-climax-tag-wrap">
                <span className="pcs-climax-tag">ROLE &amp; STACK</span>
              </div>
              <h2 className="pcs-h2 pcs-climax-title">
                <span className="title-line-mask">
                  <span className="title-line-inner">{roleTitle}<span className="pcs-dot">.</span></span>
                </span>
              </h2>
            </div>
            {/* Full sentence for screen readers and search; the info row below is the visual summary */}
            <p className="pcs-sr-only">{roleText}</p>
            <p className="pcs-role-meta" aria-hidden="true">
              <span className="pcs-meta-item"><span className="pcs-role-year">{project.year}</span></span>
              {project.tags?.[0] && <span className="pcs-meta-item pcs-role-match">{project.tags[0]}</span>}
              <span className="pcs-meta-item pcs-role-built">
                Built with <span className="pcs-stack-count">{project.tech.length}</span>
              </span>
            </p>
          </div>
          <div className="pcs-stack" data-reveal style={{ '--d': '0.1s' }}>
            <BrandStack tools={project.tech} />
          </div>
        </div>
      </section>

      <SectionRule />

      {/* ---------------- Next project ---------------- */}
      <section className="pcs-wrap pcs-next-wrap" aria-label="Next case study">
        <Link to={projectPath(next)} className="pcs-next" style={{ '--na': next.accent }} onClick={goNext} data-reveal>
          <div className="pcs-next-head">
            <span className="pcs-next-label">Next case study — {next.num}</span>
            {next.logo && (
              <div className="pcs-next-logo-wrap">
                <img src={next.logo} alt="" className="pcs-next-logo" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="pcs-next-body">
            <h2 className="pcs-next-title">
              {next.title}
              <span className="pcs-next-dot">.</span>
            </h2>
            <div className="pcs-next-bottom-row">
              <p className="pcs-next-desc">
                <span className="pcs-next-pipe" aria-hidden="true">|</span>
                <span>{next.category || next.service}</span>
              </p>
              <span className="pcs-next-badge" aria-hidden="true">
                <ArrowUpRight size={22} strokeWidth={2.4} />
              </span>
            </div>
          </div>
        </Link>
      </section>
    </main>
  );
}
