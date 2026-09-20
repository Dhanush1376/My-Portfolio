import React, { useState, useEffect, useRef } from 'react';

/**
 * KineticStage Component
 * Renders the signature kinetic typography stage
 * with cycling animated phrase stages and bottom indicator dots.
 */
export default function KineticStage({
  projectId = '',
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

  // Relentless and robust mobile & desktop autoplay engine
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeVideo) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');

    const kickstart = () => {
      if (video) {
        video.muted = true;
        const p = video.play();
        if (p !== undefined) {
          p.catch(() => {});
        }
      }
    };

    kickstart();
    video.addEventListener('loadedmetadata', kickstart);
    video.addEventListener('loadeddata', kickstart);
    video.addEventListener('canplay', kickstart);
    video.addEventListener('canplaythrough', kickstart);

    // Discrete user interactions to guarantee autoplay policy bypass without thrashing scroll ticks
    const interactionEvents = ['touchstart', 'pointerdown', 'click', 'keydown'];
    const onUserInteraction = () => {
      if (video && video.paused) {
        kickstart();
      }
    };

    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, onUserInteraction, { once: true, passive: true });
    });

    return () => {
      video.removeEventListener('loadedmetadata', kickstart);
      video.removeEventListener('loadeddata', kickstart);
      video.removeEventListener('canplay', kickstart);
      video.removeEventListener('canplaythrough', kickstart);
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, onUserInteraction);
      });
    };
  }, [activeVideo, showImagePreview]);

  // Intersection observer to track visibility, pause offscreen videos, and play on entry
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only update React state for phrase typography cycling.
        // For image/video previews, avoid triggering component re-renders during scroll.
        if (!showImagePreview) {
          setIsVisible(entry.isIntersecting);
        }

        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.muted = true;
            const p = videoRef.current.play();
            if (p !== undefined) p.catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.05, rootMargin: '120px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [showImagePreview]);

  // Timer to rotate phrases (only when typography stage is active)
  useEffect(() => {
    if (showImagePreview || !isVisible || phrases.length < 2) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length);
        setIsTransitioning(false);
      }, 250);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [showImagePreview, isVisible, phrases.length, intervalMs]);

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
              ref={(el) => {
                videoRef.current = el;
                if (el) {
                  el.muted = true;
                  el.defaultMuted = true;
                  el.playsInline = true;
                }
              }}
              src={activeVideo}
              autoPlay
              loop
              muted
              playsInline
              webkit-playsinline="true"
              x5-playsinline="true"
              preload="auto"
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              className="kinetic-preview-video"
            >
              <source src={activeVideo} type="video/mp4" />
            </video>
          ) : (
            <img
              src={activePreviewImg}
              alt={projectId ? `${projectId} project interface demonstration` : 'Portfolio project interface demonstration'}
              className={`kinetic-preview-img kinetic-img-${projectId || 'default'}`}
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
