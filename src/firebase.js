// src/firebase.js (CORRECTED FINAL VERSION)

// 💡 Import additional functions for the safety check
import { initializeApp, getApps, getApp } from "firebase/app"; 
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

// 1. Your Web App's Firebase configuration (This is your config from the console)
const firebaseConfig = {
  apiKey: "AIzaSyBvPIMJFx3tihgV6JEAFHt8ltn78FDuDs",
  authDomain: "aura-square-in.firebaseapp.com",
  projectId: "aura-square-in",
  storageBucket: "aura-square-in.appspot.com", 
  messagingSenderId: "332210033140",
  appId: "1:332210033140:web:3ba7140dcee8894d55a9a1",
  measurementId: "G-JRBMW71JK7"
};

// 2. CHECK IF APP IS ALREADY INITIALIZED
// If no apps exist, initialize the default app. Otherwise, get the existing default app.
const app = !getApps().length 
  ? initializeApp(firebaseConfig) 
  : getApp(); 

// 3. Initialize Firebase Services using the 'app' instance
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); 

// 4. Export the services 
export { auth, db, storage, app };