// src/pages/SignupPage.jsx (Firebase Integrated)
import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ICONS } from '../components/icons.jsx';

// REMOVED: import { saveUserSession } from '../utils/auth.js';
// REMOVED: Mock API functions (sendOtpAPI, verifyOtpAPI)
// 💡 NEW: Import the useAuth hook
import { useAuth } from '../context/AuthContext'; 

const SignupPage = () => {
  // Get Firebase signup/login functions and auth state
  const { signup, googleLogin, loading: authLoading } = useAuth(); 
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('buyer'); // default
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- HANDLERS ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 💡 Use the Firebase signup function from AuthContext
      // AuthContext handles creating the Firebase user AND the Firestore profile document.
      await signup(email, password, name, role); 
      
      // Successful signup triggers AuthContext listener, handles redirect automatically
      alert('Account created successfully! Redirecting to profile...');
      navigate('/profile'); 
    } catch (err) {
      // Handle common Firebase errors
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak (min 6 characters).');
      } else {
        setError('Failed to create account. Please try again.');
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
        // 💡 Use the Firebase googleLogin function from AuthContext
        await googleLogin();
        // Successful login handled by AuthContext listener
        navigate('/profile');
    } catch (err) {
        setError('Failed to sign up with Google. Ensure popups are allowed.');
        console.error(err);
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <div className="site-container py-16 flex items-center justify-center min-h-[80vh]">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-2xl border border-gray-100 transition-all duration-300">
          
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-display font-semibold text-navy">Create Your Account</h1>
            <p className="mt-2 text-sm text-slate">Join Aura Square to post your property or save favorites.</p>
          </div>

          {/* Google Signup Button */}
          <div className="mb-6 space-y-3">
            <button
              onClick={handleGoogleSubmit}
              disabled={isSubmitting || authLoading}
              className="w-full rounded-2xl border-2 border-gray-100 bg-white px-6 py-3 text-sm font-semibold text-navy shadow-sm transition hover:border-gray-200 hover:shadow-md flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <ICONS.Google className="w-5 h-5" />
              Sign Up with Google
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-slate uppercase text-xs">Or continue with email</span>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl mb-4">{error}</div>}

          {/* Email/Password Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <label className="block space-y-2 text-sm font-semibold text-slate">
              Full Name
              <input
                type="text"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate/20 px-4 py-3 font-medium text-navy transition focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                placeholder="John Doe"
              />
            </label>

            <label className="block space-y-2 text-sm font-semibold text-slate">
              Email Address
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate/20 px-4 py-3 font-medium text-navy transition focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                placeholder="name@example.com"
              />
            </label>
            
            <label className="block space-y-2 text-sm font-semibold text-slate">
              Password (Min 6 Characters)
              <input
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate/20 px-4 py-3 font-medium text-navy transition focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              />
            </label>

            <div className="space-y-2 pt-2">
              <label className="block text-sm font-semibold text-slate">I am signing up as a...</label>
              <div className="grid grid-cols-2 gap-3">
                {['Buyer', 'Broker'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r.toLowerCase())}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      role === r.toLowerCase()
                        ? 'border-navy bg-navy text-white shadow-md'
                        : 'border-slate/20 bg-white text-slate hover:border-navy/50'
                    }`}
                  >
                    {r === 'Broker' ? 'Dealer/Broker' : 'Buyer/Renter'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || authLoading || password.length < 6 || !email || !name}
              className="w-full rounded-2xl bg-gradient-to-r from-navy to-indigo px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:from-navy/90 hover:to-indigo/90 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting || authLoading ? (
                <>
                   <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                   Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate">
            Already have an account?{' '}
            <NavLink to="/login" className="font-semibold text-indigo hover:underline">
              Log in
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;