import React from 'react';
import { ICONS } from '../components/icons.jsx';

const AboutPage = () => {
  return (
    <div className="site-container py-16">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-display font-bold text-navy mb-6">Reimagining Real Estate in India</h1>
        <p className="text-lg text-slate leading-relaxed">
          Aura Square is India's fastest growing prop-tech platform, dedicated to simplifying property transactions. 
          We bridge the gap between buyers, sellers, and developers with transparency, data, and technology.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: ICONS.Shield, title: "100% Transparency", desc: "No hidden fees, no bias. We believe in honest dealings." },
          { icon: ICONS.CheckCircle, title: "Verified Listings", desc: "Every property is physically verified by our field agents." },
          { icon: ICONS.Users, title: "Customer First", desc: "Dedicated relationship managers for every step of your journey." }
        ].map((item, i) => (
          <div key={i} className="bg-gray-50 p-8 rounded-3xl text-center">
            <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-4 text-navy">
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">{item.title}</h3>
            <p className="text-slate">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;