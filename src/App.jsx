// src/App.jsx

import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 💡 NEW: Import AuthProvider
import PrivateRoute from './components/common/PrivateRoute'; // 💡 NEW: Import PrivateRoute
import ErrorBoundary from './components/ErrorBoundary.jsx';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import BuyPage from './pages/BuyPage';
import RentPage from './pages/RentPage';
import NewLaunchPage from './pages/NewLaunchPage';
import CommercialPage from './pages/CommercialPage';
import PlotsPage from './pages/PlotsPage';
import ProjectsPage from './pages/ProjectsPage';
import PostPropertyPage from './pages/PostPropertyPage';
import ContactPage from './pages/ContactPage';
import DetailsPage from './pages/DetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ToolsPage from './pages/ToolsPage';
import EMICalculatorPage from './pages/EMICalculatorPage';
import LoanEligibilityPage from './pages/LoanEligibilityPage';
import BudgetCalculatorPage from './pages/BudgetCalculatorPage';
import AreaConverterPage from './pages/AreaConverterPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ReviewsPage from './pages/ReviewsPage';
import InsightsDetailsPage from './pages/InsightsDetailsPage';
import DeveloperDetailsPage from './pages/DeveloperDetailsPage';

// --- NEW SEPARATED PAGES ---
import PriceTrendsPage from "./pages/PriceTrendsPage";
import ArticlesPage from "./pages/ArticlesPage";
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import MediaPage from './pages/MediaPage';
import PartnerPage from './pages/PartnerPage';
import FAQsPage from './pages/FAQsPage';
import { TermsPage, CookiePolicyPage, PrivacyPolicyPage } from './pages/LegalPages';

// Utility to scroll to the top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

// --- ROUTE DEFINITION WITH PRIVATE ROUTES ---
const AppRoutes = () => (
  <Routes>
    {/* All routes are nested inside MainLayout for consistent Header/Footer */}
    <Route path="/" element={<MainLayout />}>

      {/* ----------------------------------------------------------------- */}
      {/* --- 1. PUBLIC ROUTES (No Login Required) --- */}
      {/* These routes are accessible to everyone */}
      {/* ----------------------------------------------------------------- */}
      <Route index element={<HomePage />} />
      <Route path="buy" element={<BuyPage />} />
      <Route path="rent" element={<RentPage />} />
      <Route path="new-launch" element={<NewLaunchPage />} />
      <Route path="commercial" element={<CommercialPage />} />
      <Route path="plots" element={<PlotsPage />} />
      <Route path="projects" element={<ProjectsPage />} />
      
      {/* Detail Pages */}
      <Route path="developers/:name" element={<DeveloperDetailsPage />} />
      <Route path="project/:id" element={<ProjectDetailsPage />} />
      <Route path="property/:id" element={<DetailsPage />} />

      {/* Insights / Articles */}
      <Route path="price-trends" element={<PriceTrendsPage />} />
      <Route path="articles" element={<ArticlesPage />} />
      <Route path="insights" element={<ArticlesPage />} />
      <Route path="insights/:id" element={<InsightsDetailsPage />} />
      <Route path="reviews" element={<ReviewsPage />} />

      {/* Tools */}
      <Route path="tools" element={<ToolsPage />} />
      <Route path="tools/emi" element={<EMICalculatorPage />} />
      <Route path="tools/loan-eligibility" element={<LoanEligibilityPage />} />
      <Route path="tools/budget" element={<BudgetCalculatorPage />} />
      <Route path="tools/area-converter" element={<AreaConverterPage />} />

      {/* Static/Legal/Other Pages */}
      <Route path="contact" element={<ContactPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="careers" element={<CareersPage />} />
      <Route path="media" element={<MediaPage />} />
      <Route path="partner" element={<PartnerPage />} />
      <Route path="faqs" element={<FAQsPage />} />
      <Route path="terms" element={<TermsPage />} />
      <Route path="cookie-policy" element={<CookiePolicyPage />} />
      <Route path="privacy" element={<PrivacyPolicyPage />} />

      {/* Auth Pages (Should typically be public) */}
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />

      {/* ----------------------------------------------------------------- */}
      {/* --- 2. PROTECTED ROUTES (Requires Login) --- */}
      {/* Nested routes will only render if the user is authenticated */}
      {/* ----------------------------------------------------------------- */}
      <Route element={<PrivateRoute />}>
        <Route path="profile" element={<ErrorBoundary><ProfilePage /></ErrorBoundary>} />
        <Route path="post-property" element={<PostPropertyPage />} />
        {/* You may also want to protect pages like '/account-settings' here */}
      </Route>
      
      {/* ----------------------------------------------------------------- */}
      {/* --- 3. ADMIN ROUTE (Requires Login, could be restricted by role) --- */}
      {/* For now, protected by login, but AdminPage component should check role */}
      {/* ----------------------------------------------------------------- */}
      <Route element={<PrivateRoute />}>
        <Route path="admin" element={<ErrorBoundary><AdminPage /></ErrorBoundary>} />
      </Route>

      {/* ----------------------------------------------------------------- */}
      {/* --- 4. FALLBACK --- */}
      {/* ----------------------------------------------------------------- */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

// --- MAIN APP COMPONENT ---
const App = () => (
  // AuthProvider wraps everything to provide authentication state globally
  <AuthProvider> 
    <ScrollToTop />
    <AppRoutes />
  </AuthProvider>
);

export default App;