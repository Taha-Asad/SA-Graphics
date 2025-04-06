import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Security from '../Components/Pages/Security/Security';
import Orders from '../Components/Pages/Orders/Orders';
import Profile from '../Components/Pages/Profile/Profile';
import TrackOrder from '../Components/Pages/Orders/TrackOrder';
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
import Login from '../Components/authentication/Login';
import Register from '../Components/authentication/Register';
import ForgotPassword from '../Components/authentication/ForgotPassword';
import ResetPassword from '../Components/authentication/ResetPassword';
import ProtectedRoute from '../Components/ProtectedRoute';
import Admin from '../admin/components/Admin';
import Dashboard from '../admin/components/Dashboard';
import Users from '../admin/components/Users';
import AdminTestimonials from '../admin/components/Testimonials';
import AdminSettings from '../admin/components/Settings';
import AdminRoute from '../admin/routes/AdminRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<User />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/services" element={<Services />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/add-testimonial" element={<AddTestimonial />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/track-order" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
      <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
      <Route path="/admin/testimonials" element={<AdminRoute><AdminTestimonials /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
    </Routes>
  );
};

export default AppRoutes; 