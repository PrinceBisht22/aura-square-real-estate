import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [idle, setIdle] = useState(false);
  
  useEffect(() => {
    // Check if custom cursor is enabled via env
    const cursorEnabled = import.meta.env.VITE_CUSTOM_CURSOR !== 'false';
    setIsEnabled(cursorEnabled);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsEnabled(false);
      return;
    }

    // Disable on mobile devices
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile || !isEnabled) return;

    let idleTimer = null;

    const updateCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIdle(false);
      
      // Reset idle timer
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIdle(true), 2000);
    };

    const handleMouseEnter = (e) => {
      const target = e.target;
      
      // --- FIX: Add Safety Check ---
      // This prevents the "target.matches is not a function" error
      if (!target || typeof target.matches !== 'function') return;

      if (target.matches('button, a, [role="button"], input[type="submit"], .property-card, .project-card')) {
        setIsHovering(true);
      } else if (target.matches('input[type="text"], input[type="search"], textarea')) {
        setIsSearch(true);
        setIsHovering(false);
      }
    };

    const handleMouseLeave = (e) => {
      const target = e.target;

      // --- FIX: Add Safety Check ---
      if (!target || typeof target.matches !== 'function') return;

      if (target.matches('button, a, [role="button"], input[type="submit"], .property-card, .project-card')) {
        setIsHovering(false);
      } else if (target.matches('input[type="text"], input[type="search"], textarea')) {
        setIsSearch(false);
      }
    };

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseover', handleMouseEnter); // Changed to mouseover for better bubble support
    document.addEventListener('mouseout', handleMouseLeave);  // Changed to mouseout

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.body.style.cursor = '';
      window.removeEventListener('resize', checkMobile);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [isMobile, isEnabled]);

  if (isMobile || !isEnabled) return null;

  const size = idle ? 8 : isHovering ? 36 : isSearch ? 24 : 16;
  const haloSize = idle ? 16 : isHovering ? 64 : isSearch ? 40 : 32;

  return (
    <>
      {/* Glass Halo Cursor */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Outer halo with blur */}
        <div
          className="absolute rounded-full"
          style={{
            width: `${haloSize}px`,
            height: `${haloSize}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(14, 165, 164, 0.3) 0%, rgba(14, 165, 164, 0.1) 50%, transparent 100%)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: `1px solid rgba(14, 165, 164, 0.2)`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: idle ? 0.3 : isHovering ? 0.8 : 0.5,
          }}
        />
        
        {/* Inner dot */}
        <div
          className="absolute rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: isSearch 
              ? 'rgba(14, 165, 164, 0.9)' 
              : 'rgba(14, 165, 164, 0.6)',
            border: `2px solid rgba(255, 255, 255, 0.8)`,
            boxShadow: '0 0 12px rgba(14, 165, 164, 0.4)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        
        {/* Search icon when over search field */}
        {isSearch && (
          <svg
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '16px',
              height: '16px',
              color: 'white',
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" />
          </svg>
        )}
      </div>
    </>
  );
};

export default CustomCursor;