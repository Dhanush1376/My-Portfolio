import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import '../../styles/swipe-btn.css';

export default function SwipeToConnect({ onConnect, variant: propVariant }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const containerRef = useRef(null);
  const knobRef = useRef(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const hasMovedRef = useRef(false);
  const animFrameRef = useRef(null);
  const resetTimerRef = useRef(null);

  // Active variant: 'peach' (Services page), 'yellow' (About page), or 'orange' (Home page/default)
  const isPeach = (v) => v === 'peach' || v === 'peach-red' || v === 'green';
  const resolveVariant = (v) => {
    if (isPeach(v)) return 'peach';
    if (v === 'yellow') return 'yellow';
    return 'orange';
  };

  const [activeVariant, setActiveVariant] = useState(resolveVariant(propVariant));

  useEffect(() => {
    if (propVariant) {
      setActiveVariant(resolveVariant(propVariant));
    } else if (containerRef.current?.closest('.services-page-container')) {
      setActiveVariant('peach');
    } else if (containerRef.current?.closest('.about-page-wrapper')) {
      setActiveVariant('yellow');
    } else {
      setActiveVariant('orange');
    }
  }, [propVariant]);

  useEffect(() => {
    const updateMaxDrag = () => {
      if (containerRef.current && knobRef.current) {
        currentXRef.current = 0;
        setDragX(0);
      }
    };
    
    window.addEventListener('resize', updateMaxDrag);
    return () => {
      window.removeEventListener('resize', updateMaxDrag);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const getMaxDrag = useCallback(() => {
    if (containerRef.current && knobRef.current) {
      return Math.max(10, containerRef.current.offsetWidth - knobRef.current.offsetWidth - 14);
    }
    return 200;
  }, []);

  const triggerSuccess = useCallback((targetDrag) => {
    setIsSuccess(true);
    setDragX(targetDrag);
    currentXRef.current = targetDrag;
    if (onConnect) {
      try {
        onConnect();
      } catch (err) {
        console.error('Error in onConnect:', err);
      }
    }
    
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setIsSuccess(false);
      currentXRef.current = 0;
      setDragX(0);
    }, 3000);
  }, [onConnect]);

  const autoSlideToConnect = useCallback((targetDrag) => {
    if (isSuccess) return;
    const start = currentXRef.current;
    const duration = 280;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const curr = start + (targetDrag - start) * eased;
      setDragX(curr);
      currentXRef.current = curr;

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        triggerSuccess(targetDrag);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, [isSuccess, triggerSuccess]);

  const handlePointerDown = (e) => {
    if (isSuccess) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    startXRef.current = e.clientX - currentXRef.current;
    
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch (_) {}

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (!containerRef.current || !knobRef.current) return;
    
    const maxDrag = getMaxDrag();
    const newX = e.clientX - startXRef.current;
    
    if (Math.abs(newX - currentXRef.current) > 3) {
      hasMovedRef.current = true;
    }
    
    // Constrain boundaries
    const clamped = Math.max(0, Math.min(newX, maxDrag));
    currentXRef.current = clamped;
    setDragX(clamped);
  };

  const handlePointerUp = (e) => {
    if (e?.pointerId && knobRef.current) {
      try {
        knobRef.current.releasePointerCapture?.(e.pointerId);
      } catch (_) {}
    }
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);
    setIsDragging(false);
    
    const maxDrag = getMaxDrag();
    
    if (currentXRef.current >= maxDrag * 0.7) {
      // Swiped past 70% threshold
      triggerSuccess(maxDrag);
    } else if (!hasMovedRef.current) {
      // User tapped or clicked without dragging -> auto slide across!
      autoSlideToConnect(maxDrag);
    } else {
      // Spring back
      currentXRef.current = 0;
      setDragX(0);
    }
  };

  // Touch event fallbacks for bulletproof mobile support
  const handleTouchStart = (e) => {
    if (isSuccess || !e.touches[0]) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    startXRef.current = e.touches[0].clientX - currentXRef.current;
  };

  const handleTouchMove = (e) => {
    if (!e.touches[0]) return;
    const maxDrag = getMaxDrag();
    const newX = e.touches[0].clientX - startXRef.current;
    if (Math.abs(newX - currentXRef.current) > 3) {
      hasMovedRef.current = true;
    }
    const clamped = Math.max(0, Math.min(newX, maxDrag));
    currentXRef.current = clamped;
    setDragX(clamped);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const maxDrag = getMaxDrag();
    if (currentXRef.current >= maxDrag * 0.7) {
      triggerSuccess(maxDrag);
    } else if (!hasMovedRef.current) {
      autoSlideToConnect(maxDrag);
    } else {
      currentXRef.current = 0;
      setDragX(0);
    }
  };

  const handleContainerClick = (e) => {
    if (isSuccess || isDragging) return;
    if (!hasMovedRef.current) {
      const maxDrag = getMaxDrag();
      autoSlideToConnect(maxDrag);
    }
  };

  const maxDragWidth = getMaxDrag();
  const progress = maxDragWidth > 0 ? Math.min(1, Math.max(0, dragX / maxDragWidth)) : 0;

  // Services Page: Vibrant Studio Peach Red (#FF5E57 -> #FF786B).
  // About Page: Solar Yellow (#FFA820 -> #FF3D00).
  // Home Page: Pure Vibrant Orange (#FF5520 -> #FF3D00).
  let currentColor;
  let fillGradient;

  if (activeVariant === 'peach' || activeVariant === 'green') {
    const g = Math.round(94 + progress * 26);
    const b = Math.round(87 + progress * 20);
    currentColor = `rgb(255, ${g}, ${b})`;
    fillGradient = isSuccess 
      ? 'linear-gradient(90deg, #FF5E57 0%, #FF786B 100%)' 
      : `linear-gradient(90deg, #FF5E57 0%, ${currentColor} 100%)`;
  } else if (activeVariant === 'yellow') {
    const g = Math.round(168 - progress * 107);
    const b = Math.round(32 - progress * 32);
    currentColor = `rgb(255, ${g}, ${b})`;
    fillGradient = isSuccess 
      ? 'linear-gradient(90deg, #FFA820 0%, #FF3D00 100%)' 
      : `linear-gradient(90deg, #FFA820 0%, ${currentColor} 100%)`;
  } else {
    const g = Math.round(85 - progress * 24);
    const b = Math.round(32 - progress * 32);
    currentColor = `rgb(255, ${g}, ${b})`;
    fillGradient = isSuccess 
      ? 'linear-gradient(90deg, #FF5520 0%, #FF3D00 100%)' 
      : `linear-gradient(90deg, #FF5520 0%, ${currentColor} 100%)`;
  }

  return (
    <div 
      className={`swipe-container variant-${activeVariant} ${isSuccess ? 'success' : ''}`} 
      ref={containerRef}
      onClick={handleContainerClick}
      style={{ cursor: isSuccess ? 'default' : 'pointer' }}
    >
      <div 
        className="swipe-fill" 
        style={{ 
          width: `${dragX + 56}px`, // 48px knob + 8px padding
          background: fillGradient,
          transition: isDragging ? 'none' : 'width 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s ease'
        }}
      />
      
      <span className="swipe-text" style={{ opacity: isSuccess ? 0 : Math.max(0, 1 - (dragX / 90)) }}>
        SWIPE TO CONNECT
      </span>
      
      <span className="swipe-text-success" style={{ opacity: isSuccess ? 1 : 0 }}>
        CONNECTING...
      </span>

      <div 
        className="swipe-knob"
        ref={knobRef}
        onPointerDown={handlePointerDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          transform: `translateX(${dragX}px)`,
          borderColor: isSuccess ? '#FFFFFF' : currentColor,
          boxShadow: isSuccess 
            ? '0 0 20px rgba(255, 255, 255, 0.7), 0 4px 14px rgba(0, 0, 0, 0.3)' 
            : `0 0 ${Math.round(progress * 14)}px ${currentColor}, 0 4px 12px rgba(0, 0, 0, 0.25)`,
          transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.25s ease, box-shadow 0.25s ease',
          cursor: isSuccess ? 'default' : (isDragging ? 'grabbing' : 'grab')
        }}
      >
        {isSuccess ? <Check size={24} strokeWidth={2.5} /> : <ArrowRight size={24} strokeWidth={2.5} />}
      </div>
    </div>
  );
}
