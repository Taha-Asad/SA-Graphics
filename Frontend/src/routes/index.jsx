import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingFallback from '../Components/LoadingFallback';
import MainLayout from '../Components/Layout/MainLayout';
import AuthLayout from '../Components/Layout/AuthLayout';
import AccountLayout from '../Components/Layout/AccountLayout';
import Security from '../Components/Pages/Security/Security';
import Profile from '../Components/Pages/Profile/Profile';
import Wishlist from '../Components/Pages/Wishlist/Wishlist';
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
import Admin from '../admin/components/Admin';
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

// Admin components
const Dashboard = lazy(() => import('../admin/components/Dashboard'));
const Users = lazy(() => import('../admin/components/Users'));
const OrdersManagement = lazy(() => import('../admin/components/Orders'));
const ReviewsManagement = lazy(() => import('../admin/components/Reviews'));
const AdminTestimonials = lazy(() => import('../admin/components/Testimonials'));
const Books = lazy(() => import('../admin/components/Books'));
const Projects = lazy(() => import('../admin/components/Projects'));
const Settings = lazy(() => import('../admin/components/Settings'));

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

        {/* Admin routes with nested routing */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="books" element={<Books />} />
          <Route path="projects" element={<Projects />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="reviews" element={<ReviewsManagement />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* User account routes - wrapped in MainLayout and AccountLayout */}
        <Route element={<MainLayout />}>
          <Route path="/account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
            <Route path="profile" element={<UserProfile />} />
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