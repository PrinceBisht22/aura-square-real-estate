// src/components/common/PrivateRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Assuming react-router-dom v6+
import { useAuth } from '../context/AuthContext'; // Adjust path based on where you put it

// A component to protect routes
const PrivateRoute = () => {
  // Use the loading state from your Context to wait for the Firebase check
  const { currentUser, loading } = useAuth();
  
  // 1. Wait until the initial check is complete
  if (loading) {
    // Renders a loading message or a spinner while the session is being checked
    return <div style={{textAlign: 'center', padding: '50px'}}>Checking session...</div>; 
  }
  
  // 2. Check Authentication status
  // If currentUser is NOT null, render the nested route content (<Outlet />)
  // Otherwise, redirect to the login page
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;