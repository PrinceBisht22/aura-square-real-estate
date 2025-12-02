import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ICONS } from '../components/icons.jsx';
import { projects } from '../data/projects.js';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const found = projects.find((p) => p.id === id);
    if (found) {
      setProject(found);
    }
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) return <div className="py-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Image */}
      <div className="relative h-[50vh] w-full bg-gray-900">
        <img src={project.image} alt={project.name} className="h-full w-full object-cover opacity-80" />
        <div className="absolute bottom-0 left-0 p-8 text-white w-full bg-gradient-to-t from-black/80 to-transparent">
          <div className="site-container">
            <span className="bg-blue-600 px-3 py-1 rounded text-xs font-bold uppercase mb-2 inline-block">{project.status}</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{project.name}</h1>
            <p className="text-lg opacity-90 flex items-center gap-2">
              <ICONS.MapPin className="w-5 h-5" /> {project.locality}, {project.city}
            </p>
          </div>
        </div>
      </div>

      {/* Details Container */}
      <div className="site-container mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-navy mb-4">Project Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-slate-500 text-xs uppercase font-bold">Developer</p>
                <p className="text-navy font-semibold">{project.developer}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase font-bold">Configuration</p>
                <p className="text-navy font-semibold">{project.configuration}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase font-bold">Possession</p>
                <p className="text-navy font-semibold">{project.possessionDate}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase font-bold">Starting Price</p>
                <p className="text-navy font-semibold">₹{(project.startingPrice / 100000).toFixed(1)} Lacs+</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-navy mb-4">About the Project</h2>
            <p className="text-slate-600 leading-relaxed">
              Experience luxury living at {project.name}. Located prominently in {project.locality}, this project offers state-of-the-art amenities including {project.tags.join(', ')}. Designed by {project.developer}, it promises a blend of comfort and elegance.
            </p>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-24">
            <div className="flex items-center gap-4 mb-6">
               <img src={project.logo} alt="Developer" className="w-12 h-12 rounded-full border border-slate-200" />
               <div>
                 <p className="text-xs text-slate-500 font-bold">DEVELOPER</p>
                 <h3 className="font-bold text-navy">{project.developer}</h3>
               </div>
            </div>
            <button className="w-full bg-navy text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition mb-3">
              Contact Developer
            </button>
            <button className="w-full border border-navy text-navy py-3 rounded-xl font-bold hover:bg-slate-50 transition">
              Download Brochure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;