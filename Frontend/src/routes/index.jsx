import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../Components/Layout/MainLayout';
import AuthLayout from '../Components/Layout/AuthLayout';
import AccountLayout from '../Components/Layout/AccountLayout';
import Security from '../Components/Pages/Security/Security';
import Wishlist from '../Components/Pages/Wishlist/Wishlist';
import Support from '../Components/Pages/Support/Support';
import User from '../Components/User';

import Services from '../Components/Pages/Services/Services';

import ProtectedRoute from '../Components/ProtectedRoute';
import Admin from '../admin/Admin';
import AdminRoute from '../admin/routes/AdminRoute';
import NotFound from '../Components/Pages/NotFound/NotFound';
import LoadingSpinner from '../Components/LoadingFallback';

// Lazy load components
const Home = lazy(() => import('../Components/Pages/Home/Home'));
const Login = lazy(() => import('../Components/authentication/Login'));
const Register = lazy(() => import('../Components/authentication/Register'));
const ForgotPassword = lazy(() => import('../Components/authentication/ForgotPassword'));
const ResetPassword = lazy(() => import('../Components/authentication/ResetPassword'));
const Orders = lazy(() => import('../Components/Pages/Orders/Orders'));
const TrackOrder = lazy(() => import('../Components/Pages/Orders/TrackOrder'));
const Checkout = lazy(() => import('../Components/Pages/Checkout/Checkout'));
const UserProfile = lazy(() => import('../Components/Pages/Profile/Profile'));
const MyReviews = lazy(() => import('../Components/Account/Reviews/Reviews'));
const EditProfile = lazy(() => import('../Components/Pages/Profile/EditProfile'));

// Service components
const Printing = lazy(() => import('../Components/Pages/Services/Printing'));
const Design = lazy(() => import('../Components/Pages/Services/Design'));
const Branding = lazy(() => import('../Components/Pages/Services/Branding'));
const Signage = lazy(() => import('../Components/Pages/Services/Signage'));
const Packaging = lazy(() => import('../Components/Pages/Services/Packaging'));

// Legal components
const PrivacyPolicy = lazy(() => import('../Components/Pages/Legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('../Components/Pages/Legal/TermsOfService'));
const Disclaimer = lazy(() => import('../Components/Pages/Legal/Disclaimer'));

// Admin components
const Dashboard = lazy(() => import('../admin/components/Dashboard'));
const Users = lazy(() => import('../admin/components/Users'));
const OrdersManagement = lazy(() => import('../admin/components/Orders'));
const ReviewsManagement = lazy(() => import('../admin/components/Reviews'));
const AdminTestimonials = lazy(() => import('../admin/components/Testimonials'));
const Books = lazy(() => import('../admin/components/Books'));
const Projects = lazy(() => import('../admin/components/Projects'));
const Settings = lazy(() => import('../admin/components/Settings'));

// Course components
const Courses = lazy(() => import('../Components/Pages/Courses/CoursesSection'));
const CourseDetail = lazy(() => import('../Components/Pages/Courses/CourseDetail'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Main User component - contains all sections */}
        <Route path="/" element={<User />} />
        
        {/* Authentication routes - wrapped in AuthLayout */}
        <Route path="/login" element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        } />
        <Route path="/register" element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        } />
        <Route path="/forgot-password" element={
          <AuthLayout>
            <ForgotPassword />
          </AuthLayout>
        } />
        <Route path="/reset-password/:token" element={
          <AuthLayout>
            <ResetPassword />
          </AuthLayout>
        } />

        {/* Service routes */}
        <Route element={<MainLayout />}>
          <Route path="/services" element={<Services />} />
          <Route path="/services/printing" element={<Printing />} />
          <Route path="/services/design" element={<Design />} />
          <Route path="/services/branding" element={<Branding />} />
          <Route path="/services/signage" element={<Signage />} />
          <Route path="/services/packaging" element={<Packaging />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
        </Route>

        {/* Legal routes */}
        <Route element={<MainLayout />}>
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } />

        {/* User account routes - wrapped in MainLayout and AccountLayout */}
        <Route element={<MainLayout />}>
          <Route path="/account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
            <Route path="profile" element={<UserProfile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="security" element={<Security />} />
            <Route path="orders" element={<Orders />} />
            <Route path="track-order/:orderId" element={<TrackOrder />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="reviews" element={<MyReviews />} />
            <Route path="support" element={<Support />} />
          </Route>
        </Route>

        {/* Checkout route */}
        <Route path="/checkout" element={<MainLayout />}>
          <Route index element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 