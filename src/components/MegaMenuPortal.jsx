import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MegaMenu from './MegaMenu.jsx';

const MegaMenuPortal = ({ navItemRef, activeMenu, onClose, onMouseEnter, onMouseLeave }) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      if (navItemRef?.current) {
        const rect = navItemRef.current.getBoundingClientRect();
        const headerHeight = rect.bottom;
        setPosition({
          top: headerHeight + 4,
          left: rect.left + rect.width / 2,
          width: Math.min(window.innerWidth - 32, 1152), // max-w-6xl = 72rem = 1152px
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Close on click outside
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && 
          navItemRef?.current && !navItemRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navItemRef, onClose]);

  if (!activeMenu) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translateX(-50%)',
          width: `${position.width}px`,
          maxWidth: 'calc(100vw - 2rem)',
          zIndex: 2000,
          pointerEvents: 'auto',
        }}
        id={`mega-menu-${activeMenu}`}
        role="menu"
        aria-label={`${activeMenu} menu`}
      >
        <MegaMenu activeMenu={activeMenu} onClose={onClose} />
      </motion.div>
    </AnimatePresence>
  );
};

export default MegaMenuPortal;

