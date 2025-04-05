import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingFallback from '../Components/LoadingFallback';
import Security from '../Components/Pages/Security/Security';
import Profile from '../Components/Pages/Profile/Profile';
import Wishlist from '../Components/Pages/Wishlist/Wishlist';
import Reviews from '../Components/Pages/Reviews/Reviews';
import Support from '../Components/Pages/Support/Support';
import User from '../Components/User';
import About from '../Components/Pages/About/About';
import Contact from '../Components/Pages/Contact/Contact';
import Portfolio from '../Components/Pages/Portfolio/Portfolio';
import Services from '../Components/Pages/Services/Services';
import Resume from '../Components/Pages/Resume/Resume';
import Testimonials from '../Components/Pages/Testimonials/Testimonials';
import AddTestimonial from '../Components/Pages/Testimonials/AddTestimonial';
import ProtectedRoute from '../Components/ProtectedRoute';
import Admin from '../admin/Admin';
import Dashboard from '../admin/adminComponents/Dashboard';
import Users from '../admin/adminComponents/Users';
import AdminTestimonials from '../admin/adminComponents/Testimonials';
import AdminSettings from '../admin/adminComponents/Settings';
import AdminRoute from '../admin/routes/AdminRoute';
import NotFound from '../Components/Pages/NotFound/NotFound';

// Lazy load components
const Home = lazy(() => import('../Components/Pages/Home/Home'));
const Login = lazy(() => import('../Components/authentication/Login'));
const Register = lazy(() => import('../Components/authentication/Register'));
const ForgotPassword = lazy(() => import('../Components/authentication/ForgotPassword'));
const ResetPassword = lazy(() => import('../Components/authentication/ResetPassword'));
const Orders = lazy(() => import('../Components/Pages/Orders/Orders'));
const TrackOrder = lazy(() => import('../Components/Pages/Orders/TrackOrder'));
const Checkout = lazy(() => import('../Components/Pages/Checkout/Checkout'));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main routes */}
      <Route path="/" element={<User />} />
      <Route path="/about" element={<About />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/services" element={<Services />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/add-testimonial" element={<AddTestimonial />} />
      
      {/* User profile and account routes */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/track-order/:orderId" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
      <Route path="/my-reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
      
      {/* Authentication routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
      <Route path="/admin/testimonials" element={<AdminRoute><AdminTestimonials /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
      
      {/* Checkout route */}
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 