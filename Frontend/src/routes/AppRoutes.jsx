import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import UserRoutes from './User';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main routes */}
      <Route path="/" element={<MainRoutes />} />
      <Route path="/about" element={<MainRoutes />} />
      <Route path="/contact" element={<MainRoutes />} />
      <Route path="/portfolio" element={<MainRoutes />} />
      <Route path="/login" element={<MainRoutes />} />
      <Route path="/register" element={<MainRoutes />} />
      
      {/* User routes */}
      <Route path="/profile" element={<UserRoutes />} />
      <Route path="/orders" element={<UserRoutes />} />
      <Route path="/track-order" element={<UserRoutes />} />
      <Route path="/reviews" element={<UserRoutes />} />
      <Route path="/security" element={<UserRoutes />} />
      <Route path="/support" element={<UserRoutes />} />
      
      {/* Catch all route */}
      <Route path="*" element={<MainRoutes />} />
    </Routes>
  );
};

export default AppRoutes; 