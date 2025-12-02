import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// If you use storage for property images/assets
import { getStorage } from "firebase/storage"; 

// 1. Your Web App's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvPIMJFx3tihgV6JEAFHt8ltn78FDuDs",
  authDomain: "aura-square-in.firebaseapp.com",
  projectId: "aura-square-in",
  storageBucket: "aura-square-in.appspot.com", // Corrected bucket format for better SDK compatibility
  messagingSenderId: "332210033140",
  appId: "1:332210033140:web:3ba7140dcee8894d55a9a1",
  measurementId: "G-JRBMW71JK7"
};

// 2. Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 3. Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // For property images

// 4. Export the services to be used across your application
export { auth, db, storage, app };