// src/pages/AdminPage.jsx (FINAL VERSION)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ICONS } from '../components/icons.jsx';

// 💡 NEW: Import Firebase Auth and API functions
import { useAuth } from '../context/AuthContext';
import { 
  getAllUsers, 
  getAllListings, 
  getAllProjects, 
  getAllInsights,
  updateListingStatus, // Reused for boosting/status change
  deleteListing,
  deleteProject,
  deleteInsight 
} from '../utils/api'; 
// Removed: adminAPI, getCurrentUser, isAuthenticated

const AdminPage = () => {
  // --- 💡 USE AUTH CONTEXT FOR ROLE CHECK ---
  const { currentUser, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('listings');
  const [data, setData] = useState({ users: [], listings: [], projects: [], insights: [], verifications: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  
  // Form State
  const [newItem, setNewItem] = useState({}); 

  const navigate = useNavigate();

  // --- 💡 AUTHENTICATION & INITIAL DATA LOAD ---
  useEffect(() => {
    // 1. Wait for auth check
    if (authLoading) return;
    
    // 2. Auth Check & Redirection
    if (!currentUser || currentUser.role !== 'admin') { 
        navigate('/', { replace: true });
        return;
    }
    
    // 3. Fetch data if authorized
    fetchAllData();
  }, [navigate, authLoading, currentUser]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      // 💡 REPLACED: Mock API calls with Firebase functions
      const [users, listings, projects, insights] = await Promise.all([
        getAllUsers(), 
        getAllListings(), 
        getAllProjects(), 
        getAllInsights(),
        // NOTE: Verifications are currently not implemented in the API, using an empty array for now.
      ]);
      setData({ users, listings, projects, insights, verifications: [] }); 
    } catch (error) { 
      console.error('Failed to load admin data:', error); 
    } finally { 
      setLoading(false); 
    }
  };

  // --- ACTIONS ---
  const handleDelete = async (type, id) => {
    if (!confirm(`Are you sure you want to delete this ${type}? This is permanent.`)) return;
    try {
      // 💡 REPLACED: Mock deletes with Firebase functions
      if (type === 'listing') await deleteListing(id);
      if (type === 'project') await deleteProject(id);
      if (type === 'insight') await deleteInsight(id);
      fetchAllData(); 
    } catch (e) { 
      console.error(e); 
      alert(`Deletion failed for ${type}. Check console.`);
    }
  };

  const handleBoost = async (listingId, currentFeaturedStatus) => {
    try { 
      // 💡 REPLACED: Mock boost with Firebase update
      await updateListingStatus(listingId, { featured: !currentFeaturedStatus }); 
      fetchAllData(); 
    } catch (e) { 
      console.error(e); 
      alert('Boosting failed.');
    }
  };

  // --- MODAL HANDLERS (Simplified CRUD functions for the UI) ---
  
  // NOTE: For brevity, the saving logic in handleSaveItem is highly complex.
  // In a real application, you would use dedicated Firestore functions for add/update
  // for each type (addProject, updateProject, addInsight, updateInsight).
  // Here, we'll keep the logic centralized but note its complexity.
  const handleSaveItem = async (e) => {
    e.preventDefault();
    // (This requires implementing dedicated add/update functions for projects and insights in api.js)
    alert("Saving logic needs dedicated API endpoints (e.g., addProject, updateInsight) for this modal.");
    // try {
    //   ... simplified save logic using Firestore setDoc(doc(db, collection, itemId), finalItem) ...
    //   setIsModalOpen(false);
    //   setNewItem({});
    //   fetchAllData();
    // } catch (e) { console.error(e); }
  };
  
  // The rest of modal handlers (openEditModal, openAddModal) remain largely the same, 
  // as they deal with UI state (newItem, modalType, etc.)

  const openEditModal = (item, type) => {
    setModalType(type);
    let editableItem = { ...item };
    
    if (type === 'listing') {
      // Logic to convert photos array back to a string for editing
      const imgArray = item.photos?.map(p => p.url) || [];
      editableItem.imageString = imgArray.join(', ');
    }

    setNewItem(editableItem);
    setIsEditing(true);
    setCurrentItemId(item.id);
    setIsModalOpen(true);
  };

  const openAddModal = (type) => {
    setModalType(type);
    setNewItem({});
    setIsEditing(false);
    setCurrentItemId(null);
    setIsModalOpen(true);
  };
  
  // --- HELPERS ---
  const getImageUrl = (item) => {
    if (item.mainImage) return item.mainImage; // New field from PostProperty
    if (item.photos && item.photos.length > 0) return item.photos[0].url;
    if (item.image) return item.image;
    return 'https://via.placeholder.com/400';
  };

  const getPrice = (item) => {
    if (item.price) return `₹${item.price.toLocaleString()}`;
    if (item.rent) return `₹${item.rent.toLocaleString()}/mo`;
    if (item.startingPrice) return `₹${item.startingPrice.toLocaleString()}`;
    return 'Price on Request';
  };

  const filteredList = (list) => {
    if (!list) return [];
    if (!searchTerm) return list;
    const lower = searchTerm.toLowerCase();
    return list.filter(item => (item.title || item.name || '').toLowerCase().includes(lower) || (item.city || item.locality || '').toLowerCase().includes(lower) || (item.email || '').toLowerCase().includes(lower));
  };

  const tabs = [
    { id: 'listings', label: 'Listings', icon: ICONS.Home },
    { id: 'projects', label: 'Projects', icon: ICONS.Briefcase },
    { id: 'insights', label: 'Insights', icon: ICONS.FileText },
    { id: 'users', label: 'Users', icon: ICONS.Users },
    { id: 'verifications', label: 'Verifications', icon: ICONS.Shield },
  ];

  const getCurrentList = () => {
    switch(activeTab) {
      case 'listings': return data.listings;
      case 'projects': return data.projects;
      case 'insights': return data.insights;
      case 'users': return data.users;
      case 'verifications': return data.verifications;
      default: return [];
    }
  };
  const currentList = filteredList(getCurrentList());

  return (
    <div className="site-container py-8 min-h-screen bg-gray-50/50">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy">Admin Dashboard</h1>
          <p className="text-slate">Manage your entire platform from here.</p>
          {/* Display User Role for verification */}
          <p className="text-xs text-slate mt-1">Logged in as: {currentUser?.email} ({currentUser?.role})</p>
        </div>
        
        {/* ADD BUTTONS */}
        <div className="flex gap-3">
          {activeTab === 'projects' && (
            <button onClick={() => openAddModal('project')} className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-navy/90 transition shadow-lg shadow-navy/20">
              <ICONS.Plus className="w-5 h-5" /> Add Project
            </button>
          )}
          {activeTab === 'insights' && (
            <button onClick={() => openAddModal('insight')} className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-navy/90 transition shadow-lg shadow-navy/20">
              <ICONS.Plus className="w-5 h-5" /> Add Insight
            </button>
          )}
          {activeTab === 'listings' && (
             <button onClick={() => navigate('/post-property')} className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-navy/90 transition shadow-lg shadow-navy/20">
               <ICONS.Plus className="w-5 h-5" /> Post Listing
             </button>
          )}
        </div>
      </div>

      <div className="flex overflow-x-auto gap-1 mb-6 border-b border-gray-200 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }} className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold whitespace-nowrap transition rounded-t-lg ${activeTab === tab.id ? 'bg-white border border-b-0 border-gray-200 text-navy' : 'text-slate hover:bg-gray-100'}`}>
              {Icon && <Icon className="w-4 h-4" />} {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-navy/20 outline-none" />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center"><ICONS.Loader className="animate-spin w-8 h-8 text-navy mx-auto" /></div>
      ) : (
        <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
          
          {currentList.length === 0 && (
             <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
                <p className="text-slate mb-4">No items found in {activeTab}.</p>
             </div>
          )}

          {activeTab === 'listings' && currentList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentList.map(listing => (
                <div key={listing.id} className={`bg-white rounded-2xl overflow-hidden border transition hover:shadow-lg ${listing.featured ? 'border-amber-400 ring-4 ring-amber-50' : 'border-gray-200'}`}>
                   <div className="relative h-48 bg-gray-200">
                      <img src={getImageUrl(listing)} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-navy">{getPrice(listing)}</div>
                      <button onClick={() => openEditModal(listing, 'listing')} className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md text-navy hover:text-blue-600 transition">
                        <ICONS.Edit className="w-4 h-4" />
                      </button>
                   </div>
                   <div className="p-4">
                      <h3 className="font-bold text-navy truncate">{listing.title}</h3>
                      <p className="text-xs text-slate mb-4">{listing.locality}, {listing.city}</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleBoost(listing.id, listing.featured)} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition ${listing.featured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-slate hover:bg-gray-200'}`}>
                          <ICONS.TrendingUp className="w-3 h-3" /> {listing.featured ? 'Unboost' : 'Boost'}
                        </button>
                        <button onClick={() => handleDelete('listing', listing.id)} className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                          <ICONS.Trash className="w-4 h-4" />
                        </button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && currentList.length > 0 && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {currentList.map(project => (
                 <div key={project.id} className="bg-white p-4 rounded-2xl border border-gray-200 flex gap-4 hover:shadow-md transition">
                    <img src={getImageUrl(project)} alt="" className="w-32 h-32 rounded-xl object-cover bg-gray-100 shrink-0" />
                    <div className="flex-1 flex flex-col justify-between">
                       <div>
                         <h3 className="font-bold text-navy text-lg">{project.name}</h3>
                         <p className="text-sm text-slate">{project.developer}</p>
                         <p className="text-xs text-slate">{project.locality}, {project.city}</p>
                         <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded">{project.status}</span>
                       </div>
                       <div className="flex justify-end gap-2 mt-2">
                         <button onClick={() => openEditModal(project, 'project')} className="p-2 text-slate hover:text-blue-600 bg-gray-50 rounded-lg"><ICONS.Edit className="w-4 h-4" /></button>
                         <button onClick={() => handleDelete('project', project.id)} className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded-lg"><ICONS.Trash className="w-4 h-4" /></button>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          )}

          {activeTab === 'insights' && currentList.length > 0 && (
            <div className="space-y-3">
              {currentList.map(insight => (
                <div key={insight.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:border-navy/30 transition">
                  <div className="flex items-center gap-4">
                    <img src={getImageUrl(insight)} className="h-12 w-12 rounded-lg object-cover" alt="" />
                    <div>
                      <h3 className="font-bold text-navy">{insight.title}</h3>
                      <p className="text-xs text-slate">{insight.date} • {insight.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(insight, 'insight')} className="p-2 text-slate hover:text-blue-600"><ICONS.Edit className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete('insight', insight.id)} className="p-2 text-slate hover:text-red-600"><ICONS.Trash className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'users' && currentList.length > 0 && (
             <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs uppercase text-slate font-semibold">
                    <tr><th className="p-4">Name</th><th className="p-4">Role</th><th className="p-4">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentList.map(u => (
                      <tr key={u.uid || u.id}> {/* Use UID for Firebase users */}
                        <td className="p-4 font-medium text-navy">{u.name}<br/><span className="text-xs text-slate font-normal">{u.email}</span></td>
                        <td className="p-4 text-sm">{u.role}</td>
                        <td className="p-4"><button onClick={() => navigate(`/profile?userId=${u.uid || u.id}`)} className="text-indigo-600 text-sm font-bold">View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}
          
          {/* NOTE: Verifications tab data is currently empty/mocked as API calls weren't created */}

        </motion.div>
      )}

      {/* --- UNIVERSAL MODAL (Uses handleSaveItem logic) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-navy">{isEditing ? 'Edit' : 'Add New'} {modalType === 'project' ? 'Project' : modalType === 'insight' ? 'Insight' : 'Listing'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><ICONS.X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4">
                {/* Project Fields */}
                {modalType === 'project' && (
                  <>
                    <input required placeholder="Project Name" value={newItem.name || ''} className="w-full p-3 rounded-xl border" onChange={e => setNewItem({...newItem, name: e.target.value})} />
                    <input required placeholder="Developer" value={newItem.developer || ''} className="w-full p-3 rounded-xl border" onChange={e => setNewItem({...newItem, developer: e.target.value})} />
                    <div className="flex gap-2">
                       <input required placeholder="City" value={newItem.city || ''} className="w-1/2 p-3 rounded-xl border" onChange={e => setNewItem({...newItem, city: e.target.value})} />
                       <input required placeholder="Locality" value={newItem.locality || ''} className="w-1/2 p-3 rounded-xl border" onChange={e => setNewItem({...newItem, locality: e.target.value})} />
                    </div>
                    <input required placeholder="Image URL" value={newItem.image || ''} className="w-full p-3 rounded-xl border" onChange={e => setNewItem({...newItem, image: e.target.value})} />
                    <select className="w-full p-3 rounded-xl border" value={newItem.status || 'New Launch'} onChange={e => setNewItem({...newItem, status: e.target.value})}>
                      <option value="New Launch">New Launch</option>
                      <option value="Under Construction">Under Construction</option>
                      <option value="Ready to Move">Ready to Move</option>
                    </select>
                  </>
                )}

                {/* Insight Fields */}
                {modalType === 'insight' && (
                  <>
                     <input required placeholder="Article Title" value={newItem.title || ''} className="w-full p-3 rounded-xl border" onChange={e => setNewItem({...newItem, title: e.target.value})} />
                     <input required placeholder="Category" value={newItem.category || ''} className="w-full p-3 rounded-xl border" onChange={e => setNewItem({...newItem, category: e.target.value})} />
                     <textarea required placeholder="Excerpt..." value={newItem.excerpt || ''} className="w-full p-3 rounded-xl border" rows="3" onChange={e => setNewItem({...newItem, excerpt: e.target.value})} />
                  </>
                )}

                {/* Listing Fields (Edit Only) */}
                {modalType === 'listing' && (
                  <>
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-navy">Basic Info</label>
                        <input required placeholder="Title" value={newItem.title || ''} className="w-full p-3 rounded-xl border" onChange={e => setNewItem({...newItem, title: e.target.value})} />
                        
                        <div className="flex gap-2">
                             <input placeholder="Price" type="number" value={newItem.price || ''} className="w-1/2 p-3 rounded-xl border" onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} />
                             <input placeholder="Rent (Optional)" type="number" value={newItem.rent || ''} className="w-1/2 p-3 rounded-xl border" onChange={e => setNewItem({...newItem, rent: Number(e.target.value)})} />
                        </div>

                        <label className="block text-sm font-semibold text-navy pt-2">Status & Photos</label>
                        <select className="w-full p-3 rounded-xl border mb-2" value={newItem.status || 'published'} onChange={e => setNewItem({...newItem, status: e.target.value})}>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="sold">Sold</option>
                        </select>
                        
                        <textarea 
                            placeholder="Image URLs (Separated by comma)" 
                            value={newItem.imageString || ''} 
                            className="w-full p-3 rounded-xl border h-24 text-sm font-mono" 
                            onChange={e => setNewItem({...newItem, imageString: e.target.value})} 
                        />
                        <p className="text-xs text-slate">Paste URLs separated by commas. (Note: Actual image upload/deletion requires Cloud Storage management, this only updates Firestore URLs).</p>
                    </div>
                  </>
                )}
                
                <button type="submit" className="w-full bg-navy text-white py-4 rounded-xl font-bold text-lg hover:bg-navy/90 transition">
                  {isEditing ? 'Save Changes' : 'Create'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;