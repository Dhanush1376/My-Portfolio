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
    video.setAttribute('autoplay', '');
    video.removeAttribute('controls');

    const tryPlay = () => {
      if (video) {
        video.muted = true;
        video.defaultMuted = true;
        const p = video.play();
        if (p !== undefined) {
          p.then(() => {
            if (video.currentTime > 0.05) {
              setIsVideoPlaying(true);
            }
          }).catch(() => {
            video.muted = true;
            video.defaultMuted = true;
            video.play().catch(() => {});
          });
        }
      }
    };

    // Attempt playback immediately if already in or near view
    if (isIntersectingRef.current) {
      tryPlay();
    }

    const handleTimeUpdate = () => {
      if (video && video.currentTime > 0.05 && !video.paused) {
        setIsVideoPlaying(true);
      }
    };

    const handleEnded = () => {
      if (video) {
        video.currentTime = 0;
        tryPlay();
      }
    };

    video.addEventListener('playing', handleTimeUpdate);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('canplay', tryPlay);
    video.addEventListener('canplaythrough', tryPlay);
    video.addEventListener('ended', handleEnded);

    const onUserInteraction = () => {
      if (video && video.paused && isIntersectingRef.current) {
        tryPlay();
      }
    };

    const interactionEvents = ['touchstart', 'pointerdown', 'click', 'scroll'];
    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, onUserInteraction, { passive: true });
    });

    return () => {
      video.removeEventListener('playing', handleTimeUpdate);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('canplay', tryPlay);
      video.removeEventListener('canplaythrough', tryPlay);
      video.removeEventListener('ended', handleEnded);
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, onUserInteraction);
      });
    };
  }, [activeVideo, showImagePreview]);

  // Intersection observer to track visibility and start/pause videos smoothly on scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;

        if (!showImagePreview) {
          setIsVisible(entry.isIntersecting);
        }

        const video = videoRef.current;
        if (video) {
          if (entry.isIntersecting) {
            video.muted = true;
            video.defaultMuted = true;
            const p = video.play();
            if (p !== undefined) {
              p.then(() => {
                if (video.currentTime > 0.05) {
                  setIsVideoPlaying(true);
                }
              }).catch(() => {
                video.muted = true;
                video.play().catch(() => {});
              });
            }
          } else {
            video.pause();
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: '300px 0px 300px 0px',
      }
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
                  el.setAttribute('autoplay', '');
                  el.setAttribute('loop', '');
                }
              }}
              src={activeVideo}
              poster={activePreviewImg || undefined}
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
              className={`kinetic-preview-video video-${projectId || 'default'} ${isVideoPlaying ? 'video-playing' : ''}`}
              onPlaying={(e) => {
                if (e.currentTarget.currentTime > 0.05) {
                  setIsVideoPlaying(true);
                }
              }}
              onTimeUpdate={(e) => {
                if (!isVideoPlaying && e.currentTarget.currentTime > 0.05) {
                  setIsVideoPlaying(true);
                }
              }}
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
