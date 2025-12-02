import React, { useState, useEffect, useMemo } from 'react'; // 💡 Added useState, useEffect, useMemo
import { Link, useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
// Removed: import { projects } from '../data/projects';
import { ICONS } from '../components/icons.jsx';

// 💡 NEW: Import Firebase API function
import { getProjects } from '../utils/api'; 

// We move the grouping logic inside the component to use the fetched data.

const ProjectsPage = () => {
  const navigate = useNavigate();

  // 💡 NEW STATE: For fetching data
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 💡 DATA FETCHING useEffect ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Call the Firebase API function to fetch all projects
        const data = await getProjects();
        setAllProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load project listings. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Run only once on mount
  
  // --- UPDATED: Memoized Calculations using fetched data ---
  const { trendingProjects, featuredDevelopers } = useMemo(() => {
    if (allProjects.length === 0) {
      return { trendingProjects: [], featuredDevelopers: [] };
    }

    // 1. Group projects by developer
    const developerMap = allProjects.reduce((acc, project) => {
      const developerName = project.developer || 'Unlisted Developer';
      if (!acc[developerName]) {
        acc[developerName] = [];
      }
      acc[developerName].push(project);
      return acc;
    }, {});
    
    // 2. Calculate featured developers stats
    const developersList = Object.entries(developerMap).map(
      ([developer, devProjects]) => ({
        developer,
        // Assuming first project holds city and possession info for simplicity
        city: devProjects[0].city || 'N/A',
        count: devProjects.length,
        nextPossession: devProjects[0].possessionDate || 'Upcoming',
      }),
    );
    
    // 3. Trending projects (slice the first 4 for display)
    const trending = allProjects.slice(0, 4);

    return { 
      trendingProjects: trending, 
      featuredDevelopers: developersList.slice(0, 6) // Limit to 6 featured developers
    };
  }, [allProjects]); // Recalculate when allProjects state changes

  // --- 💡 Loading and Error Rendering ---
  if (loading) {
      return (
          <div className="flex h-[60vh] items-center justify-center">
              <ICONS.Loader className="h-8 w-8 animate-spin text-navy" />
              <p className='ml-3 text-lg text-slate-600'>Loading projects and developers...</p>
          </div>
      );
  }

  if (error) {
    return (
        <div className="site-container py-12 text-center text-red-600 border border-red-200 bg-red-50 rounded-lg">
            <h2>Data Load Error</h2>
            <p>{error}</p>
        </div>
    );
  }
  
  return (
    <div className="space-y-12 pb-16">
      <section className="relative overflow-hidden rounded-b-[40px] bg-navy text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2747901/pexels-photo-2747901.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Projects hero"
            className="h-full w-full object-cover opacity-40" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 pt-32">
          <p className="floating-chip bg-white/20 text-white">Projects</p>
          <h1 className="mt-4 text-4xl font-display font-semibold">
            Big hero projects by trusted developers
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Browse trending launches, review developer track records, and compare configurations,
            amenities, and payment schedules side by side.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 mt-12">
        <div className="flex flex-col gap-2">
          <p className="floating-chip text-navy">Trending projects</p>
          <h2 className="section-heading">Shortlisted by Aura Square visitors</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {trendingProjects.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate/30 p-10 text-center text-slate col-span-2">
                No trending projects currently available.
              </div>
          ) : (
            trendingProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <div className="flex flex-col gap-2">
          <p className="floating-chip text-navy">Featured developers</p>
          <h2 className="section-heading">Builder credibility at a glance</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {featuredDevelopers.map((developer) => (
            <article key={developer.developer} className="glass-card p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-navy">
                  {developer.developer}
                </h3>
                <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-navy">
                  {developer.count} projects
                </span>
              </div>
              <p className="mt-1 text-sm text-slate">
                Primary city: {developer.city}
              </p>
              <p className="mt-3 text-sm text-slate">
                Next possession: {developer.nextPossession}
              </p>
              
              <Link 
                to={`/developers/${encodeURIComponent(developer.developer)}`}
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-indigo hover:gap-2 transition-all"
              >
                View projects &rarr;
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;