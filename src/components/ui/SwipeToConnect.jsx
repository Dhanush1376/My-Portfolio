import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import '../../styles/swipe-btn.css';

export default function SwipeToConnect({ onConnect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const containerRef = useRef(null);
  const knobRef = useRef(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  
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

  return (
    <div 
      className={`swipe-container ${isSuccess ? 'success' : ''}`} 
      ref={containerRef}
    >
      <div 
        className="swipe-fill" 
        style={{ 
          width: `${dragX + 56}px`, // 48px knob + 8px padding
          transition: isDragging ? 'none' : 'width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
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
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          cursor: isSuccess ? 'default' : 'grab'
        }}
      >
        {isSuccess ? <Check size={24} strokeWidth={2.5} /> : <ArrowRight size={24} strokeWidth={2.5} />}
      </div>
    </div>
  );
}
