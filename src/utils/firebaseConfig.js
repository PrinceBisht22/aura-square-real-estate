// src/utils/firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app'; 
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyBvPImFJTx3tihgVGJEAFHt8ltn78FDuDs",
  authDomain: "aura-square-in.firebaseapp.com",
  projectId: "aura-square-in",
  storageBucket: "aura-square-in.firebasestorage.app", 
  messagingSenderId: "332210033140",
  appId: "1:332210033140:web:3ba7140dcee8894d55a9a1",
  measurementId: "G-JRBMW71JK7"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp(); 
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); 

export { auth, db, storage, app };