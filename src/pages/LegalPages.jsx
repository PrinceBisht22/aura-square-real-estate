import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ICONS } from '../components/icons.jsx';

// Reusable Layout (Keep this as is from previous step)
const LegalLayout = ({ title, children }) => {
  const location = useLocation();
  const links = [
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookie-policy' },
    { name: 'Privacy Policy', path: '/privacy' }, // This link now works
  ];

  return (
    <div className="site-container py-16">
      <div className="grid md:grid-cols-[250px,1fr] gap-12">
        
        {/* Sidebar Navigation */}
        <aside className="hidden md:block sticky top-24 h-fit">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Legal Center</h3>
          <nav className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  location.pathname === link.path
                    ? 'bg-navy text-white shadow-md'
                    : 'text-slate-600 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-6">
            <ICONS.FileText className="w-5 h-5" />
            <span className="text-sm font-medium">Last updated: Nov 26, 2025</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-display font-bold text-navy mb-8 pb-6 border-b border-gray-100">
            {title}
          </h1>
          
          <div className="prose prose-slate prose-lg max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// --- EXISTING PAGES ---
export const TermsPage = () => (
  <LegalLayout title="Terms & Conditions">
    <h3>1. Introduction</h3>
    <p>Welcome to Aura Square. By accessing or using our website, mobile application, and services, you agree to be bound by these Terms and Conditions.</p>
    <h3>2. User Accounts</h3>
    <p>To access certain features, you may need to register. You agree to provide accurate, current, and complete information during the registration process.</p>
    <h3>3. Property Listings</h3>
    <p>Aura Square acts as an intermediary. We do not own, sell, or rent the properties listed. While we verify listings, we do not guarantee the accuracy of all details.</p>
  </LegalLayout>
);

export const CookiePolicyPage = () => (
  <LegalLayout title="Cookie Policy">
    <p>This Cookie Policy explains how Aura Square uses cookies and similar technologies to recognize you when you visit our website.</p>
    <h3>1. What are cookies?</h3>
    <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website.</p>
    <h3>2. How we use cookies</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Essential Cookies:</strong> Necessary for technical operation.</li>
      <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site.</li>
    </ul>
  </LegalLayout>
);

// --- NEW PRIVACY POLICY PAGE ---
export const PrivacyPolicyPage = () => (
  <LegalLayout title="Privacy Policy">
    <p>At Aura Square, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.</p>

    <h3>1. Information We Collect</h3>
    <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.</p>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Personal Data:</strong> Name, email address, phone number, and property preferences.</li>
      <li><strong>Usage Data:</strong> Information on how you access and use the Service.</li>
    </ul>

    <h3>2. How We Use Your Information</h3>
    <p>We use the collected data for various purposes:</p>
    <ul className="list-disc pl-5 space-y-2">
      <li>To provide and maintain our Service.</li>
      <li>To notify you about changes to our Service.</li>
      <li>To provide customer support.</li>
      <li>To monitor the usage of our Service.</li>
    </ul>

    <h3>3. Data Security</h3>
    <p>The security of your data is important to us, but remember that no method of transmission over the Internet is 100% secure. We strive to use commercially acceptable means to protect your Personal Data.</p>

    <h3>4. Third-Party Services</h3>
    <p>We may employ third-party companies (like Google Analytics and payment processors) to facilitate our Service. These third parties have access to your Personal Data only to perform these tasks on our behalf.</p>

    <h3>5. Contact Us</h3>
    <p>If you have any questions about this Privacy Policy, please contact us at: <strong>legal@aurasquare.com</strong></p>
  </LegalLayout>
);