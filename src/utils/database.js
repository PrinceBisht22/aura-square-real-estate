// Database utilities - localStorage-based for development
// In production, replace with actual API calls

// User roles
export const ROLES = {
  BUYER: 'buyer',
  DEALER: 'dealer',
  ADMIN: 'admin',
};

// Listing statuses
export const LISTING_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  REMOVED: 'removed',
};

// Get all users
export const getUsers = () => {
  const users = JSON.parse(localStorage.getItem('db_users') || '[]');
  return users;
};

// Get user by ID
export const getUserById = (id) => {
  const users = getUsers();
  return users.find((u) => u.id === id);
};

// Get current user
export const getCurrentUser = () => {
  const userData = localStorage.getItem('user');
  if (!userData) return null;
  const user = JSON.parse(userData);
  // Merge with database user if exists
  const dbUser = getUserById(user.id);
  return dbUser || user;
};

// Update user
export const updateUser = (userId, updates) => {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    // Create new user
    users.push({
      id: userId,
      ...updates,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });
  } else {
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
  }
  localStorage.setItem('db_users', JSON.stringify(users));
  return users[index];
};

// Get listings
export const getListings = (filters = {}) => {
  const listings = JSON.parse(localStorage.getItem('db_listings') || '[]');
  let filtered = [...listings];

  if (filters.ownerId) {
    filtered = filtered.filter((l) => l.ownerId === filters.ownerId);
  }
  if (filters.status) {
    filtered = filtered.filter((l) => l.status === filters.status);
  }
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(search) ||
        l.description?.toLowerCase().includes(search) ||
        l.location?.toLowerCase().includes(search),
    );
  }

  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Get listing by ID
export const getListingById = (id) => {
  const listings = getListings();
  return listings.find((l) => l.id === id);
};

// Create listing
export const createListing = (listingData) => {
  const listings = getListings();
  const newListing = {
    id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...listingData,
    status: listingData.status || LISTING_STATUS.DRAFT,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    leads: 0,
    photos: listingData.photos || [],
  };
  listings.push(newListing);
  localStorage.setItem('db_listings', JSON.stringify(listings));
  return newListing;
};

// Update listing
export const updateListing = (listingId, updates) => {
  const listings = getListings();
  const index = listings.findIndex((l) => l.id === listingId);
  if (index === -1) return null;
  listings[index] = {
    ...listings[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem('db_listings', JSON.stringify(listings));
  return listings[index];
};

// Delete listing
export const deleteListing = (listingId) => {
  const listings = getListings();
  const filtered = listings.filter((l) => l.id !== listingId);
  localStorage.setItem('db_listings', JSON.stringify(filtered));
  return true;
};

// Favorites
export const getFavorites = (userId) => {
  const favorites = JSON.parse(localStorage.getItem('db_favorites') || '[]');
  return favorites.filter((f) => f.userId === userId);
};

export const addFavorite = (userId, listingId) => {
  const favorites = JSON.parse(localStorage.getItem('db_favorites') || '[]');
  if (favorites.find((f) => f.userId === userId && f.listingId === listingId)) {
    return null; // Already favorited
  }
  const favorite = {
    id: `fav_${Date.now()}`,
    userId,
    listingId,
    createdAt: new Date().toISOString(),
  };
  favorites.push(favorite);
  localStorage.setItem('db_favorites', JSON.stringify(favorites));
  return favorite;
};

export const removeFavorite = (userId, listingId) => {
  const favorites = JSON.parse(localStorage.getItem('db_favorites') || '[]');
  const filtered = favorites.filter(
    (f) => !(f.userId === userId && f.listingId === listingId),
  );
  localStorage.setItem('db_favorites', JSON.stringify(filtered));
  return true;
};

// Messages
export const getMessages = (userId) => {
  const messages = JSON.parse(localStorage.getItem('db_messages') || '[]');
  return messages
    .filter((m) => m.toUserId === userId || m.fromUserId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createMessage = (messageData) => {
  const messages = JSON.parse(localStorage.getItem('db_messages') || '[]');
  const newMessage = {
    id: `msg_${Date.now()}`,
    ...messageData,
    read: false,
    createdAt: new Date().toISOString(),
  };
  messages.push(newMessage);
  localStorage.setItem('db_messages', JSON.stringify(messages));
  return newMessage;
};

// Saved searches
export const getSavedSearches = (userId) => {
  const searches = JSON.parse(localStorage.getItem('db_saved_searches') || '[]');
  return searches.filter((s) => s.userId === userId);
};

export const saveSearch = (userId, searchData) => {
  const searches = JSON.parse(localStorage.getItem('db_saved_searches') || '[]');
  const newSearch = {
    id: `search_${Date.now()}`,
    userId,
    ...searchData,
    createdAt: new Date().toISOString(),
  };
  searches.push(newSearch);
  localStorage.setItem('db_saved_searches', JSON.stringify(searches));
  return newSearch;
};

// Admin functions
export const getAllUsersForAdmin = () => {
  return getUsers();
};

export const updateUserRole = (userId, role) => {
  return updateUser(userId, { role });
};

export const getAllListingsForAdmin = () => {
  return getListings();
};

// Dealer verification
export const getDealerVerification = (dealerId) => {
  const verifications = JSON.parse(localStorage.getItem('db_dealer_verifications') || '[]');
  return verifications.find((v) => v.dealerId === dealerId);
};

export const submitDealerVerification = (dealerId, docs) => {
  const verifications = JSON.parse(localStorage.getItem('db_dealer_verifications') || '[]');
  const existing = verifications.findIndex((v) => v.dealerId === dealerId);
  const verification = {
    dealerId,
    docs,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };
  if (existing >= 0) {
    verifications[existing] = verification;
  } else {
    verifications.push(verification);
  }
  localStorage.setItem('db_dealer_verifications', JSON.stringify(verifications));
  return verification;
};

export const approveDealerVerification = (dealerId) => {
  const verifications = JSON.parse(localStorage.getItem('db_dealer_verifications') || '[]');
  const verification = verifications.find((v) => v.dealerId === dealerId);
  if (verification) {
    verification.status = 'approved';
    verification.approvedAt = new Date().toISOString();
    updateUser(dealerId, { verified: true });
    localStorage.setItem('db_dealer_verifications', JSON.stringify(verifications));
  }
  return verification;
};

// Analytics
export const getListingStats = (listingId) => {
  const listing = getListingById(listingId);
  if (!listing) return null;
  return {
    views: listing.views || 0,
    leads: listing.leads || 0,
    favorites: getFavorites(null).filter((f) => f.listingId === listingId).length,
    messages: getMessages(null).filter((m) => m.listingId === listingId).length,
  };
};

export const incrementListingViews = (listingId) => {
  const listing = getListingById(listingId);
  if (listing) {
    listing.views = (listing.views || 0) + 1;
    updateListing(listingId, { views: listing.views });
  }
};

export const incrementListingLeads = (listingId) => {
  const listing = getListingById(listingId);
  if (listing) {
    listing.leads = (listing.leads || 0) + 1;
    updateListing(listingId, { leads: listing.leads });
  }
};

