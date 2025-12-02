import React from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../components/icons.jsx';

const PartnerPage = () => {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-navy text-white py-20">
        <div className="site-container grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">For Partners</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
              Grow your real estate business with us
            </h1>
            <p className="text-lg text-white/80">
              Join India's largest network of verified brokers and developers. Get high-quality leads and close deals faster.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/signup" className="bg-white text-navy px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
                Register as Partner
              </Link>
              <Link to="/contact" className="border border-white/30 px-8 py-3 rounded-full font-bold hover:bg-white/10 transition">
                Contact Sales
              </Link>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80" 
              alt="Business meeting" 
              className="rounded-3xl shadow-2xl border border-white/10"
            />
            {/* Floating Stat Card */}
            <div className="absolute -bottom-6 -left-6 bg-white text-navy p-6 rounded-2xl shadow-xl hidden md:block">
              <p className="text-3xl font-bold">12,000+</p>
              <p className="text-sm font-medium text-slate-500">Partners Onboarded</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="site-container py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-navy mb-4">Why partner with Aura Square?</h2>
          <p className="text-slate">We provide the technology and reach you need to scale your business.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: ICONS.Users, 
              title: "Verified Leads", 
              desc: "Stop chasing cold calls. Get leads that are verified via OTP and intent checks." 
            },
            { 
              icon: ICONS.BarChart, 
              title: "Dashboard Analytics", 
              desc: "Track your listings views, lead responses, and ROI in real-time." 
            },
            { 
              icon: ICONS.Shield, 
              title: "Brand Visibility", 
              desc: "Get a dedicated microsite for your agency or developer profile." 
            }
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-navy/20 transition">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 text-navy">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">{item.title}</h3>
              <p className="text-slate leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="site-container pb-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to scale your sales?</h2>
          <Link to="/signup" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-bold shadow-lg hover:bg-gray-50 transition transform hover:-translate-y-1">
            Join Partner Network
          </Link>
        </div>
      </section>

    </div>
  );
};

export default PartnerPage;