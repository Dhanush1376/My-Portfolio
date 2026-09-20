import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Home as HomeIcon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/common/CustomCursor';
import SEO from '../components/common/SEO';

export default function NotFoundPage() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="portfolio-app not-found-page-wrapper">
      <SEO
        title="Page Not Found — Dhanush"
        description="The requested page could not be found or has been moved."
        canonical="https://dhanu.me/404"
        noindex={true}
      />
      <CustomCursor />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main
        id="main-content"
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 24px 80px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '24px',
            color: 'var(--text-secondary, #666)',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF5520' }} />
          404 Not Found
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            margin: '0 0 20px',
            color: 'var(--text-primary, #111)',
          }}
        >
          Page Not Found<span style={{ color: '#FF5520' }}>.</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            maxWidth: '520px',
            lineHeight: 1.6,
            color: 'var(--text-secondary, #555)',
            margin: '0 0 36px',
          }}
        >
          The link you followed may be broken or the page may have been moved.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '999px',
              backgroundColor: 'var(--text-primary, #111)',
              color: 'var(--bg-primary, #fff)',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
            }}
          >
            <HomeIcon size={18} />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/services"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '999px',
              border: '1px solid var(--border-color, rgba(0,0,0,0.15))',
              color: 'var(--text-primary, #111)',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              transition: 'transform 0.2s ease, background-color 0.2s ease',
            }}
          >
            <span>Explore Services</span>
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
