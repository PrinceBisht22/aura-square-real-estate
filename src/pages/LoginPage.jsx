// src/pages/LoginPage.jsx (Firebase Integrated)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ICONS } from '../components/icons.jsx';

// 💡 NEW: Import the useAuth hook (replaces old auth and session managers)
import { useAuth } from '../context/AuthContext'; 

const LoginPage = () => {
  const { login, googleLogin, loading: authLoading } = useAuth(); // Get auth functions
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      // 💡 Use the login function from AuthContext (Firebase)
      await login(email, password);
      // Successful login handled by AuthContext listener, redirects automatically
      navigate('/profile'); 
    } catch (err) {
      // Firebase errors (e.g., 'auth/user-not-found') are handled here
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError('Failed to log in. Please check your credentials.');
        console.error(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
        // 💡 Use the googleLogin function from AuthContext (Firebase)
        await googleLogin();
        navigate('/profile');
    } catch (err) {
        setError('Failed to log in with Google.');
        console.error(err);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="site-container py-16 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl border border-gray-100">
        <h1 className="text-3xl font-display font-semibold text-navy mb-2">Welcome Back</h1>
        <p className="text-slate mb-8">Sign in to manage your listings and profile.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate/20 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none text-navy font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate/20 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none text-navy font-medium"
            />
            <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline mt-2 block text-right">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || authLoading}
            className="w-full bg-navy text-white font-bold py-3.5 rounded-xl hover:bg-blue-900 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting || authLoading ? <ICONS.Loader className="w-5 h-5 animate-spin" /> : 'Log In'}
          </button>
        </form>
        
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-slate/20"></div>
          <span className="px-3 text-slate text-sm">OR</span>
          <div className="flex-1 border-t border-slate/20"></div>
        </div>

        <button
          onClick={handleGoogleSubmit}
          disabled={isSubmitting || authLoading}
          className="w-full border border-slate/20 text-navy font-bold py-3.5 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ICONS.Google className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-slate">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;