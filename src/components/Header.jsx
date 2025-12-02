// src/components/Header.jsx (Firebase Integrated)
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import MegaMenuPortal from './MegaMenuPortal.jsx';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ICONS } from './icons.jsx';
// REMOVED: import { getUserSession, clearUserSession, isAuthenticated } from '../utils/auth.js';
// 💡 NEW: Import the useAuth hook
import { useAuth } from '../context/AuthContext';


const navLinks = [
  { name: 'Buy', to: '/buy', hasMegaMenu: true, key: 'buy' },
  { name: 'Rent', to: '/rent', hasMegaMenu: true, key: 'rent' },
  { name: 'New Launch', to: '/new-launch', hasMegaMenu: true, key: 'new-launch' },
  { name: 'Commercial', to: '/commercial', hasMegaMenu: true, key: 'commercial' },
  { name: 'Plots/Land', to: '/plots', hasMegaMenu: true, key: 'plots' },
  { name: 'Projects', to: '/projects', hasMegaMenu: true, key: 'projects' },
];

const Header = () => {
  // 💡 NEW: Use the Firebase Auth state from context
  const { currentUser, logout, loading: authLoading } = useAuth();
  
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  // Removed: [user, setUser] state, using currentUser directly
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Timers
  const megaMenuTimer = useRef(null);
  const userMenuTimer = useRef(null);
  const navItemRefs = useRef({});

  // Removed: useEffect to check isAuthenticated and getUserSession

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Handlers ---

  const handleNavMouseEnter = (key) => {
    if (megaMenuTimer.current) clearTimeout(megaMenuTimer.current);
    setActiveMegaMenu(key);
  };

  const handleNavMouseLeave = () => {
    megaMenuTimer.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 300); // 300ms delay to bridge the gap
  };

  const handleMenuMouseEnter = () => {
    if (megaMenuTimer.current) clearTimeout(megaMenuTimer.current);
  };

  const handleMenuMouseLeave = () => {
    megaMenuTimer.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 300);
  };

  const handleUserEnter = () => {
    if (userMenuTimer.current) clearTimeout(userMenuTimer.current);
    setShowUserMenu(true);
  };

  const handleUserLeave = () => {
    userMenuTimer.current = setTimeout(() => {
      setShowUserMenu(false);
    }, 300);
  };

  const handleLogout = () => {
    // 💡 Use the Firebase logout function from context
    logout();
    // Removed: clearUserSession() and localStorage.removeItem('user')
    setShowUserMenu(false);
    navigate('/');
    // Added a small timeout just for UI cleanup, Firebase context updates state automatically
    // setTimeout(() => window.location.reload(), 50); 
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setActiveMegaMenu(null);
  };

  // Derived state from currentUser
  const userIsLoggedIn = !!currentUser;
  const userIsAdmin = currentUser?.role === 'admin';
  const userDisplayName = currentUser?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Profile';


  return (
    <>
      <header
        // "relative" here is crucial. It makes the absolute menu align to the full width of the header.
        className={`relative z-[1000] w-full border-b transition-all duration-300 ${
          isScrolled ? 'bg-white/98 backdrop-blur-xl shadow-md border-gray-200 py-2 sticky top-0' : 'bg-white/95 backdrop-blur-lg shadow-sm border-gray-100 sticky top-0'
        }`}
        style={{ isolation: 'isolate' }}
      >
        {/* Utility Row */}
        <div className="w-full border-b border-gray-100 bg-gray-50/80">
          <div className="site-container flex items-center justify-between py-2 text-xs">
            <div className="flex items-center gap-3 sm:gap-4 text-slate whitespace-nowrap flex-shrink-0">
              <a href="tel:+918929012345" className="flex items-center gap-1.5 hover:text-navy transition text-xs sm:text-sm">
                <ICONS.Phone className="h-3 w-3 flex-shrink-0" />
                <span className="hidden xs:inline">+91 78953 18390</span>
              </a>
              <a href="mailto:hello@aurasquare.com" className="hidden md:flex items-center gap-1.5 hover:text-navy transition text-xs sm:text-sm">
                <ICONS.Mail className="h-3 w-3 flex-shrink-0" />
                <span>hello@aurasquare.com</span>
              </a>
            </div>
            <select className="bg-transparent text-slate text-xs border-none focus:outline-none cursor-pointer hover:text-navy transition flex-shrink-0 ml-2">
              <option>Select Region</option>
              <option>Delhi NCR</option>
              <option>Dehradun</option>
              <option>Haridwar</option>
              <option>Mumbai</option>
              <option>Bangalore</option>
              <option>Pune</option>
            </select>
          </div>
        </div>

        {/* Main Header Content */}
        <div className={`site-container flex items-center justify-between gap-4 sm:gap-6 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3.5'}`}>
          {/* Logo */}
          <div className="flex-shrink-0 min-w-0">
            <button
              className="flex items-center gap-2 hover:opacity-80 transition"
              onClick={() => navigate('/')}
              aria-label="Home"
            >
              <ICONS.Logo className="h-7 w-7 sm:h-8 sm:w-8 text-navy flex-shrink-0" />
              <span className="font-display text-xl sm:text-2xl font-semibold text-navy whitespace-nowrap">
                Aura<span className="text-gold">Square</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3 flex-1 justify-center px-4 xl:px-6 min-w-0">
            {navLinks.map((link) => (
              <div
                key={link.to}
                ref={(el) => { if (el) navItemRefs.current[link.key || link.to] = el; }}
                className="relative h-full flex items-center"
                onMouseEnter={() => link.hasMegaMenu && handleNavMouseEnter(link.key)}
                onMouseLeave={handleNavMouseLeave}
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `relative flex items-center gap-1.5 px-3 xl:px-4 py-2.5 text-sm font-semibold tracking-tight rounded-lg transition-all duration-200 whitespace-nowrap ${
                      isActive ? 'text-navy bg-navy/5' : 'text-slate hover:text-navy hover:bg-slate/5'
                    } focus:outline-none focus:ring-2 focus:ring-navy/20 focus:ring-offset-2`
                  }
                >
                  {link.name}
                  {link.hasMegaMenu && (
                    <ICONS.ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeMegaMenu === link.key ? 'rotate-180' : ''}`} />
                  )}
                  {link.hasMegaMenu && activeMegaMenu === link.key && (
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="absolute bottom-0 left-0 h-0.5 bg-navy" />
                  )}
                </NavLink>
              </div>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 flex-shrink-0 min-w-0">
            <NavLink to="/post-property" className="rounded-full bg-gradient-to-r from-navy to-indigo px-4 xl:px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap">
              Post Property
            </NavLink>
            
            {/* User Status Block */}
            {authLoading ? (
              <div className="text-sm text-slate">Loading...</div>
            ) : userIsLoggedIn ? (
              <div 
                className="relative"
                onMouseEnter={handleUserEnter}
                onMouseLeave={handleUserLeave}
              >
                <button
                  className="flex items-center gap-2 rounded-full border border-slate/20 px-3 py-2 hover:bg-slate/5 transition"
                >
                  {currentUser?.photoURL ? (
                    <img src={currentUser.photoURL} alt={userDisplayName} className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-navy to-indigo flex items-center justify-center text-white text-sm font-semibold">
                      {userDisplayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-navy hidden xl:inline">{userDisplayName}</span>
                  <ICONS.ChevronDown className="h-4 w-4 text-slate" />
                </button>
                
                {/* User Menu Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full pt-2 w-64 z-50"
                    >
                        <div className="rounded-2xl bg-white border border-gray-200 shadow-xl py-2">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-navy">{userDisplayName}</p>
                            <p className="text-xs text-slate">{currentUser?.email}</p>
                            {currentUser?.role && (
                              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-navy/10 text-navy">
                                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                              </span>
                            )}
                          </div>

                          <Link to="/profile" className="block px-4 py-2 text-sm text-navy hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>Profile</Link>
                          {userIsAdmin && (
                            <Link to="/admin" className="block px-4 py-2 text-sm text-navy hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                              Admin Panel
                            </Link>
                          )}
                          <Link to="/post-property" className="block px-4 py-2 text-sm text-navy hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                            Post Property
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Log out
                          </button>
                        </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <NavLink to="/login" className="text-sm font-semibold text-slate hover:text-navy transition rounded-lg px-3 py-2 whitespace-nowrap">
                  Log In
                </NavLink>
                <NavLink to="/signup" className="rounded-full bg-navy px-4 xl:px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap flex-shrink-0">
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden rounded-full border border-slate/30 p-2 text-navy hover:bg-slate/5 transition flex-shrink-0"
            onClick={() => setMenuOpen(true)}
          >
            <ICONS.Menu className="h-5 w-5" />
          </button>
        </div>

        {/* --- MEGA MENU CONTAINER --- */}
        {/* Placed here so it is relative to the FULL WIDTH header, not the inner container */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={handleMenuMouseEnter}
              onMouseLeave={handleMenuMouseLeave}
              className="absolute left-0 top-full w-full z-50 flex justify-center"
              // Padding top creates the invisible bridge for the mouse
              style={{ paddingTop: '8px' }} 
            >
              {/* This inner div is centered by flex above */}
              <div className="relative">
                <MegaMenuPortal
                  navItemRef={{ current: navItemRefs.current[activeMegaMenu] }}
                  activeMenu={activeMegaMenu}
                  onClose={() => setActiveMegaMenu(null)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* Mobile Menu Portal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-white lg:hidden"
                style={{ zIndex: 99999 }}
                onClick={closeMobileMenu}
              >
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="fixed inset-0 bg-white overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col min-h-full">
                    <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white" style={{ zIndex: 10 }}>
                      <span className="font-display text-2xl font-semibold text-navy">Menu</span>
                      <button onClick={closeMobileMenu} className="rounded-full border border-slate/20 p-2 text-navy hover:bg-slate/5 transition">
                        <ICONS.X className="h-5 w-5" />
                      </button>
                    </div>

                    <nav className="flex-1 px-6 py-6 space-y-1 overflow-y-auto">
                      {navLinks.map((link) => (
                        <MobileNavItem key={link.to} link={link} onClose={closeMobileMenu} />
                      ))}
                    </nav>

                    <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-6 space-y-3" style={{ zIndex: 10 }}>
                      <NavLink to="/post-property" onClick={closeMobileMenu} className="block w-full rounded-full bg-gradient-to-r from-navy to-indigo px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg transition hover:shadow-xl">Post Property</NavLink>
                      
                      {/* Mobile User Status Block */}
                      {authLoading ? (
                        <div className="text-center text-sm text-slate py-3">Loading user...</div>
                      ) : userIsLoggedIn ? (
                        <div className="space-y-3">
                          <div className="px-4 py-3 bg-gray-50 rounded-xl">
                            <p className="text-sm font-semibold text-navy">{userDisplayName}</p>
                            <p className="text-xs text-slate">{currentUser?.email}</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                            className="w-full rounded-full border border-red-200 bg-red-50 px-6 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            Log out
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <NavLink to="/login" onClick={closeMobileMenu} className="rounded-full border-2 border-slate/20 px-6 py-3.5 text-center text-sm font-semibold text-slate transition hover:bg-slate/5 hover:border-slate/40">Log In</NavLink>
                          <NavLink to="/signup" onClick={closeMobileMenu} className="rounded-full bg-navy px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg transition hover:shadow-xl">Sign Up</NavLink>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

const MobileNavItem = ({ link, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubmenu = link.hasMegaMenu;

  return (
    <div>
      {hasSubmenu ? (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold text-navy rounded-xl hover:bg-slate/5 transition"
          >
            <span>{link.name}</span>
            <ICONS.ChevronDown className={`h-5 w-5 text-slate transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="pl-4 pr-4 pb-3 space-y-2 overflow-hidden">
                <div className="pl-4 pr-4 pb-3 space-y-2">
                  <NavLink to={link.to} onClick={onClose} className="block px-4 py-2.5 text-sm text-slate rounded-lg hover:bg-slate/5 hover:text-navy transition">View All {link.name}</NavLink>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <NavLink to={link.to} onClick={onClose} className="block px-4 py-3.5 text-base font-semibold text-navy rounded-xl hover:bg-slate/5 transition">{link.name}</NavLink>
      )}
    </div>
  );
};

export default Header;