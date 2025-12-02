import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from './icons.jsx';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/project/${project.id}`)}
      className="group relative flex h-full flex-col rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl cursor-pointer"
    >
      {/* Wrapper for Image Area (Relative positioning context) */}
      <div className="relative h-56 w-full rounded-t-2xl">
        
        {/* 1. Inner Clipper: Handles the image zoom effect without affecting the logo */}
        <div className="h-full w-full overflow-hidden rounded-t-2xl bg-gray-100">
          <img
            src={project.image}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Status Tag */}
        <div className="absolute left-3 top-3 z-10">
          <span className="rounded bg-navy px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            {project.status}
          </span>
        </div>
        
        {/* 2. Developer Logo: Placed OUTSIDE the overflow-hidden div so it pops out */}
        <div className="absolute -bottom-5 left-4 z-20 h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-white shadow-md flex items-center justify-center">
          <img 
            src={project.logo || `https://ui-avatars.com/api/?name=${project.developer}&background=0a192f&color=fff`} 
            alt={project.developer} 
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-8"> 
        <h3 className="line-clamp-1 text-lg font-bold text-navy group-hover:text-indigo-600 transition-colors">
          {project.name}
        </h3>
        <p className="mb-3 text-xs font-medium text-slate-500">
          by {project.developer}
        </p>
        
        <div className="mb-4 flex items-center gap-1 text-sm text-slate-600">
          <ICONS.MapPin className="h-4 w-4 text-gold" />
          {project.locality}, {project.city}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-[10px] uppercase text-slate-400 font-bold">Starting From</p>
            <p className="text-lg font-bold text-navy">₹{(project.startingPrice / 100000).toFixed(1)} Lacs+</p>
          </div>
          <button className="rounded-lg bg-slate-50 p-2 text-navy transition-colors hover:bg-navy hover:text-white">
            <ICONS.ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;