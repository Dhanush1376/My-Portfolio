import { useEffect, useState } from 'react';

// Real user-activation events: a tap/click unlocks playback when the browser refused autoplay
// (iOS Low Power Mode, Android data saver). Scroll and touchstart do not count as activation.
const ACTIVATION_EVENTS = ['pointerup', 'touchend', 'click', 'keydown'];

/**
 * Keeps a muted background video looping without any user interaction.
 *
 * - inViewOnly: plays only while the element is on screen (pauses off screen to free the decoder),
 *   and starts buffering shortly before it scrolls in.
 * - Recovers when the OS pauses it, when the tab comes back, and when autoplay was refused.
 *
 * Returns true once the video has actually started rendering frames (for the poster cross-fade).
 */
export function useLoopingVideo(videoRef, { src, enabled = true, inViewOnly = false, threshold = 0.2 } = {}) {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    setHasStarted(false);
    if (!video || !enabled || !src) return undefined;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    let inView = !inViewOnly;
    let pausingOnPurpose = false;
    let waitingForActivation = false;
    let disposed = false;

    const shouldPlay = () => !disposed && inView && !document.hidden;

    const removeActivationListeners = () => {
      if (!waitingForActivation) return;
      waitingForActivation = false;
      ACTIVATION_EVENTS.forEach((evt) => window.removeEventListener(evt, onActivation, true));
    };

    const play = () => {
      if (!shouldPlay() || !video.paused) return;
      video.muted = true;
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.then(removeActivationListeners).catch(() => {
          // Refused (power saving / data saver): try again on the next genuine tap
          if (disposed || waitingForActivation) return;
          waitingForActivation = true;
          ACTIVATION_EVENTS.forEach((evt) => window.addEventListener(evt, onActivation, { capture: true, passive: true }));
        });
      }
    };

    function onActivation() {
      play();
    }

    const pause = () => {
      if (video.paused) return;
      pausingOnPurpose = true;
      video.pause();
    };

    const sync = () => (shouldPlay() ? play() : pause());

    const onPlaying = () => setHasStarted(true);
    // The OS can pause background media (e.g. returning from another app); resume if we still want it
    const onPause = () => {
      if (pausingOnPurpose) {
        pausingOnPurpose = false;
        return;
      }
      if (shouldPlay()) setTimeout(play, 250);
    };
    // Safety net for browsers that fire 'ended' despite loop
    const onEnded = () => {
      video.currentTime = 0;
      play();
    };

    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('loadeddata', sync);
    video.addEventListener('canplay', sync);
    document.addEventListener('visibilitychange', sync);

    const observers = [];
    if (inViewOnly && typeof IntersectionObserver !== 'undefined') {
      // Start downloading a little before the video scrolls into view
      video.preload = 'metadata';
      const prefetch = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            video.preload = 'auto';
            prefetch.disconnect();
          }
        },
        { rootMargin: '600px 0px' }
      );
      prefetch.observe(video);
      observers.push(prefetch);

      const visibility = new IntersectionObserver(
        (entries) => {
          // Several changes can arrive in one batch (e.g. while an entrance animation moves the
          // element); only the newest one reflects where it is now
          inView = entries[entries.length - 1].isIntersecting;
          sync();
        },
        { threshold }
      );
      visibility.observe(video);
      observers.push(visibility);
    } else {
      inView = true;
    }

    sync();

    return () => {
      disposed = true;
      removeActivationListeners();
      observers.forEach((o) => o.disconnect());
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('loadeddata', sync);
      video.removeEventListener('canplay', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [videoRef, src, enabled, inViewOnly, threshold]);

  return hasStarted;
}
