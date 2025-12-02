import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged, // Crucial for session management
} from "firebase/auth";
import { auth, db } from "./firebaseConfig"; // Import the initialized auth and firestore services
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore utilities

// --- UTILITY: Create or Update User Document in Firestore ---
// This function runs immediately after a user registers or logs in.
// It ensures every user has an entry in your 'users' collection with default data.
const createUserProfile = async (user, isNewUser = false) => {
  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);

  if (userSnapshot.exists()) {
    // User exists: Update last login
    await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
  } else if (isNewUser) {
    // New user: Create a new profile document
    const defaultData = {
      email: user.email,
      role: 'buyer', // Default role for new users
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      listings: [], // Initialize favorites or listings array
    };
    await setDoc(userRef, defaultData, { merge: true });
  }
};


// --- AUTHENTICATION FUNCTIONS ---

// 1. Function to Register a New User
export const registerUser = async (email, password, additionalData = {}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // After creation, set up the user profile in Firestore
    await createUserProfile(userCredential.user, true); 
    
    return userCredential.user;
  } catch (error) {
    console.error("Registration Error:", error.message);
    throw error;
  }
};

// 2. Function to Log In an Existing User
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // After login, update lastLogin time in Firestore
    await createUserProfile(userCredential.user, false);
    
    return userCredential.user;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

// 3. Function to Log Out the Current User
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error.message);
    throw error;
  }
};

// 4. Session Listener (Crucial for AuthContext)
export const onAuthChange = (callback) => {
  // onAuthStateChanged is the Firebase way to track the current user's session
  return onAuthStateChanged(auth, callback);
};

// --- DEPRECATED/REPLACED FUNCTIONS ---
// These are no longer needed as Firebase handles the session
export const isAuthenticated = () => { console.warn("Use Firebase listener in AuthContext instead of isAuthenticated()"); return !!auth.currentUser; };
export const getCurrentUser = () => auth.currentUser;