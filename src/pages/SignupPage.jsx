import React, { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { ICONS } from '../components/icons.jsx'; // Assuming this exists based on your code
import { saveUserSession } from '../utils/auth.js';
import { handleOAuthSignup } from '../utils/oauth.js';

// --- MOCK API FUNCTIONS (Replace these with your real Backend API calls) ---
const sendOtpAPI = async (phone) => {
  console.log(`Sending OTP to ${phone}...`);
  // Real code: await axios.post('/api/send-otp', { phone });
  return new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate 1.5s delay
};

const verifyOtpAPI = async (phone, otp) => {
  console.log(`Verifying OTP ${otp} for ${phone}...`);
  // Real code: await axios.post('/api/verify-otp', { phone, otp });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp === '1234') resolve(true); // Mock success for '1234'
      else reject(new Error('Invalid OTP'));
    }, 1500);
  });
};

const SignupPage = () => {
  const navigate = useNavigate();
  
  // State for multi-step flow
  const [step, setStep] = useState(1); // 1: Contact, 2: OTP, 3: Profile
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form Data
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    otp: '',
    name: '',
    role: 'buyer', // default
    photo: null,
    photoPreview: null
  });

  const fileInputRef = useRef(null);

  // --- HANDLERS ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: file,
          photoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // STEP 1: SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.phone) {
      setError('Please provide both email and phone number.');
      return;
    }
    
    // Basic phone validation (digits only, length check)
    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }

    setIsLoading(true);
    try {
      await sendOtpAPI(formData.phone);
      setStep(2); // Move to OTP step
    } catch (err) {
      setError('Failed to send OTP. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.otp) {
      setError('Please enter the OTP sent to your phone.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtpAPI(formData.phone, formData.otp);
      setStep(3); // Move to Profile step
    } catch (err) {
      setError('Invalid OTP. Please try "1234" for this demo.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3: COMPLETE PROFILE
  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name) {
      setError('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    // Simulate final API registration
    await new Promise(resolve => setTimeout(resolve, 1000));

    saveUserSession({
      id: `user_${Date.now()}`,
      email: formData.email,
      phone: formData.phone,
      name: formData.name,
      picture: formData.photoPreview, // storing base64 for demo
      role: formData.role,
      provider: 'email',
    });

    setIsLoading(false);
    navigate('/');
    window.location.reload();
  };

  // OAuth Handlers (kept from your original code)
  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const userInfo = await handleOAuthSignup('google', tokenResponse);
      if (userInfo) {
        saveUserSession(userInfo);
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      console.error('Google signup error:', error);
      setError('Failed to sign up with Google.');
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('Google sign-up failed.'),
  });

  // --- RENDER HELPERS ---

  const renderStepIndicator = () => (
    <div className="mb-8 flex items-center justify-center gap-2">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              step >= s ? 'bg-navy text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {s}
          </div>
          {s !== 3 && (
            <div
              className={`h-1 w-8 rounded-full mx-1 ${
                step > s ? 'bg-navy' : 'bg-slate-100'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="site-container flex min-h-[80vh] flex-col justify-center py-16">
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-3xl bg-white p-8 shadow-card transition-all duration-300">
          
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-display font-semibold text-navy">
              {step === 1 && 'Create account'}
              {step === 2 && 'Verify Phone'}
              {step === 3 && 'Complete Profile'}
            </h1>
            <p className="mt-2 text-sm text-slate">
              {step === 1 && 'Start your real estate journey today.'}
              {step === 2 && `Enter the code sent to ${formData.phone}`}
              {step === 3 && 'Tell us a bit more about yourself.'}
            </p>
          </div>

          {renderStepIndicator()}

          {/* STEP 1: CONTACT INFO */}
          {step === 1 && (
            <>
               <div className="mb-6 space-y-3">
                <button
                  onClick={() => login()}
                  className="w-full rounded-2xl border-2 border-gray-100 bg-white px-6 py-3 text-sm font-semibold text-navy shadow-sm transition hover:border-gray-200 hover:shadow-md flex items-center justify-center gap-3"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
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

              <form onSubmit={handleSendOtp} className="space-y-4">
                <label className="block space-y-2 text-sm font-semibold text-slate">
                  Email Address
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate/20 px-4 py-3 font-medium text-navy transition focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                    placeholder="name@example.com"
                  />
                </label>
                <label className="block space-y-2 text-sm font-semibold text-slate">
                  Phone Number
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate/20 px-4 py-3 font-medium text-navy transition focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                    placeholder="+91 98765 43210"
                  />
                </label>
                
                {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</div>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-navy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:bg-navy/90 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            </>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate">One-Time Password</label>
                <input
                  type="text"
                  name="otp"
                  maxLength={6}
                  autoFocus
                  required
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full text-center text-2xl tracking-widest rounded-2xl border border-slate/20 px-4 py-3 font-bold text-navy transition focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                  placeholder="1 2 3 4"
                />
                <p className="text-xs text-center text-slate">
                  Use code <strong>1234</strong> for testing
                </p>
              </div>

              {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-navy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:bg-navy/90 disabled:opacity-70"
              >
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </button>
              
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs text-slate hover:text-navy underline"
              >
                Change Phone Number
              </button>
            </form>
          )}

          {/* STEP 3: PROFILE DETAILS */}
          {step === 3 && (
            <form onSubmit={handleCompleteSignup} className="space-y-5">
              
              {/* Profile Photo Upload */}
              <div className="flex flex-col items-center gap-3">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-24 w-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-navy transition-colors relative group"
                >
                  {formData.photoPreview ? (
                    <img src={formData.photoPreview} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl text-slate-400 group-hover:text-navy">📷</span>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-indigo hover:underline"
                >
                  Upload Photo
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </div>

              <label className="block space-y-2 text-sm font-semibold text-slate">
                Full Name
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate/20 px-4 py-3 font-medium text-navy transition focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                  placeholder="John Doe"
                />
              </label>

              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate">I am a...</span>
                <div className="grid grid-cols-2 gap-3">
                  {['Buyer', 'Broker', 'Builder', 'Owner'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: role.toLowerCase() }))}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                        formData.role === role.toLowerCase()
                          ? 'border-navy bg-navy text-white shadow-md'
                          : 'border-slate/20 bg-white text-slate hover:border-navy/50'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-gradient-to-r from-navy to-indigo px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:from-navy/90 hover:to-indigo/90 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                     <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                     Creating Account...
                  </>
                ) : (
                  'Complete Signup'
                )}
              </button>
            </form>
          )}

          {step === 1 && (
            <p className="mt-6 text-center text-sm text-slate">
              Already have an account?{' '}
              <NavLink to="/login" className="font-semibold text-indigo hover:underline">
                Log in
              </NavLink>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;