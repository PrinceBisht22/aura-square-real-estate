import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from './icons.jsx';
import { submitNewsletter } from '../utils/api.js';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await submitNewsletter(email);
      setNewsletterStatus('success');
      setEmail('');
      setTimeout(() => setNewsletterStatus(null), 5000);
    } catch (error) {
      setNewsletterStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-navy text-white mt-16">
      <div className="site-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <ICONS.Logo className="h-8 w-8 text-gold" />
              <span className="text-2xl font-bold">
                Aura<span className="text-gold">Square</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              Find your next home, investment, or workspace across India with Aura Square.
              Trusted by 50,000+ buyers, renters, and investors.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Properties by City */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Properties by City</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/buy?city=delhi" className="hover:text-gold transition">
                  Delhi
                </Link>
              </li>
              <li>
                <Link to="/buy?city=mumbai" className="hover:text-gold transition">
                  Mumbai
                </Link>
              </li>
              <li>
                <Link to="/buy?city=bangalore" className="hover:text-gold transition">
                  Bangalore
                </Link>
              </li>
              <li>
                <Link to="/buy?city=gurgaon" className="hover:text-gold transition">
                  Gurgaon
                </Link>
              </li>
              <li>
                <Link to="/buy?city=noida" className="hover:text-gold transition">
                  Noida
                </Link>
              </li>
              <li>
                <Link to="/buy?city=pune" className="hover:text-gold transition">
                  Pune
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/insights" className="hover:text-gold transition">
                  Insights & Guides
                </Link>
              </li>
              <li>
                <Link to="/tools/emi" className="hover:text-gold transition">
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link to="/tools/loan-eligibility" className="hover:text-gold transition">
                  Loan Eligibility
                </Link>
              </li>
              <li>
                <Link to="/tools/budget" className="hover:text-gold transition">
                  Budget Calculator
                </Link>
              </li>
              <li>
                <Link to="/tools/area-converter" className="hover:text-gold transition">
                  Area Converter
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-gold transition">
                  All Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/about" className="hover:text-gold transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-gold transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/partners" className="hover:text-gold transition">
                  Partner with us
                </Link>
              </li>
              <li>
                <Link to="/media" className="hover:text-gold transition">
                  Media
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-gold transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              <li>
                <Link to="/contact" className="hover:text-gold transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-gold transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gold transition">
                  FAQ
                </Link>
              </li>
            </ul>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/terms" className="hover:text-gold transition">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-gold transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-gold transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold mb-2">Stay updated with market insights</h3>
            <p className="text-sm text-gray-300 mb-4">
              Subscribe to our newsletter for weekly property trends, investment tips, and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 rounded-full border border-gray-600 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-gradient-to-r from-gold to-amber-400 px-6 py-3 text-sm font-semibold text-navy shadow-lg transition hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {newsletterStatus === 'success' && (
              <p className="mt-2 text-sm text-green-400">✓ Successfully subscribed!</p>
            )}
            {newsletterStatus === 'error' && (
              <p className="mt-2 text-sm text-red-400">✗ Failed to subscribe. Please try again.</p>
            )}
          </div>
        </div>

        {/* Contact Quick Links */}
        <div className="border-t border-gray-700 pt-6 mb-6">
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
            <a href="tel:+918929012345" className="flex items-center gap-2 hover:text-gold transition">
              <ICONS.Phone className="h-4 w-4" />
              +91 78953 18390
            </a>
            <a href="mailto:hello@aurasquare.com" className="flex items-center gap-2 hover:text-gold transition">
              <ICONS.Mail className="h-4 w-4" />
              hello@aurasquare.com
            </a>
            <div className="flex items-center gap-2">
              <ICONS.MapPin className="h-4 w-4" />
              Aura Square, Indraprastha, Jogiwala, Dehradun 248001
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-2">
          <p>
            &copy; {new Date().getFullYear()} Aura Square Realty Pvt. Ltd. All rights reserved.
          </p>
          <p>Made for modern India's home buyers, renters, and investors.</p>
          <p className="text-[10px]">Version 1.0.0</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
