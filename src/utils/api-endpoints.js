// utils/api-endpoints.js

import {
  getUserById,
  updateUser,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getFavorites,
  addFavorite,
  removeFavorite,
  getMessages,
  createMessage,
  getSavedSearches,
  saveSearch,
  getAllUsersForAdmin,
  approveDealerVerification,
  getListingStats,
  incrementListingViews,
} from './database.js';
import { getUserSession } from './auth.js';

// Import Data
import { residentialListings } from '../data/residentialListings.js';
import { commercialListings } from '../data/commercialListings.js';
import { plots } from '../data/plots.js';
import { projects as staticProjects } from '../data/projects.js';
import { insightsPosts as staticInsights } from '../data/insights.js'; 

const getCurrentUser = () => {
  const user = getUserSession();
  if (!user) return null;
  const dbUser = getUserById(user.id);
  return dbUser || user;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- HELPER: UNIFIED LISTINGS ---
const getUnifiedListings = () => {
  let storedListings = JSON.parse(localStorage.getItem('db_listings'));

  if (!storedListings || storedListings.length === 0) {
    // Add dummy ownerId to static data so it DOES NOT belong to Admin by default
    const processStatic = (list, type) => list.map(item => ({
      ...item,
      propertyType: item.propertyType || type,
      ownerId: 'static_user_123' 
    }));

    storedListings = [
      ...processStatic(residentialListings, 'Residential'), 
      ...processStatic(commercialListings, 'Commercial'), 
      ...processStatic(plots, 'Plot')
    ];
    localStorage.setItem('db_listings', JSON.stringify(storedListings));
  }
  return storedListings;
};

// --- AUTH ---
export const authAPI = {
  login: async (email, password) => {
    await delay(800);
    const users = JSON.parse(localStorage.getItem('db_users') || '[]');
    if(email === 'admin@aurasquare.com' && password === 'admin') {
       return { success: true, user: { id: 'admin_user', email, role: 'admin', name: 'Admin User' }};
    }
    const user = users.find((u) => u.email === email);
    if (user) return { success: true, user };
    throw new Error('Invalid credentials');
  },
  logout: async () => { await delay(200); return { success: true }; },
  refresh: async () => { await delay(300); return { success: true, user: getCurrentUser() }; },
};

// --- USER ---
export const userAPI = {
  getMe: async () => { await delay(300); return getCurrentUser(); },
  updateMe: async (updates) => { await delay(500); return updateUser(getCurrentUser().id, updates); },
  getUser: async (userId) => { await delay(300); const users = JSON.parse(localStorage.getItem('db_users') || '[]'); return users.find((u) => u.id === userId); },
};

// --- PUBLIC LISTINGS ---
export const listingAPI = {
  getListings: async (filters = {}) => {
    await delay(400);
    let all = getUnifiedListings();
    if (filters.ownerId) { all = all.filter(l => l.ownerId === filters.ownerId); }
    return all;
  },
  getListing: async (id) => { await delay(300); incrementListingViews(id); return getUnifiedListings().find(l => l.id === id); },
  createListing: async (listingData) => {
    await delay(800);
    const user = getCurrentUser();
    const all = getUnifiedListings();
    const newListing = { ...listingData, id: `NEW_${Date.now()}`, ownerId: user.id, datePosted: new Date().toISOString().split('T')[0], status: 'published' };
    all.unshift(newListing);
    localStorage.setItem('db_listings', JSON.stringify(all));
    return newListing;
  },
};

// --- ADMIN API ---
export const adminAPI = {
  getUsers: async () => { await delay(500); if (getCurrentUser()?.role !== 'admin') throw new Error('Unauthorized'); return getAllUsersForAdmin(); },
  
  // LISTINGS
  getListings: async () => { await delay(500); return getUnifiedListings(); },
  deleteListing: async (id) => {
    await delay(300);
    const all = getUnifiedListings();
    const filtered = all.filter(l => l.id !== id);
    localStorage.setItem('db_listings', JSON.stringify(filtered));
    return true;
  },
  toggleBoostListing: async (id) => {
    await delay(300);
    const all = getUnifiedListings();
    const index = all.findIndex(l => l.id === id);
    if (index !== -1) {
      all[index].featured = !all[index].featured;
      localStorage.setItem('db_listings', JSON.stringify(all));
      return all[index].featured;
    }
    return false;
  },
  updateListing: async (id, updates) => {
    await delay(400);
    const all = getUnifiedListings();
    const index = all.findIndex(l => l.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...updates };
      localStorage.setItem('db_listings', JSON.stringify(all));
      return all[index];
    }
    return null;
  },

  // PROJECTS
  getProjects: async () => {
    await delay(400);
    let stored = JSON.parse(localStorage.getItem('db_projects'));
    if (!stored || stored.length === 0) { stored = staticProjects; localStorage.setItem('db_projects', JSON.stringify(stored)); }
    return stored;
  },
  addProject: async (projectData) => {
    await delay(500);
    const stored = JSON.parse(localStorage.getItem('db_projects') || '[]');
    const newProject = { id: `PROJ_${Date.now()}`, image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg', ...projectData };
    stored.unshift(newProject);
    localStorage.setItem('db_projects', JSON.stringify(stored));
    return newProject;
  },
  updateProject: async (id, updates) => {
    await delay(400);
    const stored = JSON.parse(localStorage.getItem('db_projects') || '[]');
    const index = stored.findIndex(p => p.id === id);
    if (index !== -1) {
      stored[index] = { ...stored[index], ...updates };
      localStorage.setItem('db_projects', JSON.stringify(stored));
      return stored[index];
    }
    return null;
  },
  deleteProject: async (id) => {
    await delay(300);
    const stored = JSON.parse(localStorage.getItem('db_projects') || '[]');
    const filtered = stored.filter(p => p.id !== id);
    localStorage.setItem('db_projects', JSON.stringify(filtered));
    return true;
  },

  // INSIGHTS
  getInsights: async () => {
    await delay(400);
    let stored = JSON.parse(localStorage.getItem('db_insights'));
    if (!stored || stored.length === 0) { stored = staticInsights || []; localStorage.setItem('db_insights', JSON.stringify(stored)); }
    return stored;
  },
  addInsight: async (insightData) => {
    await delay(500);
    const stored = JSON.parse(localStorage.getItem('db_insights') || '[]');
    const newInsight = { id: `INS_${Date.now()}`, date: new Date().toLocaleDateString(), ...insightData };
    stored.unshift(newInsight);
    localStorage.setItem('db_insights', JSON.stringify(stored));
    return newInsight;
  },
  updateInsight: async (id, updates) => {
    await delay(400);
    const stored = JSON.parse(localStorage.getItem('db_insights') || '[]');
    const index = stored.findIndex(i => i.id === id);
    if (index !== -1) {
      stored[index] = { ...stored[index], ...updates };
      localStorage.setItem('db_insights', JSON.stringify(stored));
      return stored[index];
    }
    return null;
  },
  deleteInsight: async (id) => {
    await delay(300);
    const stored = JSON.parse(localStorage.getItem('db_insights') || '[]');
    const filtered = stored.filter(i => i.id !== id);
    localStorage.setItem('db_insights', JSON.stringify(filtered));
    return true;
  },

  // DEALERS
  getDealerVerifications: async () => { await delay(500); return JSON.parse(localStorage.getItem('db_dealer_verifications') || '[]').filter((v) => v.status === 'pending'); },
  approveDealer: async (dealerId) => { await delay(600); return approveDealerVerification(dealerId); },
};

export const favoriteAPI = { getFavorites: async () => { return getFavorites(getCurrentUser()?.id); }, addFavorite: async (id) => { return addFavorite(getCurrentUser()?.id, id); }, removeFavorite: async (id) => { return removeFavorite(getCurrentUser()?.id, id); } };
export const messageAPI = { getMessages: async () => { return getMessages(getCurrentUser()?.id); }, sendMessage: async (data) => { return createMessage({ ...data, fromUserId: getCurrentUser()?.id }); } };
export const savedSearchAPI = { getSavedSearches: async () => { return getSavedSearches(getCurrentUser()?.id); }, saveSearch: async (data) => { return saveSearch(getCurrentUser()?.id, data); } };
export const analyticsAPI = { getListingStats: async (id) => { return getListingStats(id); } };