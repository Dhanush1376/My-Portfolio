import React, { useState, useEffect, useRef } from 'react';

/**
 * KineticStage Component
 * Renders the signature WhyCreatives kinetic typography stage
 * with cycling animated phrase stages and bottom indicator dots.
 */
export default function KineticStage({
  phrases = [],
  tone = 'light',
  seed = 0,
  intervalMs = 2800,
  activePreviewImg = null,
  activeVideo = null,
  showImagePreview = false,
}) {
  const [index, setIndex] = useState(seed % Math.max(1, phrases.length));
  const [isVisible, setIsVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // Intersection observer to pause timer and video when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Timer to rotate phrases
  useEffect(() => {
    if (!isVisible || phrases.length < 2) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length);
        setIsTransitioning(false);
      }, 250);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isVisible, phrases.length, intervalMs]);

  if (!phrases || phrases.length === 0) return null;

  const current = phrases[index] || phrases[0];
  const isLight = tone === 'light';
  const isAccent = tone === 'accent';

  // Determine background color
  const bgColor = isLight
    ? '#f1f1ef'
    : isAccent
    ? 'var(--accent, #FF5520)'
    : '#151515';

  return (
    <div
      ref={containerRef}
      className={`kinetic-stage-root ${isLight ? 'tone-light' : isAccent ? 'tone-accent' : 'tone-dark'}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Media Preview (Video or Image) */}
      {showImagePreview && (activeVideo || activePreviewImg) && (
        <div className="kinetic-preview-image-layer">
          {activeVideo ? (
            <video
              ref={videoRef}
              src={activeVideo}
              autoPlay
              loop
              muted
              playsInline
              className="kinetic-preview-video"
            />
          ) : (
            <img
              src={activePreviewImg}
              alt="Project Preview"
              className="kinetic-preview-img"
            />
          )}
          <div className="kinetic-preview-overlay" />
        </div>
      )}

      {/* Main Kinetic Typography - only show if no preview media */}
      {!showImagePreview && (
        <div
          className={`kinetic-words-wrap ${isTransitioning ? 'kinetic-phrase-out' : 'kinetic-phrase-in'}`}
        >
          <p
            className="kinetic-phrase-text"
            style={{ color: current.color }}
          >
            {current.words.map((word, i) => (
              <span key={i} className="kinetic-word-span">
                {word}
              </span>
            ))}
          </p>
        </div>
      )}

      {/* Bottom Progress Indicator Bars - only show if typography stage */}
      {!showImagePreview && (
        <div className="kinetic-indicators-rail">
          {phrases.map((phrase, idx) => {
            const isActive = idx === index;
            return (
              <button
                key={idx}
                type="button"
                className={`kinetic-indicator-bar ${isActive ? 'active' : ''}`}
                style={{
                  backgroundColor: isActive
                    ? current.color
                    : isLight
                    ? 'rgba(0,0,0,0.22)'
                    : isAccent
                    ? 'rgba(0,0,0,0.3)'
                    : 'rgba(255,255,255,0.22)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(idx);
                }}
                aria-label={`Slide ${idx + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
