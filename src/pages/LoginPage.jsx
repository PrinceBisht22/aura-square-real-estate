import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { ICONS } from '../components/icons.jsx';
import { saveUserSession } from '../utils/auth.js';
import { handleOAuthSignup } from '../utils/oauth.js';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login (in production, this would be an API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (form.email && form.password) {
      // LOGIC CHANGE: Check if the email is the admin email
      const isAdmin = form.email.toLowerCase() === 'admin@aurasquare.com';
      
      saveUserSession({
        id: isAdmin ? 'admin_user' : `user_${Date.now()}`,
        email: form.email,
        name: isAdmin ? 'Admin User' : form.email.split('@')[0],
        picture: null,
        provider: 'email',
        // Assign 'admin' role if email matches, otherwise 'buyer'
        role: isAdmin ? 'admin' : 'buyer', 
      });
      
      navigate('/');
      window.location.reload(); // Refresh to update header
    } else {
      setError('Please enter email and password');
    }
    setIsLoading(false);
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const userInfo = await handleOAuthSignup('google', tokenResponse);
      if (userInfo) {
        saveUserSession(userInfo);
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  const handleAppleClick = () => {
    const appleClientId = import.meta.env.VITE_APPLE_CLIENT_ID;
    if (!appleClientId) {
      setError('Apple Sign In is not configured. Please contact support or use email login.');
      return;
    }
    setError('Apple Sign In requires server-side setup. Please use Google or email login.');
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('Google sign-in failed. Please try again.'),
  });

  return (
    <div className="site-container flex min-h-[70vh] flex-col justify-center py-16">
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-3xl bg-white p-8 shadow-card">
          <h1 className="text-3xl font-display font-semibold text-navy">Log in</h1>
          <p className="mt-2 text-sm text-slate">
            Access saved searches, shortlist projects, and manage leads.
          </p>

          <button
            onClick={() => login()}
            className="mt-6 w-full rounded-2xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-navy shadow-sm transition hover:border-gray-400 hover:shadow-md flex items-center justify-center gap-3"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            onClick={handleAppleClick}
            className="w-full rounded-2xl border-2 border-gray-300 bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 hover:shadow-md flex items-center justify-center gap-3"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.46 4.5-3.74 4.25z" />
            </svg>
            Continue with Apple
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-500 uppercase">or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-red-800 text-sm">
                {error}
              </div>
            )}
            <label className="block space-y-2 text-sm font-semibold text-slate">
              Email
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-2xl border border-slate/20 px-4 py-3 font-medium text-navy transition focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                placeholder="admin@aurasquare.com"
              />
            </label>
            <label className="block space-y-2 text-sm font-semibold text-slate">
              Password
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-2xl border border-slate/20 px-4 py-3 font-medium text-navy transition focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                placeholder="Enter your password"
              />
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-navy to-indigo px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  {ICONS.Loader && <ICONS.Loader className="h-4 w-4 animate-spin" />}
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate">
            Don't have an account?{' '}
            <NavLink to="/signup" className="font-semibold text-indigo hover:underline">
              Sign up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;