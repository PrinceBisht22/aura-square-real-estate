// src/pages/ProjectDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ICONS } from '../components/icons.jsx';

// --- IMPORT FIREBASE API FUNCTION ---
import { getProjectDetails } from '../utils/api'; 
// Removed: import { projects } from '../data/projects.js';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true); // 💡 NEW: Loading state
  const [error, setError] = useState(null);     // 💡 NEW: Error state

  // --- 💡 DATA FETCHING useEffect (REPLACED) ---
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 1. Call the Firebase API function to fetch the single project
        const found = await getProjectDetails(id); 
        
        if (found) {
          setProject(found);
        } else {
          // Project not found
          setError("Project not found. It may have been completed or removed.");
          setProject(null);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to connect to the database. Please try again.");
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    if (id) {
      fetchProject();
    } else {
      setError("Invalid project link.");
      setLoading(false);
    }
    
  }, [id]);

  // --- 💡 CONDITIONAL RENDERING (UPDATED) ---
  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
          <ICONS.Loader className="h-6 w-6 animate-spin text-navy" />
        </div>
        <p className="text-slate">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-[60vh] items-center justify-center flex-col text-center p-6">
        <ICONS.AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-navy">Project Not Found</h1>
        <p className="text-slate-600 mt-2">{error || "The project you are looking for does not exist or the link is broken."}</p>
        <button onClick={() => navigate('/projects')} className="mt-6 bg-navy text-white px-6 py-3 rounded-full font-bold hover:bg-blue-900 transition">
          View All Projects
        </button>
      </div>
    );
  }

  // Use the loaded 'project' data for rendering
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Image Section */}
      <div className="relative h-[50vh] w-full bg-gray-900">
        <img 
          src={project.image} 
          alt={project.name} 
          className="h-full w-full object-cover opacity-80" 
        />
        <div className="absolute bottom-0 left-0 p-8 text-white w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div className="site-container">
            <span className="bg-blue-600 px-3 py-1 rounded text-xs font-bold uppercase mb-3 inline-block shadow-sm">
              {project.status}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-2">{project.name}</h1>
            <p className="text-lg opacity-90 flex items-center gap-2 font-medium">
              <ICONS.MapPin className="w-5 h-5 text-yellow-400" /> 
              {project.locality}, {project.city}
            </p>
          </div>
        </div>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-8 z-10 bg-white/20 backdrop-blur-md border border-white/30 text-white p-3 rounded-full hover:bg-white hover:text-navy transition-all"
        >
          <ICONS.ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Details Container */}
      <div className="site-container mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Info & Description */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Key Stats Grid */}
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-display font-bold text-navy mb-6">Project Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Developer</p>
                <p className="text-navy font-bold text-lg">{project.developer}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Configuration</p>
                <p className="text-navy font-bold text-lg">{project.configuration}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Possession</p>
                <p className="text-navy font-bold text-lg">{project.possessionDate}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Starting Price</p>
                <p className="text-navy font-bold text-lg">₹{(project.startingPrice / 100000).toFixed(1)} Lacs+</p>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-display font-bold text-navy mb-4">About the Project</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              Experience luxury living at {project.name}. Located prominently in {project.locality}, this project offers state-of-the-art amenities including {project.tags?.join(', ')}. Designed by {project.developer}, it promises a blend of comfort, elegance, and modern architecture suitable for families and professionals alike.
            </p>
            
            <h3 className="text-lg font-bold text-navy mt-6 mb-3">Highlights</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.tags?.map((tag, index) => (
                <li key={index} className="flex items-center gap-2 text-slate-600">
                  <ICONS.CheckCircle className="w-5 h-5 text-green-500" />
                  {tag}
                </li>
              ))}
              <li className="flex items-center gap-2 text-slate-600">
                <ICONS.CheckCircle className="w-5 h-5 text-green-500" />
                24/7 Security & Power Backup
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sticky top-24">
            {/* Developer Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
               <div className="h-14 w-14 rounded-full border-2 border-slate-100 overflow-hidden p-1">
                 <img 
                   src={project.logo || `https://ui-avatars.com/api/?name=${project.developer}&background=0a192f&color=fff`} 
                   alt="Developer" 
                   className="w-full h-full object-cover rounded-full" 
                 />
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Developed By</p>
                 <h3 className="font-bold text-navy text-lg">{project.developer}</h3>
               </div>
            </div>
            
            {/* Contact Buttons (Placeholder for API calls) */}
            <div className="space-y-3">
              <button className="w-full bg-navy text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-900 transition shadow-lg flex items-center justify-center gap-2">
                <ICONS.Phone className="w-4 h-4" /> Contact Developer
              </button>
              <button className="w-full border border-slate-200 text-navy py-4 rounded-xl font-bold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2">
                <ICONS.Download className="w-4 h-4" /> Download Brochure
              </button>
            </div>

            <p className="text-xs text-slate-400 text-center mt-4">
              By contacting, you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetailsPage;