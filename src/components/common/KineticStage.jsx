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
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const isIntersectingRef = useRef(false);

  // Identify Tutorboard project
  const isTutorboard = projectId === 'tutorboard' || projectId === 'ragchatbot' || (typeof activeVideo === 'string' && activeVideo.includes('tutorboard'));

  // Video autoplay & lifecycle engine
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeVideo) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.controls = false;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');
    video.setAttribute('loop', '');
    video.removeAttribute('controls');

    if (!isTutorboard) {
      video.setAttribute('autoplay', '');
    } else {
      video.removeAttribute('autoplay');
      video.pause();
      try { video.currentTime = 0; } catch (_) {}
    }

    const kickstart = () => {
      if (video) {
        // Tutorboard only starts when user has scrolled to the card
        if (isTutorboard && !isIntersectingRef.current) {
          return;
        }
        video.muted = true;
        video.defaultMuted = true;
        if (!video.paused) {
          setIsVideoPlaying(true);
          return;
        }
        const p = video.play();
        if (p !== undefined) {
          p.then(() => setIsVideoPlaying(true)).catch(() => {
            video.muted = true;
            video.defaultMuted = true;
            video.play().then(() => setIsVideoPlaying(true)).catch(() => {});
          });
        }
      }
    };

    if (!isTutorboard) {
      kickstart();
    }

    const handlePlaying = () => setIsVideoPlaying(true);
    const handleEnded = () => {
      if (video) {
        video.currentTime = 0;
        if (!isTutorboard || isIntersectingRef.current) {
          kickstart();
        }
      }
    };

    const handleCanPlay = () => {
      if (!isTutorboard) {
        kickstart();
      }
    };

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('timeupdate', handlePlaying);
    video.addEventListener('loadedmetadata', handleCanPlay);
    video.addEventListener('loadeddata', handleCanPlay);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlay);
    video.addEventListener('ended', handleEnded);

    // Discrete user interactions to guarantee autoplay policy bypass without thrashing scroll ticks
    const interactionEvents = ['touchstart', 'pointerdown', 'click', 'keydown'];
    const onUserInteraction = () => {
      if (video && video.paused) {
        if (!isTutorboard || isIntersectingRef.current) {
          kickstart();
        }
      }
    };

    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, onUserInteraction, { once: true, passive: true });
    });

    return () => {
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('timeupdate', handlePlaying);
      video.removeEventListener('loadedmetadata', handleCanPlay);
      video.removeEventListener('loadeddata', handleCanPlay);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, onUserInteraction);
      });
    };
  }, [activeVideo, showImagePreview, isTutorboard]);

  // Intersection observer to track visibility, pause offscreen videos, and start on scroll into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasIntersecting = isIntersectingRef.current;
        isIntersectingRef.current = entry.isIntersecting;

        // Only update React state for phrase typography cycling.
        if (!showImagePreview) {
          setIsVisible(entry.isIntersecting);
        }

        const video = videoRef.current;
        if (video) {
          if (entry.isIntersecting) {
            video.muted = true;
            video.defaultMuted = true;
            // Tutorboard starts cleanly from the beginning only when freshly entering the viewport
            if (isTutorboard && !wasIntersecting) {
              try { video.currentTime = 0; } catch (_) {}
            }
            const p = video.play();
            if (p !== undefined) {
              p.then(() => setIsVideoPlaying(true)).catch(() => {});
            }
          } else {
            video.pause();
            if (isTutorboard) {
              try { video.currentTime = 0; } catch (_) {}
              setIsVideoPlaying(false);
            }
          }
        }
      },
      {
        threshold: isTutorboard ? 0.25 : 0.05,
        rootMargin: isTutorboard ? '0px 0px -40px 0px' : '120px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [showImagePreview, isTutorboard]);

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
        <div className={`kinetic-preview-image-layer preview-layer-${projectId || 'default'}`}>
          {activePreviewImg && (
            <img
              src={activePreviewImg}
              alt={projectId ? `${projectId} project interface demonstration` : 'Portfolio project interface demonstration'}
              className={`kinetic-preview-img kinetic-img-${projectId || 'default'} ${isVideoPlaying ? 'poster-faded' : ''}`}
              aria-hidden="true"
            />
          )}
          {activeVideo && (
            <video
              ref={(el) => {
                videoRef.current = el;
                if (el) {
                  el.muted = true;
                  el.defaultMuted = true;
                  el.playsInline = true;
                  el.setAttribute('muted', '');
                  el.setAttribute('playsinline', '');
                  el.setAttribute('webkit-playsinline', '');
                  el.setAttribute('x5-playsinline', '');
                  if (!isTutorboard) {
                    el.setAttribute('autoplay', '');
                  } else {
                    el.removeAttribute('autoplay');
                    el.pause();
                    try { el.currentTime = 0; } catch (_) {}
                  }
                }
              }}
              src={activeVideo}
              poster={activePreviewImg || undefined}
              autoPlay={!isTutorboard}
              loop
              muted
              playsInline
              webkit-playsinline="true"
              x5-playsinline="true"
              preload={isTutorboard ? 'metadata' : 'auto'}
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              className={`kinetic-preview-video video-${projectId || 'default'} ${isVideoPlaying ? 'video-playing' : ''}`}
              onPlaying={() => setIsVideoPlaying(true)}
              onLoadedData={() => {
                if (!isTutorboard) setIsVideoPlaying(true);
              }}
              onCanPlay={() => {
                if (!isTutorboard) setIsVideoPlaying(true);
              }}
              onTimeUpdate={() => {
                if (!isVideoPlaying && (!isTutorboard || isIntersectingRef.current)) {
                  setIsVideoPlaying(true);
                }
              }}
            >
              <source src={activeVideo} type="video/mp4" />
            </video>
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
