import React, { useState, useRef, useEffect } from 'react';
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

  // Check if yellow theme is active (Only on About page)
  const [isAboutVariant, setIsAboutVariant] = useState(propVariant === 'yellow');

  useEffect(() => {
    if (propVariant === 'yellow') {
      setIsAboutVariant(true);
    } else if (propVariant === 'orange') {
      setIsAboutVariant(false);
    } else if (containerRef.current?.closest('.about-page-wrapper')) {
      setIsAboutVariant(true);
    } else {
      setIsAboutVariant(false);
    }
  }, [propVariant]);
  
  const MAX_DRAG = containerRef.current && knobRef.current 
    ? containerRef.current.offsetWidth - knobRef.current.offsetWidth - 16 // 8px padding each side
    : 200;

  useEffect(() => {
    // If we have refs, set exact max drag width dynamically
    const updateMaxDrag = () => {
      if (containerRef.current && knobRef.current) {
        currentXRef.current = 0;
        setDragX(0);
      }
    };
    
    window.addEventListener('resize', updateMaxDrag);
    return () => window.removeEventListener('resize', updateMaxDrag);
  }, []);

  const handlePointerDown = (e) => {
    if (isSuccess) return;
    setIsDragging(true);
    startXRef.current = e.clientX - currentXRef.current;
    
    // Add global listeners
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    
    // Prevent default scrolling on touch devices while swiping
    e.preventDefault();
  };

  const handlePointerMove = (e) => {
    if (!containerRef.current || !knobRef.current) return;
    
    const maxDrag = containerRef.current.offsetWidth - knobRef.current.offsetWidth - 16;
    let newX = e.clientX - startXRef.current;
    
    // Constrain boundaries
    if (newX < 0) newX = 0;
    if (newX > maxDrag) newX = maxDrag;
    
    currentXRef.current = newX;
    setDragX(newX);
  };

  const handlePointerUp = () => {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    setIsDragging(false);
    
    if (!containerRef.current || !knobRef.current) return;
    const maxDrag = containerRef.current.offsetWidth - knobRef.current.offsetWidth - 16;
    
    if (currentXRef.current >= maxDrag * 0.9) {
      // Success threshold reached
      setIsSuccess(true);
      setDragX(maxDrag);
      if (onConnect) onConnect();
      
      // Reset after 3 seconds for demonstration
      setTimeout(() => {
        setIsSuccess(false);
        currentXRef.current = 0;
        setDragX(0);
      }, 3000);
    } else {
      // Spring back
      currentXRef.current = 0;
      setDragX(0);
    }
  };

  const maxDragWidth = containerRef.current && knobRef.current 
    ? containerRef.current.offsetWidth - knobRef.current.offsetWidth - 12
    : 200;
  const progress = maxDragWidth > 0 ? Math.min(1, Math.max(0, dragX / maxDragWidth)) : 0;

  // Home Page: Pure Vibrant Orange (#FF5520 -> #FF3D00). ZERO YELLOW.
  // About Page: Solar Yellow (#FFA820 -> #FF3D00).
  let currentColor;
  let fillGradient;

  if (isAboutVariant) {
    // About page: Solar Yellow rgb(255, 168, 32) -> Fiery Orange rgb(255, 61, 0)
    const g = Math.round(168 - progress * 107);
    const b = Math.round(32 - progress * 32);
    currentColor = `rgb(255, ${g}, ${b})`;
    fillGradient = isSuccess 
      ? 'linear-gradient(90deg, #FFA820 0%, #FF3D00 100%)' 
      : `linear-gradient(90deg, #FFA820 0%, ${currentColor} 100%)`;
  } else {
    // Home page: Pure Orange rgb(255, 85, 32) -> Fiery Orange rgb(255, 61, 0)
    const g = Math.round(85 - progress * 24); // 85 -> 61
    const b = Math.round(32 - progress * 32); // 32 -> 0
    currentColor = `rgb(255, ${g}, ${b})`;
    fillGradient = isSuccess 
      ? 'linear-gradient(90deg, #FF5520 0%, #FF3D00 100%)' 
      : `linear-gradient(90deg, #FF5520 0%, ${currentColor} 100%)`;
  }

  return (
    <div 
      className={`swipe-container ${isAboutVariant ? 'variant-yellow' : 'variant-orange'} ${isSuccess ? 'success' : ''}`} 
      ref={containerRef}
    >
      <div 
        className="swipe-fill" 
        style={{ 
          width: `${dragX + 56}px`, // 48px knob + 8px padding
          background: fillGradient,
          transition: isDragging ? 'none' : 'width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s ease'
        }}
      />
      
      <span className="swipe-text" style={{ opacity: isSuccess ? 0 : 1 - (dragX / 100) }}>
        SWIPE TO CONNECT
      </span>
      
      <span className="swipe-text-success" style={{ opacity: isSuccess ? 1 : 0 }}>
        CONNECTING...
      </span>

      <div 
        className="swipe-knob"
        ref={knobRef}
        onPointerDown={handlePointerDown}
        style={{ 
          transform: `translateX(${dragX}px)`,
          borderColor: isSuccess ? '#FFFFFF' : currentColor,
          boxShadow: isSuccess 
            ? '0 0 20px rgba(255, 255, 255, 0.7), 0 4px 14px rgba(0, 0, 0, 0.3)' 
            : `0 0 ${Math.round(progress * 14)}px ${currentColor}, 0 4px 12px rgba(0, 0, 0, 0.25)`,
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.25s ease, box-shadow 0.25s ease',
          cursor: isSuccess ? 'default' : 'grab'
        }}
      >
        {isSuccess ? <Check size={24} strokeWidth={2.5} /> : <ArrowRight size={24} strokeWidth={2.5} />}
      </div>
    </div>
  );
}
