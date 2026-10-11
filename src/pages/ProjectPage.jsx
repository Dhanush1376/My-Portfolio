import React, { useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLoopingVideo } from '../hooks/useLoopingVideo';
import { PROJECTS_DATA, getProjectBySlug } from '../data/projectsData';
import { projectMeta, projectSchema, projectPath, absoluteUrl } from '../data/site';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/common/CustomCursor';
import SEO from '../components/common/SEO';
import '../styles/project-page.css';

/**
 * Case-study page for one project (/work/:slug). Gives every project its own indexable URL,
 * title and structured data so searches for the project name can land here.
 */
export default function ProjectPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const { theme, toggleTheme } = useTheme();
  const videoRef = useRef(null);
  const isPlaying = useLoopingVideo(videoRef, { src: project?.video, inViewOnly: true, threshold: 0.1 });

  if (!project) return <Navigate to="/404" replace />;

  const meta = projectMeta(project);
  const others = Object.values(PROJECTS_DATA).filter((p) => p.slug !== project.slug);
  const hasLiveSite = project.liveUrl && !project.liveUrl.includes('github.com');

  return (
    <div className="portfolio-app project-page">
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

      <main id="main-content" className="pp-main">
        <nav className="pp-crumbs" aria-label="Breadcrumb">
          <Link to="/#work" className="pp-back">
            <ArrowLeft size={15} strokeWidth={2.2} /> All work
          </Link>
          <span className="pp-crumb-sep">/</span>
          <span aria-current="page">{project.title}</span>
        </nav>

        <header className="pp-header">
          <p className="pp-eyebrow">
            <span>{project.num} — Case study</span>
            <span className="pp-eyebrow-rule" aria-hidden="true" />
            <span>{project.year}</span>
          </p>
          <h1 className="pp-title">
            {project.logo && (
              <img src={project.logo} alt={`${project.title} logo`} className="pp-logo" width="64" height="64" />
            )}
            <span>
              {project.title}
              <span className="pp-dot">.</span>
            </span>
          </h1>
          <p className="pp-lede">{project.subtitle}</p>

          <dl className="pp-facts">
            <div>
              <dt>Service</dt>
              <dd>{project.service}</dd>
            </div>
            <div>
              <dt>Industry</dt>
              <dd>{project.category}</dd>
            </div>
            <div>
              <dt>Client</dt>
              <dd>{project.client}</dd>
            </div>
            {project.stats?.map((st) => (
              <div key={st.label}>
                <dt>{st.label}</dt>
                <dd>{st.val}</dd>
              </div>
            ))}
          </dl>

          <div className="pp-actions">
            {hasLiveSite && (
              <a href={project.liveUrl} target="_blank" rel="noopener" className="pp-pill">
                <span>Visit live website</span>
                <span className="pp-pill-badge"><ArrowUpRight size={16} strokeWidth={2.2} /></span>
              </a>
            )}
            <Link to="/contact" className="pp-link">
              Start a similar project <ArrowUpRight size={16} strokeWidth={2.2} />
            </Link>
          </div>
        </header>

        <figure className="pp-media">
          {project.video ? (
            <video
              ref={videoRef}
              src={project.video}
              poster={project.img}
              loop
              muted
              playsInline
              preload="metadata"
              disablePictureInPicture
              disableRemotePlayback
              className={`pp-media-el ${isPlaying ? 'is-playing' : ''}`}
              aria-label={`${project.title} website walkthrough`}
            />
          ) : (
            <img src={project.img} alt={`${project.title} interface`} className="pp-media-el" />
          )}
          <figcaption className="pp-media-cap">{project.title} — {project.service}</figcaption>
        </figure>

        <section className="pp-section pp-overview">
          <h2 className="pp-h2">Overview</h2>
          <p>{project.overview}</p>
        </section>

        <section className="pp-section pp-split">
          <article className="pp-card">
            <h2 className="pp-card-tag">The problem</h2>
            <p>{project.problem}</p>
          </article>
          <article className="pp-card pp-card--accent">
            <h2 className="pp-card-tag">The solution</h2>
            <p>{project.solution}</p>
          </article>
        </section>

        <section className="pp-section">
          <h2 className="pp-h2">What was built</h2>
          <ol className="pp-features">
            {project.features.map((f, i) => (
              <li key={f}>
                <span className="pp-feature-num">{String(i + 1).padStart(2, '0')}</span>
                <span>{f}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="pp-section pp-split">
          <div>
            <h2 className="pp-h2">My role</h2>
            <p>{project.role}</p>
          </div>
          <div>
            <h2 className="pp-h2">Technology</h2>
            <ul className="pp-tech">
              {project.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pp-section pp-more" aria-labelledby="pp-more-title">
          <h2 id="pp-more-title" className="pp-h2">More work</h2>
          <ul className="pp-more-list">
            {others.map((p) => (
              <li key={p.slug}>
                <Link to={projectPath(p)} className="pp-more-link">
                  <span className="pp-more-num">{p.num}</span>
                  <span className="pp-more-name">{p.title}</span>
                  <span className="pp-more-cat">{p.category}</span>
                  <ArrowUpRight size={20} strokeWidth={2} className="pp-more-arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
