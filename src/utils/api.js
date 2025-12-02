// src/utils/api.js (FINAL COMPREHENSIVE VERSION)

import { db, auth, storage } from "./firebaseConfig";
import { 
  doc, getDoc, updateDoc, collection, addDoc, 
  query, where, getDocs, deleteDoc, arrayUnion, arrayRemove
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- UTILITY: Simulate API call with delay ---
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- UTILITY: Generic Data Fetching Functions ---

const fetchCollectionData = async (collectionName, filters = []) => {
  let colRef = collection(db, collectionName);
  let q = colRef;
  
  if (filters.length > 0) {
    q = query(colRef, ...filters.map(([field, op, val]) => where(field, op, val)));
  }

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching data from ${collectionName}:`, error);
    throw error;
  }
};

const fetchSingleDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching document from ${collectionName}:`, error);
    throw error;
  }
};

// --- CORE LISTING & DETAIL FETCHING ---

export const getResidentialListings = () => fetchCollectionData("listings", [["propertyType", "in", ["Apartment", "Villa", "Builder Floor"]]]);
export const getCommercialListings = () => fetchCollectionData("listings", [["propertyType", "==", "Commercial"]]);
export const getPlots = () => fetchCollectionData("listings", [["propertyType", "==", "Plot"]]);
export const getProjects = () => fetchCollectionData("projects");
export const getTestimonials = () => fetchCollectionData("testimonials");
export const getInsights = () => fetchCollectionData("insights");

export const getListingDetails = (id) => fetchSingleDocument("listings", id);
export const getProjectDetails = (id) => fetchSingleDocument("projects", id);

// --- USER MANAGEMENT (Profile & My Listings) ---

export const getUserProfileData = async (uid) => fetchSingleDocument("users", uid);

export const updateProfile = async (uid, data) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const getMyListings = async (uid) => {
  if (!uid) throw new Error("User ID is required to fetch listings.");
  try {
    const listingsRef = collection(db, "listings"); 
    const q = query(listingsRef, where("postedBy", "==", uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching user listings:", error);
    throw error;
  }
};

export const updateListingStatus = async (listingId, data) => {
  try {
    const listingRef = doc(db, "listings", listingId);
    // Allows updating status, featured, or any other field passed in 'data'
    await updateDoc(listingRef, data); 
    return { success: true };
  } catch (error) {
    console.error("Error updating listing status:", error);
    throw error;
  }
};

export const deleteListing = async (listingId) => {
  try {
    const listingRef = doc(db, "listings", listingId);
    await deleteDoc(listingRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
};

// --- USER INTERACTIVITY (Favorites & Reviews) ---

export const getFavoriteIds = async (uid) => {
  if (!uid) return [];
  try {
    const docRef = doc(db, "favorites", uid); 
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().listingIds) {
      return docSnap.data().listingIds; 
    }
    return [];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

export const addFavorite = async (uid, listingId) => {
  if (!uid) throw new Error("User must be logged in.");
  try {
    const docRef = doc(db, "favorites", uid);
    await setDoc(docRef, { listingIds: arrayUnion(listingId) }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
};

export const removeFavorite = async (uid, listingId) => {
  if (!uid) throw new Error("User must be logged in.");
  try {
    const docRef = doc(db, "favorites", uid);
    await updateDoc(docRef, { listingIds: arrayRemove(listingId) });
    return { success: true };
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
};

export const getAllReviews = () => fetchCollectionData("reviews");

export const submitReview = async (formData, userId, userName) => {
  if (!userId) throw new Error("User must be logged in to submit a review.");

  try {
    const reviewData = {
      ...formData,
      userId: userId,
      user: userName,
      date: new Date().toISOString(),
      status: 'pending', 
      rating: Number(formData.rating) // Ensure rating is a number
    };
    await addDoc(collection(db, "reviews"), reviewData);
    return { success: true, message: 'Review submitted successfully! Pending approval.' };
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

// --- FILE UPLOAD TO STORAGE ---

const uploadListingImages = async (photos, userId, listingId) => {
    const urls = [];
    
    for (const photoWrapper of photos) {
        const file = photoWrapper.file;
        const storageRef = ref(
            storage, 
            `listings/${userId}/${listingId}/${Date.now()}_${file.name}`
        );
        
        const uploadResult = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(uploadResult.ref);
        
        urls.push({ url, fileName: file.name });
    }
    return urls;
};

// --- FORM SUBMISSION & POSTING ---

export const submitContactForm = async (formData) => {
  await delay(1000); 
  try {
    const submissionData = { ...formData, timestamp: new Date().toISOString(), status: 'new' };
    await addDoc(collection(db, "contactSubmissions"), submissionData);
    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    console.error("Firebase Contact Submission Error:", error);
    throw new Error('Failed to submit message. Please try again later.');
  }
};

export const submitProperty = async (formData) => {
  await delay(1500);
  
  const userId = auth.currentUser?.uid; 
  if (!userId) throw new Error("User must be logged in to post a property.");

  const { photos, amenities, ...restOfData } = formData;
  
  const submissionData = {
      ...restOfData,
      postedBy: userId,
      amenities: amenities ? amenities.split(',').map(a => a.trim()).filter(a => a) : [], 
      timestamp: new Date().toISOString(),
      status: 'pending', 
      photoCount: photos.length,
  };

  let docRef;
  try {
      docRef = await addDoc(collection(db, "listings"), submissionData);
  } catch (error) {
      console.error("Firebase Text Submission Error:", error);
      throw new Error('Failed to submit listing text data.');
  }

  const uploadedUrls = await uploadListingImages(photos, userId, docRef.id);

  try {
      await updateDoc(doc(db, "listings", docRef.id), {
          photos: uploadedUrls,
          mainImage: uploadedUrls[0]?.url || null,
      });
      
      return { success: true, message: 'Property submitted successfully! Pending review.', listingId: docRef.id };
  } catch (error) {
      console.error("Firebase Image Update Error:", error);
      throw new Error('Listing submitted, but failed to save images correctly.');
  }
};

export const submitNewsletter = async (email) => {
  await delay(800);
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email address');
  }
  
  try {
    const q = query(collection(db, "newsletterSubscribers"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Email already subscribed');
    }
    
    const subscriberData = { email, subscribedAt: new Date().toISOString(), status: 'active' };
    await addDoc(collection(db, "newsletterSubscribers"), subscriberData);
    
    return { success: true, message: 'Successfully subscribed to newsletter!' };
  } catch (error) {
    if (error.message.includes('already subscribed')) { throw error; }
    console.error("Firebase Newsletter Submission Error:", error);
    throw new Error('Failed to subscribe. Please try again later.');
  }
};

// --- ADMIN & MODERATION FUNCTIONS ---

export const getAllUsers = () => fetchCollectionData("users");
export const getAllListings = () => fetchCollectionData("listings");
export const getAllProjects = () => fetchCollectionData("projects");
export const getAllInsights = () => fetchCollectionData("insights");

export const deleteInsight = async (id) => {
  try {
    const docRef = doc(db, "insights", id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting insight:", error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const docRef = doc(db, "projects", id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

// --- CHATBOT/FAQ (Retained for completeness) ---

export const chatWithAI = async (message, conversationHistory = []) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) { return getFAQResponse(message, conversationHistory); }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [ { role: 'system', content: 'You are a helpful real estate assistant...' }, ...conversationHistory, { role: 'user', content: message } ],
        max_tokens: 150, temperature: 0.7,
      }),
    });
    if (!response.ok) { throw new Error('API request failed'); }
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI API error:', error);
    return getFAQResponse(message, conversationHistory);
  }
};

const getFAQResponse = (message, history) => {
  const faqData = {
    greeting: ["Hello! I'm here to help you...", "Hi! Welcome to Aura Square..."],
    search: ["You can search for properties...", "To search properties..."],
    calculator: ["We have several calculators...", "Visit the Tools page..."],
    contact: ["You can contact us through...", "Reach out to us via..."],
    price: ["Property prices vary...", "Prices depend on location..."],
    default: ["I understand you're asking about that...", "That's a great question! I can help you..."],
  };
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.match(/hi|hello|hey|greetings/)) { return faqData.greeting[Math.floor(Math.random() * faqData.greeting.length)]; }
  if (lowerMessage.match(/search|find|property|buy|rent|listing/)) { return faqData.search[Math.floor(Math.random() * faqData.search.length)]; }
  if (lowerMessage.match(/calculator|emi|loan|budget|eligibility|calculate/)) { return faqData.calculator[Math.floor(Math.random() * faqData.calculator.length)]; }
  if (lowerMessage.match(/contact|support|help|email|phone|call/)) { return faqData.contact[Math.floor(Math.random() * faqData.contact.length)]; }
  if (lowerMessage.match(/price|cost|afford|budget/)) { return faqData.price[Math.floor(Math.random() * faqData.price.length)]; }
  return faqData.default[Math.floor(Math.random() * faqData.default.length)];
};