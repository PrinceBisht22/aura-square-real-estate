import React, { useState } from 'react';
import { ICONS } from '../components/icons.jsx';

const faqData = {
  "General": [
    { q: "What is Aura Square?", a: "Aura Square is a verified real estate platform connecting buyers, sellers, and tenants with 100% genuine listings." },
    { q: "Is it free to use?", a: "Yes! Searching for properties and contacting owners is completely free. We also offer premium services for assisted buying." },
  ],
  "Buying": [
    { q: "How do you verify properties?", a: "Our field agents physically visit the site, verify ownership documents, and take fresh photographs before a listing goes live." },
    { q: "Can I get a home loan?", a: "Yes, we have partnered with HDFC, SBI, and ICICI to offer exclusive interest rates and paperless approval for our users." },
  ],
  "Selling": [
    { q: "How do I post a property?", a: "Simply click on 'Post Property' in the top right corner, upload photos, and fill in the details. It takes less than 2 minutes." },
    { q: "How to get more leads?", a: "Ensure you upload high-quality photos and write a detailed description. You can also upgrade to a 'Featured Listing' for 5x visibility." },
  ]
};

const FAQsPage = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFAQs = faqData[activeTab].filter(item => 
    item.q.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header */}
      <div className="bg-navy text-white py-16 text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">How can we help you?</h1>
        <div className="relative max-w-xl mx-auto">
          <ICONS.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search for answers..." 
            className="w-full py-4 pl-12 pr-4 rounded-full text-navy focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="site-container -mt-8">
        {/* Tabs */}
        <div className="bg-white p-2 rounded-xl shadow-sm inline-flex gap-2 mb-8 justify-center w-full md:w-auto mx-auto relative left-1/2 -translate-x-1/2">
          {Object.keys(faqData).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setOpenIndex(null); }}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab ? 'bg-navy text-white shadow-md' : 'text-slate-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all hover:shadow-md">
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 text-left font-bold text-navy"
                >
                  <span className="text-lg">{item.q}</span>
                  <ICONS.ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-gray-50">
                    {item.a}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500">No results found for "{searchTerm}"</div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-slate font-medium mb-4">Still have questions?</p>
          <button className="px-6 py-2 border border-gray-300 rounded-full text-navy font-bold hover:bg-white hover:border-navy transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;