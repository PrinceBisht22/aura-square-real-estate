import React, { useContext, useState, useEffect } from "react";
import { auth, db, googleProvider } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; 

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 1. SIGN UP LOGIC ---
  async function signup(email, password, name, role) {
    // A. Create the Account in Authentication
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // B. Create the Profile in Database
    // We use the UID (User ID) to name the document so it's easy to find later
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      role: role, // Important: 'buyer', 'dealer', or 'admin'
      createdAt: new Date().toISOString()
    });

    return user;
  }

  // --- 2. LOGIN LOGIC ---
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // --- 3. GOOGLE LOGIC ---
  async function googleLogin() {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user already exists in DB
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    // If new user, save them as a 'buyer' by default
    if (!docSnap.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role: "buyer",
        avatar: user.photoURL,
        createdAt: new Date().toISOString()
      });
    }
    return user;
  }

  function logout() {
    return signOut(auth);
  }

  // Monitor User State (Keeps you logged in on refresh)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get extra data (Role, Name) from Database
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()) {
            setCurrentUser({ ...user, ...docSnap.data() });
        } else {
            setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    googleLogin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}