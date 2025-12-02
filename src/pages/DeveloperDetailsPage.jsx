// src/pages/DeveloperDetailsPage.jsx
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ICONS } from '../components/icons.jsx';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';

const DeveloperDetailsPage = () => {
  const { name } = useParams();
  
  // Decode the URL-safe name back to normal string (e.g., "Aura%20Square" -> "Aura Square")
  const developerName = decodeURIComponent(name);

  // Filter projects belonging to this developer
  const developerProjects = useMemo(() => {
    return projects.filter((p) => p.developer === developerName);
  }, [developerName]);

  // Get primary city from first project found (fallback logic)
  const primaryCity = developerProjects.length > 0 ? developerProjects[0].city : 'India';

  if (!developerProjects.length) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-navy">Developer Not Found</h2>
        <p className="text-slate mt-2">We couldn't find any projects for "{developerName}".</p>
        <Link to="/projects" className="mt-4 text-indigo font-semibold hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Header Section */}
      <div className="bg-navy pt-32 pb-16 text-white">
        <div className="site-container">
          <Link to="/projects" className="mb-6 inline-flex items-center gap-2 text-white/70 hover:text-white transition">
            <ICONS.ArrowLeft className="h-4 w-4" /> Back to all projects
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="floating-chip bg-white/20 text-white mb-3">Verified Developer</p>
              <h1 className="text-4xl font-display font-semibold">{developerName}</h1>
              <p className="mt-2 text-white/80 flex items-center gap-2">
                <ICONS.MapPin className="h-4 w-4 text-gold" /> Based in {primaryCity}
              </p>
            </div>
            <div className="text-right md:text-left">
              <span className="text-5xl font-display font-bold text-gold">{developerProjects.length}</span>
              <p className="text-sm uppercase tracking-wider text-white/70">Active Projects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="site-container -mt-10 relative z-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {developerProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
               <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDetailsPage;