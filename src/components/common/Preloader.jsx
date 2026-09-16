import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const preloaderRef = useRef(null);

  useEffect(() => {
    const preloader = preloaderRef.current;
    if (!preloader) return;

    // Snappy, high-end branded entry (under 1.2s total)
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(preloader, {
          yPercent: -100,
          duration: 0.5,
          ease: 'power4.inOut',
          onComplete: () => {
            if (preloader) preloader.style.display = 'none';
            if (onComplete) onComplete();
          }
        });
      }
    });

    tl.to(preloader.querySelector('.preloader-brand'), {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out'
    })
      .to(preloader.querySelector('.preloader-line'), {
        width: '100px',
        duration: 0.35,
        ease: 'power2.inOut'
      }, '-=0.15')
      .to(preloader.querySelector('.preloader-sub'), {
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out'
      }, '-=0.15')
      .to({}, { duration: 0.2 });

    // Safety fallback so content is never blocked if animation stalls
    const fallbackTimer = setTimeout(() => {
      if (preloader && preloader.style.display !== 'none') {
        preloader.style.display = 'none';
        if (onComplete) onComplete();
      }
    }, 1400);

    return () => {
      tl.kill();
      clearTimeout(fallbackTimer);
    };
  }, [onComplete]);

  return (
    <div className="preloader" id="preloader" ref={preloaderRef}>
      <div className="preloader-inner">
        <div className="preloader-brand">DHANUSH</div>
        <div className="preloader-line" />
        <div className="preloader-sub">Digital Product Studio</div>
      </div>
    </div>
  );
}
