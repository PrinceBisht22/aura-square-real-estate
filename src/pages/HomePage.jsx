import React, { useMemo, useState, useEffect } from 'react'; // 💡 Added useEffect and useState
import { Link, useNavigate } from 'react-router-dom';
import HeroSearch from '../components/HeroSearch';
import TabsNav from '../components/TabsNav';
import PropertyCard from '../components/PropertyCard';
import ProjectCard from '../components/ProjectCard';
import ToolsCard from '../components/ToolsCard';
import TestimonialsCard from '../components/TestimonialsCard';
import Carousel from '../components/Carousel';
import { ICONS } from '../components/icons.jsx';

// --- IMPORT FIREBASE API FUNCTIONS ---
// 💡 IMPORTANT: These functions must be defined in your src/utils/api.js file!
import { 
  getResidentialListings, 
  getCommercialListings, 
  getPlots, 
  getProjects, 
  getTestimonials,
  getInsights // Assuming insights is handled by a dedicated function
} from '../utils/api'; 

// --- KEEP STATIC DATA LOCALLY ---
import { popularCities } from '../data/marketData.js'; 
// NOTE: insightsPosts, residentialListings, commercialListings, plots, projects, and testimonials 
// imports are now REMOVED as they are fetched from Firebase.

// --- DEFINITIONS (Static Data) ---
const tabs = [
  { id: 'buy', label: 'Buy' },
  { id: 'rent', label: 'Rent' },
  { id: 'new', label: 'New Launch' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'plots', label: 'Plots/Land' },
  { id: 'projects', label: 'Projects' },
  { id: 'post', label: 'Post Property' },
];
const categoryCards = [/* ... remains the same ... */];
const tools = [/* ... remains the same ... */];
const footerLinks = [/* ... remains the same ... */];

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const navigate = useNavigate();

  // 💡 NEW STATE FOR FIREBASE DATA
  const [allListings, setAllListings] = useState([]); // Stores all residential/plots
  const [allProjects, setAllProjects] = useState([]);
  const [allCommercial, setAllCommercial] = useState([]);
  const [allPlots, setAllPlots] = useState([]);
  const [allTestimonials, setAllTestimonials] = useState([]);
  const [allInsights, setAllInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FIREBASE DATA FETCHING LOGIC ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all required data concurrently for speed
        const [
          residentialData, 
          projectsData, 
          commercialData, 
          plotsData, 
          testimonialsData, 
          insightsData
        ] = await Promise.all([
          getResidentialListings(), // Residential (includes Buy/Rent)
          getProjects(),            // Projects
          getCommercialListings(),  // Commercial
          getPlots(),               // Plots/Land
          getTestimonials(),        // Testimonials
          getInsights()             // Insights/Articles
        ]);
        
        // Update state with fetched data
        setAllListings(residentialData);
        setAllProjects(projectsData);
        setAllCommercial(commercialData);
        setAllPlots(plotsData);
        setAllTestimonials(testimonialsData);
        setAllInsights(insightsData);

      } catch (err) {
        console.error("Failed to fetch homepage data:", err);
        setError("A problem occurred while loading the data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []); // Run only once on mount

  // --- UPDATED useMemo HOOKS ---
  const recentInsights = useMemo(() => allInsights.slice(0, 3), [allInsights]);

  const tabContent = useMemo(() => {
    // Determine the source list based on the active tab
    let items;
    let type;

    switch (activeTab) {
      case 'buy': 
        type = 'property';
        // Filter residential listings for "Buy" and take the first 3
        items = allListings.filter((item) => item.listedFor === 'Buy').slice(0, 3);
        break;
      case 'rent': 
        type = 'property';
        // Filter residential listings for "Rent" and take the first 3
        items = allListings.filter((item) => item.listedFor === 'Rent').slice(0, 3);
        break;
      case 'new': 
        type = 'project';
        items = allProjects.filter((project) => project.status === 'New Launch').slice(0, 3);
        break;
      case 'commercial': 
        type = 'commercial';
        items = allCommercial.slice(0, 3);
        break;
      case 'plots': 
        type = 'plots';
        items = allPlots.slice(0, 3);
        break;
      case 'projects': 
        type = 'project';
        items = allProjects.slice(0, 3);
        break;
      case 'post': 
        return { type: 'cta' };
      default: 
        type = 'property';
        items = allListings.slice(0, 3);
    }
    return { type, items };
  }, [activeTab, allListings, allProjects, allCommercial, allPlots]);

  const featuredProjects = useMemo(() => 
    allProjects.filter((p) => p.tags?.includes('Luxury') || p.status === 'New Launch')
  , [allProjects]);

  const newLaunchProjects = useMemo(() => 
    allProjects.filter((p) => p.status === 'New Launch')
  , [allProjects]);

  // --- NEW: Loading and Error Handling ---
  if (loading) {
      return (
          <div className="site-container py-24 text-center">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-indigo-600" role="status">
                  {/* Tailwind/CSS spinner placeholder */}
              </div>
              <p className="mt-4 text-lg text-slate-500">Loading the latest properties...</p>
          </div>
      );
  }
  
  if (error) {
    return (
        <div className="site-container py-24 text-center text-red-600 border border-red-200 bg-red-50 rounded-lg">
            <h2>Data Load Error</h2>
            <p>{error}</p>
        </div>
    );
  }


  return (
    <div className="space-y-16 pb-16 bg-white">
      <HeroSearch />

      {/* --- 1. EXPLORE SERVICES (Remains the same) --- */}
      <section className="site-container -mt-12 relative z-20">
        {/* ... */}
      </section>

      {/* --- 2. LISTINGS (Now uses tabContent from Firebase data) --- */}
      <section className="site-container space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="section-heading">Handpicked Projects & Properties</h2>
          <TabsNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tabContent.type === 'property' && tabContent.items?.map((property) => <PropertyCard key={property.id} property={property} />)}
          {tabContent.type === 'project' && tabContent.items?.map((project) => <ProjectCard key={project.id} project={project} />)}
          
          {/* Commercial Tab Content (Uses tabContent.items from allCommercial state) */}
          {tabContent.type === 'commercial' && tabContent.items?.map((listing) => (
              <article key={listing.id} className="glass-card p-5">
                <div className="flex items-center justify-between"><span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-navy">{listing.propertyType}</span><p className="text-lg font-semibold text-navy">₹{(listing.price ?? listing.rent)?.toLocaleString()}</p></div>
                <h3 className="mt-4 text-xl font-semibold text-navy">{listing.title}</h3>
                <p className="flex items-center gap-2 text-sm text-slate"><ICONS.MapPin className="h-4 w-4 text-gold" />{listing.locality}, {listing.city}</p>
              </article>
            ))}
            
          {/* Plots Tab Content (Uses tabContent.items from allPlots state) */}
          {tabContent.type === 'plots' && tabContent.items?.map((plot) => (
              <article key={plot.id} className="glass-card p-5">
                <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-navy">{plot.zone}</span>
                <h3 className="mt-4 text-xl font-semibold text-navy">{plot.title}</h3>
                <p className="flex items-center gap-2 text-sm text-slate"><ICONS.MapPin className="h-4 w-4 text-gold" />{plot.locality}, {plot.city}</p>
              </article>
            ))}
            
          {tabContent.type === 'cta' && (
            <div className="col-span-full rounded-3xl bg-gradient-to-r from-navy to-indigo p-8 text-white">
              <h3 className="text-2xl font-semibold">Post property for free</h3>
              <p className="mt-2 text-white/80">Upload photos, highlight amenities, and reach serious buyers and tenants across India.</p>
              <Link to="/post-property" className="mt-4 inline-flex rounded-full bg-white px-5 py-2 font-semibold text-navy shadow-lg hover:bg-gray-100 transition">Get started</Link>
            </div>
          )}
        </div>
      </section>

      {/* --- 3. SERVICE GRID (Remains the same) --- */}
      <section className="bg-sand/60 py-12">
        {/* ... */}
      </section>

      {/* --- 4. POPULAR CITIES (Remains the same) --- */}
      <section className="site-container space-y-6">
        {/* ... */}
      </section>

      {/* --- 5. TOOLS SECTION (Remains the same) --- */}
      <section className="site-container space-y-6">
        {/* ... */}
      </section>

      {/* --- 6. FEATURED CAROUSEL (Uses featuredProjects state) --- */}
      <section className="site-container space-y-8">
        <div className="flex flex-col gap-2"><p className="floating-chip text-navy">Featured Projects</p><h2 className="section-heading">Curated projects across India</h2></div>
        <Carousel items={featuredProjects} renderItem={(project) => <ProjectCard project={project} />} />
      </section>

      {/* --- 7. NEW LAUNCH CAROUSEL (Uses newLaunchProjects state) --- */}
      <section className="site-container space-y-8">
        <div className="flex flex-col gap-2"><p className="floating-chip text-navy">Newly Launched</p><h2 className="section-heading">Be first to book in-demand launches</h2></div>
        <Carousel items={newLaunchProjects} renderItem={(project) => <ProjectCard project={project} />} slidesPerView={{ base: 1.05, md: 2.2, lg: 3.2 }} />
      </section>

      {/* --- 8. STATS BANNER (Remains the same) --- */}
      <section className="bg-gradient-to-r from-navy to-indigo py-14">
        {/* ... */}
      </section>

      {/* --- 9. INSIGHTS SECTION (Uses recentInsights from allInsights state) --- */}
      <section className="site-container space-y-6">
        {/* ... Header remains the same ... */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentInsights.map((article) => (
            <div key={article.id} className="group flex flex-col rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* ... article content remains the same ... */}
            </div>
          ))}
        </div>
      </section>

      {/* --- 10. TESTIMONIALS (Uses allTestimonials state) --- */}
      <section className="bg-sand/60 py-12">
        <div className="site-container space-y-6">
          <div className="flex flex-col gap-2"><p className="floating-chip text-navy">Testimonials</p><h2 className="section-heading">What our customers say about Aura Square</h2></div>
          <div className="grid gap-6 md:grid-cols-2">{allTestimonials.map((testimonial) => <TestimonialsCard key={testimonial.id} testimonial={testimonial} />)}</div>
        </div>
      </section>

      {/* --- 11. RATE YOUR LOCALITY (Remains the same) --- */}
      <section className="site-container">
        {/* ... */}
      </section>

      {/* --- 12. FOOTER LINKS (Remains the same) --- */}
      <section className="site-container space-y-6">
        {/* ... */}
      </section>
    </div>
  );
};

export default HomePage;