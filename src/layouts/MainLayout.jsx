import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';
import CustomCursor from '../components/CustomCursor';

const BackToTopButton = () => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 md:right-20 bg-white text-navy border border-gray-200 shadow-lg rounded-full p-3 hover:shadow-2xl hover:-translate-y-1 transition-all"
      aria-label="Back to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
};

const CookieBanner = () => {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-gray-900 text-white px-4 py-3 md:px-8 md:py-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="text-sm md:text-xs lg:text-sm text-gray-100">
          We use cookies to personalize content and analyze our traffic. By continuing to use Aura Square, you agree to our
          cookie policy.
        </p>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={() => setVisible(false)}
            className="px-4 py-2 text-xs font-semibold rounded-full bg-white text-gray-900 shadow hover:shadow-md transition"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <CustomCursor />
      <Header />
      <motion.main
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
      <ChatWidget />
      <BackToTopButton />
      <CookieBanner />
    </div>
  );
};

export default MainLayout;


