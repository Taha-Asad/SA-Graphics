import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from '../Components/LoadingSpinner';

// Lazy load user components
const Profile = React.lazy(() => import('../pages/Profile'));
const Orders = React.lazy(() => import('../pages/Orders'));
const Settings = React.lazy(() => import('../pages/Settings'));

const UserRoutes = () => {
  // TODO: Add authentication check
  const isAuthenticated = true; // This should be replaced with actual auth check

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/orders" 
          element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/settings" 
          element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Suspense>
  );
};

export default UserRoutes; 